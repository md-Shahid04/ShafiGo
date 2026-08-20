import { createSlice } from '@reduxjs/toolkit';

const storedToken = localStorage.getItem('shafigo_token') || localStorage.getItem('swiftride_token');
const storedUser = localStorage.getItem('shafigo_user')
  ? JSON.parse(localStorage.getItem('shafigo_user'))
  : (localStorage.getItem('swiftride_user') ? JSON.parse(localStorage.getItem('swiftride_user')) : null);
const storedDriver = localStorage.getItem('shafigo_driver')
  ? JSON.parse(localStorage.getItem('shafigo_driver'))
  : (localStorage.getItem('swiftride_driver') ? JSON.parse(localStorage.getItem('swiftride_driver')) : null);

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
        localStorage.setItem('shafigo_token', token);
      }
      state.user = user;
      state.driver = driver || null;
      state.isAuthenticated = true;
      localStorage.setItem('shafigo_user', JSON.stringify(user));
      if (driver) {
        localStorage.setItem('shafigo_driver', JSON.stringify(driver));
      } else {
        localStorage.removeItem('shafigo_driver');
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('shafigo_user', JSON.stringify(state.user));
    },
    updateDriver: (state, action) => {
      state.driver = { ...state.driver, ...action.payload };
      localStorage.setItem('shafigo_driver', JSON.stringify(state.driver));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.driver = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('shafigo_token');
      localStorage.removeItem('shafigo_user');
      localStorage.removeItem('shafigo_driver');
      localStorage.removeItem('swiftride_token');
      localStorage.removeItem('swiftride_user');
      localStorage.removeItem('swiftride_driver');
    },
  },
});

export const { setCredentials, updateUser, updateDriver, logout } = authSlice.actions;
export default authSlice.reducer;
