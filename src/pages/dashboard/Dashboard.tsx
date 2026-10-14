import React from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle, Clock, Star, BarChart, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useFiles } from '../../hooks/useFiles';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { files } = useFiles();
  const { t } = useTranslation();

  const totalSize = files.reduce((acc, file) => acc + (file.size_bytes || 0), 0);
  const storageUsed = totalSize / (1024 * 1024 * 1024); // Convert to GB
  const storageLimit = 10; // GB
  const storagePercentage = (storageUsed / storageLimit) * 100;
  
  const recentFiles = files
    .filter(f => !f.is_folder)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('navigation.dashboard')}</h1>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            icon={<Upload className="h-5 w-5" />}
          >
            {t('dashboard.uploadFiles')}
          </Button>
          <Button
            variant="primary"
            icon={<PlusCircle className="h-5 w-5" />}
          >
            {t('dashboard.newFolder')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100 mr-4">
                <BarChart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('dashboard.storageUsed')}</p>
                <div className="flex items-center mt-1">
                  <span className="text-2xl font-bold text-gray-900">{storageUsed.toFixed(2)} GB</span>
                  <span className="text-sm text-gray-500 ml-1">/ {storageLimit} GB</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    storagePercentage > 90 ? 'bg-red-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${storagePercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {storagePercentage.toFixed(1)}% used
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-100 mr-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('dashboard.recentFiles')}</p>
                <p className="text-2xl font-bold text-gray-900">{files.filter(f => !f.is_folder).length}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/files"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                {t('dashboard.viewAllFiles')}
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-orange-100 mr-4">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('dashboard.starredItems')}</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/starred"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                {t('dashboard.viewStarredItems')}
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-purple-100 mr-4">
                <Upload className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('dashboard.uploadStatus')}</p>
                <p className="text-2xl font-bold text-gray-900">100%</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">{t('dashboard.allUploadsComplete')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentFiles')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentFiles.length > 0 ? (
                recentFiles.map((file) => (
                  <div key={file.id} className="p-3 border rounded-lg hover:shadow-sm">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(file.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">{t('dashboard.noFilesYet')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;