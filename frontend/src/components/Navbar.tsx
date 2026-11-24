import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { Scissors, Menu, X, Monitor, Shield, LayoutDashboard, UserCheck, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on the TV display screen, hide the standard navbar
  if (location.pathname === '/display') {
    return null;
  }

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/join', label: t('nav.joinQueue'), highlight: true },
    { path: '/reception', label: t('nav.reception'), icon: LayoutDashboard },
    { path: '/barber/ravi', label: t('nav.barbers'), icon: UserCheck },
    { path: '/display', label: t('nav.tvDisplay'), icon: Monitor },
    { path: '/admin', label: t('nav.admin'), icon: Shield },
  ];

  return (
    <nav className="bg-obsidian/95 backdrop-blur-xl border-b border-obsidian-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3.5 group min-h-touch">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-champagne/20 via-champagne/10 to-transparent border border-champagne/40 flex items-center justify-center text-champagne shadow-card-glow group-hover:border-champagne group-hover:scale-105 transition-all duration-300">
              <Scissors className="w-5 h-5 transition-transform group-hover:rotate-12" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-champagne transition-colors font-serif flex items-center gap-1.5">
                {t('brand.name')}
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-champagne" />
              </span>
              <span className="block text-[10px] tracking-[0.2em] text-champagne/70 uppercase font-sans font-medium">
                {t('brand.tagline')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              if (link.highlight) {
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`ml-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 min-h-touch flex items-center gap-2 shadow-luxury ${
                      isActive
                        ? 'bg-champagne text-obsidian shadow-luxury-glow'
                        : 'bg-gradient-to-r from-champagne/20 to-champagne/10 text-champagne border border-champagne/40 hover:bg-champagne hover:text-obsidian hover:shadow-luxury-glow'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all duration-200 min-h-touch flex items-center gap-2 ${
                    isActive
                      ? 'bg-obsidian-card text-champagne border border-champagne/30 shadow-card-glow'
                      : 'text-gray-400 hover:text-white hover:bg-obsidian-surface'
                  }`}
                >
                  {link.icon && <link.icon className="w-4 h-4 opacity-70" />}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action Area: Live System Pill & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Queue Active</span>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-obsidian-surface border border-obsidian-border focus:outline-none min-h-touch min-w-touch flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-champagne" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-obsidian-card border-b border-obsidian-border px-5 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold min-h-touch ${
                  isActive
                    ? 'bg-champagne/15 text-champagne border border-champagne/30 font-bold'
                    : 'text-gray-300 hover:bg-obsidian-surface hover:text-white'
                }`}
              >
                {link.icon && <link.icon className="w-5 h-5 text-champagne" />}
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};
