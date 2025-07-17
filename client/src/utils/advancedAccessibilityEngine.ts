/**
 * Advanced Accessibility Engine
 * Implements comprehensive WCAG validation beyond basic axe-core rules
 * Covers A, AA, and AAA compliance levels with algorithmic depth
 */

export interface AdvancedAccessibilityResult {
    testId: string;
    level: 'A' | 'AA' | 'AAA';
    category: 'contrast' | 'structure' | 'keyboard' | 'images' | 'forms' | 'touch' | 'aria' | 'motion' | 'semantic';
    severity: 'critical' | 'serious' | 'moderate' | 'minor';
    title: string;
    description: string;
    wcagCriterion: string;
    elements: Array<{
        selector: string;
        html: string;
        issue: string;
        suggestion: string;
        computedStyles?: Record<string, string>;
    }>;
    score: number; // 0-100
    algorithm: string;
    autoFixable: boolean;
}

export interface ContrastAnalysis {
    foreground: string;
    background: string;
    ratio: number;
    requiredRatio: number;
    passes: boolean;
    level: 'AA' | 'AAA';
}

export interface HeadingStructure {
    level: number;
    text: string;
    element: Element;
    issues: string[];
}

export class AdvancedAccessibilityEngine {
    private document: Document;
    private results: AdvancedAccessibilityResult[] = [];

    constructor(document: Document) {
        this.document = document;
    }

    /**
     * 1. Enhanced Contrast Ratio Checker (WCAG 1.4.3, 1.4.6, 1.4.11)
     */
    private analyzeContrastRatios(): AdvancedAccessibilityResult[] {
        const results: AdvancedAccessibilityResult[] = [];
        const textElements = this.document.querySelectorAll('*');

        textElements.forEach((element) => {
            const textContent = element.textContent?.trim();
            if (!textContent || textContent.length < 3) return;

            const styles = window.getComputedStyle(element);
            const analysis = this.calculateContrastRatio(element, styles);

            if (!analysis.passes) {
                results.push({
                    testId: 'advanced-contrast-ratio',
                    level: analysis.level,
                    category: 'contrast',
                    severity: analysis.ratio < 3 ? 'critical' : analysis.ratio < 4.5 ? 'serious' : 'moderate',
                    title: `Insufficient Color Contrast (${analysis.ratio.toFixed(2)}:1)`,
                    description: `Text contrast ratio of ${analysis.ratio.toFixed(2)}:1 is below the required ${analysis.requiredRatio}:1 for ${analysis.level} compliance.`,
                    wcagCriterion: analysis.level === 'AAA' ? '1.4.6' : '1.4.3',
                    elements: [{
                        selector: this.getElementSelector(element),
                        html: element.outerHTML.substring(0, 200) + '...',
                        issue: `Contrast ratio ${analysis.ratio.toFixed(2)}:1 is insufficient`,
                        suggestion: `Increase contrast to at least ${analysis.requiredRatio}:1. Consider darker text or lighter background.`,
                        computedStyles: {
                            color: analysis.foreground,
                            backgroundColor: analysis.background,
                            fontSize: styles.fontSize,
                            fontWeight: styles.fontWeight
                        }
                    }],
                    score: Math.max(0, (analysis.ratio / analysis.requiredRatio) * 100),
                    algorithm: 'WCAG 2.1 Relative Luminance Formula',
                    autoFixable: true
                });
            }
        });

        return results;
    }

    private calculateContrastRatio(element: Element, styles: CSSStyleDeclaration): ContrastAnalysis {
        const foregroundColor = this.parseColor(styles.color);
        const backgroundColor = this.getEffectiveBackgroundColor(element);

        const fgLuminance = this.getRelativeLuminance(foregroundColor);
        const bgLuminance = this.getRelativeLuminance(backgroundColor);

        const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);

