"use client";

import React from 'react';
import { UploadCloud, CheckCircle, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  const steps = [
    {
      icon: <UploadCloud className="w-8 h-8" />,
      title: "1. Upload Your Design",
      desc: "Drop your STL or OBJ files into our quoter to get an instant, AI-driven price.",
      color: "from-indigo-500 to-blue-500",
      glow: "rgba(99,102,241,0.4)",
      borderColor: "border-indigo-500/30",
      number: "01",
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "2. Configure & Order",
      desc: "Select your desired material, color, and strength. Add to cart and check out seamlessly.",
      color: "from-cyan-500 to-teal-500",
      glow: "rgba(6,182,212,0.4)",
      borderColor: "border-cyan-500/30",
      number: "02",
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "3. Receive Your Parts",
      desc: "We print, perform quality control, and ship your parts directly to your door.",
      color: "from-purple-500 to-pink-500",
      glow: "rgba(168,85,247,0.4)",
      borderColor: "border-purple-500/30",
      number: "03",
    }
  ];

  return (
    <section id="how-it-works" className="w-full py-24 overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-accent-500/50 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 text-sm text-accent-500 font-bold mb-6">
            <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
            Simple Process
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-fg mb-4">How It Works</h2>
          <p className="text-lg text-fg-muted max-w-2xl mx-auto">
            From digital file to physical object in just three simple steps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-[2px] z-0">
            <div className="w-full h-full bg-gradient-to-r from-indigo-500/30 via-cyan-500/30 to-purple-500/30" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-cyan-500 to-purple-500"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 1.5, delay: 0.5, ease: 'easeInOut' }}
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="flex flex-col items-center text-center relative z-10 group"
            >
              {/* Step number background */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[80px] font-black text-surface-border/30 select-none pointer-events-none leading-none">
                {step.number}
              </div>

              {/* Icon circle */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className={`relative w-24 h-24 rounded-2xl flex items-center justify-center mb-6 shadow-2xl border ${step.borderColor} bg-surface-card/80 backdrop-blur-sm overflow-hidden`}
                style={{
                  boxShadow: `0 0 0 0 ${step.glow}`,
                }}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-15 group-hover:opacity-30 transition-opacity`} />

                {/* Animated ring */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl border-2 ${step.borderColor}`}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.8 }}
                />

                <div className={`relative z-10 bg-gradient-to-br ${step.color} bg-clip-text text-transparent`}>
                  {step.icon}
                </div>
              </motion.div>

              <h3 className="text-xl font-black text-fg mb-3 group-hover:text-primary-500 transition-colors">{step.title}</h3>
              <p className="text-fg-muted leading-relaxed max-w-xs text-sm">{step.desc}</p>

              {/* Arrow for mobile */}
              {i < steps.length - 1 && (
                <motion.div
                  className="md:hidden mt-6 text-surface-border"
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
