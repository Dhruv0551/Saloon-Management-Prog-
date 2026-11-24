import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQueue } from '../core/queueStore';
import { ThemeCard } from '../components/ThemeCard';
import { StatusBadge } from '../components/StatusBadge';
import {
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Scissors,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const StatusScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, cancelQueueEntry, getEstimatedWait } = useQueue();
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Look up customer by token (e.g. 'S-14') or id
  const customer = state.queue.find(q => q.token === id || q.id === id);

  // Fallback demo entry if user navigates to /status/demo directly
  const entry = customer || state.queue[state.queue.length - 1];

  if (!entry) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-obsidian-surface border border-obsidian-border text-gray-400 mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white font-serif">Queue Token Not Found</h2>
          <p className="text-gray-400 text-sm">
            We could not find an active queue entry with token "{id}".
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

  // Calculate live position among waiting customers
  const waitingCustomers = state.queue.filter(q => q.status === 'Waiting');
  const myWaitingIndex = waitingCustomers.findIndex(q => q.id === entry.id);
  const positionNumber = entry.status === 'Waiting' ? myWaitingIndex + 1 : 0;
  const liveWaitTime = getEstimatedWait(entry.preferredBarber, entry.id);

  const handleConfirmCancel = () => {
    cancelQueueEntry(entry.id, 'Customer self-cancelled from status screen');
    setShowCancelModal(false);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-champagne transition-colors min-h-touch"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <span className="text-[11px] font-mono text-gray-500">
          Ref: {entry.id}
        </span>
      </div>

      {/* Hero Token Card */}
      <ThemeCard highlighted className="text-center space-y-6 py-8 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-20 bg-champagne/10 blur-[50px] pointer-events-none rounded-full" />

        <div className="flex items-center justify-center">
          <StatusBadge status={entry.status} pulsing={entry.status === 'Waiting' || entry.status === 'Called'} />
        </div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.25em] text-champagne/80 font-bold">
            Your Digital Token
          </p>
          <h1 className="text-6xl sm:text-7xl font-black text-white font-mono tracking-tight my-2">
            {entry.token}
          </h1>
          <p className="text-base font-bold text-gray-200">{entry.name}</p>
          <p className="text-xs text-gray-400 font-mono">
            +91 {entry.phone.slice(0, 2)}****{entry.phone.slice(-4)}
          </p>
        </div>

        {/* Position and Estimated Wait Boxes */}
        {entry.status === 'Waiting' && (
          <div className="grid grid-cols-2 gap-3.5 pt-4 border-t border-obsidian-border">
            <div className="p-4 rounded-2xl bg-obsidian-surface border border-obsidian-border text-center">
              <span className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold block">
                Queue Position
              </span>
              <span className="text-3xl font-extrabold text-white mt-1 block">
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
              <span className="text-3xl font-extrabold text-champagne mt-1 block">
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
          <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-600/70 text-amber-200 text-left flex items-start gap-3.5 animate-pulse shadow-luxury">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sm text-white">Start Heading to the Salon!</p>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                You are second in line. Please proceed to the salon so your chair can begin without delay when called.
              </p>
            </div>
          </div>
        )}

        {/* Stage 2 Alert: Called */}
        {entry.status === 'Called' && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-champagne/20 via-champagne/30 to-champagne/20 border-2 border-champagne text-white text-center space-y-2 animate-bounce shadow-luxury-glow">
            <Sparkles className="w-8 h-8 text-champagne mx-auto" />
            <h3 className="text-2xl font-serif font-extrabold text-champagne">
              It's Your Turn!
            </h3>
            <p className="text-sm font-medium text-gray-200">
              Please proceed immediately to <strong>Chair {entry.assignedBarber || 'Reception'}</strong>.
            </p>
          </div>
        )}

        {/* In Chair State */}
        {entry.status === 'In Chair' && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-700/60 text-emerald-300 text-sm flex items-center justify-center gap-2.5">
            <Scissors className="w-5 h-5 text-emerald-400" />
            <span>Service in progress with <strong>{entry.assignedBarber}</strong>. Enjoy your grooming!</span>
          </div>
        )}

        {/* Done State */}
        {entry.status === 'Done' && (
          <div className="p-4 rounded-2xl bg-obsidian-surface border border-obsidian-border text-gray-300 text-sm space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="font-bold text-white">Service Completed</p>
            <p className="text-xs text-gray-400">
              Thank you for visiting Luxe Salon! We look forward to seeing you again.
            </p>
          </div>
        )}

        {/* Cancelled / No-show State */}
        {(entry.status === 'Cancelled' || entry.status === 'No-show') && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-sm space-y-2">
            <XCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <p className="font-bold text-white">Token {entry.status}</p>
            <p className="text-xs text-rose-300/80">
              This spot is no longer active. You are welcome to join the queue again.
            </p>
            <div className="pt-2">
              <Link
                to="/join"
                className="inline-block px-4 py-2 rounded-xl bg-rose-900/60 hover:bg-rose-800/80 text-white text-xs font-semibold"
              >
                Join Queue Again
              </Link>
            </div>
          </div>
        )}

        {/* Booked Services Summary */}
        <div className="p-4 rounded-2xl bg-obsidian-surface border border-obsidian-border text-left space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-obsidian-border pb-2">
            <span>Booked Services ({entry.services.length})</span>
            <span>Total: ₹{entry.totalPriceINR}</span>
          </div>

          <div className="space-y-1.5">
            {entry.services.map(s => (
              <div key={s.id} className="flex items-center justify-between text-xs text-gray-300">
                <span>{s.name}</span>
                <span className="font-mono text-champagne font-medium">₹{s.priceINR}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-obsidian-border flex items-center justify-between text-xs text-gray-400">
            <span>Preferred Stylist:</span>
            <span className="font-medium text-white capitalize">
              {entry.preferredBarber === 'any' ? 'Any Barber (Fastest)' : entry.preferredBarber}
            </span>
          </div>
        </div>

        {/* Cancel Spot Button (Only if still waiting) */}
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

      {/* Confirmation Modal */}
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
