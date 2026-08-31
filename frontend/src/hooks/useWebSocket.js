import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { updateActiveRideStatus, updateDriverLiveLocation, setActiveRide } from '../store/rideSlice';
import { addIncomingRequest, removeIncomingRequest, setOnlineStatus, setDriverProfile } from '../store/driverSlice';
import { updateDriver } from '../store/authSlice';
import { addNotification } from '../store/notificationSlice';
import {
  incrementTotalUsers,
  addPendingDriver,
  handleDriverVerificationUpdated,
  handleDriverStatusChanged,
  updateDriverLocationTelemetry,
  addOrUpdateRecentRide,
  handleRideCompletedEvent,
  handleRevenueUpdatedEvent,
  setWsConnected,
} from '../store/adminSlice';
import { showToast } from '../store/uiSlice';
import { WS_BASE_URL } from '../api/config';

// Normalize wss:// or ws:// to https:// or http:// for SockJS HTTP transport handshake
const WS_URL = WS_BASE_URL.startsWith('wss://')
  ? WS_BASE_URL.replace('wss://', 'https://')
  : WS_BASE_URL.startsWith('ws://')
  ? WS_BASE_URL.replace('ws://', 'http://')
  : WS_BASE_URL;

export const useWebSocket = () => {
  const dispatch = useDispatch();
  const { user, driver, isAuthenticated } = useSelector((state) => state.auth);
  const { driverProfile, profile } = useSelector((state) => state.driver);
  const { activeRide } = useSelector((state) => state.ride);
  const clientRef = useRef(null);
  const subscriptionsRef = useRef({});

  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.8;
      audio.play().catch(() => {
        // Autoplay may be restricted before first user interaction
      });
    } catch (e) {
      // Ignore audio error
    }
  }, []);

  const handleRideEventNotification = useCallback((eventType, ride) => {
    switch (eventType) {
      case 'RIDE_ACCEPTED':
        dispatch(showToast({ type: 'success', message: '🎉 Driver partner assigned to your ride!' }));
        break;
      case 'DRIVER_ARRIVING':
        dispatch(showToast({ type: 'info', message: '🚗 Driver is on the way to pickup location.' }));
        break;
      case 'DRIVER_ARRIVED':
        dispatch(showToast({ type: 'success', message: '📍 Driver has arrived at pickup point!' }));
        break;
      case 'RIDE_STARTED':
        dispatch(showToast({ type: 'info', message: '🚀 Ride in progress. Have a safe journey!' }));
        break;
      case 'RIDE_COMPLETED':
        dispatch(showToast({ type: 'success', message: '🏁 Ride completed! Thank you for riding with ShafiGo.' }));
        break;
      case 'RIDE_CANCELLED':
        dispatch(showToast({ type: 'warning', message: 'Ride was cancelled.' }));
        break;
      case 'NO_DRIVER_FOUND':
        dispatch(showToast({ type: 'error', message: 'No drivers found nearby. Please try again.' }));
        break;
      default:
        break;
    }
  }, [dispatch]);

  const handleIncomingRideRequest = useCallback((ride) => {
    if (!ride) return;
    dispatch(addIncomingRequest(ride));
    dispatch(addNotification({
      id: `ride_req_${ride.id}_${Date.now()}`,
      title: '🔔 New Ride Request Nearby',
      message: `Pickup: ${ride.pickupAddress || 'Nearby Pickup'} | Fare: ₹${ride.estimatedFare ? Number(ride.estimatedFare).toFixed(2) : '0.00'}`,
      type: 'RIDE_REQUEST',
      ride,
      createdAt: new Date().toISOString(),
      isRead: false,
    }));
    dispatch(showToast({ type: 'info', message: '🔔 New ShafiGo Ride Request Nearby!' }));
    playNotificationSound();
  }, [dispatch, playNotificationSound]);

  const connect = useCallback(() => {
    if (!isAuthenticated || !user) return;

    if (clientRef.current && clientRef.current.active) {
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      debug: (str) => {
        if (import.meta.env.DEV) {
          // console.debug('[STOMP]', str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('Connected to ShafiGo STOMP WebSocket');
      dispatch(setWsConnected(true));

      // 1. Subscribe to User Notifications Channel
      const notifSub = client.subscribe(`/topic/user/${user.id}/notifications`, (message) => {
        try {
          const notification = JSON.parse(message.body);
          dispatch(addNotification(notification));

          if (notification.type === 'RIDE_REQUEST' || notification.eventType === 'RIDE_REQUESTED' || notification.event === 'RIDE_REQUESTED') {
            if (notification.ride) {
              handleIncomingRideRequest(notification.ride);
            }
          } else if (notification.type === 'DRIVER_APPROVAL' || notification.eventType === 'DRIVER_VERIFICATION_UPDATED') {
            if (notification.driver) {
              dispatch(setDriverProfile(notification.driver));
              dispatch(updateDriver(notification.driver));
            }
            if (notification.status === 'APPROVED') {
              dispatch(setOnlineStatus('OFFLINE'));
            }
          }
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
            if (data.eventType === 'NO_DRIVER_FOUND' || data.event === 'NO_DRIVER_FOUND') {
              dispatch(updateActiveRideStatus({ status: 'NO_DRIVER_FOUND' }));
              handleRideEventNotification('NO_DRIVER_FOUND', data.ride);
            } else if (data.ride) {
              dispatch(setActiveRide(data.ride));
              handleRideEventNotification(data.eventType || data.event, data.ride);
            }
          } catch (e) {
            console.error('Failed to parse rider message', e);
          }
        });
        subscriptionsRef.current.rider = riderSub;
      }

      // 3. If Driver: Subscribe to Driver Dispatch Channel & User Queue
      const currentDriverId = driver?.id || user.driverId || driverProfile?.id || profile?.id;
      if (user.role === 'ROLE_DRIVER') {
        if (currentDriverId) {
          console.log(`[WS] Subscribed to Driver Dispatch Channel: /topic/driver/${currentDriverId}`);
          const driverSub = client.subscribe(`/topic/driver/${currentDriverId}`, (message) => {
            try {
              const data = JSON.parse(message.body);
              console.log('[WS] Received driver message:', data.eventType || data.event);

              if ((data.eventType === 'RIDE_REQUESTED' || data.event === 'RIDE_REQUESTED') && data.ride) {
                handleIncomingRideRequest(data.ride);
              } else if (data.eventType === 'DRIVER_VERIFICATION_UPDATED' || data.eventType === 'DRIVER_APPROVED' || data.eventType === 'DRIVER_REJECTED') {
                if (data.driver) {
                  dispatch(setDriverProfile(data.driver));
                  dispatch(updateDriver(data.driver));
                }
                const status = data.status || data.approvalStatus || (data.eventType === 'DRIVER_APPROVED' ? 'APPROVED' : null);
                if (status === 'APPROVED') {
                  dispatch(setOnlineStatus('OFFLINE'));
                  dispatch(showToast({ type: 'success', message: '🎉 Account Approved by Admin! You can now Go Online.' }));
                } else if (status === 'REJECTED') {
                  dispatch(showToast({ type: 'error', message: 'Driver registration was rejected by Admin.' }));
                }
              } else if (data.eventType === 'EARNINGS_UPDATED') {
                dispatch(showToast({ type: 'success', message: `💰 ₹${data.earningAmount?.toFixed(2)} added to your earnings!` }));
              } else if (data.eventType === 'RIDE_ASSIGNED' || data.eventType === 'RIDE_CANCELLED' || data.eventType === 'RIDE_REQUEST_EXPIRED') {
                const rideId = data.ride?.id || data.rideId;
                if (rideId) {
                  dispatch(removeIncomingRequest(rideId));
                }
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
          subscriptionsRef.current.driverId = currentDriverId;
        }

        // Private user queue subscription
        try {
          const userQueueSub = client.subscribe('/user/queue/ride-requests', (message) => {
            try {
              const data = JSON.parse(message.body);
              if (data.ride) {
                handleIncomingRideRequest(data.ride);
              }
            } catch (e) {
              console.error('Failed to parse user queue message', e);
            }
          });
          subscriptionsRef.current.userQueue = userQueueSub;
        } catch (err) {
          console.debug('User queue subscription error:', err);
        }
      }

      // 4. If Admin: Subscribe to Admin Activity Feed
      if (user.role === 'ROLE_ADMIN') {
        const adminSub = client.subscribe('/topic/admin', (message) => {
          try {
            const data = JSON.parse(message.body);
            const { eventType } = data;

            if (eventType === 'USER_REGISTERED') {
              dispatch(incrementTotalUsers());
              dispatch(showToast({ type: 'info', message: `👤 New User Registered: ${data.user?.firstName || ''} ${data.user?.lastName || ''}` }));
            } else if (eventType === 'DRIVER_REGISTERED') {
              if (data.driver) {
                dispatch(addPendingDriver(data.driver));
              }
              dispatch(showToast({ type: 'info', message: '🚖 New Driver Application Received!' }));
            } else if (eventType === 'DRIVER_VERIFICATION_UPDATED') {
              dispatch(handleDriverVerificationUpdated(data));
            } else if (eventType === 'DRIVER_STATUS_UPDATED') {
              dispatch(handleDriverStatusChanged(data));
            } else if (eventType === 'DRIVER_LOCATION_UPDATED') {
              dispatch(updateDriverLocationTelemetry(data));
            } else if (eventType === 'RIDE_REQUESTED') {
              if (data.ride) {
                dispatch(addOrUpdateRecentRide(data.ride));
                dispatch(showToast({ type: 'info', message: `📍 New Trip Requested #${data.ride.id}` }));
              }
            } else if (eventType === 'RIDE_ACCEPTED' || eventType === 'DRIVER_ARRIVING' || eventType === 'DRIVER_ARRIVED' || eventType === 'RIDE_STARTED') {
              if (data.ride) {
                dispatch(addOrUpdateRecentRide(data.ride));
              }
            } else if (eventType === 'RIDE_COMPLETED') {
              if (data.ride) {
                dispatch(addOrUpdateRecentRide(data.ride));
                dispatch(handleRideCompletedEvent(data.ride));
                dispatch(showToast({ type: 'success', message: `🏁 Trip #${data.ride.id} Completed! Fare ₹${data.ride.finalFare || data.ride.estimatedFare}` }));
              }
            } else if (eventType === 'RIDE_CANCELLED') {
              if (data.ride) {
                dispatch(addOrUpdateRecentRide(data.ride));
              }
            } else if (eventType === 'REVENUE_UPDATED') {
              dispatch(handleRevenueUpdatedEvent(data));
            }
          } catch (e) {
            console.error('Failed to parse admin message', e);
          }
        });
        subscriptionsRef.current.admin = adminSub;
      }
    };

    client.onWebSocketClose = () => {
      dispatch(setWsConnected(false));
    };

    client.onDisconnect = () => {
      dispatch(setWsConnected(false));
    };

    client.onStompError = (frame) => {
      console.error('STOMP Error:', frame.headers['message'], frame.body);
      dispatch(setWsConnected(false));
    };

    client.activate();
    clientRef.current = client;
  }, [isAuthenticated, user, driver, driverProfile, profile, dispatch, handleIncomingRideRequest, handleRideEventNotification]);

  // Dynamic subscription for Driver Topic when driver entity ID becomes available/updated
  useEffect(() => {
    if (!clientRef.current || !clientRef.current.connected) return;
    if (user?.role !== 'ROLE_DRIVER') return;

    const effectiveDriverId = driver?.id || user?.driverId || driverProfile?.id || profile?.id;
    if (!effectiveDriverId) return;

    if (subscriptionsRef.current.driverId === effectiveDriverId && subscriptionsRef.current.driver) {
      return;
    }

    if (subscriptionsRef.current.driver) {
      subscriptionsRef.current.driver.unsubscribe();
    }

    console.log(`[WS Dynamic] Subscribing to Driver Dispatch Channel: /topic/driver/${effectiveDriverId}`);
    const driverSub = clientRef.current.subscribe(`/topic/driver/${effectiveDriverId}`, (message) => {
      try {
        const data = JSON.parse(message.body);
        console.log('[WS] Received driver message:', data.eventType || data.event);

        if ((data.eventType === 'RIDE_REQUESTED' || data.event === 'RIDE_REQUESTED') && data.ride) {
          handleIncomingRideRequest(data.ride);
        } else if (data.eventType === 'DRIVER_VERIFICATION_UPDATED' || data.eventType === 'DRIVER_APPROVED' || data.eventType === 'DRIVER_REJECTED') {
          if (data.driver) {
            dispatch(setDriverProfile(data.driver));
            dispatch(updateDriver(data.driver));
          }
          const status = data.status || data.approvalStatus || (data.eventType === 'DRIVER_APPROVED' ? 'APPROVED' : null);
          if (status === 'APPROVED') {
            dispatch(setOnlineStatus('OFFLINE'));
            dispatch(showToast({ type: 'success', message: '🎉 Account Approved by Admin! You can now Go Online.' }));
          } else if (status === 'REJECTED') {
            dispatch(showToast({ type: 'error', message: 'Driver registration was rejected by Admin.' }));
          }
        } else if (data.eventType === 'EARNINGS_UPDATED') {
          dispatch(showToast({ type: 'success', message: `💰 ₹${data.earningAmount?.toFixed(2)} added to your earnings!` }));
        } else if (data.eventType === 'RIDE_ASSIGNED' || data.eventType === 'RIDE_CANCELLED' || data.eventType === 'RIDE_REQUEST_EXPIRED') {
          const rideId = data.ride?.id || data.rideId;
          if (rideId) {
            dispatch(removeIncomingRequest(rideId));
          }
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
    subscriptionsRef.current.driverId = effectiveDriverId;
  }, [user, driver, driverProfile, profile, dispatch, handleIncomingRideRequest, handleRideEventNotification]);

  const subscribeToRide = useCallback((rideId) => {
    if (!clientRef.current || !clientRef.current.connected) return;

    if (subscriptionsRef.current.activeRide) {
      subscriptionsRef.current.activeRide.unsubscribe();
    }

    const rideSub = clientRef.current.subscribe(`/topic/ride/${rideId}`, (message) => {
      try {
        const data = JSON.parse(message.body);
        if (data.eventType === 'DRIVER_LOCATION_UPDATED') {
          dispatch(updateDriverLiveLocation({
            latitude: data.latitude,
            longitude: data.longitude,
            heading: data.heading,
            speed: data.speed,
            accuracy: data.accuracy,
            timestamp: data.timestamp,
          }));
        } else if (data.eventType === 'NO_DRIVER_FOUND' || data.event === 'NO_DRIVER_FOUND') {
          dispatch(updateActiveRideStatus({ status: 'NO_DRIVER_FOUND' }));
          handleRideEventNotification('NO_DRIVER_FOUND', data.ride);
        } else if (data.ride) {
          dispatch(setActiveRide(data.ride));
          handleRideEventNotification(data.eventType || data.event, data.ride);
        }
      } catch (e) {
        console.error('Failed to parse ride update', e);
      }
    });

    subscriptionsRef.current.activeRide = rideSub;
  }, [dispatch, handleRideEventNotification]);

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
