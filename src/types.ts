export enum MoodCategory {
    ECSTATIC = 'ecstatic',
    HAPPY = 'happy',
    NEUTRAL = 'neutral',
    CONCERNED = 'concerned',
    SAD = 'sad',
    DEVASTATED = 'devastated'
}

export interface DiagnosticCount {
    errors: number;
    warnings: number;
    info: number;
}

export interface MoodScore {
    score: number;
    category: MoodCategory;
    diagnosticCount: DiagnosticCount;
    timestamp: number;
    filePath: string;
}

export interface EmojiConfig {
    category: MoodCategory;
    urls: string[];
    fallbackText: string;
    description: string;
}

export interface FileAnalysis {
    filePath: string;
    languageId: string;
    lineCount: number;
    moodScore: MoodScore;
    lastAnalyzed: number;
}

export interface MoodPanelState {
    isVisible: boolean;
    currentFile: string | null;
    currentMood: MoodScore | null;
    emojiUrl: string | null;
}