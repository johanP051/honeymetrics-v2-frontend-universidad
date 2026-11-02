import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage/landingPage';
import Login from './pages/Login/login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AccessDenied from './pages/AccessDenied';
import NotFound from './pages/NotFound';
import MainLayout from './components/layout/MainLayout';
import RoleGuard from './components/layout/RoleGuard';
import Dashboard from './pages/Dashboard/dashboard';
import Blacklist from './pages/Blacklist/blacklist';
import Logs from './pages/Logs/logs';
import Settings from './pages/Settings';
import AdminHub from './pages/admin/AdminHub';
import ErrorBoundary from './components/common/ErrorBoundary';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/access-denied" element={<AccessDenied />} />

            {/* Rutas Protegidas dentro de MainLayout */}
            <Route
              path="/dashboard"
              element={
                <RoleGuard requiredScope="dashboard:read" allowedRoles={['Administrador', 'Analista', 'Superusuario', 'Consultor']}>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </RoleGuard>
              }
            />

            <Route
              path="/blacklist"
              element={
                <RoleGuard requiredScope="threats:read" allowedRoles={['Administrador', 'Superusuario', 'Consultor']}>
                  <MainLayout>
                    <Blacklist />
                  </MainLayout>
                </RoleGuard>
              }
            />

            <Route
              path="/threat-center"
              element={
                <RoleGuard requiredScope="threats:read" allowedRoles={['Administrador', 'Superusuario', 'Consultor']}>
                  <MainLayout>
                    <Blacklist />
                  </MainLayout>
                </RoleGuard>
              }
            />

            <Route
              path="/logs"
              element={
                <RoleGuard requiredScope="logs:read" allowedRoles={['Administrador', 'Analista', 'Superusuario', 'Consultor']}>
                  <MainLayout>
                    <Logs />
                  </MainLayout>
                </RoleGuard>
              }
            />

            <Route
              path="/admin"
              element={
                <RoleGuard requiredScope="admin:all" allowedRoles={['Administrador', 'Superusuario']}>
                  <MainLayout>
                    <AdminHub />
                  </MainLayout>
                </RoleGuard>
              }
            />

            <Route
              path="/settings"
              element={
                <RoleGuard>
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                </RoleGuard>
              }
            />

            {/* Error 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}
