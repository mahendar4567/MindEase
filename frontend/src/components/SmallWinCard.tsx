import React, { useEffect, useState } from 'react';
import { smallWinService, SmallWin } from '../services/smallWinService';
import { formatDate } from '../utils/formatters';
import { Trophy, Plus, Trash2, CheckCircle2, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'Completed a difficult task',
  'Finished an assignment',
  'Exercise',
  'Talked to someone',
  'Took a break',
  'Achieved a goal',
  'Other',
];

export const SmallWinCard: React.FC = () => {
  const [wins, setWins] = useState<SmallWin[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Completed a difficult task');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchWins = async () => {
    try {
      const data = await smallWinService.getSmallWins();
      setWins(data.smallWins);
    } catch (e) {
      console.error('Error fetching small wins:', e);
    }
  };

  useEffect(() => {
    fetchWins();
  }, []);

  const handleAddWin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await smallWinService.createSmallWin({ title: title.trim(), category });
      setTitle('');
      setIsAdding(false);
      setSuccessMsg('Small win recorded!');
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchWins();
    } catch (e) {
      console.error('Error creating small win:', e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await smallWinService.deleteSmallWin(id);
      fetchWins();
    } catch (e) {
      console.error('Error deleting small win:', e);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Small Wins Tracker</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Celebrate daily positive achievements</p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" /> Record Win
        </button>
      </div>

      {successMsg && (
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {isAdding && (
        <form onSubmit={handleAddWin} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Achievement / Win
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Completed Physics problem set"
              className="block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700"
            >
              Save Win
            </button>
          </div>
        </form>
      )}

      {/* Wins Timeline List */}
      {wins.length > 0 ? (
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {wins.map((w) => (
            <div
              key={w._id}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{w.title}</p>
                  <span className="text-[10px] text-slate-400">{w.category} • {formatDate(w.date)}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(w._id)}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          No small wins recorded yet. Record your daily positive achievements!
        </div>
      )}
    </div>
  );
};

export default SmallWinCard;
