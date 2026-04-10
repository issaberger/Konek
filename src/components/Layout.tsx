import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BottomNav from './BottomNav';

export default function Layout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6321]"></div>
      </div>
    );
  }

  if (!user && location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }

  if (user && location.pathname === '/') {
    return <Navigate to="/solver" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-gray-900 font-sans pb-16">
      <main className="max-w-md mx-auto min-h-screen bg-white shadow-sm relative">
        <Outlet />
      </main>
      {user && <BottomNav />}
    </div>
  );
}
