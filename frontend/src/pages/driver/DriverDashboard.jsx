import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
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
import { setActiveRide } from '../../store/rideSlice';
import {
  DollarSign,
  Star,
  Car,
  TrendingUp,
  Clock,
  Shield,
  Activity,
  Navigation,
} from 'lucide-react';

export const DriverDashboard = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const { driverProfile, onlineStatus, incomingRequests } = useSelector((state) => state.driver);
  const { activeRide } = useSelector((state) => state.ride);

  const [loading, setLoading] = useState(false);
  const [earnings, setEarnings] = useState(null);

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
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchActiveRide = async () => {
    try {
      const res = await rideApi.getActiveRide();
      if (res.success) {
        dispatch(setActiveRide(res.data));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchEarnings = async () => {
    try {
      const res = await driverApi.getEarnings();
      if (res.success) {
        setEarnings(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStatus = async () => {
    setLoading(true);
    const newStatus = onlineStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    try {
      const res = await driverApi.updateOnlineStatus(newStatus);
      if (res.success) {
        dispatch(setOnlineStatus(newStatus));
      }
    } catch (e) {
      console.error(e);
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
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectRide = (rideId) => {
    dispatch(removeIncomingRequest(rideId));
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
      </div>

      {/* Online / Offline Toggle Banner */}
      <DriverStatusToggle
        onlineStatus={onlineStatus}
        verificationStatus={driverProfile?.verificationStatus}
        onToggleStatus={handleToggleStatus}
        loading={loading}
        activeVehicle={driverProfile?.activeVehicle}
      />

      {/* Driver Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-[10px] uppercase font-extrabold text-zinc-400">Today's Earnings</span>
          <div className="text-2xl font-black text-white">
            ₹{earnings?.todayEarnings ? earnings.todayEarnings.toFixed(2) : '1,450.00'}
          </div>
          <span className="text-[10px] text-zinc-400 block font-medium">8 Completed Trips</span>
        </Card>

        <Card className="p-5 bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-[10px] uppercase font-extrabold text-zinc-400">Weekly Payout</span>
          <div className="text-2xl font-black text-white">
            ₹{earnings?.weeklyEarnings ? earnings.weeklyEarnings.toFixed(2) : '12,800.00'}
          </div>
          <span className="text-[10px] text-zinc-400 block font-medium">Instant Bank Settlement</span>
        </Card>

        <Card className="p-5 bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-[10px] uppercase font-extrabold text-zinc-400">Rating & Trust</span>
          <div className="text-2xl font-black text-white flex items-center gap-1.5">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            {driverProfile?.rating || 4.9}
          </div>
          <span className="text-[10px] text-zinc-400 block font-medium">Top Rated Driver Partner</span>
        </Card>

        <Card className="p-5 bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-[10px] uppercase font-extrabold text-zinc-400">Total Trips</span>
          <div className="text-2xl font-black text-white">
            {driverProfile?.totalRides || 142}
          </div>
          <span className="text-[10px] text-zinc-400 block font-medium">98.5% Acceptance</span>
        </Card>
      </div>

      {/* Active Trip Workflow & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-5">
          {activeRide ? (
            <RideActionControls
              ride={activeRide}
              onStatusUpdated={(updated) => dispatch(setActiveRide(updated))}
            />
          ) : (
            <Card className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center font-black">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    {onlineStatus === 'ONLINE' ? 'Broadcasting live location...' : 'Currently Offline'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {onlineStatus === 'ONLINE'
                      ? 'Stay online to receive instant ride dispatches around Bengaluru'
                      : 'Toggle status to Online to start accepting trips'}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-7 h-[420px] lg:h-[520px]">
          <MapView
            pickup={activeRide ? { lat: activeRide.pickupLatitude, lng: activeRide.pickupLongitude } : null}
            destination={activeRide ? { lat: activeRide.destinationLatitude, lng: activeRide.destinationLongitude } : null}
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
