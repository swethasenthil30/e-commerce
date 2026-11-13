import React from 'react';
import { Loader2 } from 'lucide-react';

interface Props {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
}

export const LoadingSpinner: React.FC<Props> = ({ message = 'Loading...', size = 'md', fullHeight = false }) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10'
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center ${fullHeight ? 'min-h-[50vh]' : 'py-10'}`}>
      <Loader2 className={`${iconSizes} text-indigo-600 animate-spin`} />
      {message && <p className="mt-3 text-sm text-slate-500 font-medium">{message}</p>}
    </div>
  );
};
