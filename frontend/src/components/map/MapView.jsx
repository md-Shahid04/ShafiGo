import React from 'react';
import { GoogleMapView } from './GoogleMapView';

export const MapView = ({
  pickup,
  destination,
  driverLocation,
  nearbyDrivers = [],
  activeRide,
  onMapClick,
  onRouteCalculated,
  height = '100%',
  className = '',
}) => {
  return (
    <GoogleMapView
      pickup={pickup}
      destination={destination}
      driverLocation={driverLocation}
      nearbyDrivers={nearbyDrivers}
      activeRide={activeRide}
      onMapClick={onMapClick}
      onRouteCalculated={onRouteCalculated}
      height={height}
      className={className}
    />
  );
};

export default MapView;
