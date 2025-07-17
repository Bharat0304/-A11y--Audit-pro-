/**
 * Enhanced Accessibility Scanner
 * Integrates axe-core, advanced algorithms, and semantic analysis
 */

import axe from 'axe-core';
import { AdvancedAccessibilityEngine, AdvancedAccessibilityResult } from './advancedAccessibilityEngine';
import { SemanticAccessibilityAnalyzer, SemanticAnalysisResult } from './semanticAccessibilityAnalyzer';

export interface EnhancedScanResult {
    url: string;
    timestamp: string;

    // Core axe-core results
    violations: any[];
    passes: any[];
    incomplete: any[];
    inapplicable: any[];

    // Advanced algorithmic results
    advancedViolations: AdvancedAccessibilityResult[];
    semanticIssues: SemanticAnalysisResult[];

    // Comprehensive scoring
    scores: {
        overall: number;
        wcagA: number;
        wcagAA: number;
        wcagAAA: number;
        semantic: number;
        cognitive: number;
    };

    // Compliance assessment
    compliance: {
        level: 'A' | 'AA' | 'AAA' | 'Non-compliant';
        passRate: number;
        criticalIssues: number;
        totalTests: number;
    };

    // Performance metrics
    scanDuration: number;
    elementsAnalyzed: number;

    // AI insights (optional)
    aiInsights?: {
        summary: string;
        priorityRecommendations: string[];
        estimatedFixTime: string;
    };
}

export interface ScanOptions {
    includeAdvanced: boolean;
    includeSemantic: boolean;
    includeAI: boolean;
    wcagLevel: 'A' | 'AA' | 'AAA';
    tags?: string[];
}

export class EnhancedAccessibilityScanner {
    private document: Document;
    private options: ScanOptions;

    constructor(document: Document, options: Partial<ScanOptions> = {}) {
        this.document = document;
        this.options = {
            includeAdvanced: true,
            includeSemantic: true,
            includeAI: false,
            wcagLevel: 'AA',
            ...options
        };
    }

