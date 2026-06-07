import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';
import { SkeletonDashboard } from './components/ui/SkeletonLoader';

const Login = lazy(() => import('./pages/Login'));
const MemberDashboard = lazy(() => import('./pages/MemberDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <SkeletonDashboard />
      </div>
    </div>
  );
}

function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, loading } = useStore();

  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && !profile) return <LoadingFallback />;
  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to={profile?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { user, profile, loading } = useStore();

  if (loading) return <LoadingFallback />;
  if (user) {
    if (profile?.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  const initAuth = useStore((s) => s.initAuth);

  useEffect(() => {
    const cleanup = initAuth();
    return () => cleanup?.();
  }, [initAuth]);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="member">
              <MemberDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
