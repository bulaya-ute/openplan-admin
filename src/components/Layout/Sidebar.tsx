import { NavLink } from 'react-router-dom';
import { Users, ShieldCheck, GitBranch, Database, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/auth';

const links = [
  { to: '/users', label: 'Users', icon: Users },
  { to: '/access-control', label: 'Access Control', icon: ShieldCheck },
  { to: '/versions', label: 'Versions', icon: GitBranch },
  { to: '/backups', label: 'Backups', icon: Database },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-56 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="px-5 py-5 border-b border-gray-200 dark:border-gray-800">
        <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">OpenPlan Admin</span>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <div className="px-3 py-1.5 mb-1">
          <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{user?.displayName}</p>
          <p className="text-xs text-gray-400 truncate">{user?.username}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
