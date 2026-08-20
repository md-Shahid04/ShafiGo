import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setPickupLocation,
  setDestinationLocation,
  swapLocations,
} from '../../store/locationSlice';
import { MapPin, Navigation, ArrowUpDown, Search, Building2 } from 'lucide-react';

const INDIAN_PRESETS = [
  // Bengaluru
  { city: 'Bengaluru', label: 'Koramangala 5th Block', address: 'Koramangala 5th Block, Bengaluru', lat: 12.9352, lng: 77.6245 },
  { city: 'Bengaluru', label: 'Indiranagar 100ft Rd', address: 'Indiranagar 100ft Road, Bengaluru', lat: 12.9784, lng: 77.6408 },
  { city: 'Bengaluru', label: 'Kempegowda Airport (BLR)', address: 'Kempegowda Intl Airport (BLR), Devanahalli', lat: 13.1986, lng: 77.7066 },
  { city: 'Bengaluru', label: 'Whitefield ITPL', address: 'ITPL Main Rd, Whitefield, Bengaluru', lat: 12.9863, lng: 77.7308 },
  { city: 'Bengaluru', label: 'Electronic City Phase 1', address: 'Electronic City Phase 1, Bengaluru', lat: 12.8452, lng: 77.6602 },
  { city: 'Bengaluru', label: 'MG Road Metro Station', address: 'MG Road, Shivaji Nagar, Bengaluru', lat: 12.9756, lng: 77.6097 },
  
  // Mumbai
  { city: 'Mumbai', label: 'Bandra Kurla Complex (BKC)', address: 'BKC G Block, Bandra East, Mumbai', lat: 19.0657, lng: 72.8687 },
  { city: 'Mumbai', label: 'Chhatrapati Shivaji Airport (BOM)', address: 'CSMIA Terminal 2, Andheri East, Mumbai', lat: 19.0896, lng: 72.8656 },
  { city: 'Mumbai', label: 'Marine Drive / Nariman Pt', address: 'Marine Drive, Churchgate, Mumbai', lat: 18.9438, lng: 72.8232 },
  { city: 'Mumbai', label: 'Gateway of India', address: 'Apollo Bandar, Colaba, Mumbai', lat: 18.9220, lng: 72.8347 },

  // Delhi NCR
  { city: 'Delhi NCR', label: 'Connaught Place (CP)', address: 'Connaught Place Inner Circle, New Delhi', lat: 28.6304, lng: 77.2177 },
  { city: 'Delhi NCR', label: 'IGI Airport Terminal 3 (DEL)', address: 'IGI Airport T3, New Delhi', lat: 28.5562, lng: 77.1000 },
  { city: 'Delhi NCR', label: 'Cyber Hub Gurgaon', address: 'DLF Cyber City, Phase 2, Gurugram', lat: 28.4949, lng: 77.0895 },
  { city: 'Delhi NCR', label: 'India Gate / Central Vista', address: 'Rajpath, India Gate, New Delhi', lat: 28.6129, lng: 77.2295 },
];

export const LocationPicker = () => {
  const dispatch = useDispatch();
  const { pickupLocation, destinationLocation } = useSelector((state) => state.location);
  const [selectedCity, setSelectedCity] = useState('Bengaluru');

  const filteredPresets = INDIAN_PRESETS.filter((p) => p.city === selectedCity);

  return (
    <div className="space-y-4">
      {/* City Filter Pills */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs overflow-x-auto">
        {['Bengaluru', 'Mumbai', 'Delhi NCR'].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setSelectedCity(c)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              selectedCity === c
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Pickup & Destination Input Stack */}
      <div className="relative space-y-3">
        {/* Connecting line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-zinc-700 pointer-events-none" />

        {/* Pickup Input */}
        <div className="relative flex items-center gap-3 p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 focus-within:border-white transition-colors">
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-black font-bold text-xs shrink-0 z-10">
            ●
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
              Pickup Point
            </span>
            <input
              type="text"
              value={pickupLocation?.address || ''}
              onChange={(e) =>
                dispatch(
                  setPickupLocation({
                    ...pickupLocation,
                    address: e.target.value,
                  })
                )
              }
              placeholder="Enter pickup spot in India..."
              className="w-full bg-transparent text-sm font-semibold text-white placeholder-zinc-500 focus:outline-none truncate"
            />
          </div>
        </div>

        {/* Swap Button in center */}
        <div className="flex justify-end pr-4 -my-2 relative z-20">
          <button
            type="button"
            onClick={() => dispatch(swapLocations())}
            className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-all shadow-md active:rotate-180"
            title="Swap Locations"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Destination Input */}
        <div className="relative flex items-center gap-3 p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 focus-within:border-white transition-colors">
          <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold text-xs shrink-0 z-10">
            ■
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
              Dropoff Destination
            </span>
            <input
              type="text"
              value={destinationLocation?.address || ''}
              onChange={(e) =>
                dispatch(
                  setDestinationLocation({
                    ...destinationLocation,
                    address: e.target.value,
                  })
                )
              }
              placeholder="Where to in India?"
              className="w-full bg-transparent text-sm font-semibold text-white placeholder-zinc-500 focus:outline-none truncate"
            />
          </div>
        </div>
      </div>

      {/* Indian Landmark Quick Presets */}
      <div className="space-y-2 pt-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-zinc-300" />
          Popular {selectedCity} Hubs
        </span>
        <div className="grid grid-cols-2 gap-2">
          {filteredPresets.slice(0, 4).map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (!pickupLocation.address || pickupLocation.address.includes('Airport')) {
                  dispatch(setPickupLocation({ address: p.address, lat: p.lat, lng: p.lng }));
                } else {
                  dispatch(setDestinationLocation({ address: p.address, lat: p.lat, lng: p.lng }));
                }
              }}
              className="p-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 text-left transition-colors text-[11px] truncate group"
            >
              <span className="block font-bold text-zinc-200 group-hover:text-white truncate">
                {p.label}
              </span>
              <span className="block text-[9px] text-zinc-500 truncate">
                Set as {pickupLocation.address ? 'Dropoff' : 'Pickup'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
