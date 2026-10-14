import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export interface FileData {
  id: string;
  name: string;
  storage_path: string;
  mime_type?: string;
  size_bytes?: number;
  is_folder: boolean;
  parent_folder_id?: string;
  created_at: string;
  updated_at: string;
  metadata?: any;
  user_id: string;
}

export const useFiles = (folderId?: string) => {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (folderId) {
        query = query.eq('parent_folder_id', folderId);
      } else {
        query = query.is('parent_folder_id', null);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Fetch files error:', fetchError);
        // En cas d'erreur, on retourne une liste vide plutôt que de planter
        setFiles([]);
        setError('Impossible de charger les fichiers pour le moment');
        return;
      }

      setFiles(data || []);
    } catch (err: any) {
      console.error('Error in fetchFiles:', err);
      setFiles([]);
      setError('Erreur lors du chargement des fichiers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [user, folderId]);

  const refreshFiles = () => {
    fetchFiles();
  };

  // Statistiques des fichiers
  const getFileStats = () => {
    const totalFiles = files.filter(f => !f.is_folder).length;
    const totalFolders = files.filter(f => f.is_folder).length;
    const totalSize = files
      .filter(f => !f.is_folder)
      .reduce((acc, file) => acc + (file.size_bytes || 0), 0);

    return {
      totalFiles,
      totalFolders,
      totalSize,
      totalItems: files.length
    };
  };

  // Filtrer les fichiers par type
  const getFilesByType = (type: string) => {
    return files.filter(file => 
      !file.is_folder && 
      file.metadata?.type === type
    );
  };

  // Rechercher des fichiers
  const searchFiles = (query: string) => {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return files;

    return files.filter(file =>
      file.name.toLowerCase().includes(searchTerm) ||
      (file.metadata?.type && file.metadata.type.toLowerCase().includes(searchTerm))
    );
  };

  // Trier les fichiers
  const sortFiles = (sortBy: 'name' | 'date' | 'size', order: 'asc' | 'desc' = 'asc') => {
    const sorted = [...files].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'size':
          comparison = (a.size_bytes || 0) - (b.size_bytes || 0);
          break;
      }

      return order === 'desc' ? -comparison : comparison;
    });

    setFiles(sorted);
  };

  return {
    files,
    loading,
    error,
    refreshFiles,
    getFileStats,
    getFilesByType,
    searchFiles,
    sortFiles
  };
};