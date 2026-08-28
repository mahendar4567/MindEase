import api from './api';
import { IntelligenceSummary } from '../types';

export const intelligenceService = {
  getIntelligenceSummary: async () => {
    const response = await api.get<{ success: boolean; summary: IntelligenceSummary }>(
      '/api/intelligence/summary'
    );
    return response.data;
  },
};
