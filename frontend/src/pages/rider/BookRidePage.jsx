import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LocationPicker } from '../../components/map/LocationPicker';
import { VehicleSelector } from '../../components/rider/VehicleSelector';
import { FareEstimateCard } from '../../components/rider/FareEstimateCard';
import { DriverSearchModal } from '../../components/rider/DriverSearchModal';
import { ActiveRideCard } from '../../components/rider/ActiveRideCard';
import { MapView } from '../../components/map/MapView';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { rideApi } from '../../api/rideApi';
import { setActiveRide } from '../../store/rideSlice';
import { setRouteDetails } from '../../store/locationSlice';
import { showToast } from '../../store/uiSlice';
import { ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

export const BookRidePage = () => {
  const dispatch = useDispatch();

  const { pickupLocation, destinationLocation } = useSelector((state) => state.location);
  const { activeRide } = useSelector((state) => state.ride);

  const [selectedVehicle, setSelectedVehicle] = useState('SEDAN');
  const [estimate, setEstimate] = useState(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [requestingRide, setRequestingRide] = useState(false);
  const [isSearchingDriver, setIsSearchingDriver] = useState(false);

  // Check for any ongoing active ride on initial page load
  useEffect(() => {
    fetchActiveRideOnMount();
  }, []);

  const fetchActiveRideOnMount = async () => {
    try {
      const res = await rideApi.getActiveRide();
      if (res.success && res.data) {
        dispatch(setActiveRide(res.data));
        if (res.data.status === 'SEARCHING_DRIVER' || res.data.status === 'REQUESTED') {
          setIsSearchingDriver(true);
        }
      }
    } catch (e) {
      // No active ride in progress
    }
  };

  // Sync searching modal with active ride status changes from WebSocket
  useEffect(() => {
    if (!activeRide) {
      setIsSearchingDriver(false);
      return;
    }
    if (activeRide.status === 'SEARCHING_DRIVER' || activeRide.status === 'REQUESTED') {
      setIsSearchingDriver(true);
    } else {
      setIsSearchingDriver(false);
    }
  }, [activeRide?.status]);

  // Auto-calculate estimate when pickup/destination change
  useEffect(() => {
    if (pickupLocation?.lat && destinationLocation?.lat && !activeRide) {
      handleGetEstimate();
    }
  }, [pickupLocation?.lat, destinationLocation?.lat, activeRide]);

  const handleGetEstimate = async () => {
    setLoadingEstimate(true);
    try {
      const res = await rideApi.estimateRide({
        pickupLatitude: pickupLocation.lat,
        pickupLongitude: pickupLocation.lng,
        destinationLatitude: destinationLocation.lat,
        destinationLongitude: destinationLocation.lng,
      });
      if (res.success) {
        setEstimate(res.data);
      }
    } catch (e) {
      console.error('Failed to estimate ride', e);
    } finally {
      setLoadingEstimate(false);
    }
  };

  const handleRouteCalculated = useCallback((route) => {
    dispatch(setRouteDetails(route));
  }, [dispatch]);

  const handleRequestRide = async () => {
    setRequestingRide(true);
    try {
      const res = await rideApi.requestRide({
        vehicleType: selectedVehicle,
        pickupAddress: pickupLocation.address || 'Bengaluru Pickup',
        pickupLatitude: pickupLocation.lat,
        pickupLongitude: pickupLocation.lng,
        destinationAddress: destinationLocation.address || 'Bengaluru Dropoff',
        destinationLatitude: destinationLocation.lat,
        destinationLongitude: destinationLocation.lng,
      });

      if (res.success) {
        dispatch(setActiveRide(res.data));
        setIsSearchingDriver(true);
        dispatch(showToast({ type: 'success', message: '🚗 Searching for nearby ShafiGo drivers...' }));
      }
    } catch (e) {
      const errorMsg = e.response?.data?.message || e.message;
      if (errorMsg && errorMsg.includes('already have an active')) {
        dispatch(showToast({ type: 'warning', message: 'You already have an active ride in progress. Restoring active trip...' }));
        await fetchActiveRideOnMount();
      } else {
        dispatch(showToast({ type: 'error', message: errorMsg || 'Failed to request ride.' }));
      }
    } finally {
      setRequestingRide(false);
    }
  };

  const handleCancelCurrentRide = async () => {
    if (!activeRide) return;
    try {
      await rideApi.cancelRide(activeRide.id, 'User cancelled from booking screen');
      dispatch(setActiveRide(null));
      setIsSearchingDriver(false);
      dispatch(showToast({ type: 'info', message: 'Ongoing ride was cancelled. You can now book a new ride.' }));
    } catch (e) {
      dispatch(showToast({ type: 'error', message: 'Failed to cancel active ride.' }));
    }
  };

  const getTierLabel = () => {
    if (selectedVehicle === 'BIKE') return 'ShafiMoto';
    if (selectedVehicle === 'SUV') return 'ShafiPremier';
    return 'ShafiGo';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {activeRide ? 'Current Active Ride' : 'Book a Ride'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {activeRide ? 'Track your live trip progression or manage your booking' : 'Choose your route and ride option with ShafiGo'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Booking Form or Active Ride */}
        <div className="lg:col-span-5 space-y-5">
          {activeRide ? (
            <div className="space-y-3">
              <ActiveRideCard
                ride={activeRide}
                onCancelRide={handleCancelCurrentRide}
              />
            </div>
          ) : (
            <Card className="p-5 sm:p-6 bg-zinc-950 border border-zinc-800 shadow-2xl space-y-5">
              <LocationPicker />

              {estimate && (
                <div className="space-y-4 pt-3 border-t border-zinc-800 animate-fade-in">
                  <VehicleSelector
                    selectedType={selectedVehicle}
                    onSelectType={setSelectedVehicle}
                    estimates={estimate.estimatedFares}
                    durationMinutes={estimate.estimatedDurationMinutes}
                  />

                  <FareEstimateCard estimate={estimate} selectedType={selectedVehicle} />

                  <Button
                    fullWidth
                    size="lg"
                    icon={ArrowRight}
                    onClick={handleRequestRide}
                    loading={requestingRide}
                    className="shadow-2xl font-black text-base"
                  >
                    Confirm & Request {getTierLabel()}
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Right Column: Interactive Map */}
        <div className="lg:col-span-7 h-[420px] lg:h-[620px]">
          <MapView
            pickup={pickupLocation}
            destination={destinationLocation}
            activeRide={activeRide}
            onRouteCalculated={handleRouteCalculated}
            className="h-full rounded-3xl border border-zinc-800"
          />
        </div>
      </div>

      {/* Driver Search Modal */}
      <DriverSearchModal
        isOpen={isSearchingDriver && activeRide?.status === 'SEARCHING_DRIVER'}
        ride={activeRide}
        onCancel={handleCancelCurrentRide}
      />
    </div>
  );
};

export default BookRidePage;
