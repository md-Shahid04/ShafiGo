import React from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Power,
  Car,
  AlertCircle,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Lock,
} from 'lucide-react';

export const DriverStatusToggle = ({
  onlineStatus = 'OFFLINE',
  verificationStatus = 'PENDING',
  onToggleStatus,
  loading = false,
  activeVehicle,
}) => {
  const isApproved = verificationStatus === 'APPROVED';
  const isPending = verificationStatus === 'PENDING';
  const isRejected = verificationStatus === 'REJECTED';
  const isSuspended = verificationStatus === 'SUSPENDED';

  // An unapproved driver is strictly NOT online regardless of any stale cache
  const effectiveOnlineStatus = isApproved ? onlineStatus : 'OFFLINE';
  const isOnline = isApproved && effectiveOnlineStatus === 'ONLINE';
  const isBusy = isApproved && effectiveOnlineStatus === 'BUSY';
  const isOffline = isApproved && effectiveOnlineStatus === 'OFFLINE';

  return (
    <div className="space-y-4">
      {/* 1. Pending Approval Banner */}
      {isPending && (
        <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-4 animate-fade-in shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-amber-200 uppercase tracking-wider">
                Pending Approval
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                Under Admin Review
              </span>
            </div>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Your driver account is waiting for admin approval. You will be able to go online and receive rides after approval.
            </p>
          </div>
        </div>
      )}

      {/* 2. Rejected Banner */}
      {isRejected && (
        <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-4 animate-fade-in shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-rose-200 uppercase tracking-wider">
              Account Rejected
            </h3>
            <p className="text-xs text-rose-200/80 leading-relaxed">
              Your driver partner registration has been rejected. Please reach out to ShafiGo Partner Support.
            </p>
          </div>
        </div>
      )}

      {/* 3. Suspended Banner */}
      {isSuspended && (
        <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-4 animate-fade-in shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-rose-200 uppercase tracking-wider">
              Account Suspended
            </h3>
            <p className="text-xs text-rose-200/80 leading-relaxed">
              Your driver account is currently suspended. Please contact administrator support.
            </p>
          </div>
        </div>
      )}

      {/* Main Status Toggle Container */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                isOnline
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-xl shadow-emerald-500/20'
                  : isBusy
                  ? 'bg-blue-600 text-white border-blue-400 shadow-xl shadow-blue-500/20'
                  : isApproved
                  ? 'bg-zinc-900 text-zinc-400 border-zinc-800'
                  : 'bg-zinc-900/80 text-zinc-600 border-zinc-800/60'
              }`}
            >
              {!isApproved ? (
                <Lock className="w-7 h-7 text-amber-400" />
              ) : (
                <Power className={`w-7 h-7 ${isOnline ? 'text-white' : isBusy ? 'text-white' : 'text-zinc-500'}`} />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">
                  {!isApproved
                    ? isPending
                      ? 'Pending Approval'
                      : isRejected
                      ? 'Account Rejected'
                      : 'Account Suspended'
                    : isOnline
                    ? 'You are Online'
                    : isBusy
                    ? 'On Active Trip'
                    : 'You are Offline'}
                </h2>
                <Badge
                  status={!isApproved ? verificationStatus : effectiveOnlineStatus}
                  size="xs"
                />
              </div>

              <p className="text-xs text-zinc-400 mt-0.5">
                {!isApproved
                  ? 'Awaiting admin verification before you can go online.'
                  : isOnline
                  ? 'Ready to receive nearby ride dispatch requests across Bengaluru.'
                  : isBusy
                  ? 'Currently on an active trip with passenger.'
                  : 'You are approved! Go online to start receiving ride requests.'}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="w-full sm:w-auto flex flex-col items-stretch sm:items-end gap-1.5">
            {!isApproved ? (
              <Button
                size="lg"
                disabled={true}
                icon={Lock}
                className="w-full sm:w-auto font-black opacity-50 cursor-not-allowed bg-zinc-900 text-zinc-400 border border-zinc-800"
              >
                Locked (Awaiting Approval)
              </Button>
            ) : isBusy ? (
              <Button
                size="lg"
                disabled={true}
                icon={Car}
                className="w-full sm:w-auto font-black bg-blue-600 text-white border-blue-500 cursor-not-allowed opacity-90"
              >
                On Active Trip
              </Button>
            ) : isOnline ? (
              <Button
                size="lg"
                variant="danger"
                onClick={onToggleStatus}
                loading={loading}
                icon={Power}
                className="w-full sm:w-auto font-black"
              >
                Go Offline
              </Button>
            ) : (
              <Button
                size="lg"
                variant="primary"
                onClick={onToggleStatus}
                disabled={loading || !activeVehicle}
                loading={loading}
                icon={Power}
                className="w-full sm:w-auto font-black bg-white hover:bg-zinc-200 text-black border-transparent"
              >
                Go Online Now
              </Button>
            )}
          </div>
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
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <AlertCircle className="w-4 h-4" />
              <span>No active vehicle registered. Register a vehicle before going online.</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {isApproved ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                Verified Driver Partner
              </span>
            ) : (
              <span className="text-amber-400 font-bold text-[11px]">
                Driver Status: {verificationStatus}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverStatusToggle;
