import React, { useEffect, useState } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { MapPin, Navigation, Clock, User, Check, X, Shield } from 'lucide-react';

export const IncomingRequestModal = ({
  request,
  onAccept,
  onReject,
  loading = false,
}) => {
  if (!request) return null;

  const [timeLeft, setTimeLeft] = useState(25);

  useEffect(() => {
    setTimeLeft(25);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onReject(request.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [request?.id]);

  const percentage = (timeLeft / 25) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <Card className="w-full max-w-lg p-6 bg-zinc-950 border border-white/20 shadow-2xl space-y-5">
        {/* Top Header & Countdown Timer */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 block">
              New Trip Dispatch
            </span>
            <h3 className="text-xl font-black text-white">
              ₹{request.estimatedFare ? request.estimatedFare.toFixed(2) : '0.00'}
            </h3>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-white font-mono">{timeLeft}s</span>
            <span className="text-[10px] text-zinc-500 block uppercase font-bold">Auto Expires</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Rider & Vehicle Type */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-sm">
              {request.rider?.fullName?.charAt(0) || 'R'}
            </div>
            <div>
              <span className="font-extrabold text-white block text-sm">
                {request.rider?.fullName || 'Rider'}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">Verified Rider</span>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-zinc-800 text-white font-bold text-xs uppercase border border-zinc-700">
            {request.vehicleType}
          </span>
        </div>

        {/* Route Details */}
        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-white mt-1 shrink-0" />
            <div>
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">Pickup</span>
              <span className="text-zinc-200 font-semibold">{request.pickupAddress}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2.5 h-2.5 rounded-sm bg-zinc-500 mt-1 shrink-0" />
            <div>
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">Dropoff</span>
              <span className="text-zinc-200 font-semibold">{request.destinationAddress}</span>
            </div>
          </div>
        </div>

        {/* Distance and ETA */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center text-xs">
          <div>
            <span className="text-[10px] text-zinc-500 block uppercase font-bold">Total Trip Distance</span>
            <span className="font-black text-white">{request.distanceKm} km</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block uppercase font-bold">Est. Duration</span>
            <span className="font-black text-white">~{request.estimatedDurationMinutes} mins</span>
          </div>
        </div>

        {/* Accept / Decline Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            size="lg"
            variant="outline"
            icon={X}
            onClick={() => onReject(request.id)}
            disabled={loading}
          >
            Decline
          </Button>

          <Button
            size="lg"
            variant="primary"
            icon={Check}
            onClick={() => onAccept(request.id)}
            loading={loading}
            className="shadow-xl"
          >
            Accept Ride
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default IncomingRequestModal;
