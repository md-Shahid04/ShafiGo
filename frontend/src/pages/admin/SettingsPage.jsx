import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Settings, Save, Shield, IndianRupee, MapPin } from 'lucide-react';

export const SettingsPage = () => {
  const [settings, setSettings] = useState({
    searchRadiusKm: '6.0',
    driverTimeoutSeconds: '25',
    bikeBaseFare: '25.00',
    bikePerKm: '9.00',
    sedanBaseFare: '45.00',
    sedanPerKm: '14.00',
    suvBaseFare: '80.00',
    suvPerKm: '22.00',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">System Settings</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Configure Indian metro dispatch parameters and INR pricing tiers
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Dispatch Parameters */}
        <Card className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
            <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-black">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Matching & Dispatch Engine</h3>
              <p className="text-xs text-zinc-400">Radius and timeout parameters for Indian cities</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Driver Search Radius (KM)"
              name="searchRadiusKm"
              type="number"
              step="0.5"
              value={settings.searchRadiusKm}
              onChange={handleChange}
            />
            <Input
              label="Driver Response Timeout (Seconds)"
              name="driverTimeoutSeconds"
              type="number"
              value={settings.driverTimeoutSeconds}
              onChange={handleChange}
            />
          </div>
        </Card>

        {/* Pricing Matrix (INR) */}
        <Card className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
            <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-black">
              ₹
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Fare Matrix (Indian Rupee ₹)</h3>
              <p className="text-xs text-zinc-400">Base fare and rate per kilometer across vehicle tiers</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Bike */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <span className="text-xs font-black text-white block uppercase tracking-wider">
                SwiftMoto (Two-Wheeler)
              </span>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Base Fare (₹)"
                  name="bikeBaseFare"
                  value={settings.bikeBaseFare}
                  onChange={handleChange}
                />
                <Input
                  label="Rate Per KM (₹)"
                  name="bikePerKm"
                  value={settings.bikePerKm}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Sedan */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <span className="text-xs font-black text-white block uppercase tracking-wider">
                SwiftGo (Sedan / Hatchback)
              </span>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Base Fare (₹)"
                  name="sedanBaseFare"
                  value={settings.sedanBaseFare}
                  onChange={handleChange}
                />
                <Input
                  label="Rate Per KM (₹)"
                  name="sedanPerKm"
                  value={settings.sedanPerKm}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* SUV */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <span className="text-xs font-black text-white block uppercase tracking-wider">
                SwiftPremier (Executive SUV)
              </span>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Base Fare (₹)"
                  name="suvBaseFare"
                  value={settings.suvBaseFare}
                  onChange={handleChange}
                />
                <Input
                  label="Rate Per KM (₹)"
                  name="suvPerKm"
                  value={settings.suvPerKm}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-xs font-bold text-emerald-400 animate-fade-in">
              ✓ Platform settings saved successfully!
            </span>
          ) : (
            <span className="text-xs text-zinc-500">Changes apply in real-time</span>
          )}

          <Button type="submit" size="lg" icon={Save}>
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
