import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Mail, Lock, User, Phone, FileText, Car, ArrowRight } from 'lucide-react';

export const DriverRegisterPage = () => {
  const { registerDriver, loading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    licenseNumber: '',
    vehicleType: 'SEDAN',
    brand: '',
    model: '',
    color: '',
    registrationNumber: '',
    year: new Date().getFullYear(),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerDriver(formData);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white text-black font-black flex items-center justify-center text-2xl shadow-xl">
              ✦
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              Swift<span className="text-zinc-400">Ride</span> Partner
            </span>
          </Link>
          <h2 className="text-2xl font-black text-white">Drive with SwiftRide India</h2>
          <p className="text-xs text-zinc-400">Earn with low platform commissions and instant payouts</p>
        </div>

        <Card className="p-6 sm:p-8 bg-zinc-950 border border-zinc-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">
                1. Driver Profile Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  name="firstName"
                  placeholder="Amit"
                  icon={User}
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  placeholder="Patel"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="amit@example.com"
                  icon={Mail}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Mobile Number (India)"
                  type="tel"
                  name="phone"
                  placeholder="+91 98450 12345"
                  icon={Phone}
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Driving License (DL)"
                  name="licenseNumber"
                  placeholder="KA-04-20180012345"
                  icon={FileText}
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Account Password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  icon={Lock}
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                />
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">
                2. Vehicle Registration Details
              </h3>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  Ride Category (Tier)
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-semibold text-sm focus:outline-none focus:border-white"
                >
                  <option value="BIKE">SwiftMoto (Motorcycle / Scooter)</option>
                  <option value="SEDAN">SwiftGo (Sedan / Hatchback)</option>
                  <option value="SUV">SwiftPremier (6-Seater SUV)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Vehicle Make/Brand"
                  name="brand"
                  placeholder="Maruti Suzuki / Hyundai"
                  icon={Car}
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Model"
                  name="model"
                  placeholder="Dzire / Swift"
                  value={formData.model}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Color"
                  name="color"
                  placeholder="White"
                  value={formData.color}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Plate Number"
                  name="registrationNumber"
                  placeholder="KA-01-MJ-8821"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Mfg. Year"
                  type="number"
                  name="year"
                  placeholder="2023"
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              icon={ArrowRight}
            >
              Submit Partner Application
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-zinc-400">
            Already a driver partner?{' '}
            <Link to="/login" className="font-bold text-white hover:underline">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DriverRegisterPage;
