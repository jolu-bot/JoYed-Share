import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Database, 
  Activity, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface SystemStats {
  total_users: number;
  admin_users: number;
  super_admin_users: number;
  total_files: number;
  total_folders: number;
  total_storage_used: number;
  total_shared_links: number;
  today_activities: number;
}

const SuperAdminPanel: React.FC = () => {
  const { user, isSuperAdmin } = useAuth();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [systemHealth, setSystemHealth] = useState({
    database: 'healthy',
    storage: 'healthy',
    auth: 'healthy'
  });

  useEffect(() => {
    if (isSuperAdmin) {
      fetchSystemStats();
      checkSystemHealth();
    }
  }, [isSuperAdmin]);

  const fetchSystemStats = async () => {
    try {
      // Mock data for now since we might not have the view yet
      const mockStats = {
        total_users: 1,
        admin_users: 0,
        super_admin_users: 1,
        total_files: 0,
        total_folders: 0,
        total_storage_used: 0,
        total_shared_links: 0,
        today_activities: 0
      };

      try {
        const { data, error } = await supabase
          .from('system_stats')
          .select('*')
          .single();

        if (error) throw error;
        setStats(data);
      } catch (error) {
        console.log('Using mock stats:', error);
        setStats(mockStats);
      }
    } catch (error) {
      console.error('Error fetching system stats:', error);
      setStats({
        total_users: 1,
        admin_users: 0,
        super_admin_users: 1,
        total_files: 0,
        total_folders: 0,
        total_storage_used: 0,
        total_shared_links: 0,
        today_activities: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const checkSystemHealth = async () => {
    try {
      // Test database connection
      const { error: dbError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      // Test storage
      const { error: storageError } = await supabase.storage
        .from('files')
        .list('', { limit: 1 });

      // Test auth
      const { data: { session }, error: authError } = await supabase.auth.getSession();

      setSystemHealth({
        database: dbError ? 'error' : 'healthy',
        storage: storageError ? 'warning' : 'healthy',
        auth: authError ? 'error' : 'healthy'
      });
    } catch (error) {
      console.error('Error checking system health:', error);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <RefreshCw className="h-5 w-5 text-gray-500" />;
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Accès Refusé</h3>
          <p className="text-gray-500">Vous n'avez pas les permissions pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">Panneau Super Administrateur</h1>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            fetchSystemStats();
            checkSystemHealth();
          }}
          icon={<RefreshCw className="h-5 w-5" />}
        >
          Actualiser
        </Button>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>État du Système</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Base de données</span>
              </div>
              {getHealthIcon(systemHealth.database)}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Stockage</span>
              </div>
              {getHealthIcon(systemHealth.storage)}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Authentification</span>
              </div>
              {getHealthIcon(systemHealth.auth)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Utilisateurs Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_users}</p>
                  <p className="text-xs text-gray-500">
                    {stats.admin_users} admins, {stats.super_admin_users} super admins
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 mr-4">
                  <Database className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Fichiers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_files}</p>
                  <p className="text-xs text-gray-500">{stats.total_folders} dossiers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-100 mr-4">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Stockage Utilisé</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatBytes(stats.total_storage_used)}
                  </p>
                  <p className="text-xs text-gray-500">{stats.total_shared_links} liens partagés</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-orange-100 mr-4">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Activité Aujourd'hui</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.today_activities}</p>
                  <p className="text-xs text-gray-500">actions utilisateur</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => window.location.href = '/admin/users'}
            >
              <Users className="h-6 w-6 mb-2" />
              Gérer Utilisateurs
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => window.location.href = '/admin/logs'}
            >
              <Activity className="h-6 w-6 mb-2" />
              Logs d'Activité
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => checkSystemHealth()}
            >
              <Shield className="h-6 w-6 mb-2" />
              Vérifier Sécurité
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => fetchSystemStats()}
            >
              <Database className="h-6 w-6 mb-2" />
              Analyser Système
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminPanel;