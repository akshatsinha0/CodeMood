import * as assert from 'assert';
import { MoodCalculator } from '../moodCalculator';
import { MoodCategory } from '../types';

suite('MoodCalculator Test Suite', () => {
    let calculator: MoodCalculator;

    setup(() => {
        calculator = new MoodCalculator();
    });

    test('should calculate perfect score for no issues', () => {
        const diagnosticCount = { errors: 0, warnings: 0, info: 0 };
        const result = calculator.calculateMoodScore(diagnosticCount, 'test.ts', 100, 'typescript');

        assert.strictEqual(result.category, MoodCategory.ECSTATIC);
        assert.ok(result.score >= 90);
    });

    test('should penalize errors heavily', () => {
        const diagnosticCount = { errors: 5, warnings: 0, info: 0 };
        const result = calculator.calculateMoodScore(diagnosticCount, 'test.js', 100, 'javascript');

        assert.ok(result.score <= 50);
        assert.strictEqual(result.category, MoodCategory.CONCERNED);
    });

    test('should handle mixed diagnostics correctly', () => {
        const diagnosticCount = { errors: 1, warnings: 3, info: 2 };
        const result = calculator.calculateMoodScore(diagnosticCount, 'test.py', 200, 'python');

        const expectedScore = 100 - 15 - 15 - 2;
        assert.ok(Math.abs(result.score - expectedScore) <= 5);
    });

    test('should apply file size modifier for large files', () => {
        const diagnosticCount = { errors: 0, warnings: 0, info: 0 };
        const smallFileResult = calculator.calculateMoodScore(diagnosticCount, 'small.js', 100, 'javascript');
        const largeFileResult = calculator.calculateMoodScore(diagnosticCount, 'large.js', 1500, 'javascript');

        assert.ok(largeFileResult.score < smallFileResult.score);
    });

    test('should provide language bonus for clean code', () => {
        const diagnosticCount = { errors: 0, warnings: 0, info: 0 };
        const tsResult = calculator.calculateMoodScore(diagnosticCount, 'test.ts', 100, 'typescript');
        const jsResult = calculator.calculateMoodScore(diagnosticCount, 'test.js', 100, 'javascript');

        assert.ok(tsResult.score >= jsResult.score);
    });

    test('should return appropriate mood descriptions', () => {
        const ecstaticDesc = calculator.getMoodDescription(MoodCategory.ECSTATIC);
        const sadDesc = calculator.getMoodDescription(MoodCategory.SAD);

        assert.ok(ecstaticDesc.includes('Excellent'));
        assert.ok(sadDesc.includes('problems'));
    });

    test('should compare mood scores correctly', () => {
        const previous = calculator.calculateMoodScore({ errors: 2, warnings: 0, info: 0 }, 'test.js');
        const improved = calculator.calculateMoodScore({ errors: 1, warnings: 0, info: 0 }, 'test.js');
        const worsened = calculator.calculateMoodScore({ errors: 3, warnings: 0, info: 0 }, 'test.js');

        assert.strictEqual(calculator.compareMoodScores(previous, improved), 'improved');
        assert.strictEqual(calculator.compareMoodScores(previous, worsened), 'worsened');
        assert.strictEqual(calculator.compareMoodScores(previous, previous), 'unchanged');
    });

    test('should clamp scores to valid range', () => {
        const manyErrors = { errors: 20, warnings: 10, info: 5 };
        const result = calculator.calculateMoodScore(manyErrors, 'test.js', 100, 'javascript');

        assert.ok(result.score >= 0);
        assert.ok(result.score <= 100);
    });
});