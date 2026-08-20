import axiosClient from './axiosClient';

export const notificationApi = {
  getNotifications: () => axiosClient.get('/notifications'),
  getNotificationsPaged: (page = 0, size = 10) =>
    axiosClient.get(`/notifications/paged?page=${page}&size=${size}`),
  getUnreadCount: () => axiosClient.get('/notifications/unread-count'),
  markAsRead: (id) => axiosClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => axiosClient.put('/notifications/read-all'),
};

export default notificationApi;
