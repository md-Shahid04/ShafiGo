import React, { useEffect, useCallback } from 'react';
import {
  APIProvider,
  Map,
  useMap,
} from '@vis.gl/react-google-maps';
import { PickupMarker } from './PickupMarker';
import { DestinationMarker } from './DestinationMarker';
import { DriverMarker } from './DriverMarker';
import { RouteRenderer } from './RouteRenderer';
import { AlertTriangle } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Dark Uber-style Google Maps vector styling
const DARK_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#18181b' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#09090b' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#a1a1aa' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#71717a' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#131916' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#27272a' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1c1c20' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d4d4d8' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#3f3f46' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#27272a' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#27272a' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d4d4d8' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#09090b' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#52525b' }],
  },
];

// Inner map bounds controller
const MapBoundsController = ({ pickup, destination, driverLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const points = [];
    if (pickup?.lat != null && pickup?.lng != null) points.push(pickup);
    if (destination?.lat != null && destination?.lng != null) points.push(destination);
    if (driverLocation?.lat != null && driverLocation?.lng != null) points.push(driverLocation);

    if (points.length === 1) {
      map.setCenter(points[0]);
      map.setZoom(15);
    } else if (points.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      points.forEach((p) => bounds.extend(p));
      map.fitBounds(bounds, { top: 60, bottom: 60, left: 60, right: 60 });
    }
  }, [map, pickup?.lat, pickup?.lng, destination?.lat, destination?.lng, driverLocation?.lat, driverLocation?.lng]);

  return null;
};

// Map click event listener for interactive pin placement
const MapClickHandler = ({ onMapClick }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !onMapClick) return;

    const listener = map.addListener('click', (e) => {
      if (e.latLng) {
        onMapClick({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        });
      }
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map, onMapClick]);

  return null;
};

export const GoogleMapView = ({
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
  // Default center if no points (Bengaluru, India)
  const defaultCenter = { lat: 12.9352, lng: 77.6245 };
  const initialCenter = pickup?.lat != null ? { lat: pickup.lat, lng: pickup.lng } : defaultCenter;

  // Derive active driver position and telemetry from activeRide or props
  const activeDriverLat = activeRide?.driverCurrentLat ?? driverLocation?.lat;
  const activeDriverLng = activeRide?.driverCurrentLng ?? driverLocation?.lng;
  const activeDriverHeading = activeRide?.driverHeading ?? driverLocation?.heading ?? 0;
  const activeDriverName = activeRide?.driver?.user?.fullName || 'ShafiGo Driver';
  const activeDriverRating = activeRide?.driver?.rating || 4.9;
  const activeDriverVehicleType = activeRide?.vehicle?.vehicleType || 'SEDAN';

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div style={{ height }} className={`w-full rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center p-8 text-center space-y-3 ${className}`}>
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-black text-white">Google Maps API Key Required</h3>
        <p className="text-xs text-zinc-400 max-w-md">
          Please add <code className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-200 border border-zinc-800">VITE_GOOGLE_MAPS_API_KEY</code> to your <code className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-200 border border-zinc-800">frontend/.env</code> file to load real-time Google Maps.
        </p>
      </div>
    );
  }

  return (
    <div style={{ height }} className={`relative w-full rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl ${className}`}>
      <APIProvider
        apiKey={GOOGLE_MAPS_API_KEY}
        libraries={['places', 'routes', 'geometry']}
      >
        <Map
          defaultCenter={initialCenter}
          defaultZoom={13}
          mapId="DEMO_MAP_ID"
          styles={DARK_MAP_STYLES}
          disableDefaultUI={false}
          zoomControl={true}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
          className="w-full h-full"
          internalUsageAttributionIds={['gmp_git_agentskills_v1']}
        >
          {/* Pickup Marker */}
          {pickup?.lat != null && pickup?.lng != null && (
            <PickupMarker position={pickup} address={pickup.address} />
          )}

          {/* Destination Marker */}
          {destination?.lat != null && destination?.lng != null && (
            <DestinationMarker position={destination} address={destination.address} />
          )}

          {/* Assigned Active Driver Marker (Animated) */}
          {activeDriverLat != null && activeDriverLng != null && (
            <DriverMarker
              position={{ lat: activeDriverLat, lng: activeDriverLng }}
              heading={activeDriverHeading}
              driverName={activeDriverName}
              rating={activeDriverRating}
              vehicleType={activeDriverVehicleType}
              isAssigned={true}
            />
          )}

          {/* Available Nearby Fleet Markers (When not on active trip) */}
          {!activeRide && nearbyDrivers.map((driver, index) => {
            const lat = driver.currentLatitude || driver.currentLat;
            const lng = driver.currentLongitude || driver.currentLng;
            if (lat == null || lng == null) return null;

            return (
              <DriverMarker
                key={driver.id || index}
                position={{ lat, lng }}
                heading={driver.heading || 0}
                driverName={driver.user?.fullName || 'Nearby Driver'}
                rating={driver.rating || 4.9}
                vehicleType={driver.activeVehicle?.vehicleType || 'SEDAN'}
                isAssigned={false}
              />
            );
          })}

          {/* Real Google Driving Road Polyline */}
          {pickup?.lat != null && destination?.lat != null && (
            <RouteRenderer
              pickup={pickup}
              destination={destination}
              onRouteCalculated={onRouteCalculated}
              strokeColor="#FFFFFF"
              strokeWeight={4}
            />
          )}

          {/* Dynamic Auto-Bounds */}
          <MapBoundsController
            pickup={pickup}
            destination={destination}
            driverLocation={activeDriverLat ? { lat: activeDriverLat, lng: activeDriverLng } : null}
          />

          {/* Click Handler */}
          {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
        </Map>
      </APIProvider>
    </div>
  );
};

export default GoogleMapView;
