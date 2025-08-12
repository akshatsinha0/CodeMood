import * as vscode from 'vscode';
import { SUPPORTED_LANGUAGES } from './constants';

export interface LanguageConfig {
    id: string;
    displayName: string;
    fileExtensions: string[];
    diagnosticWeight: number;
    qualityBonus: number;
}

export class LanguageSupport {
    private static readonly LANGUAGE_CONFIGS: Record<string, LanguageConfig> = {
        javascript: {
            id: 'javascript',
            displayName: 'JavaScript',
            fileExtensions: ['.js', '.mjs', '.cjs'],
            diagnosticWeight: 1.0,
            qualityBonus: 2
        },
        typescript: {
            id: 'typescript',
            displayName: 'TypeScript',
            fileExtensions: ['.ts', '.mts', '.cts'],
            diagnosticWeight: 0.9,
            qualityBonus: 3
        },
        javascriptreact: {
            id: 'javascriptreact',
            displayName: 'JavaScript React',
            fileExtensions: ['.jsx'],
            diagnosticWeight: 1.1,
            qualityBonus: 2
        },
        typescriptreact: {
            id: 'typescriptreact',
            displayName: 'TypeScript React',
            fileExtensions: ['.tsx'],
            diagnosticWeight: 1.0,
            qualityBonus: 3
        },
        python: {
            id: 'python',
            displayName: 'Python',
            fileExtensions: ['.py', '.pyw', '.pyi'],
            diagnosticWeight: 0.8,
            qualityBonus: 2
        },
        java: {
            id: 'java',
            displayName: 'Java',
            fileExtensions: ['.java'],
            diagnosticWeight: 0.7,
            qualityBonus: 2
        },
        csharp: {
            id: 'csharp',
            displayName: 'C#',
            fileExtensions: ['.cs', '.csx'],
            diagnosticWeight: 0.8,
            qualityBonus: 2
        },
        cpp: {
            id: 'cpp',
            displayName: 'C++',
            fileExtensions: ['.cpp', '.cxx', '.cc', '.hpp', '.hxx', '.hh'],
            diagnosticWeight: 1.2,
            qualityBonus: 1
        },
        c: {
            id: 'c',
            displayName: 'C',
            fileExtensions: ['.c', '.h'],
            diagnosticWeight: 1.3,
            qualityBonus: 1
        },
        go: {
            id: 'go',
            displayName: 'Go',
            fileExtensions: ['.go'],
            diagnosticWeight: 0.6,
            qualityBonus: 3
        },
        rust: {
            id: 'rust',
            displayName: 'Rust',
            fileExtensions: ['.rs'],
            diagnosticWeight: 0.5,
            qualityBonus: 3
        },
        php: {
            id: 'php',
            displayName: 'PHP',
            fileExtensions: ['.php', '.phtml', '.php3', '.php4', '.php5'],
            diagnosticWeight: 1.1,
            qualityBonus: 1
        },
        ruby: {
            id: 'ruby',
            displayName: 'Ruby',
            fileExtensions: ['.rb', '.rbw'],
            diagnosticWeight: 0.9,
            qualityBonus: 2
        },
        swift: {
            id: 'swift',
            displayName: 'Swift',
            fileExtensions: ['.swift'],
            diagnosticWeight: 0.8,
            qualityBonus: 2
        },
        kotlin: {
            id: 'kotlin',
            displayName: 'Kotlin',
            fileExtensions: ['.kt', '.kts'],
            diagnosticWeight: 0.8,
            qualityBonus: 2
        },
        yaml: {
            id: 'yaml',
            displayName: 'YAML',
            fileExtensions: ['.yaml', '.yml'],
            diagnosticWeight: 0.9,
            qualityBonus: 2
        },
        yml: {
            id: 'yml',
            displayName: 'YAML',
            fileExtensions: ['.yml', '.yaml'],
            diagnosticWeight: 0.9,
            qualityBonus: 2
        }
    };

    public static isSupported(languageId: string): boolean {
        return SUPPORTED_LANGUAGES.includes(languageId as any);
    }

    public static getLanguageConfig(languageId: string): LanguageConfig | null {
        return this.LANGUAGE_CONFIGS[languageId] || null;
    }

    public static detectLanguageFromFile(document: vscode.TextDocument): LanguageConfig | null {
        const config = this.getLanguageConfig(document.languageId);
        if (config) {
            return config;
        }

        const fileName = document.fileName.toLowerCase();
        for (const [langId, langConfig] of Object.entries(this.LANGUAGE_CONFIGS)) {
            if (langConfig.fileExtensions.some(ext => fileName.endsWith(ext))) {
                return langConfig;
            }
        }

        return null;
    }

    public static getSupportedLanguages(): LanguageConfig[] {
        return Object.values(this.LANGUAGE_CONFIGS);
    }

    public static getLanguageDisplayName(languageId: string): string {
        const config = this.getLanguageConfig(languageId);
        return config?.displayName || languageId;
    }

    public static getDiagnosticWeight(languageId: string): number {
        const config = this.getLanguageConfig(languageId);
        return config?.diagnosticWeight || 1.0;
    }

    public static getQualityBonus(languageId: string): number {
        const config = this.getLanguageConfig(languageId);
        return config?.qualityBonus || 1;
    }

    public static isWebTechnology(languageId: string): boolean {
        return ['javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'html', 'css', 'scss', 'less'].includes(languageId);
    }

    public static isSystemLanguage(languageId: string): boolean {
        return ['c', 'cpp', 'rust', 'go', 'zig'].includes(languageId);
    }

    public static isScriptingLanguage(languageId: string): boolean {
        return ['python', 'ruby', 'php', 'perl', 'bash', 'powershell'].includes(languageId);
    }

    public static isConfigurationLanguage(languageId: string): boolean {
        return ['yaml', 'yml', 'json', 'toml', 'ini', 'xml'].includes(languageId);
    }

    public static getLanguageCategory(languageId: string): 'web' | 'system' | 'scripting' | 'application' | 'configuration' | 'other' {
        if (this.isWebTechnology(languageId)) return 'web';
        if (this.isSystemLanguage(languageId)) return 'system';
        if (this.isScriptingLanguage(languageId)) return 'scripting';
        if (this.isConfigurationLanguage(languageId)) return 'configuration';
        if (['java', 'csharp', 'kotlin', 'swift'].includes(languageId)) return 'application';
        return 'other';
    }

    public static getRecommendedPractices(languageId: string): string[] {
        const config = this.getLanguageConfig(languageId);
        if (!config) return [];

        const practices: Record<string, string[]> = {
            typescript: ['Use strict type checking', 'Enable all compiler checks', 'Use interfaces over types when possible'],
            javascript: ['Use ESLint', 'Prefer const over let', 'Use modern ES6+ features'],
            python: ['Follow PEP 8', 'Use type hints', 'Write docstrings'],
            java: ['Follow naming conventions', 'Use proper exception handling', 'Write unit tests'],
            rust: ['Handle all Result types', 'Use clippy for linting', 'Follow ownership principles'],
            go: ['Use gofmt', 'Handle all errors', 'Write clear documentation'],
            csharp: ['Use nullable reference types', 'Follow naming conventions', 'Use async/await properly'],
            yaml: ['Use consistent indentation', 'Validate syntax regularly', 'Keep structure simple and readable', 'Use meaningful key names'],
            yml: ['Use consistent indentation', 'Validate syntax regularly', 'Keep structure simple and readable', 'Use meaningful key names']
        };

        return practices[languageId] || ['Follow language best practices', 'Write clean, readable code', 'Add appropriate comments'];
    }
}