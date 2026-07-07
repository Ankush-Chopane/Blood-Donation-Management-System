import React, { Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PageSkeleton from '../components/PageSkeleton';
import RouteTransition from '../components/RouteTransition';

const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const VerifyEmail = lazy(() => import('../pages/VerifyEmail'));

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user, loading } = useAuth();

  if (loading) {
    return <PageSkeleton compact />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const location = useLocation();

  const renderRoute = (element) => (
    <Suspense fallback={<PageSkeleton compact={location.pathname !== '/'} />}>
      <RouteTransition>{element}</RouteTransition>
    </Suspense>
  );

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={renderRoute(<Home />)} />
        <Route path="/login" element={renderRoute(<Login />)} />
        <Route path="/register" element={renderRoute(<Register />)} />
        <Route path="/forgot-password" element={renderRoute(<ForgotPassword />)} />
        <Route path="/reset-password/:token" element={renderRoute(<ResetPassword />)} />
        <Route path="/verify-email" element={renderRoute(<VerifyEmail />)} />
        <Route
          path="/dashboard"
          element={renderRoute(
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
