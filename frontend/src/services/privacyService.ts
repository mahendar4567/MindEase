import api from './api';

export const privacyService = {
  setupPin: async (pin: string) => {
    const response = await api.post<{ success: boolean; message: string; privacyModeEnabled: boolean }>(
      '/api/privacy/pin',
      { pin }
    );
    return response.data;
  },

  verifyPin: async (pin: string) => {
    const response = await api.post<{ success: boolean; message: string }>('/api/privacy/verify-pin', { pin });
    return response.data;
  },

  togglePrivacyMode: async (enabled: boolean) => {
    const response = await api.put<{ success: boolean; privacyModeEnabled: boolean }>('/api/privacy/mode', {
      enabled,
    });
    return response.data;
  },
};
