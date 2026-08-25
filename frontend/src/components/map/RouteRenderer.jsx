import React, { useEffect, useState, useRef } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

export const RouteRenderer = ({
  pickup,
  destination,
  onRouteCalculated,
  strokeColor = '#FFFFFF',
  strokeWeight = 5,
}) => {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const prevRouteKeyRef = useRef('');

  // Initialize DirectionsRenderer and DirectionsService
  useEffect(() => {
    if (!routesLib || !map) return;

    const renderer = new routesLib.DirectionsRenderer({
      map,
      suppressMarkers: true, // We render our own custom AdvancedMarkers
      polylineOptions: {
        strokeColor,
        strokeOpacity: 0.9,
        strokeWeight,
      },
    });

    const service = new routesLib.DirectionsService();

    setDirectionsRenderer(renderer);
    setDirectionsService(service);

    return () => {
      renderer.setMap(null);
    };
  }, [routesLib, map, strokeColor, strokeWeight]);

  // Compute driving route when pickup or destination coordinates change
  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;
    if (!pickup?.lat || !pickup?.lng || !destination?.lat || !destination?.lng) {
      directionsRenderer.set('directions', null);
      return;
    }

    const routeKey = `${pickup.lat.toFixed(5)},${pickup.lng.toFixed(5)}->${destination.lat.toFixed(5)},${destination.lng.toFixed(5)}`;
    if (routeKey === prevRouteKeyRef.current) return;
    prevRouteKeyRef.current = routeKey;

    const origin = { lat: pickup.lat, lng: pickup.lng };
    const dest = { lat: destination.lat, lng: destination.lng };

    directionsService.route(
      {
        origin,
        destination: dest,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false,
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK && response) {
          directionsRenderer.setDirections(response);

          const route = response.routes[0];
          if (route && route.legs && route.legs[0]) {
            const leg = route.legs[0];
            const distanceKm = leg.distance ? leg.distance.value / 1000 : 0;
            const durationMinutes = leg.duration ? Math.ceil(leg.duration.value / 60) : 0;

            if (onRouteCalculated) {
              onRouteCalculated({
                distanceKm: parseFloat(distanceKm.toFixed(2)),
                durationMinutes,
                distanceText: leg.distance?.text,
                durationText: leg.duration?.text,
                startAddress: leg.start_address,
                endAddress: leg.end_address,
              });
            }
          }
        } else {
          console.warn('Google Directions request failed:', status);
        }
      }
    );
  }, [directionsService, directionsRenderer, pickup?.lat, pickup?.lng, destination?.lat, destination?.lng, onRouteCalculated]);

  return null;
};

export default RouteRenderer;
