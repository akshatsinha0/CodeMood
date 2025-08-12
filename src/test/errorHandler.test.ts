import * as assert from 'assert';
import { ErrorHandler, ErrorSeverity } from '../errorHandler';

suite('ErrorHandler Test Suite', () => {
    let errorHandler: ErrorHandler;

    setup(() => {
        errorHandler = ErrorHandler.getInstance();
        errorHandler.clearErrorHistory();
    });

    test('should be singleton', () => {
        const instance1 = ErrorHandler.getInstance();
        const instance2 = ErrorHandler.getInstance();
        assert.strictEqual(instance1, instance2);
    });

    test('should handle errors and log them', () => {
        const error = new Error('Test error');
        const context = {
            operation: 'test_operation',
            timestamp: Date.now(),
            severity: ErrorSeverity.MEDIUM
        };

        errorHandler.handleError(error, context);
        const history = errorHandler.getErrorHistory();

        assert.strictEqual(history.length, 1);
        assert.strictEqual(history[0].error.message, 'Test error');
        assert.strictEqual(history[0].context.operation, 'test_operation');
    });

    test('should create fallback mood score', () => {
        const fallback = errorHandler.createFallbackMoodScore('test.js', 'Network error');
        
        assert.strictEqual(fallback.score, 50);
        assert.strictEqual(fallback.filePath, 'test.js');
        assert.ok(fallback.timestamp > 0);
    });

    test('should handle safe async operations', async () => {
        const successOperation = async () => 'success';
        const failOperation = async () => { throw new Error('Async error'); };

        const result1 = await errorHandler.safeAsyncOperation(
            successOperation,
            'fallback',
            { operation: 'test', timestamp: Date.now(), severity: ErrorSeverity.LOW }
        );

        const result2 = await errorHandler.safeAsyncOperation(
            failOperation,
            'fallback',
            { operation: 'test', timestamp: Date.now(), severity: ErrorSeverity.LOW }
        );

        assert.strictEqual(result1, 'success');
        assert.strictEqual(result2, 'fallback');
    });

    test('should handle safe sync operations', () => {
        const successOperation = () => 'success';
        const failOperation = () => { throw new Error('Sync error'); };

        const result1 = errorHandler.safeSyncOperation(
            successOperation,
            'fallback',
            { operation: 'test', timestamp: Date.now(), severity: ErrorSeverity.LOW }
        );

        const result2 = errorHandler.safeSyncOperation(
            failOperation,
            'fallback',
            { operation: 'test', timestamp: Date.now(), severity: ErrorSeverity.LOW }
        );

        assert.strictEqual(result1, 'success');
        assert.strictEqual(result2, 'fallback');
    });

    test('should provide error statistics', () => {
        const error1 = new Error('Error 1');
        const error2 = new Error('Error 2');

        errorHandler.handleError(error1, {
            operation: 'op1',
            timestamp: Date.now(),
            severity: ErrorSeverity.HIGH
        });

        errorHandler.handleError(error2, {
            operation: 'op1',
            timestamp: Date.now(),
            severity: ErrorSeverity.LOW
        });

        const stats = errorHandler.getErrorStats();
        assert.strictEqual(stats.total, 2);
        assert.strictEqual(stats.bySeverity[ErrorSeverity.HIGH], 1);
        assert.strictEqual(stats.bySeverity[ErrorSeverity.LOW], 1);
        assert.strictEqual(stats.byOperation['op1'], 2);
    });

    test('should determine health status', () => {
        assert.strictEqual(errorHandler.isHealthy(), true);

        const criticalError = new Error('Critical error');
        errorHandler.handleError(criticalError, {
            operation: 'critical_op',
            timestamp: Date.now(),
            severity: ErrorSeverity.CRITICAL
        });

        assert.strictEqual(errorHandler.isHealthy(), false);
    });

    test('should limit error log size', () => {
        for (let i = 0; i < 150; i++) {
            errorHandler.handleError(new Error(`Error ${i}`), {
                operation: 'test',
                timestamp: Date.now(),
                severity: ErrorSeverity.LOW
            });
        }

        const history = errorHandler.getErrorHistory();
        assert.ok(history.length <= 100);
    });

    test('should clear error history', () => {
        errorHandler.handleError(new Error('Test'), {
            operation: 'test',
            timestamp: Date.now(),
            severity: ErrorSeverity.LOW
        });

        assert.ok(errorHandler.getErrorHistory().length > 0);
        
        errorHandler.clearErrorHistory();
        assert.strictEqual(errorHandler.getErrorHistory().length, 0);
    });
});