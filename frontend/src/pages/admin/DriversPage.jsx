import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { DriverApprovalTable } from '../../components/admin/DriverApprovalTable';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { showToast } from '../../store/uiSlice';
import { useDispatch } from 'react-redux';
import { CheckSquare, ChevronLeft, ChevronRight } from 'lucide-react';

export const DriversPage = () => {
  const dispatch = useDispatch();
  const [drivers, setDrivers] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDrivers();
  }, [page, statusFilter]);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllDrivers(statusFilter || null, page, 10);
      if (res.success) {
        setDrivers(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (driverId, status) => {
    setActionLoading(true);
    try {
      const res = await adminApi.verifyDriver(driverId, status);
      if (res.success) {
        dispatch(showToast({ type: 'success', message: `Driver verification set to ${status}` }));
        fetchDrivers();
      }
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err.message }));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100">Driver Fleet & Verification</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage driver accounts, licenses, vehicle registrations, and approvals.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {['', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
                  : 'bg-dark-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st || 'All Drivers'}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-6 border border-slate-700/60 shadow-xl space-y-4">
        {loading ? (
          <Loader message="Loading drivers..." />
        ) : (
          <DriverApprovalTable
            drivers={drivers}
            onVerify={handleVerify}
            loading={actionLoading}
          />
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-800">
            <Button
              size="sm"
              variant="secondary"
              icon={ChevronLeft}
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="text-xs text-slate-400">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="secondary"
              icon={ChevronRight}
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DriversPage;
