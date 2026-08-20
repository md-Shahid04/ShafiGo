import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const { registerRider, loading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerRider(formData);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white text-black font-black flex items-center justify-center text-2xl shadow-xl">
              ✦
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              Swift<span className="text-zinc-400">Ride</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-white">Create Rider Account</h2>
          <p className="text-xs text-zinc-400">Join SwiftRide for seamless rides across India</p>
        </div>

        <Card className="p-6 sm:p-8 bg-zinc-950 border border-zinc-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                name="firstName"
                placeholder="Rahul"
                icon={User}
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                placeholder="Sharma"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="rahul@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Mobile Number (India)"
              type="tel"
              name="phone"
              placeholder="+91 98765 43210"
              icon={Phone}
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <Input
              label="Password (min 6 characters)"
              type="password"
              name="password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              icon={ArrowRight}
            >
              Sign Up as Rider
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-zinc-400 space-y-2">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-white hover:underline">
                Sign In
              </Link>
            </p>
            <p>
              Want to drive in India?{' '}
              <Link to="/driver/register" className="font-bold text-zinc-300 hover:underline">
                Apply as Driver Partner
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