    /**
     * Run comprehensive accessibility scan
     */
    public async scan(): Promise<EnhancedScanResult> {
        const startTime = performance.now();

        // Configure axe-core based on WCAG level
        const axeConfig = this.getAxeConfiguration();

        try {
            // Run axe-core analysis
            const axeResults = await axe.run(this.document, axeConfig) as any;

            // Initialize result object
            const result: EnhancedScanResult = {
                url: window.location.href,
                timestamp: new Date().toISOString(),
                violations: axeResults.violations,
                passes: axeResults.passes,
                incomplete: axeResults.incomplete,
                inapplicable: axeResults.inapplicable,
                advancedViolations: [],
                semanticIssues: [],
                scores: {
                    overall: 0,
                    wcagA: 0,
                    wcagAA: 0,
                    wcagAAA: 0,
                    semantic: 0,
                    cognitive: 0
                },
                compliance: {
                    level: 'Non-compliant',
                    passRate: 0,
                    criticalIssues: 0,
                    totalTests: 0
                },
                scanDuration: 0,
                elementsAnalyzed: this.document.querySelectorAll('*').length
            };

            // Run advanced algorithmic analysis
            if (this.options.includeAdvanced) {
                const advancedEngine = new AdvancedAccessibilityEngine(this.document);
                result.advancedViolations = advancedEngine.analyze();
            }

            // Run semantic analysis
            if (this.options.includeSemantic) {
                const semanticAnalyzer = new SemanticAccessibilityAnalyzer(this.document);
                result.semanticIssues = semanticAnalyzer.analyze();
            }

            // Calculate comprehensive scores
            result.scores = this.calculateScores(result);
            result.compliance = this.assessCompliance(result);

            // Add AI insights if enabled
            if (this.options.includeAI) {
                result.aiInsights = await this.generateAIInsights(result);
            }

            result.scanDuration = performance.now() - startTime;

            return result;

        } catch (error) {
            throw new Error(`Accessibility scan failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Configure axe-core based on WCAG level and options
     */
    private getAxeConfiguration(): any {
        const baseConfig: any = {
            rules: {},
            tags: [] as string[],
            reporter: 'v2'
        };

        // Configure rules based on WCAG level
        switch (this.options.wcagLevel) {
            case 'A':
                baseConfig.tags = ['wcag2a'];
                break;
            case 'AA':
                baseConfig.tags = ['wcag2a', 'wcag2aa'];
                break;
            case 'AAA':
                baseConfig.tags = ['wcag2a', 'wcag2aa', 'wcag2aaa'];
                break;
        }

        // Add custom tags if specified
        if (this.options.tags) {
            baseConfig.tags.push(...this.options.tags);
        }

        // Enhanced rule configuration for comprehensive testing
        baseConfig.rules = {
            // Ensure all color contrast rules are enabled
            'color-contrast': { enabled: true },
            'color-contrast-enhanced': { enabled: this.options.wcagLevel === 'AAA' },

            // Focus management
            'focus-order-semantics': { enabled: true },
            'tabindex': { enabled: true },

            // ARIA and semantics
            'aria-allowed-attr': { enabled: true },
            'aria-required-attr': { enabled: true },
            'aria-roles': { enabled: true },
            'aria-valid-attr-value': { enabled: true },
            'aria-valid-attr': { enabled: true },

            // Form accessibility
            'label': { enabled: true },
            'form-field-multiple-labels': { enabled: true },

            // Images
            'image-alt': { enabled: true },
            'image-redundant-alt': { enabled: true },

            // Page structure
            'page-has-heading-one': { enabled: true },
            'heading-order': { enabled: true },
            'landmark-one-main': { enabled: true },
            'region': { enabled: true },

            // Language
            'html-has-lang': { enabled: true },
            'html-lang-valid': { enabled: true },
            'valid-lang': { enabled: true }
        };

        return baseConfig;
    }

    /**
     * Calculate comprehensive accessibility scores
     */
    private calculateScores(result: EnhancedScanResult): EnhancedScanResult['scores'] {
        const totalTests = result.violations.length + result.passes.length + result.incomplete.length;
        const basePasses = result.passes.length;

        // Base axe-core score
        const axeScore = totalTests > 0 ? (basePasses / totalTests) * 100 : 100;

        // Advanced violations penalty
        const advancedPenalty = result.advancedViolations.reduce((penalty, violation) => {
            const severityWeight = {
                critical: 25,
                serious: 15,
                moderate: 8,
                minor: 3
            };
            return penalty + (severityWeight[violation.severity] || 0);
        }, 0);

        // Semantic issues penalty
        const semanticPenalty = result.semanticIssues.reduce((penalty, issue) => {
            const severityWeight = {
                critical: 20,
                serious: 12,
                moderate: 6,
                minor: 2
            };
            return penalty + (severityWeight[issue.severity] || 0);
        }, 0);

        // Calculate WCAG level scores
        const wcagAViolations = result.violations.filter(v =>
            v.tags.includes('wcag2a')
        ).length;
        const wcagAAViolations = result.violations.filter(v =>
            v.tags.includes('wcag2aa')
        ).length;
        const wcagAAAViolations = result.violations.filter(v =>
            v.tags.includes('wcag2aaa')
        ).length;

        const wcagAPasses = result.passes.filter(p =>
            p.tags.includes('wcag2a')
        ).length;
        const wcagAAPasses = result.passes.filter(p =>
            p.tags.includes('wcag2aa')
        ).length;
        const wcagAAAPasses = result.passes.filter(p =>
            p.tags.includes('wcag2aaa')
        ).length;

        const wcagATotal = wcagAViolations + wcagAPasses;
        const wcagAATotal = wcagAAViolations + wcagAAPasses;
        const wcagAAATotal = wcagAAAViolations + wcagAAAPasses;

        // Cognitive load assessment
        const cognitiveScore = this.calculateCognitiveScore(result.semanticIssues);

        return {
            overall: Math.max(0, Math.min(100, axeScore - (advancedPenalty + semanticPenalty) / 2)),
            wcagA: wcagATotal > 0 ? (wcagAPasses / wcagATotal) * 100 : 100,
            wcagAA: wcagAATotal > 0 ? (wcagAAPasses / wcagAATotal) * 100 : 100,
            wcagAAA: wcagAAATotal > 0 ? (wcagAAAPasses / wcagAAATotal) * 100 : 100,
            semantic: Math.max(0, 100 - semanticPenalty),
            cognitive: cognitiveScore
        };
    }

    /**
     * Assess overall compliance level
     */
    private assessCompliance(result: EnhancedScanResult): EnhancedScanResult['compliance'] {
        const totalTests = result.violations.length + result.passes.length + result.incomplete.length;
        const passRate = totalTests > 0 ? (result.passes.length / totalTests) * 100 : 100;

        const criticalViolations = result.violations.filter(v =>
            v.impact === 'critical'
        ).length;

        const advancedCritical = result.advancedViolations.filter(v =>
            v.severity === 'critical'
        ).length;

        const semanticCritical = result.semanticIssues.filter(i =>
            i.severity === 'critical'
        ).length;

        const totalCritical = criticalViolations + advancedCritical + semanticCritical;

        // Determine compliance level
        let level: 'A' | 'AA' | 'AAA' | 'Non-compliant' = 'Non-compliant';

        if (totalCritical === 0) {
            if (result.scores.wcagAAA >= 95) {
                level = 'AAA';
            } else if (result.scores.wcagAA >= 90) {
                level = 'AA';
            } else if (result.scores.wcagA >= 85) {
                level = 'A';
            }
        }

        return {
            level,
            passRate,
            criticalIssues: totalCritical,
            totalTests: totalTests + result.advancedViolations.length + result.semanticIssues.length
        };
    }

    /**
     * Calculate cognitive accessibility score
     */
    private calculateCognitiveScore(semanticIssues: SemanticAnalysisResult[]): number {
        const cognitiveIssues = semanticIssues.filter(issue =>
            issue.category === 'cognitive'
        );

        if (cognitiveIssues.length === 0) return 100;

        const totalCognitiveLoad = cognitiveIssues.reduce((sum, issue) => {
            return sum + issue.elements.reduce((elementSum, element) => {
                return elementSum + element.cognitiveLoad;
            }, 0);
        }, 0);

        // Normalize to 0-100 scale (assuming max cognitive load of 50)
        return Math.max(0, 100 - (totalCognitiveLoad / 50) * 100);
    }

    /**
     * Generate AI-powered insights (placeholder for future AI integration)
     */
    private async generateAIInsights(result: EnhancedScanResult): Promise<EnhancedScanResult['aiInsights']> {
        // This would integrate with AI services like OpenAI, Gemini, etc.
        // For now, return rule-based insights

        const totalIssues = result.violations.length + result.advancedViolations.length + result.semanticIssues.length;
        const criticalIssues = result.compliance.criticalIssues;

        let summary = '';
        let estimatedTime = '';

        if (totalIssues === 0) {
            summary = 'Excellent accessibility implementation! No significant issues found.';
            estimatedTime = '0 hours';
        } else if (criticalIssues > 0) {
            summary = `Found ${criticalIssues} critical accessibility barriers that prevent users from accessing content.`;
            estimatedTime = `${Math.ceil(criticalIssues * 2)} hours`;
        } else {
            summary = `Found ${totalIssues} accessibility improvements that would enhance user experience.`;
            estimatedTime = `${Math.ceil(totalIssues * 0.5)} hours`;
        }

        const priorityRecommendations = this.generatePriorityRecommendations(result);

        return {
            summary,
            priorityRecommendations,
            estimatedFixTime: estimatedTime
        };
    }

    /**
     * Generate priority recommendations based on scan results
     */
    private generatePriorityRecommendations(result: EnhancedScanResult): string[] {
        const recommendations: string[] = [];

        // Critical issues first
        const criticalViolations = result.violations.filter(v => v.impact === 'critical');
        if (criticalViolations.length > 0) {
            recommendations.push(`Fix ${criticalViolations.length} critical accessibility violations immediately`);
        }

        // Color contrast issues
        const contrastIssues = result.violations.filter(v => v.id.includes('color-contrast'));
        if (contrastIssues.length > 0) {
            recommendations.push('Improve color contrast ratios for better readability');
        }

        // Keyboard accessibility
        const keyboardIssues = result.advancedViolations.filter(v => v.category === 'keyboard');
        if (keyboardIssues.length > 0) {
            recommendations.push('Ensure all interactive elements are keyboard accessible');
        }

        // Form accessibility
        const formIssues = result.violations.filter(v =>
            v.id.includes('label') || v.id.includes('form')
        );
        if (formIssues.length > 0) {
            recommendations.push('Add proper labels to all form controls');
        }

        // Semantic structure
        const structureIssues = result.advancedViolations.filter(v => v.category === 'structure');
        if (structureIssues.length > 0) {
            recommendations.push('Improve page structure with proper headings and landmarks');
        }

        // Cognitive accessibility
        const cognitiveIssues = result.semanticIssues.filter(i => i.category === 'cognitive');
        if (cognitiveIssues.length > 0) {
            recommendations.push('Simplify content language and structure for cognitive accessibility');
        }

        return recommendations.slice(0, 5); // Top 5 recommendations
    }

    /**
     * Export detailed report
     */
    public exportReport(result: EnhancedScanResult, format: 'json' | 'csv' | 'pdf' = 'json'): string | Blob {
        switch (format) {
            case 'json':
                return JSON.stringify(result, null, 2);

            case 'csv':
                return this.generateCSVReport(result);

            case 'pdf':
                // Would generate PDF report - placeholder for now
                return new Blob(['PDF report generation coming soon'], { type: 'text/plain' });

            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
    }

    /**
     * Generate CSV report
     */
    private generateCSVReport(result: EnhancedScanResult): string {
        const headers = [
            'Type', 'Severity', 'Rule ID', 'Description', 'Element', 'WCAG Criterion', 'Fix Suggestion'
        ];

        const rows: string[][] = [headers];

        // Add axe-core violations
        result.violations.forEach(violation => {
            violation.nodes.forEach((node: any) => {
                rows.push([
                    'Axe Core Violation',
                    violation.impact || 'unknown',
                    violation.id,
                    violation.description,
                    node.target.join(', '),
                    violation.tags.filter((tag: string) => tag.startsWith('wcag')).join(', '),
                    violation.help
                ]);
            });
        });

        // Add advanced violations
        result.advancedViolations.forEach(violation => {
            violation.elements.forEach(element => {
                rows.push([
                    'Advanced Analysis',
                    violation.severity,
                    violation.testId,
                    violation.description,
                    element.selector,
                    violation.wcagCriterion,
                    element.suggestion
                ]);
            });
        });

        // Add semantic issues
        result.semanticIssues.forEach(issue => {
            issue.elements.forEach(element => {
                rows.push([
                    'Semantic Analysis',
                    issue.severity,
                    issue.testId,
                    issue.description,
                    element.selector,
                    'Semantic/Cognitive',
                    issue.suggestedFixes.join('; ')
                ]);
            });
        });

        return rows.map(row =>
            row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
        ).join('\n');
    }
}
