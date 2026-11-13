import React from 'react';
import { OrderStatus } from '../types/index.ts';
import { Clock, CheckCircle2, Truck, PackageCheck, XCircle } from 'lucide-react';

interface Props {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const configs: Record<
    OrderStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    Pending: {
      label: 'Order Pending',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: <Clock className="w-3.5 h-3.5" />
    },
    Confirmed: {
      label: 'Confirmed',
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />
    },
    Shipped: {
      label: 'On the Way (Shipped)',
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-200',
      icon: <Truck className="w-3.5 h-3.5" />
    },
    Delivered: {
      label: 'Delivered',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: <PackageCheck className="w-3.5 h-3.5" />
    },
    Cancelled: {
      label: 'Cancelled',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      icon: <XCircle className="w-3.5 h-3.5" />
    }
  };

  const config = configs[status] || configs.Pending;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
