import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from './Badge';
import { Logo } from './Logo';
import {
  Menu,
  X,
  Bell,
  User as UserIcon,
  LogOut,
  MapPin,
  Car,
  Shield,
  Activity,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'ROLE_ADMIN') return '/admin';
    if (user.role === 'ROLE_DRIVER') return '/driver';
    return '/rider';
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-6">
            <Link to={getDashboardLink()} className="flex items-center group">
              <Logo variant="horizontal" showTagline={true} />
            </Link>

            {/* Quick Links for Public */}
            {!isAuthenticated && (
              <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-400">
                <Link to="/" className="hover:text-white transition-colors">
                  Ride
                </Link>
                <Link to="/driver/register" className="hover:text-white transition-colors">
                  Drive
                </Link>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </div>
            )}
          </div>

          {/* Right Section: Auth State / Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Badge status={user?.role} size="xs" />

                {/* Notifications Link */}
                <Link
                  to={user?.role === 'ROLE_DRIVER' ? '/driver/notifications' : '/rider/notifications'}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all relative"
                >
                  <Bell className="w-5 h-5" />
                </Link>

                {/* User Profile Pill */}
                <div className="flex items-center gap-3 pl-2 border-l border-zinc-800">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white text-xs font-bold">
                    {user?.firstName?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold text-white leading-tight">
                      {user?.fullName}
                    </span>
                    <span className="block text-[10px] text-zinc-400 leading-tight">
                      {user?.email}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs font-bold text-zinc-300 hover:text-white px-4 py-2 rounded-xl transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold text-black bg-white hover:bg-zinc-200 px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 px-4 pt-3 pb-5 space-y-3 animate-fade-in">
          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold">
                  {user?.firstName?.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{user?.fullName}</div>
                  <div className="text-xs text-zinc-400">{user?.email}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/30"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-xs font-bold text-zinc-200 bg-zinc-900 p-3 rounded-xl border border-zinc-800"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-xs font-bold text-black bg-white p-3 rounded-xl"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
