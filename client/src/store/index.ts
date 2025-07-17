import { configureStore } from '@reduxjs/toolkit';
import scanReducer from './scanSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
    reducer: {
        scan: scanReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable for axe-core results containing DOM elements
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
