import React, { useState } from 'react';
import { Trash2, FileText, Video, Music, File, MoreVertical, RotateCcw, Folder } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useFiles } from '../../hooks/useFiles';

const Trash: React.FC = () => {
  // For now, we'll show an empty trash since we don't have soft delete implemented
  const mockTrashedFiles: any[] = [];
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleItemSelection = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const restoreSelected = () => {
    console.log(`Restoring items: ${selectedItems.join(', ')}`);
    // In a real app, this would restore the selected items
    setSelectedItems([]);
  };

  const deleteSelected = () => {
    console.log(`Permanently deleting items: ${selectedItems.join(', ')}`);
    // In a real app, this would permanently delete the selected items
    setSelectedItems([]);
  };

  const emptyTrash = () => {
    console.log('Emptying trash');
    // In a real app, this would permanently delete all items in trash
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">Trash</h1>
          <div className="ml-4 flex items-center">
            <Trash2 className="h-5 w-5 text-red-500 mr-1" />
            <span className="text-sm text-gray-500">{mockTrashedFiles.length} items</span>
          </div>
        </div>
        <div className="flex space-x-3">
          {selectedItems.length > 0 && (
            <>
              <Button
                variant="outline"
                icon={<RotateCcw className="h-5 w-5" />}
                onClick={restoreSelected}
              >
                Restore
              </Button>
              <Button
                variant="danger"
                icon={<Trash2 className="h-5 w-5" />}
                onClick={deleteSelected}
              >
                Delete Forever
              </Button>
            </>
          )}
          {trashedFiles.length > 0 && (
            <Button
              variant="outline"
              onClick={emptyTrash}
            >
              Empty Trash
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Deleted Items</CardTitle>
        </CardHeader>
        <CardContent>
          {mockTrashedFiles.length > 0 ? (
            <div className="space-y-2">
              {mockTrashedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center p-3 rounded-lg border ${
                    selectedItems.includes(file.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  } hover:border-gray-300 cursor-pointer`}
                  onClick={() => toggleItemSelection(file.id)}
                >
                  <div className="mr-3">
                    {file.metadata?.type === 'document' && <FileText className="h-6 w-6 text-blue-500" />}
                    {file.metadata?.type === 'video' && <Video className="h-6 w-6 text-purple-500" />}
                    {file.metadata?.type === 'audio' && <Music className="h-6 w-6 text-green-500" />}
                    {file.metadata?.type !== 'document' && file.metadata?.type !== 'video' && file.metadata?.type !== 'audio' && (
                      <File className="h-6 w-6 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      Deleted: {formatDate(file.updated_at)} · {formatFileSize(file.size_bytes)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="p-1 rounded-full hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`Restore file: ${file.id}`);
                      }}
                    >
                      <RotateCcw className="h-5 w-5 text-gray-500" />
                    </button>
                    <button
                      className="p-1 rounded-full hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`Permanently delete file: ${file.id}`);
                      }}
                    >
                      <Trash2 className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Trash2 className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Trash is empty</h3>
              <p className="text-sm text-gray-500 mt-1">
                Items in Trash will be automatically deleted after 30 days
              </p>
            </div>
          )}
        </CardContent>
        {mockTrashedFiles.length > 0 && (
          <CardFooter className="border-t border-gray-200 bg-gray-50 px-6 py-3">
            <p className="text-xs text-gray-500">
              Items in Trash will be automatically deleted after 30 days
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Trash;