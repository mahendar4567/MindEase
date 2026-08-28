import api from './api';

export interface DataMetrics {
  userEmail: string;
  accountCreated: string;
  checkInsCount: number;
  journalCount: number;
  eventsCount: number;
  smallWinsCount: number;
  insightsGeneratedCount: number;
}

export const transparencyService = {
  getMetrics: async () => {
    const response = await api.get<{ success: boolean; metrics: DataMetrics }>('/api/transparency/metrics');
    return response.data;
  },

  exportUserData: () => {
    window.open(`${api.defaults.baseURL || 'http://localhost:5000'}/api/transparency/export`, '_blank');
  },

  deleteCategoryData: async (category: 'checkins' | 'journal' | 'events' | 'smallwins') => {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/api/transparency/category/${category}`
    );
    return response.data;
  },

  deleteAccountData: async () => {
    const response = await api.delete<{ success: boolean; message: string }>('/api/transparency/account');
    return response.data;
  },
};
