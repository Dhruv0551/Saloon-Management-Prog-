import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { ThemeCard } from '../components/ThemeCard';
import { StatusBadge } from '../components/StatusBadge';
import { Users, Clock, Scissors, ArrowRight } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { t } = useLanguage();

  const barbers = [
    { name: 'Ravi', status: 'free' as const, currentToken: null },
    { name: 'Amit', status: 'busy' as const, currentToken: 'S-12' },
    { name: 'Imran', status: 'break' as const, currentToken: null },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Hero / Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-700/60 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {t('status.open')} &bull; {t('home.hours')}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-serif leading-tight">
          Experience Effortless <br />
          <span className="text-gold font-sans">Queue Management</span>
        </h1>

        <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
          {t('join.subtitle')}
        </p>

        {/* Primary CTA Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/join"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-gold hover:bg-gold-light text-black font-bold text-base shadow-lg shadow-gold/20 hover:shadow-gold/40 transition-all duration-200 min-h-touch"
          >
            <span>{t('home.joinCta')}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            to="/reception"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-charcoal hover:bg-gray-800 text-gray-200 hover:text-white border border-gray-700 hover:border-gray-600 font-semibold text-sm transition-all duration-200 min-h-touch"
          >
            <span>{t('nav.reception')}</span>
          </Link>
        </div>
      </div>

      {/* Queue Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ThemeCard className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-gold/10 border border-gold/30 text-gold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
              {t('home.peopleWaiting')}
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              4 <span className="text-xs text-gray-400 font-normal">in line</span>
            </p>
          </div>
        </ThemeCard>

        <ThemeCard className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-blue-950/60 border border-blue-700/60 text-blue-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
              {t('home.approxWait')}
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              ~25 <span className="text-xs text-gray-400 font-normal">{t('home.mins')}</span>
            </p>
          </div>
        </ThemeCard>

        <ThemeCard className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-400">
            <Scissors className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
              {t('home.activeBarbers')}
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              2 / 3 <span className="text-xs text-gray-400 font-normal">on duty</span>
            </p>
          </div>
        </ThemeCard>
      </div>

      {/* Barber Availability Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
            <Scissors className="w-5 h-5 text-gold" />
            {t('home.ourBarbers')}
          </h2>
          <span className="text-xs text-gray-400">Live Status</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {barbers.map((barber) => (
            <Link
              key={barber.name}
              to={`/barber/${barber.name.toLowerCase()}`}
              className="group block"
            >
              <ThemeCard hoverEffect className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-charcoal-light border border-gray-700 flex items-center justify-center text-gold font-bold text-base group-hover:border-gold/50">
                      {barber.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-gold transition-colors">
                        {barber.name}
                      </h3>
                      <p className="text-xs text-gray-400">Master Stylist</p>
                    </div>
                  </div>
                  <StatusBadge status={barber.status} />
                </div>

                <div className="pt-2 border-t border-gray-800 text-xs flex items-center justify-between text-gray-400">
                  <span>Currently Serving:</span>
                  <span className="font-mono font-bold text-gold">
                    {barber.currentToken || '—'}
                  </span>
                </div>
              </ThemeCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
