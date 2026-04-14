"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Rocket, Search, ShoppingCart } from 'lucide-react';
import { useStore } from '../store/useStore';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('quote');
  const cart = useStore((state) => state.cart);
  const openCart = useStore((state) => state.openCart);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['quote', 'features', 'how-it-works', 'faq'];
      let current = 'quote';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Precise relative scroll threshold
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
    // Check if we're on a product page
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      // Navigate to home first, then scroll
      router.push(`/?section=${id}`);
    } else {
      // Already on home page, scroll to section
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const goToHome = () => {
    // If on product page, navigate to home; otherwise scroll to top
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      router.push('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = (event) => {
    const nextQuery = event.target.value;
    setSearchQuery(nextQuery);

    // Ensure search is visible immediately by taking users to product results.
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

  return (
    <nav className="w-full bg-surface-bg/95 backdrop-blur-md sticky top-0 z-50 border-b border-surface-border/60">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={goToHome}
              >
                <span className="text-2xl">🖨️</span>
                <span className="font-bold text-xl tracking-tight text-fg">
                  Pachi <span className="text-fg">3D</span>
                </span>
              </div>
              
              {/* Links */}
              <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-fg-muted">
                <button onClick={() => scrollTo('features')} className={`transition-colors ${activeSection === 'features' ? 'text-primary-500' : 'hover:text-fg'}`}>Features</button>
                <button onClick={() => scrollTo('how-it-works')} className={`transition-colors ${activeSection === 'how-it-works' ? 'text-primary-500' : 'hover:text-fg'}`}>How It Works</button>
                <button onClick={() => scrollTo('faq')} className={`transition-colors ${activeSection === 'faq' ? 'text-primary-500' : 'hover:text-fg'}`}>FAQ</button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="hidden md:flex items-center gap-2 bg-surface-card border border-surface-border rounded-full px-3 py-2 w-72">
                <Search className="w-4 h-4 text-fg-muted" />
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
              <div 
                className="relative cursor-pointer hover:text-fg transition-colors"
                onClick={openCart}
              >
                <ShoppingCart className="w-5 h-5 text-fg-muted" />
                <span className="absolute -top-1.5 -right-1.5 bg-cta text-cta-contrast text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>
              </div>
              <button 
                onClick={() => scrollTo('quote')}
                className="bg-cta hover:opacity-90 text-cta-contrast font-bold px-5 py-2 rounded-full flex items-center gap-2 text-sm transition-all transform active:scale-95 shadow-lg shadow-black/10 dark:shadow-black/40"
              >
                <Rocket className="w-4 h-4" /> Get Quote
              </button>
            </div>
          </div>
        </div>
      </nav>
  );
}
