import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { Scissors, Menu, X, Monitor, Shield, LayoutDashboard, UserCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on the TV display screen, hide the standard navbar for maximum screen real-estate
  if (location.pathname === '/display') {
    return null;
  }

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/join', label: t('nav.joinQueue') },
    { path: '/reception', label: t('nav.reception'), icon: LayoutDashboard },
    { path: '/barber/ravi', label: t('nav.barbers'), icon: UserCheck },
    { path: '/display', label: t('nav.tvDisplay'), icon: Monitor },
    { path: '/admin', label: t('nav.admin'), icon: Shield },
  ];

  return (
    <nav className="bg-charcoal/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group min-h-touch">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all duration-300">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-gold transition-colors font-serif">
                {t('brand.name')}
              </span>
              <span className="block text-[10px] tracking-widest text-gold/80 uppercase font-sans">
                {t('brand.tagline')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors min-h-touch flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gold/15 text-gold font-semibold'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/80'
                  }`}
                >
                  {link.icon && <link.icon className="w-4 h-4 opacity-75" />}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action Area: Language Toggle & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <LanguageToggle />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none min-h-touch min-w-touch flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gold" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-charcoal border-b border-gray-800 px-4 pt-2 pb-4 space-y-1 animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium min-h-touch ${
                  isActive
                    ? 'bg-gold/15 text-gold font-bold'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {link.icon && <link.icon className="w-5 h-5 text-gold" />}
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};
