import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQueue } from '../core/queueStore';
import { BarberId } from '../types/queue';
import { ThemeCard } from '../components/ThemeCard';
import { StatusBadge } from '../components/StatusBadge';
import { soundEffects } from '../core/soundEffects';
import {
  Scissors,
  Play,
  CheckCircle,
  Coffee,
  Clock,
  UserCheck,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const BarberScreen: React.FC = () => {
  const { name = 'ravi' } = useParams<{ name: string }>();
  const barberId = name.toLowerCase() as BarberId;
  const { state, callNextCustomer, startService, completeService, toggleBarberBreak } = useQueue();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Find barber object from state
  const barber = state.barbers.find(b => b.id === barberId);

  // Current active customer
  const currentCustomer = state.queue.find(
    q => q.id === barber?.currentCustomerId || (barber?.currentToken && q.token === barber.currentToken)
  );

  // Next upcoming customer assigned specifically to this barber or Any Barber
  const upcomingCustomer = state.queue.find(
    q => q.status === 'Waiting' && (q.preferredBarber === barberId || q.preferredBarber === 'any')
  );

  // Live stopwatch when service is In Chair or Called
  useEffect(() => {
    let interval: any = null;
    if (barber?.serviceStartTime && barber.status === 'busy') {
      const startMs = new Date(barber.serviceStartTime).getTime();
      interval = setInterval(() => {
        const secs = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
        setElapsedSeconds(secs);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [barber?.serviceStartTime, barber?.status]);

  if (!barber) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white font-serif">Barber Not Found</h2>
        <p className="text-gray-400 text-sm">Please choose an active stylist station:</p>
        <div className="flex justify-center gap-3">
          {state.barbers.map(b => (
            <Link
              key={b.id}
              to={`/barber/${b.id}`}
              className="px-4 py-2 rounded-xl bg-champagne text-obsidian font-bold text-xs"
            >
              {b.name}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCallNext = () => {
    callNextCustomer(barber.id);
    soundEffects.playTurnChime();
  };

  const isCustomerSeated = currentCustomer?.status === 'In Chair';
  const isCustomerCalled = currentCustomer?.status === 'Called';

  return (
    <div className="max-w-md mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Station Selector Quick Tabs */}
      <div className="flex items-center justify-between pb-3 border-b border-obsidian-border text-xs">
        <span className="text-gray-400 font-semibold uppercase tracking-wider">Station:</span>
        <div className="flex gap-2">
          {state.barbers.map(b => (
            <Link
              key={b.id}
              to={`/barber/${b.id}`}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                b.id === barberId
                  ? 'bg-champagne text-obsidian shadow-sm'
                  : 'bg-obsidian-surface text-gray-400 hover:text-white'
              }`}
            >
              {b.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Stylist Profile Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-champagne/20 to-obsidian-surface border border-champagne/40 flex items-center justify-center font-serif font-black text-champagne text-xl shadow-card-glow">
            {barber.avatar}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-serif">{barber.name}'s Chair</h1>
            <p className="text-xs text-champagne/80 font-medium">{barber.specialty}</p>
          </div>
        </div>

        <StatusBadge status={barber.status} />
      </div>

      {/* Main Focus Card: Current Customer */}
      <ThemeCard highlighted={barber.status === 'busy'} className="space-y-5 text-center py-7">
        {barber.status === 'busy' && currentCustomer ? (
          <>
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.2em] text-champagne font-bold block">
                {isCustomerSeated ? 'Now In Chair' : 'Customer Called — Awaiting Arrival'}
              </span>
              <div className="text-6xl font-black font-mono text-white tracking-tight my-2">
                {currentCustomer.token}
              </div>
              <p className="text-xl font-bold text-gray-100 font-serif">{currentCustomer.name}</p>
              <p className="text-xs text-gray-400 font-mono">+91 {currentCustomer.phone}</p>
            </div>

            {/* Services List */}
            <div className="p-3.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-left space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block border-b border-obsidian-border pb-1">
                Requested Services ({currentCustomer.services.length})
              </span>
              <div className="space-y-1">
                {currentCustomer.services.map(s => (
                  <div key={s.id} className="flex justify-between text-xs text-gray-200">
                    <span>{s.name}</span>
                    <span className="text-champagne font-mono font-medium">{s.durationMinutes}m</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Service Stopwatch */}
            <div className="p-4 rounded-2xl bg-obsidian-surface border border-obsidian-border flex items-center justify-center gap-3">
              <Clock className="w-6 h-6 text-champagne animate-pulse" />
              <span className="font-mono text-3xl font-black text-white tracking-wider">
                {formatTimer(elapsedSeconds)}
              </span>
              <span className="text-xs text-gray-400 font-mono">
                / {currentCustomer.totalDurationMinutes}m est
              </span>
            </div>

            {/* Primary Action Buttons (Massive 52px Touch Targets) */}
            <div className="space-y-3 pt-2">
              {isCustomerCalled && (
                <button
                  onClick={() => startService(barber.id)}
                  className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-95"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Customer Seated (Start Service)</span>
                </button>
              )}

              {isCustomerSeated && (
                <button
                  onClick={() => completeService(barber.id)}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-champagne via-champagne-light to-champagne-dark text-obsidian font-black text-base shadow-luxury hover:shadow-luxury-glow flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-95"
                >
                  <CheckCircle className="w-5 h-5 stroke-[2.5]" />
                  <span>Complete Service (Mark Done)</span>
                </button>
              )}
            </div>
          </>
        ) : barber.status === 'break' ? (
          <div className="py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-950/60 border border-amber-700/60 text-amber-300 mx-auto flex items-center justify-center">
              <Coffee className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white font-serif">You Are On Break</h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Your station is paused. You will not be dispatched new tokens until you resume.
              </p>
            </div>
            <button
              onClick={() => toggleBarberBreak(barber.id)}
              className="px-6 py-3 rounded-xl bg-champagne text-obsidian font-bold text-xs shadow-md"
            >
              Resume Available
            </button>
          </div>
        ) : (
          <div className="py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 mx-auto flex items-center justify-center">
              <Scissors className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-white font-serif">Chair is Ready</h3>
              <p className="text-xs text-gray-400">
                {upcomingCustomer
                  ? `Next in line: ${upcomingCustomer.token} (${upcomingCustomer.name})`
                  : 'No customers waiting in line right now.'}
              </p>
            </div>

            <button
              onClick={handleCallNext}
              disabled={!upcomingCustomer}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-champagne via-champagne-light to-champagne-dark text-obsidian font-black text-base shadow-luxury hover:shadow-luxury-glow disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 transition-all active:scale-95"
            >
              <UserCheck className="w-5 h-5 stroke-[2.5]" />
              <span>Call Next Customer</span>
            </button>
          </div>
        )}
      </ThemeCard>

      {/* Upcoming Customer Preview Card */}
      {upcomingCustomer && (
        <ThemeCard className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-obsidian-border pb-2">
            <span>Next In Line For Your Station</span>
            <Sparkles className="w-3.5 h-3.5 text-champagne" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xl font-bold text-champagne block">
                {upcomingCustomer.token}
              </span>
              <p className="text-sm font-bold text-white">{upcomingCustomer.name}</p>
              <p className="text-xs text-gray-400">
                {upcomingCustomer.services.map(s => s.name).join(', ')}
              </p>
            </div>
            <span className="text-xs font-mono text-gray-400 bg-obsidian-surface px-3 py-1.5 rounded-lg border border-obsidian-border">
              ~{upcomingCustomer.totalDurationMinutes} mins
            </span>
          </div>
        </ThemeCard>
      )}

      {/* Quick Break Button */}
      {barber.status !== 'break' && (
        <button
          onClick={() => toggleBarberBreak(barber.id)}
          className="w-full py-3.5 rounded-xl border border-obsidian-border hover:border-champagne/40 text-gray-400 hover:text-champagne text-xs font-semibold flex items-center justify-center gap-2 transition-colors min-h-touch"
        >
          <Coffee className="w-4 h-4" />
          <span>Toggle Break Mode</span>
        </button>
      )}
    </div>
  );
};
