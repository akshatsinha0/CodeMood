import * as assert from 'assert';
import * as vscode from 'vscode';
import { CommandHandler } from '../commands';

suite('CommandHandler Test Suite', () => {
    test('should provide command contributions', () => {
        const contributions = CommandHandler.getCommandContributions();
        
        assert.ok(Array.isArray(contributions));
        assert.ok(contributions.length > 0);
        
        const showCommand = contributions.find(cmd => cmd.command === 'codemood.showMoodPanel');
        assert.ok(showCommand);
        assert.strictEqual(showCommand.title, 'CodeMood: Show Mood Panel');
        assert.strictEqual(showCommand.category, 'CodeMood');
    });

    test('should provide keybinding contributions', () => {
        const keybindings = CommandHandler.getKeybindingContributions();
        
        assert.ok(Array.isArray(keybindings));
        assert.ok(keybindings.length > 0);
        
        const toggleKeybinding = keybindings.find(kb => kb.command === 'codemood.toggleMoodPanel');
        assert.ok(toggleKeybinding);
        assert.strictEqual(toggleKeybinding.key, 'ctrl+shift+m');
        assert.strictEqual(toggleKeybinding.mac, 'cmd+shift+m');
    });

    test('should have all required commands', () => {
        const contributions = CommandHandler.getCommandContributions();
        const commandIds = contributions.map(cmd => cmd.command);
        
        const expectedCommands = [
            'codemood.showMoodPanel',
            'codemood.hideMoodPanel',
            'codemood.toggleMoodPanel',
            'codemood.refreshMood'
        ];
        
        for (const expectedCommand of expectedCommands) {
            assert.ok(commandIds.includes(expectedCommand), `Missing command: ${expectedCommand}`);
        }
    });

    test('should have proper command categories', () => {
        const contributions = CommandHandler.getCommandContributions();
        
        for (const contribution of contributions) {
            assert.strictEqual(contribution.category, 'CodeMood');
        }
    });
});