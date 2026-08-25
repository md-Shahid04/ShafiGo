import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { useWebSocket } from '../../hooks/useWebSocket';
import { driverApi } from '../../api/driverApi';
import { rideApi } from '../../api/rideApi';
import { DriverStatusToggle } from '../../components/driver/DriverStatusToggle';
import { IncomingRequestModal } from '../../components/driver/IncomingRequestModal';
import { RideActionControls } from '../../components/driver/RideActionControls';
import { MapView } from '../../components/map/MapView';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import {
  setDriverProfile,
  setOnlineStatus,
  removeIncomingRequest,
  clearIncomingRequests,
} from '../../store/driverSlice';
import { setActiveRide, updateDriverLiveLocation } from '../../store/rideSlice';
import { showToast } from '../../store/uiSlice';
import {
  Star,
  Navigation,
  Compass,
  Radio,
} from 'lucide-react';

export const DriverDashboard = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  useWebSocket();

  const { driverProfile, profile, onlineStatus, incomingRequests } = useSelector((state) => state.driver);
  const currentProfile = driverProfile || profile;
  const { activeRide } = useSelector((state) => state.ride);

  const [loading, setLoading] = useState(false);
  const [earnings, setEarnings] = useState(null);
  const [lastGpsCoords, setLastGpsCoords] = useState(null);
  const [heading, setHeading] = useState(0);

  const watchIdRef = useRef(null);
  const lastSendTimeRef = useRef(0);
  const lastCoordsRef = useRef(null);

  const isApproved = currentProfile?.verificationStatus === 'APPROVED';
  const effectiveOnlineStatus = isApproved ? onlineStatus : 'OFFLINE';

  const currentIncoming = incomingRequests && incomingRequests.length > 0 ? incomingRequests[0] : null;

  useEffect(() => {
    fetchProfile();
    fetchActiveRide();
    fetchEarnings();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await driverApi.getMyProfile();
      if (res.success) {
        dispatch(setDriverProfile(res.data));
        const initialStatus = res.data.verificationStatus === 'APPROVED' ? res.data.onlineStatus : 'OFFLINE';
        dispatch(setOnlineStatus(initialStatus));
        if (res.data.currentLatitude && res.data.currentLongitude) {
          setLastGpsCoords({
            lat: res.data.currentLatitude,
            lng: res.data.currentLongitude,
          });
        }
      }
    } catch (e) {
      console.error('Failed to load profile', e);
    }
  };

  const fetchActiveRide = async () => {
    try {
      const res = await rideApi.getActiveRide();
      if (res.success) {
        dispatch(setActiveRide(res.data));
      }
    } catch (e) {
      console.error('Failed to load active ride', e);
    }
  };

  const fetchEarnings = async () => {
    try {
      const res = await driverApi.getEarnings();
      if (res.success) {
        setEarnings(res.data);
      }
    } catch (e) {
      console.error('Failed to load earnings', e);
    }
  };

  // Transmit throttled GPS telemetry to backend
  const sendLocationUpdate = useCallback(async (telemetry) => {
    if (!isApproved || effectiveOnlineStatus !== 'ONLINE') return;

    const now = Date.now();
    // Throttle to maximum 1 update every 2.5 seconds
    if (now - lastSendTimeRef.current < 2500) {
      return;
    }

    lastSendTimeRef.current = now;
    lastCoordsRef.current = telemetry;
    setLastGpsCoords({ lat: telemetry.latitude, lng: telemetry.longitude });
    setHeading(telemetry.heading || 0);

    try {
      await driverApi.updateLocation({
        latitude: telemetry.latitude,
        longitude: telemetry.longitude,
        heading: telemetry.heading || 0,
        speed: telemetry.speed || 0,
        accuracy: telemetry.accuracy || 10,
        timestamp: telemetry.timestamp || now,
        rideId: activeRide?.id || null,
      });

      if (activeRide?.id) {
        dispatch(updateDriverLiveLocation({
          latitude: telemetry.latitude,
          longitude: telemetry.longitude,
          heading: telemetry.heading || 0,
          speed: telemetry.speed || 0,
        }));
      }
    } catch (err) {
      console.warn('Failed to broadcast driver location:', err);
    }
  }, [activeRide?.id, dispatch, isApproved, effectiveOnlineStatus]);

  // Start continuous watchPosition tracking
  const startTracking = useCallback(() => {
    if (!isApproved) return;
    if (!navigator.geolocation) {
      dispatch(showToast({ type: 'warning', message: 'Geolocation not supported by browser' }));
      return;
    }

    if (watchIdRef.current != null) return;

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
        sendLocationUpdate(telemetry);
      },
      (err) => {
        console.warn('Driver GPS watch error:', err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 10000,
      }
    );
  }, [dispatch, sendLocationUpdate, isApproved]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // Manage tracking based on onlineStatus and isApproved
  useEffect(() => {
    if (isApproved && effectiveOnlineStatus === 'ONLINE') {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [isApproved, effectiveOnlineStatus, startTracking, stopTracking]);

  const handleToggleStatus = async () => {
    if (!isApproved) {
      dispatch(showToast({ type: 'error', message: 'Driver account is awaiting admin approval.' }));
      return;
    }

    setLoading(true);
    const newStatus = effectiveOnlineStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    try {
      const res = await driverApi.updateOnlineStatus(newStatus);
      if (res.success) {
        dispatch(setOnlineStatus(newStatus));
        if (newStatus === 'ONLINE') {
          dispatch(showToast({ type: 'success', message: '🟢 You are now ONLINE and ready for ride dispatches.' }));
        } else {
          dispatch(showToast({ type: 'info', message: '🔴 You are now OFFLINE.' }));
        }
      }
    } catch (e) {
      console.error(e);
      const errMsg = e.response?.data?.message || e.message || 'Cannot change status';
      dispatch(showToast({ type: 'error', message: errMsg }));
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRide = async (rideId) => {
    try {
      const res = await rideApi.acceptRide(rideId);
      if (res.success) {
        dispatch(setActiveRide(res.data));
        dispatch(clearIncomingRequests());
        dispatch(setOnlineStatus('BUSY'));
        dispatch(showToast({ type: 'success', message: 'Ride Accepted! Navigate to pickup point.' }));
      }
    } catch (e) {
      console.error(e);
      const errMsg = e.response?.data?.message || e.message;
      dispatch(showToast({ type: 'error', message: errMsg }));
    }
  };

  const handleRejectRide = (rideId) => {
    dispatch(removeIncomingRequest(rideId));
  };

  // Helper function for quick manual movement simulation
  const handleSimulateMove = (latOffset, lngOffset, newHeading) => {
    const currentLat = lastGpsCoords?.lat || 12.9352;
    const currentLng = lastGpsCoords?.lng || 77.6245;

    const nextLat = currentLat + latOffset;
    const nextLng = currentLng + lngOffset;

    sendLocationUpdate({
      latitude: nextLat,
      longitude: nextLng,
      heading: newHeading != null ? newHeading : heading,
      speed: 15,
      accuracy: 5,
      timestamp: Date.now(),
    });
  };

  const handleStatusUpdated = (updated) => {
    dispatch(setActiveRide(updated));
    if (updated?.status === 'RIDE_COMPLETED') {
      dispatch(setOnlineStatus('ONLINE'));
      fetchEarnings();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Driver Partner Console
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Welcome back, {user?.fullName}. Bengaluru Urban Corridor.
          </p>
        </div>

        {/* GPS Live Telemetry Indicator */}
        {isApproved && effectiveOnlineStatus === 'ONLINE' && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-white text-xs font-bold shadow-lg">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Live GPS Active</span>
          </div>
        )}
      </div>

      {/* Online / Offline Toggle Banner */}
      <DriverStatusToggle
        onlineStatus={effectiveOnlineStatus}
        verificationStatus={currentProfile?.verificationStatus}
        onToggleStatus={handleToggleStatus}
        loading={loading}
        activeVehicle={currentProfile?.activeVehicle}
      />

      {/* Driver Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-[10px] uppercase font-extrabold text-zinc-400">Today's Earnings</span>
          <div className="text-2xl font-black text-white">
            ₹{earnings?.todayEarnings ? earnings.todayEarnings.toFixed(2) : '0.00'}
          </div>
          <span className="text-[10px] text-zinc-400 block font-medium">
            {earnings?.todayTrips || 0} Completed Trips Today
          </span>
        </Card>

        <Card className="p-5 bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-[10px] uppercase font-extrabold text-zinc-400">Weekly Payout</span>
          <div className="text-2xl font-black text-white">
            ₹{earnings?.weeklyEarnings ? earnings.weeklyEarnings.toFixed(2) : '0.00'}
          </div>
          <span className="text-[10px] text-zinc-400 block font-medium">Auto-settles to Bank</span>
        </Card>

        <Card className="p-5 bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-[10px] uppercase font-extrabold text-zinc-400">Rating & Trust</span>
          <div className="text-2xl font-black text-white flex items-center gap-1.5">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            {currentProfile?.rating || 5.0}
          </div>
          <span className="text-[10px] text-zinc-400 block font-medium">Top Rated Driver Partner</span>
        </Card>

        <Card className="p-5 bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-[10px] uppercase font-extrabold text-zinc-400">Total Trips</span>
          <div className="text-2xl font-black text-white">
            {currentProfile?.totalRides || earnings?.completedTrips || 0}
          </div>
          <span className="text-[10px] text-zinc-400 block font-medium">
            {earnings?.onlineHours ? `${earnings.onlineHours} Drive Time` : 'Active Partner'}
          </span>
        </Card>
      </div>

      {/* Active Trip Workflow & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-5">
          {activeRide ? (
            <div className="space-y-4">
              <RideActionControls
                ride={activeRide}
                onStatusUpdated={handleStatusUpdated}
              />

              {/* Quick GPS Drive Simulator controls during active trip */}
              <Card className="p-4 bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-[10px] uppercase font-extrabold text-zinc-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-blue-400" />
                  Live GPS Movement Simulator (Testing)
                </span>
                <p className="text-[11px] text-zinc-400">
                  Simulate driver driving along the road to verify live rider marker movement:
                </p>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  <Button size="xs" variant="outline" onClick={() => handleSimulateMove(0.003, 0, 0)}>
                    ▲ North
                  </Button>
                  <Button size="xs" variant="outline" onClick={() => handleSimulateMove(0, 0.003, 90)}>
                    ► East
                  </Button>
                  <Button size="xs" variant="outline" onClick={() => handleSimulateMove(-0.003, 0, 180)}>
                    ▼ South
                  </Button>
                  <Button size="xs" variant="outline" onClick={() => handleSimulateMove(0, -0.003, 270)}>
                    ◄ West
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center font-black">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    {isApproved && effectiveOnlineStatus === 'ONLINE'
                      ? 'Broadcasting live GPS telemetry...'
                      : !isApproved
                      ? 'Awaiting Admin Verification'
                      : 'Currently Offline'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {isApproved && effectiveOnlineStatus === 'ONLINE'
                      ? 'Stay online to receive instant ride dispatches around Bengaluru'
                      : isApproved
                      ? 'Toggle status to Online to start accepting trips'
                      : 'Your account is under admin review. You will be able to go online after approval.'}
                  </p>
                </div>
              </div>

              {isApproved && effectiveOnlineStatus === 'ONLINE' && (
                <div className="pt-2 border-t border-zinc-800">
                  <span className="text-[10px] uppercase font-extrabold text-zinc-400 block mb-2">
                    Test GPS Movement (Simulator)
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    <Button size="xs" variant="outline" onClick={() => handleSimulateMove(0.003, 0, 0)}>
                      ▲ North
                    </Button>
                    <Button size="xs" variant="outline" onClick={() => handleSimulateMove(0, 0.003, 90)}>
                      ► East
                    </Button>
                    <Button size="xs" variant="outline" onClick={() => handleSimulateMove(-0.003, 0, 180)}>
                      ▼ South
                    </Button>
                    <Button size="xs" variant="outline" onClick={() => handleSimulateMove(0, -0.003, 270)}>
                      ◄ West
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>

        <div className="lg:col-span-7 h-[420px] lg:h-[540px]">
          <MapView
            pickup={activeRide ? { lat: activeRide.pickupLatitude, lng: activeRide.pickupLongitude, address: activeRide.pickupAddress } : lastGpsCoords}
            destination={activeRide ? { lat: activeRide.destinationLatitude, lng: activeRide.destinationLongitude, address: activeRide.destinationAddress } : null}
            driverLocation={isApproved && effectiveOnlineStatus === 'ONLINE' && lastGpsCoords ? { lat: lastGpsCoords.lat, lng: lastGpsCoords.lng, heading } : null}
            activeRide={activeRide}
            className="h-full rounded-3xl border border-zinc-800"
          />
        </div>
      </div>

      {/* Incoming Ride Dispatch Modal */}
      <IncomingRequestModal
        request={currentIncoming}
        onAccept={handleAcceptRide}
        onReject={handleRejectRide}
      />
    </div>
  );
};

export default DriverDashboard;
