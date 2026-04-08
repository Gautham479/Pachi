"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket, ShoppingCart, Moon } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Navbar() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('quote');
  const cart = useStore((state) => state.cart);
  const openCart = useStore((state) => state.openCart);

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
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
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

  return (
    <nav className="w-full bg-surface-bg sticky top-0 z-50 border-b border-surface-border/50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={goToHome}
              >
                <span className="text-2xl">🖨️</span>
                <span className="font-bold text-xl tracking-tight text-white">
                  Pachi <span className="text-white">3D</span>
                </span>
              </div>
              
              {/* Links */}
              <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#DCD1CC]">
                <button onClick={() => scrollTo('features')} className={`transition-colors ${activeSection === 'features' ? 'text-primary-500' : 'hover:text-white'}`}>Features</button>
                <button onClick={() => scrollTo('how-it-works')} className={`transition-colors ${activeSection === 'how-it-works' ? 'text-primary-500' : 'hover:text-white'}`}>How It Works</button>
                <button onClick={() => scrollTo('faq')} className={`transition-colors ${activeSection === 'faq' ? 'text-primary-500' : 'hover:text-white'}`}>FAQ</button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-5">
              <div 
                className="relative cursor-pointer hover:text-white transition-colors"
                onClick={openCart}
              >
                <ShoppingCart className="w-5 h-5 text-[#DCD1CC]" />
                <span className="absolute -top-1.5 -right-1.5 bg-primary-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>
              </div>
              <button 
                onClick={() => scrollTo('quote')}
                className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-5 py-2 rounded-full flex items-center gap-2 text-sm transition-all transform active:scale-95 shadow-lg shadow-primary-500/20"
              >
                <Rocket className="w-4 h-4" /> Get Quote
              </button>
            </div>
          </div>
        </div>
      </nav>
  );
}
