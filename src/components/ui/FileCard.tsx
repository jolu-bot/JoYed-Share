import React from 'react';
import { FileText, Video, Music, File, MoreVertical } from 'lucide-react';
import { cn } from '../../utils/cn';
import { FileItem } from '../../types';

interface FileCardProps {
  file: FileItem;
  onClick?: () => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  selected?: boolean;
  className?: string;
}

const FileCard: React.FC<FileCardProps> = ({
  file,
  onClick,
  onContextMenu,
  selected = false,
  className,
}) => {
  const fileIcon = () => {
    switch (file.type) {
      case 'document':
        return <FileText className="h-10 w-10 text-blue-500" />;
      case 'video':
        return <Video className="h-10 w-10 text-purple-500" />;
      case 'audio':
        return <Music className="h-10 w-10 text-green-500" />;
      default:
        return <File className="h-10 w-10 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-lg border p-3 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer',
        selected && 'border-blue-500 bg-blue-50',
        file.color && `border-l-4 border-l-${file.color}-500`,
        className
      )}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1 rounded-full hover:bg-gray-100">
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </button>
      </div>
      
      <div className="mb-2 flex justify-center">
        {file.thumbnail ? (
          <img 
            src={file.thumbnail} 
            alt={file.name} 
            className="h-16 w-16 object-cover rounded" 
          />
        ) : (
          fileIcon()
        )}
      </div>
      
      <div className="flex flex-col items-center">
        <p className="font-medium text-sm text-gray-900 text-center truncate w-full mb-1">{file.name}</p>
        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
        {file.isShared && (
          <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            Shared
          </span>
        )}
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
        <p className="truncate">Modified: {formatDate(file.modifiedAt)}</p>
      </div>
    </div>
  );
};

export default FileCard;