import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Logo } from '../../components/common/Logo';
import { Mail, Lock, ArrowRight, KeyRound } from 'lucide-react';

export const LoginPage = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await login(email, password);
    setSubmitting(false);
  };

  const handleFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header with Logo */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block group mb-1">
            <Logo variant="full" showTagline={true} />
          </Link>
          <p className="text-xs text-zinc-400">Sign in to your ShafiGo account</p>
        </div>

        {/* Login Form Card */}
        <Card className="p-6 sm:p-8 bg-zinc-950 border border-zinc-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading || submitting}
              icon={ArrowRight}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Fill Test Accounts */}
          <div className="mt-6 pt-5 border-t border-zinc-800 space-y-2.5">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-zinc-400 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-white" />
              1-Click Demo Logins (India)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleFill('rider1@swiftride.com', 'Rider@12345')}
                className="p-2.5 rounded-xl bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 text-[11px] font-bold text-zinc-200 text-center transition-colors"
              >
                Rider (Rahul)
              </button>
              <button
                type="button"
                onClick={() => handleFill('driver1@swiftride.com', 'Driver@12345')}
                className="p-2.5 rounded-xl bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 text-[11px] font-bold text-zinc-200 text-center transition-colors"
              >
                Driver (Amit)
              </button>
              <button
                type="button"
                onClick={() => handleFill('shafiyashaikt@gmail.com', 'Shafi@123')}
                className="p-2.5 rounded-xl bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 text-[11px] font-bold text-zinc-200 text-center transition-colors"
              >
                Admin (Shafi)
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="mt-6 text-center text-xs text-zinc-400 space-y-2">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-white hover:underline">
                Sign up as Rider
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

export default LoginPage;
