import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPosition, setPickupLocation } from '../store/locationSlice';

const DEFAULT_COORDS = {
  lat: 40.7128,
  lng: -74.0060,
  address: 'Downtown Financial District, New York, NY',
};

export const useGeolocation = () => {
  const dispatch = useDispatch();
  const [coords, setCoords] = useState(DEFAULT_COORDS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLocation = useCallback(() => {
    setLoading(true);
    if (!navigator.geolocation) {
      setError('Geolocation not supported by browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: 'Current Location',
        };
        setCoords(newCoords);
        dispatch(setCurrentPosition(newCoords));
        setLoading(false);
      },
      (err) => {
        // Fallback gracefully to default coordinates
        setCoords(DEFAULT_COORDS);
        dispatch(setCurrentPosition(DEFAULT_COORDS));
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
    );
  }, [dispatch]);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return { coords, loading, error, refreshLocation: fetchLocation };
};

export default useGeolocation;
