import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { insightService, OverviewInsights, TrendDataPoint } from '../services/insightService';
import { checkInService } from '../services/checkInService';
import { eventService } from '../services/eventService';
import {
  advancedIntelligenceService,
  AdvancedIntelligenceData,
} from '../services/advancedIntelligenceService';
import {
  advancedFeaturesService,
  AdvancedFeaturesSummary,
} from '../services/advancedFeaturesService';
import { CheckIn, StudentEvent } from '../types';

import BatteryGauge from '../components/BatteryGauge';
import ExplainModal from '../components/ExplainModal';
import CheckInModal from '../components/CheckInModal';
import MindfulReturnBanner from '../components/MindfulReturnBanner';
import EmotionalLoadGauge from '../components/EmotionalLoadGauge';
import PatternBreakAlert from '../components/PatternBreakAlert';
import SilentStruggleCard from '../components/SilentStruggleCard';
import ExamRadarChart from '../components/ExamRadarChart';
import EnergyCalendarGrid from '../components/EnergyCalendarGrid';
import SmallWinCard from '../components/SmallWinCard';
import PrivacyOverlay from '../components/PrivacyOverlay';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

import {
  PlusCircle,
  TrendingUp,
  Brain,
  Sparkles,
  Flame,
  HelpCircle,
  FlameKindling,
  Lightbulb,
  ShieldCheck,
  EyeOff,
  Calendar,
  Lock,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [insights, setInsights] = useState<OverviewInsights | null>(null);
  const [advancedData, setAdvancedData] = useState<AdvancedIntelligenceData | null>(null);
  const [advFeatures, setAdvFeatures] = useState<AdvancedFeaturesSummary | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [mindfulGap, setMindfulGap] = useState<{ isGap: boolean; daysGap: number } | null>(null);
  const [trendTab, setTrendTab] = useState<'week' | 'month'>('week');
  const [weekTrend, setWeekTrend] = useState<TrendDataPoint[]>([]);
  const [monthTrend, setMonthTrend] = useState<TrendDataPoint[]>([]);
  const [checkInsList, setCheckInsList] = useState<CheckIn[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [checkInModalOpen, setCheckInModalOpen] = useState<boolean>(false);
  const [burnoutExplainOpen, setBurnoutExplainOpen] = useState<boolean>(false);
  const [privacyOverlayActive, setPrivacyOverlayActive] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [overviewData, trendsData, checkInsRes, advancedRes, featRes] = await Promise.all([
        insightService.getOverview(),
        insightService.getTrends(),
        checkInService.getCheckIns(30),
        advancedIntelligenceService.getSummary(),
        advancedFeaturesService.getSummary(),
      ]);

      setInsights(overviewData.insights);
      setStreak(checkInsRes.streak || 0);
      setMindfulGap(checkInsRes.mindfulReturnGap || null);
      setCheckInsList(checkInsRes.checkIns || []);
      setWeekTrend(trendsData.weekTrend);
      setMonthTrend(trendsData.monthTrend);
      setAdvancedData(advancedRes.data);
      setAdvFeatures(featRes.features);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const today = insights?.todayCheckIn;

  const getBurnoutBadge = (level?: string) => {
    switch (level) {
      case 'High':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300';
      case 'Moderate':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Privacy Mode Full Blur Screen */}
      <PrivacyOverlay
        isPrivate={privacyOverlayActive}
        onUnlock={() => setPrivacyOverlayActive(false)}
      />

      {/* Mindful Return Experience Banner */}
      {mindfulGap?.isGap && (
        <MindfulReturnBanner
          daysGap={mindfulGap.daysGap}
          onStartToday={() => setCheckInModalOpen(true)}
        />
      )}

      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-8 sm:p-10 text-white shadow-xl shadow-indigo-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-indigo-100 border border-white/20">
                <Brain className="w-3.5 h-3.5" />
                <span>Personal Pattern Intelligence</span>
              </div>
              {advFeatures?.stability && (
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold ${advFeatures.stability.badgeColor}`}>
                  Stability: {advFeatures.stability.status}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.displayName}!
            </h1>
            <p className="mt-2 text-indigo-100 text-base sm:text-lg font-medium">
              MindEase – Private student wellness & pattern tracking foundation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPrivacyOverlayActive(true)}
              title="Privacy Mode Blur"
              className="p-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
            >
              <EyeOff className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCheckInModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 active:bg-indigo-100 font-bold text-sm shadow-lg transition-all transform hover:scale-[1.02]"
            >
              <PlusCircle className="w-5 h-5" />
              {today ? "Edit Today's Check-in" : 'Daily Check-in'}
            </button>
          </div>
        </div>
      </div>

      {/* Today's Summary Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Mood</p>
          <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
            {today ? `${today.moodScore}/10` : '--'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Self-rated mood</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Stress</p>
          <p className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {today ? `${today.stressScore}/10` : '--'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Stress intensity</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Energy Level</p>
          <p className="text-3xl font-extrabold text-amber-500 mt-1">
            {today ? `${today.energyLevel || 5}/10` : '--'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Vitality rating</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sleep Duration</p>
          <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
            {today?.sleepDuration ? `${today.sleepDuration}h` : '--'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Hours recorded</p>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/60 text-center">
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Check-in Streak
          </p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <FlameKindling className="w-6 h-6 text-amber-500" />
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{streak}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Days logged in a row</p>
        </div>
      </div>

      {/* MindEase Moments Smart Micro-Intervention */}
      {insights?.mindEaseMoment && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 dark:from-indigo-950/60 dark:via-purple-950/60 dark:to-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-md">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {insights.mindEaseMoment.title}
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              "{insights.mindEaseMoment.suggestion}"
            </p>
          </div>
        </div>
      )}

      {/* YOUR PERSONAL PATTERNS SECTION */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                YOUR PERSONAL PATTERNS
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calculated strictly from your own historical data • No comparison with others
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/semester"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" /> Semester Timeline
            </Link>
            <Link
              to="/data-transparency"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition-colors"
            >
              <Lock className="w-3.5 h-3.5" /> Transparency Center
            </Link>
          </div>
        </div>

        {/* Pattern Intelligence Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmotionalLoadGauge data={advancedData?.emotionalLoad || null} />
          <PatternBreakAlert data={advancedData?.patternBreak || null} />
          <SilentStruggleCard data={advancedData?.silentPattern || null} />
          <ExamRadarChart data={advancedData?.examStressRadar || null} />
        </div>

        {/* Small Wins Tracker & Energy Calendar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SmallWinCard />
          <div className="lg:col-span-2">
            <EnergyCalendarGrid checkIns={checkInsList} />
          </div>
        </div>
      </div>

      {/* Mood & Stress Trends (Week / Month Toggle) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Mood & Stress Trends</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Track your trajectory over time</p>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setTrendTab('week')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                trendTab === 'week'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Week (7 Days)
            </button>
            <button
              onClick={() => setTrendTab('month')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                trendTab === 'month'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Month (30 Days)
            </button>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          {((trendTab === 'week' ? weekTrend : monthTrend) || []).length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendTab === 'week' ? weekTrend : monthTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis domain={[1, 10]} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg text-xs space-y-1">
                          <p className="font-semibold text-slate-900 dark:text-white">{label}</p>
                          <p className="text-indigo-600 font-medium">Mood: {payload[0].value} / 10</p>
                          <p className="text-rose-500 font-medium">Stress: {payload[1].value} / 10</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  dataKey="mood"
                  name="Mood Score"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#6366f1' }}
                />
                <Line
                  type="monotone"
                  dataKey="stress"
                  name="Stress Level"
                  stroke="#f43f5e"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#f43f5e' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              Log daily check-ins to visualize your mood and stress trend curves.
            </div>
          )}
        </div>
      </div>

      {/* Wellness Battery, Risk & Recovery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BatteryGauge battery={insights?.wellnessBattery} />

        <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Wellness Risk</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Pattern risk score</p>
                </div>
              </div>

              <button
                onClick={() => setBurnoutExplainOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-full"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Why?
              </button>
            </div>

            <div className="flex items-baseline gap-3 my-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {insights?.wellnessRisk?.level || 'Low'} Risk
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${getBurnoutBadge(insights?.wellnessRisk?.level)}`}>
                {insights?.wellnessRisk?.level || 'Low'}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {insights?.wellnessRisk?.factors[0] || 'Stress levels remain within balanced parameters.'}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400">
            Personal indicator • Non-medical
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Recovery Trend</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Recent trajectory</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-300">
                {insights?.recoveryTrend?.status || 'Stable'}
              </span>
            </div>

            <div className="text-2xl font-extrabold text-slate-900 dark:text-white my-2">
              {insights?.recoveryTrend?.status || 'Stable'}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {insights?.recoveryTrend?.description || 'Your pattern shows balanced trajectory.'}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400">
            Based on recent recorded check-in data
          </div>
        </div>
      </div>

      <ExplainModal
        isOpen={burnoutExplainOpen}
        onClose={() => setBurnoutExplainOpen(false)}
        title="Why am I seeing this Wellness Risk?"
        subtitle={`Current Level: ${insights?.wellnessRisk?.level || 'Low'}`}
        factors={insights?.wellnessRisk?.factors || ['Balanced pattern.']}
        disclaimer={insights?.wellnessRisk?.disclaimer || 'Self-reflection indicator, not a clinical diagnosis.'}
      />

      <CheckInModal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default DashboardPage;
