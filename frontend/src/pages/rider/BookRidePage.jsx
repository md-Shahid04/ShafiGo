import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { ArrowRight, Navigation, RefreshCw } from 'lucide-react';

export const BookRidePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { pickupLocation, destinationLocation } = useSelector((state) => state.location);
  const { activeRide } = useSelector((state) => state.ride);

  const [selectedVehicle, setSelectedVehicle] = useState('SEDAN');
  const [estimate, setEstimate] = useState(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [requestingRide, setRequestingRide] = useState(false);
  const [isSearchingDriver, setIsSearchingDriver] = useState(false);

  // Auto-calculate estimate when pickup/destination change
  useEffect(() => {
    if (pickupLocation?.lat && destinationLocation?.lat) {
      handleGetEstimate();
    }
  }, [pickupLocation?.lat, destinationLocation?.lat]);

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
      console.error(e);
    } finally {
      setLoadingEstimate(false);
    }
  };

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
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRequestingRide(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Book a Ride</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Choose your route and ride option in India
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Booking Form or Active Ride */}
        <div className="lg:col-span-5 space-y-5">
          {activeRide ? (
            <ActiveRideCard
              ride={activeRide}
              onCancelRide={async () => {
                await rideApi.cancelRide(activeRide.id, 'Changed plans');
                dispatch(setActiveRide(null));
                setIsSearchingDriver(false);
              }}
            />
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
                    className="shadow-2xl"
                  >
                    Confirm & Request {selectedVehicle === 'BIKE' ? 'SwiftMoto' : selectedVehicle === 'SUV' ? 'SwiftPremier' : 'SwiftGo'}
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
            className="h-full rounded-3xl border border-zinc-800"
          />
        </div>
      </div>

      {/* Driver Search Modal */}
      <DriverSearchModal
        isOpen={isSearchingDriver && activeRide?.status === 'SEARCHING_DRIVER'}
        ride={activeRide}
        onCancel={async () => {
          if (activeRide) {
            await rideApi.cancelRide(activeRide.id, 'Cancelled search');
            dispatch(setActiveRide(null));
          }
          setIsSearchingDriver(false);
        }}
      />
    </div>
  );
};

export default BookRidePage;
