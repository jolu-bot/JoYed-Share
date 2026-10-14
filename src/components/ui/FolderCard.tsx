import React from 'react';
import { Folder, Share2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Folder as FolderType } from '../../types';

interface FolderCardProps {
  folder: FolderType;
  onClick?: () => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  selected?: boolean;
  className?: string;
}

const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  onClick,
  onContextMenu,
  selected = false,
  className,
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-lg border p-3 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer',
        selected && 'border-blue-500 bg-blue-50',
        folder.color && `border-l-4 border-l-${folder.color}-500`,
        className
      )}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <div className="mb-2 flex justify-center">
        <Folder className="h-12 w-12 text-blue-400" />
      </div>
      
      <div className="flex flex-col items-center">
        <p className="font-medium text-sm text-gray-900 text-center truncate w-full mb-1">{folder.name}</p>
        {folder.isShared && (
          <div className="flex items-center text-xs text-blue-600 mt-1">
            <Share2 className="h-3 w-3 mr-1" />
            <span>Shared</span>
          </div>
        )}
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
        <p className="truncate">Modified: {formatDate(folder.modifiedAt)}</p>
      </div>
    </div>
  );
};

export default FolderCard;