import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Layout components
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';
import UpdatePassword from './pages/auth/UpdatePassword';
import Dashboard from './pages/dashboard/Dashboard';
import Files from './pages/dashboard/Files';
import Shared from './pages/dashboard/Shared';
import Trash from './pages/dashboard/Trash';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ActivityLogs from './pages/admin/ActivityLogs';
import UserInvitations from './pages/admin/UserInvitations';
import SuperAdminPanel from './components/admin/SuperAdminPanel';
import AcceptInvitation from './pages/auth/AcceptInvitation';

// Legal pages
import TermsOfService from './pages/legal/TermsOfService';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';

// Auth provider
import { AuthProvider } from './context/AuthContext';

function App() {
  const { t } = useTranslation();

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              <Route path="/accept-invitation" element={<AcceptInvitation />} />
            </Route>

            {/* Dashboard routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/files/*" element={<Files />} />
              <Route path="/shared" element={<Shared />} />
              <Route path="/trash" element={<Trash />} />
            </Route>

            {/* Admin routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/super" element={<SuperAdminPanel />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/invitations" element={<UserInvitations />} />
              <Route path="/admin/logs" element={<ActivityLogs />} />
            </Route>

            {/* Legal routes */}
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;