import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { MapPin, Phone, Clock, Scissors } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();

  if (location.pathname === '/display' || location.pathname === '/reception') {
    return null;
  }

  return (
    <footer className="bg-obsidian-surface border-t border-obsidian-border text-gray-400 py-10 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-champagne/10 border border-champagne/30 flex items-center justify-center text-champagne">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <span className="text-white font-bold font-serif tracking-wide">{t('brand.name')}</span>
            <p className="text-xs text-gray-500 font-sans">{t('brand.tagline')}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-champagne" />
            <span>{t('home.hours')}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-champagne" />
            <span>{t('home.address')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-champagne" />
            <span>{t('home.phone')}</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center md:text-right font-sans">
          &copy; {new Date().getFullYear()} {t('brand.name')}. Crafted with precision.
        </div>
      </div>
    </footer>
  );
};
