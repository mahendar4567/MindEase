import api from './api';
import { CheckIn } from '../types';

export const checkInService = {
  createCheckIn: async (data: {
    moodScore: number;
    stressScore: number;
    energyLevel?: number;
    triggers?: string[];
    helpfulActions?: string[];
    sleepDuration?: number;
    sleepQuality?: number;
    note?: string;
    date?: string;
  }) => {
    const response = await api.post<{ success: boolean; checkIn: CheckIn }>('/api/checkins', data);
    return response.data;
  },

  getTodayCheckIn: async () => {
    const response = await api.get<{ success: boolean; checkIn: CheckIn | null }>('/api/checkins/today');
    return response.data;
  },

  getCheckIns: async (days?: number) => {
    const response = await api.get<{
      success: boolean;
      count: number;
      streak: number;
      mindfulReturnGap?: { isGap: boolean; daysGap: number; message?: string };
      checkIns: CheckIn[];
    }>('/api/checkins', { params: { days } });
    return response.data;
  },

  updateCheckIn: async (
    id: string,
    data: {
      moodScore?: number;
      stressScore?: number;
      energyLevel?: number;
      triggers?: string[];
      helpfulActions?: string[];
      sleepDuration?: number;
      sleepQuality?: number;
      note?: string;
    }
  ) => {
    const response = await api.put<{ success: boolean; checkIn: CheckIn }>(`/api/checkins/${id}`, data);
    return response.data;
  },

  deleteCheckIn: async (id: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(`/api/checkins/${id}`);
    return response.data;
  },
};
