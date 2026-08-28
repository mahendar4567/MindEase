import api from './api';

export interface AdvancedFeaturesSummary {
  stability: {
    status: 'Stable' | 'Moderately Variable' | 'Highly Variable';
    badgeColor: string;
    explanation: string;
    disclaimer: string;
  };
  pressureCombinations: {
    hasData: boolean;
    combinations: Array<{ pair: string; count: number; avgStress: number; avgMood: number; avgEnergy: number }>;
    insightText: string;
    disclaimer: string;
  };
  recoveryTime: {
    hasData: boolean;
    status: 'Short recovery' | 'Moderate recovery' | 'Extended recovery';
    avgRecoveryDays: number;
    message: string;
    disclaimer: string;
  };
  stressChains: {
    hasChain: boolean;
    chains: Array<{ title: string; sequence: string[]; occurrences: number }>;
    insightText: string;
    disclaimer: string;
  };
  emotionMismatch: {
    hasMismatch: boolean;
    message: string;
    factors: string[];
    disclaimer: string;
  };
  semesterTimeline: {
    title: string;
    semesterTitle: string;
    startDate: string;
    endDate: string;
    checkInsCount: number;
    eventsCount: number;
    summary: string;
    disclaimer: string;
  };
  patternReplay: {
    totalSteps: number;
    replaySteps: Array<{
      stepIndex: number;
      date: string;
      dateLabel: string;
      mood: number;
      stress: number;
      energy: number;
      sleepDuration?: number;
      summary: string;
      event?: { title: string; type: string } | null;
    }>;
  };
  pressureForecast: {
    hasForecast: boolean;
    status: string;
    badgeColor: string;
    message: string;
    nextEvent?: { title: string; eventType: string; daysUntil: number };
    disclaimer: string;
  };
  semesterConfig: any;
}

export const advancedFeaturesService = {
  getSummary: async () => {
    const response = await api.get<{ success: boolean; features: AdvancedFeaturesSummary }>(
      '/api/advanced-features/summary'
    );
    return response.data;
  },

  saveSemesterConfig: async (data: { title?: string; startDate: string; endDate: string }) => {
    const response = await api.post<{ success: boolean; message: string; semester: any }>(
      '/api/advanced-features/semester',
      data
    );
    return response.data;
  },
};
