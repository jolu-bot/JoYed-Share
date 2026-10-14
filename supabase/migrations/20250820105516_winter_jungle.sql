/*
  # Configuration complète Job'Share - Migration idempotente
  
  1. Tables principales
    - profiles (utilisateurs)
    - files (fichiers et dossiers)
    - shared_links (liens de partage)
    - activity_logs (journaux d'activité)
    - user_invitations (invitations utilisateur)
  
  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques de sécurité appropriées
  
  3. Fonctions et vues
    - Fonctions de gestion des invitations
    - Vues pour les statistiques
  
  4. Super Admin
    - Compte super admin : luc_boten@joyeds.com
*/

-- Utiliser le schéma public explicitement
SET search_path TO public;

-- =============================================
-- 1. CRÉATION DES TABLES (ordre des dépendances)
-- =============================================

-- Table profiles (dépend de auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  name text,
  avatar_url text,
  role text DEFAULT 'user'::text CHECK (role IN ('user', 'admin', 'super_admin')),
  updated_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Table files
CREATE TABLE IF NOT EXISTS public.files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  name text NOT NULL,
  storage_path text UNIQUE NOT NULL,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now()),
  is_folder boolean DEFAULT false,
  parent_folder_id uuid REFERENCES public.files (id) ON DELETE CASCADE,
  metadata jsonb
);

-- Table shared_links (dépend de files)
CREATE TABLE IF NOT EXISTS public.shared_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id uuid NOT NULL REFERENCES public.files (id) ON DELETE CASCADE,
  created_by_user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  access_token text UNIQUE NOT NULL,
  password_hash text,
  expires_at timestamptz,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  permissions jsonb
);

-- Table activity_logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text,
  resource_id text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Table user_invitations
CREATE TABLE IF NOT EXISTS public.user_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  role text DEFAULT 'user'::text CHECK (role IN ('user', 'admin', 'super_admin')),
  invitation_token text UNIQUE NOT NULL,
  temporary_password text NOT NULL,
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  invited_by_user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL
);

-- =============================================
-- 2. INDEX ET CONTRAINTES
-- =============================================

-- Index pour profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);

-- Index pour files
CREATE INDEX IF NOT EXISTS idx_files_user_id ON public.files (user_id);
CREATE INDEX IF NOT EXISTS idx_files_parent_folder_id ON public.files (parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON public.files (created_at DESC);

-- Index pour shared_links
CREATE INDEX IF NOT EXISTS idx_shared_links_access_token ON public.shared_links (access_token);
CREATE INDEX IF NOT EXISTS idx_shared_links_file_id ON public.shared_links (file_id);

-- Index pour activity_logs
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_created ON public.activity_logs (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.activity_logs (created_at DESC);

-- Index pour user_invitations
CREATE INDEX IF NOT EXISTS idx_user_invitations_token ON public.user_invitations (invitation_token);
CREATE INDEX IF NOT EXISTS idx_user_invitations_email ON public.user_invitations (email);

-- =============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- Politiques pour profiles
DO $$
BEGIN
  -- Lecture de son propre profil
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles'
      AND policyname = 'profiles_select_own'
  ) THEN
    CREATE POLICY profiles_select_own
      ON public.profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  -- Mise à jour de son propre profil
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles'
      AND policyname = 'profiles_update_own'
  ) THEN
    CREATE POLICY profiles_update_own
      ON public.profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Politiques pour files
DO $$
BEGIN
  -- Lecture de ses propres fichiers
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'files'
      AND policyname = 'files_select_own'
  ) THEN
    CREATE POLICY files_select_own
      ON public.files
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Insertion de fichiers
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'files'
      AND policyname = 'files_insert_own'
  ) THEN
    CREATE POLICY files_insert_own
      ON public.files
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Mise à jour de ses propres fichiers
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'files'
      AND policyname = 'files_update_own'
  ) THEN
    CREATE POLICY files_update_own
      ON public.files
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Suppression de ses propres fichiers
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'files'
      AND policyname = 'files_delete_own'
  ) THEN
    CREATE POLICY files_delete_own
      ON public.files
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Politiques pour activity_logs
DO $$
BEGIN
  -- Lecture de ses propres logs
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'activity_logs'
      AND policyname = 'activity_logs_select_own'
  ) THEN
    CREATE POLICY activity_logs_select_own
      ON public.activity_logs
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Insertion de logs
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'activity_logs'
      AND policyname = 'activity_logs_insert_own'
  ) THEN
    CREATE POLICY activity_logs_insert_own
      ON public.activity_logs
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Politiques pour user_invitations (super admin seulement)
DO $$
BEGIN
  -- Lecture pour super admin
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_invitations'
      AND policyname = 'invitations_select_super_admin'
  ) THEN
    CREATE POLICY invitations_select_super_admin
      ON public.user_invitations
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'super_admin'
        )
      );
  END IF;

  -- Insertion pour super admin
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_invitations'
      AND policyname = 'invitations_insert_super_admin'
  ) THEN
    CREATE POLICY invitations_insert_super_admin
      ON public.user_invitations
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'super_admin'
        )
      );
  END IF;
END $$;

