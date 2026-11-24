import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { ThemeCard } from '../components/ThemeCard';
import { Shield, Sliders, Scissors } from 'lucide-react';

export const AdminScreen: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'queue' | 'services' | 'stats'>('queue');
  const [queueOpen, setQueueOpen] = useState(true);

  const initialServices = [
    { id: '1', nameEn: 'Haircut', nameGu: 'વાળ કાપવા', duration: 30, price: 250, active: true },
    { id: '2', nameEn: 'Beard Trim', nameGu: 'દાઢી ટ્રીમ', duration: 15, price: 150, active: true },
    { id: '3', nameEn: 'Hair Spa', nameGu: 'હેર સ્પા', duration: 45, price: 600, active: true },
    { id: '4', nameEn: 'Facial', nameGu: 'ફેસિયલ', duration: 40, price: 500, active: true },
    { id: '5', nameEn: 'Hair Wash', nameGu: 'હેર વૉશ', duration: 15, price: 100, active: true },
  ];

  const [services, setServices] = useState(initialServices);

  const toggleServiceActive = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/30 text-gold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-serif">{t('admin.title')}</h1>
            <p className="text-xs text-gray-400">Owner control panel & salon configuration</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-charcoal p-1 rounded-xl border border-gray-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-2 rounded-lg transition-colors min-h-touch ${
              activeTab === 'queue' ? 'bg-gold text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('admin.tabQueue')}
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-2 rounded-lg transition-colors min-h-touch ${
              activeTab === 'services' ? 'bg-gold text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('admin.tabServices')}
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-2 rounded-lg transition-colors min-h-touch ${
              activeTab === 'stats' ? 'bg-gold text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('admin.tabStats')}
          </button>
        </div>
      </div>

      {/* Tab 1: Queue Controls & Shifts */}
      {activeTab === 'queue' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ThemeCard className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-gold" />
              {t('admin.queueStatus')}
            </h2>
            <div className="p-4 rounded-xl bg-canvas border border-gray-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">
                  {queueOpen ? t('admin.queueOpen') : t('admin.queueClosed')}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Controls remote customer registration on /join
                </p>
              </div>
              <button
                onClick={() => setQueueOpen(!queueOpen)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-touch ${
                  queueOpen
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {queueOpen ? 'OPEN' : 'CLOSED'}
              </button>
            </div>
          </ThemeCard>

          <ThemeCard className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Scissors className="w-5 h-5 text-gold" />
              Barbers On Duty Today
            </h2>
            <div className="space-y-2">
              {['Ravi', 'Amit', 'Imran'].map((barber) => (
                <div
                  key={barber}
                  className="p-3 rounded-xl bg-canvas border border-gray-800 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-white">{barber}</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-400 font-medium">
                    {t('admin.workingToday')}
                  </span>
                </div>
              ))}
            </div>
          </ThemeCard>
        </div>
      )}

      {/* Tab 2: Service Catalog */}
      {activeTab === 'services' && (
        <ThemeCard className="p-0 overflow-x-auto">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-bold text-white text-sm">Services Offered</h2>
            <button className="px-3 py-1.5 rounded-lg bg-gold/15 text-gold border border-gold/40 text-xs font-semibold hover:bg-gold/25 min-h-touch">
              {t('admin.addService')}
            </button>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas border-b border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">{t('admin.serviceNameEn')}</th>
                <th className="py-3 px-4">{t('admin.serviceNameGu')}</th>
                <th className="py-3 px-4">{t('admin.duration')}</th>
                <th className="py-3 px-4">{t('admin.price')}</th>
                <th className="py-3 px-4 text-center">{t('admin.active')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-gray-300">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-gray-800/40">
                  <td className="py-3 px-4 font-medium text-white">{s.nameEn}</td>
                  <td className="py-3 px-4 font-medium text-gray-400">{s.nameGu}</td>
                  <td className="py-3 px-4">{s.duration} mins</td>
                  <td className="py-3 px-4 font-mono text-gold">₹{s.price}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleServiceActive(s.id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors min-h-touch ${
                        s.active
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-700/60'
                          : 'bg-gray-800 text-gray-500 border border-gray-700'
                      }`}
                    >
                      {s.active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ThemeCard>
      )}

      {/* Tab 3: Daily Statistics */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ThemeCard className="text-center space-y-1">
            <p className="text-xs text-gray-400 uppercase font-semibold">{t('admin.servedToday')}</p>
            <p className="text-3xl font-extrabold text-white">28</p>
          </ThemeCard>
          <ThemeCard className="text-center space-y-1">
            <p className="text-xs text-gray-400 uppercase font-semibold">{t('admin.avgWait')}</p>
            <p className="text-3xl font-extrabold text-gold">19 min</p>
          </ThemeCard>
          <ThemeCard className="text-center space-y-1">
            <p className="text-xs text-gray-400 uppercase font-semibold">{t('admin.noShows')}</p>
            <p className="text-3xl font-extrabold text-red-400">2</p>
          </ThemeCard>
          <ThemeCard className="text-center space-y-1">
            <p className="text-xs text-gray-400 uppercase font-semibold">{t('admin.cancellations')}</p>
            <p className="text-3xl font-extrabold text-amber-400">1</p>
          </ThemeCard>
        </div>
      )}
    </div>
  );
};
