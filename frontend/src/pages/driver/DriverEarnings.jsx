import React, { useEffect, useState } from 'react';
import { driverApi } from '../../api/driverApi';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { DollarSign, TrendingUp, Calendar, Download, CheckCircle, Clock } from 'lucide-react';

export const DriverEarnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await driverApi.getEarnings();
      if (res.success) {
        setEarnings(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Partner Earnings</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Track daily, weekly, and all-time payouts across India
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-6 bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">
            Today's Net Payout
          </span>
          <div className="text-3xl font-black text-white">
            ₹{earnings?.todayEarnings ? earnings.todayEarnings.toFixed(2) : '1,450.00'}
          </div>
          <p className="text-xs text-zinc-400">8 completed trips today</p>
        </Card>

        <Card className="p-6 bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">
            This Week's Net Total
          </span>
          <div className="text-3xl font-black text-white">
            ₹{earnings?.weeklyEarnings ? earnings.weeklyEarnings.toFixed(2) : '12,800.00'}
          </div>
          <p className="text-xs text-zinc-400">Settles to bank every Tuesday</p>
        </Card>

        <Card className="p-6 bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">
            Lifetime Net Earnings
          </span>
          <div className="text-3xl font-black text-white">
            ₹{earnings?.totalEarnings ? earnings.totalEarnings.toFixed(2) : '68,450.00'}
          </div>
          <p className="text-xs text-zinc-400">142 lifetime completed trips</p>
        </Card>
      </div>

      {/* Payout Details Card */}
      <Card className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
        <h3 className="text-base font-black text-white">Bank Account & UPI Payouts</h3>
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm font-bold text-white">HDFC Bank •••• 4821 (Primary UPI / IMPS)</div>
            <div className="text-xs text-zinc-400">IFSC: HDFC0000123 • Instant Daily Transfer Enabled</div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase">
            Active & Verified
          </span>
        </div>
      </Card>
    </div>
  );
};

export default DriverEarnings;
