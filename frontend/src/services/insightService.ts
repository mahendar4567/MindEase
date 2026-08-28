import api from './api';
import {
  WellnessBattery,
  BurnoutRisk,
  RecoveryTrend,
  CheckIn,
} from '../types';

export interface MindEaseMoment {
  title: string;
  suggestion: string;
  type: string;
}

export interface OverviewInsights {
  wellnessBattery: WellnessBattery;
  wellnessRisk: BurnoutRisk;
  recoveryTrend: RecoveryTrend;
  mindEaseMoment: MindEaseMoment;
  todayCheckIn: CheckIn | null;
  totalCheckIns: number;
}

export interface TrendDataPoint {
  date: string;
  fullDate: string;
  mood: number;
  stress: number;
  energy: number;
}

export interface TrendInsights {
  weekTrend: TrendDataPoint[];
  monthTrend: TrendDataPoint[];
}

export const insightService = {
  getOverview: async () => {
    const response = await api.get<{ success: boolean; insights: OverviewInsights }>(
      '/api/insights/overview'
    );
    return response.data;
  },

  getTrends: async () => {
    const response = await api.get<{ success: boolean; weekTrend: TrendDataPoint[]; monthTrend: TrendDataPoint[] }>(
      '/api/insights/trends'
    );
    return response.data;
  },

  getTriggers: async () => {
    const response = await api.get<{
      success: boolean;
      rankedTriggers: Array<{ name: string; count: number; avgStress: number; avgMood: number }>;
      highestStressTrigger: { name: string; count: number; avgStress: number; avgMood: number } | null;
      insightText: string;
    }>('/api/insights/triggers');
    return response.data;
  },

  getSleep: async () => {
    const response = await api.get<{
      success: boolean;
      hasData: boolean;
      insights: string[];
      comparison: any;
    }>('/api/insights/sleep');
    return response.data;
  },

  getWeeklyReport: async () => {
    const response = await api.get<{ success: boolean; report: any }>('/api/reports/weekly');
    return response.data;
  },
};
