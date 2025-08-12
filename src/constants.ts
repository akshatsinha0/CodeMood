import { MoodCategory, EmojiConfig } from './types';

export const MOOD_THRESHOLDS = {
    EUPHORIC: 98,
    ECSTATIC: 90,
    PROUD: 80,
    HAPPY: 70,
    CONTENT: 60,
    NEUTRAL: 50,
    THOUGHTFUL: 40,
    CONCERNED: 30,
    ANXIOUS: 20,
    SAD: 15,
    FRUSTRATED: 10,
    DEVASTATED: 5,
    PANICKED: 0
} as const;

export const DIAGNOSTIC_WEIGHTS = {
    ERROR: -15,
    WARNING: -5,
    INFO: -1,
    BASE_SCORE: 100
} as const;

export const EMOJI_CONFIGS: Record<MoodCategory, EmojiConfig> = {
    [MoodCategory.EUPHORIC]: {
        category: MoodCategory.EUPHORIC,
        urls: [
            'https://twemoji.maxcdn.com/v/latest/72x72/1f60d.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f970.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f929.png'
        ],
        fallbackText: '😍',
        description: 'Absolutely flawless code - a masterpiece!'
    },
    [MoodCategory.ECSTATIC]: {
        category: MoodCategory.ECSTATIC,
        urls: [
            'https://twemoji.maxcdn.com/v/latest/72x72/1f973.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f389.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f38a.png'
        ],
        fallbackText: '🥳',
        description: 'Exceptional code quality - celebration time!'
    },
    [MoodCategory.PROUD]: {
        category: MoodCategory.PROUD,
        urls: [
            'https://twemoji.maxcdn.com/v/latest/72x72/1f60c.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f60f.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f44d.png'
        ],
        fallbackText: '😌',
        description: 'Really solid code - you should be proud'
    },
    [MoodCategory.HAPPY]: {
        category: MoodCategory.HAPPY,
        urls: [
            'https://twemoji.maxcdn.com/v/latest/72x72/1f60a.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f604.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f642.png'
        ],
        fallbackText: '😊',
        description: 'Good code quality - things are going well'
    },
    [MoodCategory.CONTENT]: {
        category: MoodCategory.CONTENT,
        urls: [
            'https://twemoji.maxcdn.com/v/latest/72x72/1f60c.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f60a.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/263a.png'
        ],
        fallbackText: '😌',
        description: 'Decent code with minor room for improvement'
    },
    [MoodCategory.NEUTRAL]: {
        category: MoodCategory.NEUTRAL,
        urls: [
            'https://twemoji.maxcdn.com/v/latest/72x72/1f610.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f611.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f636.png'
        ],
        fallbackText: '😐',
        description: 'Average code quality - could use some attention'
    },
    [MoodCategory.THOUGHTFUL]: {
        category: MoodCategory.THOUGHTFUL,
        urls: [
            'https://twemoji.maxcdn.com/v/latest/72x72/1f914.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f9d0.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f�d.png'
        ],
        fallbackText: '🤔',
        description: 'Code needs some thinking and refactoring'
    },
    [MoodCategory.CONCERNED]: {
        category: MoodCategory.CONCERNED,
        urls: [
            'https://twemoji.maxcdn.com/v/latest/72x72/1f61f.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f615.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f928.png'
        ],
        fallbackText: '😟',
        description: 'Several issues detected - needs attention'
    },
    [MoodCategory.ANXIOUS]: {
        category: MoodCategory.ANXIOUS,
        urls: [
            'https://twemoji.maxcdn.com/v/latest/72x72/1f630.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f625.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f613.png'
        ],
        fallbackText: '😰',
        description: 'Multiple problems causing anxiety - time to debug'
    },
    [MoodCategory.SAD]: {
        category: MoodCategory.SAD,
        urls: [
            'https://twemoji.maxcdn.com/v/latest/72x72/1f622.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f61e.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f614.png'
        ],
        fallbackText: '😢',
        description: 'Many issues detected - code needs serious help'
    },
    [MoodCategory.FRUSTRATED]: {
        category: MoodCategory.FRUSTRATED,
        urls: [
            'https://twemoji.maxcdn.com/v/latest/72x72/1f624.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f621.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f92c.png'
        ],
        fallbackText: '😤',
        description: 'Frustrating errors everywhere - deep debugging needed'
    },
    [MoodCategory.DEVASTATED]: {
        category: MoodCategory.DEVASTATED,
        urls: [
            'https://twemoji.maxcdn.com/v/latest/72x72/1f62d.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f631.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f635.png'
        ],
        fallbackText: '😭',
        description: 'Critical issues everywhere - major refactoring required'
    },
    [MoodCategory.PANICKED]: {
        category: MoodCategory.PANICKED,
        urls: [
            'https://twemoji.maxcdn.com/v/latest/72x72/1f631.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f480.png',
            'https://twemoji.maxcdn.com/v/latest/72x72/1f92f.png'
        ],
        fallbackText: '😱',
        description: 'Code is in complete chaos - emergency intervention needed!'
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