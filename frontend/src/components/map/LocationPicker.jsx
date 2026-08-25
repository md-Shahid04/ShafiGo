import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setPickupLocation,
  setDestinationLocation,
  setUserCurrentLocation,
  swapLocations,
} from '../../store/locationSlice';
import { showToast } from '../../store/uiSlice';
import { MapPin, Navigation, ArrowUpDown, Search, Building2, Loader2, X } from 'lucide-react';

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

  // Delhi NCR
  { city: 'Delhi NCR', label: 'Connaught Place (CP)', address: 'Connaught Place Inner Circle, New Delhi', lat: 28.6304, lng: 77.2177 },
  { city: 'Delhi NCR', label: 'IGI Airport Terminal 3 (DEL)', address: 'IGI Airport T3, New Delhi', lat: 28.5562, lng: 77.1000 },
  { city: 'Delhi NCR', label: 'Cyber Hub Gurgaon', address: 'DLF Cyber City, Phase 2, Gurugram', lat: 28.4949, lng: 77.0895 },
];

export const LocationPicker = () => {
  const dispatch = useDispatch();
  const { pickupLocation, destinationLocation } = useSelector((state) => state.location);
  const [selectedCity, setSelectedCity] = useState('Bengaluru');

  const [activeField, setActiveField] = useState(null); // 'pickup' | 'destination' | null
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [locatingUser, setLocatingUser] = useState(false);

  const autocompleteServiceRef = useRef(null);
  const geocoderRef = useRef(null);

  // Initialize Google Places Autocomplete Service & Geocoder
  useEffect(() => {
    const initServices = async () => {
      if (window.google && window.google.maps) {
        if (window.google.maps.places) {
          autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        }
        geocoderRef.current = new window.google.maps.Geocoder();
      }
    };

    if (window.google && window.google.maps) {
      initServices();
    } else {
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          initServices();
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  // Fetch Google Places predictions on query change
  useEffect(() => {
    if (!query || query.trim().length < 2 || !activeField) {
      setPredictions([]);
      return;
    }

    if (!autocompleteServiceRef.current) {
      return;
    }

    setLoadingPredictions(true);
    const debounceTimer = setTimeout(() => {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: 'in' }, // Focused on India
        },
        (results, status) => {
          setLoadingPredictions(false);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            setPredictions(results);
          } else {
            setPredictions([]);
          }
        }
      );
    }, 250);

    return () => clearTimeout(debounceTimer);
  }, [query, activeField]);

  // Handle selecting a place prediction from Google
  const handleSelectPrediction = (prediction) => {
    if (!geocoderRef.current) return;

    geocoderRef.current.geocode({ placeId: prediction.place_id }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const loc = results[0].geometry.location;
        const lat = loc.lat();
        const lng = loc.lng();
        const address = prediction.description;

        if (activeField === 'pickup') {
          dispatch(setPickupLocation({ address, lat, lng }));
        } else if (activeField === 'destination') {
          dispatch(setDestinationLocation({ address, lat, lng }));
        }
      }
      setActiveField(null);
      setQuery('');
      setPredictions([]);
    });
  };

  // Real Browser GPS Geolocation for Pickup
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      dispatch(showToast({ type: 'error', message: 'Geolocation is not supported by your browser' }));
      return;
    }

    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        dispatch(setUserCurrentLocation({ lat, lng }));

        // Reverse geocode to get formatted address
        if (geocoderRef.current) {
          geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
            setLocatingUser(false);
            if (status === 'OK' && results && results[0]) {
              const address = results[0].formatted_address;
              dispatch(setPickupLocation({ address, lat, lng }));
              dispatch(showToast({ type: 'success', message: 'Current GPS location set as Pickup' }));
            } else {
              dispatch(setPickupLocation({ address: 'Current GPS Location', lat, lng }));
            }
          });
        } else {
          setLocatingUser(false);
          dispatch(setPickupLocation({ address: 'Current GPS Location', lat, lng }));
        }
      },
      (err) => {
        setLocatingUser(false);
        console.warn('Geolocation error:', err);
        dispatch(showToast({ type: 'error', message: `GPS error: ${err.message}. Please select a location manually.` }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  };

  const filteredPresets = INDIAN_PRESETS.filter((p) => p.city === selectedCity);

  return (
    <div className="space-y-4">
      {/* City Filter Pills & GPS Locator */}
      <div className="flex items-center justify-between gap-2">
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

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={locatingUser}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 text-white text-xs font-bold transition-all shrink-0"
          title="Use your real device GPS location"
        >
          {locatingUser ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
          )}
          <span>{locatingUser ? 'Locating...' : 'My GPS'}</span>
        </button>
      </div>

      {/* Pickup & Destination Input Stack */}
      <div className="relative space-y-3">
        {/* Connecting line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-zinc-700 pointer-events-none" />

        {/* Pickup Input */}
        <div
          className={`relative flex items-center gap-3 p-3 rounded-2xl bg-zinc-900/90 border transition-all ${
            activeField === 'pickup' ? 'border-white ring-2 ring-white/20' : 'border-zinc-800'
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-black font-bold text-xs shrink-0 z-10">
            ●
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
              Pickup Point
            </span>
            <input
              type="text"
              value={activeField === 'pickup' ? query : pickupLocation?.address || ''}
              onFocus={() => {
                setActiveField('pickup');
                setQuery(pickupLocation?.address || '');
              }}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pickup location with Google Places..."
              className="w-full bg-transparent text-sm font-semibold text-white placeholder-zinc-500 focus:outline-none truncate"
            />
          </div>
          {activeField === 'pickup' && query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setActiveField(null);
              }}
              className="p-1 rounded-lg text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
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
        <div
          className={`relative flex items-center gap-3 p-3 rounded-2xl bg-zinc-900/90 border transition-all ${
            activeField === 'destination' ? 'border-white ring-2 ring-white/20' : 'border-zinc-800'
          }`}
        >
          <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold text-xs shrink-0 z-10">
            ■
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
              Dropoff Destination
            </span>
            <input
              type="text"
              value={activeField === 'destination' ? query : destinationLocation?.address || ''}
              onFocus={() => {
                setActiveField('destination');
                setQuery(destinationLocation?.address || '');
              }}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destination with Google Places..."
              className="w-full bg-transparent text-sm font-semibold text-white placeholder-zinc-500 focus:outline-none truncate"
            />
          </div>
          {activeField === 'destination' && query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setActiveField(null);
              }}
              className="p-1 rounded-lg text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Google Places Autocomplete Dropdown List */}
        {activeField && (predictions.length > 0 || loadingPredictions) && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-zinc-950/98 backdrop-blur-xl border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
            {loadingPredictions && (
              <div className="p-3 text-xs text-zinc-400 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Searching Google Places...</span>
              </div>
            )}
            {predictions.map((p) => (
              <div
                key={p.place_id}
                onClick={() => handleSelectPrediction(p)}
                className="p-3 hover:bg-zinc-900 border-b border-zinc-900 last:border-0 cursor-pointer flex items-start gap-3 transition-colors"
              >
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">
                    {p.structured_formatting?.main_text || p.description}
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate">
                    {p.structured_formatting?.secondary_text || ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
