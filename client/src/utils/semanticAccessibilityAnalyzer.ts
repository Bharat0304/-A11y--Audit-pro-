/**
 * AI-Powered Semantic Accessibility Analyzer
 * Uses advanced heuristics and optional AI integration for deep accessibility insights
 */

export interface SemanticAnalysisResult {
    testId: string;
    category: 'semantic' | 'context' | 'ux' | 'cognitive';
    severity: 'critical' | 'serious' | 'moderate' | 'minor';
    title: string;
    description: string;
    aiExplanation?: string;
    suggestedFixes: string[];
    elements: Array<{
        selector: string;
        context: string;
        semanticIssue: string;
        cognitiveLoad: number; // 1-10 scale
    }>;
    confidence: number; // 0-100
}

export interface ContentAnalysis {
    readabilityScore: number;
    cognitiveComplexity: number;
    languageLevel: string;
    issues: string[];
}

export class SemanticAccessibilityAnalyzer {
    private document: Document;
    private contentText: string;

    constructor(document: Document) {
        this.document = document;
        this.contentText = this.extractMainContent();
    }

    /**
     * Analyze semantic accessibility issues
     */
    public analyze(): SemanticAnalysisResult[] {
        const results: SemanticAnalysisResult[] = [];

        results.push(...this.analyzeContentReadability());
        results.push(...this.analyzeNavigationSemantics());
        results.push(...this.analyzeCognitiveLoad());
        results.push(...this.analyzeLanguageClarity());
        results.push(...this.analyzeUserFlowPatterns());

        return results;
    }

    /**
     * Content Readability Analysis (WCAG 3.1.5)
     */
    private analyzeContentReadability(): SemanticAnalysisResult[] {
        const results: SemanticAnalysisResult[] = [];
        const textBlocks = this.getTextBlocks();

        textBlocks.forEach((block, index) => {
            const analysis = this.calculateReadabilityMetrics(block.text);

            if (analysis.readabilityScore < 60) { // Below high school level
                results.push({
                    testId: 'content-readability',
                    category: 'cognitive',
                    severity: analysis.readabilityScore < 40 ? 'serious' : 'moderate',
                    title: 'Content May Be Too Complex',
                    description: `Text complexity score: ${analysis.readabilityScore}/100. Content may be difficult for users with cognitive disabilities.`,
                    aiExplanation: this.generateReadabilityExplanation(analysis),
                    suggestedFixes: [
                        'Use shorter sentences (aim for 15-20 words)',
                        'Replace complex words with simpler alternatives',
                        'Break long paragraphs into smaller chunks',
                        'Add headings to organize content',
                        'Consider providing a simplified version'
                    ],
                    elements: [{
                        selector: this.getElementSelector(block.element),
                        context: block.text.substring(0, 100) + '...',
                        semanticIssue: 'High cognitive complexity',
                        cognitiveLoad: Math.round((100 - analysis.readabilityScore) / 10)
                    }],
                    confidence: 85
                });
            }
        });

        return results;
    }

    /**
     * Navigation Semantics Analysis
     */
    private analyzeNavigationSemantics(): SemanticAnalysisResult[] {
        const results: SemanticAnalysisResult[] = [];
        const navigationElements = this.document.querySelectorAll('nav, [role="navigation"]');
        const links = this.document.querySelectorAll('a[href]');

        // Analyze link context and clarity
        const ambiguousLinks: Element[] = [];

        links.forEach(link => {
            const linkText = link.textContent?.trim() || '';
            const ariaLabel = link.getAttribute('aria-label') || '';
            const title = link.getAttribute('title') || '';

            const effectiveText = ariaLabel || linkText || title;

            if (this.isAmbiguousLinkText(effectiveText)) {
                ambiguousLinks.push(link);
            }
        });

        if (ambiguousLinks.length > 0) {
            results.push({
                testId: 'ambiguous-link-text',
                category: 'semantic',
                severity: 'moderate',
                title: 'Ambiguous Link Text Detected',
                description: 'Links should have clear, descriptive text that makes sense out of context.',
                aiExplanation: 'Screen reader users often navigate by jumping from link to link. Generic phrases like "click here" or "read more" don\'t provide meaningful context about the destination or purpose.',
                suggestedFixes: [
                    'Replace "click here" with descriptive text about the destination',
                    'Add context to "read more" links (e.g., "read more about accessibility")',
                    'Use aria-label to provide additional context while keeping visual text short',
                    'Ensure link purpose is clear from the link text alone'
                ],
                elements: ambiguousLinks.slice(0, 10).map(link => ({
                    selector: this.getElementSelector(link),
                    context: this.getLinkContext(link),
                    semanticIssue: `Ambiguous text: "${link.textContent?.trim()}"`,
                    cognitiveLoad: 6
                })),
                confidence: 90
            });
        }

        return results;
    }

