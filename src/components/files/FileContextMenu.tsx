import React from 'react';
import { Download, Share, Edit, Trash2, Star, Copy } from 'lucide-react';
import { FileData } from '../../hooks/useFiles';
import { useFileOperations } from '../../hooks/useFileOperations';

interface FileContextMenuProps {
  file: FileData;
  position: { x: number; y: number };
  onClose: () => void;
  onRefresh: () => void;
}

const FileContextMenu: React.FC<FileContextMenuProps> = ({
  file,
  position,
  onClose,
  onRefresh
}) => {
  const { downloadFile, deleteFile } = useFileOperations();

  const handleAction = async (action: string) => {
    try {
      switch (action) {
        case 'download':
          if (!file.is_folder) {
            await downloadFile(file.id);
          }
          break;
        case 'delete':
          if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
            await deleteFile(file.id);
            onRefresh();
          }
          break;
        case 'share':
          // TODO: Implement sharing
          console.log('Share file:', file.id);
          break;
        case 'rename':
          // TODO: Implement rename
          console.log('Rename file:', file.id);
          break;
        case 'star':
          // TODO: Implement starring
          console.log('Star file:', file.id);
          break;
        case 'copy':
          // TODO: Implement copy
          console.log('Copy file:', file.id);
          break;
      }
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div
        className="fixed bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50 min-w-48"
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        {!file.is_folder && (
          <button
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => handleAction('download')}
          >
            <Download className="mr-3 h-4 w-4" />
            Download
          </button>
        )}
        
        <button
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          onClick={() => handleAction('share')}
        >
          <Share className="mr-3 h-4 w-4" />
          Share
        </button>
        
        <button
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          onClick={() => handleAction('rename')}
        >
          <Edit className="mr-3 h-4 w-4" />
          Rename
        </button>
        
        <button
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          onClick={() => handleAction('star')}
        >
          <Star className="mr-3 h-4 w-4" />
          Add to Starred
        </button>
        
        <button
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          onClick={() => handleAction('copy')}
        >
          <Copy className="mr-3 h-4 w-4" />
          Make a Copy
        </button>
        
        <hr className="my-1" />
        
        <button
          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          onClick={() => handleAction('delete')}
        >
          <Trash2 className="mr-3 h-4 w-4" />
          Delete
        </button>
      </div>
    </>
  );
};

export default FileContextMenu;