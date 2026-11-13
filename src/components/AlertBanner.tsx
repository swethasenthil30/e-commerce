import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

interface Props {
  type?: 'error' | 'success' | 'info';
  message: string;
  onClose?: () => void;
}

export const AlertBanner: React.FC<Props> = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const styles = {
    error: 'bg-rose-50 border-rose-200 text-rose-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }[type];

  const icons = {
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
  }[type];

  return (
    <div className={`p-4 rounded-xl border flex items-start justify-between gap-3 shadow-xs mb-4 ${styles}`}>
      <div className="flex items-start gap-3">
        {icons}
        <p className="text-sm font-medium leading-relaxed">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
