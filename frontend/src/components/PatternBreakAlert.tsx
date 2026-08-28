import React from 'react';
import { InsightConfidence } from '../services/advancedIntelligenceService';
import { Activity, ShieldCheck, AlertCircle } from 'lucide-react';

interface PatternBreakAlertProps {
  data: {
    hasPatternBreak: boolean;
    confidence: InsightConfidence;
    title: string;
    message: string;
    factors: string[];
    disclaimer: string;
  } | null;
}

export const PatternBreakAlert: React.FC<PatternBreakAlertProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {data.title}
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${data.confidence.badgeColor}`}>
                {data.confidence.level}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Detects routine behavior shifts</p>
          </div>
        </div>

        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            data.hasPatternBreak
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
          }`}
        >
          {data.hasPatternBreak ? 'Shift Detected' : 'Routine Balanced'}
        </span>
      </div>

      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{data.message}</p>

      {data.factors && data.factors.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Changed Factors</p>
          <ul className="space-y-1">
            {data.factors.map((f, i) => (
              <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
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

export default PatternBreakAlert;
