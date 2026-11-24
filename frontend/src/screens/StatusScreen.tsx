import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQueue } from '../core/queueStore';
import { soundEffects } from '../core/soundEffects';
import { ThemeCard } from '../components/ThemeCard';
import { StatusBadge } from '../components/StatusBadge';
import {
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Scissors,
  CheckCircle,
  XCircle,
  Clock,
  Compass,
  Volume2
} from 'lucide-react';

export const StatusScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, cancelQueueEntry, getEstimatedWait } = useQueue();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCalledModal, setShowCalledModal] = useState(false);
  const previousStatusRef = useRef<string | null>(null);

  // Find customer by token or ID
  const customer = state.queue.find(q => q.token === id || q.id === id);
  const entry = customer || state.queue[state.queue.length - 1];

  // Play chime and trigger takeover modal when called
  useEffect(() => {
    if (entry) {
      if (entry.status === 'Called' && previousStatusRef.current !== 'Called') {
        soundEffects.playTurnChime();
        setShowCalledModal(true);
      }
      previousStatusRef.current = entry.status;
    }
  }, [entry?.status]);

  if (!entry) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-obsidian-surface border border-obsidian-border text-gray-400 mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white font-serif">Queue Token Not Found</h2>
          <p className="text-gray-400 text-sm">
            We could not find an active queue entry for token "{id}".
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-champagne text-obsidian font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    );
  }

  // Calculate live waiting queue position
  const waitingCustomers = state.queue.filter(q => q.status === 'Waiting');
  const myWaitingIndex = waitingCustomers.findIndex(q => q.id === entry.id);
  const positionNumber = entry.status === 'Waiting' ? myWaitingIndex + 1 : 0;
  const liveWaitTime = getEstimatedWait(entry.preferredBarber, entry.id);

  const handleConfirmCancel = () => {
    cancelQueueEntry(entry.id, 'Customer self-cancelled spot');
    setShowCancelModal(false);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-champagne transition-colors min-h-touch"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <button
          onClick={() => soundEffects.playTurnChime()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-obsidian-surface border border-obsidian-border text-[11px] text-champagne hover:border-champagne/40 transition-colors"
          title="Test notification chime"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Test Sound</span>
        </button>
      </div>

      {/* Main Status Hero Card */}
      <ThemeCard highlighted className="text-center space-y-6 py-8 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-24 bg-champagne/10 blur-[60px] pointer-events-none rounded-full" />

        <div className="flex items-center justify-center">
          <StatusBadge
            status={entry.status}
            pulsing={entry.status === 'Waiting' || entry.status === 'Called'}
          />
        </div>

        {/* Big Token Display */}
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-[0.25em] text-champagne/80 font-bold block">
            Digital Queue Token
          </span>
          <h1 className="text-6xl sm:text-7xl font-black text-white font-mono tracking-tight my-2">
            {entry.token}
          </h1>
          <p className="text-lg font-bold text-gray-200 font-serif">{entry.name}</p>
          <p className="text-xs text-gray-400 font-mono">
            +91 {entry.phone.slice(0, 2)}****{entry.phone.slice(-4)} &bull; {entry.isWalkIn ? 'Walk-in Guest' : 'Remote Check-in'}
          </p>
        </div>

        {/* Position & Estimated Wait (Active when Waiting) */}
        {entry.status === 'Waiting' && (
          <div className="grid grid-cols-2 gap-3.5 pt-4 border-t border-obsidian-border">
            <div className="p-4 rounded-2xl bg-obsidian-surface border border-obsidian-border text-center">
              <span className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold block">
                Queue Position
              </span>
              <span className="text-3xl font-extrabold text-white mt-1 block font-sans">
                #{positionNumber}
              </span>
              <span className="text-[10px] text-gray-500 mt-0.5 block">
                {positionNumber === 1 ? 'Next to be called' : 'in line'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-surface border border-obsidian-border text-center">
              <span className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold block">
                Est. Waiting Time
              </span>
              <span className="text-3xl font-extrabold text-champagne mt-1 block font-sans">
                ~{liveWaitTime}
              </span>
              <span className="text-[10px] text-gray-500 mt-0.5 block">
                minutes remaining
              </span>
            </div>
          </div>
        )}

        {/* Stage 1 Alert: Position == 2 */}
        {entry.status === 'Waiting' && positionNumber === 2 && (
          <div className="p-4.5 rounded-2xl bg-gradient-to-r from-amber-950/60 to-obsidian-surface border border-amber-600/70 text-amber-200 text-left flex items-start gap-3.5 animate-pulse shadow-luxury">
            <Compass className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sm text-white">Start Heading to the Salon!</p>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                You are currently #2 in line. Please begin traveling to the salon now so your chair can begin promptly when called.
              </p>
            </div>
          </div>
        )}

        {/* Stage 2 Alert Banner: Called */}
        {entry.status === 'Called' && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-champagne/20 via-champagne/30 to-champagne/20 border-2 border-champagne text-white text-center space-y-2 animate-bounce shadow-luxury-glow">
            <Sparkles className="w-8 h-8 text-champagne mx-auto" />
            <h3 className="text-2xl font-serif font-extrabold text-champagne">
              It's Your Turn!
            </h3>
            <p className="text-sm font-medium text-gray-200">
              Please proceed immediately to <strong>Chair {entry.assignedBarber || 'Reception Desk'}</strong>.
            </p>
            <button
              onClick={() => setShowCalledModal(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-champagne text-obsidian font-bold text-xs shadow-lg"
            >
              View Full Directions
            </button>
          </div>
        )}

        {/* In Chair State */}
        {entry.status === 'In Chair' && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-700/60 text-emerald-300 text-sm flex items-center justify-center gap-2.5">
            <Scissors className="w-5 h-5 text-emerald-400 animate-spin" />
            <span>Service currently in progress with <strong>{entry.assignedBarber}</strong>. Enjoy your visit!</span>
          </div>
        )}

        {/* Completed State */}
        {entry.status === 'Done' && (
          <div className="p-5 rounded-2xl bg-obsidian-surface border border-obsidian-border text-gray-300 text-sm space-y-2">
            <CheckCircle className="w-9 h-9 text-emerald-400 mx-auto" />
            <p className="font-bold text-white text-base">Service Completed</p>
            <p className="text-xs text-gray-400">
              Thank you for visiting Luxe Salon! We look forward to welcoming you back soon.
            </p>
            <div className="pt-2">
              <Link
                to="/"
                className="inline-block px-5 py-2.5 rounded-xl bg-champagne text-obsidian font-bold text-xs"
              >
                Book Another Visit
              </Link>
            </div>
          </div>
        )}

        {/* Cancelled or No-show State */}
        {(entry.status === 'Cancelled' || entry.status === 'No-show') && (
          <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-sm space-y-2">
            <XCircle className="w-9 h-9 text-rose-400 mx-auto" />
            <p className="font-bold text-white text-base">Token {entry.status}</p>
            <p className="text-xs text-rose-300/80">
              This queue spot is no longer active. If you would like to join again, you can register a new token.
            </p>
            <div className="pt-2">
              <Link
                to="/join"
                className="inline-block px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
              >
                Join Queue Again
              </Link>
            </div>
          </div>
        )}

        {/* Booked Services Summary */}
        <div className="p-4 rounded-2xl bg-obsidian-surface border border-obsidian-border text-left space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-obsidian-border pb-2">
            <span>Selected Services ({entry.services.length})</span>
            <span className="text-champagne font-mono">Total: ₹{entry.totalPriceINR}</span>
          </div>

          <div className="space-y-1.5">
            {entry.services.map(s => (
              <div key={s.id} className="flex items-center justify-between text-xs text-gray-300">
                <span className="font-medium text-white">{s.name}</span>
                <span className="font-mono text-champagne font-semibold">₹{s.priceINR}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-obsidian-border flex items-center justify-between text-xs text-gray-400">
            <span>Preferred Stylist:</span>
            <span className="font-medium text-white capitalize">
              {entry.preferredBarber === 'any' ? 'Any Barber (Fastest)' : entry.preferredBarber}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Est. Duration:</span>
            <span className="font-medium text-white flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-champagne" />
              {entry.totalDurationMinutes} mins
            </span>
          </div>
        </div>

        {/* Self Cancellation Button (Only while Waiting) */}
        {entry.status === 'Waiting' && (
          <button
            type="button"
            onClick={() => setShowCancelModal(true)}
            className="w-full py-3 rounded-xl border border-rose-900/50 hover:border-rose-700 text-rose-400 hover:bg-rose-950/30 text-xs font-semibold transition-colors min-h-touch"
          >
            Cancel My Spot
          </button>
        )}
      </ThemeCard>

      {/* Full-Screen "It's Your Turn!" Modal Takeover */}
      {showCalledModal && entry.status === 'Called' && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <ThemeCard highlighted className="max-w-md w-full text-center space-y-6 p-8 border-2 border-champagne shadow-luxury-glow">
            <div className="w-20 h-20 rounded-full bg-champagne/20 border-2 border-champagne text-champagne mx-auto flex items-center justify-center animate-bounce shadow-luxury-glow">
              <Scissors className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-champagne font-bold block">
                Token {entry.token}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
                It's Your Turn!
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Your barber <strong className="text-champagne font-serif text-base">{entry.assignedBarber || 'Stylist'}</strong> is ready for you now.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-obsidian-surface border border-obsidian-border text-xs text-gray-300 space-y-1 text-left">
              <p className="font-bold text-white">Next Steps:</p>
              <p>&bull; Walk to the styling floor.</p>
              <p>&bull; Have a seat at <strong>Chair {entry.assignedBarber || '1'}</strong>.</p>
              <p>&bull; Show your token <strong>{entry.token}</strong> to your barber.</p>
            </div>

            <button
              onClick={() => setShowCalledModal(false)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-champagne via-champagne-light to-champagne-dark text-obsidian font-extrabold text-base shadow-luxury min-h-touch"
            >
              I'm Heading In
            </button>
          </ThemeCard>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <ThemeCard className="max-w-sm w-full space-y-4 p-6 border-rose-900/80 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-serif">Cancel Your Spot?</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Are you sure you want to cancel token <strong>{entry.token}</strong>? You will lose your position in line.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="py-2.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-gray-300 hover:text-white text-xs font-semibold min-h-touch"
              >
                Keep Spot
              </button>
              <button
                onClick={handleConfirmCancel}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold min-h-touch"
              >
                Yes, Cancel
              </button>
            </div>
          </ThemeCard>
        </div>
      )}
    </div>
  );
};
