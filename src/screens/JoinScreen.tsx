import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { ThemeCard } from '../components/ThemeCard';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export const JoinScreen: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors min-h-touch"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('common.back')}</span>
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
          {t('join.title')}
        </h1>
        <p className="text-sm text-gray-400">{t('join.subtitle')}</p>
      </div>

      <ThemeCard className="space-y-6">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gold/10 border border-gold/30 text-gold text-sm">
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          <span>Screen 2: Join Queue form initialized. Ready for Step 2 full implementation.</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              {t('join.nameLabel')}
            </label>
            <input
              type="text"
              placeholder={t('join.namePlaceholder')}
              className="w-full px-4 py-3 rounded-xl bg-canvas border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
              disabled
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              {t('join.phoneLabel')}
            </label>
            <input
              type="tel"
              placeholder={t('join.phonePlaceholder')}
              className="w-full px-4 py-3 rounded-xl bg-canvas border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
              disabled
            />
          </div>

          <div className="pt-4 border-t border-gray-800">
            <Link
              to="/status/demo"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold hover:bg-gold-light text-black font-bold text-sm shadow-lg shadow-gold/20 transition-all min-h-touch"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('join.confirmButton')} (Preview Status)</span>
            </Link>
          </div>
        </div>
      </ThemeCard>
    </div>
  );
};
