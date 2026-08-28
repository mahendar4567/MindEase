import React, { useEffect, useState } from 'react';
import {
  advancedFeaturesService,
  AdvancedFeaturesSummary,
} from '../services/advancedFeaturesService';
import { checkInService } from '../services/checkInService';
import { eventService } from '../services/eventService';
import { CheckIn, StudentEvent } from '../types';

import {
  Calendar as CalendarIcon,
  TrendingUp,
  Play,
  RotateCcw,
  Zap,
  ShieldCheck,
  GitCommit,
} from 'lucide-react';

export const SemesterPage: React.FC = () => {
  const [features, setFeatures] = useState<AdvancedFeaturesSummary | null>(null);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [events, setEvents] = useState<StudentEvent[]>([]);

  // Replay Slider Step State
  const [replayIndex, setReplayIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Semester Config Form State
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-12-15');
  const [semesterTitle, setSemesterTitle] = useState('Fall 2026 Semester');

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [featRes, checkInsRes, eventsRes] = await Promise.all([
        advancedFeaturesService.getSummary(),
        checkInService.getCheckIns(90),
        eventService.getEvents(),
      ]);

      setFeatures(featRes.features);
      setCheckIns(checkInsRes.checkIns);
      setEvents(eventsRes.events);

      if (featRes.features.semesterConfig) {
        setSemesterTitle(featRes.features.semesterConfig.title || 'Fall 2026 Semester');
        setStartDate(
          new Date(featRes.features.semesterConfig.startDate).toISOString().split('T')[0]
        );
        setEndDate(
          new Date(featRes.features.semesterConfig.endDate).toISOString().split('T')[0]
        );
      }
    } catch (e) {
      console.error('Error fetching semester page data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Replay Auto-play timer
  useEffect(() => {
    let timer: any;
    if (isPlaying && features?.patternReplay?.replaySteps) {
      timer = setInterval(() => {
        setReplayIndex((prev) => {
          if (prev >= features.patternReplay.replaySteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, features]);

  const handleSaveSemester = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await advancedFeaturesService.saveSemesterConfig({
        title: semesterTitle,
        startDate,
        endDate,
      });
      fetchData();
    } catch (e) {
      console.error('Error saving semester config:', e);
    }
  };

  const currentReplayStep = features?.patternReplay?.replaySteps?.[replayIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 mb-3">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>Semester-Level Wellness Intelligence</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Semester Timeline & Pattern Replay
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Overlay academic deadlines across your semester and step through day-by-day pattern replays.
        </p>
      </div>

      {/* Grid: Semester Config & Pattern Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Semester Configuration Form */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-600" />
            Semester Dates Config
          </h2>

          <form onSubmit={handleSaveSemester} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester Title
              </label>
              <input
                type="text"
                value={semesterTitle}
                onChange={(e) => setSemesterTitle(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester End Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              Update Semester Bounds
            </button>
          </form>
        </div>

        {/* Pattern-Based Pressure Forecast Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Pattern-Based Pressure Forecast
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Historical pattern trajectory projection</p>
                </div>
              </div>

              <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${features?.pressureForecast?.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                {features?.pressureForecast?.status || 'Possible low pressure'}
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              "{features?.pressureForecast?.message || 'No upcoming academic events recorded.'}"
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{features?.pressureForecast?.disclaimer}</span>
          </div>
        </div>
      </div>

      {/* Emotional Pattern Replay Interactive Component */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Emotional Pattern Replay</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Step through your chronological daily check-in sequence</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> {isPlaying ? 'Pause Replay' : 'Play Sequence'}
            </button>
            <button
              onClick={() => {
                setReplayIndex(0);
                setIsPlaying(false);
              }}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Cards Display */}
        {currentReplayStep ? (
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Step {currentReplayStep.stepIndex} of {features?.patternReplay?.totalSteps} • {currentReplayStep.dateLabel}
              </span>
              <span className="text-xs font-bold text-slate-500">{currentReplayStep.summary}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center py-2">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <p className="text-xs font-medium text-slate-400">Mood Score</p>
                <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{currentReplayStep.mood} / 10</p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <p className="text-xs font-medium text-slate-400">Stress Score</p>
                <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{currentReplayStep.stress} / 10</p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <p className="text-xs font-medium text-slate-400">Energy Level</p>
                <p className="text-2xl font-extrabold text-amber-500 mt-1">{currentReplayStep.energy} / 10</p>
              </div>
            </div>

            {/* Slider Controls */}
            <input
              type="range"
              min="0"
              max={(features?.patternReplay?.totalSteps || 1) - 1}
              value={replayIndex}
              onChange={(e) => setReplayIndex(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            Log check-ins over consecutive days to build interactive pattern replays.
          </div>
        )}
      </div>

      {/* Grid: Pressure Combinations & Stress Chains */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pressure Combination Detector */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Pressure Combination Detector</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Multi-trigger pairing stress impact</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            "{features?.pressureCombinations?.insightText || 'Log check-ins with multiple triggers.'}"
          </p>

          {features?.pressureCombinations?.combinations && features.pressureCombinations.combinations.length > 0 ? (
            <div className="space-y-2">
              {features.pressureCombinations.combinations.map((c) => (
                <div key={c.pair} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{c.pair}</span>
                  <span className="font-extrabold text-rose-600">{c.avgStress} / 10 Avg Stress</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Stress Chain Explorer */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Stress Chain Explorer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sequential pattern flow discovery</p>
            </div>
          </div>

          {features?.stressChains?.chains && features.stressChains.chains.length > 0 ? (
            <div className="space-y-3">
              {features.stressChains.chains.map((chain, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{chain.title}</span>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {chain.sequence.map((step, sIdx) => (
                      <React.Fragment key={sIdx}>
                        <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-[11px]">
                          {step}
                        </span>
                        {sIdx < chain.sequence.length - 1 && <span className="text-slate-400">↓</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{features?.stressChains?.disclaimer}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SemesterPage;
