import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import Footer from '../components/common/Footer';
import { APP_CONFIG } from '../config/constants';

const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner size="lg" text={t('common.loading')} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      
      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="p-3 bg-blue-600 rounded-full">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {APP_CONFIG.name}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {APP_CONFIG.description}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-200">
          <Outlet />
        </div>
      </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AuthLayout;