import { MoodScore, MoodCategory, DiagnosticCount } from './types';
import { MOOD_THRESHOLDS, DIAGNOSTIC_WEIGHTS } from './constants';
import { clampScore, validateMoodScore } from './validation';
import { LanguageSupport } from './languageSupport';

export class MoodCalculator {
    public calculateMoodScore(diagnosticCount: DiagnosticCount, filePath: string, lineCount: number = 0, languageId: string = ''): MoodScore {
        const baseScore = DIAGNOSTIC_WEIGHTS.BASE_SCORE;
        const errorPenalty = diagnosticCount.errors * DIAGNOSTIC_WEIGHTS.ERROR;
        const warningPenalty = diagnosticCount.warnings * DIAGNOSTIC_WEIGHTS.WARNING;
        const infoPenalty = diagnosticCount.info * DIAGNOSTIC_WEIGHTS.INFO;
        
        const fileSizeModifier = this.calculateFileSizeModifier(lineCount);
        const languageBonus = this.calculateLanguageBonus(languageId, diagnosticCount);
        
        const rawScore = baseScore + errorPenalty + warningPenalty + infoPenalty + fileSizeModifier + languageBonus;
        const finalScore = clampScore(rawScore);
        
        const category = this.determineMoodCategory(finalScore);
        
        const moodScore: MoodScore = {
            score: finalScore,
            category,
            diagnosticCount,
            timestamp: Date.now(),
            filePath
        };

        if (!validateMoodScore(moodScore)) {
            return this.getDefaultMoodScore(filePath);
        }

        return moodScore;
    }

    private calculateFileSizeModifier(lineCount: number): number {
        if (lineCount <= 0) return 0;
        
        if (lineCount > 1000) {
            return -2;
        } else if (lineCount > 500) {
            return -1;
        }
        return 0;
    }

    private calculateLanguageBonus(languageId: string, diagnosticCount: DiagnosticCount): number {
        const totalIssues = diagnosticCount.errors + diagnosticCount.warnings + diagnosticCount.info;
        
        if (totalIssues === 0) {
            const qualityBonus = LanguageSupport.getQualityBonus(languageId);
            return qualityBonus;
        }
        
        const diagnosticWeight = LanguageSupport.getDiagnosticWeight(languageId);
        return Math.round((1 - diagnosticWeight) * 2);
    }

    private determineMoodCategory(score: number): MoodCategory {
        if (score >= MOOD_THRESHOLDS.ECSTATIC) {
            return MoodCategory.ECSTATIC;
        } else if (score >= MOOD_THRESHOLDS.HAPPY) {
            return MoodCategory.HAPPY;
        } else if (score >= MOOD_THRESHOLDS.NEUTRAL) {
            return MoodCategory.NEUTRAL;
        } else if (score >= MOOD_THRESHOLDS.CONCERNED) {
            return MoodCategory.CONCERNED;
        } else if (score >= MOOD_THRESHOLDS.SAD) {
            return MoodCategory.SAD;
        } else {
            return MoodCategory.DEVASTATED;
        }
    }

    public getMoodDescription(category: MoodCategory): string {
        switch (category) {
            case MoodCategory.ECSTATIC:
                return 'Excellent! Your code is pristine and error-free.';
            case MoodCategory.HAPPY:
                return 'Great job! Your code quality is looking good.';
            case MoodCategory.NEUTRAL:
                return 'Not bad. There are some minor issues to address.';
            case MoodCategory.CONCERNED:
                return 'Hmm, several issues need your attention.';
            case MoodCategory.SAD:
                return 'Ouch! Many problems detected in your code.';
            case MoodCategory.DEVASTATED:
                return 'Critical issues found! Time for some serious debugging.';
            default:
                return 'Code analysis in progress...';
        }
    }

    public compareMoodScores(previous: MoodScore, current: MoodScore): 'improved' | 'worsened' | 'unchanged' {
        if (current.score > previous.score) {
            return 'improved';
        } else if (current.score < previous.score) {
            return 'worsened';
        } else {
            return 'unchanged';
        }
    }

    private getDefaultMoodScore(filePath: string): MoodScore {
        return {
            score: 50,
            category: MoodCategory.NEUTRAL,
            diagnosticCount: { errors: 0, warnings: 0, info: 0 },
            timestamp: Date.now(),
            filePath
        };
    }

    public calculateTrendScore(recentScores: MoodScore[]): number {
        if (recentScores.length < 2) {
            return 0;
        }

        const sortedScores = recentScores.sort((a, b) => a.timestamp - b.timestamp);
        const weights = sortedScores.map((_, index) => index + 1);
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        
        const weightedSum = sortedScores.reduce((sum, score, index) => {
            return sum + (score.score * weights[index]);
        }, 0);

        return weightedSum / totalWeight;
    }
}