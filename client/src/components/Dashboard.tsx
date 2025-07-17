import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setActiveTab, toggleSidebar } from '../store/uiSlice';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import Scanner from './Scanner';
import ScanResults from './ScanResults';
import ScanHistory from './ScanHistory';
import Settings from './Settings';
import Footer from './Footer';

const Dashboard: React.FC = () => {
    const { activeTab, sidebarOpen, theme } = useSelector((state: RootState) => state.ui);
    const dispatch = useDispatch();

    const renderActiveComponent = () => {
        switch (activeTab) {
            case 'scanner':
                return <Scanner />;
            case 'history':
                return <ScanHistory />;
            case 'settings':
                return <Settings />;
            default:
                return <ScanResults />;
        }
    };

    return (
        <div className={`flex h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
            {sidebarOpen && <Sidebar />}

            <main className="flex-1 overflow-hidden flex flex-col">
                <header className={`shadow-sm border-b transition-colors duration-300 ${theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center space-x-4">
                            {/* Menu button to open sidebar when it's closed */}
                            {!sidebarOpen && (
                                <button
                                    onClick={() => dispatch(toggleSidebar())}
                                    className={`p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${theme === 'dark'
                                        ? 'hover:bg-gray-700 focus:ring-offset-gray-800 text-gray-400 hover:text-gray-200'
                                        : 'hover:bg-gray-100 focus:ring-offset-white text-gray-500 hover:text-gray-700'
                                        }`}
                                    aria-label="Open sidebar"
                                >
                                    <Menu className="w-5 h-5" />
                                </button>
                            )}

                            <div className="flex items-center space-x-3">
                                <img
                                    src="/images/a11y-logo.png"
                                    alt="A11y Audit Pro Logo"
                                    className="w-10 h-10 object-contain"
                                />
                                <h1 className={`text-xl font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                                    }`}>
                                    A11y Audit Pro
                                </h1>
                            </div>
                        </div>

                        <nav className="flex space-x-1">
                            {[
                                { id: 'dashboard', label: 'Dashboard' },
                                { id: 'scanner', label: 'Scanner' },
                                { id: 'history', label: 'History' },
                                { id: 'settings', label: 'Settings' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => dispatch(setActiveTab(tab.id as any))}
                                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
                                        } ${activeTab === tab.id
                                            ? theme === 'dark'
                                                ? 'bg-blue-900 text-blue-200'
                                                : 'bg-blue-100 text-blue-700'
                                            : theme === 'dark'
                                                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </header>

                <div className="flex-1 p-6 overflow-auto">
                    {renderActiveComponent()}
                </div>

                <Footer />
            </main>
        </div>
    );
};

export default Dashboard;
