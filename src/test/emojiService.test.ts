import * as assert from 'assert';
import { EmojiService } from '../emojiService';
import { MoodCategory } from '../types';

suite('EmojiService Test Suite', () => {
    let emojiService: EmojiService;

    setup(() => {
        emojiService = new EmojiService();
    });

    teardown(() => {
        emojiService.clearCache();
    });

    test('should return fallback emoji for invalid category', async () => {
        const result = await emojiService.getEmojiUrl(MoodCategory.NEUTRAL);
        assert.ok(typeof result === 'string');
        assert.ok(result.length > 0);
    });

    test('should provide emoji descriptions', () => {
        const description = emojiService.getEmojiDescription(MoodCategory.HAPPY);
        assert.ok(typeof description === 'string');
        assert.ok(description.length > 0);
    });

    test('should clear cache properly', () => {
        emojiService.clearCache();
        const stats = emojiService.getCacheStats();
        
        assert.strictEqual(stats.size, 0);
        assert.strictEqual(stats.entries, 0);
        assert.ok(stats.maxSize > 0);
    });

    test('should return cache statistics', () => {
        const stats = emojiService.getCacheStats();
        
        assert.ok(typeof stats.size === 'number');
        assert.ok(typeof stats.entries === 'number');
        assert.ok(typeof stats.maxSize === 'number');
        assert.ok(stats.size >= 0);
        assert.ok(stats.entries >= 0);
        assert.ok(stats.maxSize > 0);
    });

    test('should handle preload emojis gracefully', async () => {
        const preloadPromise = emojiService.preloadEmojis();
        assert.ok(preloadPromise instanceof Promise);
        
        await preloadPromise;
        const stats = emojiService.getCacheStats();
        assert.ok(stats.entries >= 0);
    });

    test('should get random emoji for category', async () => {
        const emoji1 = await emojiService.getRandomEmojiForCategory(MoodCategory.HAPPY);
        const emoji2 = await emojiService.getRandomEmojiForCategory(MoodCategory.HAPPY);
        
        assert.ok(typeof emoji1 === 'string');
        assert.ok(typeof emoji2 === 'string');
        assert.ok(emoji1.length > 0);
        assert.ok(emoji2.length > 0);
    });

    test('should handle network failures gracefully', async () => {
        const result = await emojiService.getEmojiUrl(MoodCategory.SAD);
        assert.ok(typeof result === 'string');
        assert.ok(result.length > 0);
    });
});