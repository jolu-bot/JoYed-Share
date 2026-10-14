import React from 'react';
import { cn } from '../../utils/cn';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className,
  status,
}) => {
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };

  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className={cn(
            'rounded-full object-cover',
            sizeClasses[size],
            className
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center bg-blue-100 text-blue-600 font-medium',
            sizeClasses[size],
            className
          )}
          aria-label={name || 'Avatar'}
        >
          {name ? getInitials(name) : '?'}
        </div>
      )}
      
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
            statusClasses[status],
            size === 'xs' || size === 'sm' ? 'h-2 w-2' : 'h-3 w-3'
          )}
        />
      )}
    </div>
  );
};

export default Avatar;