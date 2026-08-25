import axiosClient from './axiosClient';

export const adminApi = {
  getDashboardStats: () => axiosClient.get('/admin/dashboard'),
  getStats: () => axiosClient.get('/admin/dashboard'),

  getAllUsers: (role = null, page = 0, size = 10) => {
    if (typeof role === 'number') {
      const pageNum = role;
      const sizeNum = typeof page === 'number' ? page : 10;
      const roleFilter = typeof size === 'string' && size !== 'ALL' ? size : null;
      const roleParam = roleFilter ? `&role=${roleFilter}` : '';
      return axiosClient.get(`/admin/users?page=${pageNum}&size=${sizeNum}${roleParam}`);
    }
    const roleParam = role && role !== 'ALL' ? `&role=${role}` : '';
    return axiosClient.get(`/admin/users?page=${page}&size=${size}${roleParam}`);
  },

  toggleUserStatus: (id) => axiosClient.put(`/admin/users/${id}/toggle-status`),

  getAllDrivers: (status = null, page = 0, size = 10) => {
    if (typeof status === 'number') {
      const pageNum = status;
      const sizeNum = typeof page === 'number' ? page : 10;
      const statusFilter = typeof size === 'string' && size !== 'ALL' ? size : null;
      const statusParam = statusFilter ? `&status=${statusFilter}` : '';
      return axiosClient.get(`/admin/drivers?page=${pageNum}&size=${sizeNum}${statusParam}`);
    }
    const statusParam = status && status !== 'ALL' ? `&status=${status}` : '';
    return axiosClient.get(`/admin/drivers?page=${page}&size=${size}${statusParam}`);
  },

  getPendingDrivers: (page = 0, size = 10) =>
    axiosClient.get(`/admin/drivers?page=${page}&size=${size}&status=PENDING`),

  verifyDriver: (id, status) =>
    axiosClient.put(`/admin/drivers/${id}/verify?status=${status}`),

  getAllRides: (status = null, page = 0, size = 10) => {
    if (typeof status === 'number') {
      const pageNum = status;
      const sizeNum = typeof page === 'number' ? page : 10;
      const statusFilter = typeof size === 'string' && size !== 'ALL' ? size : null;
      const statusParam = statusFilter ? `&status=${statusFilter}` : '';
      return axiosClient.get(`/admin/rides?page=${pageNum}&size=${sizeNum}${statusParam}`);
    }
    const statusParam = status && status !== 'ALL' ? `&status=${status}` : '';
    return axiosClient.get(`/admin/rides?page=${page}&size=${size}${statusParam}`);
  },

  getActiveRides: () => axiosClient.get('/admin/rides/active'),
};

export default adminApi;
