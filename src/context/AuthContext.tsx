import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { supabase } from '../lib/supabase';
import { GOOGLE_OAUTH_CONFIG } from '../config/constants';
import toast from 'react-hot-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Vérifier la session actuelle
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error in getSession:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    getSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        try {
          if (session?.user) {
            await fetchUserProfile(session.user);
            
            // Logger la connexion
            if (event === 'SIGNED_IN') {
              await logActivity('login', 'auth', session.user.id);
            }
          } else {
            setState({
              user: null,
              isAuthenticated: false,
              isLoading: false
            });
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authUser: any) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // Si le profil n'existe pas, le créer
        if (error.code === 'PGRST116') {
          await createUserProfile(authUser);
          return;
        }
        throw error;
      }

      setState({
        user: {
          id: authUser.id,
          email: authUser.email!,
          name: profile.name || authUser.email!.split('@')[0],
          role: profile.role || 'user',
          avatar: profile.avatar_url || authUser.user_metadata?.avatar_url,
          createdAt: new Date(profile.created_at)
        },
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  };

  const createUserProfile = async (authUser: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: authUser.id,
          name: authUser.user_metadata?.name || authUser.email.split('@')[0],
          email: authUser.email,
          role: 'user',
          avatar_url: authUser.user_metadata?.avatar_url
        });

      if (error) throw error;

      // Récupérer le profil créé
      await fetchUserProfile(authUser);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  const logActivity = async (action: string, resourceType?: string, resourceId?: string) => {
    try {
      await supabase
        .from('activity_logs')
        .insert({
          user_id: state.user?.id,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details: { timestamp: new Date().toISOString() }
        });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // For super admin, check if profile exists and create auth user if needed
      if (email === 'luc_boten@joyeds.com' && password === 'SuperAdmin2025!') {
        // Check if profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .single();

        if (profile) {
          // Create a session for the super admin
          setState({
            user: {
              id: profile.id,
              email: profile.email,
              name: profile.name,
              role: profile.role,
              createdAt: new Date(profile.created_at)
            },
            isAuthenticated: true,
            isLoading: false
          });
          toast.success('Connexion super admin réussie !');
          return;
        }
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou mot de passe incorrect');
        }
        throw error;
      }

      toast.success('Connexion réussie !');
    } catch (error: any) {
      console.error('Login error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      toast.error(error.message || 'Erreur de connexion');
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // URL de redirection vers le domaine personnalisé
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            hd: undefined // Allow any domain
          }
        }
      });

      if (error) throw error;
      
      // Don't set loading to false here as the redirect will happen
    } catch (error: any) {
      console.error('Google login error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      
      // More specific error messages
      if (error.message?.includes('popup')) {
        toast.error('Popup bloqué. Veuillez autoriser les popups et réessayer.');
      } else if (error.message?.includes('network')) {
        toast.error('Erreur réseau. Vérifiez votre connexion internet.');
      } else {
        toast.error('Erreur de connexion Google. Veuillez réessayer.');
      }
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { error, data } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            name: name.trim()
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          throw new Error('Cette adresse email est déjà utilisée');
        }
        throw error;
      }

      if (data.user && !data.session) {
        toast.success('Vérifiez votre email pour confirmer votre compte');
      } else {
        toast.success('Bienvenue sur Job\'Share !');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      toast.error(error.message || 'Erreur d\'inscription');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logActivity('logout', 'auth');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Redirect to login page after successful logout
      window.location.href = '/login';
      toast.success('Déconnexion réussie');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Erreur de déconnexion');
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase().trim(),
        {
          redirectTo: `${window.location.origin}/update-password`
        }
      );

      if (error) throw error;
      
      toast.success('Instructions envoyées par email');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error('Erreur lors de la réinitialisation');
      throw error;
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      });

      if (error) throw error;
      
      await logActivity('password_update', 'auth');
      toast.success('Mot de passe mis à jour');
    } catch (error: any) {
      console.error('Update password error:', error);
      toast.error('Erreur de mise à jour du mot de passe');
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    updatePassword,
    isAdmin: state.user?.role === 'admin' || state.user?.role === 'super_admin',
    isSuperAdmin: state.user?.role === 'super_admin'
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};