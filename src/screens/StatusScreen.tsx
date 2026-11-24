import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { ThemeCard } from '../components/ThemeCard';
import { StatusBadge } from '../components/StatusBadge';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const StatusScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const tokenDisplay = id && id !== 'demo' ? id : 'S-14';

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors min-h-touch"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('myStatus.backHome')}</span>
      </Link>

      {/* Main Token Display Card */}
      <ThemeCard highlighted className="text-center space-y-5 py-8">
        <div className="flex items-center justify-center">
          <StatusBadge status="Waiting" pulsing />
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
            {t('myStatus.tokenTitle')}
          </p>
          <p className="text-6xl font-black text-gold font-mono tracking-tight my-2">
            {tokenDisplay}
          </p>
          <p className="text-sm text-gray-300 font-medium">Kavita Sharma &bull; +91 98****1234</p>
        </div>

        {/* Position & Wait Stats */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-800">
          <div className="p-3 rounded-xl bg-canvas border border-gray-800">
            <p className="text-[11px] text-gray-400 uppercase font-semibold">{t('myStatus.positionInLine')}</p>
            <p className="text-xl font-bold text-white mt-0.5">#2</p>
          </div>
          <div className="p-3 rounded-xl bg-canvas border border-gray-800">
            <p className="text-[11px] text-gray-400 uppercase font-semibold">{t('myStatus.estimatedWait')}</p>
            <p className="text-xl font-bold text-gold mt-0.5">~15 {t('home.mins')}</p>
          </div>
        </div>

        {/* Stage 1 Notice Alert */}
        <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-700/60 text-amber-300 text-xs text-left flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
          <div>
            <p className="font-bold text-sm text-amber-200">{t('myStatus.startComingAlert')}</p>
            <p className="text-amber-300/80 mt-0.5">Assigned to: Ravi (Chair 1)</p>
          </div>
        </div>

        <button
          className="w-full py-3 rounded-xl border border-red-900/60 text-red-400 hover:bg-red-950/30 text-xs font-semibold transition-colors min-h-touch"
        >
          {t('myStatus.cancelSpot')}
        </button>
      </ThemeCard>
    </div>
  );
};
