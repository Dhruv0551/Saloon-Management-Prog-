import React, { useState } from 'react';
import { useQueue } from '../core/queueStore';
import { ThemeCard } from '../components/ThemeCard';
import {
  Shield,
  Sliders,
  Scissors,
  Plus,
  Clock,
  RotateCcw,
  X
} from 'lucide-react';

export const AdminScreen: React.FC = () => {
  const {
    state,
    toggleQueueOpen,
    toggleBarberBreak,
    toggleBarberActiveToday,
    toggleServiceActive,
    addServiceItem,
    resetDailyQueue
  } = useQueue();

  const [activeTab, setActiveTab] = useState<'queue' | 'services' | 'stats'>('queue');
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // New Service Form State
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState(30);
  const [newServicePrice, setNewServicePrice] = useState(300);
  const [newServiceCategory, setNewServiceCategory] = useState<'Hair' | 'Beard' | 'Spa & Treatments' | 'Grooming'>('Hair');
  const [newServiceDescription, setNewServiceDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newServiceName.trim()) {
      setFormError('Please enter a service name');
      return;
    }
    if (newServiceDuration <= 0) {
      setFormError('Duration must be greater than 0');
      return;
    }
    if (newServicePrice <= 0) {
      setFormError('Price must be greater than 0');
      return;
    }

    addServiceItem({
      name: newServiceName.trim(),
      durationMinutes: Number(newServiceDuration),
      priceINR: Number(newServicePrice),
      active: true,
      category: newServiceCategory,
      description: newServiceDescription.trim() || undefined
    });

    setShowAddServiceModal(false);
    setNewServiceName('');
    setNewServiceDuration(30);
    setNewServicePrice(300);
    setNewServiceDescription('');
  };

  const handleResetQueue = () => {
    resetDailyQueue();
    setShowResetConfirm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Admin Title & Navigation Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-obsidian-border">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-champagne/20 to-obsidian-surface border border-champagne/40 flex items-center justify-center text-champagne shadow-card-glow">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-champagne font-bold block">
              Management Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
              Salon Operations & Settings
            </h1>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-obsidian-surface p-1 rounded-2xl border border-obsidian-border text-xs font-semibold">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2.5 rounded-xl transition-all min-h-touch ${
              activeTab === 'queue'
                ? 'bg-champagne text-obsidian font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Queue & Staff Shifts
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2.5 rounded-xl transition-all min-h-touch ${
              activeTab === 'services'
                ? 'bg-champagne text-obsidian font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Service Catalog ({state.services.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2.5 rounded-xl transition-all min-h-touch ${
              activeTab === 'stats'
                ? 'bg-champagne text-obsidian font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Today's Analytics
          </button>
        </div>
      </div>

      {/* Tab 1: Queue Controls & Shifts */}
      {activeTab === 'queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Master Queue Switch Card */}
          <ThemeCard className="space-y-5">
            <div className="border-b border-obsidian-border pb-3">
              <h2 className="text-base font-bold text-white font-serif flex items-center gap-2">
                <Sliders className="w-5 h-5 text-champagne" />
                <span>Master Queue Status</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Controls customer remote queue joining on /join across all mobile devices.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-obsidian-surface border border-obsidian-border flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      state.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  <h3 className="font-bold text-white text-lg font-serif">
                    {state.isOpen ? 'Queue is Currently OPEN' : 'Queue is Currently CLOSED'}
                  </h3>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {state.isOpen
                    ? 'Customers can register online from smartphones and track position live.'
                    : 'Remote check-in is disabled. Notice displays at /join directing clients to reception.'}
                </p>
              </div>

              <button
                onClick={toggleQueueOpen}
                className={`px-6 py-3.5 rounded-xl text-xs font-black tracking-wider transition-all shadow-lg min-h-touch ${
                  state.isOpen
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {state.isOpen ? 'CLOSE QUEUE' : 'OPEN QUEUE'}
              </button>
            </div>

            {/* Operating Hours Info */}
            <div className="p-4 rounded-xl bg-obsidian-surface border border-obsidian-border text-xs text-gray-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-champagne" />
                <span>Daily Operating Hours:</span>
              </div>
              <span className="font-mono text-white font-bold">
                {state.openTime} AM – {state.closeTime} PM
              </span>
            </div>
            <p className="text-[11px] text-gray-500 italic">
              Rule: Remote registration auto-closes 30 minutes before salon close time (7:30 PM). Walk-ins remain accepted at reception until 8:00 PM.
            </p>
          </ThemeCard>

          {/* Barbers Shifts & Availability */}
          <ThemeCard className="space-y-5">
            <div className="border-b border-obsidian-border pb-3">
              <h2 className="text-base font-bold text-white font-serif flex items-center gap-2">
                <Scissors className="w-5 h-5 text-champagne" />
                <span>Stylist Shifts & Availability</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Toggle active working status and real-time break overrides.
              </p>
            </div>

            <div className="space-y-3">
              {state.barbers.map((barber) => (
                <div
                  key={barber.id}
                  className="p-4 rounded-xl bg-obsidian-surface border border-obsidian-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-obsidian-card border border-obsidian-border flex items-center justify-center font-serif font-black text-champagne">
                      {barber.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{barber.name}</h4>
                      <p className="text-gray-400">{barber.specialty}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* On Duty Toggle */}
                    <button
                      onClick={() => toggleBarberActiveToday(barber.id)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        barber.activeToday
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-700/60'
                          : 'bg-obsidian-card text-gray-500 border border-obsidian-border'
                      }`}
                    >
                      {barber.activeToday ? 'On Duty' : 'Off Duty'}
                    </button>

                    {/* Break Mode Override */}
                    <button
                      onClick={() => toggleBarberBreak(barber.id)}
                      disabled={!barber.activeToday}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-30 ${
                        barber.status === 'break'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-700/60'
                          : 'bg-obsidian-card text-gray-300 border border-obsidian-border hover:border-champagne/40'
                      }`}
                    >
                      {barber.status === 'break' ? 'On Break' : 'Available'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </ThemeCard>
        </div>
      )}

      {/* Tab 2: Service Catalog */}
      {activeTab === 'services' && (
        <ThemeCard className="p-0 overflow-hidden space-y-0">
          <div className="p-5 border-b border-obsidian-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white font-serif">Service Catalog</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Active services appear on the customer /join screen. Disabled services are hidden immediately.
              </p>
            </div>

            <button
              onClick={() => setShowAddServiceModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-champagne text-obsidian font-extrabold text-xs shadow-md hover:bg-champagne-light transition-all min-h-touch"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-obsidian-surface border-b border-obsidian-border text-gray-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Service Name</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Duration</th>
                  <th className="py-3.5 px-5">Price (INR)</th>
                  <th className="py-3.5 px-5 text-center">Catalog Status</th>
                  <th className="py-3.5 px-5 text-right">Toggle Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-border text-gray-300">
                {state.services.map((service) => (
                  <tr key={service.id} className="hover:bg-obsidian-surface/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-white text-sm">{service.name}</div>
                      {service.description && (
                        <div className="text-[11px] text-gray-400 truncate max-w-xs">{service.description}</div>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 rounded-full bg-obsidian-surface border border-obsidian-border text-[11px] text-gray-300 font-medium">
                        {service.category}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-mono text-gray-300">
                      {service.durationMinutes} mins
                    </td>
                    <td className="py-4 px-5 font-mono font-bold text-champagne text-sm">
                      ₹{service.priceINR}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        service.active
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-700/60'
                          : 'bg-obsidian-surface text-gray-500 border border-obsidian-border'
                      }`}>
                        {service.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => toggleServiceActive(service.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-touch ${
                          service.active
                            ? 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-800/50'
                            : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-800/50'
                        }`}
                      >
                        {service.active ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ThemeCard>
      )}

      {/* Tab 3: Daily Statistics & Reset */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ThemeCard className="text-center space-y-1">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block">
                Customers Served
              </span>
              <span className="text-4xl font-extrabold text-white font-sans block mt-1">
                {state.dailyStats.totalServed}
              </span>
              <span className="text-[11px] text-emerald-400">Successfully Completed</span>
            </ThemeCard>

            <ThemeCard className="text-center space-y-1">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block">
                Average Wait Time
              </span>
              <span className="text-4xl font-extrabold text-champagne font-sans block mt-1">
                {state.dailyStats.avgWaitMinutes}m
              </span>
              <span className="text-[11px] text-gray-400">Registration to Chair</span>
            </ThemeCard>

            <ThemeCard className="text-center space-y-1">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block">
                Total No-Shows
              </span>
              <span className="text-4xl font-extrabold text-rose-400 font-sans block mt-1">
                {state.dailyStats.noShowCount}
              </span>
              <span className="text-[11px] text-rose-400/80">Missed Call Windows</span>
            </ThemeCard>

            <ThemeCard className="text-center space-y-1">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block">
                Cancellations
              </span>
              <span className="text-4xl font-extrabold text-amber-300 font-sans block mt-1">
                {state.dailyStats.cancelCount}
              </span>
              <span className="text-[11px] text-gray-400">Self or Staff Cancelled</span>
            </ThemeCard>
          </div>

          {/* End of Day Operations */}
          <ThemeCard className="space-y-4 p-6 border-obsidian-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white font-serif">Daily Queue Operations</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Clear active tokens and reset daily analytics at the start or end of each business day.
                </p>
              </div>

              <button
                onClick={() => setShowResetConfirm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-rose-900/60 hover:bg-rose-950/50 text-rose-300 font-bold text-xs transition-colors min-h-touch"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Daily Queue & Stats</span>
              </button>
            </div>
          </ThemeCard>
        </div>
      )}

      {/* Add Service Modal */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <ThemeCard highlighted className="max-w-md w-full space-y-5 p-6 border-champagne/60 shadow-2xl">
            <div className="flex items-center justify-between border-b border-obsidian-border pb-3">
              <h3 className="text-lg font-bold text-white font-serif">Add New Service</h3>
              <button
                onClick={() => setShowAddServiceModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddService} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-300 uppercase">Service Name</label>
                <input
                  type="text"
                  required
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="e.g. Royal Keratin Treatment"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-white text-sm focus:outline-none focus:border-champagne"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-300 uppercase">Duration (mins)</label>
                  <input
                    type="number"
                    min={5}
                    step={5}
                    required
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-white text-sm font-mono focus:outline-none focus:border-champagne"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-300 uppercase">Price (INR)</label>
                  <input
                    type="number"
                    min={50}
                    step={50}
                    required
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-white text-sm font-mono focus:outline-none focus:border-champagne"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-300 uppercase">Category</label>
                <select
                  value={newServiceCategory}
                  onChange={(e) => setNewServiceCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-white text-sm focus:outline-none focus:border-champagne"
                >
                  <option value="Hair">Hair</option>
                  <option value="Beard">Beard</option>
                  <option value="Spa & Treatments">Spa & Treatments</option>
                  <option value="Grooming">Grooming</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-300 uppercase">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={newServiceDescription}
                  onChange={(e) => setNewServiceDescription(e.target.value)}
                  placeholder="Short description of what the service includes..."
                  className="w-full px-3.5 py-2 rounded-xl bg-obsidian-surface border border-obsidian-border text-white text-xs focus:outline-none focus:border-champagne"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="flex-1 py-3 rounded-xl bg-obsidian-surface border border-obsidian-border text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-champagne text-obsidian text-xs font-extrabold shadow-luxury"
                >
                  Add Service
                </button>
              </div>
            </form>
          </ThemeCard>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <ThemeCard className="max-w-sm w-full space-y-4 p-6 border-rose-900 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-serif">Reset Daily Queue?</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              This action will clear all current active queue tokens and reset today's analytics counters to zero.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="py-2.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-gray-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleResetQueue}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Yes, Reset All
              </button>
            </div>
          </ThemeCard>
        </div>
      )}
    </div>
  );
};
