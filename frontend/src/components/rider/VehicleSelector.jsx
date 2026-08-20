import React from 'react';
import { Bike, Car, Shield, Sparkles, Zap } from 'lucide-react';

const VEHICLE_TIERS = [
  {
    type: 'BIKE',
    name: 'ShafiMoto',
    description: 'Fast, affordable two-wheeler ride',
    icon: Bike,
    capacity: '1 Person',
    badge: 'Popular',
  },
  {
    type: 'SEDAN',
    name: 'ShafiGo',
    description: 'Comfortable AC sedan & hatchback',
    icon: Car,
    capacity: '4 Seats',
    badge: 'Top Pick',
  },
  {
    type: 'SUV',
    name: 'ShafiPremier',
    description: 'Spacious premium SUV with top drivers',
    icon: Shield,
    capacity: '6 Seats',
    badge: 'Executive',
  },
];

export const VehicleSelector = ({
  selectedType = 'SEDAN',
  onSelectType,
  estimates = {},
  durationMinutes = 15,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider px-1">
        <span>Available Ride Options</span>
        <span>Est. ~{durationMinutes} mins</span>
      </div>

      <div className="space-y-2">
        {VEHICLE_TIERS.map((tier) => {
          const isSelected = selectedType === tier.type;
          const fare = estimates[tier.type];
          const Icon = tier.icon;

          return (
            <div
              key={tier.type}
              onClick={() => onSelectType(tier.type)}
              className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border flex items-center justify-between ${
                isSelected
                  ? 'bg-white text-black border-white shadow-xl scale-[1.01]'
                  : 'bg-zinc-900/90 text-zinc-100 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-black text-white border-black'
                      : 'bg-zinc-800 text-zinc-200 border-zinc-700'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-sm font-extrabold ${
                        isSelected ? 'text-black' : 'text-white'
                      }`}
                    >
                      {tier.name}
                    </h4>
                    {tier.badge && (
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-black text-white'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {tier.badge}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-0.5 ${
                      isSelected ? 'text-zinc-700' : 'text-zinc-400'
                    }`}
                  >
                    {tier.description} • {tier.capacity}
                  </p>
                </div>
              </div>

              {/* Right Fare */}
              <div className="text-right pl-3">
                <div
                  className={`text-base font-black ${
                    isSelected ? 'text-black' : 'text-white'
                  }`}
                >
                  {fare ? `₹${fare.toFixed(2)}` : '—'}
                </div>
                <div
                  className={`text-[10px] font-bold ${
                    isSelected ? 'text-zinc-600' : 'text-zinc-400'
                  }`}
                >
                  Upfront Fare
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VehicleSelector;
