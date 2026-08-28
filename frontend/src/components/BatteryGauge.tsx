import React, { useState } from 'react';
import { WellnessBattery } from '../types';
import ExplainModal from './ExplainModal';
import { Zap, HelpCircle, ShieldCheck } from 'lucide-react';

interface BatteryGaugeProps {
  battery?: WellnessBattery;
}

export const BatteryGauge: React.FC<BatteryGaugeProps> = ({ battery }) => {
  const [explainOpen, setExplainOpen] = useState(false);

  const score = battery?.score ?? 70;
  const category = battery?.category ?? 'Moderate';
  const factors = battery?.factors ?? ['Baseline initialized based on recent check-ins.'];
  const disclaimer =
    battery?.disclaimer ?? 'This score is a personal wellness indicator and is not a medical assessment.';

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'Low':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300';
      case 'Drained':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300';
      case 'Moderate':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
      case 'Good':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300';
      case 'Strong':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getBarColor = (val: number) => {
    if (val <= 30) return 'bg-rose-500';
    if (val <= 50) return 'bg-orange-500';
    if (val <= 70) return 'bg-amber-500';
    if (val <= 85) return 'bg-indigo-600';
    return 'bg-emerald-500';
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Wellness Battery</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Recent overall capacity</p>
            </div>
          </div>

          <button
            onClick={() => setExplainOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-full"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Why?
          </button>
        </div>

        {/* Big Score Display */}
        <div className="flex items-baseline gap-3 my-2">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {score}%
          </span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${getCategoryBadge(category)}`}>
            {category}
          </span>
        </div>

        {/* Battery Fill Bar */}
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 mt-3 border border-slate-200/60 dark:border-slate-700/60">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor(score)}`}
            style={{ width: `${Math.max(5, score)}%` }}
          />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 text-indigo-500" />
        <span className="truncate">Personal wellness indicator • Non-medical</span>
      </div>

      <ExplainModal
        isOpen={explainOpen}
        onClose={() => setExplainOpen(false)}
        title="Wellness Battery Factors"
        subtitle={`Current score: ${score}% (${category})`}
        factors={factors}
        disclaimer={disclaimer}
      />
    </div>
  );
};

export default BatteryGauge;
