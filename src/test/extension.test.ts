import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('undefined_publisher.codemood'));
    });

    test('Should activate extension', async () => {
        const extension = vscode.extensions.getExtension('undefined_publisher.codemood');
        if (extension) {
            await extension.activate();
            assert.ok(extension.isActive);
        }
    });

    test('Should register all commands', async () => {
        const commands = await vscode.commands.getCommands(true);
        
        const expectedCommands = [
            'codemood.showMoodPanel',
            'codemood.hideMoodPanel',
            'codemood.toggleMoodPanel',
            'codemood.refreshMood'
        ];

        for (const expectedCommand of expectedCommands) {
            assert.ok(commands.includes(expectedCommand), `Command ${expectedCommand} not registered`);
        }
    });

    test('Should handle command execution without errors', async () => {
        try {
            await vscode.commands.executeCommand('codemood.showMoodPanel');
            await vscode.commands.executeCommand('codemood.hideMoodPanel');
            assert.ok(true, 'Commands executed successfully');
        } catch (error) {
            assert.fail(`Command execution failed: ${error}`);
        }
    });
});