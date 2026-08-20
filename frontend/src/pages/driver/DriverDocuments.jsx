import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { CheckCircle2, ShieldAlert, CreditCard, FileCheck } from 'lucide-react';

export const DriverDocuments = () => {
  const { driver, user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-100">Verification & Documents</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Review your official driver license and verification status.
        </p>
      </div>

      <Card className="p-6 border border-slate-700/60 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Application Status
            </span>
            <div className="mt-1">
              <Badge status={driver?.verificationStatus || 'PENDING'} size="md" />
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Driver ID
            </span>
            <span className="font-mono text-xs font-bold text-brand-400">
              #{driver?.id || '—'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
              <CreditCard className="w-4 h-4" />
              Driver's License
            </div>
            <div className="font-mono text-sm font-bold text-slate-100">
              {driver?.licenseNumber || 'Not submitted'}
            </div>
            <p className="text-[10px] text-slate-400">Verified and stored securely</p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <FileCheck className="w-4 h-4" />
              Background Check
            </div>
            <div className="text-sm font-bold text-slate-100">
              {driver?.verificationStatus === 'APPROVED' ? 'Cleared & Approved' : 'Under Review'}
            </div>
            <p className="text-[10px] text-slate-400">Admin verification complete</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-white block mb-1">Driver Standards & Protocol</span>
            Always ensure your vehicle is clean, obey traffic laws, and confirm the rider's identity before starting the trip.
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DriverDocuments;
