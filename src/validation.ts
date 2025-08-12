import { MoodScore, MoodCategory, DiagnosticCount, EmojiConfig } from './types';

export function isValidMoodScore(score: number): boolean {
    return typeof score === 'number' && score >= 0 && score <= 100 && !isNaN(score);
}

export function isValidMoodCategory(category: string): category is MoodCategory {
    return Object.values(MoodCategory).includes(category as MoodCategory);
}

export function validateDiagnosticCount(count: DiagnosticCount): boolean {
    return typeof count.errors === 'number' && count.errors >= 0 &&
           typeof count.warnings === 'number' && count.warnings >= 0 &&
           typeof count.info === 'number' && count.info >= 0;
}

export function validateMoodScore(moodScore: MoodScore): boolean {
    return isValidMoodScore(moodScore.score) &&
           isValidMoodCategory(moodScore.category) &&
           validateDiagnosticCount(moodScore.diagnosticCount) &&
           typeof moodScore.timestamp === 'number' &&
           typeof moodScore.filePath === 'string' &&
           moodScore.filePath.length > 0;
}

export function validateEmojiConfig(config: EmojiConfig): boolean {
    return isValidMoodCategory(config.category) &&
           Array.isArray(config.urls) &&
           config.urls.length > 0 &&
           config.urls.every(url => typeof url === 'string' && url.length > 0) &&
           typeof config.fallbackText === 'string' &&
           typeof config.description === 'string';
}

export function sanitizeFilePath(filePath: string): string {
    return filePath.replace(/[<>:"|?*]/g, '').trim();
}

export function clampScore(score: number): number {
    return Math.max(0, Math.min(100, score));
}