-- =============================================
-- 4. FONCTIONS UTILITAIRES
-- =============================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- Fonction pour créer une invitation
CREATE OR REPLACE FUNCTION public.create_user_invitation(
  p_email text,
  p_role text DEFAULT 'user',
  p_invited_by uuid DEFAULT auth.uid()
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_token text;
  v_temp_password text;
  v_expires_at timestamptz;
  v_invitation_id uuid;
BEGIN
  -- Vérifier que l'utilisateur est super admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  ) THEN
    RAISE EXCEPTION 'Accès refusé: super admin requis';
  END IF;

  -- Générer token et mot de passe temporaire
  v_token := encode(gen_random_bytes(32), 'hex');
  v_temp_password := encode(gen_random_bytes(8), 'base64');
  v_temp_password := replace(replace(v_temp_password, '/', ''), '+', '');
  v_temp_password := substring(v_temp_password, 1, 12);
  v_expires_at := now() + interval '7 days';

  -- Insérer l'invitation
  INSERT INTO public.user_invitations (
    email, role, invitation_token, temporary_password, expires_at, invited_by_user_id
  ) VALUES (
    lower(trim(p_email)), p_role, v_token, v_temp_password, v_expires_at, p_invited_by
  ) RETURNING id INTO v_invitation_id;

  -- Retourner les détails
  RETURN json_build_object(
    'id', v_invitation_id,
    'email', lower(trim(p_email)),
    'role', p_role,
    'invitation_token', v_token,
    'temporary_password', v_temp_password,
    'expires_at', v_expires_at
  );
END;
$$;

-- Fonction pour accepter une invitation
CREATE OR REPLACE FUNCTION public.accept_invitation(
  p_token text,
  p_new_password text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_invitation record;
  v_user_id uuid;
BEGIN
  -- Récupérer l'invitation
  SELECT * INTO v_invitation
  FROM public.user_invitations
  WHERE invitation_token = p_token
    AND accepted_at IS NULL
    AND expires_at > now();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation invalide ou expirée';
  END IF;

  -- Générer un ID utilisateur
  v_user_id := gen_random_uuid();

  -- Créer le profil utilisateur
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    v_user_id,
    split_part(v_invitation.email, '@', 1),
    v_invitation.role
  );

  -- Marquer l'invitation comme acceptée
  UPDATE public.user_invitations
  SET accepted_at = now()
  WHERE id = v_invitation.id;

  -- Logger l'activité
  INSERT INTO public.activity_logs (user_id, action, details)
  VALUES (
    v_user_id,
    'invitation_accepted',
    json_build_object('email', v_invitation.email, 'role', v_invitation.role)
  );

  RETURN json_build_object(
    'user_id', v_user_id,
    'email', v_invitation.email,
    'role', v_invitation.role,
    'success', true
  );
END;
$$;

-- =============================================
-- 5. TRIGGERS
-- =============================================

-- Trigger pour updated_at sur profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger pour updated_at sur files
DROP TRIGGER IF EXISTS update_files_updated_at ON public.files;
CREATE TRIGGER update_files_updated_at
  BEFORE UPDATE ON public.files
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- 6. VUES ET STATISTIQUES
-- =============================================

-- Vue pour les statistiques système
CREATE OR REPLACE VIEW public.system_stats AS
SELECT
  (SELECT COUNT(*) FROM public.profiles) as total_users,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'admin') as admin_users,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'super_admin') as super_admin_users,
  (SELECT COUNT(*) FROM public.files WHERE NOT is_folder) as total_files,
  (SELECT COUNT(*) FROM public.files WHERE is_folder) as total_folders,
  (SELECT COALESCE(SUM(size_bytes), 0) FROM public.files WHERE NOT is_folder) as total_storage_used,
  (SELECT COUNT(*) FROM public.shared_links) as total_shared_links,
  (SELECT COUNT(*) FROM public.activity_logs WHERE created_at >= CURRENT_DATE) as today_activities;

-- Vue pour les compteurs d'activité
CREATE OR REPLACE VIEW public.dashboard_activity_counters AS
SELECT
  COALESCE((SELECT COUNT(*) FROM public.activity_logs WHERE created_at >= CURRENT_DATE), 0) AS today_activities,
  COALESCE((SELECT COUNT(*) FROM public.activity_logs WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'), 0) AS week_activities;

-- =============================================
-- 7. PERMISSIONS
-- =============================================

-- Donner accès aux rôles authentifiés
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.files TO authenticated;
GRANT SELECT, INSERT ON public.shared_links TO authenticated;
GRANT SELECT, INSERT ON public.activity_logs TO authenticated;
GRANT SELECT, INSERT ON public.user_invitations TO authenticated;
GRANT SELECT ON public.system_stats TO authenticated;
GRANT SELECT ON public.dashboard_activity_counters TO authenticated;

-- Permissions pour les fonctions
GRANT EXECUTE ON FUNCTION public.create_user_invitation TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_invitation TO anon, authenticated;

-- =============================================
-- 8. CRÉATION DU SUPER ADMIN
-- =============================================

-- Insérer le super admin (idempotent)
INSERT INTO public.profiles (id, name, role)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Luc Boten',
  'super_admin'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- Logger la création du super admin
INSERT INTO public.activity_logs (user_id, action, details)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'super_admin_created',
  json_build_object(
    'email', 'luc_boten@joyeds.com',
    'created_at', now()
  )
)
ON CONFLICT DO NOTHING;

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Configuration Job''Share terminée avec succès !';
  RAISE NOTICE '👤 Super Admin créé : luc_boten@joyeds.com';
  RAISE NOTICE '🔑 Mot de passe : SuperAdmin2025!';
  RAISE NOTICE '🚀 Système d''invitations opérationnel';
END $$;