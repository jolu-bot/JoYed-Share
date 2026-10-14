import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Login: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError(t('auth.emailRequired'));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(t('auth.invalidEmail'));
      return false;
    }
    setEmailError(null);
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError(t('auth.passwordRequired'));
      return false;
    }
    if (password.length < 6) {
      setPasswordError(t('auth.passwordTooShort'));
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate inputs before submission
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);
    
    try {
      await login(email, password);
    } catch (err: any) {
      // Handle specific error cases
      if (err?.message?.includes('invalid_credentials')) {
        setError(t('auth.invalidCredentials'));
      } else if (err?.message?.includes('network')) {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    
    try {
      setIsLoading(true);
      await loginWithGoogle();
      // Don't set loading to false here as redirect will happen
    } catch (err: any) {
      setIsLoading(false);
      
      if (err?.message?.includes('popup')) {
        setError('Popup de connexion fermé. Veuillez réessayer.');
      } else if (err?.message?.includes('network')) {
        setError('Erreur réseau. Vérifiez votre connexion internet.');
      } else if (err?.message?.includes('unauthorized')) {
        setError('Accès non autorisé. Contactez l\'administrateur.');
      } else {
        setError('Connexion Google échouée. Veuillez réessayer.');
      }
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="email"
          type="email"
          label={t('auth.email')}
          leftIcon={<Mail className="h-5 w-5" />}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) validateEmail(e.target.value);
          }}
          onBlur={() => validateEmail(email)}
          error={emailError}
          required
          fullWidth
        />

        <Input
          id="password"
          type="password"
          label={t('auth.password')}
          leftIcon={<Lock className="h-5 w-5" />}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) validatePassword(e.target.value);
          }}
          onBlur={() => validatePassword(password)}
          error={passwordError}
          required
          fullWidth
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              {t('auth.rememberMe')}
            </label>
          </div>

          <div className="text-sm">
            <Link to="/reset-password" className="font-medium text-blue-600 hover:text-blue-500">
              {t('auth.forgotPassword')}
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          icon={<LogIn className="h-5 w-5" />}
          className="w-full"
          disabled={isLoading || !!emailError || !!passwordError}
        >
          {t('auth.login')}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {t('auth.signInWithGoogle')}
          </Button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {t('auth.dontHaveAccount')}{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            {t('auth.register')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;