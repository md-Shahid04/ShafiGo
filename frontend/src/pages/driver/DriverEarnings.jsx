import React, { useEffect, useState } from 'react';
import { driverApi } from '../../api/driverApi';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import {
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const DriverEarnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
    fetchHistory(0);
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await driverApi.getEarnings();
      if (res.success) {
        setEarnings(res.data);
      }
    } catch (e) {
      console.error('Failed to load earnings summary', e);
    }
  };

  const fetchHistory = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const res = await driverApi.getEarningsHistory(pageNumber, 10);
      if (res.success) {
        setHistory(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setPage(pageNumber);
      }
    } catch (e) {
      console.error('Failed to load trip history', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Partner Wallet & Earnings</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time breakdown of trip fares, platform commissions, and instant settlements.
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-[10px] uppercase font-extrabold text-zinc-400 tracking-wider">
            Today's Net Payout
          </span>
          <div className="text-3xl font-black text-white">
            ₹{earnings?.todayEarnings ? earnings.todayEarnings.toFixed(2) : '0.00'}
          </div>
          <p className="text-xs text-zinc-400 font-medium">
            {earnings?.todayTrips || 0} completed trips today
          </p>
        </Card>

        <Card className="p-5 bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-[10px] uppercase font-extrabold text-zinc-400 tracking-wider">
            This Week's Net Total
          </span>
          <div className="text-3xl font-black text-white">
            ₹{earnings?.weeklyEarnings ? earnings.weeklyEarnings.toFixed(2) : '0.00'}
          </div>
          <p className="text-xs text-zinc-400 font-medium">Auto-settles every Tuesday</p>
        </Card>

        <Card className="p-5 bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-[10px] uppercase font-extrabold text-zinc-400 tracking-wider">
            This Month's Total
          </span>
          <div className="text-3xl font-black text-white">
            ₹{earnings?.monthlyEarnings ? earnings.monthlyEarnings.toFixed(2) : '0.00'}
          </div>
          <p className="text-xs text-zinc-400 font-medium">
            Avg ₹{earnings?.averageEarningsPerTrip ? earnings.averageEarningsPerTrip.toFixed(2) : '0.00'} / trip
          </p>
        </Card>

        <Card className="p-5 bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-[10px] uppercase font-extrabold text-zinc-400 tracking-wider">
            Lifetime Net Earnings
          </span>
          <div className="text-3xl font-black text-white">
            ₹{earnings?.totalEarnings ? earnings.totalEarnings.toFixed(2) : '0.00'}
          </div>
          <p className="text-xs text-zinc-400 font-medium">
            {earnings?.completedTrips || 0} total trips completed
          </p>
        </Card>
      </div>

      {/* Bank Account & UPI Settlement Banner */}
      <Card className="p-5 bg-zinc-950 border border-zinc-800 space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider">
          Bank Account & UPI Payouts
        </h3>
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>HDFC Bank •••• 4821</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                Primary UPI / IMPS
              </span>
            </div>
            <div className="text-xs text-zinc-400">
              IFSC: HDFC0000123 • Instant Daily Transfer Enabled (Zero processing fees)
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-extrabold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Verified & Active
          </span>
        </div>
      </Card>

      {/* Trip-by-Trip Earning History */}
      <Card className="p-6 bg-zinc-950 border border-zinc-800 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white">Trip-by-Trip Earnings Breakdown</h3>
            <p className="text-xs text-zinc-400">
              Gross fare minus 15% ShafiGo platform service fee
            </p>
          </div>
        </div>

        {loading ? (
          <Loader message="Loading trip earnings..." />
        ) : history.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs italic">
            No completed trip earnings yet. Go online and complete your first ride!
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/80">
            {history.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-zinc-900/40 px-2 rounded-2xl transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-white bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded-lg">
                      Trip #{item.rideId}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN') : 'Recent'}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-300 flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="font-medium text-zinc-200">{item.pickupAddress}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span className="font-medium text-zinc-200">{item.destinationAddress}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-zinc-400 flex items-center gap-3 pt-0.5">
                    <span>Distance: <strong className="text-zinc-200">{item.distanceKm} km</strong></span>
                    <span>•</span>
                    <span>Gross: ₹{item.grossFare?.toFixed(2)}</span>
                    <span>•</span>
                    <span className="text-zinc-400">Fee (15%): -₹{item.platformFee?.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-lg font-black text-emerald-400">
                    +₹{item.driverEarning?.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase">Net Credited</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-zinc-800">
            <Button
              size="sm"
              variant="secondary"
              icon={ChevronLeft}
              disabled={page === 0}
              onClick={() => fetchHistory(page - 1)}
            >
              Previous
            </Button>
            <span className="text-xs text-zinc-400">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="secondary"
              icon={ChevronRight}
              disabled={page >= totalPages - 1}
              onClick={() => fetchHistory(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DriverEarnings;
