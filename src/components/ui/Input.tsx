import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      fullWidth = false,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('mb-4', fullWidth ? 'w-full' : '')}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">{leftIcon}</span>
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'block rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
              'border p-2 w-full appearance-none',
              error ? 'border-red-500' : 'border-gray-300',
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">{rightIcon}</span>
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;