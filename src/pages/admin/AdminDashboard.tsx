import React from 'react';
import { Users, FileText, Shield, Activity, ArrowUpRight, HardDrive } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

// Mock data
const storageStats = {
  total: 1000, // GB
  used: 427, // GB
  available: 573, // GB
};

const userStats = {
  total: 125,
  active: 98,
  new: 12,
};

const fileStats = {
  total: 3782,
  uploaded: 187,
  shared: 952,
};

const activityData = [
  { day: 'Mon', value: 45 },
  { day: 'Tue', value: 30 },
  { day: 'Wed', value: 60 },
  { day: 'Thu', value: 40 },
  { day: 'Fri', value: 70 },
  { day: 'Sat', value: 25 },
  { day: 'Sun', value: 15 },
];

const recentActivity = [
  { id: 1, user: 'John Doe', action: 'uploaded a file', resource: 'Project Report.pdf', time: '2 hours ago' },
  { id: 2, user: 'Alice Smith', action: 'shared a folder with', resource: '3 people', time: '5 hours ago' },
  { id: 3, user: 'Bob Johnson', action: 'deleted a file', resource: 'Old Contract.docx', time: '1 day ago' },
  { id: 4, user: 'Emma Wilson', action: 'created a folder', resource: 'Marketing Campaign', time: '1 day ago' },
  { id: 5, user: 'Michael Brown', action: 'downloaded a file', resource: 'Financial Report.xlsx', time: '2 days ago' },
];

const AdminDashboard: React.FC = () => {
  const storagePercentage = (storageStats.used / storageStats.total) * 100;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</span>
          <button className="p-1 rounded-full hover:bg-gray-100">
            <ArrowUpRight className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100 mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <div className="flex items-center mt-1">
                  <span className="text-2xl font-bold text-gray-900">{userStats.total}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded ml-2">
                    +{userStats.new} new
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full bg-blue-600"
                  style={{ width: `${(userStats.active / userStats.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {userStats.active} active users ({((userStats.active / userStats.total) * 100).toFixed(1)}%)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-purple-100 mr-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Files</p>
                <div className="flex items-center mt-1">
                  <span className="text-2xl font-bold text-gray-900">{fileStats.total}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded ml-2">
                    +{fileStats.uploaded} today
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full bg-purple-600"
                  style={{ width: `${(fileStats.shared / fileStats.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {fileStats.shared} shared files ({((fileStats.shared / fileStats.total) * 100).toFixed(1)}%)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-100 mr-4">
                <HardDrive className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Storage Used</p>
                <div className="flex items-center mt-1">
                  <span className="text-2xl font-bold text-gray-900">{storageStats.used} GB</span>
                  <span className="text-sm text-gray-500 ml-1">/ {storageStats.total} GB</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    storagePercentage > 90 ? 'bg-red-500' : storagePercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${storagePercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {storageStats.available} GB available ({(100 - storagePercentage).toFixed(1)}%)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-orange-100 mr-4">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Security Status</p>
                <p className="text-2xl font-bold text-gray-900">Secure</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Encryption</span>
                <span className="text-xs text-green-500">Active</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">Firewall</span>
                <span className="text-xs text-green-500">Active</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">Backups</span>
                <span className="text-xs text-green-500">Up-to-date</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end space-x-2">
              {activityData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${data.value * 2}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">{data.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="p-2 rounded-full bg-gray-100 mr-3">
                    <Activity className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                      <span className="font-medium">{activity.resource}</span>
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;