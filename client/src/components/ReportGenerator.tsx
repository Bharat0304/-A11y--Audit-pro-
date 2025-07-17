import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Printer, Share2, Mail, Calendar, Building } from 'lucide-react';

interface ReportGeneratorProps {
    scanResults: any;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ scanResults }) => {
    const [reportFormat, setReportFormat] = useState<'pdf' | 'html' | 'csv' | 'json'>('pdf');
    const [includeDetails, setIncludeDetails] = useState(true);
    const [includeRecommendations, setIncludeRecommendations] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateReport = async () => {
        setIsGenerating(true);

        // Simulate report generation
        await new Promise(resolve => setTimeout(resolve, 2000));

        const reportData = {
            metadata: {
                title: 'Accessibility Analysis Report',
                url: scanResults.url,
                timestamp: new Date().toISOString(),
                generatedBy: 'A11y Audit Pro',
                wcagVersion: '2.1',
                conformanceLevel: 'AA'
            },
            summary: {
                score: Math.round((scanResults.passes.length / (scanResults.passes.length + scanResults.violations.length)) * 100),
                totalTests: scanResults.passes.length + scanResults.violations.length + scanResults.incomplete.length,
                violations: scanResults.violations.length,
                passes: scanResults.passes.length,
                incomplete: scanResults.incomplete.length,
                inapplicable: scanResults.inapplicable.length
            },
            violations: scanResults.violations.map((violation: any) => ({
                id: violation.id,
                impact: violation.impact,
                help: violation.help,
                description: violation.description,
                helpUrl: violation.helpUrl,
                tags: violation.tags,
                nodes: violation.nodes.map((node: any) => ({
                    html: node.html,
                    target: node.target,
                    failureSummary: node.failureSummary
                }))
            })),
            recommendations: generateRecommendations(scanResults.violations)
        };

        if (reportFormat === 'json') {
            downloadJSON(reportData);
        } else if (reportFormat === 'csv') {
            downloadCSV(reportData);
        } else if (reportFormat === 'html') {
            downloadHTML(reportData);
        } else {
            // For PDF, we would typically use a library like jsPDF
            downloadHTML(reportData); // Fallback to HTML for now
        }

        setIsGenerating(false);
    };

    const generateRecommendations = (violations: any[]) => {
        const recommendations = [];
        const severityCount = violations.reduce((acc, v) => {
            acc[v.impact] = (acc[v.impact] || 0) + 1;
            return acc;
        }, {});

        if (severityCount.critical > 0) {
            recommendations.push({
                priority: 'High',
                category: 'Critical Issues',
                description: `Address ${severityCount.critical} critical accessibility issues immediately. These prevent users from accessing content.`,
                timeframe: 'Within 1 week'
            });
        }

        if (severityCount.serious > 0) {
            recommendations.push({
                priority: 'Medium',
                category: 'Serious Issues',
                description: `Fix ${severityCount.serious} serious accessibility barriers that significantly impact user experience.`,
                timeframe: 'Within 2 weeks'
            });
        }

        if (severityCount.moderate > 0) {
            recommendations.push({
                priority: 'Medium',
                category: 'Moderate Issues',
                description: `Resolve ${severityCount.moderate} moderate issues to improve overall accessibility compliance.`,
                timeframe: 'Within 1 month'
            });
        }

        recommendations.push({
            priority: 'Low',
            category: 'Ongoing Monitoring',
            description: 'Implement regular accessibility testing in your development workflow.',
            timeframe: 'Ongoing'
        });

        return recommendations;
    };

    const downloadJSON = (data: any) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accessibility-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const downloadCSV = (data: any) => {
        const csvContent = [
            'ID,Impact,Help,Description,Affected Elements',
            ...data.violations.map((v: any) =>
                `"${v.id}","${v.impact}","${v.help}","${v.description}","${v.nodes.length}"`
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accessibility-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const downloadHTML = (data: any) => {
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Analysis Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #007bff; }
        .metric-value { font-size: 2em; font-weight: bold; color: #007bff; }
        .violation { margin-bottom: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .severity-critical { border-left: 4px solid #dc3545; }
        .severity-serious { border-left: 4px solid #fd7e14; }
        .severity-moderate { border-left: 4px solid #ffc107; }
        .severity-minor { border-left: 4px solid #28a745; }
        .code { background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 0.9em; overflow-x: auto; }
        .recommendations { background: #e7f3ff; padding: 20px; border-radius: 8px; margin-top: 30px; }
        .recommendation { margin-bottom: 15px; padding: 15px; background: white; border-radius: 6px; }
        .priority-high { border-left: 4px solid #dc3545; }
        .priority-medium { border-left: 4px solid #ffc107; }
        .priority-low { border-left: 4px solid #28a745; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Accessibility Analysis Report</h1>
        <p>URL: ${data.metadata.url}</p>
        <p>Generated: ${new Date(data.metadata.timestamp).toLocaleString()}</p>
        <p>WCAG ${data.metadata.wcagVersion} Level ${data.metadata.conformanceLevel} Analysis</p>
    </div>

    <div class="summary">
        <div class="metric">
            <div class="metric-value">${data.summary.score}%</div>
            <div>Accessibility Score</div>
        </div>
        <div class="metric">
            <div class="metric-value">${data.summary.violations}</div>
            <div>Violations</div>
        </div>
        <div class="metric">
            <div class="metric-value">${data.summary.passes}</div>
            <div>Passes</div>
        </div>
        <div class="metric">
            <div class="metric-value">${data.summary.incomplete}</div>
            <div>Needs Review</div>
        </div>
    </div>

    <h2>Accessibility Violations</h2>
    ${data.violations.map((violation: any) => `
        <div class="violation severity-${violation.impact}">
            <h3>${violation.help}</h3>
            <p><strong>Impact:</strong> ${violation.impact}</p>
            <p><strong>Description:</strong> ${violation.description}</p>
            <p><strong>Affected Elements:</strong> ${violation.nodes.length}</p>
            <div class="code">${violation.nodes[0]?.html || 'No HTML available'}</div>
            <p><a href="${violation.helpUrl}" target="_blank">Learn More</a></p>
        </div>
    `).join('')}

    <div class="recommendations">
        <h2>Recommendations</h2>
        ${data.recommendations.map((rec: any) => `
            <div class="recommendation priority-${rec.priority.toLowerCase()}">
                <h4>${rec.category} (${rec.priority} Priority)</h4>
                <p>${rec.description}</p>
                <p><strong>Timeframe:</strong> ${rec.timeframe}</p>
            </div>
        `).join('')}
    </div>
</body>
</html>`;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accessibility-report-${new Date().toISOString().split('T')[0]}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <FileText className="w-6 h-6 text-blue-500 mr-2" />
                    Generate Detailed Report
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString()}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Format Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Report Format</label>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { value: 'pdf', label: 'PDF Report', icon: FileText },
                            { value: 'html', label: 'HTML Report', icon: FileText },
                            { value: 'csv', label: 'CSV Data', icon: FileText },
                            { value: 'json', label: 'JSON Data', icon: FileText }
                        ].map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                onClick={() => setReportFormat(value as any)}
                                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${reportFormat === value
                                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon className="w-4 h-4 mx-auto mb-1" />
                                <div>{label}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Options */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Include in Report</label>
                    <div className="space-y-3">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={includeDetails}
                                onChange={(e) => setIncludeDetails(e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Detailed violation analysis</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={includeRecommendations}
                                onChange={(e) => setIncludeRecommendations(e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Fix recommendations</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Report Preview */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Report Preview</h4>
                <div className="text-sm text-gray-600 space-y-1">
                    <div>• Website: {scanResults.url}</div>
                    <div>• Violations: {scanResults.violations.length}</div>
                    <div>• Passes: {scanResults.passes.length}</div>
                    <div>• Format: {reportFormat.toUpperCase()}</div>
                    {includeDetails && <div>• Includes detailed analysis</div>}
                    {includeRecommendations && <div>• Includes fix recommendations</div>}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={generateReport}
                        disabled={isGenerating}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isGenerating ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                <span>Generate Report</span>
                            </>
                        )}
                    </button>

                    <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Printer className="w-4 h-4" />
                        <span>Print</span>
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Mail className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ReportGenerator;
