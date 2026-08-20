import React from 'react';

export const Badge = ({
  children,
  status, // Status enum or string
  variant = 'default',
  size = 'sm',
  className = '',
}) => {
  const getStatusStyles = (st) => {
    switch (st) {
      case 'ROLE_ADMIN':
      case 'ADMIN':
        return 'bg-white text-black font-extrabold border-white';
      case 'ROLE_DRIVER':
      case 'DRIVER':
        return 'bg-zinc-800 text-zinc-100 border-zinc-700';
      case 'ROLE_RIDER':
      case 'RIDER':
        return 'bg-zinc-900 text-zinc-300 border-zinc-800';

      case 'ONLINE':
      case 'APPROVED':
      case 'RIDE_COMPLETED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

      case 'SEARCHING_DRIVER':
      case 'DRIVER_ARRIVING':
      case 'PENDING':
      case 'BUSY':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';

      case 'DRIVER_ACCEPTED':
      case 'DRIVER_ARRIVED':
      case 'RIDE_STARTED':
        return 'bg-white text-black font-bold border-white';

      case 'OFFLINE':
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-zinc-900 text-zinc-400 border-zinc-800';

      default:
        return 'bg-zinc-900 text-zinc-300 border-zinc-800';
    }
  };

  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const label = children || (status ? status.replace(/_/g, ' ') : '');

  return (
    <span
      className={`inline-flex items-center justify-center font-semibold rounded-full border uppercase tracking-wider ${
        getStatusStyles(status || variant)
      } ${sizeStyles[size]} ${className}`}
    >
      {label}
    </span>
  );
};

export default Badge;
