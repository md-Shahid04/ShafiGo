import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { RideTable } from '../../components/admin/RideTable';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Clock, Filter } from 'lucide-react';

export const RidesPage = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchRides(page, statusFilter);
  }, [page, statusFilter]);

  const fetchRides = async (pageNum, status) => {
    setLoading(true);
    try {
      const res = await adminApi.getAllRides(pageNum, 10, status === 'ALL' ? null : status);
      if (res.success) {
        setRides(res.data.content);
        setTotalPages(res.data.totalPages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">All Platform Trips</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Complete audit log of urban transit trips across India
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs">
          {['ALL', 'RIDE_COMPLETED', 'SEARCHING_DRIVER', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(0);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === st
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
        <RideTable rides={rides} isAdmin={true} />

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-zinc-800">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="text-xs font-bold text-zinc-400">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
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

export default RidesPage;
