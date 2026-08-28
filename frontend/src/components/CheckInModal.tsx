import React, { useState, useEffect } from 'react';
import { checkInService } from '../services/checkInService';
import WhatHelpedMePicker from './WhatHelpedMePicker';
import { X, Heart, Activity, Moon, Star, AlertCircle, Sparkles, Zap } from 'lucide-react';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const STRESS_TRIGGERS = [
  'Exams',
  'Assignments',
  'Career',
  'Placement',
  'Family',
  'Friends',
  'Financial concerns',
  'Sleep',
  'Health',
  'Relationships',
  'Other',
];

export const CheckInModal: React.FC<CheckInModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [moodScore, setMoodScore] = useState<number>(7);
  const [stressScore, setStressScore] = useState<number>(4);
  const [energyLevel, setEnergyLevel] = useState<number>(6);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [helpfulActions, setHelpfulActions] = useState<string[]>([]);
  const [sleepDuration, setSleepDuration] = useState<string>('7.5');
  const [sleepQuality, setSleepQuality] = useState<number>(4);
  const [note, setNote] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchToday = async () => {
        try {
          const res = await checkInService.getCheckIns(1);
          const startOfDay = new Date();
          startOfDay.setHours(0, 0, 0, 0);

          const todayEntry = res.checkIns.find(
            (c) => new Date(c.date) >= startOfDay
          );

          if (todayEntry) {
            setEditingId(todayEntry._id);
            setMoodScore(todayEntry.moodScore);
            setStressScore(todayEntry.stressScore);
            setEnergyLevel(todayEntry.energyLevel || 5);
            setSelectedTriggers(todayEntry.triggers || []);
            setHelpfulActions((todayEntry as any).helpfulActions || []);
            setSleepDuration(todayEntry.sleepDuration !== undefined ? String(todayEntry.sleepDuration) : '7.5');
            setSleepQuality(todayEntry.sleepQuality || 4);
            setNote(todayEntry.note || '');
          } else {
            setEditingId(null);
          }
        } catch (e) {
          console.error('Error checking today check-in:', e);
        }
      };
      fetchToday();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleTrigger = (trigger: string) => {
    if (selectedTriggers.includes(trigger)) {
      setSelectedTriggers(selectedTriggers.filter((t) => t !== trigger));
    } else {
      setSelectedTriggers([...selectedTriggers, trigger]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      if (editingId) {
        await checkInService.updateCheckIn(editingId, {
          moodScore,
          stressScore,
          energyLevel,
          triggers: selectedTriggers,
          helpfulActions,
          sleepDuration: sleepDuration ? Number(sleepDuration) : undefined,
          sleepQuality: sleepQuality ? Number(sleepQuality) : undefined,
          note: note.trim(),
        });
      } else {
        await checkInService.createCheckIn({
          moodScore,
          stressScore,
          energyLevel,
          triggers: selectedTriggers,
          helpfulActions,
          sleepDuration: sleepDuration ? Number(sleepDuration) : undefined,
          sleepQuality: sleepQuality ? Number(sleepQuality) : undefined,
          note: note.trim(),
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save check-in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingId ? "Edit Today's Check-in" : 'Daily Wellness Check-in'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Takes less than one minute • Scoped to your private account.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center gap-3 text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mood Rating (1-10) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Mood Score (1 to 10)
              </label>
              <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">{moodScore} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={moodScore}
              onChange={(e) => setMoodScore(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Stress Level (1-10) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-500" />
                Stress Score (1 to 10)
              </label>
              <span className="text-base font-bold text-rose-600 dark:text-rose-400">{stressScore} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={stressScore}
              onChange={(e) => setStressScore(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
          </div>

          {/* Energy Level (1-10) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Energy Level (1 to 10)
              </label>
              <span className="text-base font-bold text-amber-600 dark:text-amber-400">{energyLevel} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Sleep duration & quality */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <Moon className="w-4 h-4 text-purple-500" />
              Sleep Metrics (Hours & Quality)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Sleep Duration (Hours)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={sleepDuration}
                  onChange={(e) => setSleepDuration(e.target.value)}
                  className="block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Sleep Quality (1 to 5)
                </label>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSleepQuality(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= sleepQuality ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stress Triggers */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Select Stress Triggers
            </label>
            <div className="flex flex-wrap gap-2">
              {STRESS_TRIGGERS.map((trigger) => {
                const selected = selectedTriggers.includes(trigger);
                return (
                  <button
                    key={trigger}
                    type="button"
                    onClick={() => toggleTrigger(trigger)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      selected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {trigger}
                  </button>
                );
              })}
            </div>
          </div>

          {/* What Helped Me Picker */}
          <WhatHelpedMePicker selectedActions={helpfulActions} onChange={setHelpfulActions} />

          {/* Optional Private Note */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Optional Private Note
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Private note visible only to your account..."
              className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all"
            >
              {loading ? 'Saving...' : editingId ? 'Update Check-in' : 'Save Check-in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckInModal;
