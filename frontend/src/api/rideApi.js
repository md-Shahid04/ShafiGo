import axiosClient from './axiosClient';

export const rideApi = {
  estimateRide: (data) => axiosClient.post('/rides/estimate', data),
  requestRide: (data) => axiosClient.post('/rides', data),
  getRideById: (id) => axiosClient.get(`/rides/${id}`),
  getActiveRiderRide: () => axiosClient.get('/rides/active/rider'),
  getActiveDriverRide: () => axiosClient.get('/rides/active/driver'),
  getRiderHistory: (page = 0, size = 10) =>
    axiosClient.get(`/rides/history/rider?page=${page}&size=${size}`),
  getDriverHistory: (page = 0, size = 10) =>
    axiosClient.get(`/rides/history/driver?page=${page}&size=${size}`),
  getRideLocations: (id) => axiosClient.get(`/rides/${id}/locations`),

  // Driver actions
  acceptRide: (id) => axiosClient.post(`/rides/${id}/accept`),
  driverArriving: (id) => axiosClient.post(`/rides/${id}/arriving`),
  driverArrived: (id) => axiosClient.post(`/rides/${id}/arrive`),
  startRide: (id) => axiosClient.post(`/rides/${id}/start`),
  completeRide: (id) => axiosClient.post(`/rides/${id}/complete`),

  // Cancellation
  cancelRide: (id, reason) => axiosClient.post(`/rides/${id}/cancel`, { reason }),
};

export default rideApi;
