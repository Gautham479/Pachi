"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Lock, Rocket, Search, ShoppingCart, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('quote');
  const [scrolled, setScrolled] = useState(false);
  const cart = useStore((state) => state.cart);
  const openCart = useStore((state) => state.openCart);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = ['quote', 'features', 'how-it-works', 'faq'];
      let current = 'quote';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            current = section;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      router.push(`/?section=${id}`);
    } else {
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const goToHome = () => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      router.push('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = (event) => {
    const nextQuery = event.target.value;
    setSearchQuery(nextQuery);
    if (pathname !== '/') {
      router.push('/?section=content');
      return;
    }
    const contentSection = document.getElementById('content');
    if (contentSection) {
      const y = contentSection.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <nav
      className={`w-full sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-surface-bg/80 backdrop-blur-xl border-b border-surface-border/60 shadow-lg shadow-primary-500/5'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      {/* Top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-60" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-8">
            <motion.div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={goToHome}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="relative w-9 h-9 flex items-center justify-center">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-0 rounded-xl border border-primary-500/30 group-hover:border-primary-500/60 transition-colors" />
                <span className="text-xl relative z-10">🖨️</span>
              </div>
              <span className="font-black text-xl tracking-tight text-fg">
                Pachi <span className="gradient-text">3D</span>
              </span>
            </motion.div>

            {/* Nav Links */}
            <div className="hidden lg:flex items-center gap-1 text-sm font-semibold">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeSection === link.id
                      ? 'text-primary-500'
                      : 'text-fg-muted hover:text-fg hover:bg-surface-muted/50'
                  }`}
                >
                  {activeSection === link.id && (
                    <motion.div
                      layoutId="navActive"
                      className="absolute inset-0 rounded-lg bg-primary-500/10 border border-primary-500/20"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => router.push('/admin/login')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-surface-border bg-surface-card/50 text-fg-muted hover:text-primary-500 hover:border-primary-500/40 hover:bg-primary-500/5 transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              Admin Login
            </button>

            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-surface-card/60 backdrop-blur-sm border border-surface-border/80 rounded-full px-3 py-2 w-64 hover:border-primary-500/40 focus-within:border-primary-500/60 focus-within:bg-surface-card transition-all">
              <Search className="w-4 h-4 text-fg-subtle flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="w-full bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
                aria-label="Search products"
              />
            </div>

            <ThemeToggle />

            {/* Cart */}
            <motion.button
              className="relative p-2 rounded-xl border border-surface-border/60 bg-surface-card/50 hover:border-primary-500/40 hover:bg-primary-500/5 transition-all"
              onClick={openCart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-5 h-5 text-fg-muted" />
              <AnimatePresence>
                {cart.length > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-primary-500 to-accent-500 text-white text-[10px] font-black w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center shadow-lg"
                  >
                    {cart.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* CTA */}
            <motion.button
              onClick={() => scrollTo('quote')}
              className="btn-glow bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold px-5 py-2 rounded-full flex items-center gap-2 text-sm transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Rocket className="w-4 h-4" />
              Get Quote
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
}
