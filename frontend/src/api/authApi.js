import axiosClient from './axiosClient';

export const authApi = {
  registerRider: (data) => axiosClient.post('/auth/register', data),
  registerDriver: (data) => axiosClient.post('/auth/driver-register', data),
  login: (data) => axiosClient.post('/auth/login', data),
  getCurrentUser: () => axiosClient.get('/auth/me'),
};

export default authApi;
