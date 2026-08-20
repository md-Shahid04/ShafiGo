import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LocationPicker } from '../components/map/LocationPicker';
import { VehicleSelector } from '../components/rider/VehicleSelector';
import { FareEstimateCard } from '../components/rider/FareEstimateCard';
import { MapView } from '../components/map/MapView';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { rideApi } from '../api/rideApi';
import { useSelector } from 'react-redux';
import {
  Zap,
  ShieldCheck,
  Clock,
  Car,
  Bike,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Navigation,
  KeyRound,
  Users,
  MapPin,
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, login } = useAuth();
  const { pickupLocation, destinationLocation } = useSelector((state) => state.location);

  const [selectedVehicle, setSelectedVehicle] = useState('SEDAN');
  const [estimate, setEstimate] = useState(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);

  const handleCalculateEstimate = async () => {
    setLoadingEstimate(true);
    try {
      const res = await rideApi.estimateRide({
        pickupLatitude: pickupLocation.lat,
        pickupLongitude: pickupLocation.lng,
        destinationLatitude: destinationLocation.lat,
        destinationLongitude: destinationLocation.lng,
      });
      if (res.success) {
        setEstimate(res.data);
      }
    } catch (e) {
      console.error('Estimation error', e);
    } finally {
      setLoadingEstimate(false);
    }
  };

  const handleQuickLogin = async (email, password) => {
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-white text-xs font-extrabold tracking-wide">
                <span>✦</span>
                Next-Gen Urban Transit in India
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
                Go anywhere, effortlessly with{' '}
                <span className="underline decoration-zinc-500 underline-offset-8">
                  SwiftRide
                </span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Book autos, bikes, sedans, and SUVs across major Indian metros with upfront transparent fares, verified driver partners, and real-time GPS tracking.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Button
                  size="lg"
                  icon={ArrowRight}
                  onClick={() => navigate(isAuthenticated ? '/rider/book' : '/register')}
                >
                  {isAuthenticated ? 'Book a Ride Now' : 'Ride with SwiftRide'}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  icon={Car}
                  onClick={() => navigate('/driver/register')}
                >
                  Drive & Earn in India
                </Button>
              </div>

              {/* Trust Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800/80 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <h4 className="text-xl font-black text-white">4.9 ★</h4>
                  <p className="text-xs text-zinc-400">Driver Rating</p>
                </div>
                <div>
                  <h4 className="text-xl font-black text-white">&lt; 3 mins</h4>
                  <p className="text-xs text-zinc-400">Avg Pickup BLR</p>
                </div>
                <div>
                  <h4 className="text-xl font-black text-white">100%</h4>
                  <p className="text-xs text-zinc-400">Verified Fleet</p>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Quick Fare Estimator */}
            <div className="lg:col-span-6">
              <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-zinc-800 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-white">Instant Fare Calculator</h3>
                    <p className="text-xs text-zinc-400">Select pickup and dropoff hubs across Indian cities</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-black">
                    <Navigation className="w-4 h-4" />
                  </div>
                </div>

                <LocationPicker />

                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={handleCalculateEstimate}
                    loading={loadingEstimate}
                  >
                    Calculate Route & Fare
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate(isAuthenticated ? '/rider/book' : '/login')}
                  >
                    Book This Ride
                  </Button>
                </div>

                {estimate && (
                  <div className="space-y-4 animate-fade-in">
                    <VehicleSelector
                      selectedType={selectedVehicle}
                      onSelectType={setSelectedVehicle}
                      estimates={estimate.estimatedFares}
                      durationMinutes={estimate.estimatedDurationMinutes}
                    />
                    <FareEstimateCard estimate={estimate} selectedType={selectedVehicle} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Quick Accounts Test Bar */}
      <section className="py-6 bg-zinc-950 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-black shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">1-Click Test Accounts (India)</h4>
                <p className="text-xs text-zinc-400">Instant login as Rider (Bengaluru), Driver (Sedan/SUV/Bike), or Admin</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => handleQuickLogin('rider1@swiftride.com', 'Rider@12345')}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-white hover:text-black border border-zinc-700 text-white text-xs font-bold transition-all"
              >
                👤 Test Rider (Rahul S.)
              </button>
              <button
                onClick={() => handleQuickLogin('driver1@swiftride.com', 'Driver@12345')}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-white hover:text-black border border-zinc-700 text-white text-xs font-bold transition-all"
              >
                🚘 Test Driver (Amit P. - SwiftGo)
              </button>
              <button
                onClick={() => handleQuickLogin('admin@swiftride.com', 'Admin@12345')}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-white hover:text-black border border-zinc-700 text-white text-xs font-bold transition-all"
              >
                ⚡ Platform Admin
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-white">
            Built for modern Indian urban transit
          </h2>
          <p className="text-sm text-zinc-400">
            Speed, safety, transparent pricing, and sub-second dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-black">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Sub-Second Dispatch</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Powered by Spring STOMP WebSockets for instant auto/cab driver dispatch across Indian metro corridors.
            </p>
          </Card>

          <Card className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Pessimistic Concurrency Lock</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Strict transactional locking guarantees each trip is claimed by exactly one driver partner without double-bookings.
            </p>
          </Card>

          <Card className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-black">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">SwiftMoto to SwiftPremier</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Select between quick two-wheelers, economical SwiftGo sedans, and executive SwiftPremier SUVs with upfront INR pricing.
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800 bg-black py-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-zinc-500 space-y-2">
          <p className="font-extrabold text-zinc-300">SwiftRide India — Ride-Hailing Platform MVP</p>
          <p>© {new Date().getFullYear()} SwiftRide. Bengaluru • Mumbai • Delhi NCR • Hyderabad.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
