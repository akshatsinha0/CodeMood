import * as assert from 'assert';
import * as vscode from 'vscode';
import { DiagnosticMonitor } from '../diagnosticMonitor';

suite('DiagnosticMonitor Test Suite', () => {
    let monitor: DiagnosticMonitor;

    setup(() => {
        monitor = new DiagnosticMonitor();
    });

    teardown(() => {
        monitor.dispose();
    });

    test('should extract diagnostic count correctly', () => {
        const diagnostics: vscode.Diagnostic[] = [
            new vscode.Diagnostic(new vscode.Range(0, 0, 0, 10), 'Error message', vscode.DiagnosticSeverity.Error),
            new vscode.Diagnostic(new vscode.Range(1, 0, 1, 10), 'Warning message', vscode.DiagnosticSeverity.Warning),
            new vscode.Diagnostic(new vscode.Range(2, 0, 2, 10), 'Info message', vscode.DiagnosticSeverity.Information)
        ];

        const count = monitor.extractDiagnosticCount(diagnostics);

        assert.strictEqual(count.errors, 1);
        assert.strictEqual(count.warnings, 1);
        assert.strictEqual(count.info, 1);
    });

    test('should handle empty diagnostics array', () => {
        const count = monitor.extractDiagnosticCount([]);

        assert.strictEqual(count.errors, 0);
        assert.strictEqual(count.warnings, 0);
        assert.strictEqual(count.info, 0);
    });

    test('should identify supported file types', () => {
        const jsDocument = {
            languageId: 'javascript'
        } as vscode.TextDocument;

        const tsDocument = {
            languageId: 'typescript'
        } as vscode.TextDocument;

        const txtDocument = {
            languageId: 'plaintext'
        } as vscode.TextDocument;

        assert.strictEqual(monitor.isSupportedFile(jsDocument), true);
        assert.strictEqual(monitor.isSupportedFile(tsDocument), true);
        assert.strictEqual(monitor.isSupportedFile(txtDocument), false);
    });

    test('should handle hint severity as info', () => {
        const diagnostics: vscode.Diagnostic[] = [
            new vscode.Diagnostic(new vscode.Range(0, 0, 0, 10), 'Hint message', vscode.DiagnosticSeverity.Hint)
        ];

        const count = monitor.extractDiagnosticCount(diagnostics);

        assert.strictEqual(count.errors, 0);
        assert.strictEqual(count.warnings, 0);
        assert.strictEqual(count.info, 1);
    });
});