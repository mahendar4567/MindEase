import api from './api';

export interface InsightConfidence {
  level: 'Insufficient Data' | 'Early Pattern' | 'Emerging Pattern' | 'Established Pattern';
  badgeColor: string;
  description: string;
  checkInCount: number;
  percentage: number;
  hasEnoughData: boolean;
}

export interface BaselineRange {
  mean: number;
  stdDev: number;
  min: number;
  max: number;
  rangeLow: number;
  rangeHigh: number;
}

export interface AdvancedIntelligenceData {
  confidence: InsightConfidence;
  baseline: {
    hasBaseline: boolean;
    confidence: InsightConfidence;
    ranges: {
      mood: BaselineRange;
      stress: BaselineRange;
      energy: BaselineRange;
      sleepDuration: BaselineRange;
      sleepQuality: BaselineRange;
    } | null;
    insights: string[];
  };
  patternBreak: {
    hasPatternBreak: boolean;
    confidence: InsightConfidence;
    title: string;
    message: string;
    factors: string[];
    disclaimer: string;
  };
  silentPattern: {
    hasSilentPattern: boolean;
    confidence: InsightConfidence;
    title: string;
    message: string;
    factors: string[];
    disclaimer: string;
  };
  examStressRadar: {
    hasData: boolean;
    confidence: InsightConfidence;
    title: string;
    insightText: string;
    timelinePoints: Array<{ phase: string; avgStress: number }>;
    disclaimer: string;
  };
  emotionalLoad: {
    score: number;
    category: 'Light Load' | 'Moderate Load' | 'High Load' | 'Heavy Load';
    badgeColor: string;
    explanation: string;
    confidence: InsightConfidence;
    factors: string[];
    disclaimer: string;
  };
  helpfulActionAnalysis: {
    confidence: InsightConfidence;
    topActions: Array<{
      name: string;
      count: number;
      highEnergyAssociation: number;
      lowStressAssociation: number;
    }>;
    insights: string[];
    disclaimer: string;
  };
  totalCheckIns: number;
  totalEvents: number;
}

export const advancedIntelligenceService = {
  getSummary: async () => {
    const response = await api.get<{ success: boolean; data: AdvancedIntelligenceData }>(
      '/api/advanced-intelligence/summary'
    );
    return response.data;
  },

  submitEventReflection: async (
    eventId: string,
    data: { type: 'before' | 'after'; moodScore: number; stressScore: number; note?: string }
  ) => {
    const response = await api.put<{ success: boolean; message: string; event: any }>(
      `/api/events/${eventId}/reflection`,
      data
    );
    return response.data;
  },
};
