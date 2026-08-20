import React, { useEffect, useState } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Car, Navigation, Shield, X, Radio } from 'lucide-react';

export const DriverSearchModal = ({ isOpen, onCancel, ride }) => {
  if (!isOpen) return null;

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <Card className="w-full max-w-md p-6 sm:p-8 bg-zinc-950 border border-zinc-800 shadow-2xl text-center space-y-6">
        {/* Radar Ping Animation */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-60" />
          <div className="absolute inset-3 rounded-full border border-white/40 animate-pulse" />
          <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl shadow-white/20">
            <Car className="w-8 h-8 text-black" />
          </div>
        </div>

        {/* Searching text */}
        <div className="space-y-1.5">
          <h3 className="text-xl font-black text-white">
            Connecting with nearby drivers...
          </h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Broadcasting your request to verified drivers in the area.
          </p>
        </div>

        {/* Dispatch details */}
        {ride && (
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-left space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="text-zinc-400 font-bold uppercase text-[10px]">Tier</span>
              <span className="font-extrabold text-white">{ride.vehicleType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 font-bold uppercase text-[10px]">Estimated Fare</span>
              <span className="font-black text-white text-sm">
                ₹{ride.estimatedFare ? ride.estimatedFare.toFixed(2) : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 font-bold uppercase text-[10px]">Time Elapsed</span>
              <span className="font-mono font-bold text-zinc-300">{seconds}s</span>
            </div>
          </div>
        )}

        {/* Cancel Button */}
        <Button
          fullWidth
          variant="outline"
          size="lg"
          icon={X}
          onClick={onCancel}
          className="hover:border-rose-500 hover:text-rose-400"
        >
          Cancel Request
        </Button>
      </Card>
    </div>
  );
};

export default DriverSearchModal;
