import * as vscode from 'vscode';
import { MoodScore, MoodCategory } from './types';

export enum ErrorSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

export interface ErrorContext {
    operation: string;
    filePath?: string;
    languageId?: string;
    timestamp: number;
    severity: ErrorSeverity;
}

export class ErrorHandler {
    private static instance: ErrorHandler;
    private errorLog: Array<{ error: Error; context: ErrorContext }> = [];
    private readonly MAX_LOG_SIZE = 100;

    public static getInstance(): ErrorHandler {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler();
        }
        return ErrorHandler.instance;
    }

    public handleError(error: Error, context: ErrorContext): void {
        this.logError(error, context);
        this.notifyUser(error, context);
        this.reportTelemetry(error, context);
    }

    private logError(error: Error, context: ErrorContext): void {
        console.error(`[CodeMood] ${context.operation} failed:`, error);
        
        this.errorLog.push({ error, context });
        
        if (this.errorLog.length > this.MAX_LOG_SIZE) {
            this.errorLog.shift();
        }
    }

    private notifyUser(error: Error, context: ErrorContext): void {
        const message = this.getErrorMessage(error, context);
        
        switch (context.severity) {
            case ErrorSeverity.CRITICAL:
                vscode.window.showErrorMessage(message);
                break;
            case ErrorSeverity.HIGH:
                vscode.window.showWarningMessage(message);
                break;
            case ErrorSeverity.MEDIUM:
                console.warn(`[CodeMood] ${message}`);
                break;
            case ErrorSeverity.LOW:
                console.log(`[CodeMood] ${message}`);
                break;
        }
    }

    private getErrorMessage(error: Error, context: ErrorContext): string {
        const baseMessage = `CodeMood: ${context.operation} encountered an issue`;
        
        switch (context.operation) {
            case 'emoji_loading':
                return `${baseMessage}. Using fallback emoji display.`;
            case 'diagnostic_analysis':
                return `${baseMessage}. Code mood may not be accurate.`;
            case 'panel_update':
                return `${baseMessage}. Panel display may be outdated.`;
            case 'cache_operation':
                return `${baseMessage}. Performance may be affected.`;
            default:
                return `${baseMessage}. Some features may not work correctly.`;
        }
    }

    private reportTelemetry(error: Error, context: ErrorContext): void {
        // In a real extension, this would send telemetry data
        console.log(`[CodeMood Telemetry] Error in ${context.operation}:`, {
            errorName: error.name,
            severity: context.severity,
            timestamp: context.timestamp
        });
    }

    public createFallbackMoodScore(filePath: string, reason: string): MoodScore {
        console.warn(`[CodeMood] Creating fallback mood score for ${filePath}: ${reason}`);
        
        return {
            score: 50,
            category: MoodCategory.NEUTRAL,
            diagnosticCount: { errors: 0, warnings: 0, info: 0 },
            timestamp: Date.now(),
            filePath
        };
    }

    public async safeAsyncOperation<T>(
        operation: () => Promise<T>,
        fallback: T,
        context: ErrorContext
    ): Promise<T> {
        try {
            return await operation();
        } catch (error) {
            this.handleError(error as Error, context);
            return fallback;
        }
    }

    public safeSyncOperation<T>(
        operation: () => T,
        fallback: T,
        context: ErrorContext
    ): T {
        try {
            return operation();
        } catch (error) {
            this.handleError(error as Error, context);
            return fallback;
        }
    }

    public getErrorHistory(): Array<{ error: Error; context: ErrorContext }> {
        return [...this.errorLog];
    }

    public clearErrorHistory(): void {
        this.errorLog = [];
    }

    public getErrorStats(): { total: number; bySeverity: Record<ErrorSeverity, number>; byOperation: Record<string, number> } {
        const stats = {
            total: this.errorLog.length,
            bySeverity: {
                [ErrorSeverity.LOW]: 0,
                [ErrorSeverity.MEDIUM]: 0,
                [ErrorSeverity.HIGH]: 0,
                [ErrorSeverity.CRITICAL]: 0
            },
            byOperation: {} as Record<string, number>
        };

        for (const { context } of this.errorLog) {
            stats.bySeverity[context.severity]++;
            stats.byOperation[context.operation] = (stats.byOperation[context.operation] || 0) + 1;
        }

        return stats;
    }

    public isHealthy(): boolean {
        const recentErrors = this.errorLog.filter(
            ({ context }) => Date.now() - context.timestamp < 300000 // 5 minutes
        );

        const criticalErrors = recentErrors.filter(
            ({ context }) => context.severity === ErrorSeverity.CRITICAL
        );

        return criticalErrors.length === 0 && recentErrors.length < 10;
    }
}