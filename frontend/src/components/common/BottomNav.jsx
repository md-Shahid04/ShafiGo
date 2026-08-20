import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MapPin, Compass, Clock, User, Car, Activity, Bell } from 'lucide-react';

export const BottomNav = () => {
  const { user } = useAuth();
  if (!user) return null;

  const riderTabs = [
    { name: 'Book', path: '/rider/book', icon: MapPin },
    { name: 'Home', path: '/rider', icon: Compass },
    { name: 'Activity', path: '/rider/history', icon: Clock },
    { name: 'Profile', path: '/rider/profile', icon: User },
  ];

  const driverTabs = [
    { name: 'Drive', path: '/driver', icon: Compass },
    { name: 'Fleet', path: '/driver/vehicles', icon: Car },
    { name: 'Earnings', path: '/driver/earnings', icon: Activity },
    { name: 'Account', path: '/driver/profile', icon: User },
  ];

  const adminTabs = [
    { name: 'Stats', path: '/admin', icon: Activity },
    { name: 'Users', path: '/admin/users', icon: User },
    { name: 'Fleet', path: '/admin/drivers', icon: Car },
    { name: 'Trips', path: '/admin/rides', icon: Clock },
  ];

  const tabs =
    user.role === 'ROLE_ADMIN'
      ? adminTabs
      : user.role === 'ROLE_DRIVER'
      ? driverTabs
      : riderTabs;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-zinc-800/80 px-2 py-2">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === '/rider' || tab.path === '/driver' || tab.path === '/admin'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-white font-extrabold scale-105'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{tab.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
