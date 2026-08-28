export interface User {
  _id: string;
  displayName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckIn {
  _id: string;
  userId: string;
  moodScore: number;
  stressScore: number;
  energyLevel?: number;
  triggers: string[];
  helpfulActions?: string[];
  sleepDuration?: number;
  sleepQuality?: number;
  note?: string;
  date: string;
  createdAt: string;
}

export type EventType =
  | 'Exam'
  | 'Assignment Deadline'
  | 'Project Submission'
  | 'Placement Interview'
  | 'Career Event'
  | 'Personal Event'
  | 'Other';

export interface EventReflection {
  moodScore?: number;
  stressScore?: number;
  note?: string;
  date?: string;
}

export interface StudentEvent {
  _id: string;
  userId: string;
  title: string;
  eventType: EventType;
  eventDate: string;
  notes?: string;
  beforeReflection?: EventReflection;
  afterReflection?: EventReflection;
  createdAt: string;
}

export interface WellnessBattery {
  score: number;
  category: 'Low' | 'Drained' | 'Moderate' | 'Good' | 'Strong';
  factors: string[];
  disclaimer: string;
}

export interface BurnoutRisk {
  level: 'Low' | 'Moderate' | 'High';
  factors: string[];
  disclaimer: string;
}

export interface RecoveryTrend {
  status: 'Improving' | 'Stable' | 'Declining';
  description: string;
  disclaimer: string;
}

export interface TriggerRanking {
  name: string;
  count: number;
  avgStress: number;
  avgMood: number;
}

export interface TriggerIntelligence {
  rankings: TriggerRanking[];
  highestStressTrigger: TriggerRanking | null;
  summary: string;
}

export interface SleepCorrelation {
  hasData: boolean;
  insights: string[];
  comparison: {
    goodSleep: { count: number; avgMood: string; avgStress: string };
    shortSleep: { count: number; avgMood: string; avgStress: string };
  };
}

export interface WeeklyReport {
  avgMood: string;
  avgStress: string;
  wellnessBattery: number;
  mostFrequentTrigger: string;
  bestDay: string;
  difficultDay: string;
  recoveryTrend: string;
  burnoutRiskLevel: string;
  narrativeSummary: string;
}

export interface IntelligenceSummary {
  wellnessBattery: WellnessBattery;
  burnoutRisk: BurnoutRisk;
  recoveryTrend: RecoveryTrend;
  sleepCorrelation: SleepCorrelation;
  triggerIntelligence: TriggerIntelligence;
  weeklyReport: WeeklyReport;
  eventsCount: number;
  checkInsCount: number;
}

export type ThemeMode = 'light' | 'dark';
