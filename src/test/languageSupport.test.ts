import * as assert from 'assert';
import * as vscode from 'vscode';
import { LanguageSupport } from '../languageSupport';

suite('LanguageSupport Test Suite', () => {
    test('should identify supported languages', () => {
        assert.strictEqual(LanguageSupport.isSupported('javascript'), true);
        assert.strictEqual(LanguageSupport.isSupported('typescript'), true);
        assert.strictEqual(LanguageSupport.isSupported('python'), true);
        assert.strictEqual(LanguageSupport.isSupported('plaintext'), false);
        assert.strictEqual(LanguageSupport.isSupported('unknown'), false);
    });

    test('should get language configuration', () => {
        const jsConfig = LanguageSupport.getLanguageConfig('javascript');
        assert.ok(jsConfig);
        assert.strictEqual(jsConfig.id, 'javascript');
        assert.strictEqual(jsConfig.displayName, 'JavaScript');
        assert.ok(jsConfig.fileExtensions.includes('.js'));

        const unknownConfig = LanguageSupport.getLanguageConfig('unknown');
        assert.strictEqual(unknownConfig, null);
    });

    test('should detect language from file extension', () => {
        const mockDocument = {
            languageId: 'javascript',
            fileName: 'test.js'
        } as vscode.TextDocument;

        const config = LanguageSupport.detectLanguageFromFile(mockDocument);
        assert.ok(config);
        assert.strictEqual(config.id, 'javascript');
    });

    test('should get display names', () => {
        assert.strictEqual(LanguageSupport.getLanguageDisplayName('typescript'), 'TypeScript');
        assert.strictEqual(LanguageSupport.getLanguageDisplayName('javascript'), 'JavaScript');
        assert.strictEqual(LanguageSupport.getLanguageDisplayName('unknown'), 'unknown');
    });

    test('should provide diagnostic weights', () => {
        const tsWeight = LanguageSupport.getDiagnosticWeight('typescript');
        const jsWeight = LanguageSupport.getDiagnosticWeight('javascript');
        const unknownWeight = LanguageSupport.getDiagnosticWeight('unknown');

        assert.ok(typeof tsWeight === 'number');
        assert.ok(typeof jsWeight === 'number');
        assert.strictEqual(unknownWeight, 1.0);
    });

    test('should provide quality bonuses', () => {
        const rustBonus = LanguageSupport.getQualityBonus('rust');
        const jsBonus = LanguageSupport.getQualityBonus('javascript');
        const unknownBonus = LanguageSupport.getQualityBonus('unknown');

        assert.ok(typeof rustBonus === 'number');
        assert.ok(typeof jsBonus === 'number');
        assert.strictEqual(unknownBonus, 1);
    });

    test('should categorize languages correctly', () => {
        assert.strictEqual(LanguageSupport.getLanguageCategory('javascript'), 'web');
        assert.strictEqual(LanguageSupport.getLanguageCategory('rust'), 'system');
        assert.strictEqual(LanguageSupport.getLanguageCategory('python'), 'scripting');
        assert.strictEqual(LanguageSupport.getLanguageCategory('java'), 'application');
        assert.strictEqual(LanguageSupport.getLanguageCategory('unknown'), 'other');
    });

    test('should identify web technologies', () => {
        assert.strictEqual(LanguageSupport.isWebTechnology('javascript'), true);
        assert.strictEqual(LanguageSupport.isWebTechnology('typescript'), true);
        assert.strictEqual(LanguageSupport.isWebTechnology('python'), false);
    });

    test('should identify system languages', () => {
        assert.strictEqual(LanguageSupport.isSystemLanguage('rust'), true);
        assert.strictEqual(LanguageSupport.isSystemLanguage('c'), true);
        assert.strictEqual(LanguageSupport.isSystemLanguage('javascript'), false);
    });

    test('should provide recommended practices', () => {
        const tsPractices = LanguageSupport.getRecommendedPractices('typescript');
        const unknownPractices = LanguageSupport.getRecommendedPractices('unknown');

        assert.ok(Array.isArray(tsPractices));
        assert.ok(tsPractices.length > 0);
        assert.ok(Array.isArray(unknownPractices));
        assert.ok(unknownPractices.length > 0);
    });

    test('should get all supported languages', () => {
        const languages = LanguageSupport.getSupportedLanguages();
        assert.ok(Array.isArray(languages));
        assert.ok(languages.length > 0);
        assert.ok(languages.every(lang => typeof lang.id === 'string'));
    });
});