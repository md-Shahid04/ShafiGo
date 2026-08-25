import React, { useEffect, useRef, useState } from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { Car, Bike, Shield } from 'lucide-react';

export const DriverMarker = ({
  position,
  heading = 0,
  driverName = 'ShafiGo Driver',
  rating = 4.9,
  vehicleType = 'SEDAN',
  isAssigned = false,
}) => {
  const [currentPos, setCurrentPos] = useState(position);
  const prevPosRef = useRef(position);
  const targetPosRef = useRef(position);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  const prevHeadingRef = useRef(heading || 0);

  // Keep track of smooth heading
  const currentHeading = heading != null && heading !== 0 ? heading : prevHeadingRef.current;
  useEffect(() => {
    if (heading != null && heading !== 0) {
      prevHeadingRef.current = heading;
    }
  }, [heading]);

  // Smooth lerp coordinate interpolation when position changes
  useEffect(() => {
    if (!position || position.lat == null || position.lng == null) return;

    if (!prevPosRef.current) {
      prevPosRef.current = position;
      setCurrentPos(position);
      return;
    }

    const startLat = currentPos ? currentPos.lat : position.lat;
    const startLng = currentPos ? currentPos.lng : position.lng;
    const endLat = position.lat;
    const endLng = position.lng;

    // If movement is negligible, skip animation
    if (Math.abs(startLat - endLat) < 0.000001 && Math.abs(startLng - endLng) < 0.000001) {
      return;
    }

    const duration = 1200; // 1.2s smooth transition
    startTimeRef.current = performance.now();

    const animate = (time) => {
      const elapsed = time - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      const lat = startLat + (endLat - startLat) * ease;
      const lng = startLng + (endLng - startLng) * ease;

      setCurrentPos({ lat, lng });

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        prevPosRef.current = position;
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [position?.lat, position?.lng]);

  if (!currentPos || currentPos.lat == null || currentPos.lng == null) return null;

  const VehicleIcon = vehicleType === 'BIKE' ? Bike : vehicleType === 'SUV' ? Shield : Car;

  return (
    <AdvancedMarker position={{ lat: currentPos.lat, lng: currentPos.lng }} title={driverName}>
      <div className="relative flex items-center justify-center group cursor-pointer">
        {/* Halo for assigned active driver */}
        {isAssigned && (
          <span className="absolute w-12 h-12 rounded-full bg-white/20 animate-ping" />
        )}

        {/* Vehicle Container with Rotation */}
        <div
          style={{
            transform: `rotate(${currentHeading}deg)`,
            transition: 'transform 0.4s ease-out',
          }}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xl border-2 transition-all ${
            isAssigned
              ? 'bg-white text-black border-black scale-110'
              : 'bg-black text-white border-zinc-700 hover:scale-105'
          }`}
        >
          <VehicleIcon className="w-5 h-5" />
        </div>

        {/* Driver Badge Tooltip */}
        <div className="absolute -top-9 whitespace-nowrap px-2.5 py-1 rounded-xl bg-black/90 text-white text-[10px] font-extrabold border border-zinc-700 shadow-xl opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-1.5">
          <span>{driverName}</span>
          <span className="text-yellow-400">★ {rating ? rating.toFixed(1) : '5.0'}</span>
        </div>
      </div>
    </AdvancedMarker>
  );
};

export default DriverMarker;
