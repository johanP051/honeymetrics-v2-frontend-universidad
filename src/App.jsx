import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MainLayout from './components/layout/MainLayout';
import RoleGuard from './components/layout/RoleGuard';
import ThreatCenter from './pages/ThreatCenter';
import Dashboard from './pages/Dashboard';
import LogsReport from './pages/LogsReport';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Rutas Privadas / Protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <RoleGuard allowedRoles={['Administrador', 'Analista', 'Directivo', 'Directivo de T.I.', 'Consultor']}>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </RoleGuard>
            } 
          />
          
          <Route 
            path="/threat-center" 
            element={
              <RoleGuard allowedRoles={['Administrador', 'Analista', 'Directivo', 'Directivo de T.I.', 'Consultor']}>
                <MainLayout>
                  <ThreatCenter />
                </MainLayout>
              </RoleGuard>
            } 
          />

          <Route 
            path="/logs" 
            element={
              <RoleGuard allowedRoles={['Administrador', 'Analista', 'Directivo', 'Directivo de T.I.', 'Consultor']}>
                <MainLayout>
                  <LogsReport />
                </MainLayout>
              </RoleGuard>
            } 
          />

          <Route 
            path="/settings" 
            element={
              <RoleGuard allowedRoles={['Administrador', 'Analista', 'Directivo', 'Directivo de T.I.', 'Consultor']}>
                <MainLayout>
                  <Settings />
                </MainLayout>
              </RoleGuard>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
