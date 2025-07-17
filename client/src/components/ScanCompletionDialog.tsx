import React from 'react';
import { CheckCircle, BarChart3, AlertTriangle, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScanCompletionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onViewReport: () => void;
    scanResults?: {
        violations: any[];
        advancedViolations?: any[];
        semanticIssues?: any[];
        passes: any[];
        incomplete: any[];
        scores?: {
            overall: number;
        };
        compliance?: {
            level: string;
            criticalIssues: number;
        };
        scanDuration?: number;
        url: string;
    };
}

const ScanCompletionDialog: React.FC<ScanCompletionDialogProps> = ({
    isOpen,
    onClose,
    onViewReport,
    scanResults
}) => {
    if (!scanResults) return null;

    const totalIssues = (scanResults.violations?.length || 0) +
        (scanResults.advancedViolations?.length || 0) +
        (scanResults.semanticIssues?.length || 0);

    const criticalIssues = scanResults.compliance?.criticalIssues || 0;
    const overallScore = scanResults.scores?.overall || 0;
    const complianceLevel = scanResults.compliance?.level || 'Non-compliant';

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600 dark:text-green-400';
        if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 90) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
        if (score >= 70) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700';
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-50 flex items-center justify-center p-4"
                        onClick={onClose}
                    >
                        {/* Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-green-500 to-blue-600 dark:from-green-600 dark:to-blue-700 text-white p-6 relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                                    aria-label="Close dialog"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="bg-white bg-opacity-20 p-3 rounded-full">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">Scan Complete!</h2>
                                        <p className="text-green-100">
                                            Analysis finished for {scanResults.url}
                                        </p>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
                                        <div className="text-2xl font-bold">{totalIssues}</div>
                                        <div className="text-sm opacity-90">Total Issues</div>
                                    </div>
                                    <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
                                        <div className="text-2xl font-bold">{scanResults.passes?.length || 0}</div>
                                        <div className="text-sm opacity-90">Tests Passed</div>
                                    </div>
                                    <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
                                        <div className="text-2xl font-bold">
                                            {scanResults.scanDuration ? `${Math.round(scanResults.scanDuration)}ms` : '-'}
                                        </div>
                                        <div className="text-sm opacity-90">Scan Time</div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Overall Score */}
                                <div className={`rounded-xl p-6 border-2 ${getScoreBgColor(overallScore)}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            Accessibility Score
                                        </h3>
                                        <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                                            {Math.round(overallScore)}%
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                WCAG Compliance Level: <span className="font-bold">{complianceLevel}</span>
                                            </p>
                                            {criticalIssues > 0 && (
                                                <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center">
                                                    <AlertTriangle className="w-4 h-4 mr-1" />
                                                    {criticalIssues} critical issue{criticalIssues !== 1 ? 's' : ''} found
                                                </p>
                                            )}
                                        </div>

                                        <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${overallScore >= 90 ? 'border-green-400 bg-green-50 dark:border-green-500 dark:bg-green-900/20' :
                                            overallScore >= 70 ? 'border-yellow-400 bg-yellow-50 dark:border-yellow-500 dark:bg-yellow-900/20' :
                                                'border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-900/20'
                                            }`}>
                                            <BarChart3 className={`w-8 h-8 ${getScoreColor(overallScore)}`} />
                                        </div>
                                    </div>
                                </div>

                                {/* Issue Breakdown */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                                            <AlertTriangle className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
                                            Issues Found
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                                <span>Core Violations:</span>
                                                <span className="font-medium">{scanResults.violations?.length || 0}</span>
                                            </div>
                                            {scanResults.advancedViolations && (
                                                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                                    <span>Advanced Issues:</span>
                                                    <span className="font-medium">{scanResults.advancedViolations.length}</span>
                                                </div>
                                            )}
                                            {scanResults.semanticIssues && (
                                                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                                    <span>Semantic Issues:</span>
                                                    <span className="font-medium">{scanResults.semanticIssues.length}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                                <span>Needs Review:</span>
                                                <span className="font-medium">{scanResults.incomplete?.length || 0}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-2 text-green-500 dark:text-green-400" />
                                            Positive Results
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                                <span>Tests Passed:</span>
                                                <span className="font-medium text-green-600 dark:text-green-400">{scanResults.passes?.length || 0}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                                <span>Compliance Level:</span>
                                                <span className="font-medium">{complianceLevel}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                                <span>Overall Score:</span>
                                                <span className={`font-bold ${getScoreColor(overallScore)}`}>
                                                    {Math.round(overallScore)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Next Steps */}
                                {totalIssues > 0 && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                                            <Clock className="w-4 h-4 mr-2" />
                                            Recommended Next Steps
                                        </h4>
                                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                            {criticalIssues > 0 && (
                                                <li>• Prioritize fixing {criticalIssues} critical accessibility barriers</li>
                                            )}
                                            <li>• Review detailed violation reports for specific guidance</li>
                                            <li>• Test fixes with keyboard navigation and screen readers</li>
                                            <li>• Export report for development team collaboration</li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-600">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                >
                                    Close
                                </button>

                                <button
                                    onClick={onViewReport}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all transform hover:scale-105 flex items-center space-x-2"
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    <span>View Detailed Report</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ScanCompletionDialog;
