import axiosClient from './axiosClient';

export const driverApi = {
  getProfile: () => axiosClient.get('/drivers/profile'),
  getDriverById: (id) => axiosClient.get(`/drivers/${id}`),
  updateStatus: (onlineStatus) => axiosClient.put('/drivers/status', { onlineStatus }),
  updateLocation: (latitude, longitude, rideId = null) =>
    axiosClient.put('/drivers/location', { latitude, longitude, rideId }),
};

export default driverApi;
