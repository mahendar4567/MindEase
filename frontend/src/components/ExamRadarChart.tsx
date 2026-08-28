import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { InsightConfidence } from '../services/advancedIntelligenceService';
import { Bookmark, Sparkles, ShieldCheck } from 'lucide-react';

interface ExamRadarChartProps {
  data: {
    hasData: boolean;
    confidence: InsightConfidence;
    title: string;
    insightText: string;
    timelinePoints: Array<{ phase: string; avgStress: number }>;
    disclaimer: string;
  } | null;
}

export const ExamRadarChart: React.FC<ExamRadarChartProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {data.title}
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${data.confidence.badgeColor}`}>
                {data.confidence.level}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Stress trajectory 7 days before to after exams
            </p>
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 text-xs text-purple-950 dark:text-purple-200 font-medium leading-relaxed">
        "{data.insightText}"
      </div>

      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.timelinePoints}>
            <defs>
              <linearGradient id="stressRadarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis dataKey="phase" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis domain={[1, 10]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md text-xs">
                      <p className="font-bold text-slate-900 dark:text-white">{label}</p>
                      <p className="text-purple-600 font-semibold">Avg Stress: {payload[0].value} / 10</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="avgStress"
              name="Average Stress"
              stroke="#8b5cf6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#stressRadarGrad)"
              dot={{ r: 5, fill: '#8b5cf6' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>{data.disclaimer}</span>
      </div>
    </div>
  );
};

export default ExamRadarChart;
