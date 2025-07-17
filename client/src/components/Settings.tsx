import React from 'react';
import { Settings as SettingsIcon, Moon, Sun, Download, Upload } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setTheme } from '../store/uiSlice';

const Settings: React.FC = () => {
    const dispatch = useAppDispatch();
    const theme = useAppSelector(state => state.ui.theme);

    const handleThemeChange = (newTheme: 'light' | 'dark') => {
        dispatch(setTheme(newTheme));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center space-x-3">
                <SettingsIcon className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h2>
            </div>

            {/* General Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">General</h3>

                <div className="space-y-6">
                    {/* Theme */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred theme</p>
                        </div>
                        <div className="flex space-x-2" role="radiogroup" aria-labelledby="theme-label">
                            <button
                                onClick={() => handleThemeChange('light')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-md border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${theme === 'light'
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                role="radio"
                                aria-checked={theme === 'light'}
                                aria-label="Light theme"
                            >
                                <Sun className="w-4 h-4" />
                                <span>Light</span>
                            </button>
                            <button
                                onClick={() => handleThemeChange('dark')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-md border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${theme === 'dark'
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                role="radio"
                                aria-checked={theme === 'dark'}
                                aria-label="Dark theme"
                            >
                                <Moon className="w-4 h-4" />
                                <span>Dark</span>
                            </button>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Show notifications for scan results</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                defaultChecked
                                aria-label="Enable notifications"
                            />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Scan Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Scan Configuration</h3>

                <div className="space-y-6">
                    {/* WCAG Level */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            WCAG Compliance Level
                        </label>
                        <select className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400">
                            <option value="AA">WCAG 2.1 AA (Recommended)</option>
                            <option value="A">WCAG 2.1 A</option>
                            <option value="AAA">WCAG 2.1 AAA</option>
                        </select>
                    </div>

                    {/* Rules */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Rule Tags (Optional)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {['wcag2a', 'wcag2aa', 'wcag21aa', 'section508', 'best-practice'].map(tag => (
                                <label key={tag} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        defaultChecked={tag.includes('wcag')}
                                        className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{tag}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Management */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Data Management</h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Export Data</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Download your scan history and settings</p>
                        </div>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors">
                            <Download className="w-4 h-4" />
                            <span>Export</span>
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Import Data</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Upload previously exported data</p>
                        </div>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors">
                            <Upload className="w-4 h-4" />
                            <span>Import</span>
                        </button>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-medium text-red-600 dark:text-red-400">Clear All Data</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Remove all scan history and reset settings</p>
                            </div>
                            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors">
                                Clear Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* About */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">About</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>Version:</strong> 1.0.0</p>
                    <p><strong>Engine:</strong> axe-core v4.8.2 + Advanced Algorithms</p>
                    <p><strong>Standards:</strong> WCAG 2.1, Section 508</p>
                    <p className="pt-4">
                        This comprehensive A11y Audit Pro analyzer uses multiple analysis engines to make the web more inclusive for everyone.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
