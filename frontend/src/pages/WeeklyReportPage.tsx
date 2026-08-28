import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { intelligenceService } from '../services/intelligenceService';
import { WeeklyReport } from '../types';
import WeeklyReportPDF from '../components/WeeklyReportPDF';
import { FileSpreadsheet, Sparkles } from 'lucide-react';

export const WeeklyReportPage: React.FC = () => {
  const { user } = useAuth();
  const [report, setReport] = useState<WeeklyReport | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await intelligenceService.getIntelligenceSummary();
        setReport(data.summary.weeklyReport);
      } catch (err) {
        console.error('Error fetching weekly report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Automated Weekly Reflection Document</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Weekly Wellness Report
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Exportable weekly summary generated strictly from your private check-in records.
        </p>
      </div>

      {/* Main Printable / Exportable Component */}
      <WeeklyReportPDF user={user} report={report} />
    </div>
  );
};

export default WeeklyReportPage;
