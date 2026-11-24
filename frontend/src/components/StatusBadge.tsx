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
        return 'bg-blue-950/40 text-blue-300 border-blue-800/50';
      case 'Called':
        return 'bg-champagne/20 text-champagne-light border-champagne font-bold shadow-[0_0_15px_rgba(229,195,146,0.3)]';
      case 'In Chair':
        return 'bg-emerald-950/50 text-emerald-400 border-emerald-700/50';
      case 'Done':
        return 'bg-obsidian-border text-gray-300 border-gray-700';
      case 'Cancelled':
      case 'No-show':
        return 'bg-rose-950/40 text-rose-400 border-rose-800/50';
      case 'free':
        return 'bg-emerald-950/40 text-emerald-400 border-emerald-700/50';
      case 'busy':
        return 'bg-amber-950/40 text-amber-300 border-amber-700/50';
      case 'break':
        return 'bg-obsidian-surface text-gray-400 border-obsidian-border';
      default:
        return 'bg-obsidian-surface text-gray-300 border-obsidian-border';
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
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStyle()} ${
        pulsing ? 'animate-pulse' : ''
      } ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-90" />
      {t(getLabelKey())}
    </span>
  );
};
