export enum MoodCategory {
    EUPHORIC = 'euphoric',
    ECSTATIC = 'ecstatic',
    PROUD = 'proud',
    HAPPY = 'happy',
    CONTENT = 'content',
    NEUTRAL = 'neutral',
    THOUGHTFUL = 'thoughtful',
    CONCERNED = 'concerned',
    ANXIOUS = 'anxious',
    SAD = 'sad',
    FRUSTRATED = 'frustrated',
    DEVASTATED = 'devastated',
    PANICKED = 'panicked'
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