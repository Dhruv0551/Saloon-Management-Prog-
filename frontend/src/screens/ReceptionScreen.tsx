import React, { useState, useEffect } from 'react';
import { useQueue } from '../core/queueStore';
import { BarberId, ServiceItem } from '../types/queue';
import { ThemeCard } from '../components/ThemeCard';
import { StatusBadge } from '../components/StatusBadge';
import { soundEffects } from '../core/soundEffects';
import {
  Scissors,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  Sparkles,
  X,
  Volume2
} from 'lucide-react';

export const ReceptionScreen: React.FC = () => {
  const {
    state,
    callNextCustomer,
    completeService,
    addCustomer,
    cancelQueueEntry,
    markNoShow,
    toggleBarberBreak
  } = useQueue();

  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInServices, setWalkInServices] = useState<ServiceItem[]>([state.services[0]]);
  const [walkInBarber, setWalkInBarber] = useState<BarberId>('any');
  const [walkInError, setWalkInError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  // Update clock every minute for wait time calculations
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(timer);
  }, []);

  const waitingCustomers = state.queue.filter(q => q.status === 'Waiting');
  const calledCustomers = state.queue.filter(q => q.status === 'Called');
  const inChairCustomers = state.queue.filter(q => q.status === 'In Chair');

  const handleCallNext = (barberId: BarberId) => {
    callNextCustomer(barberId);
    soundEffects.playTurnChime();
  };

  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWalkInError(null);

    const result = addCustomer({
      name: walkInName,
      phone: walkInPhone,
      services: walkInServices,
      preferredBarber: walkInBarber,
      isWalkIn: true
    });

    if (result.success) {
      setShowWalkInModal(false);
      setWalkInName('');
      setWalkInPhone('');
      setWalkInServices([state.services[0]]);
      setWalkInBarber('any');
    } else {
      setWalkInError(result.error || 'Failed to add walk-in customer');
    }
  };

  const toggleWalkInService = (service: ServiceItem) => {
    setWalkInError(null);
    const exists = walkInServices.some(s => s.id === service.id);
    if (exists) {
      if (walkInServices.length === 1) {
        setWalkInError('Select at least 1 service');
        return;
      }
      setWalkInServices(prev => prev.filter(s => s.id !== service.id));
    } else {
      if (walkInServices.length >= 3) {
        setWalkInError('Max 3 services allowed');
        return;
      }
      setWalkInServices(prev => [...prev, service]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Top Reception Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-obsidian-border">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-champagne font-bold">
            <LayoutDashboardIcon />
            <span>Staff Operational Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif mt-1">
            Reception Control Hub
          </h1>
          <p className="text-xs text-gray-400">
            Real-time chair monitoring, FIFO matching, and walk-in dispatching.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => soundEffects.playTurnChime()}
            className="p-3 rounded-xl bg-obsidian-surface border border-obsidian-border text-champagne hover:border-champagne/40 transition-colors min-h-touch"
            title="Test TV / Speaker Chime"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowWalkInModal(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-champagne via-champagne-light to-champagne-dark text-obsidian font-extrabold text-sm shadow-luxury hover:shadow-luxury-glow transition-all duration-200 min-h-touch"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Add Walk-in Guest</span>
          </button>
        </div>
      </div>

      {/* Quick Status Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-obsidian-surface border border-obsidian-border">
          <span className="text-[11px] text-gray-400 uppercase font-semibold block">Waiting in Queue</span>
          <span className="text-2xl font-black text-white font-sans mt-0.5 block">{waitingCustomers.length}</span>
        </div>
        <div className="p-4 rounded-xl bg-obsidian-surface border border-obsidian-border">
          <span className="text-[11px] text-gray-400 uppercase font-semibold block">Now In Chair</span>
          <span className="text-2xl font-black text-emerald-400 font-sans mt-0.5 block">{inChairCustomers.length}</span>
        </div>
        <div className="p-4 rounded-xl bg-obsidian-surface border border-obsidian-border">
          <span className="text-[11px] text-gray-400 uppercase font-semibold block">Called & Arriving</span>
          <span className="text-2xl font-black text-champagne font-sans mt-0.5 block">{calledCustomers.length}</span>
        </div>
        <div className="p-4 rounded-xl bg-obsidian-surface border border-obsidian-border">
          <span className="text-[11px] text-gray-400 uppercase font-semibold block">Completed Today</span>
          <span className="text-2xl font-black text-gray-300 font-sans mt-0.5 block">{state.dailyStats.totalServed}</span>
        </div>
      </div>

      {/* Section 1: Barber Chair Stations Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
            <Scissors className="w-5 h-5 text-champagne" />
            <span>Stylist Chair Stations</span>
          </h2>
          <span className="text-xs text-gray-400">
            {state.barbers.filter(b => b.status === 'free').length} Chairs Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {state.barbers.map((barber) => {
            const isBusy = barber.status === 'busy';
            const isOnBreak = barber.status === 'break';
            const isFree = barber.status === 'free';

            // Find current active customer entry
            const activeCustomer = state.queue.find(
              q => q.id === barber.currentCustomerId || q.token === barber.currentToken
            );

            // Compute elapsed time if busy
            let elapsedMins = 0;
            if (barber.serviceStartTime) {
              elapsedMins = Math.floor((now - new Date(barber.serviceStartTime).getTime()) / 60000);
            }

            // Check if there are eligible waiting customers for this barber
            const hasWaitingEligible = waitingCustomers.some(
              q => q.preferredBarber === barber.id || q.preferredBarber === 'any'
            );

            return (
              <ThemeCard
                key={barber.id}
                highlighted={isBusy}
                className="space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Barber Header */}
                  <div className="flex items-center justify-between border-b border-obsidian-border pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-obsidian-surface border border-obsidian-border flex items-center justify-center font-serif font-bold text-champagne">
                        {barber.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base font-serif">{barber.name}'s Chair</h3>
                        <p className="text-[11px] text-gray-400 truncate max-w-[130px]">{barber.specialty}</p>
                      </div>
                    </div>
                    <StatusBadge status={barber.status} />
                  </div>

                  {/* Chair Content */}
                  {isBusy && activeCustomer ? (
                    <div className="p-3.5 rounded-xl bg-obsidian-surface border border-obsidian-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xl font-black text-champagne">
                          {activeCustomer.token}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-champagne" />
                          {elapsedMins} min elapsed
                        </span>
                      </div>
                      <p className="font-bold text-sm text-white truncate">{activeCustomer.name}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {activeCustomer.services.map(s => s.name).join(', ')}
                      </p>
                      <div className="text-[11px] text-gray-500 pt-1 flex items-center justify-between">
                        <span>Status: <strong className="text-gray-300">{activeCustomer.status}</strong></span>
                        <span>Est: {activeCustomer.totalDurationMinutes} mins</span>
                      </div>
                    </div>
                  ) : isOnBreak ? (
                    <div className="p-4 rounded-xl bg-obsidian-surface border border-obsidian-border text-center space-y-1 py-6">
                      <p className="text-xs font-bold text-amber-300">Stylist On Break</p>
                      <p className="text-[11px] text-gray-500">Temporarily unavailable for new tokens.</p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-center space-y-1 py-6">
                      <p className="text-xs font-bold text-emerald-400">Chair Ready & Available</p>
                      <p className="text-[11px] text-gray-500">
                        {hasWaitingEligible
                          ? 'Eligible customers waiting in queue.'
                          : 'No customers waiting for this chair.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Chair Actions */}
                <div className="space-y-2 pt-2 border-t border-obsidian-border">
                  {isFree && (
                    <button
                      onClick={() => handleCallNext(barber.id)}
                      disabled={!hasWaitingEligible}
                      className="w-full py-3 rounded-xl bg-champagne hover:bg-champagne-light text-obsidian font-extrabold text-xs shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-touch flex items-center justify-center gap-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Call Next Eligible</span>
                    </button>
                  )}

                  {isBusy && (
                    <button
                      onClick={() => completeService(barber.id)}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all min-h-touch flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark Service Done</span>
                    </button>
                  )}

                  <button
                    onClick={() => toggleBarberBreak(barber.id)}
                    className="w-full py-2 rounded-xl border border-obsidian-border hover:border-champagne/40 text-[11px] text-gray-400 hover:text-white transition-colors"
                  >
                    {isOnBreak ? 'Resume Available' : 'Toggle Break'}
                  </button>
                </div>
              </ThemeCard>
            );
          })}
        </div>
      </div>

      {/* Section 2: Active Waiting Queue Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-obsidian-border pb-3">
          <div>
            <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
              <span>Waiting Queue</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-champagne/20 text-champagne font-sans font-bold">
                {waitingCustomers.length + calledCustomers.length} Active
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              Customers waiting more than 60 minutes are highlighted with warning indicators.
            </p>
          </div>
        </div>

        <ThemeCard className="p-0 overflow-x-auto">
          {state.queue.filter(q => q.status === 'Waiting' || q.status === 'Called').length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-champagne/40 mx-auto" />
              <p className="text-base font-bold text-white font-serif">Queue is Clear</p>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                No customers are waiting right now. Use "+ Add Walk-in Guest" to check in arriving clients.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-obsidian-surface border-b border-obsidian-border text-gray-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Token</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Services Booked</th>
                  <th className="py-3.5 px-4">Preferred Stylist</th>
                  <th className="py-3.5 px-4">Wait Elapsed</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-border text-gray-300">
                {state.queue
                  .filter(q => q.status === 'Waiting' || q.status === 'Called')
                  .map((customer) => {
                    const elapsed = Math.floor((now - new Date(customer.createdAt).getTime()) / 60000);
                    const isOver60 = elapsed >= 60;
                    const isCalled = customer.status === 'Called';

                    return (
                      <tr
                        key={customer.id}
                        className={`hover:bg-obsidian-surface/60 transition-colors ${
                          isOver60 ? 'bg-amber-950/20 border-l-4 border-l-amber-500' : ''
                        } ${isCalled ? 'bg-champagne/5' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-mono font-black text-champagne text-sm">
                          {customer.token}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{customer.name}</div>
                          <div className="text-[11px] text-gray-400 font-mono">
                            +91 {customer.phone}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            customer.isWalkIn
                              ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                              : 'bg-obsidian-surface text-gray-300 border border-obsidian-border'
                          }`}>
                            {customer.isWalkIn ? 'Walk-in' : 'Remote'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 max-w-[200px]">
                          <div className="truncate font-medium text-gray-200">
                            {customer.services.map(s => s.name).join(', ')}
                          </div>
                          <span className="text-[10px] text-champagne/80 font-mono">
                            {customer.totalDurationMinutes} mins &bull; ₹{customer.totalPriceINR}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 capitalize font-medium text-gray-300">
                          {customer.preferredBarber === 'any' ? 'Any Barber' : customer.preferredBarber}
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          <div className="flex items-center gap-1.5">
                            {isOver60 && (
                              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            )}
                            <span className={isOver60 ? 'text-amber-400 font-bold' : 'text-gray-300'}>
                              {elapsed} mins {isOver60 ? '(High Wait)' : ''}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={customer.status} pulsing={isCalled} />
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          {isCalled ? (
                            <button
                              onClick={() => markNoShow(customer.id)}
                              className="px-3 py-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-[11px] font-semibold transition-colors min-h-touch"
                              title="Mark No-show if customer fails to arrive"
                            >
                              No-show
                            </button>
                          ) : (
                            <button
                              onClick={() => cancelQueueEntry(customer.id, 'Staff cancelled')}
                              className="px-3 py-1.5 rounded-lg bg-obsidian-surface hover:bg-rose-950/40 text-gray-400 hover:text-rose-300 border border-obsidian-border text-[11px] font-semibold transition-colors min-h-touch"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </ThemeCard>
      </div>

      {/* Add Walk-in Customer Modal */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <ThemeCard highlighted className="max-w-lg w-full space-y-5 p-6 border-champagne/60 shadow-2xl">
            <div className="flex items-center justify-between border-b border-obsidian-border pb-3">
              <h3 className="text-xl font-bold text-white font-serif flex items-center gap-2">
                <Plus className="w-5 h-5 text-champagne" />
                <span>Quick Walk-in Registration</span>
              </h3>
              <button
                onClick={() => setShowWalkInModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {walkInError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{walkInError}</span>
              </div>
            )}

            <form onSubmit={handleWalkInSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-300 uppercase">Customer Name</label>
                <input
                  type="text"
                  required
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  placeholder="e.g. Ramesh Varma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-white text-sm focus:outline-none focus:border-champagne"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-300 uppercase">10-Digit Mobile</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-white text-sm font-mono focus:outline-none focus:border-champagne"
                />
              </div>

              {/* Service Selection */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-300 uppercase">
                  <span>Select Services</span>
                  <span className="text-champagne">{walkInServices.length} of 3</span>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                  {state.services.map(s => {
                    const isSelected = walkInServices.some(item => item.id === s.id);
                    return (
                      <div
                        key={s.id}
                        onClick={() => toggleWalkInService(s)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer flex justify-between items-center ${
                          isSelected
                            ? 'bg-champagne/15 border-champagne text-white'
                            : 'bg-obsidian-surface border-obsidian-border text-gray-400'
                        }`}
                      >
                        <span className="truncate">{s.name}</span>
                        <span className="font-mono font-bold text-champagne ml-1">₹{s.priceINR}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Barber Preference */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-300 uppercase">Stylist Preference</label>
                <select
                  value={walkInBarber}
                  onChange={(e) => setWalkInBarber(e.target.value as BarberId)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-white text-sm focus:outline-none focus:border-champagne"
                >
                  <option value="any">Any Barber (Fastest Available)</option>
                  {state.barbers.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.status === 'free' ? 'Available' : b.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="flex-1 py-3 rounded-xl bg-obsidian-surface border border-obsidian-border text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-champagne text-obsidian text-xs font-extrabold shadow-luxury"
                >
                  Add to Live Queue
                </button>
              </div>
            </form>
          </ThemeCard>
        </div>
      )}
    </div>
  );
};

// Simple Layout icon helper
function LayoutDashboardIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-champagne" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  );
}
