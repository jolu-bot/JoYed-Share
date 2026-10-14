// User related types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin' | 'super_admin';
  createdAt: Date;
}

// Auth related types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// File related types
export interface FileItem {
  id: string;
  name: string;
  type: 'audio' | 'video' | 'document' | 'other';
  size: number;
  owner: string;
  path: string;
  color?: string;
  isShared: boolean;
  createdAt: Date;
  modifiedAt: Date;
  thumbnail?: string;
}

export interface FolderType {
  id: string;
  name: string;
  path: string;
  owner: string;
  color?: string;
  isShared: boolean;
  createdAt: Date;
  modifiedAt: Date;
}

// Sharing related types
export interface ShareLink {
  id: string;
  fileId: string;
  url: string;
  password?: string;
  expiresAt?: Date;
  downloadLimit?: number;
  downloadsCount: number;
  createdAt: Date;
}

export interface Permission {
  id: string;
  resourceId: string; // File or folder ID
  resourceType: 'file' | 'folder';
  userId: string;
  permissionType: 'view' | 'edit' | 'comment' | 'download';
  createdAt: Date;
}

// Activity related types
export interface ActivityLog {
  id: string;
  userId: string;
  resourceId?: string;
  resourceType?: 'file' | 'folder' | 'user';
  action: string;
  details?: string;
  timestamp: Date;
}

// Comment related types
export interface Comment {
  id: string;
  fileId: string;
  userId: string;
  content: string;
  createdAt: Date;
  modifiedAt?: Date;
}

// Version related types
export interface FileVersion {
  id: string;
  fileId: string;
  versionNumber: number;
  size: number;
  createdAt: Date;
  createdBy: string;
}