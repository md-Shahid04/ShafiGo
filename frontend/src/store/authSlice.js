import { createSlice } from '@reduxjs/toolkit';

const storedToken = localStorage.getItem('swiftride_token');
const storedUser = localStorage.getItem('swiftride_user')
  ? JSON.parse(localStorage.getItem('swiftride_user'))
  : null;
const storedDriver = localStorage.getItem('swiftride_driver')
  ? JSON.parse(localStorage.getItem('swiftride_driver'))
  : null;

const initialState = {
  token: storedToken || null,
  user: storedUser || null,
  driver: storedDriver || null,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user, driver } = action.payload;
      if (token) {
        state.token = token;
        localStorage.setItem('swiftride_token', token);
      }
      state.user = user;
      state.driver = driver || null;
      state.isAuthenticated = true;
      localStorage.setItem('swiftride_user', JSON.stringify(user));
      if (driver) {
        localStorage.setItem('swiftride_driver', JSON.stringify(driver));
      } else {
        localStorage.removeItem('swiftride_driver');
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('swiftride_user', JSON.stringify(state.user));
    },
    updateDriver: (state, action) => {
      state.driver = { ...state.driver, ...action.payload };
      localStorage.setItem('swiftride_driver', JSON.stringify(state.driver));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.driver = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('swiftride_token');
      localStorage.removeItem('swiftride_user');
      localStorage.removeItem('swiftride_driver');
    },
  },
});

export const { setCredentials, updateUser, updateDriver, logout } = authSlice.actions;
export default authSlice.reducer;
