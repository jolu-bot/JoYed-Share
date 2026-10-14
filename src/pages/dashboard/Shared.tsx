import React, { useState } from 'react';
import { FileText, Video, Music, File, MoreVertical, Users, Filter, Grid, List, Folder, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useFiles } from '../../hooks/useFiles';
import { useFileOperations } from '../../hooks/useFileOperations';

type ViewMode = 'grid' | 'list';

const Shared: React.FC = () => {
  const { files, loading } = useFiles();
  const { downloadFile } = useFileOperations();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // For now, we'll show all files as "shared" since we don't have sharing implemented yet
  // In a real app, this would fetch files that are actually shared with the user
  const sharedFiles = files.filter(f => !f.is_folder);
  const sharedFolders = files.filter(f => f.is_folder);

  const toggleItemSelection = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleFolderClick = (folderId: string) => {
    console.log(`Navigate to shared folder: ${folderId}`);
    // In a real app, this would navigate to the folder contents
  };

  const handleFileClick = async (fileId: string) => {
    try {
      await downloadFile(fileId);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const getFileIcon = (type: string) => {
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
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">Shared with me</h1>
          <div className="ml-4 flex items-center">
            <Users className="h-5 w-5 text-blue-500 mr-1" />
            <span className="text-sm text-blue-500">{sharedFolders.length + sharedFiles.length} items</span>
          </div>
        </div>
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
      </div>

      {/* Folders section */}
      {sharedFolders.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Shared Folders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-2'}>
              {sharedFolders.map((folder) => (
                viewMode === 'grid' ? (
                  <div
                    key={folder.id}
                    className="group relative flex flex-col rounded-lg border p-3 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => handleFolderClick(folder.id)}
                  >
                    <div className="mb-2 flex justify-center">
                      <Folder className="h-12 w-12 text-blue-400" />
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="font-medium text-sm text-gray-900 text-center truncate w-full mb-1">{folder.name}</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                      <p className="truncate">Modified: {new Date(folder.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ) : (
                  <div
                    key={folder.id}
                    className={`flex items-center p-3 rounded-lg border ${
                      selectedItems.includes(folder.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    } hover:border-blue-300 cursor-pointer`}
                    onClick={() => handleFolderClick(folder.id)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      console.log(`Context menu for shared folder: ${folder.id}`);
                    }}
                  >
                    <Folder className="h-6 w-6 text-blue-400 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{folder.name}</p>
                      <p className="text-xs text-gray-500">
                        Modified: {new Date(folder.updated_at).toLocaleDateString()}
                      </p>
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
          <CardTitle>Shared Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-2'}>
            {sharedFiles.map((file) => (
              viewMode === 'grid' ? (
                <div
                  key={file.id}
                  className="group relative flex flex-col rounded-lg border p-3 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => handleFileClick(file.id)}
                >
                  <div className="mb-2 flex justify-center">
                    {getFileIcon(file.metadata?.type || 'other')}
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-medium text-sm text-gray-900 text-center truncate w-full mb-1">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size_bytes)}</p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                    <p className="truncate">Modified: {new Date(file.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ) : (
                <div
                  key={file.id}
                  className={`flex items-center p-3 rounded-lg border ${
                    selectedItems.includes(file.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  } hover:border-blue-300 cursor-pointer`}
                  onClick={() => handleFileClick(file.id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    console.log(`Context menu for file: ${file.id}`);
                  }}
                >
                  <div className="mr-3">
                    {getFileIcon(file.metadata?.type || 'other')}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(file.updated_at).toLocaleDateString()} · {formatFileSize(file.size_bytes)}
                    </p>
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
    </div>
  );
};

export default Shared;