import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    totalUsers: 0,
    totalRiders: 0,
    totalDrivers: 0,
    totalApprovedDrivers: 0,
    activeDrivers: 0,
    onlineDrivers: 0,
    busyDrivers: 0,
    pendingDriverApprovals: 0,
    activeTrips: 0,
    completedTrips: 0,
    grossRevenue: 0.0,
    driverEarnings: 0.0,
    platformCommission: 0.0,
    totalRevenue: 0.0,
    totalRevenueEstimated: 0.0,
    averageRating: 5.0,
  },
  pendingDrivers: [],
  recentRides: [],
  activeDriversLocations: {},
  wsConnected: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setDashboardStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    setPendingDrivers: (state, action) => {
      state.pendingDrivers = action.payload || [];
      state.stats.pendingDriverApprovals = state.pendingDrivers.length;
    },
    addPendingDriver: (state, action) => {
      const exists = state.pendingDrivers.some((d) => d.id === action.payload.id);
      if (!exists) {
        state.pendingDrivers.unshift(action.payload);
        state.stats.pendingDriverApprovals = state.pendingDrivers.length;
        state.stats.totalDrivers += 1;
        state.stats.totalUsers += 1;
      }
    },
    removePendingDriver: (state, action) => {
      state.pendingDrivers = state.pendingDrivers.filter((d) => d.id !== action.payload);
      state.stats.pendingDriverApprovals = state.pendingDrivers.length;
    },
    setRecentRides: (state, action) => {
      state.recentRides = action.payload || [];
    },
    addOrUpdateRecentRide: (state, action) => {
      const ride = action.payload;
      const index = state.recentRides.findIndex((r) => r.id === ride.id);
      if (index >= 0) {
        state.recentRides[index] = ride;
      } else {
        state.recentRides.unshift(ride);
        if (state.recentRides.length > 10) {
          state.recentRides.pop();
        }
      }
    },
    incrementTotalUsers: (state) => {
      state.stats.totalUsers += 1;
      state.stats.totalRiders += 1;
    },
    handleDriverVerificationUpdated: (state, action) => {
      const { driver, status } = action.payload;
      if (driver?.id) {
        state.pendingDrivers = state.pendingDrivers.filter((d) => d.id !== driver.id);
        state.stats.pendingDriverApprovals = state.pendingDrivers.length;
        if (status === 'APPROVED') {
          state.stats.totalApprovedDrivers += 1;
        }
      }
    },
    handleDriverStatusChanged: (state, action) => {
      const { driverId, onlineStatus, verificationStatus } = action.payload;
      if (onlineStatus === 'ONLINE') {
        state.stats.onlineDrivers += 1;
        if (verificationStatus === 'APPROVED') {
          state.stats.activeDrivers += 1;
        }
      } else if (onlineStatus === 'OFFLINE') {
        state.stats.onlineDrivers = Math.max(0, state.stats.onlineDrivers - 1);
        state.stats.activeDrivers = Math.max(0, state.stats.activeDrivers - 1);
        if (state.activeDriversLocations[driverId]) {
          delete state.activeDriversLocations[driverId];
        }
      } else if (onlineStatus === 'BUSY') {
        state.stats.busyDrivers += 1;
      }
    },
    updateDriverLocationTelemetry: (state, action) => {
      const { driverId, driverName, latitude, longitude, heading, speed, accuracy, onlineStatus, timestamp } = action.payload;
      if (driverId && latitude && longitude) {
        state.activeDriversLocations[driverId] = {
          driverId,
          driverName: driverName || `Driver #${driverId}`,
          latitude,
          longitude,
          heading: heading || 0,
          speed: speed || 0,
          accuracy: accuracy || 5,
          onlineStatus: onlineStatus || 'ONLINE',
          timestamp: timestamp || Date.now(),
        };
      }
    },
    handleRideCompletedEvent: (state, action) => {
      const ride = action.payload;
      state.stats.completedTrips += 1;
      state.stats.activeTrips = Math.max(0, state.stats.activeTrips - 1);
      if (ride?.finalFare) {
        state.stats.grossRevenue += ride.finalFare;
        state.stats.totalRevenue += ride.finalFare;
        state.stats.totalRevenueEstimated += ride.finalFare;
        state.stats.driverEarnings += ride.finalFare * 0.85;
        state.stats.platformCommission += ride.finalFare * 0.15;
      }
    },
    handleRevenueUpdatedEvent: (state, action) => {
      const { grossFare, driverEarning, platformFee } = action.payload;
      if (grossFare) {
        state.stats.grossRevenue += grossFare;
        state.stats.totalRevenue += grossFare;
        state.stats.totalRevenueEstimated += grossFare;
        state.stats.driverEarnings += driverEarning || grossFare * 0.85;
        state.stats.platformCommission += platformFee || grossFare * 0.15;
      }
    },
    setWsConnected: (state, action) => {
      state.wsConnected = action.payload;
    },
  },
});

export const {
  setDashboardStats,
  setPendingDrivers,
  addPendingDriver,
  removePendingDriver,
  setRecentRides,
  addOrUpdateRecentRide,
  incrementTotalUsers,
  handleDriverVerificationUpdated,
  handleDriverStatusChanged,
  updateDriverLocationTelemetry,
  handleRideCompletedEvent,
  handleRevenueUpdatedEvent,
  setWsConnected,
} = adminSlice.actions;

export default adminSlice.reducer;
