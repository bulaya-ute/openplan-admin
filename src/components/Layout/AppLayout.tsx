import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);

  if (!user) return <Navigate to="/login" replace />;
  if (!user.isAdmin) return (
    <div className="flex items-center justify-center h-screen text-gray-500">
      Access denied. Admin privileges required.
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
