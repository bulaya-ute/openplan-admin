import { useEffect, useState } from 'react';
import { ShieldCheck, ShieldOff } from 'lucide-react';
import { listUsers, grantAdmin, revokeAdmin } from '../api/users';
import { useAuthStore } from '../store/auth';
import type { AdminUser } from '../types';
import { format } from 'date-fns';

export default function Users() {
  const currentUser = useAuthStore((s) => s.user);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      setUsers(await listUsers());
    } catch {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggleAdmin(user: AdminUser) {
    try {
      if (user.isAdmin) {
        await revokeAdmin(user.id);
      } else {
        await grantAdmin(user.id);
      }
      await load();
    } catch {
      setError(`Failed to update admin status for ${user.displayName}.`);
    }
  }

  if (loading) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Users</h1>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-left">
              <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">User</th>
              <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Username</th>
              <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Joined</th>
              <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Role</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{user.displayName}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{user.username}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {format(new Date(user.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3">
                  {user.isAdmin ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                      <ShieldCheck size={12} /> Admin
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">User</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {user.id !== currentUser?.userId && (
                    <button
                      onClick={() => toggleAdmin(user)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      {user.isAdmin ? <><ShieldOff size={12} /> Revoke admin</> : <><ShieldCheck size={12} /> Grant admin</>}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
