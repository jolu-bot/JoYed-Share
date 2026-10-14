// Configuration de l'application Job'Share
export const APP_CONFIG = {
  name: "Job'Share",
  description: "Plateforme sécurisée de partage de fichiers et de collaboration",
  version: "1.0.0",
  domain: "job-share-applicatio-l0dx.bolt.host",
  supportEmail: "support@joyeds.com",
  maxFileSize: 100 * 1024 * 1024, // 100MB
  allowedFileTypes: [
    'image/*',
    'video/*',
    'audio/*',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/*',
    'application/zip',
    'application/x-rar-compressed',
    'application/json',
    'application/xml'
  ],
  features: {
    googleAuth: true,
    fileSharing: true,
    folderCreation: true,
    filePreview: true,
    bulkOperations: true,
    multiLanguage: true,
    adminPanel: true,
    activityLogs: true
  }
};

export const SUPABASE_CONFIG = {
  url: 'https://jtifuhxkdadztdiicvlf.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  serviceRoleKey: import.meta.env.SUPABASE_SERVICE_ROLE_KEY || '',
  buckets: {
    files: 'files',
    avatars: 'avatars'
  },
  tables: {
    profiles: 'profiles',
    files: 'files',
    sharedLinks: 'shared_links',
    activityLogs: 'activity_logs'
  }
};

export const STORAGE_CONFIG = {
  defaultQuota: 10 * 1024 * 1024 * 1024, // 10GB
  warningThreshold: 0.8, // 80%
  criticalThreshold: 0.95, // 95%
  chunkSize: 1024 * 1024 // 1MB chunks pour upload
};

export const UI_CONFIG = {
  itemsPerPage: 20,
  maxRecentFiles: 10,
  toastDuration: 4000,
  uploadChunkSize: 1024 * 1024, // 1MB chunks
  supportedLanguages: ['en', 'fr'],
  defaultLanguage: 'en'
};

export const SECURITY_CONFIG = {
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 heures
  passwordMinLength: 8,
  requireSpecialChars: true
};

export const GOOGLE_OAUTH_CONFIG = {
  redirectTo: `https://jobshare.joyeds.com/dashboard`,
  scopes: 'openid email profile',
  queryParams: {
    access_type: 'offline',
    prompt: 'consent'
  }
};