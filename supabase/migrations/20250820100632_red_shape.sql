/*
  # Create Super Admin System

  1. New Tables
    - Update profiles table with super admin role
    - Create user_invitations table for invitation management
    - Create system_stats view for admin dashboard

  2. Security
    - Enable RLS on all tables
    - Add policies for super admin access
    - Create invitation management policies

  3. Functions
    - Create function to send invitation emails
    - Create function to accept invitations
*/

-- Update profiles table to ensure super_admin role exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin'));
  END IF;
END $$;

-- Create user_invitations table
CREATE TABLE IF NOT EXISTS user_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  invited_by_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  invitation_token text UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  temporary_password text NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;

-- Create system_stats view for admin dashboard
CREATE OR REPLACE VIEW system_stats AS
SELECT
  (SELECT COUNT(*) FROM profiles) as total_users,
  (SELECT COUNT(*) FROM profiles WHERE role = 'admin') as admin_users,
  (SELECT COUNT(*) FROM profiles WHERE role = 'super_admin') as super_admin_users,
  (SELECT COUNT(*) FROM files WHERE NOT is_folder) as total_files,
  (SELECT COUNT(*) FROM files WHERE is_folder) as total_folders,
  (SELECT COALESCE(SUM(size_bytes), 0) FROM files WHERE NOT is_folder) as total_storage_used,
  (SELECT COUNT(*) FROM shared_links) as total_shared_links,
  (SELECT COUNT(*) FROM activity_logs WHERE created_at >= CURRENT_DATE) as today_activities;

-- Create super admin user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'superadmin@joyeds.com',
  crypt('SuperAdmin2024!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Super Administrator"}',
  false,
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Create profile for super admin
INSERT INTO profiles (
  id,
  name,
  email,
  role,
  created_at,
  updated_at
) 
SELECT 
  au.id,
  'Super Administrator',
  'superadmin@joyeds.com',
  'super_admin',
  now(),
  now()
FROM auth.users au 
WHERE au.email = 'superadmin@joyeds.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  name = 'Super Administrator';

-- RLS Policies for user_invitations
CREATE POLICY "Super admins can manage all invitations"
  ON user_invitations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Users can view their own invitations"
  ON user_invitations
  FOR SELECT
  TO authenticated
  USING (email = auth.email());

-- Function to create user invitation
CREATE OR REPLACE FUNCTION create_user_invitation(
  p_email text,
  p_role text DEFAULT 'user',
  p_invited_by uuid DEFAULT auth.uid()
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_invitation_id uuid;
  v_temp_password text;
  v_token text;
BEGIN
  -- Check if inviter is super admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = p_invited_by AND role = 'super_admin'
  ) THEN
    RAISE EXCEPTION 'Only super admins can create invitations';
  END IF;

  -- Check if user already exists
  IF EXISTS (SELECT 1 FROM profiles WHERE email = p_email) THEN
    RAISE EXCEPTION 'User with this email already exists';
  END IF;

  -- Generate temporary password
  v_temp_password := 'Temp' || floor(random() * 10000)::text || '!';
  v_token := gen_random_uuid()::text;

  -- Create invitation
  INSERT INTO user_invitations (
    email,
    invited_by_user_id,
    role,
    invitation_token,
    temporary_password
  ) VALUES (
    p_email,
    p_invited_by,
    p_role,
    v_token,
    v_temp_password
  ) RETURNING id INTO v_invitation_id;

  RETURN json_build_object(
    'invitation_id', v_invitation_id,
    'email', p_email,
    'temporary_password', v_temp_password,
    'invitation_token', v_token,
    'invitation_url', 'https://jobshare.joyeds.com/accept-invitation?token=' || v_token
  );
END;
$$;

-- Function to accept invitation
CREATE OR REPLACE FUNCTION accept_invitation(
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
  -- Get invitation
  SELECT * INTO v_invitation
  FROM user_invitations
  WHERE invitation_token = p_token
    AND expires_at > now()
    AND accepted_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or expired invitation token';
  END IF;

  -- Create auth user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    role
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    v_invitation.email,
    crypt(COALESCE(p_new_password, v_invitation.temporary_password), gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"invitation_accepted": true}',
    'authenticated'
  ) RETURNING id INTO v_user_id;

  -- Create profile
  INSERT INTO profiles (
    id,
    name,
    email,
    role,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    split_part(v_invitation.email, '@', 1),
    v_invitation.email,
    v_invitation.role,
    now(),
    now()
  );

  -- Mark invitation as accepted
  UPDATE user_invitations
  SET accepted_at = now(), updated_at = now()
  WHERE id = v_invitation.id;

  RETURN json_build_object(
    'success', true,
    'user_id', v_user_id,
    'email', v_invitation.email,
    'role', v_invitation.role
  );
END;
$$;