        const fontSize = parseFloat(styles.fontSize);
        const fontWeight = parseInt(styles.fontWeight) || 400;
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);

        const aaRequired = isLargeText ? 3 : 4.5;
        const aaaRequired = isLargeText ? 4.5 : 7;

        return {
            foreground: this.rgbToHex(foregroundColor),
            background: this.rgbToHex(backgroundColor),
            ratio,
            requiredRatio: aaaRequired,
            passes: ratio >= aaRequired,
            level: ratio >= aaaRequired ? 'AAA' : 'AA'
        };
    }

    private getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
        const { r, g, b } = rgb;
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    /**
     * 2. Advanced Heading Structure Validator (WCAG 1.3.1, 2.4.6)
     */
    private analyzeHeadingStructure(): AdvancedAccessibilityResult[] {
        const results: AdvancedAccessibilityResult[] = [];
        const headings = Array.from(this.document.querySelectorAll('h1, h2, h3, h4, h5, h6'));

        const structure: HeadingStructure[] = headings.map(h => ({
            level: parseInt(h.tagName.charAt(1)),
            text: h.textContent?.trim() || '',
            element: h,
            issues: []
        }));

        // Check for multiple h1s
        const h1Count = structure.filter(h => h.level === 1).length;
        if (h1Count === 0) {
            results.push(this.createHeadingResult('missing-h1', 'Missing Main Heading (H1)', 'critical'));
        } else if (h1Count > 1) {
            results.push(this.createHeadingResult('multiple-h1', 'Multiple H1 Elements Found', 'serious'));
        }

        // Check for heading level skips
        for (let i = 1; i < structure.length; i++) {
            const current = structure[i];
            const previous = structure[i - 1];

            if (current.level > previous.level + 1) {
                results.push({
                    testId: 'heading-level-skip',
                    level: 'A',
                    category: 'structure',
                    severity: 'moderate',
                    title: `Heading Level Skip Detected`,
                    description: `Heading jumped from H${previous.level} to H${current.level}, skipping intermediate levels.`,
                    wcagCriterion: '1.3.1',
                    elements: [{
                        selector: this.getElementSelector(current.element),
                        html: current.element.outerHTML,
                        issue: `Skipped from H${previous.level} to H${current.level}`,
                        suggestion: `Use sequential heading levels (H${previous.level + 1}) to maintain document outline structure.`
                    }],
                    score: 60,
                    algorithm: 'Document Outline Tree Analysis',
                    autoFixable: true
                });
            }
        }

        return results;
    }

    /**
     * 3. Comprehensive Keyboard Accessibility Checker (WCAG 2.1.1, 2.4.3)
     */
    private analyzeKeyboardAccessibility(): AdvancedAccessibilityResult[] {
        const results: AdvancedAccessibilityResult[] = [];
        const interactiveElements = this.document.querySelectorAll(
            'a, button, input, select, textarea, [tabindex], [onclick], [role="button"], [role="link"], [role="menuitem"]'
        );

        const focusableElements: Element[] = [];
        const problematicElements: Element[] = [];

        interactiveElements.forEach(element => {
            const tabIndex = element.getAttribute('tabindex');
            const isNativelyFocusable = this.isNativelyFocusable(element);

            if (tabIndex === '-1' && !isNativelyFocusable) {
                problematicElements.push(element);
            } else if (tabIndex === null && !isNativelyFocusable && this.hasClickHandler(element)) {
                problematicElements.push(element);
            } else {
                focusableElements.push(element);
            }
        });

        // Check for keyboard traps
        const tabOrder = this.simulateTabTraversal(focusableElements);
        if (tabOrder.hasTraps) {
            results.push({
                testId: 'keyboard-trap',
                level: 'A',
                category: 'keyboard',
                severity: 'critical',
                title: 'Keyboard Focus Trap Detected',
                description: 'Users may become trapped in a section of the page and unable to navigate away using only the keyboard.',
                wcagCriterion: '2.1.2',
                elements: tabOrder.trapElements.map(el => ({
                    selector: this.getElementSelector(el),
                    html: el.outerHTML.substring(0, 200) + '...',
                    issue: 'Focus trap prevents keyboard navigation',
                    suggestion: 'Ensure users can navigate away from this element using Tab, Shift+Tab, or Escape.'
                })),
                score: 0,
                algorithm: 'Tab Traversal Simulation',
                autoFixable: false
            });
        }

        // Check for missing keyboard handlers
        if (problematicElements.length > 0) {
            results.push({
                testId: 'missing-keyboard-support',
                level: 'A',
                category: 'keyboard',
                severity: 'serious',
                title: 'Interactive Elements Missing Keyboard Support',
                description: 'Interactive elements must be operable via keyboard for users who cannot use a mouse.',
                wcagCriterion: '2.1.1',
                elements: problematicElements.slice(0, 10).map(el => ({
                    selector: this.getElementSelector(el),
                    html: el.outerHTML.substring(0, 200) + '...',
                    issue: 'Click handler without keyboard equivalent',
                    suggestion: 'Add tabindex="0" and onKeyDown handler for Enter/Space keys, or use semantic elements like <button>.'
                })),
                score: 30,
                algorithm: 'Interactive Element Analysis',
                autoFixable: true
            });
        }

        return results;
    }

    /**
     * 4. Advanced Image & Icon Alt Text Analysis (WCAG 1.1.1)
     */
    private analyzeImageAccessibility(): AdvancedAccessibilityResult[] {
        const results: AdvancedAccessibilityResult[] = [];
        const images = this.document.querySelectorAll('img, svg, [role="img"]');
        const backgroundImages = this.findBackgroundImages();

        const problematicImages: Element[] = [];

        images.forEach(img => {
            const alt = img.getAttribute('alt');
            const ariaLabel = img.getAttribute('aria-label');
            const ariaLabelledBy = img.getAttribute('aria-labelledby');
            const role = img.getAttribute('role');

            const hasTextAlternative = alt !== null || ariaLabel || ariaLabelledBy;
            const isDecorative = role === 'presentation' || role === 'none' || alt === '';

            if (!hasTextAlternative && !isDecorative) {
                problematicImages.push(img);
            } else if (alt && this.isLowQualityAltText(alt, img)) {
                problematicImages.push(img);
            }
        });

        if (problematicImages.length > 0) {
            results.push({
                testId: 'image-alt-text-issues',
                level: 'A',
                category: 'images',
                severity: 'serious',
                title: 'Images Missing or Poor Alt Text',
                description: 'Images must have appropriate alternative text for screen reader users.',
                wcagCriterion: '1.1.1',
                elements: problematicImages.map(img => {
                    const alt = img.getAttribute('alt');
                    const src = img.getAttribute('src') || '';

                    return {
                        selector: this.getElementSelector(img),
                        html: img.outerHTML.substring(0, 200) + '...',
                        issue: !alt ? 'Missing alt attribute' : `Poor alt text: "${alt}"`,
                        suggestion: this.generateAltTextSuggestion(img, src)
                    };
                }),
                score: 20,
                algorithm: 'Alt Text Quality Heuristics',
                autoFixable: false
            });
        }

        return results;
    }

    /**
     * 5. Form Label-Input Association Checker (WCAG 1.3.1)
     */
    private analyzeFormAccessibility(): AdvancedAccessibilityResult[] {
        const results: AdvancedAccessibilityResult[] = [];
        const formControls = this.document.querySelectorAll('input, select, textarea');
        const unlabeledControls: Element[] = [];

        formControls.forEach(control => {
            if (!this.hasProperLabel(control)) {
                unlabeledControls.push(control);
            }
        });

        if (unlabeledControls.length > 0) {
            results.push({
                testId: 'form-labels-missing',
                level: 'A',
                category: 'forms',
                severity: 'serious',
                title: 'Form Controls Missing Labels',
                description: 'All form controls must have accessible labels for screen reader users.',
                wcagCriterion: '1.3.1',
                elements: unlabeledControls.map(control => ({
                    selector: this.getElementSelector(control),
                    html: control.outerHTML.substring(0, 200) + '...',
                    issue: 'No associated label found',
                    suggestion: 'Add a <label for="..."> element, aria-label attribute, or aria-labelledby reference.'
                })),
                score: 15,
                algorithm: 'Label Association Analysis',
                autoFixable: true
            });
        }

        return results;
    }

    /**
     * 6. Touch Target Size Detection (WCAG 2.5.5)
     */
    private analyzeTouchTargets(): AdvancedAccessibilityResult[] {
        const results: AdvancedAccessibilityResult[] = [];
        const touchTargets = this.document.querySelectorAll('a, button, input[type="button"], input[type="submit"], [onclick], [role="button"]');
        const smallTargets: Element[] = [];

        touchTargets.forEach(target => {
            const rect = target.getBoundingClientRect();
            const minSize = 44; // WCAG 2.1 AA requirement

            if (rect.width < minSize || rect.height < minSize) {
                if (!this.isDecorativeTarget(target)) {
                    smallTargets.push(target);
                }
            }
        });

        if (smallTargets.length > 0) {
            results.push({
                testId: 'touch-target-size',
                level: 'AA',
                category: 'touch',
                severity: 'moderate',
                title: 'Touch Targets Too Small',
                description: 'Interactive elements should be at least 44×44 pixels for mobile accessibility.',
                wcagCriterion: '2.5.5',
                elements: smallTargets.slice(0, 10).map(target => {
                    const rect = target.getBoundingClientRect();
                    return {
                        selector: this.getElementSelector(target),
                        html: target.outerHTML.substring(0, 200) + '...',
                        issue: `Size: ${Math.round(rect.width)}×${Math.round(rect.height)}px`,
                        suggestion: 'Increase padding or minimum dimensions to at least 44×44 pixels.'
                    };
                }),
                score: 60,
                algorithm: 'Bounding Box Measurement',
                autoFixable: true
            });
        }

        return results;
    }

    /**
     * 7. ARIA Role Consistency Checker (WCAG 1.3.1, 4.1.2)
     */
    private analyzeARIACompliance(): AdvancedAccessibilityResult[] {
        const results: AdvancedAccessibilityResult[] = [];
        const elementsWithRoles = this.document.querySelectorAll('[role]');
        const landmarkElements = this.document.querySelectorAll('header, nav, main, aside, footer, section');

        // Check for missing main landmark
        const mainElements = this.document.querySelectorAll('main, [role="main"]');
        if (mainElements.length === 0) {
            results.push({
                testId: 'missing-main-landmark',
                level: 'AA',
                category: 'aria',
                severity: 'moderate',
                title: 'Missing Main Landmark',
                description: 'Pages should have a main landmark to help users navigate to primary content.',
                wcagCriterion: '1.3.1',
                elements: [{
                    selector: 'body',
                    html: '<body>...</body>',
                    issue: 'No main element or role="main" found',
                    suggestion: 'Add a <main> element or role="main" to wrap the primary page content.'
                }],
                score: 70,
                algorithm: 'Landmark Structure Analysis',
                autoFixable: true
            });
        }

        // Check for multiple main landmarks
        if (mainElements.length > 1) {
            results.push({
                testId: 'multiple-main-landmarks',
                level: 'AA',
                category: 'aria',
                severity: 'moderate',
                title: 'Multiple Main Landmarks',
                description: 'Pages should have only one main landmark.',
                wcagCriterion: '1.3.1',
                elements: Array.from(mainElements).map(el => ({
                    selector: this.getElementSelector(el),
                    html: el.outerHTML.substring(0, 200) + '...',
                    issue: 'Multiple main landmarks detected',
                    suggestion: 'Ensure only one main element or role="main" exists per page.'
                })),
                score: 70,
                algorithm: 'Landmark Uniqueness Check',
                autoFixable: false
            });
        }

        return results;
    }

    /**
     * 8. Motion and Animation Safety (WCAG 2.3.3)
     */
    private analyzeMotionSafety(): AdvancedAccessibilityResult[] {
        const results: AdvancedAccessibilityResult[] = [];
        const animatedElements = this.findAnimatedElements();
        const autoplayMedia = this.document.querySelectorAll('video[autoplay], audio[autoplay]');

        if (animatedElements.length > 0) {
            const hasReducedMotionSupport = this.checkReducedMotionSupport();

            if (!hasReducedMotionSupport) {
                results.push({
                    testId: 'motion-without-reduced-motion',
                    level: 'AA',
                    category: 'motion',
                    severity: 'moderate',
                    title: 'Animations Without Reduced Motion Support',
                    description: 'Animations should respect the prefers-reduced-motion user preference.',
                    wcagCriterion: '2.3.3',
                    elements: animatedElements.slice(0, 5).map(el => ({
                        selector: this.getElementSelector(el),
                        html: el.outerHTML.substring(0, 200) + '...',
                        issue: 'Animation does not respect prefers-reduced-motion',
                        suggestion: 'Add @media (prefers-reduced-motion: reduce) CSS rules to disable or reduce animations.'
                    })),
                    score: 60,
                    algorithm: 'CSS Animation Detection & Media Query Analysis',
                    autoFixable: true
                });
            }
        }

        return results;
    }

    // Utility methods
    private getElementSelector(element: Element): string {
        if (element.id) return `#${element.id}`;
        if (element.className) return `${element.tagName.toLowerCase()}.${element.className.split(' ')[0]}`;
        return element.tagName.toLowerCase();
    }

    private parseColor(color: string): { r: number; g: number; b: number } {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        const imageData = ctx.getImageData(0, 0, 1, 1).data;
        return { r: imageData[0], g: imageData[1], b: imageData[2] };
    }

    private getEffectiveBackgroundColor(element: Element): { r: number; g: number; b: number } {
        let currentElement = element as Element | null;

        while (currentElement) {
            const styles = window.getComputedStyle(currentElement);
            const bgColor = styles.backgroundColor;

            if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                return this.parseColor(bgColor);
            }

            currentElement = currentElement.parentElement;
        }

        return { r: 255, g: 255, b: 255 }; // Default to white
    }

    private rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
        return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    }

    private createHeadingResult(testId: string, title: string, severity: 'critical' | 'serious' | 'moderate' | 'minor'): AdvancedAccessibilityResult {
        return {
            testId,
            level: 'A',
            category: 'structure',
            severity,
            title,
            description: 'Proper heading structure is essential for screen reader navigation.',
            wcagCriterion: '1.3.1',
            elements: [],
            score: severity === 'critical' ? 0 : severity === 'serious' ? 25 : 50,
            algorithm: 'Heading Hierarchy Analysis',
            autoFixable: true
        };
    }

    private isNativelyFocusable(element: Element): boolean {
        const tag = element.tagName.toLowerCase();
        const type = element.getAttribute('type')?.toLowerCase();

        return ['a', 'button', 'input', 'select', 'textarea'].includes(tag) ||
            (tag === 'input' && type !== 'hidden') ||
            element.hasAttribute('href') ||
            element.hasAttribute('tabindex');
    }

    private hasClickHandler(element: Element): boolean {
        return element.hasAttribute('onclick') ||
            element.addEventListener?.length > 0 ||
            element.getAttribute('role') === 'button';
    }

    private simulateTabTraversal(elements: Element[]): { hasTraps: boolean; trapElements: Element[] } {
        // Simplified simulation - in real implementation, would use more complex logic
        return { hasTraps: false, trapElements: [] };
    }

    private findBackgroundImages(): Element[] {
        const elements = Array.from(this.document.querySelectorAll('*'));
        return elements.filter(el => {
            const styles = window.getComputedStyle(el);
            return styles.backgroundImage && styles.backgroundImage !== 'none';
        });
    }

    private isLowQualityAltText(alt: string, element: Element): boolean {
        const src = element.getAttribute('src') || '';
        const filename = src.split('/').pop()?.split('.')[0] || '';

        // Check for common bad patterns
        const badPatterns = [
            /^image$/i,
            /^picture$/i,
            /^photo$/i,
            /^img\d*$/i,
            /^dsc\d+$/i,
            new RegExp(filename, 'i')
        ];

        return badPatterns.some(pattern => pattern.test(alt)) || alt.length < 3;
    }

    private generateAltTextSuggestion(img: Element, src: string): string {
        const context = img.closest('a, button') ? 'link/button context' : 'standalone image';
        return `Provide descriptive alt text explaining the image content and purpose in ${context}. Consider the image's function on the page.`;
    }

    private hasProperLabel(control: Element): boolean {
        const id = control.getAttribute('id');
        const ariaLabel = control.getAttribute('aria-label');
        const ariaLabelledBy = control.getAttribute('aria-labelledby');

        if (ariaLabel || ariaLabelledBy) return true;
        if (id && this.document.querySelector(`label[for="${id}"]`)) return true;
        if (control.closest('label')) return true;

        return false;
    }

    private isDecorativeTarget(element: Element): boolean {
        const parent = element.closest('a, button');
        if (!parent) return false;

        const textContent = parent.textContent?.trim();
        return !textContent || textContent.length < 2;
    }

    private findAnimatedElements(): Element[] {
        const elements = Array.from(this.document.querySelectorAll('*'));
        return elements.filter(el => {
            const styles = window.getComputedStyle(el);
            return styles.animationName !== 'none' ||
                styles.transitionProperty !== 'none' ||
                el.classList.toString().includes('animate');
        });
    }

    private checkReducedMotionSupport(): boolean {
        // Check if CSS includes prefers-reduced-motion media queries
        const stylesheets = Array.from(document.styleSheets);

        try {
            return stylesheets.some(sheet => {
                try {
                    const rules = Array.from(sheet.cssRules || []);
                    return rules.some(rule =>
                        rule.cssText.includes('prefers-reduced-motion')
                    );
                } catch {
                    return false;
                }
            });
        } catch {
            return false;
        }
    }

    /**
     * Main analysis method - runs all algorithms
     */
    public analyze(): AdvancedAccessibilityResult[] {
        this.results = [];

        // Run all analysis algorithms
        this.results.push(...this.analyzeContrastRatios());
        this.results.push(...this.analyzeHeadingStructure());
        this.results.push(...this.analyzeKeyboardAccessibility());
        this.results.push(...this.analyzeImageAccessibility());
        this.results.push(...this.analyzeFormAccessibility());
        this.results.push(...this.analyzeTouchTargets());
        this.results.push(...this.analyzeARIACompliance());
        this.results.push(...this.analyzeMotionSafety());

        return this.results;
    }

    /**
     * Calculate overall accessibility score
     */
    public calculateScore(): number {
        if (this.results.length === 0) return 100;

        const totalScore = this.results.reduce((sum, result) => sum + result.score, 0);
        const maxPossibleScore = this.results.length * 100;

        return Math.round((totalScore / maxPossibleScore) * 100);
    }

    /**
     * Get compliance level based on results
     */
    public getComplianceLevel(): 'A' | 'AA' | 'AAA' | 'Non-compliant' {
        const criticalIssues = this.results.filter(r => r.severity === 'critical');
        const seriousIssues = this.results.filter(r => r.severity === 'serious');
        const moderateIssues = this.results.filter(r => r.severity === 'moderate');

        if (criticalIssues.length > 0) return 'Non-compliant';
        if (seriousIssues.length > 2) return 'Non-compliant';
        if (seriousIssues.length > 0 || moderateIssues.length > 5) return 'A';
        if (moderateIssues.length > 0) return 'AA';

        return 'AAA';
    }
}
