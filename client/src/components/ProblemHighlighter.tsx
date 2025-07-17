import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, X, Copy, ExternalLink, Code2, Target, Lightbulb } from 'lucide-react';

interface ProblemHighlighterProps {
    violation: any;
    isOpen: boolean;
    onClose: () => void;
}

const ProblemHighlighter: React.FC<ProblemHighlighterProps> = ({ violation, isOpen, onClose }) => {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopiedCode(type);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const getSeverityColor = (impact: string) => {
        switch (impact) {
            case 'critical': return 'from-red-500 to-red-600';
            case 'serious': return 'from-orange-500 to-orange-600';
            case 'moderate': return 'from-yellow-500 to-yellow-600';
            case 'minor': return 'from-green-500 to-green-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getSeverityBadgeColor = (impact: string) => {
        switch (impact) {
            case 'critical': return 'bg-red-100 text-red-800 border-red-200';
            case 'serious': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'minor': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getFixSuggestions = (violationId: string) => {
        const suggestions: Record<string, string[]> = {
            'color-contrast': [
                'Increase color contrast ratio to at least 4.5:1 for normal text',
                'Use a darker text color or lighter background',
                'Test with online contrast checkers',
                'Consider using CSS variables for consistent color schemes'
            ],
            'image-alt': [
                'Add descriptive alt attributes to all images',
                'Use empty alt="" for decorative images',
                'Include context in alt text, not just object description',
                'Avoid redundant phrases like "image of" or "picture of"'
            ],
            'heading-order': [
                'Use heading tags in sequential order (h1, h2, h3...)',
                'Ensure each page has only one h1 tag',
                'Use headings to create a logical document outline',
                'Consider using CSS for visual styling instead of heading levels'
            ],
            'label': [
                'Associate form labels with their controls using for/id',
                'Use aria-label for buttons without visible text',
                'Provide clear, descriptive labels for all form elements',
                'Consider using fieldset and legend for grouped controls'
            ]
        };

        return suggestions[violationId] || [
            'Review WCAG guidelines for this specific issue',
            'Test with screen readers and keyboard navigation',
            'Consult accessibility documentation',
            'Consider user experience from different perspectives'
        ];
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={`bg-gradient-to-r ${getSeverityColor(violation.impact)} p-6 text-white`}>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <AlertTriangle className="w-6 h-6" />
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full bg-white ${violation.impact === 'critical' ? 'text-red-600' :
                                                violation.impact === 'serious' ? 'text-orange-600' :
                                                    violation.impact === 'moderate' ? 'text-yellow-600' :
                                                        'text-green-600'
                                            }`}>
                                            {(violation.impact || 'Unknown').toUpperCase()} PRIORITY
                                        </span>
                                        <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-mono">
                                            {violation.id}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">{violation.help}</h2>
                                    <p className="text-white text-opacity-90">{violation.description}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto">
                            {/* Quick Stats */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-red-50 rounded-lg p-4 text-center">
                                        <Target className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-red-600">{violation.nodes.length}</div>
                                        <div className="text-sm text-red-700">Affected Elements</div>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                                        <Code2 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-blue-600">
                                            {violation.tags?.filter((tag: string) => tag.startsWith('wcag')).length || 0}
                                        </div>
                                        <div className="text-sm text-blue-700">WCAG Rules</div>
                                    </div>
                                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                                        <Lightbulb className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-yellow-600">
                                            {getFixSuggestions(violation.id).length}
                                        </div>
                                        <div className="text-sm text-yellow-700">Fix Suggestions</div>
                                    </div>
                                </div>
                            </div>

                            {/* Fix Suggestions */}
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                                    How to Fix This Issue
                                </h3>
                                <div className="grid gap-3">
                                    {getFixSuggestions(violation.id).map((suggestion, index) => (
                                        <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                            <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                                {index + 1}
                                            </div>
                                            <p className="text-green-800 text-sm">{suggestion}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Affected Elements */}
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Code2 className="w-5 h-5 text-blue-500 mr-2" />
                                    Affected Elements
                                </h3>
                                <div className="space-y-4">
                                    {violation.nodes.slice(0, 5).map((node: any, index: number) => (
                                        <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-medium text-gray-700">
                                                    Element #{index + 1}
                                                </span>
                                                <button
                                                    onClick={() => copyToClipboard(node.html, `html-${index}`)}
                                                    className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    <Copy className="w-3 h-3" />
                                                    <span>{copiedCode === `html-${index}` ? 'Copied!' : 'Copy HTML'}</span>
                                                </button>
                                            </div>

                                            {/* HTML Code */}
                                            <div className="mb-3">
                                                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">HTML Code:</label>
                                                <div className="mt-1 bg-red-50 border border-red-200 rounded-lg p-3 overflow-x-auto">
                                                    <code className="text-sm text-red-700 font-mono whitespace-pre-wrap break-all">
                                                        {node.html}
                                                    </code>
                                                </div>
                                            </div>

                                            {/* CSS Selector */}
                                            {node.target && (
                                                <div className="mb-3">
                                                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">CSS Selector:</label>
                                                    <div className="mt-1 bg-blue-50 border border-blue-200 rounded-lg p-3 overflow-x-auto">
                                                        <code className="text-sm text-blue-700 font-mono">
                                                            {node.target.join(', ')}
                                                        </code>
                                                        <button
                                                            onClick={() => copyToClipboard(node.target.join(', '), `selector-${index}`)}
                                                            className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                                                        >
                                                            {copiedCode === `selector-${index}` ? 'Copied!' : 'Copy'}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Failure Summary */}
                                            {node.failureSummary && (
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Issue Details:</label>
                                                    <div className="mt-1 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                                        <p className="text-sm text-yellow-800">{node.failureSummary}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {violation.nodes.length > 5 && (
                                        <div className="text-center py-4 border-t border-gray-200">
                                            <p className="text-sm text-gray-500">
                                                Showing 5 of {violation.nodes.length} affected elements
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Info className="w-4 h-4" />
                                        <span>WCAG Tags: {violation.tags?.filter((tag: string) => tag.startsWith('wcag')).join(', ') || 'None'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <a
                                        href={violation.helpUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        <span>WCAG Documentation</span>
                                    </a>
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProblemHighlighter;
