import React, { useState } from 'react';
import { X, Copy, Mail, Link as LinkIcon, Calendar, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

interface ShareModalProps {
  fileId: string;
  fileName: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ fileId, fileName, onClose }) => {
  const { user } = useAuth();
  const [shareLink, setShareLink] = useState<string>('');
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState('');

  const createShareLink = async () => {
    if (!user) return;

    setIsCreating(true);
    try {
      const accessToken = uuidv4();
      const accessToken = crypto.randomUUID();
      const shareUrl = `${window.location.origin}/shared/${accessToken}`;

      const { error } = await supabase
        .from('shared_links')
        .insert({
          file_id: fileId,
          created_by_user_id: user.id,
          access_token: accessToken,
          password_hash: password ? btoa(password) : null,
          expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
          permissions: { download: true, view: true }
        });

      if (error) throw error;

      setShareLink(shareUrl);
      toast.success('Share link created successfully');
    } catch (error: any) {
      toast.error(`Failed to create share link: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success('Link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const sendByEmail = async () => {
    if (!emailRecipients.trim()) {
      toast.error('Please enter email addresses');
      return;
    }

    // In a real app, this would send emails via an API
    toast.success('Share invitations sent by email');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Share "{fileName}"</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {!shareLink ? (
            <>
              <Input
                id="password"
                type="password"
                label="Password (optional)"
                leftIcon={<Lock className="h-5 w-5" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Set password for link"
                fullWidth
              />

              <Input
                id="expiresAt"
                type="datetime-local"
                label="Expires at (optional)"
                leftIcon={<Calendar className="h-5 w-5" />}
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                fullWidth
              />

              <Button
                variant="primary"
                onClick={createShareLink}
                isLoading={isCreating}
                icon={<LinkIcon className="h-5 w-5" />}
                className="w-full"
              >
                Create Share Link
              </Button>
            </>
          ) : (
            <>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Share link:</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 text-sm bg-white border border-gray-300 rounded px-3 py-2"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    icon={<Copy className="h-4 w-4" />}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <Input
                  id="emailRecipients"
                  type="email"
                  label="Send by email"
                  leftIcon={<Mail className="h-5 w-5" />}
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                  placeholder="Enter email addresses (comma separated)"
                  fullWidth
                />
                <Button
                  variant="secondary"
                  onClick={sendByEmail}
                  icon={<Mail className="h-5 w-5" />}
                  className="w-full mt-2"
                >
                  Send Invitations
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;