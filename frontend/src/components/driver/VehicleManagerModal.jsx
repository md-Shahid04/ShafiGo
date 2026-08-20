import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Car, Bike, Shield, Plus } from 'lucide-react';

export const VehicleManagerModal = ({ isOpen, onClose, onAddVehicle, loading = false }) => {
  const [vehicleType, setVehicleType] = useState('SEDAN');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddVehicle({
      vehicleType,
      brand,
      model,
      color,
      registrationNumber,
      year: parseInt(year, 10),
      active: true,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Vehicle"
      subtitle="Register a vehicle to your SwiftRide driver fleet in India"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vehicle Type Choice */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
            Ride Category (Tier)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'BIKE', label: 'SwiftMoto', icon: Bike },
              { id: 'SEDAN', label: 'SwiftGo', icon: Car },
              { id: 'SUV', label: 'SwiftPremier', icon: Shield },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setVehicleType(t.id)}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                    vehicleType === t.id
                      ? 'bg-white text-black border-white font-extrabold shadow-md'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Make / Brand"
            placeholder="e.g. Maruti Suzuki"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
          <Input
            label="Model"
            placeholder="e.g. Dzire / Swift"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Color"
            placeholder="e.g. Pearl White"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
          />
          <Input
            label="Mfg. Year"
            type="number"
            min="2010"
            max="2030"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </div>

        <Input
          label="Registration Number (Plate)"
          placeholder="e.g. KA-01-MJ-8821"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          required
        />

        <div className="pt-2 flex gap-3">
          <Button variant="ghost" fullWidth onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" fullWidth type="submit" loading={loading} icon={Plus}>
            Save Vehicle
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default VehicleManagerModal;
