import axiosClient from './axiosClient';

export const ratingApi = {
  submitRating: (data) => axiosClient.post('/ratings', data),
  getDriverRatings: (driverId, page = 0, size = 10) =>
    axiosClient.get(`/ratings/driver/${driverId}?page=${page}&size=${size}`),
};

export default ratingApi;
