import React from 'react';
import { HeartHandshake, Sparkles } from 'lucide-react';

interface MindfulReturnBannerProps {
  daysGap: number;
  onStartToday: () => void;
}

export const MindfulReturnBanner: React.FC<MindfulReturnBannerProps> = ({ daysGap, onStartToday }) => {
  if (daysGap < 3) return null;

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-50 via-emerald-50 to-indigo-50 dark:from-teal-950/60 dark:via-emerald-950/60 dark:to-indigo-950/60 border border-teal-200 dark:border-teal-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="p-3 rounded-2xl bg-teal-600 text-white shadow-md">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Welcome Back to MindEase!
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300">
              No Pressure
            </span>
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Welcome back. No need to catch up on the past {daysGap} days—just start fresh from today whenever you feel ready.
          </p>
        </div>
      </div>

      <button
        onClick={onStartToday}
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-semibold shadow-md transition-all whitespace-nowrap"
      >
        <Sparkles className="w-4 h-4" /> Start Today's Check-in
      </button>
    </div>
  );
};

export default MindfulReturnBanner;
