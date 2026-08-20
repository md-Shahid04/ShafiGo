import React from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ShieldCheck, ShieldAlert, User, Phone, Mail } from 'lucide-react';

export const UserTable = ({ users = [], onToggleStatus }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-zinc-300">
        <thead className="bg-zinc-950 text-[10px] uppercase font-bold text-zinc-400 border-b border-zinc-800">
          <tr>
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Account Status</th>
            <th className="px-4 py-3">Joined Date</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/80">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-zinc-900/60 transition-colors">
              <td className="px-4 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-xs">
                  {user.firstName?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="font-extrabold text-white">{user.fullName}</div>
                  <div className="text-[11px] text-zinc-400">ID #{user.id}</div>
                </div>
              </td>
              <td className="px-4 py-3.5 space-y-0.5">
                <div className="text-zinc-200">{user.email}</div>
                <div className="text-[11px] text-zinc-400">{user.phone || '—'}</div>
              </td>
              <td className="px-4 py-3.5">
                <Badge status={user.role} size="xs" />
              </td>
              <td className="px-4 py-3.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    user.active
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  {user.active ? 'Active' : 'Suspended'}
                </span>
              </td>
              <td className="px-4 py-3.5 text-zinc-400 text-[11px]">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
              </td>
              <td className="px-4 py-3.5 text-right">
                <Button
                  size="sm"
                  variant={user.active ? 'danger' : 'outline'}
                  onClick={() => onToggleStatus(user.id)}
                >
                  {user.active ? 'Deactivate' : 'Activate'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
