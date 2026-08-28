import React, { useState } from 'react';
import { advancedIntelligenceService } from '../services/advancedIntelligenceService';
import { StudentEvent } from '../types';
import { X, Sparkles, Activity, AlertCircle, Save } from 'lucide-react';

interface EventReflectionModalProps {
  isOpen: boolean;
  event: StudentEvent | null;
  reflectionType: 'before' | 'after';
  onClose: () => void;
  onSuccess: () => void;
}

export const EventReflectionModal: React.FC<EventReflectionModalProps> = ({
  isOpen,
  event,
  reflectionType,
  onClose,
  onSuccess,
}) => {
  const [moodScore, setMoodScore] = useState<number>(6);
  const [stressScore, setStressScore] = useState<number>(7);
  const [note, setNote] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      await advancedIntelligenceService.submitEventReflection(event._id, {
        type: reflectionType,
        moodScore,
        stressScore,
        note: note.trim(),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save reflection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {reflectionType === 'before' ? 'Before Event Reflection' : 'After Event Reflection'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">"{event.title}"</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Mood Score
              </label>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{moodScore} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={moodScore}
              onChange={(e) => setMoodScore(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-rose-500" />
                Anticipated Stress
              </label>
              <span className="text-sm font-bold text-rose-600 dark:text-rose-400">{stressScore} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={stressScore}
              onChange={(e) => setStressScore(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              {reflectionType === 'before' ? 'How are you feeling about this event?' : 'How do you feel now after completion?'}
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add an optional private reflection note..."
              className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md"
            >
              <Save className="w-4 h-4" /> Save Reflection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventReflectionModal;
