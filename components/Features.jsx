"use client";

import React, { useState } from 'react';
import { Check, X, Zap, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Features() {
  const [activeCard, setActiveCard] = useState(null);

  const materials = [
    {
      name: "PLA (Basic & Lightweight)",
      emoji: "🔹",
      color: "from-blue-500/20 to-indigo-500/20",
      borderColor: "border-blue-500/30",
      glowColor: "rgba(99,102,241,0.3)",
      accentColor: "text-blue-400",
      points: [
        { text: "Best for display parts, prototypes, or light use", type: "normal" },
        { text: "Smooth finish and clean look", type: "normal" },
        { text: "Not ideal for heat or outdoor use", type: "negative" },
        { text: "Good if you just need something simple and cost-effective", type: "tip" }
      ]
    },
    {
      name: "PETG (All-Rounder Choice)",
      emoji: "🔹",
      color: "from-cyan-500/20 to-teal-500/20",
      borderColor: "border-cyan-500/30",
      glowColor: "rgba(6,182,212,0.3)",
      accentColor: "text-cyan-400",
      points: [
        { text: "Strong and durable for everyday use", type: "normal" },
        { text: "Can handle sunlight and outdoor conditions better than PLA", type: "positive" },
        { text: "Water-resistant and long-lasting", type: "positive" },
        { text: "Safe for basic electrical enclosures (non-conductive)", type: "positive" },
        { text: "Best choice for most customers", type: "tip" }
      ]
    },
    {
      name: "ABS (High Strength & Heat Resistant)",
      emoji: "🔹",
      color: "from-orange-500/20 to-red-500/20",
      borderColor: "border-orange-500/30",
      glowColor: "rgba(249,115,22,0.3)",
      accentColor: "text-orange-400",
      points: [
        { text: "Very strong and tough material", type: "normal" },
        { text: "Handles high temperatures and sunlight better", type: "positive" },
        { text: "Good for automotive or outdoor parts", type: "positive" },
        { text: "Suitable for electrical housings (heat resistance helps)", type: "positive" },
        { text: "Choose this if your part will face heat or rough use", type: "tip" }
      ]
    },
    {
      name: "TPU (Flexible & Shock Absorbing)",
      emoji: "🔹",
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      glowColor: "rgba(168,85,247,0.3)",
      accentColor: "text-purple-400",
      points: [
        { text: "Rubber-like and flexible", type: "normal" },
        { text: "Can bend, stretch, and absorb impact", type: "positive" },
        { text: "Not for rigid or structural parts", type: "negative" },
        { text: "Perfect for grips, covers, gaskets, or protective parts", type: "tip" }
      ]
    }
  ];

  const quickGuide = [
    { question: "Outdoor / Sun use?", answer: "PETG or ABS", icon: "☀️" },
    { question: "High heat?", answer: "ABS", icon: "🔥" },
    { question: "Electrical use?", answer: "PETG or ABS", icon: "⚡" },
    { question: "Flexible part?", answer: "TPU", icon: "🌀" },
    { question: "Budget / basic use?", answer: "PLA", icon: "💡" }
  ];

  const getIcon = (type) => {
    switch (type) {
      case "positive":
        return <Check className="w-4 h-4 text-green-400 flex-shrink-0" />;
      case "negative":
        return <X className="w-4 h-4 text-red-400/70 flex-shrink-0" />;
      case "tip":
        return <Zap className="w-4 h-4 text-accent-500 flex-shrink-0" />;
      default:
        return <ChevronRight className="w-4 h-4 text-fg-subtle flex-shrink-0" />;
    }
  };

  return (
    <section id="features" className="w-full py-24 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-sm text-primary-500 font-bold mb-6">
            <Zap className="w-3.5 h-3.5" />
            Material Science
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-fg mb-4">
            Materials – Choose What Fits Your Use
          </h2>
          <p className="text-lg text-fg-muted max-w-2xl mx-auto">
            Select the right material for your project based on your specific needs
          </p>
        </motion.div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {materials.map((material, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onHoverStart={() => setActiveCard(i)}
              onHoverEnd={() => setActiveCard(null)}
              className={`relative rounded-2xl border ${material.borderColor} bg-surface-card/60 backdrop-blur-sm p-7 cursor-default overflow-hidden transition-all duration-300 holo-border`}
              style={{
                boxShadow: activeCard === i ? `0 0 30px ${material.glowColor}` : 'none',
              }}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${material.color} opacity-0 transition-opacity duration-300 ${activeCard === i ? 'opacity-100' : ''}`} />

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none">
                <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-bl ${material.color} opacity-50`} />
              </div>

              <div className="relative">
                <h3 className={`text-xl font-black text-fg mb-5 flex items-center gap-3`}>
                  <span className="text-2xl">{material.emoji}</span>
                  <span>{material.name}</span>
                </h3>
                <ul className="space-y-3">
                  {material.points.map((point, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: i * 0.1 + j * 0.05 }}
                      className="flex gap-3 items-start"
                    >
                      {getIcon(point.type)}
                      <span className={`text-fg-muted leading-relaxed text-sm ${point.type === 'negative' ? 'opacity-60' : ''} ${point.type === 'tip' ? 'font-semibold text-fg' : ''}`}>
                        {point.text}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Guide */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-2xl border border-primary-500/20 bg-surface-card/60 backdrop-blur-sm p-8 overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 pointer-events-none" />

          <h3 className="text-2xl font-black text-fg mb-6 flex items-center gap-2 relative">
            <span>💡</span>
            <span>Quick Guide</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
            {quickGuide.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ delay: 0.3 + i * 0.07 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="bg-surface-muted/60 backdrop-blur-sm p-4 rounded-xl border border-surface-border hover:border-primary-500/40 transition-all cursor-default group"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-sm font-bold text-fg mb-1.5 group-hover:text-primary-500 transition-colors">{item.question}</p>
                <p className="text-accent-500 font-black text-sm">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
