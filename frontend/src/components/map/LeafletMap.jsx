import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Create custom stylish SVG icons for map
const createCustomIcon = (color, type = 'pin') => {
  let svgContent = '';
  if (type === 'car') {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="${color}" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-lg">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
        <circle cx="7" cy="17" r="2" fill="#000000"/>
        <path d="M9 17h6"/>
        <circle cx="17" cy="17" r="2" fill="#000000"/>
      </svg>
    `;
  } else if (type === 'pickup') {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="1.5" class="drop-shadow-md">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3" fill="#000000"/>
      </svg>
    `;
  } else {
    // Destination pin
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="1.5" class="drop-shadow-md">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3" fill="#ffffff"/>
      </svg>
    `;
  }

  return L.divIcon({
    html: `<div class="flex items-center justify-center -translate-x-1/2 -translate-y-1/2">${svgContent}</div>`,
    className: 'custom-leaflet-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

const pickupIcon = createCustomIcon('#FFFFFF', 'pickup');
const destIcon = createCustomIcon('#A1A1AA', 'dest');
const driverIcon = createCustomIcon('#FFFFFF', 'car');

// Map auto-bounds updater
const MapAutoRecenter = ({ pickup, destination, driverLocation }) => {
  const map = useMap();

  useEffect(() => {
    const points = [];
    if (pickup && pickup.lat && pickup.lng) points.push([pickup.lat, pickup.lng]);
    if (destination && destination.lat && destination.lng) points.push([destination.lat, destination.lng]);
    if (driverLocation && driverLocation.lat && driverLocation.lng) points.push([driverLocation.lat, driverLocation.lng]);

    if (points.length === 1) {
      map.setView(points[0], 14);
    } else if (points.length > 1) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [pickup, destination, driverLocation, map]);

  return null;
};

// Map click handler for interactive coordinate selection
const MapClickHandler = ({ onMapClick }) => {
  const map = useMap();
  useEffect(() => {
    if (!onMapClick) return;
    const handleClick = (e) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    };
    map.on('click', handleClick);
    return () => map.off('click', handleClick);
  }, [map, onMapClick]);
  return null;
};

export const LeafletMap = ({
  pickup,
  destination,
  driverLocation,
  nearbyDrivers = [],
  onMapClick,
  height = '100%',
  className = '',
}) => {
  const defaultCenter = [12.9352, 77.6245]; // Bengaluru, India
  const initialCenter = pickup?.lat ? [pickup.lat, pickup.lng] : defaultCenter;

  // Generate route polyline coords if both pickup & destination exist
  const routePolyline =
    pickup?.lat && destination?.lat
      ? [
          [pickup.lat, pickup.lng],
          // Intermediate waypoint for curved path
          [
            (pickup.lat + destination.lat) / 2 + 0.002,
            (pickup.lng + destination.lng) / 2 - 0.002,
          ],
          [destination.lat, destination.lng],
        ]
      : null;

  return (
    <div style={{ height }} className={`relative w-full rounded-3xl overflow-hidden ${className}`}>
      <MapContainer
        center={initialCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full dark-tiles"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Pickup Marker */}
        {pickup?.lat && pickup?.lng && (
          <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon}>
            <Popup>
              <div className="text-xs">
                <span className="font-bold text-white block">Pickup Point</span>
                <span className="text-zinc-300">{pickup.address || 'Pickup Point'}</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {destination?.lat && destination?.lng && (
          <Marker position={[destination.lat, destination.lng]} icon={destIcon}>
            <Popup>
              <div className="text-xs">
                <span className="font-bold text-zinc-300 block">Dropoff Destination</span>
                <span className="text-zinc-400">{destination.address || 'Destination Point'}</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Assigned Active Driver Marker */}
        {driverLocation?.lat && driverLocation?.lng && (
          <Marker position={[driverLocation.lat, driverLocation.lng]} icon={driverIcon}>
            <Popup>
              <div className="text-xs">
                <span className="font-bold text-white block">Driver Partner Live Location</span>
                <span className="text-zinc-400">En route to your location</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Nearby Available Drivers */}
        {nearbyDrivers.map((driver, index) => (
          driver.currentLatitude && driver.currentLongitude ? (
            <Marker
              key={driver.id || index}
              position={[driver.currentLatitude, driver.currentLongitude]}
              icon={driverIcon}
            >
              <Popup>
                <div className="text-xs">
                  <span className="font-bold text-white block">
                    {driver.user?.fullName || 'ShafiGo Driver'}
                  </span>
                  <span className="text-zinc-400">
                    ⭐ {driver.rating} • {driver.activeVehicle?.brand || 'ShafiGo Cab'}
                  </span>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}

        {/* Polyline Route */}
        {routePolyline && (
          <Polyline
            positions={routePolyline}
            pathOptions={{
              color: '#FFFFFF',
              weight: 4,
              opacity: 0.9,
              dashArray: '8, 8',
              lineCap: 'round',
            }}
          />
        )}

        <MapAutoRecenter
          pickup={pickup}
          destination={destination}
          driverLocation={driverLocation}
        />

        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
