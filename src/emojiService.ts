import { MoodCategory, EmojiConfig } from './types';
import { EMOJI_CONFIGS, CACHE_TTL, MAX_CACHE_SIZE } from './constants';
import { validateEmojiConfig } from './validation';

interface CacheEntry {
    url: string;
    data: string;
    timestamp: number;
    size: number;
}

export class EmojiService {
    private cache = new Map<string, CacheEntry>();
    private currentCacheSize = 0;

    public async getEmojiUrl(category: MoodCategory): Promise<string> {
        const config = EMOJI_CONFIGS[category];
        if (!validateEmojiConfig(config)) {
            return this.getFallbackEmoji(category);
        }

        for (const url of config.urls) {
            try {
                const cachedEntry = this.getCachedEntry(url);
                if (cachedEntry) {
                    return cachedEntry.url;
                }

                const isValid = await this.validateEmojiUrl(url);
                if (isValid) {
                    await this.cacheEmojiUrl(url);
                    return url;
                }
            } catch (error) {
                continue;
            }
        }

        return this.getFallbackEmoji(category);
    }

    private async validateEmojiUrl(url: string): Promise<boolean> {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            const contentType = response.headers.get('content-type');
            return response.ok && (contentType ? contentType.startsWith('image/') : false);
        } catch {
            return false;
        }
    }

    private async cacheEmojiUrl(url: string): Promise<void> {
        try {
            const response = await fetch(url);
            if (!response.ok) return;

            const arrayBuffer = await response.arrayBuffer();
            const base64Data = Buffer.from(arrayBuffer).toString('base64');
            const contentType = response.headers.get('content-type') || 'image/png';
            const dataUrl = `data:${contentType};base64,${base64Data}`;

            const entry: CacheEntry = {
                url: dataUrl,
                data: base64Data,
                timestamp: Date.now(),
                size: base64Data.length
            };

            this.ensureCacheSpace(entry.size);
            this.cache.set(url, entry);
            this.currentCacheSize += entry.size;
        } catch (error) {
            console.warn('Failed to cache emoji:', url, error);
        }
    }

    private getCachedEntry(url: string): CacheEntry | null {
        const entry = this.cache.get(url);
        if (!entry) return null;

        const isExpired = Date.now() - entry.timestamp > CACHE_TTL;
        if (isExpired) {
            this.removeCacheEntry(url);
            return null;
        }

        return entry;
    }

    private ensureCacheSpace(requiredSize: number): void {
        while (this.currentCacheSize + requiredSize > MAX_CACHE_SIZE && this.cache.size > 0) {
            const oldestEntry = this.findOldestCacheEntry();
            if (oldestEntry) {
                this.removeCacheEntry(oldestEntry);
            } else {
                break;
            }
        }
    }

    private findOldestCacheEntry(): string | null {
        let oldestUrl: string | null = null;
        let oldestTimestamp = Date.now();

        for (const [url, entry] of this.cache.entries()) {
            if (entry.timestamp < oldestTimestamp) {
                oldestTimestamp = entry.timestamp;
                oldestUrl = url;
            }
        }

        return oldestUrl;
    }

    private removeCacheEntry(url: string): void {
        const entry = this.cache.get(url);
        if (entry) {
            this.currentCacheSize -= entry.size;
            this.cache.delete(url);
        }
    }

    private getFallbackEmoji(category: MoodCategory): string {
        const config = EMOJI_CONFIGS[category];
        return config?.fallbackText || '😐';
    }

    public getEmojiDescription(category: MoodCategory): string {
        const config = EMOJI_CONFIGS[category];
        return config?.description || 'Code analysis';
    }

    public clearCache(): void {
        this.cache.clear();
        this.currentCacheSize = 0;
    }

    public getCacheStats(): { size: number; entries: number; maxSize: number } {
        return {
            size: this.currentCacheSize,
            entries: this.cache.size,
            maxSize: MAX_CACHE_SIZE
        };
    }

    public preloadEmojis(): Promise<void[]> {
        const preloadPromises: Promise<void>[] = [];

        for (const category of Object.values(MoodCategory)) {
            const config = EMOJI_CONFIGS[category];
            if (config && config.urls.length > 0) {
                const promise = this.cacheEmojiUrl(config.urls[0]).catch(() => {});
                preloadPromises.push(promise);
            }
        }

        return Promise.all(preloadPromises);
    }

    public async getRandomEmojiForCategory(category: MoodCategory): Promise<string> {
        const config = EMOJI_CONFIGS[category];
        if (!config || config.urls.length === 0) {
            return this.getFallbackEmoji(category);
        }

        const randomIndex = Math.floor(Math.random() * config.urls.length);
        const randomUrl = config.urls[randomIndex];

        try {
            const cachedEntry = this.getCachedEntry(randomUrl);
            if (cachedEntry) {
                return cachedEntry.url;
            }

            const isValid = await this.validateEmojiUrl(randomUrl);
            if (isValid) {
                await this.cacheEmojiUrl(randomUrl);
                const newCachedEntry = this.getCachedEntry(randomUrl);
                return newCachedEntry?.url || randomUrl;
            }
        } catch {
            // Fall through to fallback
        }

        return this.getFallbackEmoji(category);
    }
}