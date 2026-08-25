import React from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';

export const PickupMarker = ({ position, address = 'Pickup Location', title = 'Pickup' }) => {
  if (!position || position.lat == null || position.lng == null) return null;

  return (
    <AdvancedMarker position={{ lat: position.lat, lng: position.lng }} title={title}>
      <div className="relative flex items-center justify-center group cursor-pointer">
        {/* Animated pulse ring */}
        <span className="absolute w-8 h-8 rounded-full bg-white/30 animate-ping" />
        
        {/* Pin Container */}
        <div className="relative z-10 w-9 h-9 rounded-2xl bg-black border-2 border-white text-white flex items-center justify-center shadow-2xl transition-transform transform group-hover:scale-110">
          <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-black" />
          </div>
        </div>

        {/* Floating Label */}
        <div className="absolute top-10 whitespace-nowrap px-2.5 py-1 rounded-xl bg-black/90 text-white text-[11px] font-bold border border-zinc-700 shadow-xl opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none">
          {address || 'Pickup Point'}
        </div>
      </div>
    </AdvancedMarker>
  );
};

export default PickupMarker;
