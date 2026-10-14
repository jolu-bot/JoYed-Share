import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast.success('Password reset instructions sent to your email');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center">
        <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
          <Mail className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
        <p className="text-gray-600 mb-6">
          We've sent password reset instructions to {email}
        </p>
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={() => setEmailSent(false)}
            className="w-full"
          >
            Try another email
          </Button>
          <Link to="/login" className="block">
            <Button
              variant="outline"
              icon={<ArrowLeft className="h-5 w-5" />}
              className="w-full"
            >
              Back to login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset your password</h2>
      <p className="text-gray-600 mb-6">
        Enter your email address and we'll send you instructions to reset your password.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="email"
          type="email"
          label="Email address"
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

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading || !!emailError}
          className="w-full"
        >
          Send reset instructions
        </Button>

        <Link to="/login" className="block">
          <Button
            type="button"
            variant="outline"
            icon={<ArrowLeft className="h-5 w-5" />}
            className="w-full"
          >
            Back to login
          </Button>
        </Link>
      </form>
    </div>
  );
};

export default ResetPassword;