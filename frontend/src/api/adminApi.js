import axiosClient from './axiosClient';

export const adminApi = {
  getDashboardStats: () => axiosClient.get('/admin/dashboard'),
  getAllUsers: (role = null, page = 0, size = 10) => {
    const roleParam = role ? `&role=${role}` : '';
    return axiosClient.get(`/admin/users?page=${page}&size=${size}${roleParam}`);
  },
  toggleUserStatus: (id) => axiosClient.put(`/admin/users/${id}/toggle-status`),
  getAllDrivers: (status = null, page = 0, size = 10) => {
    const statusParam = status ? `&status=${status}` : '';
    return axiosClient.get(`/admin/drivers?page=${page}&size=${size}${statusParam}`);
  },
  verifyDriver: (id, status) =>
    axiosClient.put(`/admin/drivers/${id}/verify?status=${status}`),
  getAllRides: (status = null, page = 0, size = 10) => {
    const statusParam = status ? `&status=${status}` : '';
    return axiosClient.get(`/admin/rides?page=${page}&size=${size}${statusParam}`);
  },
  getActiveRides: () => axiosClient.get('/admin/rides/active'),
};

export default adminApi;
