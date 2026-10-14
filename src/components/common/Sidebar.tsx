import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HardDrive, 
  Share, 
  Star, 
  Clock, 
  Trash2, 
  Users, 
  BarChart3,
  Shield,
  ActivitySquare,
  Crown,
  Mail
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import { APP_CONFIG } from '../../config/constants';

const Sidebar: React.FC = () => {
  const { user, isAdmin, isSuperAdmin } = useAuth();

  const navItems = [
    { name: 'My Files', path: '/files', icon: <HardDrive className="h-5 w-5" /> },
    { name: 'Shared', path: '/shared', icon: <Share className="h-5 w-5" /> },
    { name: 'Starred', path: '/starred', icon: <Star className="h-5 w-5" /> },
    { name: 'Recent', path: '/recent', icon: <Clock className="h-5 w-5" /> },
    { name: 'Trash', path: '/trash', icon: <Trash2 className="h-5 w-5" /> },
  ];

  const adminItems = [
    { name: 'Dashboard', path: '/admin', icon: <BarChart3 className="h-5 w-5" /> },
    { name: 'Users', path: '/admin/users', icon: <Users className="h-5 w-5" /> },
    { name: 'Invitations', path: '/admin/invitations', icon: <Mail className="h-5 w-5" /> },
    { name: 'Activity Logs', path: '/admin/logs', icon: <ActivitySquare className="h-5 w-5" /> },
  ];

  const superAdminItems = [
    { name: 'Super Admin', path: '/admin/super', icon: <Crown className="h-5 w-5" /> },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200 sticky top-16">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="px-4 space-y-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )
                }
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </NavLink>
            ))}
          </div>

          {isAdmin && (
            <>
              <div className="pt-2">
                <div className="px-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Administration
                  </h3>
                </div>
                <div className="mt-2 space-y-1">
                  {isSuperAdmin && superAdminItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                          isActive
                            ? 'bg-purple-50 text-purple-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )
                      }
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </NavLink>
                  ))}
                  {adminItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )
                      }
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="p-1 bg-green-100 rounded">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium text-gray-900">Security Status</p>
            <p className="text-xs text-green-600">Protected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;