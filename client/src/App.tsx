import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppSelector } from './store/hooks';
import Dashboard from './components/Dashboard';

function AppContent() {
  const theme = useAppSelector(state => state.ui.theme);

  useEffect(() => {
    // Apply theme class to document root for global theme support
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`App min-h-screen transition-colors duration-300 ${theme === 'dark'
        ? 'bg-gray-900 text-gray-100'
        : 'bg-gray-50 text-gray-900'
      }`}>
      <Dashboard />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
