import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { ThemeCard } from '../components/ThemeCard';
import { StatusBadge } from '../components/StatusBadge';
import { Plus, Scissors, AlertTriangle } from 'lucide-react';

export const ReceptionScreen: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-white font-serif flex items-center gap-2">
            <Scissors className="w-6 h-6 text-gold" />
            {t('reception.title')}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Real-time chair monitoring & waiting queue management</p>
        </div>

        <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-black font-bold text-sm shadow-lg shadow-gold/20 min-h-touch transition-all">
          <Plus className="w-4 h-4" />
          <span>{t('reception.addWalkIn')}</span>
        </button>
      </div>

      {/* Chairs Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          {t('reception.chairsTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Ravi', 'Amit', 'Imran'].map((name, i) => (
            <ThemeCard key={name} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-base">{name}'s Chair</span>
                <StatusBadge status={i === 1 ? 'busy' : i === 2 ? 'break' : 'free'} />
              </div>
              <div className="p-3 rounded-xl bg-canvas border border-gray-800 text-xs space-y-1">
                <span className="text-gray-500">Current Client:</span>
                <p className="font-semibold text-white">{i === 1 ? 'S-12 (Rajesh)' : 'Chair Available'}</p>
              </div>
              <button
                disabled={i !== 0}
                className="w-full py-2.5 rounded-xl bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25 font-semibold text-xs transition-colors disabled:opacity-30 disabled:pointer-events-none min-h-touch"
              >
                {t('reception.callNext')}
              </button>
            </ThemeCard>
          ))}
        </div>
      </div>

      {/* Waiting Queue List */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          {t('reception.waitingList')} (4)
        </h2>
        <ThemeCard className="overflow-x-auto p-0">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas border-b border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">{t('reception.token')}</th>
                <th className="py-3 px-4">{t('reception.customer')}</th>
                <th className="py-3 px-4">{t('reception.services')}</th>
                <th className="py-3 px-4">{t('reception.barber')}</th>
                <th className="py-3 px-4">{t('reception.waitElapsed')}</th>
                <th className="py-3 px-4 text-right">{t('reception.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-gray-300">
              <tr className="hover:bg-gray-800/40">
                <td className="py-3 px-4 font-mono font-bold text-gold">S-13</td>
                <td className="py-3 px-4 font-medium text-white">Anil Mehta</td>
                <td className="py-3 px-4">Haircut, Beard Trim</td>
                <td className="py-3 px-4">Any Barber</td>
                <td className="py-3 px-4">12 mins</td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button className="px-2.5 py-1 rounded bg-gold/20 text-gold hover:bg-gold/30 font-medium">Call</button>
                  <button className="px-2.5 py-1 rounded bg-red-950/50 text-red-400 hover:bg-red-900/50 font-medium">Cancel</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-800/40 border-l-2 border-amber-500 bg-amber-950/10">
                <td className="py-3 px-4 font-mono font-bold text-gold">S-14</td>
                <td className="py-3 px-4 font-medium text-white flex items-center gap-1.5">
                  <span>Kavita Sharma</span>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                </td>
                <td className="py-3 px-4">Haircut, Facial</td>
                <td className="py-3 px-4">Ravi</td>
                <td className="py-3 px-4 text-amber-400 font-semibold">62 mins (Long Wait)</td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button className="px-2.5 py-1 rounded bg-gold/20 text-gold hover:bg-gold/30 font-medium">Call</button>
                  <button className="px-2.5 py-1 rounded bg-red-950/50 text-red-400 hover:bg-red-900/50 font-medium">No-show</button>
                </td>
              </tr>
            </tbody>
          </table>
        </ThemeCard>
      </div>
    </div>
  );
};
