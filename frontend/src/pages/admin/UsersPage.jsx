import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { UserTable } from '../../components/admin/UserTable';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { showToast } from '../../store/uiSlice';
import { useDispatch } from 'react-redux';
import { Users, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export const UsersPage = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllUsers(roleFilter || null, page, 10);
      if (res.success) {
        setUsers(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await adminApi.toggleUserStatus(userId);
      if (res.success) {
        dispatch(showToast({ type: 'success', message: 'User status updated' }));
        fetchUsers();
      }
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err.message }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100">User Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Directory of registered riders, drivers, and platform staff.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {['', 'ROLE_RIDER', 'ROLE_DRIVER', 'ROLE_ADMIN'].map((role) => (
            <button
              key={role}
              onClick={() => {
                setRoleFilter(role);
                setPage(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                roleFilter === role
                  ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
                  : 'bg-dark-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {role ? role.replace('ROLE_', '') : 'All Users'}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-6 border border-slate-700/60 shadow-xl space-y-4">
        {loading ? (
          <Loader message="Loading users..." />
        ) : (
          <UserTable
            users={users}
            onToggleStatus={handleToggleStatus}
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

export default UsersPage;
