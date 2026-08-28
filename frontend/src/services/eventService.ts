import api from './api';
import { StudentEvent, EventType } from '../types';

export const eventService = {
  createEvent: async (data: {
    title: string;
    eventType: EventType;
    eventDate: string;
    notes?: string;
  }) => {
    const response = await api.post<{ success: boolean; event: StudentEvent }>('/api/events', data);
    return response.data;
  },

  getEvents: async () => {
    const response = await api.get<{ success: boolean; count: number; events: StudentEvent[] }>(
      '/api/events'
    );
    return response.data;
  },

  deleteEvent: async (id: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(`/api/events/${id}`);
    return response.data;
  },
};
