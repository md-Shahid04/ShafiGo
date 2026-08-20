import React from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Power, Car, AlertCircle } from 'lucide-react';

export const DriverStatusToggle = ({
  onlineStatus = 'OFFLINE',
  verificationStatus = 'PENDING',
  onToggleStatus,
  loading = false,
  activeVehicle,
}) => {
  const isOnline = onlineStatus === 'ONLINE';
  const isApproved = verificationStatus === 'APPROVED';

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-zinc-800 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
              isOnline
                ? 'bg-white text-black border-white shadow-xl shadow-white/10'
                : 'bg-zinc-900 text-zinc-500 border-zinc-800'
            }`}
          >
            <Power className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">
                {isOnline ? 'You are Online' : 'You are Offline'}
              </h2>
              <Badge status={onlineStatus} size="xs" />
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isOnline
                ? 'Ready to receive nearby ride dispatch requests in India.'
                : 'Go online to start receiving ride requests in your area.'}
            </p>
          </div>
        </div>

        {/* Toggle Button */}
        <Button
          size="lg"
          variant={isOnline ? 'outline' : 'primary'}
          onClick={onToggleStatus}
          disabled={!isApproved || loading}
          loading={loading}
          icon={Power}
          className="w-full sm:w-auto"
        >
          {isOnline ? 'Go Offline' : 'Go Online Now'}
        </Button>
      </div>

      {/* Active Vehicle & Verification Warnings */}
      <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        {activeVehicle ? (
          <div className="flex items-center gap-2 text-zinc-300">
            <Car className="w-4 h-4 text-zinc-400" />
            <span>
              Active Vehicle: <strong className="text-white">{activeVehicle.brand} {activeVehicle.model}</strong> ({activeVehicle.registrationNumber})
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-amber-400">
            <AlertCircle className="w-4 h-4" />
            <span>No active vehicle selected. Register a vehicle to drive.</span>
          </div>
        )}

        {!isApproved && (
          <span className="text-amber-400 font-semibold">
            Account status: {verificationStatus}. Awaiting admin approval.
          </span>
        )}
      </div>
    </div>
  );
};

export default DriverStatusToggle;
