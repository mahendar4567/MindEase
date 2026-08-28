import api from './api';

export interface SmallWin {
  _id: string;
  userId: string;
  title: string;
  category: string;
  date: string;
  createdAt: string;
}

export const smallWinService = {
  createSmallWin: async (data: { title: string; category?: string; date?: string }) => {
    const response = await api.post<{ success: boolean; smallWin: SmallWin }>('/api/smallwins', data);
    return response.data;
  },

  getSmallWins: async () => {
    const response = await api.get<{ success: boolean; count: number; smallWins: SmallWin[] }>('/api/smallwins');
    return response.data;
  },

  deleteSmallWin: async (id: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(`/api/smallwins/${id}`);
    return response.data;
  },
};
