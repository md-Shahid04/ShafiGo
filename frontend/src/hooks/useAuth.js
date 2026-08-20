import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { setCredentials, logout as logoutAction, updateUser } from '../store/authSlice';
import { showToast } from '../store/uiSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, driver, token, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );

  const isRider = user?.role === 'ROLE_RIDER';
  const isDriver = user?.role === 'ROLE_DRIVER';
  const isAdmin = user?.role === 'ROLE_ADMIN';

  const login = async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      if (response.success) {
        dispatch(setCredentials(response.data));
        dispatch(showToast({ type: 'success', message: 'Welcome back, ' + response.data.user.firstName + '!' }));

        // Role-based routing
        if (response.data.user.role === 'ROLE_ADMIN') {
          navigate('/admin');
        } else if (response.data.user.role === 'ROLE_DRIVER') {
          navigate('/driver');
        } else {
          navigate('/rider');
        }
        return { success: true };
      }
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err.message || 'Login failed' }));
      return { success: false, error: err.message };
    }
  };

  const registerRider = async (formData) => {
    try {
      const response = await authApi.registerRider(formData);
      if (response.success) {
        dispatch(setCredentials(response.data));
        dispatch(showToast({ type: 'success', message: 'Account created! Welcome to SwiftRide.' }));
        navigate('/rider');
        return { success: true };
      }
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err.message || 'Registration failed' }));
      return { success: false, error: err.message };
    }
  };

  const registerDriver = async (formData) => {
    try {
      const response = await authApi.registerDriver(formData);
      if (response.success) {
        dispatch(setCredentials(response.data));
        dispatch(showToast({ type: 'success', message: 'Driver application submitted successfully!' }));
        navigate('/driver');
        return { success: true };
      }
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err.message || 'Driver registration failed' }));
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    dispatch(showToast({ type: 'info', message: 'Logged out successfully' }));
    navigate('/login');
  };

  return {
    user,
    driver,
    token,
    isAuthenticated,
    loading,
    isRider,
    isDriver,
    isAdmin,
    login,
    registerRider,
    registerDriver,
    logout,
  };
};

export default useAuth;
