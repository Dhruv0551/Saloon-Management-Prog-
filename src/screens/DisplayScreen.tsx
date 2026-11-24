import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Scissors, Volume2 } from 'lucide-react';

export const DisplayScreen: React.FC = () => {
  const { t } = useLanguage();
  const [audioEnabled, setAudioEnabled] = useState(false);

  const barbers = [
    { name: 'Ravi', chair: 'Chair 1', token: 'S-14', customer: 'Kavita', status: 'Called', isNew: true },
    { name: 'Amit', chair: 'Chair 2', token: 'S-12', customer: 'Rajesh', status: 'In Chair', isNew: false },
    { name: 'Imran', chair: 'Chair 3', token: '—', customer: 'Available', status: 'free', isNew: false },
  ];

  const upcomingTokens = [
    { token: 'S-15', barber: 'Any', wait: '~10 min' },
    { token: 'S-16', barber: 'Ravi', wait: '~25 min' },
    { token: 'S-17', barber: 'Any', wait: '~30 min' },
    { token: 'S-18', barber: 'Amit', wait: '~40 min' },
    { token: 'S-19', barber: 'Any', wait: '~50 min' },
  ];

  const handleEnableAudio = () => {
    setAudioEnabled(true);
    // Request browser fullscreen if available
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-white flex flex-col justify-between p-6 sm:p-10 select-none">
      {/* Top TV Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gold/10 border-2 border-gold flex items-center justify-center text-gold shadow-[0_0_20px_rgba(212,160,23,0.3)]">
            <Scissors className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-white tracking-wide">
              {t('brand.name')}
            </h1>
            <p className="text-sm text-gold tracking-widest uppercase font-semibold">
              Live Queue Display &bull; {t('tv.welcome')}
            </p>
          </div>
        </div>

        {/* Audio / Fullscreen prompt button */}
        {!audioEnabled ? (
          <button
            onClick={handleEnableAudio}
            className="px-4 py-2 rounded-xl bg-gold text-black font-bold text-xs flex items-center gap-2 animate-bounce cursor-pointer shadow-lg"
          >
            <Volume2 className="w-4 h-4" />
            <span>{t('tv.enableAudio')}</span>
          </button>
        ) : (
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Audio Active</span>
          </div>
        )}
      </div>

      {/* Main Grid: Barber Chairs Now Serving */}
      <div className="my-8">
        <h2 className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-4">
          {t('tv.nowServing')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {barbers.map((b) => (
            <div
              key={b.name}
              className={`rounded-3xl p-6 transition-all duration-300 ${
                b.isNew
                  ? 'bg-charcoal border-2 border-gold shadow-[0_0_30px_rgba(212,160,23,0.4)] animate-pulse'
                  : 'bg-charcoal border border-gray-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span className="font-semibold">{b.chair}</span>
                <span className="font-bold uppercase tracking-wider text-gold">{b.name}</span>
              </div>

              <div className="text-center py-6">
                <span className="text-6xl sm:text-7xl font-mono font-black text-gold tracking-tight block">
                  {b.token}
                </span>
                <p className="text-lg font-bold text-gray-200 mt-2">{b.customer}</p>
                <span className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-gray-800 text-gray-300">
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: Upcoming 5 Tokens */}
      <div className="space-y-3 pt-6 border-t border-gray-800">
        <h2 className="text-xs uppercase tracking-widest text-gray-400 font-bold">
          {t('tv.nextInLine')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {upcomingTokens.map((item, idx) => (
            <div
              key={item.token}
              className="bg-charcoal/80 rounded-2xl p-4 border border-gray-800 text-center"
            >
              <span className="text-[10px] text-gray-400 block font-semibold">#{idx + 1}</span>
              <span className="text-2xl font-mono font-bold text-white block my-1">
                {item.token}
              </span>
              <span className="text-xs text-gold/80 block font-mono">{item.wait}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info Ticker */}
      <div className="pt-6 text-center text-xs text-gray-500 flex items-center justify-between">
        <span>{t('tv.wifiNotice')}</span>
        <span>Please approach your barber when your token is called.</span>
      </div>
    </div>
  );
};
