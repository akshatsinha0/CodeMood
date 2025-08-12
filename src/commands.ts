import * as vscode from 'vscode';
import { MoodPanel } from './moodPanel';

export class CommandHandler {
    private moodPanel: MoodPanel;

    constructor(context: vscode.ExtensionContext, moodPanel: MoodPanel) {
        this.moodPanel = moodPanel;
        this.registerCommands(context);
    }

    private registerCommands(context: vscode.ExtensionContext): void {
        const showCommand = vscode.commands.registerCommand('codemood.showMoodPanel', async () => {
            try {
                await this.showMoodPanel();
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to show CodeMood panel: ${error}`);
            }
        });

        const hideCommand = vscode.commands.registerCommand('codemood.hideMoodPanel', () => {
            try {
                this.hideMoodPanel();
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to hide CodeMood panel: ${error}`);
            }
        });

        const toggleCommand = vscode.commands.registerCommand('codemood.toggleMoodPanel', async () => {
            try {
                if (this.moodPanel.isVisible()) {
                    this.hideMoodPanel();
                } else {
                    await this.showMoodPanel();
                }
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to toggle CodeMood panel: ${error}`);
            }
        });

        const refreshCommand = vscode.commands.registerCommand('codemood.refreshMood', async () => {
            try {
                await this.refreshCurrentMood();
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to refresh mood: ${error}`);
            }
        });

        context.subscriptions.push(showCommand, hideCommand, toggleCommand, refreshCommand);
    }

    private async showMoodPanel(): Promise<void> {
        await this.moodPanel.show();
        vscode.window.showInformationMessage('CodeMood panel is now visible');
    }

    private hideMoodPanel(): void {
        this.moodPanel.hide();
        vscode.window.showInformationMessage('CodeMood panel hidden');
    }

    private async refreshCurrentMood(): Promise<void> {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showWarningMessage('No active file to analyze');
            return;
        }

        vscode.window.showInformationMessage('Refreshing code mood analysis...');
    }

    public static getCommandContributions(): any[] {
        return [
            {
                command: 'codemood.showMoodPanel',
                title: 'CodeMood: Show Mood Panel',
                category: 'CodeMood'
            },
            {
                command: 'codemood.hideMoodPanel',
                title: 'CodeMood: Hide Mood Panel',
                category: 'CodeMood'
            },
            {
                command: 'codemood.toggleMoodPanel',
                title: 'CodeMood: Toggle Mood Panel',
                category: 'CodeMood'
            },
            {
                command: 'codemood.refreshMood',
                title: 'CodeMood: Refresh Current Mood',
                category: 'CodeMood'
            }
        ];
    }

    public static getKeybindingContributions(): any[] {
        return [
            {
                command: 'codemood.toggleMoodPanel',
                key: 'ctrl+shift+m',
                mac: 'cmd+shift+m',
                when: 'editorTextFocus'
            }
        ];
    }
}