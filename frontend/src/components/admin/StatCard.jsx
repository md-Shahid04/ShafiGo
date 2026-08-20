import React from 'react';
import { Card } from '../common/Card';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className = '',
}) => {
  return (
    <Card className={`p-5 bg-zinc-950 border border-zinc-800 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
          {title}
        </span>
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-zinc-400 mt-1 font-medium">{subtitle}</p>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
