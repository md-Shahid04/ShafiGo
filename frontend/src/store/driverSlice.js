import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  vehicles: [],
  onlineStatus: 'OFFLINE',
  incomingRequests: [],
  currentLocation: {
    latitude: 12.9352,
    longitude: 77.6245,
  },
  loading: false,
  error: null,
};

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    setDriverProfile: (state, action) => {
      state.profile = action.payload;
      state.onlineStatus = action.payload?.onlineStatus || 'OFFLINE';
      if (action.payload?.vehicles) {
        state.vehicles = action.payload.vehicles;
      }
    },
    setOnlineStatus: (state, action) => {
      state.onlineStatus = action.payload;
      if (state.profile) {
        state.profile.onlineStatus = action.payload;
      }
    },
    setVehicles: (state, action) => {
      state.vehicles = action.payload;
    },
    addVehicleToState: (state, action) => {
      state.vehicles.push(action.payload);
    },
    addIncomingRequest: (state, action) => {
      // Avoid duplicate requests
      const exists = state.incomingRequests.some((r) => r.id === action.payload.id);
      if (!exists) {
        state.incomingRequests.push(action.payload);
      }
    },
    removeIncomingRequest: (state, action) => {
      state.incomingRequests = state.incomingRequests.filter(
        (r) => r.id !== action.payload
      );
    },
    clearIncomingRequests: (state) => {
      state.incomingRequests = [];
    },
    setDriverCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setDriverProfile,
  setOnlineStatus,
  setVehicles,
  addVehicleToState,
  addIncomingRequest,
  removeIncomingRequest,
  clearIncomingRequests,
  setDriverCurrentLocation,
  setLoading,
  setError,
} = driverSlice.actions;

export default driverSlice.reducer;
