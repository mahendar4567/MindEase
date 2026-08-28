import React, { useEffect, useState } from 'react';
import { transparencyService, DataMetrics } from '../services/transparencyService';
import { formatDate } from '../utils/formatters';
import {
  ShieldCheck,
  Download,
  Trash2,
  AlertTriangle,
  Database,
  FileText,
  Calendar,
  Trophy,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const DataTransparencyPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DataMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState<string | null>(null);
  const [accountDeleteModalOpen, setAccountDeleteModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await transparencyService.getMetrics();
      setMetrics(data.metrics);
    } catch (e) {
      console.error('Error fetching transparency metrics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleExport = () => {
    transparencyService.exportUserData();
    setSuccessMsg('Your personal JSON data bundle export has started!');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDeleteCategory = async (category: 'checkins' | 'journal' | 'events' | 'smallwins') => {
    try {
      await transparencyService.deleteCategoryData(category);
      setDeleteConfirmCategory(null);
      setSuccessMsg(`Deleted all items from category "${category}"`);
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchMetrics();
    } catch (e) {
      console.error('Error deleting category data:', e);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await transparencyService.deleteAccountData();
      window.location.href = '/login';
    } catch (e) {
      console.error('Error deleting account:', e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Data Transparency & Full Ownership</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Data Transparency Center
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          MindEase belongs to you. You have 100% control to inspect, export, or permanently delete your data at any time.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-700 dark:text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Database className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Check-ins</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics?.checkInsCount || 0}</p>
          <p className="text-[11px] text-slate-400">Recorded check-in records</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Journal Entries</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics?.journalCount || 0}</p>
          <p className="text-[11px] text-slate-400">Private journal reflections</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Events</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics?.eventsCount || 0}</p>
          <p className="text-[11px] text-slate-400">Academic & life events</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-amber-500">
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Small Wins</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics?.smallWinsCount || 0}</p>
          <p className="text-[11px] text-slate-400">Positive achievements</p>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-600" />
              Export Personal Data Bundle
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Download your complete personal check-in history, journal entries, events, and small wins as a clean JSON document.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs shadow-md transition-all whitespace-nowrap"
          >
            <Download className="w-4 h-4" /> Export Data (JSON)
          </button>
        </div>
      </div>

      {/* Category Deletion Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-rose-500" />
          Selective Category Data Deletion
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-xs">Delete Daily Check-ins</p>
              <p className="text-[11px] text-slate-400">Removes all recorded check-ins ({metrics?.checkInsCount || 0})</p>
            </div>
            <button
              onClick={() => handleDeleteCategory('checkins')}
              className="w-full py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 font-semibold text-xs transition-colors"
            >
              Delete Check-ins
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-xs">Delete Journal Entries</p>
              <p className="text-[11px] text-slate-400">Removes all private journal entries ({metrics?.journalCount || 0})</p>
            </div>
            <button
              onClick={() => handleDeleteCategory('journal')}
              className="w-full py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 font-semibold text-xs transition-colors"
            >
              Delete Journal
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-xs">Delete Academic Events</p>
              <p className="text-[11px] text-slate-400">Removes all recorded student events ({metrics?.eventsCount || 0})</p>
            </div>
            <button
              onClick={() => handleDeleteCategory('events')}
              className="w-full py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 font-semibold text-xs transition-colors"
            >
              Delete Events
            </button>
          </div>
        </div>
      </div>

      {/* Account Deletion Danger Zone */}
      <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" /> Danger Zone: Permanently Delete Account
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Permanently delete your account and all associated personal data. This action cannot be undone.
            </p>
          </div>

          <button
            onClick={() => setAccountDeleteModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition-colors whitespace-nowrap"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {accountDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Are you absolutely sure?</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                This will permanently remove your account and all check-ins, journal entries, events, and insights.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setAccountDeleteModalOpen(false)}
                className="w-1/2 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md"
              >
                Yes, Delete All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTransparencyPage;
