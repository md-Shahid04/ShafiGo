import React from 'react';
import { Card } from '../common/Card';
import { Route, Clock, ShieldCheck, Zap } from 'lucide-react';

export const FareEstimateCard = ({ estimate, selectedType = 'SEDAN' }) => {
  if (!estimate) return null;

  const fare = estimate.estimatedFares ? estimate.estimatedFares[selectedType] : null;

  return (
    <Card className="p-4 bg-zinc-950 border border-zinc-800 space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
        <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">
          Trip Fare Breakdown
        </span>
        <span className="text-xs font-bold text-white flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
          Fixed Route Price
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2 text-zinc-300">
          <Route className="w-4 h-4 text-zinc-400 shrink-0" />
          <span>Distance: <strong className="text-white">{estimate.distanceKm} km</strong></span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300">
          <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
          <span>Duration: <strong className="text-white">~{estimate.estimatedDurationMinutes} mins</strong></span>
        </div>
      </div>

      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">Total Estimated Amount</span>
          <span className="text-xl font-black text-white">
            {fare ? `₹${fare.toFixed(2)}` : '—'}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-zinc-400 block font-medium">Includes toll & GST estimates</span>
          <span className="text-[10px] font-bold text-white">No Hidden Surcharges</span>
        </div>
      </div>
    </Card>
  );
};

export default FareEstimateCard;
