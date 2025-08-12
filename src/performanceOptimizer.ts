import { MoodScore } from './types';

export class PerformanceOptimizer {
    private moodCache = new Map<string, MoodScore>();
    private lastAnalysisTime = new Map<string, number>();
    private debounceTimers = new Map<string, NodeJS.Timeout>();
    private readonly CACHE_DURATION = 30000;
    private readonly MIN_ANALYSIS_INTERVAL = 1000;

    public shouldAnalyzeFile(filePath: string, currentContent: string): boolean {
        const lastAnalysis = this.lastAnalysisTime.get(filePath);
        const now = Date.now();
        
        if (!lastAnalysis) {
            return true;
        }

        if (now - lastAnalysis < this.MIN_ANALYSIS_INTERVAL) {
            return false;
        }

        const cachedMood = this.moodCache.get(filePath);
        if (cachedMood && now - cachedMood.timestamp < this.CACHE_DURATION) {
            return false;
        }

        return true;
    }

    public cacheMoodScore(filePath: string, moodScore: MoodScore): void {
        this.moodCache.set(filePath, moodScore);
        this.lastAnalysisTime.set(filePath, Date.now());
    }

    public getCachedMoodScore(filePath: string): MoodScore | null {
        const cached = this.moodCache.get(filePath);
        if (!cached) return null;

        const now = Date.now();
        if (now - cached.timestamp > this.CACHE_DURATION) {
            this.moodCache.delete(filePath);
            return null;
        }

        return cached;
    }

    public debounceAnalysis(filePath: string, callback: () => void, delay: number = 500): void {
        const existingTimer = this.debounceTimers.get(filePath);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }

        const timer = setTimeout(() => {
            callback();
            this.debounceTimers.delete(filePath);
        }, delay);

        this.debounceTimers.set(filePath, timer);
    }

    public clearFileCache(filePath: string): void {
        this.moodCache.delete(filePath);
        this.lastAnalysisTime.delete(filePath);
        
        const timer = this.debounceTimers.get(filePath);
        if (timer) {
            clearTimeout(timer);
            this.debounceTimers.delete(filePath);
        }
    }

    public clearAllCaches(): void {
        this.moodCache.clear();
        this.lastAnalysisTime.clear();
        
        for (const timer of this.debounceTimers.values()) {
            clearTimeout(timer);
        }
        this.debounceTimers.clear();
    }

    public getCacheStats(): { size: number; oldestEntry: number | null; newestEntry: number | null } {
        let oldestEntry: number | null = null;
        let newestEntry: number | null = null;

        for (const moodScore of this.moodCache.values()) {
            if (oldestEntry === null || moodScore.timestamp < oldestEntry) {
                oldestEntry = moodScore.timestamp;
            }
            if (newestEntry === null || moodScore.timestamp > newestEntry) {
                newestEntry = moodScore.timestamp;
            }
        }

        return {
            size: this.moodCache.size,
            oldestEntry,
            newestEntry
        };
    }

    public cleanupExpiredEntries(): number {
        const now = Date.now();
        let cleanedCount = 0;

        for (const [filePath, moodScore] of this.moodCache.entries()) {
            if (now - moodScore.timestamp > this.CACHE_DURATION) {
                this.moodCache.delete(filePath);
                this.lastAnalysisTime.delete(filePath);
                cleanedCount++;
            }
        }

        return cleanedCount;
    }

    public isAnalysisInProgress(filePath: string): boolean {
        return this.debounceTimers.has(filePath);
    }

    public getMemoryUsage(): { cacheSize: number; timerCount: number; estimatedMemoryKB: number } {
        const cacheSize = this.moodCache.size;
        const timerCount = this.debounceTimers.size;
        
        const estimatedMemoryKB = Math.round(
            (cacheSize * 0.5) + 
            (timerCount * 0.1) + 
            (this.lastAnalysisTime.size * 0.05)
        );

        return {
            cacheSize,
            timerCount,
            estimatedMemoryKB
        };
    }
}