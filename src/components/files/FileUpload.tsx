import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { useFileOperations } from '../../hooks/useFileOperations';
import Button from '../ui/Button';

interface FileUploadProps {
  folderId?: string;
  onUploadComplete?: () => void;
  onClose?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  folderId,
  onUploadComplete,
  onClose
}) => {
  const { uploadFile, isUploading, uploadProgress } = useFileOperations();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      for (const file of acceptedFiles) {
        await uploadFile(file, folderId);
      }
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload error:', error);
    }
  }, [uploadFile, folderId, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upload Files</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-blue-600">Drop the files here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Drag & drop files here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Maximum file size: 100MB
              </p>
            </div>
          )}
        </div>

        {isUploading && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Uploading...</span>
              <span className="text-sm text-gray-600">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          {onClose && (
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            onClick={() => {
              const input = document.querySelector('input[type="file"]') as HTMLInputElement;
              input?.click();
            }}
            disabled={isUploading}
            icon={<File className="h-5 w-5" />}
          >
            Select Files
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;