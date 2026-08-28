import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { WeeklyReport, User } from '../types';
import { formatDate } from '../utils/formatters';
import { Download, Heart, ShieldCheck, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

interface WeeklyReportPDFProps {
  user: User | null;
  report?: WeeklyReport;
}

export const WeeklyReportPDF: React.FC<WeeklyReportPDFProps> = ({ user, report }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    try {
      setExporting(true);
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`MindEase_Weekly_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('PDF Export Error:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Week in MindEase</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Personalized weekly reflection and summary report.</p>
        </div>
        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all"
        >
          <Download className="w-4 h-4" />
          {exporting ? 'Generating PDF...' : 'Export as PDF'}
        </button>
      </div>

      {/* Printable Report Card Area */}
      <div
        ref={reportRef}
        className="bg-white text-slate-900 p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 max-w-3xl mx-auto"
      >
        {/* Document Banner Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">MindEase Report</h1>
              <p className="text-xs text-slate-500 font-medium">Student Wellness Summary • Confidential</p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500 font-medium">
            <p className="font-semibold text-slate-900">{user?.displayName}</p>
            <p>{formatDate(new Date().toISOString())}</p>
          </div>
        </div>

        {/* Narrative Summary Callout */}
        <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 text-slate-800 text-sm leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-indigo-900 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Personal Pattern Summary
          </div>
          <p>{report?.narrativeSummary || 'No check-in entries recorded for this week.'}</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase">Average Mood</p>
            <p className="text-2xl font-extrabold text-indigo-600 mt-1">{report?.avgMood || 'N/A'}/10</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase">Average Stress</p>
            <p className="text-2xl font-extrabold text-rose-600 mt-1">{report?.avgStress || 'N/A'}/10</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase">Wellness Battery</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">{report?.wellnessBattery || 70}%</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase">Burnout Risk</p>
            <p className="text-2xl font-extrabold text-purple-600 mt-1">{report?.burnoutRiskLevel || 'Low'}</p>
          </div>
        </div>

        {/* Detailed Items List */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Weekly Highlights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Top Stress Trigger:</span>
              <span className="font-bold text-slate-900">{report?.mostFrequentTrigger || 'None'}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Recovery Pattern:</span>
              <span className="font-bold text-slate-900">{report?.recoveryTrend || 'Stable'}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Highest Mood Day:</span>
              <span className="font-bold text-slate-900">{report?.bestDay || 'N/A'}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Highest Stress Day:</span>
              <span className="font-bold text-slate-900">{report?.difficultDay || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>MindEase Student Wellness Platform • Private & Secure</span>
          </div>
          <span>Not a medical evaluation</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReportPDF;