    /**
     * Cognitive Load Analysis
     */
    private analyzeCognitiveLoad(): SemanticAnalysisResult[] {
        const results: SemanticAnalysisResult[] = [];

        // Analyze form complexity
        const forms = this.document.querySelectorAll('form');

        forms.forEach(form => {
            const formFields = form.querySelectorAll('input, select, textarea');
            const complexity = this.calculateFormComplexity(form);

            if (complexity.score > 7) { // High cognitive load
                results.push({
                    testId: 'high-cognitive-load-form',
                    category: 'cognitive',
                    severity: complexity.score > 8.5 ? 'serious' : 'moderate',
                    title: 'Form May Be Too Complex',
                    description: `Form complexity score: ${complexity.score}/10. Consider breaking into smaller steps or providing additional guidance.`,
                    aiExplanation: this.generateFormComplexityExplanation(complexity),
                    suggestedFixes: [
                        'Break long forms into multiple steps with progress indicators',
                        'Group related fields with fieldsets and legends',
                        'Provide clear instructions and examples',
                        'Use progressive disclosure for optional fields',
                        'Add inline validation with helpful error messages'
                    ],
                    elements: [{
                        selector: this.getElementSelector(form),
                        context: `Form with ${formFields.length} fields`,
                        semanticIssue: `High complexity: ${complexity.issues.join(', ')}`,
                        cognitiveLoad: Math.round(complexity.score)
                    }],
                    confidence: 80
                });
            }
        });

        return results;
    }

    /**
     * Language Clarity Analysis
     */
    private analyzeLanguageClarity(): SemanticAnalysisResult[] {
        const results: SemanticAnalysisResult[] = [];

        // Check for jargon and technical terms
        const jargonTerms = this.detectJargon(this.contentText);

        if (jargonTerms.length > 0) {
            results.push({
                testId: 'technical-jargon',
                category: 'cognitive',
                severity: 'minor',
                title: 'Technical Jargon Detected',
                description: 'Content contains technical terms that may need explanation for general audiences.',
                aiExplanation: 'Technical jargon can create barriers for users with varying levels of expertise or cognitive disabilities. Consider providing definitions or simpler alternatives.',
                suggestedFixes: [
                    'Provide a glossary for technical terms',
                    'Use simpler language where possible',
                    'Add explanatory tooltips or expandable definitions',
                    'Include examples to illustrate complex concepts'
                ],
                elements: jargonTerms.slice(0, 5).map(term => ({
                    selector: 'body',
                    context: term.context,
                    semanticIssue: `Technical term: "${term.word}"`,
                    cognitiveLoad: 4
                })),
                confidence: 70
            });
        }

        return results;
    }

    /**
     * User Flow Pattern Analysis
     */
    private analyzeUserFlowPatterns(): SemanticAnalysisResult[] {
        const results: SemanticAnalysisResult[] = [];

        // Analyze page structure and flow
        const flowIssues = this.analyzePageFlow();

        if (flowIssues.length > 0) {
            results.push({
                testId: 'user-flow-issues',
                category: 'ux',
                severity: 'moderate',
                title: 'User Flow Pattern Issues',
                description: 'Page structure may create confusion in user navigation flow.',
                aiExplanation: 'Clear, logical flow helps all users, especially those with cognitive disabilities, understand and navigate content effectively.',
                suggestedFixes: [
                    'Organize content in logical, hierarchical order',
                    'Use consistent navigation patterns throughout the site',
                    'Provide clear page titles and section headings',
                    'Add breadcrumbs for complex navigation structures'
                ],
                elements: flowIssues.map(issue => ({
                    selector: issue.selector,
                    context: issue.description,
                    semanticIssue: issue.type,
                    cognitiveLoad: issue.severity
                })),
                confidence: 75
            });
        }

        return results;
    }

