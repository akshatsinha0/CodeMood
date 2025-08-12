import * as vscode from 'vscode';
import { DiagnosticCount, FileAnalysis } from './types';
import { SUPPORTED_LANGUAGES, DEBOUNCE_DELAY } from './constants';
import { validateDiagnosticCount } from './validation';
import { LanguageSupport } from './languageSupport';

export class DiagnosticMonitor {
    private disposables: vscode.Disposable[] = [];
    private debounceTimer: NodeJS.Timeout | null = null;
    private onDiagnosticsChangedCallback: ((uri: vscode.Uri, diagnostics: vscode.Diagnostic[]) => void) | null = null;

    constructor() {
        this.setupDiagnosticListener();
        this.setupActiveEditorListener();
    }

    public onDiagnosticsChanged(callback: (uri: vscode.Uri, diagnostics: vscode.Diagnostic[]) => void): void {
        this.onDiagnosticsChangedCallback = callback;
    }

    private setupDiagnosticListener(): void {
        const diagnosticListener = vscode.languages.onDidChangeDiagnostics((event) => {
            this.debounceDiagnosticChange(event);
        });
        this.disposables.push(diagnosticListener);
    }

    private setupActiveEditorListener(): void {
        const editorListener = vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor && this.isSupportedFile(editor.document)) {
                const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
                this.triggerDiagnosticsChanged(editor.document.uri, diagnostics);
            }
        });
        this.disposables.push(editorListener);
    }

    private debounceDiagnosticChange(event: vscode.DiagnosticChangeEvent): void {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => {
            for (const uri of event.uris) {
                const document = vscode.workspace.textDocuments.find(doc => doc.uri.toString() === uri.toString());
                if (document && this.isSupportedFile(document)) {
                    const diagnostics = vscode.languages.getDiagnostics(uri);
                    this.triggerDiagnosticsChanged(uri, diagnostics);
                }
            }
        }, DEBOUNCE_DELAY);
    }

    private triggerDiagnosticsChanged(uri: vscode.Uri, diagnostics: vscode.Diagnostic[]): void {
        if (this.onDiagnosticsChangedCallback) {
            this.onDiagnosticsChangedCallback(uri, diagnostics);
        }
    }

    public isSupportedFile(document: vscode.TextDocument): boolean {
        return LanguageSupport.isSupported(document.languageId);
    }

    public extractDiagnosticCount(diagnostics: vscode.Diagnostic[]): DiagnosticCount {
        const count: DiagnosticCount = {
            errors: 0,
            warnings: 0,
            info: 0
        };

        for (const diagnostic of diagnostics) {
            // YAML syntax errors are often critical for configuration files
            if (this.isYamlSyntaxError(diagnostic)) {
                count.errors++;
                continue;
            }

            switch (diagnostic.severity) {
                case vscode.DiagnosticSeverity.Error:
                    count.errors++;
                    break;
                case vscode.DiagnosticSeverity.Warning:
                    count.warnings++;
                    break;
                case vscode.DiagnosticSeverity.Information:
                case vscode.DiagnosticSeverity.Hint:
                    count.info++;
                    break;
            }
        }

        if (!validateDiagnosticCount(count)) {
            return { errors: 0, warnings: 0, info: 0 };
        }

        return count;
    }

    private isYamlSyntaxError(diagnostic: vscode.Diagnostic): boolean {
        const message = diagnostic.message.toLowerCase();
        const yamlErrorKeywords = [
            'yaml syntax error',
            'invalid yaml',
            'indentation error',
            'mapping values are not allowed',
            'could not find expected',
            'found character that cannot start',
            'block sequence entries are not allowed'
        ];
        
        return yamlErrorKeywords.some(keyword => message.includes(keyword));
    }

    public getCurrentFileDiagnostics(): { uri: vscode.Uri; diagnostics: vscode.Diagnostic[] } | null {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor || !this.isSupportedFile(activeEditor.document)) {
            return null;
        }

        const diagnostics = vscode.languages.getDiagnostics(activeEditor.document.uri);
        return {
            uri: activeEditor.document.uri,
            diagnostics
        };
    }

    public getFileAnalysis(document: vscode.TextDocument): FileAnalysis | null {
        if (!this.isSupportedFile(document)) {
            return null;
        }

        const diagnostics = vscode.languages.getDiagnostics(document.uri);
        const diagnosticCount = this.extractDiagnosticCount(diagnostics);

        return {
            filePath: document.uri.fsPath,
            languageId: document.languageId,
            lineCount: document.lineCount,
            moodScore: {
                score: 0,
                category: 'neutral' as any,
                diagnosticCount,
                timestamp: Date.now(),
                filePath: document.uri.fsPath
            },
            lastAnalyzed: Date.now()
        };
    }

    public dispose(): void {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        this.disposables.forEach(disposable => disposable.dispose());
        this.disposables = [];
    }
}