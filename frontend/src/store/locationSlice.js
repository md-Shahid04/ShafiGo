import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pickupLocation: {
    address: 'Koramangala 5th Block, Bengaluru',
    lat: 12.9352,
    lng: 77.6245,
  },
  destinationLocation: {
    address: 'Kempegowda Intl Airport (BLR), Bengaluru',
    lat: 13.1986,
    lng: 77.7066,
  },
  userCurrentLocation: {
    lat: 12.9352,
    lng: 77.6245,
  },
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setPickupLocation: (state, action) => {
      state.pickupLocation = action.payload;
    },
    setDestinationLocation: (state, action) => {
      state.destinationLocation = action.payload;
    },
    setUserCurrentLocation: (state, action) => {
      state.userCurrentLocation = action.payload;
    },
    swapLocations: (state) => {
      const temp = state.pickupLocation;
      state.pickupLocation = state.destinationLocation;
      state.destinationLocation = temp;
    },
  },
});

export const {
  setPickupLocation,
  setDestinationLocation,
  setUserCurrentLocation,
  swapLocations,
} = locationSlice.actions;

export default locationSlice.reducer;
