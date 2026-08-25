import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { adminApi } from '../../api/adminApi';
import { useWebSocket } from '../../hooks/useWebSocket';
import { StatCard } from '../../components/admin/StatCard';
import { RideTable } from '../../components/admin/RideTable';
import { DriverApprovalTable } from '../../components/admin/DriverApprovalTable';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import {
  setDashboardStats,
  setPendingDrivers,
  setRecentRides,
  removePendingDriver,
} from '../../store/adminSlice';
import { showToast } from '../../store/uiSlice';
import {
  Users,
  Car,
  Clock,
  DollarSign,
  Radio,
  RefreshCw,
} from 'lucide-react';

export const AdminDashboard = () => {
  const dispatch = useDispatch();
  useWebSocket(); // Ensure STOMP admin subscription is active

  const { stats, pendingDrivers, recentRides, wsConnected } = useSelector((state) => state.admin);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const [statsRes, driversRes, ridesRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getPendingDrivers(0, 20),
        adminApi.getAllRides(null, 0, 10),
      ]);

      if (statsRes.success && statsRes.data) {
        dispatch(setDashboardStats(statsRes.data));
      }
      if (driversRes.success && driversRes.data) {
        const driversList = driversRes.data.content || driversRes.data;
        dispatch(setPendingDrivers(Array.isArray(driversList) ? driversList : []));
      }
      if (ridesRes.success && ridesRes.data) {
        const ridesList = ridesRes.data.content || ridesRes.data;
        dispatch(setRecentRides(Array.isArray(ridesList) ? ridesList : []));
      }
    } catch (e) {
      console.error('Admin dashboard fetch error:', e);
      if (isManual) {
        dispatch(showToast({ type: 'error', message: 'Failed to refresh admin metrics' }));
      }
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleVerifyDriver = async (driverId, status) => {
    try {
      const res = await adminApi.verifyDriver(driverId, status);
      if (res.success) {
        dispatch(removePendingDriver(driverId));
        dispatch(showToast({
          type: status === 'APPROVED' ? 'success' : 'info',
          message: `Driver application ${status.toLowerCase()} successfully.`,
        }));
      }
    } catch (e) {
      console.error('Driver verification error:', e);
      dispatch(showToast({ type: 'error', message: e.message || 'Failed to update driver status' }));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Platform Administration
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time urban telemetry, driver verifications, and platform revenue across Bengaluru
          </p>
        </div>

        {/* Live WebSocket STOMP Connection Indicator */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold shadow-lg transition-all ${
              wsConnected
                ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-950/60 border-amber-500/30 text-amber-400'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${wsConnected ? 'animate-pulse text-emerald-400' : 'text-amber-400'}`} />
            <span>{wsConnected ? 'LIVE FEED ACTIVE' : 'CONNECTING...'}</span>
          </div>

          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all disabled:opacity-50"
            title="Sync Database"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <Loader message="Querying live platform metrics from MySQL..." />
      ) : (
        <>
          {/* KPI Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Riders & Users"
              value={stats?.totalUsers ?? 0}
              subtitle={`${stats?.totalRiders ?? 0} riders • ${stats?.totalDrivers ?? 0} drivers`}
              icon={Users}
            />
            <StatCard
              title="Active Driver Fleet"
              value={stats?.activeDrivers ?? 0}
              subtitle={`${stats?.totalApprovedDrivers ?? 0} total approved drivers`}
              icon={Car}
            />
            <StatCard
              title="Completed Trips"
              value={stats?.completedTrips ?? stats?.completedRides ?? 0}
              subtitle={`${stats?.activeTrips ?? stats?.activeRides ?? 0} trips currently on-road`}
              icon={Clock}
            />
            <StatCard
              title="Platform Revenue (INR)"
              value={`₹${(stats?.grossRevenue ?? stats?.totalRevenue ?? 0).toFixed(2)}`}
              subtitle={`Fee: ₹${(stats?.platformCommission ?? 0).toFixed(2)} • Net: ₹${(stats?.driverEarnings ?? 0).toFixed(2)}`}
              icon={DollarSign}
            />
          </div>

          {/* Driver Verification Queue */}
          <Card className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-black text-white">Pending Driver Approvals</h3>
                <p className="text-xs text-zinc-400">Review driving licenses and vehicle registrations</p>
              </div>
              <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                pendingDrivers.length > 0
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-zinc-800 text-zinc-400'
              }`}>
                {pendingDrivers.length} Pending
              </span>
            </div>

            {pendingDrivers.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center italic">
                No driver verification requests pending at this time.
              </p>
            ) : (
              <DriverApprovalTable
                drivers={pendingDrivers}
                onVerify={handleVerifyDriver}
              />
            )}
          </Card>

          {/* Recent Urban Trips Audit */}
          <Card className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-black text-white">Recent Urban Trips</h3>
                <p className="text-xs text-zinc-400">Live feed of completed and ongoing ride events</p>
              </div>
              <span className="text-xs text-zinc-400 font-semibold">
                Showing latest {recentRides.length} trips
              </span>
            </div>

            {recentRides.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center italic">
                No trips recorded in database yet.
              </p>
            ) : (
              <RideTable rides={recentRides} isAdmin={true} />
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
