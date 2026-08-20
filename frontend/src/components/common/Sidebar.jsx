import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogoIcon } from './Logo';
import {
  Compass,
  MapPin,
  Clock,
  User,
  Car,
  DollarSign,
  FileText,
  Users,
  ShieldCheck,
  Activity,
  Settings,
  Bell,
  CheckSquare,
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const riderLinks = [
    { name: 'Explore & Book', path: '/rider/book', icon: MapPin },
    { name: 'Dashboard', path: '/rider', icon: Compass },
    { name: 'Trip History', path: '/rider/history', icon: Clock },
    { name: 'My Profile', path: '/rider/profile', icon: User },
    { name: 'Notifications', path: '/rider/notifications', icon: Bell },
  ];

  const driverLinks = [
    { name: 'Driver Console', path: '/driver', icon: Compass },
    { name: 'Vehicles', path: '/driver/vehicles', icon: Car },
    { name: 'Trip Earnings', path: '/driver/earnings', icon: DollarSign },
    { name: 'Verification & Docs', path: '/driver/documents', icon: FileText },
    { name: 'Trip History', path: '/driver/history', icon: Clock },
    { name: 'Notifications', path: '/driver/notifications', icon: Bell },
  ];

  const adminLinks = [
    { name: 'Analytics', path: '/admin', icon: Activity },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Drivers & Fleet', path: '/admin/drivers', icon: CheckSquare },
    { name: 'Live On-Road Rides', path: '/admin/rides/active', icon: Compass },
    { name: 'All Trips Audit', path: '/admin/rides', icon: Clock },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  const links =
    user.role === 'ROLE_ADMIN'
      ? adminLinks
      : user.role === 'ROLE_DRIVER'
      ? driverLinks
      : riderLinks;

  return (
    <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-16 bottom-0 bg-black border-r border-zinc-800/80 p-4 z-40">
      <div className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 px-3 py-2">
        {user.role === 'ROLE_ADMIN' ? 'Admin Portal' : user.role === 'ROLE_DRIVER' ? 'ShafiGo Partner' : 'Rider Menu'}
      </div>

      <nav className="space-y-1.5 flex-1 mt-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/rider' || link.path === '/driver' || link.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white text-black font-extrabold shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Info Pill */}
      <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
        <div className="flex items-center gap-2 text-white font-bold">
          <div className="w-4 h-4 text-white">
            <LogoIcon className="w-full h-full" color="#FFFFFF" />
          </div>
          ShafiGo India
        </div>
        <div className="text-[9px] font-black tracking-widest text-zinc-500 uppercase">
          RIDE. ARRIVE. GO.
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
