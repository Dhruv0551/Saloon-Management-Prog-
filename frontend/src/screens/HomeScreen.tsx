import React from 'react';
import { Link } from 'react-router-dom';
import { useQueue } from '../core/queueStore';
import { ThemeCard } from '../components/ThemeCard';
import { StatusBadge } from '../components/StatusBadge';
import {
  Users,
  Clock,
  Scissors,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { state, getEstimatedWait } = useQueue();

  const waitingCount = state.queue.filter(q => q.status === 'Waiting').length;
  const inChairCount = state.queue.filter(q => q.status === 'In Chair').length;
  const approxWait = getEstimatedWait('any');
  const activeBarbers = state.barbers.filter(b => b.activeToday && b.status !== 'break').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-14">
      {/* Hero Section */}
      <div className="relative text-center space-y-6 max-w-4xl mx-auto">
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-36 bg-champagne/10 blur-[90px] pointer-events-none rounded-full" />

        {/* Operating Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-obsidian-surface border border-obsidian-border text-xs font-semibold text-gray-300 shadow-card-glow">
          {state.isOpen ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold">Open Today</span>
              <span className="text-gray-600">&bull;</span>
              <span>{state.openTime} AM – {state.closeTime} PM</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-rose-400 font-bold">Queue Closed</span>
              <span className="text-gray-600">&bull;</span>
              <span>Walk-ins Only at Reception</span>
            </>
          )}
        </div>

        {/* Hero Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight font-serif leading-[1.1]">
            Elevated Grooming, <br />
            <span className="bg-gradient-to-r from-champagne via-champagne-light to-champagne-rose bg-clip-text text-transparent font-serif italic">
              Zero Waiting Room Chaos.
            </span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto font-sans leading-relaxed">
            Join our remote digital queue, pick your preferred master stylist, and arrive precisely when your chair is ready.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/join"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-champagne via-champagne-light to-champagne-dark text-obsidian font-extrabold text-base shadow-luxury hover:shadow-luxury-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 min-h-touch group"
          >
            <Sparkles className="w-5 h-5 text-obsidian/80 group-hover:rotate-12 transition-transform" />
            <span>Join the Queue Now</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/reception"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-obsidian-surface hover:bg-obsidian-card text-gray-300 hover:text-white border border-obsidian-border hover:border-champagne/40 font-semibold text-sm transition-all duration-200 min-h-touch shadow-card-glow"
          >
            <span>Staff Reception Portal</span>
          </Link>
        </div>
      </div>

      {/* Live Queue Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <ThemeCard className="flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-2xl bg-champagne/10 border border-champagne/30 flex items-center justify-center text-champagne group-hover:border-champagne/70 transition-colors shadow-card-glow">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
              People Waiting
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
                {waitingCount}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                ({inChairCount} in chair)
              </span>
            </div>
          </div>
        </ThemeCard>

        <ThemeCard className="flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-2xl bg-blue-950/40 border border-blue-800/40 flex items-center justify-center text-blue-400 group-hover:border-blue-600 transition-colors shadow-card-glow">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
              Approx. Wait Time
            </p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-champagne font-sans">
                ~{approxWait}
              </span>
              <span className="text-xs text-gray-400 font-medium">minutes</span>
            </div>
          </div>
        </ThemeCard>

        <ThemeCard className="flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400 group-hover:border-emerald-600 transition-colors shadow-card-glow">
            <Scissors className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
              Active Barbers
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
                {activeBarbers} / {state.barbers.length}
              </span>
              <span className="text-xs text-emerald-400 font-medium">on duty</span>
            </div>
          </div>
        </ThemeCard>
      </div>

      {/* Barber Availability Cards Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-obsidian-border pb-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-champagne font-bold block mb-1">
              Meet The Artisans
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif flex items-center gap-2.5">
              <span>Barber Availability & Live Chairs</span>
            </h2>
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Live Chair Coordination
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {state.barbers.map((barber) => (
            <Link
              key={barber.id}
              to={`/barber/${barber.id}`}
              className="group block"
            >
              <ThemeCard hoverEffect className="space-y-5 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-champagne/20 to-obsidian-surface border border-champagne/30 flex items-center justify-center text-champagne font-serif font-bold text-xl shadow-card-glow group-hover:border-champagne/80 group-hover:scale-105 transition-all">
                        {barber.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-champagne transition-colors font-serif">
                          {barber.name}
                        </h3>
                        <p className="text-xs text-champagne/80 font-medium">{barber.specialty}</p>
                      </div>
                    </div>
                    <StatusBadge status={barber.status} />
                  </div>

                  {/* Active Serving Status */}
                  <div className="p-3.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Currently Serving:</span>
                      {barber.status === 'busy' ? (
                        <span className="font-mono font-bold text-champagne text-sm">
                          {barber.currentToken}
                        </span>
                      ) : barber.status === 'break' ? (
                        <span className="text-gray-500 italic">On Break</span>
                      ) : (
                        <span className="text-emerald-400 font-semibold">Available Now</span>
                      )}
                    </div>

                    {barber.status === 'busy' && barber.currentCustomerName && (
                      <p className="text-gray-300 font-medium truncate">
                        Client: {barber.currentCustomerName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-obsidian-border flex items-center justify-between text-xs text-gray-400 group-hover:text-champagne transition-colors">
                  <span>View chair station</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </ThemeCard>
            </Link>
          ))}
        </div>
      </div>

      {/* Quality Guarantees / Footer Trust Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-obsidian-border">
        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-obsidian-surface/60 border border-obsidian-border">
          <CheckCircle className="w-5 h-5 text-champagne flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-white">Live Turn Alerts</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Receive on-screen alerts when you reach position #2 so you never wait inside.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-obsidian-surface/60 border border-obsidian-border">
          <Sparkles className="w-5 h-5 text-champagne flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-white">Select Up To 3 Services</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Combine haircuts, beard styling, and spa treatments with transparent pricing.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-obsidian-surface/60 border border-obsidian-border">
          <AlertCircle className="w-5 h-5 text-champagne flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-white">Zero Hassle Cancellations</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Cancel your spot anytime if your schedule changes with a single tap.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
