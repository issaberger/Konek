/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Welcome from './pages/Welcome';
import Solver from './pages/Solver';
import Profile from './pages/Profile';
import DiscoverHaiti from './pages/DiscoverHaiti';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const hasProfile = localStorage.getItem('konek_user_profile');
  return hasProfile ? <>{children}</> : <Navigate to="/" />;
};

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/solver" element={
            <ProtectedRoute>
              <Solver />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/discover" element={
            <ProtectedRoute>
              <DiscoverHaiti />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
