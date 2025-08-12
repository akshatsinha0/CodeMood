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
            
            // Extra bonus for clean configuration files
            if (LanguageSupport.isConfigurationLanguage(languageId)) {
                return qualityBonus + 1;
            }
            
            return qualityBonus;
        }
        
        const diagnosticWeight = LanguageSupport.getDiagnosticWeight(languageId);
        
        // Configuration files are more sensitive to errors
        if (LanguageSupport.isConfigurationLanguage(languageId)) {
            return Math.round((1 - diagnosticWeight) * 1.5);
        }
        
        return Math.round((1 - diagnosticWeight) * 2);
    }

    private determineMoodCategory(score: number): MoodCategory {
        if (score >= MOOD_THRESHOLDS.EUPHORIC) {
            return MoodCategory.EUPHORIC;
        } else if (score >= MOOD_THRESHOLDS.ECSTATIC) {
            return MoodCategory.ECSTATIC;
        } else if (score >= MOOD_THRESHOLDS.PROUD) {
            return MoodCategory.PROUD;
        } else if (score >= MOOD_THRESHOLDS.HAPPY) {
            return MoodCategory.HAPPY;
        } else if (score >= MOOD_THRESHOLDS.CONTENT) {
            return MoodCategory.CONTENT;
        } else if (score >= MOOD_THRESHOLDS.NEUTRAL) {
            return MoodCategory.NEUTRAL;
        } else if (score >= MOOD_THRESHOLDS.THOUGHTFUL) {
            return MoodCategory.THOUGHTFUL;
        } else if (score >= MOOD_THRESHOLDS.CONCERNED) {
            return MoodCategory.CONCERNED;
        } else if (score >= MOOD_THRESHOLDS.ANXIOUS) {
            return MoodCategory.ANXIOUS;
        } else if (score >= MOOD_THRESHOLDS.SAD) {
            return MoodCategory.SAD;
        } else if (score >= MOOD_THRESHOLDS.FRUSTRATED) {
            return MoodCategory.FRUSTRATED;
        } else if (score >= MOOD_THRESHOLDS.DEVASTATED) {
            return MoodCategory.DEVASTATED;
        } else {
            return MoodCategory.PANICKED;
        }
    }

    public getMoodDescription(category: MoodCategory): string {
        switch (category) {
            case MoodCategory.EUPHORIC:
                return 'Absolutely flawless code - a masterpiece!';
            case MoodCategory.ECSTATIC:
                return 'Exceptional code quality - celebration time!';
            case MoodCategory.PROUD:
                return 'Really solid code - you should be proud';
            case MoodCategory.HAPPY:
                return 'Good code quality - things are going well';
            case MoodCategory.CONTENT:
                return 'Decent code with minor room for improvement';
            case MoodCategory.NEUTRAL:
                return 'Average code quality - could use some attention';
            case MoodCategory.THOUGHTFUL:
                return 'Code needs some thinking and refactoring';
            case MoodCategory.CONCERNED:
                return 'Several issues detected - needs attention';
            case MoodCategory.ANXIOUS:
                return 'Multiple problems causing anxiety - time to debug';
            case MoodCategory.SAD:
                return 'Many issues detected - code needs serious help';
            case MoodCategory.FRUSTRATED:
                return 'Frustrating errors everywhere - deep debugging needed';
            case MoodCategory.DEVASTATED:
                return 'Critical issues everywhere - major refactoring required';
            case MoodCategory.PANICKED:
                return 'Code is in complete chaos - emergency intervention needed!';
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