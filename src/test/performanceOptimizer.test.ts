import * as assert from 'assert';
import { PerformanceOptimizer } from '../performanceOptimizer';
import { MoodScore, MoodCategory } from '../types';

suite('PerformanceOptimizer Test Suite', () => {
    let optimizer: PerformanceOptimizer;

    setup(() => {
        optimizer = new PerformanceOptimizer();
    });

    teardown(() => {
        optimizer.clearAllCaches();
    });

    test('should determine when to analyze file', () => {
        const filePath = 'test.js';
        const content = 'console.log("test");';

        assert.strictEqual(optimizer.shouldAnalyzeFile(filePath, content), true);

        const mockMoodScore: MoodScore = {
            score: 85,
            category: MoodCategory.HAPPY,
            diagnosticCount: { errors: 0, warnings: 0, info: 0 },
            timestamp: Date.now(),
            filePath
        };

        optimizer.cacheMoodScore(filePath, mockMoodScore);
        assert.strictEqual(optimizer.shouldAnalyzeFile(filePath, content), false);
    });

    test('should cache and retrieve mood scores', () => {
        const filePath = 'test.ts';
        const mockMoodScore: MoodScore = {
            score: 90,
            category: MoodCategory.ECSTATIC,
            diagnosticCount: { errors: 0, warnings: 0, info: 0 },
            timestamp: Date.now(),
            filePath
        };

        optimizer.cacheMoodScore(filePath, mockMoodScore);
        const cached = optimizer.getCachedMoodScore(filePath);

        assert.ok(cached);
        assert.strictEqual(cached.score, 90);
        assert.strictEqual(cached.category, MoodCategory.ECSTATIC);
    });

    test('should return null for expired cache entries', (done) => {
        const filePath = 'test.py';
        const mockMoodScore: MoodScore = {
            score: 75,
            category: MoodCategory.HAPPY,
            diagnosticCount: { errors: 0, warnings: 1, info: 0 },
            timestamp: Date.now() - 35000,
            filePath
        };

        optimizer.cacheMoodScore(filePath, mockMoodScore);
        
        setTimeout(() => {
            const cached = optimizer.getCachedMoodScore(filePath);
            assert.strictEqual(cached, null);
            done();
        }, 100);
    });

    test('should debounce analysis calls', (done) => {
        let callCount = 0;
        const callback = () => callCount++;

        optimizer.debounceAnalysis('test.js', callback, 100);
        optimizer.debounceAnalysis('test.js', callback, 100);
        optimizer.debounceAnalysis('test.js', callback, 100);

        setTimeout(() => {
            assert.strictEqual(callCount, 1);
            done();
        }, 150);
    });

    test('should clear file cache', () => {
        const filePath = 'test.java';
        const mockMoodScore: MoodScore = {
            score: 80,
            category: MoodCategory.HAPPY,
            diagnosticCount: { errors: 0, warnings: 0, info: 1 },
            timestamp: Date.now(),
            filePath
        };

        optimizer.cacheMoodScore(filePath, mockMoodScore);
        assert.ok(optimizer.getCachedMoodScore(filePath));

        optimizer.clearFileCache(filePath);
        assert.strictEqual(optimizer.getCachedMoodScore(filePath), null);
    });

    test('should provide cache statistics', () => {
        const stats = optimizer.getCacheStats();
        assert.strictEqual(stats.size, 0);
        assert.strictEqual(stats.oldestEntry, null);
        assert.strictEqual(stats.newestEntry, null);

        const mockMoodScore: MoodScore = {
            score: 70,
            category: MoodCategory.NEUTRAL,
            diagnosticCount: { errors: 1, warnings: 0, info: 0 },
            timestamp: Date.now(),
            filePath: 'test.go'
        };

        optimizer.cacheMoodScore('test.go', mockMoodScore);
        const newStats = optimizer.getCacheStats();
        assert.strictEqual(newStats.size, 1);
        assert.ok(newStats.oldestEntry);
        assert.ok(newStats.newestEntry);
    });

    test('should cleanup expired entries', () => {
        const oldMoodScore: MoodScore = {
            score: 60,
            category: MoodCategory.CONCERNED,
            diagnosticCount: { errors: 2, warnings: 1, info: 0 },
            timestamp: Date.now() - 35000,
            filePath: 'old.js'
        };

        const newMoodScore: MoodScore = {
            score: 85,
            category: MoodCategory.HAPPY,
            diagnosticCount: { errors: 0, warnings: 0, info: 1 },
            timestamp: Date.now(),
            filePath: 'new.js'
        };

        optimizer.cacheMoodScore('old.js', oldMoodScore);
        optimizer.cacheMoodScore('new.js', newMoodScore);

        const cleaned = optimizer.cleanupExpiredEntries();
        assert.strictEqual(cleaned, 1);
        assert.strictEqual(optimizer.getCacheStats().size, 1);
    });

    test('should track analysis in progress', (done) => {
        assert.strictEqual(optimizer.isAnalysisInProgress('test.rs'), false);

        optimizer.debounceAnalysis('test.rs', () => {}, 100);
        assert.strictEqual(optimizer.isAnalysisInProgress('test.rs'), true);

        setTimeout(() => {
            assert.strictEqual(optimizer.isAnalysisInProgress('test.rs'), false);
            done();
        }, 150);
    });

    test('should provide memory usage statistics', () => {
        const usage = optimizer.getMemoryUsage();
        assert.ok(typeof usage.cacheSize === 'number');
        assert.ok(typeof usage.timerCount === 'number');
        assert.ok(typeof usage.estimatedMemoryKB === 'number');
        assert.ok(usage.estimatedMemoryKB >= 0);
    });
});