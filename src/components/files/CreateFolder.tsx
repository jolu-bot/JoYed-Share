import React, { useState } from 'react';
import { FolderPlus, X } from 'lucide-react';
import { useFileOperations } from '../../hooks/useFileOperations';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface CreateFolderProps {
  parentId?: string;
  onFolderCreated?: () => void;
  onClose?: () => void;
}

const CreateFolder: React.FC<CreateFolderProps> = ({
  parentId,
  onFolderCreated,
  onClose
}) => {
  const [folderName, setFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { createFolder } = useFileOperations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    try {
      setIsCreating(true);
      await createFolder(folderName.trim(), parentId);
      onFolderCreated?.();
      onClose?.();
    } catch (error) {
      console.error('Create folder error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Create New Folder</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            id="folderName"
            type="text"
            label="Folder Name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name"
            required
            fullWidth
            autoFocus
          />

          <div className="flex justify-end space-x-3 mt-6">
            {onClose && (
              <Button variant="outline" onClick={onClose} disabled={isCreating}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              isLoading={isCreating}
              disabled={!folderName.trim() || isCreating}
              icon={<FolderPlus className="h-5 w-5" />}
            >
              Create Folder
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolder;