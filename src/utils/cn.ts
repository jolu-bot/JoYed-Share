import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper function for conditionally joining tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}