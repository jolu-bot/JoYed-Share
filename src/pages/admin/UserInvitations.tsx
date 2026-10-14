import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Plus, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Copy,
  User,
  Shield,
  ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Invitation {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  invitation_token: string;
  temporary_password: string;
  expires_at: string;
  accepted_at?: string;
  created_at: string;
  invited_by_user_id: string;
}

const UserInvitations: React.FC = () => {
  const { user, isSuperAdmin } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role: 'user' as 'user' | 'admin' | 'super_admin'
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchInvitations();
    }
  }, [isSuperAdmin]);

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('user_invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error: any) {
      console.error('Error fetching invitations:', error);
      toast.error('Erreur lors du chargement des invitations');
    } finally {
      setLoading(false);
    }
  };

  const createInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim()) return;

    setCreating(true);
    try {
      // Use the current user's ID as the inviter
      const { data, error } = await supabase.rpc('create_user_invitation', {
        p_email: formData.email.toLowerCase().trim(),
        p_role: formData.role,
        p_invited_by: user?.id
      });

      if (error) throw error;

      // Send invitation email (simulation)
      const invitationUrl = `https://jobshare.joyeds.com/accept-invitation?token=${data.invitation_token}`;
      
      // In a real app, you would send this via email service
      console.log('Invitation created:', {
        email: data.email,
        temporaryPassword: data.temporary_password,
        invitationUrl: invitationUrl
      });

      toast.success(`Invitation envoyée à ${data.email}`);
      
      // Show invitation details
      alert(`Invitation créée pour ${data.email}\n\nMot de passe temporaire: ${data.temporary_password}\n\nLien d'invitation: ${invitationUrl}\n\n⚠️ Envoyez ces informations à l'utilisateur par email sécurisé.`);

      setFormData({ email: '', role: 'user' });
      setShowCreateForm(false);
      fetchInvitations();
    } catch (error: any) {
      console.error('Error creating invitation:', error);
      toast.error(error.message || 'Erreur lors de la création de l\'invitation');
    } finally {
      setCreating(false);
    }
  };

  const copyInvitationDetails = (invitation: Invitation) => {
    const invitationUrl = `https://jobshare.joyeds.com/accept-invitation?token=${invitation.invitation_token}`;
    const details = `Invitation Job'Share

Email: ${invitation.email}
Mot de passe temporaire: ${invitation.temporary_password}
Lien d'invitation: ${invitationUrl}

Valide jusqu'au: ${new Date(invitation.expires_at).toLocaleDateString()}

Instructions:
1. Cliquez sur le lien d'invitation
2. Connectez-vous avec votre email et le mot de passe temporaire
3. Vous pourrez changer votre mot de passe lors de la première connexion`;

    navigator.clipboard.writeText(details);
    toast.success('Détails de l\'invitation copiés');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <ShieldCheck className="h-4 w-4 text-purple-600" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      super_admin: 'bg-purple-100 text-purple-800',
      admin: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      super_admin: 'Super Admin',
      admin: 'Admin',
      user: 'Utilisateur'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[role as keyof typeof colors]}`}>
        {getRoleIcon(role)}
        <span className="ml-1">{labels[role as keyof typeof labels]}</span>
      </span>
    );
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Accès Refusé</h3>
          <p className="text-gray-500">Seuls les super administrateurs peuvent gérer les invitations.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Invitations</h1>
        <Button
          variant="primary"
          icon={<Plus className="h-5 w-5" />}
          onClick={() => setShowCreateForm(true)}
        >
          Inviter un utilisateur
        </Button>
      </div>

      {/* Create Invitation Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Créer une invitation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createInvitation} className="space-y-4">
              <Input
                id="email"
                type="email"
                label="Adresse email"
                leftIcon={<Mail className="h-5 w-5" />}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="utilisateur@exemple.com"
                required
                fullWidth
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                  <option value="super_admin">Super Administrateur</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  disabled={creating}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={creating}
                  icon={<Send className="h-5 w-5" />}
                >
                  Créer l'invitation
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Invitations List */}
      <Card>
        <CardHeader>
          <CardTitle>Invitations envoyées</CardTitle>
        </CardHeader>
        <CardContent>
          {invitations.length > 0 ? (
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-gray-100">
                      <Mail className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{invitation.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getRoleBadge(invitation.role)}
                        <span className="text-xs text-gray-500">
                          Créée le {new Date(invitation.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {invitation.accepted_at ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-1" />
                        <span className="text-sm">Acceptée</span>
                      </div>
                    ) : new Date(invitation.expires_at) < new Date() ? (
                      <div className="flex items-center text-red-600">
                        <XCircle className="h-5 w-5 mr-1" />
                        <span className="text-sm">Expirée</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-orange-600">
                        <Clock className="h-5 w-5 mr-1" />
                        <span className="text-sm">En attente</span>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyInvitationDetails(invitation)}
                      icon={<Copy className="h-4 w-4" />}
                    >
                      Copier
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune invitation</h3>
              <p className="text-gray-500">Commencez par inviter votre premier utilisateur.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserInvitations;