import React from 'react';
import { LeafletMap } from './LeafletMap';

export const MapView = ({
  pickup,
  destination,
  driverLocation,
  nearbyDrivers = [],
  onMapClick,
  height = '100%',
  className = '',
}) => {
  return (
    <div className={`relative w-full h-full min-h-[300px] overflow-hidden ${className}`}>
      <LeafletMap
        pickup={pickup}
        destination={destination}
        driverLocation={driverLocation}
        nearbyDrivers={nearbyDrivers}
        onMapClick={onMapClick}
        height={height}
      />
    </div>
  );
};

export default MapView;
