import React from 'react';
import { CheckIn } from '../types';
import { Calendar, Zap, Sparkles } from 'lucide-react';

interface EnergyCalendarGridProps {
  checkIns: CheckIn[];
}

export const EnergyCalendarGrid: React.FC<EnergyCalendarGridProps> = ({ checkIns }) => {
  const getDayStatus = (c?: CheckIn) => {
    if (!c) return { label: 'No Data', color: 'bg-slate-100 dark:bg-slate-800 text-slate-400' };
    const energy = c.energyLevel || 5;
    if (c.stressScore >= 7) return { label: 'High Stress', color: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' };
    if (energy >= 7) return { label: 'High Energy', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' };
    if (energy <= 4) return { label: 'Low Energy', color: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300' };
    return { label: 'Balanced', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' };
  };

  // Generate last 14 days grid
  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dStr = d.toISOString().split('T')[0];
    const match = checkIns.find((c) => new Date(c.date).toISOString().split('T')[0] === dStr);
    return {
      date: d,
      dateLabel: d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
      checkIn: match,
      status: getDayStatus(match),
    };
  });

  // Calculate Weekend vs Weekday energy
  const weekendEntries = checkIns.filter((c) => {
    const dayNum = new Date(c.date).getDay();
    return dayNum === 0 || dayNum === 6;
  });
  const avgWeekendEnergy = weekendEntries.length > 0
    ? (weekendEntries.reduce((s, c) => s + (c.energyLevel || 5), 0) / weekendEntries.length).toFixed(1)
    : null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Personal Energy Calendar</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">14-day energy & stress rhythm mapping</p>
          </div>
        </div>
      </div>

      {avgWeekendEnergy && (
        <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200 font-medium">
          <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>Your recorded energy averages {avgWeekendEnergy}/10 on weekends.</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-7 gap-2.5">
        {days.map((item, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-2 text-center transition-all ${item.status.color}`}
          >
            <span className="text-[11px] font-bold opacity-80">{item.dateLabel}</span>
            <span className="text-xs font-extrabold">{item.status.label}</span>
            {item.checkIn && (
              <span className="text-[10px] opacity-75 font-semibold">
                Mood {item.checkIn.moodScore} • Stress {item.checkIn.stressScore}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnergyCalendarGrid;
