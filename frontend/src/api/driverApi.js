import axiosClient from './axiosClient';

export const driverApi = {
  getMyProfile: () => axiosClient.get('/drivers/profile'),
  getStatus: () => axiosClient.get('/drivers/status'),
  getDriverById: (id) => axiosClient.get(`/drivers/${id}`),
  updateOnlineStatus: (onlineStatus) => axiosClient.put('/drivers/status', { onlineStatus }),
  goOnline: () => axiosClient.post('/drivers/status/online'),
  goOffline: () => axiosClient.post('/drivers/status/offline'),
  updateLocation: (telemetry) => axiosClient.put('/drivers/location', telemetry),
  getEarnings: () => axiosClient.get('/drivers/earnings'),
  getEarningsHistory: (page = 0, size = 10) =>
    axiosClient.get(`/drivers/earnings/history?page=${page}&size=${size}`),
};

export default driverApi;
