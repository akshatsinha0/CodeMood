import { MoodCategory, EmojiConfig } from './types';

export const MOOD_THRESHOLDS = {
    ECSTATIC: 90,
    HAPPY: 70,
    NEUTRAL: 50,
    CONCERNED: 30,
    SAD: 10,
    DEVASTATED: 0
} as const;

export const DIAGNOSTIC_WEIGHTS = {
    ERROR: -15,
    WARNING: -5,
    INFO: -1,
    BASE_SCORE: 100
} as const;

export const EMOJI_CONFIGS: Record<MoodCategory, EmojiConfig> = {
    [MoodCategory.ECSTATIC]: {
        category: MoodCategory.ECSTATIC,
        urls: [
            'https://twemoji.maxcdn.com/v/latest/72x72/1f929.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f60d.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f973.png'
        ],
        fallbackText: '🤩',
        description: 'Perfect code quality'
    },
    [MoodCategory.HAPPY]: {
        category: MoodCategory.HAPPY,
        urls: [
            'https://twemoji.maxcdn.com/v/latest/72x72/1f60a.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f604.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f642.png'
        ],
        fallbackText: '😊',
        description: 'Good code quality'
    },
    [MoodCategory.NEUTRAL]: {
        category: MoodCategory.NEUTRAL,
        urls: [
            'https://twemoji.maxcdn.com/v/latest/72x72/1f610.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f914.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f611.png'
        ],
        fallbackText: '😐',
        description: 'Average code quality'
    },
    [MoodCategory.CONCERNED]: {
        category: MoodCategory.CONCERNED,
        urls: [
            'https://twemoji.maxcdn.com/v/latest/72x72/1f61f.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f615.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f928.png'
        ],
        fallbackText: '😟',
        description: 'Some issues detected'
    },
    [MoodCategory.SAD]: {
        category: MoodCategory.SAD,
        urls: [
            'https://twemoji.maxcdn.com/v/latest/72x72/1f622.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f61e.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f614.png'
        ],
        fallbackText: '😢',
        description: 'Many issues detected'
    },
    [MoodCategory.DEVASTATED]: {
        category: MoodCategory.DEVASTATED,
        urls: [
            'https://twemoji.maxcdn.com/v/latest/72x72/1f62d.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f631.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f480.png'
        ],
        fallbackText: '😭',
        description: 'Critical issues detected'
    }
};

export const SUPPORTED_LANGUAGES = [
    'javascript',
    'typescript',
    'javascriptreact',
    'typescriptreact',
    'python',
    'java',
    'csharp',
    'cpp',
    'c',
    'go',
    'rust',
    'php',
    'ruby',
    'swift',
    'kotlin'
] as const;

export const DEBOUNCE_DELAY = 500;
export const CACHE_TTL = 24 * 60 * 60 * 1000;
export const MAX_CACHE_SIZE = 50 * 1024 * 1024;