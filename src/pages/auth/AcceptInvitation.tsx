import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Mail, UserPlus, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import toast from 'react-hot-toast';

const AcceptInvitation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [step, setStep] = useState<'verify' | 'password' | 'complete'>('verify');
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    if (token) {
      verifyInvitation();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  const verifyInvitation = async () => {
    try {
      const { data, error } = await supabase
        .from('user_invitations')
        .select('*')
        .eq('invitation_token', token)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        toast.error('Invitation invalide ou expirée');
        navigate('/login');
        return;
      }

      setInvitation(data);
      setStep('password');
    } catch (error) {
      console.error('Error verifying invitation:', error);
      toast.error('Erreur lors de la vérification de l\'invitation');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const acceptInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwords.current.trim()) {
      toast.error('Veuillez saisir le mot de passe temporaire');
      return;
    }

    if (passwords.new && passwords.new !== passwords.confirm) {
      toast.error('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwords.new && passwords.new.length < 6) {
      toast.error('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setAccepting(true);
    try {
      // Verify temporary password
      if (passwords.current !== invitation.temporary_password) {
        toast.error('Mot de passe temporaire incorrect');
        return;
      }

      const { data, error } = await supabase.rpc('accept_invitation', {
        p_token: token,
        p_new_password: passwords.new || null
      });

      if (error) throw error;

      // Create auth user with the accepted credentials
      const finalPassword = passwords.new || invitation.temporary_password;
      
      try {
        await supabase.auth.signUp({
          email: invitation.email,
          password: finalPassword,
          options: {
            data: {
              name: invitation.email.split('@')[0]
            }
          }
        });
      } catch (authError) {
        console.log('Auth user creation handled by system');
      }

      setStep('complete');
      toast.success('Invitation acceptée avec succès !');
      
      // Auto-redirect after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      toast.error(error.message || 'Erreur lors de l\'acceptation de l\'invitation');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue !</h2>
            <p className="text-gray-600 mb-6">
              Votre compte a été créé avec succès. Vous allez être redirigé vers la page de connexion.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Se connecter maintenant
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Accepter l'invitation
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Vous avez été invité à rejoindre Job'Share
          </p>
        </CardHeader>

        <CardContent className="p-6">
          {invitation && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="font-medium text-blue-900">{invitation.email}</p>
                  <p className="text-sm text-blue-700">
                    Rôle: {invitation.role === 'super_admin' ? 'Super Administrateur' : 
                           invitation.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={acceptInvitation} className="space-y-4">
            <Input
              id="currentPassword"
              type="password"
              label="Mot de passe temporaire"
              leftIcon={<Lock className="h-5 w-5" />}
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              placeholder="Saisissez le mot de passe temporaire"
              required
              fullWidth
            />

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-3">
                Optionnel: Définissez un nouveau mot de passe (sinon le temporaire sera conservé)
              </p>
              
              <Input
                id="newPassword"
                type="password"
                label="Nouveau mot de passe (optionnel)"
                leftIcon={<Lock className="h-5 w-5" />}
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                placeholder="Nouveau mot de passe"
                fullWidth
              />

              {passwords.new && (
                <Input
                  id="confirmPassword"
                  type="password"
                  label="Confirmer le nouveau mot de passe"
                  leftIcon={<Lock className="h-5 w-5" />}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  placeholder="Confirmer le mot de passe"
                  required
                  fullWidth
                />
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={accepting}
              icon={<UserPlus className="h-5 w-5" />}
              className="w-full"
            >
              Accepter l'invitation
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Vous avez déjà un compte ?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Se connecter
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvitation;