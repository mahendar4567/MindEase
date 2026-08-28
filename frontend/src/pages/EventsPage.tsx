import React, { useEffect, useState } from 'react';
import { eventService } from '../services/eventService';
import { checkInService } from '../services/checkInService';
import { StudentEvent, EventType, CheckIn } from '../types';
import EventOverlayChart from '../components/EventOverlayChart';
import { formatDate } from '../utils/formatters';
import {
  Calendar as CalendarIcon,
  List,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  Sparkles,
  Edit3,
} from 'lucide-react';

const EVENT_TYPES: EventType[] = [
  'Exam',
  'Assignment Deadline',
  'Project Submission',
  'Placement Interview',
  'Career Event',
  'Personal Event',
  'Other',
];

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<StudentEvent[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [activeTab, setActiveTab] = useState<'timeline' | 'calendar'>('timeline');

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<EventType>('Exam');
  const [eventDate, setEventDate] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [eventsRes, checkInsRes] = await Promise.all([
        eventService.getEvents(),
        checkInService.getCheckIns(30),
      ]);
      setEvents(eventsRes.events);
      setCheckIns(checkInsRes.checkIns);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenEdit = (ev: StudentEvent) => {
    setEditingId(ev._id);
    setTitle(ev.title);
    setEventType(ev.eventType);
    setEventDate(new Date(ev.eventDate).toISOString().split('T')[0]);
    setNotes(ev.notes || '');
  };

  const handleResetForm = () => {
    setEditingId(null);
    setTitle('');
    setNotes('');
    setEventDate('');
  };

  const handleAddOrUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!title.trim() || !eventDate) {
      setErrorMsg('Event title and date are required.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await eventService.deleteEvent(editingId); // Re-create / update for cleanly formatted record
        await eventService.createEvent({
          title: title.trim(),
          eventType,
          eventDate,
          notes: notes.trim(),
        });
        setSuccessMsg('Event updated successfully!');
      } else {
        await eventService.createEvent({
          title: title.trim(),
          eventType,
          eventDate,
          notes: notes.trim(),
        });
        setSuccessMsg('Event added to your timeline!');
      }
      handleResetForm();
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save event.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await eventService.deleteEvent(id);
      fetchData();
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const getBadgeColor = (type: EventType) => {
    switch (type) {
      case 'Exam':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300';
      case 'Assignment Deadline':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
      case 'Project Submission':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300';
      case 'Placement Interview':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Academic & Life Event Timeline</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          My Important Events
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Track upcoming exams, deadlines, and interviews while monitoring stress patterns.
        </p>
      </div>

      {/* Grid: Event Creation Form & Timeline/Calendar Views */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 h-fit">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Plus className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {editingId ? 'Edit Event' : 'Add Important Event'}
            </h2>
          </div>

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAddOrUpdateEvent} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Event Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midterm Physics Exam"
                className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Event Category
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
                className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:text-white"
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Event Date
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Key preparation goals or venue details..."
                className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all"
              >
                {submitting ? 'Saving Event...' : editingId ? 'Update Event' : 'Add Event to Timeline'}
              </button>
            </div>
          </form>
        </div>

        {/* Views Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overlay Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-purple-600" />
              Academic Pattern & Event Overlay Chart
            </h2>
            <EventOverlayChart checkIns={checkIns} events={events} />
          </div>

          {/* Timeline View / Calendar View Tabs */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-indigo-600" />
                Student Events View
              </h2>

              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'timeline'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <List className="w-3.5 h-3.5" /> Timeline View
                </button>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'calendar'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <CalendarIcon className="w-3.5 h-3.5" /> Calendar View
                </button>
              </div>
            </div>

            {/* View 1: Timeline View */}
            {activeTab === 'timeline' && (
              <div>
                {events.length > 0 ? (
                  <div className="space-y-3">
                    {events.map((ev) => (
                      <div
                        key={ev._id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold px-2.5 py-0.5 rounded-full ${getBadgeColor(ev.eventType)}`}>
                              {ev.eventType}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white text-sm">{ev.title}</span>
                          </div>
                          {ev.notes && <p className="text-slate-500 dark:text-slate-400">{ev.notes}</p>}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-600 dark:text-slate-300 pr-2">
                            {formatDate(ev.eventDate)}
                          </span>
                          <button
                            onClick={() => handleOpenEdit(ev)}
                            className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ev._id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-400">
                    No events recorded yet. Add your first academic or personal event.
                  </div>
                )}
              </div>
            )}

            {/* View 2: Calendar View */}
            {activeTab === 'calendar' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {events.map((ev) => (
                  <div
                    key={ev._id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${getBadgeColor(ev.eventType)}`}>
                        {ev.eventType}
                      </span>
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {formatDate(ev.eventDate)}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{ev.title}</h3>
                      {ev.notes && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{ev.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
