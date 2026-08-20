import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeRide: null,
  estimate: null,
  selectedVehicleType: 'SEDAN',
  history: [],
  historyPagination: {
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  },
  loading: false,
  estimateLoading: false,
  error: null,
};

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setActiveRide: (state, action) => {
      state.activeRide = action.payload;
    },
    updateActiveRideStatus: (state, action) => {
      if (state.activeRide) {
        state.activeRide = { ...state.activeRide, ...action.payload };
      }
    },
    clearActiveRide: (state) => {
      state.activeRide = null;
    },
    setEstimate: (state, action) => {
      state.estimate = action.payload;
    },
    clearEstimate: (state) => {
      state.estimate = null;
    },
    setSelectedVehicleType: (state, action) => {
      state.selectedVehicleType = action.payload;
    },
    setHistory: (state, action) => {
      state.history = action.payload.content || action.payload;
      if (action.payload.totalPages !== undefined) {
        state.historyPagination = {
          page: action.payload.number,
          size: action.payload.size,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
        };
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setEstimateLoading: (state, action) => {
      state.estimateLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setActiveRide,
  updateActiveRideStatus,
  clearActiveRide,
  setEstimate,
  clearEstimate,
  setSelectedVehicleType,
  setHistory,
  setLoading,
  setEstimateLoading,
  setError,
} = rideSlice.actions;

export default rideSlice.reducer;