    // Utility methods
    private extractMainContent(): string {
        const main = this.document.querySelector('main, [role="main"], .main-content, #main-content');
        if (main) {
            return main.textContent || '';
        }

        // Fallback: extract text from body, excluding nav, aside, footer
        const clone = this.document.body.cloneNode(true) as Element;
        const excludeSelectors = ['nav', 'aside', 'footer', '[role="navigation"]', '[role="complementary"]', '[role="contentinfo"]'];

        excludeSelectors.forEach(selector => {
            const elements = clone.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });

        return clone.textContent || '';
    }

    private getTextBlocks(): Array<{ element: Element; text: string }> {
        const blocks: Array<{ element: Element; text: string }> = [];
        const textElements = this.document.querySelectorAll('p, div, li, td, th');

        textElements.forEach(element => {
            const text = element.textContent?.trim() || '';
            if (text.length > 50) { // Only analyze substantial text blocks
                blocks.push({ element, text });
            }
        });

        return blocks;
    }

    private calculateReadabilityMetrics(text: string): ContentAnalysis {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const syllables = words.reduce((count, word) => count + this.countSyllables(word), 0);

        // Flesch Reading Ease Score
        const avgSentenceLength = words.length / sentences.length;
        const avgSyllablesPerWord = syllables / words.length;
        const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);

        // Cognitive complexity factors
        const complexWords = words.filter(word => this.countSyllables(word) > 2).length;
        const complexWordRatio = complexWords / words.length;

