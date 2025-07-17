import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
    activeTab: 'dashboard' | 'scanner' | 'history' | 'settings';
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    notifications: Array<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
        timestamp: string;
    }>;
}

const initialState: UiState = {
    activeTab: 'dashboard',
    sidebarOpen: true,
    theme: 'light',
    notifications: [],
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setActiveTab: (state, action: PayloadAction<UiState['activeTab']>) => {
            state.activeTab = action.payload;
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setTheme: (state, action: PayloadAction<UiState['theme']>) => {
            state.theme = action.payload;
        },
        addNotification: (state, action: PayloadAction<Omit<UiState['notifications'][0], 'id' | 'timestamp'>>) => {
            const notification = {
                ...action.payload,
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
            };
            state.notifications.unshift(notification);
            // Keep only last 5 notifications
            if (state.notifications.length > 5) {
                state.notifications = state.notifications.slice(0, 5);
            }
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(n => n.id !== action.payload);
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
    },
});

export const {
    setActiveTab,
    toggleSidebar,
    setTheme,
    addNotification,
    removeNotification,
    clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
