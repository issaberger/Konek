import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BottomNav from './BottomNav';

export default function Layout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D21034]"></div>
      </div>
    );
  }

  const isPublicRoute = location.pathname === '/' || location.pathname === '/index.html';

  if (!user && !isPublicRoute) {
    return <Navigate to="/" replace />;
  }

  if (user && isPublicRoute) {
    return <Navigate to="/solver" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-gray-900 font-sans pb-16">
      <main className="max-w-md mx-auto min-h-screen bg-white shadow-sm relative overflow-hidden">
        {/* Minimal Haitian Flag Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 flex z-50">
          <div className="flex-1 bg-[#00209F]"></div>
          <div className="flex-1 bg-[#D21034]"></div>
        </div>
        <Outlet />
      </main>
      {user && <BottomNav />}
    </div>
  );
}
