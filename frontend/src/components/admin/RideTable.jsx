import React from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { MapPin, Clock, Eye, User, Car } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RideTable = ({ rides = [], isAdmin = true }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-zinc-300">
        <thead className="bg-zinc-950 text-[10px] uppercase font-bold text-zinc-400 border-b border-zinc-800">
          <tr>
            <th className="px-4 py-3">Ride ID</th>
            <th className="px-4 py-3">Rider</th>
            <th className="px-4 py-3">Driver</th>
            <th className="px-4 py-3">Route (Pickup → Dropoff)</th>
            <th className="px-4 py-3">Fare</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/80">
          {rides.map((ride) => (
            <tr key={ride.id} className="hover:bg-zinc-900/60 transition-colors">
              <td className="px-4 py-3.5 font-mono font-black text-white">
                #{ride.id}
              </td>
              <td className="px-4 py-3.5 font-semibold text-white">
                {ride.rider?.fullName || 'Rider'}
              </td>
              <td className="px-4 py-3.5">
                {ride.driver ? (
                  <div>
                    <span className="font-semibold text-white block">
                      {ride.driver.user?.fullName}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {ride.vehicle?.registrationNumber || ride.vehicleType}
                    </span>
                  </div>
                ) : (
                  <span className="text-zinc-400 text-[11px] font-medium italic">Searching...</span>
                )}
              </td>
              <td className="px-4 py-3.5 max-w-xs">
                <div className="flex items-center gap-1.5 text-zinc-200 truncate">
                  <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                  <span className="truncate">{ride.pickupAddress}</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400 truncate mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  <span className="truncate">{ride.destinationAddress}</span>
                </div>
              </td>
              <td className="px-4 py-3.5 font-black text-white">
                ₹{ride.finalFare ? ride.finalFare.toFixed(2) : ride.estimatedFare?.toFixed(2)}
              </td>
              <td className="px-4 py-3.5">
                <Badge status={ride.status} size="xs" />
              </td>
              <td className="px-4 py-3.5 text-right text-zinc-400 text-[11px]">
                {ride.createdAt ? new Date(ride.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RideTable;
