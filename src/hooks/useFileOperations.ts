import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../config/constants';
import toast from 'react-hot-toast';

export const useFileOperations = () => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const logActivity = async (action: string, resourceType: string, resourceId?: string, details?: any) => {
    if (!user) return;
    
    try {
      await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details: details || {}
        });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const uploadFile = async (file: File, folderId?: string) => {
    if (!user) throw new Error('Utilisateur non authentifié');
    
    // Validation du fichier
    if (file.size > APP_CONFIG.maxFileSize) {
      throw new Error(`Le fichier est trop volumineux. Taille maximale: ${APP_CONFIG.maxFileSize / (1024 * 1024)}MB`);
    }

    const isAllowed = APP_CONFIG.allowedFileTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -2));
      }
      return file.type === type;
    });

    if (!isAllowed) {
      throw new Error('Type de fichier non autorisé');
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileId = crypto.randomUUID();
      const fileName = `${fileId}-${file.name}`;
      const storagePath = `${user.id}/${fileName}`;

      // Upload vers Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(storagePath, file, {
          onUploadProgress: (progress) => {
            const percentage = (progress.loaded / progress.total) * 100;
            setUploadProgress(percentage);
          }
        });

      if (uploadError) throw uploadError;

      // Déterminer le type de fichier
      const getFileType = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return 'image';
        if (mimeType.startsWith('video/')) return 'video';
        if (mimeType.startsWith('audio/')) return 'audio';
        if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'document';
        return 'other';
      };

      // Sauvegarder les métadonnées en base
      const { error: dbError } = await supabase
        .from('files')
        .insert({
          id: fileId,
          user_id: user.id,
          name: file.name,
          storage_path: storagePath,
          mime_type: file.type,
          size_bytes: file.size,
          is_folder: false,
          parent_folder_id: folderId,
          metadata: {
            type: getFileType(file.type),
            uploaded_at: new Date().toISOString(),
            original_name: file.name
          }
        });

      if (dbError) throw dbError;

      await logActivity('upload', 'file', fileId, {
        file_name: file.name,
        file_size: file.size,
        file_type: file.type
      });

      toast.success('Fichier téléchargé avec succès');
      return fileId;
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Échec du téléchargement: ${error.message}`);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const createFolder = async (name: string, parentId?: string) => {
    if (!user) throw new Error('Utilisateur non authentifié');

    try {
      const folderId = crypto.randomUUID();
      const { error } = await supabase
        .from('files')
        .insert({
          id: folderId,
          user_id: user.id,
          name: name.trim(),
          storage_path: `${user.id}/folders/${folderId}`,
          is_folder: true,
          parent_folder_id: parentId,
          metadata: {
            created_at: new Date().toISOString()
          }
        });

      if (error) throw error;

      await logActivity('create', 'folder', folderId, {
        folder_name: name,
        parent_id: parentId
      });

      toast.success('Dossier créé avec succès');
      return folderId;
    } catch (error: any) {
      console.error('Create folder error:', error);
      toast.error(`Échec de création du dossier: ${error.message}`);
      throw error;
    }
  };

  const deleteFile = async (fileId: string) => {
    if (!user) throw new Error('Utilisateur non authentifié');

    try {
      // Récupérer les informations du fichier
      const { data: file, error: fetchError } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      // Supprimer du stockage si c'est un fichier
      if (!file.is_folder && file.storage_path) {
        const { error: storageError } = await supabase.storage
          .from('files')
          .remove([file.storage_path]);

        if (storageError) {
          console.warn('Storage deletion warning:', storageError);
        }
      }

      // Supprimer de la base de données
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId)
        .eq('user_id', user.id);

      if (dbError) throw dbError;

      await logActivity('delete', file.is_folder ? 'folder' : 'file', fileId, {
        name: file.name,
        type: file.is_folder ? 'folder' : 'file'
      });

      toast.success(`${file.is_folder ? 'Dossier' : 'Fichier'} supprimé avec succès`);
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(`Échec de suppression: ${error.message}`);
      throw error;
    }
  };

  const downloadFile = async (fileId: string) => {
    if (!user) throw new Error('Utilisateur non authentifié');

    try {
      // Récupérer les informations du fichier
      const { data: file, error: fetchError } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .single();

      if (fetchError) throw fetchError;

      // Vérifier les permissions
      if (file.user_id !== user.id) {
        throw new Error('Accès non autorisé');
      }

      if (file.is_folder) {
        throw new Error('Impossible de télécharger un dossier');
      }

      // Télécharger depuis le stockage
      const { data, error } = await supabase.storage
        .from('files')
        .download(file.storage_path);

      if (error) throw error;

      // Créer le lien de téléchargement
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      await logActivity('download', 'file', fileId, {
        file_name: file.name
      });

      toast.success('Fichier téléchargé avec succès');
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(`Échec du téléchargement: ${error.message}`);
      throw error;
    }
  };

  const shareFile = async (fileId: string, options: {
    password?: string;
    expiresAt?: Date;
    permissions?: { view: boolean; download: boolean };
  } = {}) => {
    if (!user) throw new Error('Utilisateur non authentifié');

    try {
      const accessToken = crypto.randomUUID();
      const shareUrl = `https://${APP_CONFIG.domain}/shared/${accessToken}`;

      const { error } = await supabase
        .from('shared_links')
        .insert({
          file_id: fileId,
          created_by_user_id: user.id,
          access_token: accessToken,
          password_hash: options.password ? btoa(options.password) : null,
          expires_at: options.expiresAt?.toISOString(),
          permissions: options.permissions || { view: true, download: true }
        });

      if (error) throw error;

      await logActivity('share', 'file', fileId, {
        share_url: shareUrl,
        has_password: !!options.password,
        expires_at: options.expiresAt?.toISOString()
      });

      toast.success('Lien de partage créé avec succès');
      return shareUrl;
    } catch (error: any) {
      console.error('Share error:', error);
      toast.error(`Échec du partage: ${error.message}`);
      throw error;
    }
  };

  return {
    uploadFile,
    createFolder,
    deleteFile,
    downloadFile,
    shareFile,
    isUploading,
    uploadProgress
  };
};