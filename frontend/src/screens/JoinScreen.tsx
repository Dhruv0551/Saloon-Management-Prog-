import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQueue } from '../core/queueStore';
import { BarberId, ServiceItem } from '../types/queue';
import { isOnlineJoiningAllowed } from '../core/queueEngine';
import { ThemeCard } from '../components/ThemeCard';
import { StatusBadge } from '../components/StatusBadge';
import {
  Scissors,
  Clock,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  User,
  Zap,
  Info
} from 'lucide-react';

export const JoinScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, addCustomer, getEstimatedWait } = useQueue();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const activeServices = state.services.filter(s => s.active);
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>(() => 
    activeServices.length > 0 ? [activeServices[0]] : []
  );
  const [preferredBarber, setPreferredBarber] = useState<BarberId>('any');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check online registration availability (salon open switch and 30-min closing cutoff)
  const queueStatusCheck = isOnlineJoiningAllowed(state);
  if (!queueStatusCheck.allowed) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-400 mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white font-serif">Online Registration Unavailable</h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
            {queueStatusCheck.reason}
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-obsidian-surface border border-obsidian-border text-gray-300 hover:text-white hover:border-champagne/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  // Handle service selection toggle (Max 3)
  const toggleService = (service: ServiceItem) => {
    setError(null);
    const exists = selectedServices.some(s => s.id === service.id);

    if (exists) {
      if (selectedServices.length === 1) {
        setError('Please select at least 1 service');
        return;
      }
      setSelectedServices(prev => prev.filter(s => s.id !== service.id));
    } else {
      if (selectedServices.length >= 3) {
        setError('Maximum 3 services can be selected per appointment');
        return;
      }
      setSelectedServices(prev => [...prev, service]);
    }
  };

  // Live totals
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalPrice = selectedServices.reduce((acc, s) => acc + s.priceINR, 0);
  const dynamicWaitTime = getEstimatedWait(preferredBarber);

  // Check if selected barber is on break
  const chosenBarberObj = state.barbers.find(b => b.id === preferredBarber);
  const isBarberOnBreak = chosenBarberObj?.status === 'break';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setIsSubmitting(true);
    const result = addCustomer({
      name,
      phone,
      services: selectedServices,
      preferredBarber
    });

    if (result.success && result.entry) {
      // Redirect to live status screen
      navigate(`/status/${result.entry.token}`);
    } else {
      setError(result.error || 'Failed to join queue. Please check your details.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button & Page Title */}
      <div className="space-y-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-champagne transition-colors min-h-touch"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-champagne font-bold block mb-1">
            Fast Remote Check-in
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
            Join the Salon Queue
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Pick your services, select your barber, and secure your place in line.
          </p>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-sm flex items-start gap-3 shadow-lg animate-fadeIn">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Details (8 Columns) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Customer Information */}
          <ThemeCard className="space-y-5">
            <h2 className="text-base font-bold text-white font-serif flex items-center gap-2 border-b border-obsidian-border pb-3">
              <User className="w-4 h-4 text-champagne" />
              <span>1. Your Contact Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Full Name <span className="text-champagne">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dhruv Sharma"
                    className="w-full px-4 py-3.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-white placeholder-gray-500 focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                  10-Digit Mobile Number <span className="text-champagne">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-gray-400 pointer-events-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-white placeholder-gray-500 focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all text-sm font-mono tracking-wide"
                  />
                  {phone.length === 10 && /^[6-9]/.test(phone) && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3.5 pointer-events-none" />
                  )}
                </div>
                <p className="text-[11px] text-gray-500">
                  Required for your queue token and live on-screen status updates.
                </p>
              </div>
            </div>
          </ThemeCard>

          {/* Section 2: Service Selection (Max 3) */}
          <ThemeCard className="space-y-5">
            <div className="flex items-center justify-between border-b border-obsidian-border pb-3">
              <h2 className="text-base font-bold text-white font-serif flex items-center gap-2">
                <Scissors className="w-4 h-4 text-champagne" />
                <span>2. Select Services</span>
              </h2>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                selectedServices.length === 3
                  ? 'bg-amber-950/40 text-amber-300 border-amber-700/50'
                  : 'bg-obsidian-surface text-champagne border-champagne/30'
              }`}>
                {selectedServices.length} of 3 selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {state.services.filter(s => s.active).map((service) => {
                const isSelected = selectedServices.some(s => s.id === service.id);
                const isMaxReached = selectedServices.length >= 3 && !isSelected;

                return (
                  <div
                    key={service.id}
                    onClick={() => !isMaxReached && toggleService(service)}
                    className={`p-4 rounded-xl border transition-all duration-200 select-none flex flex-col justify-between ${
                      isSelected
                        ? 'bg-champagne/10 border-champagne text-white shadow-card-glow cursor-pointer'
                        : isMaxReached
                        ? 'bg-obsidian-surface/40 border-obsidian-border/50 opacity-40 cursor-not-allowed'
                        : 'bg-obsidian-surface border-obsidian-border hover:border-champagne/40 cursor-pointer'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-sm text-white">{service.name}</h3>
                        <span className="font-mono font-bold text-champagne text-sm whitespace-nowrap">
                          ₹{service.priceINR}
                        </span>
                      </div>
                      {service.description && (
                        <p className="text-xs text-gray-400 line-clamp-2">
                          {service.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 mt-2 border-t border-obsidian-border/60 flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-champagne" />
                        {service.durationMinutes} mins
                      </span>
                      <span className={`text-xs font-semibold ${isSelected ? 'text-champagne' : 'text-gray-500'}`}>
                        {isSelected ? '✓ Selected' : isMaxReached ? 'Limit (3)' : '+ Add'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ThemeCard>

          {/* Section 3: Barber Selection */}
          <ThemeCard className="space-y-5">
            <div className="border-b border-obsidian-border pb-3">
              <h2 className="text-base font-bold text-white font-serif flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-champagne" />
                <span>3. Preferred Barber</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Choose fastest service or request a specific stylist.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Option 1: Any Barber (Fastest) */}
              <div
                onClick={() => setPreferredBarber('any')}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  preferredBarber === 'any'
                    ? 'bg-champagne/10 border-champagne text-white shadow-card-glow ring-1 ring-champagne/40'
                    : 'bg-obsidian-surface border-obsidian-border hover:border-champagne/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-champagne/20 border border-champagne/40 flex items-center justify-center text-champagne">
                      <Zap className="w-5 h-5 fill-champagne/30" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Any Barber</h4>
                      <p className="text-xs text-emerald-400 font-medium">Fastest Available Turn</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="preferredBarber"
                    checked={preferredBarber === 'any'}
                    onChange={() => setPreferredBarber('any')}
                    className="accent-champagne w-4 h-4"
                  />
                </div>
              </div>

              {/* Specific Barbers */}
              {state.barbers.map((barber) => (
                <div
                  key={barber.id}
                  onClick={() => setPreferredBarber(barber.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    preferredBarber === barber.id
                      ? 'bg-champagne/10 border-champagne text-white shadow-card-glow ring-1 ring-champagne/40'
                      : 'bg-obsidian-surface border-obsidian-border hover:border-champagne/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-obsidian-card border border-obsidian-border flex items-center justify-center text-champagne font-serif font-bold text-base">
                        {barber.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{barber.name}</h4>
                        <p className="text-xs text-gray-400 truncate max-w-[120px]">{barber.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={barber.status} />
                      <input
                        type="radio"
                        name="preferredBarber"
                        checked={preferredBarber === barber.id}
                        onChange={() => setPreferredBarber(barber.id)}
                        className="accent-champagne w-4 h-4 ml-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Barber on break alert */}
            {isBarberOnBreak && (
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-700/50 text-amber-300 text-xs flex items-center gap-2.5">
                <Info className="w-4 h-4 flex-shrink-0 text-amber-400" />
                <span>
                  <strong>{chosenBarberObj?.name}</strong> is currently on a break. Your wait time may be longer than usual.
                </span>
              </div>
            )}
          </ThemeCard>
        </div>

        {/* Right Column: Live Sticky Summary (4 Columns) */}
        <div className="lg:col-span-4 sticky top-24 space-y-5">
          <ThemeCard highlighted className="space-y-6">
            <h2 className="text-lg font-bold text-white font-serif border-b border-obsidian-border pb-3 flex items-center justify-between">
              <span>Appointment Summary</span>
              <Sparkles className="w-4 h-4 text-champagne" />
            </h2>

            {/* Selected Services Tags */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Selected Services ({selectedServices.length}):
              </span>
              <div className="space-y-2">
                {selectedServices.map(s => (
                  <div key={s.id} className="flex items-center justify-between text-xs py-1.5 border-b border-obsidian-border/50 text-gray-300">
                    <span className="font-medium text-white">{s.name}</span>
                    <span className="font-mono text-champagne font-bold">₹{s.priceINR}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Math Breakdown */}
            <div className="p-4 rounded-xl bg-obsidian-surface border border-obsidian-border space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Total Service Duration:</span>
                <span className="font-semibold text-white flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-champagne" />
                  {totalDuration} mins
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Estimated Wait Time:</span>
                <span className="font-bold text-champagne text-sm">
                  ~{dynamicWaitTime} mins
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Stylist:</span>
                <span className="font-medium text-white capitalize">
                  {preferredBarber === 'any' ? 'Any Barber (Fastest)' : chosenBarberObj?.name}
                </span>
              </div>

              <div className="pt-3 border-t border-obsidian-border flex items-center justify-between">
                <span className="text-sm font-bold text-white">Total Amount:</span>
                <span className="text-2xl font-black text-champagne font-mono">
                  ₹{totalPrice}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 italic text-right">
                (Payable at salon counter after service)
              </p>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting || selectedServices.length === 0}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-champagne via-champagne-light to-champagne-dark text-obsidian font-extrabold text-base shadow-luxury hover:shadow-luxury-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-touch flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isSubmitting ? 'Securing Spot...' : 'Confirm & Get Token'}</span>
            </button>

            <p className="text-[11px] text-gray-500 text-center leading-normal">
              By confirming, a digital token will be generated. You can track your position in real-time.
            </p>
          </ThemeCard>
        </div>
      </form>
    </div>
  );
};
