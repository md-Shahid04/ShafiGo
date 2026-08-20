import axiosClient from './axiosClient';

export const vehicleApi = {
  addVehicle: (data) => axiosClient.post('/vehicles', data),
  getDriverVehicles: () => axiosClient.get('/vehicles'),
  setActiveVehicle: (id) => axiosClient.put(`/vehicles/${id}/active`),
};

export default vehicleApi;
