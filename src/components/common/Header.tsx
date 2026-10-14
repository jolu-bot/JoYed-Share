import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Bell, Settings, Search, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import LanguageSwitcher from './LanguageSwitcher';
import { APP_CONFIG } from '../../config/constants';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);
  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="p-1 bg-blue-600 rounded">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">{APP_CONFIG.name}</span>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="relative max-w-lg w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={t('common.search') + '...'}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="hidden sm:flex sm:items-center">
            <LanguageSwitcher />
            
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
              <Bell className="h-6 w-6" />
            </button>
            
            <button className="ml-3 p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
              <Settings className="h-6 w-6" />
            </button>
            
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={toggleProfileMenu}
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Avatar
                    name={user?.name}
                    src={user?.avatar}
                    size="md"
                    status="online"
                  />
                </button>
              </div>
              
              {showProfileMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <a
                    href="#profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="mr-3 h-5 w-5 text-gray-400" />
                    {t('navigation.profile')}
                  </a>
                  <a
                    href="#settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="mr-3 h-5 w-5 text-gray-400" />
                    {t('navigation.settings')}
                  </a>
                  <button
                    onClick={() => {
                      logout();
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                    {t('auth.logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {showMobileMenu ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <div className="px-4 py-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={t('common.search') + '...'}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <Avatar
                  name={user?.name}
                  src={user?.avatar}
                  size="md"
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user?.name}</div>
                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
              </div>
              <button className="ml-auto p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Bell className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-3 space-y-1">
              <a
                href="#profile"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                {t('navigation.profile')}
              </a>
              <a
                href="#settings"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                {t('navigation.settings')}
              </a>
              <button
                onClick={() => {
                  logout();
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                {t('auth.logout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;