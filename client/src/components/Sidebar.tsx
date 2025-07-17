import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleSidebar, setActiveTab } from '../store/uiSlice';
import { BarChart3, Search, History, Settings, Menu } from 'lucide-react';

const Sidebar: React.FC = () => {
    const { activeTab, theme } = useSelector((state: RootState) => state.ui);
    const dispatch = useDispatch();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'scanner', label: 'Scanner', icon: Search },
        { id: 'history', label: 'History', icon: History },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className={`w-64 shadow-lg border-r h-full transition-colors duration-300 ${theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
            }`}>
            <div className={`p-4 border-b transition-colors duration-300 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <img
                            src="/images/a11y-logo.png"
                            alt="A11y Audit Pro Logo"
                            className="w-8 h-8 object-contain"
                        />
                        <span className={`font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                            }`}>A11y Audit Pro</span>
                    </div>
                    <button
                        onClick={() => dispatch(toggleSidebar())}
                        className={`p-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${theme === 'dark'
                            ? 'hover:bg-gray-700 focus:ring-offset-gray-800'
                            : 'hover:bg-gray-100 focus:ring-offset-white'
                            }`}
                        aria-label="Toggle sidebar"
                    >
                        <Menu className={`w-5 h-5 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                    </button>
                </div>
            </div>

            <nav className="p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => dispatch(setActiveTab(item.id as any))}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
                                } ${activeTab === item.id
                                    ? theme === 'dark'
                                        ? 'bg-blue-900 text-blue-200 border border-blue-700'
                                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : theme === 'dark'
                                        ? 'text-gray-300 hover:bg-gray-700 hover:text-gray-100'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;
