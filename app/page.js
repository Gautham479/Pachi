"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MainContentTabs from '@/components/MainContentTabs';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';

function ScrollToSection() {
  const searchParams = useSearchParams();
  const section = searchParams.get('section');

  React.useEffect(() => {
    if (section) {
      setTimeout(() => {
        const el = document.getElementById(section);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [section]);

  return null;
}

export default function Home() {
  const scrollPosition = useStore((state) => state.scrollPosition);
  const setScrollPosition = useStore((state) => state.setScrollPosition);
  const products = useStore((state) => state.products);

  // Save scroll position on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      // Use requestAnimationFrame for performance
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollPosition]);

  // Restore scroll position
  React.useEffect(() => {
    if (products.length > 0 && scrollPosition > 0) {
      // Delay slightly to ensure layout has settled
      const timer = setTimeout(() => {
        window.scrollTo({ top: scrollPosition, behavior: 'instant' });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [products.length, scrollPosition]);

  return (
    <div className="flex flex-col min-h-screen bg-surface-bg items-center relative">
      <Navbar />
      <CartDrawer />
      <Suspense fallback={null}>
        <ScrollToSection />
      </Suspense>
      
      {/* Top headline in empty space */}
      <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-fg tracking-tight leading-tight"
        >
          Where Your Ideas <span className="text-primary-500">Become Reality</span>
        </motion.h1>
      </section>

      {/* Hero Section */}
      <section id="hero" className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 sm:pt-4 sm:pb-10">
        <Hero />
      </section>

      {/* Main Mode Toggle & Content */}
      <section id="content" className="w-full">
        <MainContentTabs />
      </section>

      {/* Additional Added Sections */}
      <Features />
      <HowItWorks />
      <FAQ />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
