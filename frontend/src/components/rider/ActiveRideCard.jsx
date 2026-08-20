import React from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import {
  Car,
  Bike,
  Shield,
  Star,
  Phone,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export const ActiveRideCard = ({ ride, onCancelRide, onOpenRating }) => {
  if (!ride) return null;

  const isCompleted = ride.status === 'RIDE_COMPLETED';
  const isDriverAssigned =
    ride.status === 'DRIVER_ACCEPTED' ||
    ride.status === 'DRIVER_ARRIVING' ||
    ride.status === 'DRIVER_ARRIVED' ||
    ride.status === 'RIDE_STARTED';

  return (
    <Card className="p-5 sm:p-6 bg-zinc-950 border border-zinc-700/80 shadow-2xl space-y-5 animate-slide-up">
      {/* Header Status Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 block">
            Trip Reference
          </span>
          <h3 className="text-base font-black text-white">
            Booking #{ride.id}
          </h3>
        </div>
        <Badge status={ride.status} size="sm" />
      </div>

      {/* Driver & Vehicle Information */}
      {isDriverAssigned && ride.driver && (
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-base border border-white">
                {ride.driver.user?.firstName?.charAt(0) || 'D'}
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">
                  {ride.driver.user?.fullName}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5">
                  <span className="flex items-center text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                    {ride.driver.rating || 5.0}
                  </span>
                  <span>•</span>
                  <span>{ride.driver.totalRides || 0} trips</span>
                </div>
              </div>
            </div>

            {ride.driver.user?.phone && (
              <a
                href={`tel:${ride.driver.user.phone}`}
                className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white flex items-center justify-center transition-colors"
                title="Call Driver"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Vehicle Plate Info */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">
                {ride.vehicle?.brand} {ride.vehicle?.model} ({ride.vehicle?.color})
              </span>
              <span className="text-[10px] text-zinc-400">{ride.vehicleType}</span>
            </div>
            <span className="font-mono text-xs font-black tracking-wider bg-black text-white px-3 py-1.5 rounded-xl border border-zinc-700">
              {ride.vehicle?.registrationNumber || 'KA-01-AB-1234'}
            </span>
          </div>
        </div>
      )}

      {/* Route Addresses */}
      <div className="space-y-3 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-white mt-1 shrink-0" />
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">Pickup</span>
            <span className="text-zinc-200 font-medium">{ride.pickupAddress}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-2.5 h-2.5 rounded-sm bg-zinc-500 mt-1 shrink-0" />
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">Destination</span>
            <span className="text-zinc-200 font-medium">{ride.destinationAddress}</span>
          </div>
        </div>
      </div>

      {/* Fare & Timing summary */}
      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs">
        <div>
          <span className="text-zinc-400 block text-[10px] uppercase font-bold">Total Fare</span>
          <span className="text-lg font-black text-white">
            ₹{ride.finalFare ? ride.finalFare.toFixed(2) : ride.estimatedFare?.toFixed(2)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-zinc-400 block text-[10px] uppercase font-bold">Distance</span>
          <span className="text-xs font-extrabold text-zinc-200">
            {ride.distanceKm} km (~{ride.estimatedDurationMinutes} min)
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2">
        {isCompleted ? (
          <Button fullWidth size="lg" onClick={onOpenRating} icon={Star}>
            Rate Your Driver
          </Button>
        ) : (
          ride.status !== 'RIDE_STARTED' && (
            <Button
              fullWidth
              variant="outline"
              size="md"
              onClick={onCancelRide}
              className="hover:border-rose-500 hover:text-rose-400"
            >
              Cancel Ride
            </Button>
          )
        )}
      </div>
    </Card>
  );
};

export default ActiveRideCard;
