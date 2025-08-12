import * as vscode from 'vscode';
import { MoodScore, MoodCategory, MoodPanelState } from './types';
import { EmojiService } from './emojiService';
import { MoodCalculator } from './moodCalculator';

export class MoodPanel {
    private panel: vscode.WebviewPanel | null = null;
    private emojiService: EmojiService;
    private moodCalculator: MoodCalculator;
    private state: MoodPanelState;
    private disposables: vscode.Disposable[] = [];

    constructor(private context: vscode.ExtensionContext) {
        this.emojiService = new EmojiService();
        this.moodCalculator = new MoodCalculator();
        this.state = {
            isVisible: false,
            currentFile: null,
            currentMood: null,
            emojiUrl: null
        };
    }

    public async show(): Promise<void> {
        if (this.panel) {
            this.panel.reveal();
            return;
        }

        this.panel = vscode.window.createWebviewPanel(
            'codeMoodPanel',
            'CodeMood',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: []
            }
        );

        this.panel.iconPath = {
            light: vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'light', 'mood.svg'),
            dark: vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'dark', 'mood.svg')
        };

        this.panel.onDidDispose(() => {
            this.panel = null;
            this.state.isVisible = false;
        }, null, this.disposables);

        this.state.isVisible = true;
        await this.updateContent();
    }

    public hide(): void {
        if (this.panel) {
            this.panel.dispose();
            this.panel = null;
            this.state.isVisible = false;
        }
    }

    public async updateMood(moodScore: MoodScore): Promise<void> {
        this.state.currentMood = moodScore;
        this.state.currentFile = moodScore.filePath;
        this.state.emojiUrl = await this.emojiService.getRandomEmojiForCategory(moodScore.category);
        
        if (this.panel) {
            await this.updateContent();
        }
    }

    private async updateContent(): Promise<void> {
        if (!this.panel) return;

        const html = await this.generateHtml();
        this.panel.webview.html = html;
    }

    private async generateHtml(): Promise<string> {
        const { currentMood, currentFile, emojiUrl } = this.state;
        
        if (!currentMood) {
            return this.getWelcomeHtml();
        }

        const fileName = currentFile ? currentFile.split(/[/\\]/).pop() || 'Unknown' : 'Unknown';
        const description = this.moodCalculator.getMoodDescription(currentMood.category);
        const emojiDisplay = emojiUrl || this.emojiService.getEmojiDescription(currentMood.category);
        
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeMood</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            margin: 0;
            padding: 20px;
            text-align: center;
        }
        .mood-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            max-width: 300px;
            margin: 0 auto;
        }
        .emoji-display {
            font-size: 80px;
            line-height: 1;
            margin: 20px 0;
        }
        .emoji-image {
            width: 80px;
            height: 80px;
            object-fit: contain;
        }
        .mood-score {
            font-size: 24px;
            font-weight: bold;
            color: ${this.getScoreColor(currentMood.score)};
        }
        .mood-category {
            font-size: 18px;
            text-transform: capitalize;
            color: var(--vscode-textLink-foreground);
        }
        .mood-description {
            font-size: 14px;
            color: var(--vscode-descriptionForeground);
            text-align: center;
            line-height: 1.4;
            margin: 10px 0;
        }
        .file-info {
            font-size: 12px;
            color: var(--vscode-textPreformat-foreground);
            background-color: var(--vscode-textBlockQuote-background);
            padding: 8px 12px;
            border-radius: 4px;
            border-left: 3px solid var(--vscode-textLink-foreground);
        }
        .diagnostics-info {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin: 15px 0;
            font-size: 12px;
        }
        .diagnostic-item {
            padding: 8px;
            border-radius: 4px;
            background-color: var(--vscode-badge-background);
        }
        .errors { color: var(--vscode-errorForeground); }
        .warnings { color: var(--vscode-warningForeground); }
        .info { color: var(--vscode-infoForeground); }
        .timestamp {
            font-size: 10px;
            color: var(--vscode-descriptionForeground);
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="mood-container">
        <div class="file-info">📁 ${fileName}</div>
        
        <div class="emoji-display">
            ${emojiUrl && emojiUrl.startsWith('data:') 
                ? `<img src="${emojiUrl}" alt="${currentMood.category}" class="emoji-image" />`
                : emojiDisplay
            }
        </div>
        
        <div class="mood-score">${currentMood.score}/100</div>
        <div class="mood-category">${currentMood.category}</div>
        <div class="mood-description">${description}</div>
        
        <div class="diagnostics-info">
            <div class="diagnostic-item errors">
                <div>❌ Errors</div>
                <div>${currentMood.diagnosticCount.errors}</div>
            </div>
            <div class="diagnostic-item warnings">
                <div>⚠️ Warnings</div>
                <div>${currentMood.diagnosticCount.warnings}</div>
            </div>
            <div class="diagnostic-item info">
                <div>ℹ️ Info</div>
                <div>${currentMood.diagnosticCount.info}</div>
            </div>
        </div>
        
        <div class="timestamp">
            Last updated: ${new Date(currentMood.timestamp).toLocaleTimeString()}
        </div>
    </div>
</body>
</html>`;
    }

    private getWelcomeHtml(): string {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeMood</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            margin: 0;
            padding: 20px;
            text-align: center;
        }
        .welcome-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            max-width: 300px;
            margin: 50px auto;
        }
        .welcome-emoji {
            font-size: 60px;
            margin: 20px 0;
        }
        .welcome-title {
            font-size: 24px;
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
        }
        .welcome-message {
            font-size: 14px;
            color: var(--vscode-descriptionForeground);
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="welcome-container">
        <div class="welcome-emoji">🎭</div>
        <div class="welcome-title">Welcome to CodeMood!</div>
        <div class="welcome-message">
            Open a supported file to see your code's mood.<br>
            I'll analyze errors, warnings, and code quality to show you how your code is feeling.
        </div>
    </div>
</body>
</html>`;
    }

    private getScoreColor(score: number): string {
        if (score >= 90) return '#4CAF50';
        if (score >= 70) return '#8BC34A';
        if (score >= 50) return '#FFC107';
        if (score >= 30) return '#FF9800';
        if (score >= 10) return '#FF5722';
        return '#F44336';
    }

    public isVisible(): boolean {
        return this.state.isVisible && this.panel !== null;
    }

    public dispose(): void {
        this.hide();
        this.disposables.forEach(d => d.dispose());
        this.disposables = [];
    }
}