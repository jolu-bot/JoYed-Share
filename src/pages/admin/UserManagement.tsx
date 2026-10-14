import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  ShieldCheck, 
  Shield, 
  Mail 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Avatar from '../../components/ui/Avatar';
import { User } from '../../types';

// Mock data
const mockUsers: User[] = [
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
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    role: 'user',
    createdAt: new Date('2023-04-05'),
  },
  {
    id: '5',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'user',
    createdAt: new Date('2023-05-22'),
  },
  {
    id: '6',
    name: 'Sarah Taylor',
    email: 'sarah.taylor@example.com',
    role: 'admin',
    createdAt: new Date('2023-06-15'),
  },
  {
    id: '7',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    role: 'super_admin',
    createdAt: new Date('2023-01-01'),
  },
];

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [openUserMenu, setOpenUserMenu] = useState<string | null>(null);

  const filteredUsers = mockUsers.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.role.toLowerCase().includes(search)
    );
  });

  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  const deleteSelectedUsers = () => {
    console.log(`Deleting users: ${selectedUsers.join(', ')}`);
    setSelectedUsers([]);
  };

  const toggleUserMenu = (userId: string) => {
    if (openUserMenu === userId) {
      setOpenUserMenu(null);
    } else {
      setOpenUserMenu(userId);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <Button
          variant="primary"
          icon={<Plus className="h-5 w-5" />}
        >
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <CardTitle>Users</CardTitle>
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={selectAllUsers}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={selectedUsers.includes(user.id) ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Avatar name={user.name} src={user.avatar} size="md" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role === 'super_admin' && <ShieldCheck className="mr-1 h-3 w-3" />}
                        {user.role === 'admin' && <Shield className="mr-1 h-3 w-3" />}
                        {user.role === 'user' && <UserIcon className="mr-1 h-3 w-3" />}
                        {user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          onClick={() => toggleUserMenu(user.id)}
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                        {openUserMenu === user.id && (
                          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                            <button
                              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                console.log(`Edit user: ${user.id}`);
                                setOpenUserMenu(null);
                              }}
                            >
                              <Edit className="mr-3 h-5 w-5 text-gray-400" />
                              Edit User
                            </button>
                            <button
                              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                console.log(`Send email to: ${user.email}`);
                                setOpenUserMenu(null);
                              }}
                            >
                              <Mail className="mr-3 h-5 w-5 text-gray-400" />
                              Send Email
                            </button>
                            {user.role !== 'super_admin' && (
                              <button
                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                onClick={() => {
                                  console.log(`Delete user: ${user.id}`);
                                  setOpenUserMenu(null);
                                }}
                              >
                                <Trash2 className="mr-3 h-5 w-5 text-red-500" />
                                Delete User
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div>
              {selectedUsers.length > 0 && (
                <Button
                  variant="danger"
                  size="sm"
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={deleteSelectedUsers}
                >
                  Delete Selected
                </Button>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Showing {filteredUsers.length} of {mockUsers.length} users
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;