import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { MapView } from '../../components/map/MapView';
import { ActiveRideCard } from '../../components/rider/ActiveRideCard';
import { RatingModal } from '../../components/rider/RatingModal';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { rideApi } from '../../api/rideApi';
import { setActiveRide, setHistory } from '../../store/rideSlice';
import { setDestinationLocation } from '../../store/locationSlice';
import {
  ArrowRight,
  Building2,
  Navigation,
} from 'lucide-react';

const POPULAR_DESTINATIONS = [
  { label: 'Kempegowda Intl Airport (BLR)', address: 'Kempegowda Intl Airport (BLR), Bengaluru', lat: 13.1986, lng: 77.7066, category: 'Airport' },
  { label: 'Indiranagar 100ft Rd', address: 'Indiranagar 100ft Road, Bengaluru', lat: 12.9784, lng: 77.6408, category: 'Nightlife & Dining' },
  { label: 'Whitefield ITPL', address: 'ITPL Main Rd, Whitefield, Bengaluru', lat: 12.9863, lng: 77.7308, category: 'Tech Park' },
  { label: 'Electronic City Phase 1', address: 'Electronic City Phase 1, Bengaluru', lat: 12.8452, lng: 77.6602, category: 'Business Hub' },
];

export const RiderDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { activeRide, history } = useSelector((state) => state.ride);
  const { pickupLocation, destinationLocation } = useSelector((state) => state.location);

  const [ratingRide, setRatingRide] = useState(null);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    fetchActiveRide();
    fetchHistory();
  }, []);

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

  const fetchHistory = async () => {
    try {
      const res = await rideApi.getMyRides(0, 5);
      if (res.success) {
        dispatch(setHistory(res.data.content));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectQuickDest = (dest) => {
    dispatch(setDestinationLocation({ address: dest.address, lat: dest.lat, lng: dest.lng }));
    navigate('/rider/book');
  };

  const handleSubmitRating = async (ratingData) => {
    setSubmittingRating(true);
    try {
      await rideApi.rateDriver(ratingData.rideId, {
        rating: ratingData.rating,
        comment: ratingData.comment,
      });
      setRatingRide(null);
      fetchActiveRide();
      fetchHistory();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Hello, {user?.firstName} 👋
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Where would you like to travel in Bengaluru today?
          </p>
        </div>

        <Button
          size="lg"
          icon={ArrowRight}
          onClick={() => navigate('/rider/book')}
          className="shadow-xl"
        >
          Book a Ride Now
        </Button>
      </div>

      {/* Main Grid: Active Ride & Map / Destinations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Ride / Quick Book Callout */}
        <div className="lg:col-span-5 space-y-6">
          {activeRide ? (
            <ActiveRideCard
              ride={activeRide}
              onCancelRide={async () => {
                await rideApi.cancelRide(activeRide.id, 'Changed plans');
                fetchActiveRide();
              }}
              onOpenRating={() => setRatingRide(activeRide)}
            />
          ) : (
            <Card className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
                <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center font-black">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Ready for your next trip?</h3>
                  <p className="text-xs text-zinc-400">Fixed upfront fares in INR (₹)</p>
                </div>
              </div>

              {/* Quick Input Bar that navigates to book */}
              <div
                onClick={() => navigate('/rider/book')}
                className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-sm bg-white" />
                  <span className="text-xs font-semibold text-zinc-300">
                    {destinationLocation?.address || 'Search destination in India...'}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400" />
              </div>

              {/* Popular Spots in Bengaluru */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-zinc-300" />
                  Frequent Bengaluru Hubs
                </span>
                <div className="space-y-2">
                  {POPULAR_DESTINATIONS.map((dest, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectQuickDest(dest)}
                      className="p-3 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 cursor-pointer flex items-center justify-between transition-all group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-bold text-zinc-200 group-hover:text-white truncate">
                          {dest.label}
                        </div>
                        <div className="text-[10px] text-zinc-500">{dest.category}</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 bg-zinc-950 border border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Total Trips</span>
              <span className="text-2xl font-black text-white">{history?.length || 0}</span>
            </Card>
            <Card className="p-4 bg-zinc-950 border border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Saved Hub</span>
              <span className="text-xs font-bold text-white truncate block mt-1">Koramangala 5th</span>
            </Card>
          </div>
        </div>

        {/* Right Column: Live Map View */}
        <div className="lg:col-span-7 h-[420px] lg:h-[580px]">
          <MapView
            pickup={pickupLocation}
            destination={destinationLocation}
            activeRide={activeRide}
            className="h-full rounded-3xl border border-zinc-800"
          />
        </div>
      </div>

      <RatingModal
        isOpen={Boolean(ratingRide)}
        onClose={() => setRatingRide(null)}
        onSubmit={handleSubmitRating}
        ride={ratingRide}
        loading={submittingRating}
      />
    </div>
  );
};

export default RiderDashboard;
