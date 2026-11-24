import React, { useState, useEffect, useRef } from 'react';
import { useQueue } from '../core/queueStore';
import { soundEffects } from '../core/soundEffects';
import {
  Scissors,
  Volume2,
  Clock,
  Sparkles,
  Wifi
} from 'lucide-react';

export const DisplayScreen: React.FC = () => {
  const { state, getEstimatedWait } = useQueue();
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [flashingToken, setFlashingToken] = useState<string | null>(null);
  const previousCalledTokensRef = useRef<Set<string>>(new Set());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen for newly called tokens to trigger chime and gold pulsing animation
  useEffect(() => {
    const currentlyCalled = state.queue.filter(q => q.status === 'Called');
    const currentlyCalledTokens = new Set(currentlyCalled.map(q => q.token));

    // Check if any token was just called
    for (const token of currentlyCalledTokens) {
      if (!previousCalledTokensRef.current.has(token)) {
        setFlashingToken(token);
        if (audioEnabled) {
          soundEffects.playTurnChime();
        }
        // Keep flash animation for 12 seconds
        const timeout = setTimeout(() => {
          setFlashingToken(prev => (prev === token ? null : prev));
        }, 12000);
        return () => clearTimeout(timeout);
      }
    }

    previousCalledTokensRef.current = currentlyCalledTokens;
  }, [state.queue, audioEnabled]);

  const handleEnableAudio = () => {
    setAudioEnabled(true);
    soundEffects.playTurnChime();
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  // Get upcoming 5 waiting tokens
  const upcomingTokens = state.queue
    .filter(q => q.status === 'Waiting')
    .slice(0, 5);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-obsidian text-white flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden relative">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-champagne/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Header Bar */}
      <header className="flex items-center justify-between pb-6 border-b border-obsidian-border z-10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-champagne/20 via-champagne/10 to-obsidian-surface border-2 border-champagne flex items-center justify-center text-champagne shadow-luxury-glow">
            <Scissors className="w-9 h-9" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-white tracking-wide">
              Luxe Salon
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] text-champagne font-bold mt-0.5">
              Live Lounge Queue Display
            </p>
          </div>
        </div>

        {/* Live Clock & Audio Prompt */}
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <span className="font-mono text-3xl font-black text-white block tracking-tight">
              {formattedTime}
            </span>
            <span className="text-xs text-gray-400 font-medium">{formattedDate}</span>
          </div>

          {!audioEnabled ? (
            <button
              onClick={handleEnableAudio}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-champagne to-champagne-light text-obsidian font-extrabold text-xs shadow-luxury hover:scale-105 active:scale-95 transition-all flex items-center gap-2 animate-bounce cursor-pointer"
            >
              <Volume2 className="w-4 h-4 stroke-[2.5]" />
              <span>Enable Audio & Fullscreen</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Audio Active</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Grid: Barber Chairs Now Serving (Hero of the TV) */}
      <main className="my-auto py-8 z-10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-[0.3em] text-gray-400 font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-champagne" />
            <span>Currently Serving At Stations</span>
          </h2>
          <span className="text-xs font-mono text-champagne">
            {state.barbers.filter(b => b.status === 'busy').length} of {state.barbers.length} Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {state.barbers.map((barber) => {
            const isBusy = barber.status === 'busy';
            const isOnBreak = barber.status === 'break';
            const tokenToDisplay = barber.currentToken || '—';
            const isFlashing = flashingToken === barber.currentToken;

            return (
              <div
                key={barber.id}
                className={`rounded-3xl p-7 transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[320px] ${
                  isFlashing
                    ? 'bg-gradient-to-b from-champagne/25 via-obsidian-card to-obsidian-card border-4 border-champagne shadow-luxury-glow scale-[1.03] animate-pulse ring-4 ring-champagne/40'
                    : isBusy
                    ? 'bg-obsidian-card border-2 border-champagne/60 shadow-luxury'
                    : 'bg-obsidian-card/80 border border-obsidian-border'
                }`}
              >
                {/* Station Badge Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-obsidian-surface border border-obsidian-border flex items-center justify-center font-serif font-black text-champagne text-base">
                      {barber.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white font-serif">{barber.name}</h3>
                      <p className="text-[11px] text-gray-400">{barber.specialty}</p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isFlashing
                        ? 'bg-champagne text-obsidian font-black animate-bounce'
                        : isBusy
                        ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/60'
                        : isOnBreak
                        ? 'bg-obsidian-surface text-gray-500 border border-obsidian-border'
                        : 'bg-obsidian-surface text-gray-400 border border-obsidian-border'
                    }`}
                  >
                    {isFlashing ? 'Calling Now' : isBusy ? 'Serving' : isOnBreak ? 'Break' : 'Available'}
                  </span>
                </div>

                {/* Giant Token typography (legible from 5m) */}
                <div className="text-center py-4 space-y-2">
                  <span className="text-xs uppercase tracking-[0.25em] text-gray-400 font-semibold block">
                    Now Serving
                  </span>
                  <div
                    className={`font-mono font-black tracking-tight leading-none ${
                      isBusy
                        ? 'text-7xl sm:text-8xl text-white'
                        : 'text-6xl text-gray-600'
                    }`}
                  >
                    {tokenToDisplay}
                  </div>
                  {isBusy && barber.currentCustomerName && (
                    <p className="text-lg font-bold text-champagne font-serif truncate mt-2">
                      {barber.currentCustomerName}
                    </p>
                  )}
                  {!isBusy && !isOnBreak && (
                    <p className="text-sm text-emerald-400 font-medium">Chair Ready</p>
                  )}
                </div>

                {/* Station Bottom Tag */}
                <div className="pt-3 border-t border-obsidian-border flex items-center justify-between text-xs text-gray-500 font-mono">
                  <span>Station {barber.name}</span>
                  {isBusy ? <span>In Session</span> : <span>Next customer soon</span>}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom Section: Upcoming 5 Tokens */}
      <footer className="space-y-4 pt-6 border-t border-obsidian-border z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-[0.3em] text-gray-400 font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 text-champagne" />
            <span>Next In Line (Upcoming Tokens)</span>
          </h2>
          <span className="text-xs text-gray-500">
            Please be ready when your token is called
          </span>
        </div>

        {upcomingTokens.length === 0 ? (
          <div className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border text-center text-xs text-gray-400 font-medium">
            No customers in the waiting line right now. Chairs are ready for immediate walk-in.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {upcomingTokens.map((item, idx) => {
              const estimatedWait = getEstimatedWait(item.preferredBarber, item.id);
              return (
                <div
                  key={item.id}
                  className="bg-obsidian-card rounded-2xl p-4 border border-obsidian-border hover:border-champagne/40 transition-all text-center space-y-1 shadow-card-glow"
                >
                  <span className="text-[10px] uppercase font-bold text-champagne/70 block tracking-wider">
                    Position #{idx + 1}
                  </span>
                  <span className="text-3xl font-mono font-black text-white block my-0.5">
                    {item.token}
                  </span>
                  <span className="text-xs text-gray-400 block truncate font-medium">
                    {item.name}
                  </span>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-obsidian-surface border border-obsidian-border text-[11px] font-mono text-champagne">
                    ~{estimatedWait} mins
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Ambient Footer Ticker */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 pt-2 font-sans">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-champagne" />
            <span>Guest High-Speed WiFi: <strong>LuxeSalon</strong> | Pass: <strong>welcome123</strong></span>
          </div>
          <span>Remote check-in: <strong>luxesalon.app/join</strong></span>
        </div>
      </footer>
    </div>
  );
};
