import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import UploadBox from '@/components/UploadBox';
import ConfigPanel from '@/components/ConfigPanel';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-bg items-center relative">
      <Navbar />
      <CartDrawer />
      
      {/* Hero Section */}
      <section id="hero" className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <Hero />
      </section>

      {/* Quote Section (Left: Upload, Right: Price) */}
      <section id="quote" className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] xl:grid-cols-[1fr_500px] gap-8 lg:gap-10 items-start w-full">
          {/* Left Column: Upload */}
          <div className="w-full relative h-[100%]">
            <UploadBox />
          </div>

          {/* Right Column: Configuration & Price */}
          <div className="w-full lg:sticky lg:top-24 pb-10">
            <ConfigPanel />
          </div>
        </div>
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
