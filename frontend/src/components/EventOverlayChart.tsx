import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from 'recharts';
import { CheckIn, StudentEvent } from '../types';
import { formatDate } from '../utils/formatters';

interface EventOverlayChartProps {
  checkIns: CheckIn[];
  events: StudentEvent[];
}

export const EventOverlayChart: React.FC<EventOverlayChartProps> = ({ checkIns, events }) => {
  // Sort check-ins by date ascending for timeline charting
  const sortedCheckIns = [...checkIns]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-14); // Last 14 days max for clean view

  const chartData = sortedCheckIns.map((c) => {
    const formattedDate = new Date(c.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    // Check if any event occurs on this day
    const matchingEvent = events.find(
      (e) => new Date(e.eventDate).toDateString() === new Date(c.date).toDateString()
    );

    return {
      date: formattedDate,
      fullDate: c.date,
      Mood: c.moodScore,
      Stress: c.stressScore,
      eventTitle: matchingEvent ? matchingEvent.title : null,
      eventType: matchingEvent ? matchingEvent.eventType : null,
    };
  });

  if (chartData.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-slate-400 text-xs">
        Log check-ins and add events to visualize your trend overlay.
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis domain={[1, 10]} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg text-xs space-y-1">
                      <p className="font-semibold text-slate-900 dark:text-white">{label}</p>
                      <p className="text-indigo-600 font-medium">Mood: {data.Mood} / 10</p>
                      <p className="text-rose-500 font-medium">Stress: {data.Stress} / 10</p>
                      {data.eventTitle && (
                        <div className="mt-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-purple-600 dark:text-purple-400 font-semibold">
                          📌 Event: {data.eventTitle} ({data.eventType})
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="Mood"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4, fill: '#6366f1' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Stress"
              stroke="#f43f5e"
              strokeWidth={3}
              dot={{ r: 4, fill: '#f43f5e' }}
              activeDot={{ r: 6 }}
            />
            {/* Draw reference lines for events */}
            {chartData.map((d, index) => {
              if (d.eventTitle) {
                return (
                  <ReferenceLine
                    key={index}
                    x={d.date}
                    stroke="#a855f7"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    label={{
                      value: `📌 ${d.eventTitle}`,
                      fill: '#a855f7',
                      fontSize: 11,
                      position: 'top',
                    }}
                  />
                );
              }
              return null;
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" /> Mood Trend
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> Stress Trend
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" /> Student Life Event Marker
        </span>
      </div>
    </div>
  );
};

export default EventOverlayChart;
