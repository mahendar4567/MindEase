import React, { useState } from 'react';
import { InsightConfidence } from '../services/advancedIntelligenceService';
import ExplainModal from './ExplainModal';
import { Eye, HelpCircle, ShieldCheck } from 'lucide-react';

interface SilentStruggleCardProps {
  data: {
    hasSilentPattern: boolean;
    confidence: InsightConfidence;
    title: string;
    message: string;
    factors: string[];
    disclaimer: string;
  } | null;
}

export const SilentStruggleCard: React.FC<SilentStruggleCardProps> = ({ data }) => {
  const [explainOpen, setExplainOpen] = useState(false);

  if (!data) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {data.title}
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${data.confidence.badgeColor}`}>
                {data.confidence.level}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Monitors self-reported signal alignment</p>
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

      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{data.message}</p>

      <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>{data.disclaimer}</span>
      </div>

      <ExplainModal
        isOpen={explainOpen}
        onClose={() => setExplainOpen(false)}
        title="Why am I seeing this Silent Pattern insight?"
        subtitle={data.message}
        factors={data.factors.length > 0 ? data.factors : ['Self-reported mood, stress, and energy levels remain in alignment.']}
        disclaimer={data.disclaimer}
      />
    </div>
  );
};

export default SilentStruggleCard;
