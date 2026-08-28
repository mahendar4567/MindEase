import React, { useEffect, useState } from 'react';
import { insightService } from '../services/insightService';
import { BatteryGauge } from '../components/BatteryGauge';
import { ExplainModal } from '../components/ExplainModal';
import {
  Brain,
  Zap,
  Moon,
  Flame,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const IntelligencePage: React.FC = () => {
  const [triggersData, setTriggersData] = useState<any>(null);
  const [sleepData, setSleepData] = useState<any>(null);
  const [overviewData, setOverviewData] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [burnoutExplainOpen, setBurnoutExplainOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [trigRes, sleepRes, overRes] = await Promise.all([
          insightService.getTriggers(),
          insightService.getSleep(),
          insightService.getOverview(),
        ]);

        setTriggersData(trigRes);
        setSleepData(sleepRes);
        setOverviewData(overRes.insights);
      } catch (err) {
        console.error('Error fetching intelligence page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 mb-3">
          <Brain className="w-3.5 h-3.5" />
          <span>Personal Pattern Analytics</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Pattern Intelligence & Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Discover how your recorded triggers, sleep quality, and daily habits impact your wellness trajectory.
        </p>
      </div>

      {/* Grid: Trigger Leaderboard & Sleep Correlation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trigger Leaderboard Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Stress Trigger Impact Ranking
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ranked from highest stress to lowest</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
            "{triggersData?.insightText || 'Log check-ins with stress triggers to calculate ranking.'}"
          </p>

          {triggersData?.rankedTriggers && triggersData.rankedTriggers.length > 0 ? (
            <div className="space-y-3">
              {triggersData.rankedTriggers.map((trig: any, idx: number) => (
                <div
                  key={trig.name}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-bold flex items-center justify-center text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{trig.name}</span>
                      <p className="text-slate-500 dark:text-slate-400">Logged {trig.count} times</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-rose-600 dark:text-rose-400 text-sm">
                      {trig.avgStress} / 10
                    </span>
                    <p className="text-slate-400">Avg Stress</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-400">
              No triggers recorded yet. Select triggers during your daily check-ins.
            </div>
          )}
        </div>

        {/* Sleep Pattern Analysis Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Sleep & Wellness Correlation Analysis
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">How sleep affects your mood and stress</p>
            </div>
          </div>

          {sleepData?.insights && sleepData.insights.length > 0 && (
            <div className="space-y-2">
              {sleepData.insights.map((insight: string, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 text-xs text-purple-950 dark:text-purple-200 font-medium flex items-center gap-2.5"
                >
                  <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          )}

          {sleepData?.comparison ? (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-center space-y-1">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                  Good Sleep (≥ 7h)
                </span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {sleepData.comparison.goodSleep.avgMood} / 10
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Avg Mood Score</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-center space-y-1">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                  Shorter Sleep (&lt; 7h)
                </span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {sleepData.comparison.shortSleep.avgStress} / 10
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Avg Stress Level</p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-400">
              Log sleep duration in your daily check-ins to unlock sleep correlation charts.
            </div>
          )}
        </div>
      </div>

      {/* Wellness Risk & Battery Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BatteryGauge battery={overviewData?.wellnessBattery} />

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Explainable Risk Analysis</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Transparent factor breakdown</p>
                </div>
              </div>

              <button
                onClick={() => setBurnoutExplainOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-full"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Why am I seeing this?
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every wellness indicator in MindEase is calculated using transparent, explainable rules without black-box AI claims.
            </p>

            <div className="space-y-2 mt-4">
              {overviewData?.wellnessRisk?.factors.map((factor: string, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ExplainModal
        isOpen={burnoutExplainOpen}
        onClose={() => setBurnoutExplainOpen(false)}
        title="Why am I seeing this Wellness Risk?"
        subtitle={`Current Level: ${overviewData?.wellnessRisk?.level || 'Low'}`}
        factors={overviewData?.wellnessRisk?.factors || ['Balanced pattern.']}
        disclaimer={overviewData?.wellnessRisk?.disclaimer || 'Self-reflection indicator, not a clinical diagnosis.'}
      />
    </div>
  );
};

export default IntelligencePage;
