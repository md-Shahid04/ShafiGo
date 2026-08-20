import React from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Check, X, Shield, Star, Car } from 'lucide-react';

export const DriverApprovalTable = ({
  drivers = [],
  onVerify,
  loading = false,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-zinc-300">
        <thead className="bg-zinc-950 text-[10px] uppercase font-bold text-zinc-400 border-b border-zinc-800">
          <tr>
            <th className="px-4 py-3">Driver Profile</th>
            <th className="px-4 py-3">Driving License</th>
            <th className="px-4 py-3">Active Vehicle</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Rides & Rating</th>
            <th className="px-4 py-3 text-right">Approval Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/80">
          {drivers.map((driver) => (
            <tr key={driver.id} className="hover:bg-zinc-900/60 transition-colors">
              <td className="px-4 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-xs">
                  {driver.user?.firstName?.charAt(0) || 'D'}
                </div>
                <div>
                  <div className="font-extrabold text-white">{driver.user?.fullName}</div>
                  <div className="text-[11px] text-zinc-400">{driver.user?.phone || driver.user?.email}</div>
                </div>
              </td>
              <td className="px-4 py-3.5 font-mono text-zinc-200">
                {driver.licenseNumber}
              </td>
              <td className="px-4 py-3.5">
                {driver.activeVehicle ? (
                  <div>
                    <div className="font-semibold text-white">
                      {driver.activeVehicle.brand} {driver.activeVehicle.model} ({driver.activeVehicle.year})
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400">
                      {driver.activeVehicle.registrationNumber} • {driver.activeVehicle.vehicleType}
                    </div>
                  </div>
                ) : (
                  <span className="text-zinc-500 italic">No active vehicle</span>
                )}
              </td>
              <td className="px-4 py-3.5">
                <Badge status={driver.verificationStatus} size="xs" />
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {driver.rating || 5.0}
                </div>
                <div className="text-[10px] text-zinc-400">{driver.totalRides || 0} completed trips</div>
              </td>
              <td className="px-4 py-3.5 text-right">
                <div className="flex items-center justify-end gap-2">
                  {driver.verificationStatus !== 'APPROVED' && (
                    <Button
                      size="sm"
                      variant="primary"
                      icon={Check}
                      onClick={() => onVerify(driver.id, 'APPROVED')}
                      disabled={loading}
                    >
                      Approve
                    </Button>
                  )}
                  {driver.verificationStatus !== 'REJECTED' && (
                    <Button
                      size="sm"
                      variant="danger"
                      icon={X}
                      onClick={() => onVerify(driver.id, 'REJECTED')}
                      disabled={loading}
                    >
                      Reject
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverApprovalTable;
