import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setUserCurrentLocation, setPickupLocation } from '../store/locationSlice';

export const useGeolocation = (autoFetch = true) => {
  const dispatch = useDispatch();
  const [coords, setCoords] = useState(null);
  const [heading, setHeading] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isWatching, setIsWatching] = useState(false);
  const watchIdRef = useRef(null);

  // 1. One-time current position fetch
  const fetchCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: 'Current GPS Location',
        };
        setCoords(newCoords);
        setAccuracy(pos.coords.accuracy);
        setHeading(pos.coords.heading || 0);
        setSpeed(pos.coords.speed || 0);
        dispatch(setUserCurrentLocation({ lat: newCoords.lat, lng: newCoords.lng }));
        setLoading(false);
      },
      (err) => {
        let msg = 'Unable to retrieve location';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission denied by user';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'GPS signal unavailable';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out';
        }
        setError(msg);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  }, [dispatch]);

  // 2. Continuous real-time GPS tracking (for online Drivers & Active Rides)
  const startLiveTracking = useCallback((onLocationUpdate) => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    if (watchIdRef.current != null) {
      return; // Already watching
    }

    setIsWatching(true);
    setError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const telemetry = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          heading: pos.coords.heading || 0,
          speed: pos.coords.speed || 0,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp || Date.now(),
        };

        setCoords({ lat: telemetry.latitude, lng: telemetry.longitude });
        setHeading(telemetry.heading);
        setSpeed(telemetry.speed);
        setAccuracy(telemetry.accuracy);

        dispatch(setUserCurrentLocation({ lat: telemetry.latitude, lng: telemetry.longitude }));

        if (onLocationUpdate) {
          onLocationUpdate(telemetry);
        }
      },
      (err) => {
        console.warn('watchPosition error:', err);
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 10000,
      }
    );
  }, [dispatch]);

  // 3. Stop live tracking and clean up watcher
  const stopLiveTracking = useCallback(() => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setIsWatching(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchCurrentLocation();
    }

    return () => {
      stopLiveTracking();
    };
  }, [autoFetch, fetchCurrentLocation, stopLiveTracking]);

  return {
    coords,
    heading,
    speed,
    accuracy,
    loading,
    error,
    isWatching,
    fetchCurrentLocation,
    startLiveTracking,
    stopLiveTracking,
  };
};

export default useGeolocation;
