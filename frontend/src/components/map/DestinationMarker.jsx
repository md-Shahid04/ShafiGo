import React from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';

export const DestinationMarker = ({ position, address = 'Destination', title = 'Destination' }) => {
  if (!position || position.lat == null || position.lng == null) return null;

  return (
    <AdvancedMarker position={{ lat: position.lat, lng: position.lng }} title={title}>
      <div className="relative flex items-center justify-center group cursor-pointer">
        {/* Pin Container */}
        <div className="relative z-10 w-9 h-9 rounded-2xl bg-white border-2 border-black text-black flex items-center justify-center shadow-2xl transition-transform transform group-hover:scale-110">
          {/* Destination Icon / Square */}
          <div className="w-3.5 h-3.5 bg-black rounded-sm" />
        </div>

        {/* Floating Label */}
        <div className="absolute top-10 whitespace-nowrap px-2.5 py-1 rounded-xl bg-zinc-900/95 text-zinc-100 text-[11px] font-bold border border-zinc-700 shadow-xl opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none">
          {address || 'Destination Point'}
        </div>
      </div>
    </AdvancedMarker>
  );
};

export default DestinationMarker;
