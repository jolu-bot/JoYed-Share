import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const UpdatePassword: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes('access_token')) {
      navigate('/login');
    }
  }, [navigate]);

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Update your password</h2>
      <p className="text-gray-600 mb-6">
        Please enter your new password below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="password"
          type="password"
          label="New password"
          leftIcon={<Lock className="h-5 w-5" />}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) validatePassword(e.target.value);
            if (confirmPasswordError) validateConfirmPassword(confirmPassword);
          }}
          onBlur={() => validatePassword(password)}
          error={passwordError}
          required
          fullWidth
        />

        <Input
          id="confirmPassword"
          type="password"
          label="Confirm new password"
          leftIcon={<Lock className="h-5 w-5" />}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (confirmPasswordError) validateConfirmPassword(e.target.value);
          }}
          onBlur={() => validateConfirmPassword(confirmPassword)}
          error={confirmPasswordError}
          required
          fullWidth
        />

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading || !!passwordError || !!confirmPasswordError}
          className="w-full"
        >
          Update password
        </Button>
      </form>
    </div>
  );
};

export default UpdatePassword;