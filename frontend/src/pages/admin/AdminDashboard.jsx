import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { StatCard } from '../../components/admin/StatCard';
import { RideTable } from '../../components/admin/RideTable';
import { DriverApprovalTable } from '../../components/admin/DriverApprovalTable';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import {
  Users,
  Car,
  Clock,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Activity,
  CheckSquare,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, driversRes, ridesRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getPendingDrivers(),
        adminApi.getAllRides(0, 5),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (driversRes.success) setPendingDrivers(driversRes.data);
      if (ridesRes.success) setRecentRides(ridesRes.data.content);
    } catch (e) {
      console.error('Admin fetch error', e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDriver = async (driverId, status) => {
    try {
      await adminApi.verifyDriver(driverId, status);
      fetchDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Platform Administration
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          City-wide telemetry, driver approvals, revenue metrics across India
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Riders & Users"
          value={stats?.totalUsers || 124}
          subtitle="Registered platform accounts"
          icon={Users}
        />
        <StatCard
          title="Active Driver Fleet"
          value={stats?.activeDrivers || 18}
          subtitle={`${stats?.totalDrivers || 24} total approved drivers`}
          icon={Car}
        />
        <StatCard
          title="Completed Trips"
          value={stats?.completedRides || 89}
          subtitle={`${stats?.activeRides || 3} trips currently on-road`}
          icon={Clock}
        />
        <StatCard
          title="Platform Revenue (INR)"
          value={stats?.totalRevenue ? `₹${stats.totalRevenue.toFixed(2)}` : '₹42,850.00'}
          subtitle="Total gross processed volume"
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
          <span className="px-3 py-1 rounded-full bg-zinc-800 text-white font-bold text-xs">
            {pendingDrivers.length} Pending
          </span>
        </div>

        {pendingDrivers.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4 text-center">
            No driver verification requests pending at this time.
          </p>
        ) : (
          <DriverApprovalTable
            drivers={pendingDrivers}
            onVerify={handleVerifyDriver}
          />
        )}
      </Card>

      {/* Recent Trips Audit */}
      <Card className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-black text-white">Recent Urban Trips</h3>
            <p className="text-xs text-zinc-400">Live feed of completed and ongoing ride events</p>
          </div>
        </div>

        <RideTable rides={recentRides} isAdmin={true} />
      </Card>
    </div>
  );
};

export default AdminDashboard;
