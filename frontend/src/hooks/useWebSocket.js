import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { updateActiveRideStatus, setActiveRide } from '../store/rideSlice';
import { addIncomingRequest, removeIncomingRequest, setOnlineStatus } from '../store/driverSlice';
import { addNotification } from '../store/notificationSlice';
import { showToast } from '../store/uiSlice';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

export const useWebSocket = () => {
  const dispatch = useDispatch();
  const { user, driver, isAuthenticated } = useSelector((state) => state.auth);
  const { activeRide } = useSelector((state) => state.ride);
  const clientRef = useRef(null);
  const subscriptionsRef = useRef({});

  const connect = useCallback(() => {
    if (!isAuthenticated || !user) return;

    if (clientRef.current && clientRef.current.active) {
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      debug: (str) => {
        // Debug logging in dev mode
        if (import.meta.env.DEV) {
          // console.debug('[STOMP]', str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('Connected to SwiftRide STOMP WebSocket');

      // 1. Subscribe to User Notifications
      const notifSub = client.subscribe(`/topic/user/${user.id}/notifications`, (message) => {
        try {
          const notification = JSON.parse(message.body);
          dispatch(addNotification(notification));
          dispatch(showToast({ type: 'info', message: `${notification.title}: ${notification.message}` }));
        } catch (e) {
          console.error('Failed to parse notification payload', e);
        }
      });
      subscriptionsRef.current.notifications = notifSub;

      // 2. If Rider: Subscribe to Rider Personal Channel
      if (user.role === 'ROLE_RIDER') {
        const riderSub = client.subscribe(`/topic/rider/${user.id}`, (message) => {
          try {
            const data = JSON.parse(message.body);
            if (data.ride) {
              dispatch(setActiveRide(data.ride));
              handleRideEventNotification(data.eventType, data.ride);
            }
          } catch (e) {
            console.error('Failed to parse rider message', e);
          }
        });
        subscriptionsRef.current.rider = riderSub;
      }

      // 3. If Driver: Subscribe to Driver Channel (Dispatches & Status)
      if (driver && driver.id) {
        const driverSub = client.subscribe(`/topic/driver/${driver.id}`, (message) => {
          try {
            const data = JSON.parse(message.body);
            if (data.eventType === 'RIDE_REQUESTED' && data.ride) {
              dispatch(addIncomingRequest(data.ride));
              dispatch(showToast({ type: 'info', message: '🔔 New Ride Request Nearby!' }));
            } else if (data.ride) {
              dispatch(setActiveRide(data.ride));
              dispatch(removeIncomingRequest(data.ride.id));
              handleRideEventNotification(data.eventType, data.ride);
            }
          } catch (e) {
            console.error('Failed to parse driver message', e);
          }
        });
        subscriptionsRef.current.driver = driverSub;
      }

      // 4. If Admin: Subscribe to Admin Activity Feed
      if (user.role === 'ROLE_ADMIN') {
        const adminSub = client.subscribe('/topic/admin', (message) => {
          try {
            const data = JSON.parse(message.body);
            if (data.eventType && data.ride) {
              // Admin updates handled
            }
          } catch (e) {
            console.error('Failed to parse admin message', e);
          }
        });
        subscriptionsRef.current.admin = adminSub;
      }

      // 5. If Active Ride exists: Subscribe to Ride Topic
      if (activeRide && activeRide.id) {
        subscribeToRide(activeRide.id);
      }
    };

    client.onStompError = (frame) => {
      console.error('STOMP Error:', frame.headers['message'], frame.body);
    };

    client.activate();
    clientRef.current = client;
  }, [isAuthenticated, user, driver]);

  const subscribeToRide = useCallback((rideId) => {
    if (!clientRef.current || !clientRef.current.connected) return;

    if (subscriptionsRef.current.activeRide) {
      subscriptionsRef.current.activeRide.unsubscribe();
    }

    const rideSub = clientRef.current.subscribe(`/topic/ride/${rideId}`, (message) => {
      try {
        const data = JSON.parse(message.body);
        if (data.eventType === 'DRIVER_LOCATION_UPDATED') {
          // Real-time live coordinates broadcast
          dispatch(updateActiveRideStatus({
            driverCurrentLat: data.latitude,
            driverCurrentLng: data.longitude,
          }));
        } else if (data.ride) {
          dispatch(setActiveRide(data.ride));
          handleRideEventNotification(data.eventType, data.ride);
        }
      } catch (e) {
        console.error('Failed to parse ride update', e);
      }
    });

    subscriptionsRef.current.activeRide = rideSub;
  }, [dispatch]);

  const handleRideEventNotification = (eventType, ride) => {
    switch (eventType) {
      case 'RIDE_ACCEPTED':
        dispatch(showToast({ type: 'success', message: 'Driver assigned to your ride!' }));
        break;
      case 'DRIVER_ARRIVING':
        dispatch(showToast({ type: 'info', message: 'Driver is on the way to pickup location.' }));
        break;
      case 'DRIVER_ARRIVED':
        dispatch(showToast({ type: 'success', message: 'Driver has arrived at pickup!' }));
        break;
      case 'RIDE_STARTED':
        dispatch(showToast({ type: 'info', message: 'Ride in progress. Have a safe journey!' }));
        break;
      case 'RIDE_COMPLETED':
        dispatch(showToast({ type: 'success', message: 'Ride completed! Thank you for riding with SwiftRide.' }));
        break;
      case 'RIDE_CANCELLED':
        dispatch(showToast({ type: 'warning', message: 'Ride was cancelled.' }));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      connect();
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [isAuthenticated, connect]);

  useEffect(() => {
    if (activeRide && activeRide.id) {
      subscribeToRide(activeRide.id);
    }
  }, [activeRide?.id, subscribeToRide]);

  return {
    client: clientRef.current,
    subscribeToRide,
  };
};

export default useWebSocket;
