import React from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { ThemeCard } from '../components/ThemeCard';
import { Play, CheckCircle, Coffee, Clock } from 'lucide-react';

export const BarberScreen: React.FC = () => {
  const { name = 'Ravi' } = useParams<{ name: string }>();
  const { t } = useLanguage();
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Header with Switch */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800">
        <div>
          <h1 className="text-xl font-bold text-white font-serif">
            {t('barber.chair', { name: displayName })}
          </h1>
          <p className="text-xs text-gray-400">Mobile Barber Station</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-700/60 text-xs font-semibold min-h-touch">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {t('status.free')}
        </button>
      </div>

      {/* Active Serving Card */}
      <ThemeCard highlighted className="space-y-4 text-center py-6">
        <span className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">
          Now Serving
        </span>
        <div className="text-5xl font-mono font-black text-gold">S-12</div>
        <p className="text-base font-bold text-white">Rajesh Patel</p>
        <p className="text-xs text-gray-400">Haircut + Beard Styling</p>

        {/* Stopwatch */}
        <div className="p-4 rounded-xl bg-canvas border border-gray-800 flex items-center justify-center gap-2">
          <Clock className="w-5 h-5 text-gold animate-spin" />
          <span className="font-mono text-2xl font-bold text-white">18:42</span>
          <span className="text-xs text-gray-500 font-sans">/ 35 mins est</span>
        </div>

        {/* Massive Touch Targets */}
        <div className="pt-2 grid grid-cols-2 gap-3">
          <button className="py-4 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 min-h-touch transition-colors">
            <Play className="w-4 h-4 fill-white" />
            <span>{t('barber.startService')}</span>
          </button>
          <button className="py-4 px-4 rounded-xl bg-gold hover:bg-gold-light text-black font-bold text-sm shadow-lg flex items-center justify-center gap-2 min-h-touch transition-colors">
            <CheckCircle className="w-4 h-4" />
            <span>{t('barber.completeService')}</span>
          </button>
        </div>
      </ThemeCard>

      {/* Break Mode Quick Button */}
      <button className="w-full py-3 rounded-xl border border-gray-700 hover:border-gold/40 text-gray-300 hover:text-gold text-xs font-semibold flex items-center justify-center gap-2 transition-colors min-h-touch">
        <Coffee className="w-4 h-4" />
        <span>Take 15 Min Break</span>
      </button>
    </div>
  );
};
