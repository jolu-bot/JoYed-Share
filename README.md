# Job'Share - Secure File Sharing Platform

A modern, secure file sharing and collaboration platform built with React, TypeScript, and Supabase.

## 🚀 Features

- **Secure Authentication** - Email/password and Google OAuth
- **File Management** - Upload, download, organize files and folders
- **File Sharing** - Generate secure sharing links with password protection
- **Real-time Dashboard** - Storage usage, recent files, and activity
- **Responsive Design** - Works perfectly on desktop and mobile
- **Admin Panel** - User management and activity monitoring
**Site principal :** https://job-share-applicatio-l0dx.bolt.host
**Domaine personnalisé :** https://jobshare.joyeds.com (redirection configurée)

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Deployment**: Netlify
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 🏗️ Architecture

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── files/          # File management components
│   ├── sharing/        # File sharing components
│   └── common/         # Common layout components
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   └── admin/          # Admin pages
├── hooks/              # Custom React hooks
├── context/            # React context providers
├── utils/              # Utility functions
├── config/             # Configuration files
└── types/              # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google OAuth credentials (for Google authentication)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd jobshare-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Fill in your Supabase credentials (already configured):
```env
VITE_SUPABASE_URL=https://jtifuhxkdadztdiicvlf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0aWZ1aHhrZGFkenRkaWljdmxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMTAxNDcsImV4cCI6MjA2MjY4NjE0N30.aPTuzMUEXUlZG8zfLpFcFO9O0-AwDMtF_5F7YOIflT8
```

### Super Administrator Setup

1. Run the super admin migration in Supabase SQL Editor:
```bash
# Execute: supabase/migrations/20250111_initial_setup.sql
```

2. Default super admin credentials:
```
Email: admin@joyeds.com
Password: SuperAdmin2024!
```

**⚠️ IMPORTANT: Change these credentials immediately after first login!**

### Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins: `https://jobshare.joyeds.com`
   - Authorized redirect URIs: `https://jtifuhxkdadztdiicvlf.supabase.co/auth/v1/callback`

5. In Supabase Dashboard:
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google Client ID and Client Secret

- Set redirect URL: `https://jobshare.joyeds.com/dashboard`
```bash
# Execute the SQL migration file in Supabase SQL Editor
```

5. Start development server
```bash
npm run dev
```

## 📦 Deployment

### Netlify Deployment

1. Build the project
```bash
npm run build:prod
```

2. Deploy to Netlify
- Connect your repository to Netlify
- Set build command: `npm run build:prod`
- Set publish directory: `dist`
- Add environment variables in Netlify dashboard

### Custom Domain Setup

1. Add custom domain in Netlify: `jobshare.joyeds.com`
2. Update DNS records to point to Netlify
3. Enable HTTPS (automatic with Netlify)

## 🔧 Configuration

### Supabase Setup

**Project URL**: `https://jtifuhxkdadztdiicvlf.supabase.co`

1. **Authentication**
   - Enable email authentication
   - Configure Google OAuth (optional)
   - Set up redirect URLs

2. **Database**
   - Run provided migrations
   - Set up Row Level Security (RLS)

3. **Storage**
   - Create 'files' bucket
   - Configure storage policies

### Environment Variables

```env
VITE_SUPABASE_URL=https://jtifuhxkdadztdiicvlf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0aWZ1aHhrZGFkenRkaWljdmxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMTAxNDcsImV4cCI6MjA2MjY4NjE0N30.aPTuzMUEXUlZG8zfLpFcFO9O0-AwDMtF_5F7YOIflT8
```

## 🔐 Security Features

- Row Level Security (RLS) on all tables
- Secure file upload with type validation
- Password-protected sharing links
- Role-based access control
- XSS and CSRF protection
- Secure headers configuration

## 📱 Mobile Support

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@joyeds.com or create an issue in the repository.

## 🎯 Roadmap

- [ ] File versioning
- [ ] Real-time collaboration
- [ ] Advanced search
- [ ] File comments
- [ ] API access
- [ ] Mobile app

---

Built with ❤️ by the Joyeds team