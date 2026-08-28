import api from './api';

export interface JournalEntry {
  _id: string;
  userId: string;
  title: string;
  content: string;
  date: string;
  createdAt: string;
}

export const journalService = {
  createJournal: async (data: { title: string; content: string; date?: string }) => {
    const response = await api.post<{ success: boolean; journal: JournalEntry }>('/api/journal', data);
    return response.data;
  },

  getJournals: async (search?: string) => {
    const response = await api.get<{ success: boolean; count: number; journals: JournalEntry[] }>(
      '/api/journal',
      { params: { search } }
    );
    return response.data;
  },

  updateJournal: async (id: string, data: { title?: string; content?: string }) => {
    const response = await api.put<{ success: boolean; journal: JournalEntry }>(
      `/api/journal/${id}`,
      data
    );
    return response.data;
  },

  deleteJournal: async (id: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(`/api/journal/${id}`);
    return response.data;
  },
};
