import React from 'react';
import { useAppSelector } from '../store/hooks';
import { Clock, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react';

const ScanHistory: React.FC = () => {
    const { scanHistory } = useAppSelector((state) => state.scan);

    if (scanHistory.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Scan History</h3>
                <p className="text-gray-600">
                    Your scan history will appear here after you run some scans.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Scan History</h2>
                <span className="text-sm text-gray-500">
                    {scanHistory.length} scan{scanHistory.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    URL / File
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Issues
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Passes
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {scanHistory.map((scan: any, index: number) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                    {scan.url}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {scan.url.startsWith('http') ? 'Website' : 'File'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(scan.timestamp).toLocaleDateString()} <br />
                                        <span className="text-xs text-gray-400">
                                            {new Date(scan.timestamp).toLocaleTimeString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                                            <span className="text-sm font-medium text-red-600">
                                                {scan.violations.length}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                            <span className="text-sm font-medium text-green-600">
                                                {scan.passes.length}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900 flex items-center space-x-1">
                                            <ExternalLink className="w-4 h-4" />
                                            <span>View</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ScanHistory;
