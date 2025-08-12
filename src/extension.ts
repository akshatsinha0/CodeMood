// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { DiagnosticMonitor } from './diagnosticMonitor';
import { MoodCalculator } from './moodCalculator';
import { EmojiService } from './emojiService';
import { MoodPanel } from './moodPanel';
import { CommandHandler } from './commands';
import { PerformanceOptimizer } from './performanceOptimizer';
import { ErrorHandler, ErrorSeverity } from './errorHandler';

let diagnosticMonitor: DiagnosticMonitor | null = null;
let moodCalculator: MoodCalculator | null = null;
let emojiService: EmojiService | null = null;
let moodPanel: MoodPanel | null = null;
let commandHandler: CommandHandler | null = null;
let performanceOptimizer: PerformanceOptimizer | null = null;
let errorHandler: ErrorHandler | null = null;

export async function activate(context: vscode.ExtensionContext) {
    console.log('CodeMood extension is activating...');

    try {
        errorHandler = ErrorHandler.getInstance();
        performanceOptimizer = new PerformanceOptimizer();
        moodCalculator = new MoodCalculator();
        emojiService = new EmojiService();
        moodPanel = new MoodPanel(context);
        commandHandler = new CommandHandler(context, moodPanel);
        diagnosticMonitor = new DiagnosticMonitor();

        setupDiagnosticListener();
        await preloadResources();
        setupActiveEditorListener();
        setupPerformanceCleanup();

        console.log('CodeMood extension activated successfully!');
        
        if (vscode.window.activeTextEditor) {
            await analyzeCurrentFile();
        }

    } catch (error) {
        const errorContext = {
            operation: 'extension_activation',
            timestamp: Date.now(),
            severity: ErrorSeverity.CRITICAL
        };
        
        if (errorHandler) {
            errorHandler.handleError(error as Error, errorContext);
        } else {
            console.error('Failed to activate CodeMood extension:', error);
            vscode.window.showErrorMessage(`CodeMood activation failed: ${error}`);
        }
    }
}

function setupDiagnosticListener(): void {
    if (!diagnosticMonitor || !moodCalculator || !moodPanel || !performanceOptimizer) return;

    diagnosticMonitor.onDiagnosticsChanged(async (uri, diagnostics) => {
        try {
            const textDocument = vscode.workspace.textDocuments.find(doc => doc.uri.toString() === uri.toString());
            if (!textDocument || !diagnosticMonitor!.isSupportedFile(textDocument)) {
                return;
            }

            const filePath = textDocument.uri.fsPath;
            
            performanceOptimizer!.debounceAnalysis(filePath, async () => {
                await errorHandler!.safeAsyncOperation(
                    async () => {
                        if (!performanceOptimizer!.shouldAnalyzeFile(filePath, textDocument.getText())) {
                            const cached = performanceOptimizer!.getCachedMoodScore(filePath);
                            if (cached && moodPanel!.isVisible()) {
                                await moodPanel!.updateMood(cached);
                            }
                            return;
                        }

                        const diagnosticCount = diagnosticMonitor!.extractDiagnosticCount(diagnostics);
                        const moodScore = moodCalculator!.calculateMoodScore(
                            diagnosticCount,
                            filePath,
                            textDocument.lineCount,
                            textDocument.languageId
                        );

                        performanceOptimizer!.cacheMoodScore(filePath, moodScore);

                        if (moodPanel!.isVisible()) {
                            await moodPanel!.updateMood(moodScore);
                        }
                    },
                    undefined,
                    {
                        operation: 'diagnostic_analysis',
                        filePath,
                        languageId: textDocument.languageId,
                        timestamp: Date.now(),
                        severity: ErrorSeverity.MEDIUM
                    }
                );
            });
        } catch (error) {
            errorHandler!.handleError(error as Error, {
                operation: 'diagnostic_listener',
                filePath: uri.fsPath,
                timestamp: Date.now(),
                severity: ErrorSeverity.MEDIUM
            });
        }
    });
}

function setupActiveEditorListener(): void {
    const editorChangeListener = vscode.window.onDidChangeActiveTextEditor(async (editor) => {
        if (editor && diagnosticMonitor?.isSupportedFile(editor.document)) {
            await analyzeCurrentFile();
        }
    });

    if (moodPanel) {
        const context = (moodPanel as any).context;
        context.subscriptions.push(editorChangeListener);
    }
}

async function analyzeCurrentFile(): Promise<void> {
    await errorHandler!.safeAsyncOperation(
        async () => {
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor || !diagnosticMonitor?.isSupportedFile(activeEditor.document)) {
                return;
            }

            const filePath = activeEditor.document.uri.fsPath;
            
            const cached = performanceOptimizer?.getCachedMoodScore(filePath);
            if (cached && moodPanel?.isVisible()) {
                await moodPanel.updateMood(cached);
                return;
            }

            const diagnostics = vscode.languages.getDiagnostics(activeEditor.document.uri);
            const diagnosticCount = diagnosticMonitor.extractDiagnosticCount(diagnostics);
            const moodScore = moodCalculator!.calculateMoodScore(
                diagnosticCount,
                filePath,
                activeEditor.document.lineCount,
                activeEditor.document.languageId
            );

            performanceOptimizer?.cacheMoodScore(filePath, moodScore);

            if (moodPanel?.isVisible()) {
                await moodPanel.updateMood(moodScore);
            }
        },
        undefined,
        {
            operation: 'file_analysis',
            filePath: vscode.window.activeTextEditor?.document.uri.fsPath,
            languageId: vscode.window.activeTextEditor?.document.languageId,
            timestamp: Date.now(),
            severity: ErrorSeverity.MEDIUM
        }
    );
}

async function preloadResources(): Promise<void> {
    await errorHandler!.safeAsyncOperation(
        async () => {
            if (emojiService) {
                await emojiService.preloadEmojis();
            }
        },
        undefined,
        {
            operation: 'emoji_preload',
            timestamp: Date.now(),
            severity: ErrorSeverity.LOW
        }
    );
}

export function deactivate(): void {
    console.log('CodeMood extension is deactivating...');

    try {
        diagnosticMonitor?.dispose();
        moodPanel?.dispose();
        emojiService?.clearCache();
        performanceOptimizer?.clearAllCaches();

        diagnosticMonitor = null;
        moodCalculator = null;
        emojiService = null;
        moodPanel = null;
        commandHandler = null;
        performanceOptimizer = null;
        errorHandler = null;

        console.log('CodeMood extension deactivated successfully');
    } catch (error) {
        console.error('Error during CodeMood deactivation:', error);
    }
}

function setupPerformanceCleanup(): void {
    const cleanupInterval = setInterval(() => {
        if (performanceOptimizer) {
            const cleaned = performanceOptimizer.cleanupExpiredEntries();
            if (cleaned > 0) {
                console.log(`Cleaned up ${cleaned} expired cache entries`);
            }
        }
    }, 60000);

    if (moodPanel) {
        const context = (moodPanel as any).context;
        context.subscriptions.push({
            dispose: () => clearInterval(cleanupInterval)
        });
    }
}