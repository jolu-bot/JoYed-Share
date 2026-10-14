import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  Download, 
  User, 
  FileText, 
  Folder, 
  Trash2, 
  Share, 
  Edit, 
  Eye, 
  Plus, 
  Lock 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ActivityLog, User as UserType } from '../../types';
import Avatar from '../../components/ui/Avatar';

// Mock data
const mockUsers: UserType[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    name: 'Alice Smith',
    email: 'alice.smith@example.com',
    role: 'user',
    createdAt: new Date('2023-02-20'),
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'user',
    createdAt: new Date('2023-03-10'),
  },
];

const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    userId: '1',
    resourceId: 'file-1',
    resourceType: 'file',
    action: 'upload',
    details: 'Uploaded Project_Report.pdf',
    timestamp: new Date('2023-09-15T10:30:00'),
  },
  {
    id: '2',
    userId: '2',
    resourceId: 'file-2',
    resourceType: 'file',
    action: 'share',
    details: 'Shared Marketing_Plan.docx with 3 users',
    timestamp: new Date('2023-09-15T11:45:00'),
  },
  {
    id: '3',
    userId: '3',
    resourceId: 'folder-1',
    resourceType: 'folder',
    action: 'create',
    details: 'Created a new folder: Client_Projects',
    timestamp: new Date('2023-09-15T13:20:00'),
  },
  {
    id: '4',
    userId: '1',
    resourceId: 'file-3',
    resourceType: 'file',
    action: 'download',
    details: 'Downloaded Financial_Report.xlsx',
    timestamp: new Date('2023-09-15T14:10:00'),
  },
  {
    id: '5',
    userId: '2',
    resourceId: 'file-4',
    resourceType: 'file',
    action: 'delete',
    details: 'Deleted Old_Contract.docx',
    timestamp: new Date('2023-09-15T15:30:00'),
  },
  {
    id: '6',
    userId: '3',
    resourceId: 'file-5',
    resourceType: 'file',
    action: 'edit',
    details: 'Edited Meeting_Notes.docx',
    timestamp: new Date('2023-09-15T16:45:00'),
  },
  {
    id: '7',
    userId: '1',
    resourceId: 'user-4',
    resourceType: 'user',
    action: 'create',
    details: 'Added a new user: david.wilson@example.com',
    timestamp: new Date('2023-09-15T17:20:00'),
  },
  {
    id: '8',
    userId: '2',
    resourceId: 'file-6',
    resourceType: 'file',
    action: 'permission',
    details: 'Changed permissions for Product_Launch.pptx',
    timestamp: new Date('2023-09-15T18:05:00'),
  },
  {
    id: '9',
    userId: '3',
    resourceId: 'folder-2',
    resourceType: 'folder',
    action: 'share',
    details: 'Shared Development_Team folder with 5 users',
    timestamp: new Date('2023-09-16T09:15:00'),
  },
  {
    id: '10',
    userId: '1',
    resourceId: 'file-7',
    resourceType: 'file',
    action: 'view',
    details: 'Viewed Company_Strategy.pdf',
    timestamp: new Date('2023-09-16T10:30:00'),
  },
];

type ActivityFilter = 'all' | 'upload' | 'download' | 'share' | 'delete' | 'edit' | 'create' | 'view' | 'permission';

const ActivityLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState<ActivityFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getUserById = (userId: string): UserType | undefined => {
    return mockUsers.find(user => user.id === userId);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'upload':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'download':
        return <Download className="h-4 w-4 text-blue-500" />;
      case 'share':
        return <Share className="h-4 w-4 text-purple-500" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-500" />;
      case 'edit':
        return <Edit className="h-4 w-4 text-orange-500" />;
      case 'create':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'view':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'permission':
        return <Lock className="h-4 w-4 text-teal-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getResourceIcon = (resourceType: string | undefined) => {
    switch (resourceType) {
      case 'file':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'folder':
        return <Folder className="h-4 w-4 text-yellow-500" />;
      case 'user':
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const filteredLogs = mockActivityLogs
    .filter((log) => {
      const user = getUserById(log.userId);
      const searchLower = searchTerm.toLowerCase();
      
      return (
        (user?.name.toLowerCase().includes(searchLower) ||
        user?.email.toLowerCase().includes(searchLower) ||
        log.details.toLowerCase().includes(searchLower)) &&
        (currentFilter === 'all' || log.action === currentFilter)
      );
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
        <Button
          variant="outline"
          icon={<Download className="h-5 w-5" />}
        >
          Export Logs
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-3 lg:space-y-0">
            <CardTitle>System Activity</CardTitle>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search logs..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Calendar className="h-4 w-4" />}
                >
                  Date Range
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Filter className="h-4 w-4" />}
                  onClick={() => setCurrentFilter('all')}
                  className={currentFilter === 'all' ? 'bg-blue-50 text-blue-600 border-blue-300' : ''}
                >
                  All
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(['upload', 'download', 'share', 'delete', 'edit', 'create', 'view', 'permission'] as ActivityFilter[]).map((filter) => (
                <button
                  key={filter}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    currentFilter === filter ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setCurrentFilter(filter)}
                >
                  {getActionIcon(filter)}
                  <span className="ml-1 capitalize">{filter}</span>
                </button>
              ))}
            </div>
            
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentLogs.map((log) => {
                    const user = getUserById(log.userId);
                    
                    return (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <Avatar name={user?.name} src={user?.avatar} size="sm" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                              <div className="text-xs text-gray-500">{user?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="p-1 rounded-full bg-gray-100 mr-2">
                              {getActionIcon(log.action)}
                            </span>
                            <span className="text-sm font-medium text-gray-900 capitalize">{log.action}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="p-1 rounded-full bg-gray-100 mr-2">
                              {getResourceIcon(log.resourceType)}
                            </span>
                            <span className="text-sm text-gray-500">{log.details}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(log.timestamp)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-3">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} logs
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ActivityLogs;