import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { startScan, setScanResults, setScanError } from '../store/scanSlice';
import { addNotification } from '../store/uiSlice';
import { setActiveTab } from '../store/uiSlice';
import { Search, Globe, FileText, AlertCircle, Settings, Zap, Brain, Eye, CheckCircle } from 'lucide-react';
import { EnhancedAccessibilityScanner, ScanOptions } from '../utils/enhancedAccessibilityScanner';
import ScanCompletionDialog from './ScanCompletionDialog';
import axe from 'axe-core';

const Scanner: React.FC = () => {
    const [url, setUrl] = useState('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const [showCompletionDialog, setShowCompletionDialog] = useState(false);
    const [completedScanResults, setCompletedScanResults] = useState<any>(null);
    const [scanOptions, setScanOptions] = useState<ScanOptions>({
        includeAdvanced: true,
        includeSemantic: true,
        includeAI: false,
        wcagLevel: 'AA'
    });
    const { isScanning, currentResults } = useAppSelector((state) => state.scan);
    const dispatch = useAppDispatch();

    const handleUrlScan = async () => {
        if (!url.trim()) {
            dispatch(addNotification({
                type: 'error',
                message: 'Please enter a valid URL'
            }));
            return;
        }

        // Check if URL is same-origin
        const currentOrigin = window.location.origin;
        const targetUrl = new URL(url, currentOrigin);
        const isSameOrigin = targetUrl.origin === currentOrigin;

        if (!isSameOrigin) {
            // For external URLs, provide guidance instead of attempting to scan
            dispatch(setScanError('Cannot scan external websites due to browser security restrictions (CORS). Please try uploading the HTML file instead or use local URLs.'));
            dispatch(addNotification({
                type: 'error',
                message: 'External URL scanning blocked by CORS. Please upload the HTML file for analysis.'
            }));
            return;
        }

        try {
            dispatch(startScan());

            // For same-origin URLs, proceed with iframe scanning
            const iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            iframe.onload = async () => {
                try {
                    if (!iframe.contentDocument) {
                        throw new Error('Cannot access iframe content');
                    }

                    // Use enhanced scanner
                    const scanner = new EnhancedAccessibilityScanner(iframe.contentDocument, scanOptions);
                    const results = await scanner.scan();

                    dispatch(setScanResults({
                        url: url,
                        timestamp: results.timestamp,
                        violations: results.violations,
                        passes: results.passes,
                        incomplete: results.incomplete,
                        inapplicable: results.inapplicable,
                        // Enhanced results
                        advancedViolations: results.advancedViolations,
                        semanticIssues: results.semanticIssues,
                        scores: results.scores,
                        compliance: results.compliance,
                        scanDuration: results.scanDuration,
                        elementsAnalyzed: results.elementsAnalyzed,
                        aiInsights: results.aiInsights
                    }));

                    // Store results for dialog and show completion dialog
                    setCompletedScanResults({
                        url: url,
                        violations: results.violations,
                        advancedViolations: results.advancedViolations,
                        semanticIssues: results.semanticIssues,
                        passes: results.passes,
                        incomplete: results.incomplete,
                        scores: results.scores,
                        compliance: results.compliance,
                        scanDuration: results.scanDuration
                    });
                    setShowCompletionDialog(true);
                } catch (error) {
                    dispatch(setScanError('Failed to scan the URL. Cross-origin restrictions may apply.'));
                    dispatch(addNotification({
                        type: 'error',
                        message: 'Scan failed. Please try uploading the HTML file instead.'
                    }));
                }

                document.body.removeChild(iframe);
            };

            iframe.onerror = () => {
                dispatch(setScanError('Failed to load the URL'));
                document.body.removeChild(iframe);
            };

        } catch (error) {
            dispatch(setScanError('Failed to initiate scan'));
        }
    };

    const handleFileScan = async () => {
        if (!uploadedFile) {
            dispatch(addNotification({
                type: 'error',
                message: 'Please select an HTML file'
            }));
            return;
        }

        try {
            dispatch(startScan());

            const fileContent = await uploadedFile.text();

            // Create a temporary document for analysis
            const parser = new DOMParser();
            const doc = parser.parseFromString(fileContent, 'text/html');

            // Use enhanced scanner
            const scanner = new EnhancedAccessibilityScanner(doc, scanOptions);
            const results = await scanner.scan();

            dispatch(setScanResults({
                url: uploadedFile.name,
                timestamp: results.timestamp,
                violations: results.violations,
                passes: results.passes,
                incomplete: results.incomplete,
                inapplicable: results.inapplicable,
                // Enhanced results
                advancedViolations: results.advancedViolations,
                semanticIssues: results.semanticIssues,
                scores: results.scores,
                compliance: results.compliance,
                scanDuration: results.scanDuration,
                elementsAnalyzed: results.elementsAnalyzed,
                aiInsights: results.aiInsights
            }));

            // Store results for dialog and show completion dialog
            setCompletedScanResults({
                url: uploadedFile.name,
                violations: results.violations,
                advancedViolations: results.advancedViolations,
                semanticIssues: results.semanticIssues,
                passes: results.passes,
                incomplete: results.incomplete,
                scores: results.scores,
                compliance: results.compliance,
                scanDuration: results.scanDuration
            });
            setShowCompletionDialog(true);

        } catch (error) {
            dispatch(setScanError('Failed to scan the uploaded file'));
            dispatch(addNotification({
                type: 'error',
                message: 'Failed to scan the uploaded file'
            }));
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Advanced Accessibility Scanner
                </h2>
                <p className="text-lg text-gray-600">
                    Comprehensive WCAG compliance analysis with AI-powered insights
                </p>
            </div>

            {/* Advanced Scanning Options */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <Settings className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Scanning Options</h3>
                    </div>
                    <button
                        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                    >
                        {showAdvancedOptions ? 'Hide Options' : 'Show Options'}
                    </button>
                </div>

                {showAdvancedOptions && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    WCAG Compliance Level
                                </label>
                                <select
                                    value={scanOptions.wcagLevel}
                                    onChange={(e) => setScanOptions({
                                        ...scanOptions,
                                        wcagLevel: e.target.value as 'A' | 'AA' | 'AAA'
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="A">WCAG 2.1 Level A (Basic)</option>
                                    <option value="AA">WCAG 2.1 Level AA (Standard)</option>
                                    <option value="AAA">WCAG 2.1 Level AAA (Enhanced)</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={scanOptions.includeAdvanced}
                                        onChange={(e) => setScanOptions({
                                            ...scanOptions,
                                            includeAdvanced: e.target.checked
                                        })}
                                        className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <div className="flex items-center space-x-2">
                                        <Zap className="w-4 h-4 text-yellow-500" />
                                        <span className="text-sm font-medium text-gray-700">Advanced Algorithmic Analysis</span>
                                    </div>
                                </label>
                                <p className="text-xs text-gray-500 ml-7">
                                    Deep contrast analysis, keyboard navigation, touch targets, and ARIA compliance
                                </p>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={scanOptions.includeSemantic}
                                        onChange={(e) => setScanOptions({
                                            ...scanOptions,
                                            includeSemantic: e.target.checked
                                        })}
                                        className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <div className="flex items-center space-x-2">
                                        <Brain className="w-4 h-4 text-green-500" />
                                        <span className="text-sm font-medium text-gray-700">Semantic & Cognitive Analysis</span>
                                    </div>
                                </label>
                                <p className="text-xs text-gray-500 ml-7">
                                    Content readability, navigation patterns, form complexity, and cognitive load assessment
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-3">
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={scanOptions.includeAI}
                                        onChange={(e) => setScanOptions({
                                            ...scanOptions,
                                            includeAI: e.target.checked
                                        })}
                                        className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <div className="flex items-center space-x-2">
                                        <Eye className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm font-medium text-gray-700">AI-Powered Insights</span>
                                    </div>
                                </label>
                                <p className="text-xs text-gray-500 ml-7">
                                    Intelligent explanations, priority recommendations, and estimated fix times
                                </p>
                            </div>

                            <div className="bg-white bg-opacity-50 rounded-lg p-4 border border-purple-200">
                                <h4 className="text-sm font-semibold text-gray-800 mb-2">Scan Coverage</h4>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex items-center space-x-1">
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                        <span>Color Contrast</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                        <span>Keyboard Access</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                        <span>Screen Reader</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                        <span>Form Labels</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                        <span>Touch Targets</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                        <span>Content Flow</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* URL Scanner */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Scan Website URL</h3>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                            Website URL
                        </label>
                        <input
                            type="url"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <div className="flex items-start space-x-2">
                            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div>
                                <p className="text-sm text-yellow-800 mb-2">
                                    <strong>Important:</strong> URL scanning works only for same-origin websites due to browser security restrictions (CORS policy).
                                </p>
                                <p className="text-sm text-yellow-700">
                                    <strong>For external websites:</strong> Upload the HTML file instead for analysis.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleUrlScan}
                        disabled={isScanning || !url.trim()}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        <Search className="w-4 h-4" />
                        <span>{isScanning ? 'Scanning...' : 'Scan URL'}</span>
                    </button>
                </div>
            </div>

            {/* File Upload Scanner */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <FileText className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Upload HTML File</h3>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                            HTML File
                        </label>
                        <input
                            type="file"
                            id="file"
                            accept=".html,.htm"
                            onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    {uploadedFile && (
                        <div className="text-sm text-gray-600">
                            Selected: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                        </div>
                    )}

                    <button
                        onClick={handleFileScan}
                        disabled={isScanning || !uploadedFile}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        <Search className="w-4 h-4" />
                        <span>{isScanning ? 'Scanning...' : 'Scan File'}</span>
                    </button>

                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <p className="text-sm text-green-800">
                            <strong>Try it out:</strong> Download our{' '}
                            <a
                                href="/sample-test.html"
                                download="sample-test.html"
                                className="text-green-700 underline hover:text-green-900"
                            >
                                sample HTML file
                            </a>
                            {' '}to test the scanner with common accessibility issues.
                        </p>
                    </div>
                </div>
            </div>

            {/* Scan Completion Dialog */}
            <ScanCompletionDialog
                isOpen={showCompletionDialog}
                onClose={() => setShowCompletionDialog(false)}
                onViewReport={() => {
                    setShowCompletionDialog(false);
                    dispatch(setActiveTab('dashboard'));
                }}
                scanResults={completedScanResults}
            />
        </div>
    );
};

export default Scanner;
