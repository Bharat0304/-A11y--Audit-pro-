import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';
import { Result, AxeResults } from 'axe-core';
import { AdvancedAccessibilityResult } from '../utils/advancedAccessibilityEngine';
import { SemanticAnalysisResult } from '../utils/semanticAccessibilityAnalyzer';

export interface ScanResults {
    url: string;
    timestamp: string;
    violations: Result[];
    passes: Result[];
    incomplete: Result[];
    inapplicable: Result[];

    // Enhanced results
    advancedViolations?: AdvancedAccessibilityResult[];
    semanticIssues?: SemanticAnalysisResult[];
    scores?: {
        overall: number;
        wcagA: number;
        wcagAA: number;
        wcagAAA: number;
        semantic: number;
        cognitive: number;
    };
    compliance?: {
        level: 'A' | 'AA' | 'AAA' | 'Non-compliant';
        passRate: number;
        criticalIssues: number;
        totalTests: number;
    };
    scanDuration?: number;
    elementsAnalyzed?: number;
    aiInsights?: {
        summary: string;
        priorityRecommendations: string[];
        estimatedFixTime: string;
    };

    testEngine?: {
        name: string;
        version: string;
    };
}

interface ScanState {
    isScanning: boolean;
    currentResults: ScanResults | null;
    scanHistory: ScanResults[];
    error: string | null;
}

const initialState: ScanState = {
    isScanning: false,
    currentResults: null,
    scanHistory: [],
    error: null,
};

const scanSlice = createSlice({
    name: 'scan',
    initialState,
    reducers: {
        startScan: (state) => {
            state.isScanning = true;
            state.error = null;
        },
        setScanResults: (state, action: PayloadAction<ScanResults>) => {
            state.isScanning = false;
            // Direct assignment with type assertion
            state.currentResults = action.payload as any;

            // For history, we need to serialize safely
            const serializedEntry = JSON.parse(JSON.stringify(action.payload));
            state.scanHistory.unshift(serializedEntry);

            // Keep only last 10 scans
            if (state.scanHistory.length > 10) {
                state.scanHistory = state.scanHistory.slice(0, 10);
            }
        },
        setScanError: (state, action: PayloadAction<string>) => {
            state.isScanning = false;
            state.error = action.payload;
        },
        clearResults: (state) => {
            state.currentResults = null;
            state.error = null;
        },
        clearHistory: (state) => {
            state.scanHistory = [];
        },
    },
});

export const {
    startScan,
    setScanResults,
    setScanError,
    clearResults,
    clearHistory,
} = scanSlice.actions;

export default scanSlice.reducer;
