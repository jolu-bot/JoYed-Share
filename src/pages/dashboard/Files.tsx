import React, { useState } from 'react';
import { 
  PlusCircle, 
  Upload, 
  Filter, 
  MoreVertical, 
  Grid, 
  List,
  FolderPlus,
  FilePlus,
  Folder,
  FileText,
  Video,
  Music,
  File
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useFiles, FileData } from '../../hooks/useFiles';
import { useFileOperations } from '../../hooks/useFileOperations';
import FileUpload from '../../components/files/FileUpload';
import CreateFolder from '../../components/files/CreateFolder';
import FileContextMenu from '../../components/files/FileContextMenu';
import { cn } from '../../utils/cn';

type ViewMode = 'grid' | 'list';

const Files: React.FC = () => {
  const { files, loading, refreshFiles } = useFiles();
  const { downloadFile } = useFileOperations();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    file: FileData;
    position: { x: number; y: number };
  } | null>(null);

  const toggleItemSelection = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleFolderClick = (folderId: string) => {
    console.log(`Navigate to folder: ${folderId}`);
    // In a real app, this would navigate to the folder contents
  };

  const handleFileClick = async (file: FileData) => {
    if (file.is_folder) {
      handleFolderClick(file.id);
    } else {
      try {
        await downloadFile(file.id);
      } catch (error) {
        console.error('Download failed:', error);
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent, file: FileData) => {
    e.preventDefault();
    setContextMenu({
      file,
      position: { x: e.clientX, y: e.clientY }
    });
  };

  const getFileIcon = (file: FileData) => {
    if (file.is_folder) {
      return <Folder className="h-6 w-6 text-blue-400" />;
    }
    
    const type = file.metadata?.type || 'other';
    switch (type) {
      case 'document':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'video':
        return <Video className="h-6 w-6 text-purple-500" />;
      case 'audio':
        return <Music className="h-6 w-6 text-green-500" />;
      case 'image':
        return <File className="h-6 w-6 text-orange-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const folders = files.filter(f => f.is_folder);
  const regularFiles = files.filter(f => !f.is_folder);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">My Files</h1>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Button
              variant="outline"
              icon={<PlusCircle className="h-5 w-5" />}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              New
            </Button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                    onClick={() => {
                      setShowCreateFolder(true);
                      setShowDropdown(false);
                    }}
                  >
                    <FolderPlus className="mr-3 h-5 w-5 text-gray-400" />
                    New Folder
                  </button>
                  <button
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                    onClick={() => {
                      setShowUpload(true);
                      setShowDropdown(false);
                    }}
                  >
                    <FilePlus className="mr-3 h-5 w-5 text-gray-400" />
                    New File
                  </button>
                </div>
              </div>
            )}
          </div>
          <Button
            variant="primary"
            icon={<Upload className="h-5 w-5" />}
            onClick={() => setShowUpload(true)}
          >
            Upload
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            onClick={() => setViewMode('grid')}
            icon={<Grid className="h-5 w-5" />}
            className="p-2"
          />
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            onClick={() => setViewMode('list')}
            icon={<List className="h-5 w-5" />}
            className="p-2"
          />
          <Button
            variant="outline"
            icon={<Filter className="h-5 w-5" />}
            className="ml-2"
          >
            Filter
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          {selectedItems.length > 0 ? (
            <span>{selectedItems.length} items selected</span>
          ) : (
            <span>{files.length} items</span>
          )}
        </div>
      </div>

      {/* Folders section */}
      {folders.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Folders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-2'}>
              {folders.map((folder) => (
                viewMode === 'grid' ? (
                  <div
                    key={folder.id}
                    className={cn(
                      'group relative flex flex-col rounded-lg border p-3 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer',
                      selectedItems.includes(folder.id) && 'border-blue-500 bg-blue-50'
                    )}
                    onClick={() => handleFileClick(folder)}
                    onContextMenu={(e) => handleContextMenu(e, folder)}
                  >
                    <div className="mb-2 flex justify-center">
                      <Folder className="h-12 w-12 text-blue-400" />
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="font-medium text-sm text-gray-900 text-center truncate w-full mb-1">{folder.name}</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                      <p className="truncate">Modified: {formatDate(folder.updated_at)}</p>
                    </div>
                  </div>
                ) : (
                  <div
                    key={folder.id}
                    className={`flex items-center p-3 rounded-lg border ${
                      selectedItems.includes(folder.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    } hover:border-blue-300 cursor-pointer`}
                    onClick={() => handleFileClick(folder)}
                    onContextMenu={(e) => handleContextMenu(e, folder)}
                  >
                    <Folder className="h-6 w-6 text-blue-400 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{folder.name}</p>
                      <p className="text-xs text-gray-500">Modified: {formatDate(folder.updated_at)}</p>
                    </div>
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <MoreVertical className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                )
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Files section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Files</CardTitle>
        </CardHeader>
        <CardContent>
          {regularFiles.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-2'}>
              {regularFiles.map((file) => (
                viewMode === 'grid' ? (
                  <div
                    key={file.id}
                    className={cn(
                      'group relative flex flex-col rounded-lg border p-3 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer',
                      selectedItems.includes(file.id) && 'border-blue-500 bg-blue-50'
                    )}
                    onClick={() => handleFileClick(file)}
                    onContextMenu={(e) => handleContextMenu(e, file)}
                  >
                    <div className="mb-2 flex justify-center">
                      {getFileIcon(file)}
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="font-medium text-sm text-gray-900 text-center truncate w-full mb-1">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size_bytes)}</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                      <p className="truncate">Modified: {formatDate(file.updated_at)}</p>
                    </div>
                  </div>
                ) : (
                  <div
                    key={file.id}
                    className={`flex items-center p-3 rounded-lg border ${
                      selectedItems.includes(file.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    } hover:border-blue-300 cursor-pointer`}
                    onClick={() => handleFileClick(file)}
                    onContextMenu={(e) => handleContextMenu(e, file)}
                  >
                    <div className="mr-3">
                      {getFileIcon(file)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(file.updated_at)} · {formatFileSize(file.size_bytes)}
                      </p>
                    </div>
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <MoreVertical className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                )
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <File className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files yet</h3>
              <p className="text-gray-500 mb-4">Upload your first file to get started</p>
              <Button
                variant="primary"
                icon={<Upload className="h-5 w-5" />}
                onClick={() => setShowUpload(true)}
              >
                Upload Files
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {showUpload && (
        <FileUpload
          onUploadComplete={() => {
            setShowUpload(false);
            refreshFiles();
          }}
          onClose={() => setShowUpload(false)}
        />
      )}

      {showCreateFolder && (
        <CreateFolder
          onFolderCreated={() => {
            setShowCreateFolder(false);
            refreshFiles();
          }}
          onClose={() => setShowCreateFolder(false)}
        />
      )}

      {contextMenu && (
        <FileContextMenu
          file={contextMenu.file}
          position={contextMenu.position}
          onClose={() => setContextMenu(null)}
          onRefresh={refreshFiles}
        />
      )}
    </div>
  );
};

export default Files;