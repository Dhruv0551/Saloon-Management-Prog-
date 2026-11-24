import React from 'react';
import { QueueStatus, BarberStatus } from '../types/queue';
import { useLanguage } from '../i18n/LanguageContext';

interface StatusBadgeProps {
  status: QueueStatus | BarberStatus;
  className?: string;
  pulsing?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', pulsing = false }) => {
  const { t } = useLanguage();

  const getStyle = () => {
    switch (status) {
      case 'Waiting':
        return 'bg-blue-950/60 text-blue-400 border-blue-800/60';
      case 'Called':
        return 'bg-gold/20 text-gold-light border-gold font-bold shadow-[0_0_12px_rgba(212,160,23,0.35)]';
      case 'In Chair':
        return 'bg-emerald-950/70 text-emerald-400 border-emerald-700/70';
      case 'Done':
        return 'bg-gray-800 text-gray-300 border-gray-700';
      case 'Cancelled':
      case 'No-show':
        return 'bg-red-950/60 text-red-400 border-red-800/60';
      case 'free':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-700/60';
      case 'busy':
        return 'bg-amber-950/60 text-amber-400 border-amber-700/60';
      case 'break':
        return 'bg-gray-800 text-gray-400 border-gray-700';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  const getLabelKey = () => {
    switch (status) {
      case 'Waiting': return 'status.waiting';
      case 'Called': return 'status.called';
      case 'In Chair': return 'status.inChair';
      case 'Done': return 'status.done';
      case 'Cancelled': return 'status.cancelled';
      case 'No-show': return 'status.noShow';
      case 'free': return 'status.free';
      case 'busy': return 'status.busy';
      case 'break': return 'status.break';
      default: return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStyle()} ${
        pulsing ? 'animate-pulse' : ''
      } ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {t(getLabelKey())}
    </span>
  );
};
