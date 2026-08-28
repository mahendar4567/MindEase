import React from 'react';
import { InsightConfidence } from '../services/advancedIntelligenceService';
import { ShieldAlert, Zap, ShieldCheck } from 'lucide-react';

interface EmotionalLoadGaugeProps {
  data: {
    score: number;
    category: 'Light Load' | 'Moderate Load' | 'High Load' | 'Heavy Load';
    badgeColor: string;
    explanation: string;
    confidence: InsightConfidence;
    factors: string[];
    disclaimer: string;
  } | null;
}

export const EmotionalLoadGauge: React.FC<EmotionalLoadGaugeProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Emotional Load Budget
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${data.confidence.badgeColor}`}>
                {data.confidence.level}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Personal planning capacity indicator</p>
          </div>
        </div>

        <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${data.badgeColor}`}>
          {data.category}
        </span>
      </div>

      {/* Progress Bar Gauge */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {data.score} <span className="text-sm font-semibold text-slate-400">/ 100</span>
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{data.category}</span>
        </div>

        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              data.score > 70
                ? 'bg-rose-500'
                : data.score > 50
                ? 'bg-orange-500'
                : data.score > 30
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.max(5, data.score)}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{data.explanation}</p>

      {/* Factor List */}
      {data.factors && data.factors.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Contributing Factors</p>
          <ul className="space-y-1">
            {data.factors.map((f, i) => (
              <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>{data.disclaimer}</span>
      </div>
    </div>
  );
};

export default EmotionalLoadGauge;
