import React, { useEffect, useState } from 'react';
import { rideApi } from '../../api/rideApi';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { RatingModal } from '../../components/rider/RatingModal';
import {
  Clock,
  MapPin,
  Car,
  Star,
  Receipt,
  RotateCw,
  Calendar,
} from 'lucide-react';

export const RideHistoryPage = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [ratingRide, setRatingRide] = useState(null);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    fetchRides(page);
  }, [page]);

  const fetchRides = async (pageNum) => {
    setLoading(true);
    try {
      const res = await rideApi.getMyRides(pageNum, 8);
      if (res.success) {
        setRides(res.data.content);
        setTotalPages(res.data.totalPages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async (ratingData) => {
    setSubmittingRating(true);
    try {
      await rideApi.rateDriver(ratingData.rideId, {
        rating: ratingData.rating,
        comment: ratingData.comment,
      });
      setRatingRide(null);
      fetchRides(page);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Your Trips</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Review past ShafiGo trips, fares, and receipts across India
          </p>
        </div>
      </div>

      {rides.length === 0 && !loading ? (
        <Card className="p-8 bg-zinc-950 border border-zinc-800">
          <EmptyState
            icon={Car}
            title="No Trips Recorded Yet"
            description="You haven't booked any rides with ShafiGo yet. Your trip history will appear here."
            actionText="Book First Ride"
            onAction={() => (window.location.href = '/rider/book')}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rides.map((ride) => (
            <Card
              key={ride.id}
              className="p-5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-white">
                    #{ride.id}
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-xs text-zinc-400">
                    {ride.createdAt
                      ? new Date(ride.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </span>
                </div>
                <Badge status={ride.status} size="xs" />
              </div>

              {/* Route */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-white mt-1 shrink-0" />
                  <span className="text-zinc-200 font-medium truncate">
                    {ride.pickupAddress}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-sm bg-zinc-500 mt-1 shrink-0" />
                  <span className="text-zinc-400 font-medium truncate">
                    {ride.destinationAddress}
                  </span>
                </div>
              </div>

              {/* Driver & Vehicle */}
              {ride.driver && (
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-[10px]">
                      {ride.driver.user?.firstName?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white">{ride.driver.user?.fullName}</div>
                      <div className="text-[10px] text-zinc-400">{ride.vehicle?.registrationNumber}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-[11px] text-zinc-300">
                    {ride.vehicle?.brand} {ride.vehicle?.model}
                  </div>
                </div>
              )}

              {/* Fare & Rating Action */}
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Fare Paid</span>
                  <span className="text-lg font-black text-white">
                    ₹{ride.finalFare ? ride.finalFare.toFixed(2) : ride.estimatedFare?.toFixed(2)}
                  </span>
                </div>

                {ride.status === 'RIDE_COMPLETED' && !ride.rating && (
                  <Button
                    size="sm"
                    variant="outline"
                    icon={Star}
                    onClick={() => setRatingRide(ride)}
                  >
                    Rate Trip
                  </Button>
                )}

                {ride.rating && (
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    Rated {ride.rating.rating}.0
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-xs font-bold text-zinc-400">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

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

export default RideHistoryPage;