        return {
            readabilityScore: Math.max(0, Math.min(100, fleschScore)),
            cognitiveComplexity: complexWordRatio * 100,
            languageLevel: this.getReadingLevel(fleschScore),
            issues: this.identifyReadabilityIssues(avgSentenceLength, complexWordRatio)
        };
    }

    private countSyllables(word: string): number {
        word = word.toLowerCase();
        if (word.length <= 3) return 1;

        const vowels = word.match(/[aeiouy]+/g);
        let count = vowels ? vowels.length : 1;

        if (word.endsWith('e')) count--;
        if (count === 0) count = 1;

        return count;
    }

    private getReadingLevel(fleschScore: number): string {
        if (fleschScore >= 90) return 'Elementary School';
        if (fleschScore >= 80) return 'Middle School';
        if (fleschScore >= 70) return 'High School';
        if (fleschScore >= 60) return 'College Level';
        if (fleschScore >= 50) return 'Graduate Level';
        return 'Post-Graduate Level';
    }

    private identifyReadabilityIssues(avgSentenceLength: number, complexWordRatio: number): string[] {
        const issues: string[] = [];

        if (avgSentenceLength > 25) {
            issues.push('Sentences are too long (average > 25 words)');
        }

        if (complexWordRatio > 0.2) {
            issues.push('Too many complex words (> 20% have 3+ syllables)');
        }

        return issues;
    }

    private isAmbiguousLinkText(text: string): boolean {
        const ambiguousPatterns = [
            /^(click here|here|more|read more|link|this|that)$/i,
            /^(learn more|find out|discover|explore)$/i,
            /^(download|view|see|check out)$/i,
            /^\d+$/,
            /^(continue|next|previous|back)$/i
        ];

        return ambiguousPatterns.some(pattern => pattern.test(text.trim())) || text.trim().length < 3;
    }

    private getLinkContext(link: Element): string {
        const surroundingText = this.getSurroundingText(link, 50);
        const href = link.getAttribute('href') || '';
        return `"${link.textContent?.trim()}" -> ${href} (Context: ${surroundingText})`;
    }

    private getSurroundingText(element: Element, maxLength: number): string {
        const parent = element.parentElement;
        if (!parent) return '';

        const text = parent.textContent || '';
        const elementText = element.textContent || '';
        const index = text.indexOf(elementText);

        const start = Math.max(0, index - maxLength / 2);
        const end = Math.min(text.length, index + elementText.length + maxLength / 2);

        return text.substring(start, end).trim();
    }

    private calculateFormComplexity(form: Element): { score: number; issues: string[] } {
        const fields = form.querySelectorAll('input, select, textarea');
        const requiredFields = form.querySelectorAll('[required]');
        const selects = form.querySelectorAll('select');
        const textareas = form.querySelectorAll('textarea');
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        const radios = form.querySelectorAll('input[type="radio"]');

        let score = 0;
        const issues: string[] = [];

        // Base complexity from field count
        score += Math.min(fields.length * 0.3, 4);

        // Required fields add complexity
        score += requiredFields.length * 0.2;

        // Complex field types
        score += selects.length * 0.4;
        score += textareas.length * 0.3;

        // Choice complexity
        if (checkboxes.length > 5) {
            score += 1;
            issues.push('Many checkbox options');
        }

        if (radios.length > 5) {
            score += 0.8;
            issues.push('Many radio button options');
        }

        // Missing helpful features
        const hasFieldsets = form.querySelectorAll('fieldset').length > 0;
        const hasHelpText = form.querySelectorAll('[aria-describedby]').length > 0;

        if (!hasFieldsets && fields.length > 5) {
            score += 1;
            issues.push('No field grouping');
        }

        if (!hasHelpText) {
            score += 0.5;
            issues.push('No help text');
        }

        return { score: Math.min(score, 10), issues };
    }

    private detectJargon(text: string): Array<{ word: string; context: string }> {
        // Common technical terms that might need explanation
        const jargonPatterns = [
            /\b(API|SDK|SaaS|B2B|B2C|ROI|KPI|SEO|SEM|CRM|ERP|AI|ML|IoT|VPN|SSL|HTTP|HTTPS|URL|URI|JSON|XML|CSV|PDF)\b/gi,
            /\b(algorithm|authentication|encryption|database|server|client|backend|frontend|middleware|framework|deployment|repository)\b/gi,
            /\b(optimization|analytics|metrics|conversion|engagement|acquisition|retention|monetization|scalability|latency)\b/gi
        ];

        const jargonTerms: Array<{ word: string; context: string }> = [];

        jargonPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const word = match[0];
                const start = Math.max(0, match.index - 30);
                const end = Math.min(text.length, match.index + word.length + 30);
                const context = text.substring(start, end);

                jargonTerms.push({ word, context });
            }
        });

        return jargonTerms;
    }

    private analyzePageFlow(): Array<{ selector: string; description: string; type: string; severity: number }> {
        const issues: Array<{ selector: string; description: string; type: string; severity: number }> = [];

        // Check heading hierarchy
        const headings = Array.from(this.document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        let previousLevel = 0;

        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));

            if (index === 0 && level !== 1) {
                issues.push({
                    selector: this.getElementSelector(heading),
                    description: 'First heading is not H1',
                    type: 'Missing primary heading',
                    severity: 7
                });
            }

            if (level > previousLevel + 1) {
                issues.push({
                    selector: this.getElementSelector(heading),
                    description: `Heading jumps from H${previousLevel} to H${level}`,
                    type: 'Heading hierarchy skip',
                    severity: 5
                });
            }

            previousLevel = level;
        });

        // Check for logical content order
        const main = this.document.querySelector('main, [role="main"]');
        if (!main) {
            issues.push({
                selector: 'body',
                description: 'No main content area identified',
                type: 'Missing main landmark',
                severity: 6
            });
        }

        return issues;
    }

    private getElementSelector(element: Element): string {
        if (element.id) return `#${element.id}`;
        if (element.className) return `${element.tagName.toLowerCase()}.${element.className.split(' ')[0]}`;
        return element.tagName.toLowerCase();
    }

    private generateReadabilityExplanation(analysis: ContentAnalysis): string {
        return `This content has a reading level of "${analysis.languageLevel}" with a Flesch score of ${analysis.readabilityScore.toFixed(1)}. ` +
            `To improve accessibility for users with cognitive disabilities, consider simplifying language and sentence structure. ` +
            `Issues identified: ${analysis.issues.join(', ')}.`;
    }

    private generateFormComplexityExplanation(complexity: { score: number; issues: string[] }): string {
        return `This form has a complexity score of ${complexity.score.toFixed(1)}/10. ` +
            `High complexity can overwhelm users, especially those with cognitive disabilities. ` +
            `Main issues: ${complexity.issues.join(', ')}. Consider progressive disclosure and clear guidance.`;
    }
}
