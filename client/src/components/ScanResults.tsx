import React, { useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend as ChartLegend, ArcElement } from 'chart.js';
import { Bar as ChartJSBar, Doughnut } from 'react-chartjs-2';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, TrendingUp, Eye, Code, Zap, Shield, ChevronDown, ChevronUp, ExternalLink, Search } from 'lucide-react';
import ProblemHighlighter from './ProblemHighlighter';
import ReportGenerator from './ReportGenerator';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, ChartLegend, ArcElement);

const ScanResults: React.FC = () => {
    const { currentResults, isScanning, error } = useAppSelector((state) => state.scan);
    const [expandedViolation, setExpandedViolation] = useState<number | null>(null);
    const [activeChart, setActiveChart] = useState<'recharts' | 'chartjs' | 'nivo'>('nivo');
    const [selectedViolation, setSelectedViolation] = useState<any | null>(null);

    if (isScanning) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Analyzing accessibility...</p>
                </div>
            </div>
        );
    }

    if (error) {
        const isCorError = error.includes('Cross-origin') || error.includes('CORS');

        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h3 className="text-lg font-semibold text-red-900">Scan Error</h3>
                </div>
                <p className="text-red-800 mb-4">{error}</p>

                {isCorError && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <h4 className="font-semibold text-yellow-900 mb-2">Alternative Solutions:</h4>
                        <ul className="text-yellow-800 space-y-1 text-sm">
                            <li>• <strong>Use the Browser Extension:</strong> Install our extension to scan any website</li>
                            <li>• <strong>Download & Upload:</strong> Save the webpage as HTML and upload it here</li>
                            <li>• <strong>Test Local Files:</strong> Upload HTML files directly for analysis</li>
                        </ul>
                    </div>
                )}
            </div>
        );
    }

    if (!currentResults) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Scan Results</h3>
                <p className="text-gray-600 mb-6">
                    Run a scan to see accessibility analysis results here.
                </p>
            </div>
        );
    }

    const { violations, passes, incomplete, inapplicable } = currentResults;

    // Enhanced data preparation
    const severityData = violations.reduce((acc: Record<string, number>, violation: any) => {
        const impact = violation.impact || 'unknown';
        acc[impact] = (acc[impact] || 0) + 1;
        return acc;
    }, {});

    const categoryData = violations.reduce((acc: Record<string, number>, violation: any) => {
        const tags = violation.tags || [];
        tags.forEach((tag: string) => {
            if (tag.startsWith('wcag')) {
                acc[tag] = (acc[tag] || 0) + 1;
            }
        });
        return acc;
    }, {});

    // Chart data for different libraries
    const rechartsData = Object.entries(severityData).map(([severity, count]) => ({
        severity: severity.charAt(0).toUpperCase() + severity.slice(1),
        count,
        color: {
            critical: '#dc2626',
            serious: '#ea580c',
            moderate: '#d97706',
            minor: '#65a30d',
            unknown: '#6b7280'
        }[severity] || '#6b7280'
    }));

    const chartJSData = {
        labels: Object.keys(severityData).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        datasets: [{
            label: 'Violations by Severity',
            data: Object.values(severityData),
            backgroundColor: [
                'rgba(220, 38, 38, 0.8)',
                'rgba(234, 88, 12, 0.8)',
                'rgba(217, 119, 6, 0.8)',
                'rgba(101, 163, 13, 0.8)',
                'rgba(107, 114, 128, 0.8)'
            ],
            borderColor: [
                'rgba(220, 38, 38, 1)',
                'rgba(234, 88, 12, 1)',
                'rgba(217, 119, 6, 1)',
                'rgba(101, 163, 13, 1)',
                'rgba(107, 114, 128, 1)'
            ],
            borderWidth: 2
        }]
    };

    const nivoData = Object.entries(severityData).map(([severity, count]) => ({
        id: severity.charAt(0).toUpperCase() + severity.slice(1),
        label: severity.charAt(0).toUpperCase() + severity.slice(1),
        value: count,
        color: {
            critical: '#dc2626',
            serious: '#ea580c',
            moderate: '#d97706',
            minor: '#65a30d',
            unknown: '#6b7280'
        }[severity] || '#6b7280'
    }));

    const pieData = [
        { name: 'Violations', value: violations.length, color: '#dc2626' },
        { name: 'Passes', value: passes.length, color: '#16a34a' },
        { name: 'Incomplete', value: incomplete.length, color: '#d97706' },
        { name: 'Inapplicable', value: inapplicable.length, color: '#6b7280' }
    ];

    // Accessibility score calculation
    const totalTests = violations.length + passes.length + incomplete.length;
    const score = totalTests > 0 ? Math.round((passes.length / totalTests) * 100) : 0;

    const toggleViolationDetails = (index: number) => {
        setExpandedViolation(expandedViolation === index ? null : index);
    };

    return (
        <div className="space-y-8">
            {/* Enhanced Header with Score */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Accessibility Report</h2>
                        <p className="text-blue-100 mb-4">
                            {currentResults.url} • {new Date(currentResults.timestamp).toLocaleString()}
                        </p>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Shield className="w-5 h-5" />
                                <span>WCAG 2.1 Compliance</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Zap className="w-5 h-5" />
                                <span>Powered by axe-core</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="bg-white bg-opacity-20 rounded-xl p-6">
                            <div className="text-4xl font-bold mb-2">{score}%</div>
                            <div className="text-sm opacity-90">Accessibility Score</div>
                            <div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${score >= 90 ? 'bg-green-500' :
                                score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}>
                                {score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Improvement'}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Enhanced Summary Cards with Icons */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-red-600 uppercase tracking-wide">Critical Issues</p>
                            <p className="text-3xl font-bold text-red-700 mt-2">{violations.length}</p>
                            <p className="text-xs text-gray-500 mt-1">Require immediate attention</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600 uppercase tracking-wide">Passes</p>
                            <p className="text-3xl font-bold text-green-700 mt-2">{passes.length}</p>
                            <p className="text-xs text-gray-500 mt-1">Tests passed successfully</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-yellow-600 uppercase tracking-wide">Needs Review</p>
                            <p className="text-3xl font-bold text-yellow-700 mt-2">{incomplete.length}</p>
                            <p className="text-xs text-gray-500 mt-1">Manual verification required</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <Clock className="w-8 h-8 text-yellow-500" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-500 hover:shadow-xl transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Not Applicable</p>
                            <p className="text-3xl font-bold text-gray-700 mt-2">{inapplicable.length}</p>
                            <p className="text-xs text-gray-500 mt-1">Tests not relevant</p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-full">
                            <TrendingUp className="w-8 h-8 text-gray-500" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Chart Library Selector */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Visualization Dashboard</h3>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setActiveChart('nivo')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeChart === 'nivo' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Nivo Charts
                        </button>
                        <button
                            onClick={() => setActiveChart('chartjs')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeChart === 'chartjs' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Chart.js
                        </button>
                        <button
                            onClick={() => setActiveChart('recharts')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeChart === 'recharts' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Recharts
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        key={activeChart}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-50 rounded-lg p-6"
                    >
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Violations by Severity</h4>
                        {activeChart === 'nivo' && violations.length > 0 && (
                            <div style={{ height: '300px' }}>
                                <ResponsiveBar
                                    data={nivoData}
                                    keys={['value']}
                                    indexBy="id"
                                    margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                                    padding={0.3}
                                    valueScale={{ type: 'linear' }}
                                    colors={({ data }) => data.color}
                                    borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: 'Severity Level',
                                        legendPosition: 'middle',
                                        legendOffset: 32
                                    }}
                                    axisLeft={{
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: 'Count',
                                        legendPosition: 'middle',
                                        legendOffset: -40
                                    }}
                                    labelSkipWidth={12}
                                    labelSkipHeight={12}
                                    labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                    animate={true}
                                />
                            </div>
                        )}
                        {activeChart === 'chartjs' && violations.length > 0 && (
                            <div style={{ height: '300px' }}>
                                <ChartJSBar data={chartJSData} options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: false },
                                        title: { display: false }
                                    },
                                    scales: {
                                        y: { beginAtZero: true }
                                    }
                                }} />
                            </div>
                        )}
                        {activeChart === 'recharts' && violations.length > 0 && (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={rechartsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="severity" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                        {violations.length === 0 && (
                            <div className="flex items-center justify-center h-64 text-gray-500">
                                <div className="text-center">
                                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                                    <p className="text-lg font-medium">No violations found!</p>
                                    <p className="text-sm">Great accessibility implementation</p>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        key={`pie-${activeChart}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gray-50 rounded-lg p-6"
                    >
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Overall Test Results</h4>
                        {activeChart === 'nivo' && (
                            <div style={{ height: '300px' }}>
                                <ResponsivePie
                                    data={pieData.map(item => ({ id: item.name, label: item.name, value: item.value, color: item.color }))}
                                    margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
                                    innerRadius={0.5}
                                    padAngle={0.7}
                                    cornerRadius={3}
                                    colors={({ data }) => data.color}
                                    borderWidth={1}
                                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                                    arcLinkLabelsSkipAngle={10}
                                    arcLinkLabelsTextColor="#333333"
                                    arcLinkLabelsThickness={2}
                                    arcLinkLabelsColor={{ from: 'color' }}
                                    arcLabelsSkipAngle={10}
                                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                                />
                            </div>
                        )}
                        {activeChart === 'chartjs' && (
                            <div style={{ height: '300px' }}>
                                <Doughnut
                                    data={{
                                        labels: pieData.map(item => item.name),
                                        datasets: [{
                                            data: pieData.map(item => item.value),
                                            backgroundColor: pieData.map(item => item.color),
                                            borderWidth: 2,
                                            borderColor: '#fff'
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom' as const,
                                            }
                                        }
                                    }}
                                />
                            </div>
                        )}
                        {activeChart === 'recharts' && (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Enhanced Violations Details with Problem Highlighting */}
            {violations.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
                            Critical Accessibility Issues
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Eye className="w-4 h-4" />
                            <span>Click to expand details</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {violations.map((violation: any, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div
                                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => toggleViolationDetails(index)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${violation.impact === 'critical' ? 'bg-red-100 text-red-800 border border-red-200' :
                                                    violation.impact === 'serious' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                                        violation.impact === 'moderate' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                                            'bg-green-100 text-green-800 border border-green-200'
                                                    }`}>
                                                    {(violation.impact || 'Unknown').toUpperCase()}
                                                </span>
                                                <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                                                    {violation.id}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {violation.nodes.length} element{violation.nodes.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <h4 className="font-semibold text-gray-900 mb-2 text-lg">{violation.help}</h4>
                                            <p className="text-gray-600 mb-3">{violation.description}</p>

                                            <div className="flex items-center space-x-4 text-sm">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedViolation(violation);
                                                    }}
                                                    className="flex items-center space-x-1 text-purple-600 hover:text-purple-800 font-medium"
                                                >
                                                    <Search className="w-4 h-4" />
                                                    <span>Detailed Analysis</span>
                                                </button>
                                                <div className="flex items-center space-x-1 text-blue-600">
                                                    <Code className="w-4 h-4" />
                                                    <span>View Code</span>
                                                </div>
                                                <a
                                                    href={violation.helpUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    <span>Learn More</span>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            {expandedViolation === index ?
                                                <ChevronUp className="w-5 h-5 text-gray-400" /> :
                                                <ChevronDown className="w-5 h-5 text-gray-400" />
                                            }
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedViolation === index && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="border-t border-gray-200 bg-gray-50"
                                        >
                                            <div className="p-6">
                                                <h5 className="font-semibold text-gray-900 mb-4">Affected Elements:</h5>
                                                <div className="space-y-4">
                                                    {violation.nodes.slice(0, 3).map((node: any, nodeIndex: number) => (
                                                        <div key={nodeIndex} className="bg-white rounded-lg p-4 border border-gray-200">
                                                            <div className="mb-3">
                                                                <span className="text-sm font-medium text-gray-700">Element:</span>
                                                                <code className="block mt-1 text-sm bg-gray-100 p-2 rounded font-mono text-red-600 overflow-x-auto">
                                                                    {node.html}
                                                                </code>
                                                            </div>
                                                            {node.target && (
                                                                <div className="mb-3">
                                                                    <span className="text-sm font-medium text-gray-700">Selector:</span>
                                                                    <code className="block mt-1 text-sm bg-blue-50 p-2 rounded font-mono text-blue-600">
                                                                        {node.target.join(', ')}
                                                                    </code>
                                                                </div>
                                                            )}
                                                            {node.failureSummary && (
                                                                <div>
                                                                    <span className="text-sm font-medium text-gray-700">Issue:</span>
                                                                    <p className="mt-1 text-sm text-gray-600 bg-red-50 p-2 rounded border-l-4 border-red-400">
                                                                        {node.failureSummary}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {violation.nodes.length > 3 && (
                                                        <div className="text-center py-2">
                                                            <span className="text-sm text-gray-500">
                                                                And {violation.nodes.length - 3} more element{violation.nodes.length - 3 !== 1 ? 's' : ''}...
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Success State */}
            {violations.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-8 text-white text-center"
                >
                    <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Excellent Accessibility!</h3>
                    <p className="text-green-100 mb-4">
                        No accessibility violations were found. Your website follows WCAG guidelines well.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-white bg-opacity-20 rounded-lg p-4">
                            <div className="text-2xl font-bold">{passes.length}</div>
                            <div className="text-sm opacity-90">Tests Passed</div>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg p-4">
                            <div className="text-2xl font-bold">{score}%</div>
                            <div className="text-sm opacity-90">Score</div>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg p-4">
                            <div className="text-2xl font-bold">AAA</div>
                            <div className="text-sm opacity-90">WCAG Level</div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Report Generator */}
            <ReportGenerator scanResults={currentResults} />

            {/* Problem Highlighter Modal */}
            <ProblemHighlighter
                violation={selectedViolation}
                isOpen={!!selectedViolation}
                onClose={() => setSelectedViolation(null)}
            />
        </div>
    );
};

export default ScanResults;
