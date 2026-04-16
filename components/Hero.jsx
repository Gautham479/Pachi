"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { RefreshCcw, ShieldCheck, Zap, Layers } from 'lucide-react';

function FloatingOrb({ size, color, x, y, delay, duration }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(40px)',
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

function Particle({ x, y, delay }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-primary-500/60"
      style={{ left: x, top: y }}
      animate={{
        y: [0, -60, 0],
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  );
}

function Printer3DCard() {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className="relative w-full max-w-md mx-auto cursor-pointer"
    >
      {/* Glow behind card */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-500/30 via-accent-500/20 to-purple-500/30 blur-2xl scale-110 pointer-events-none" />

      {/* Main card */}
      <div className="relative rounded-3xl overflow-hidden border border-primary-500/20 bg-surface-card/80 backdrop-blur-xl shadow-2xl"
        style={{ transform: 'translateZ(0px)' }}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary-500/60 rounded-tl-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-accent-500/60 rounded-tr-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-accent-500/60 rounded-bl-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary-500/60 rounded-br-3xl pointer-events-none" />

        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-500/60 to-transparent pointer-events-none z-10"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />

        {/* Status badge */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-bg/80 backdrop-blur-sm border border-primary-500/30 text-xs font-bold text-primary-500">
          <motion.span
            className="w-2 h-2 rounded-full bg-green-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          ONLINE
        </div>

        {/* Image */}
        <div className="aspect-[4/5] flex items-center justify-center p-8 bg-gradient-to-b from-surface-muted/30 to-surface-card/50">
          <motion.img
            src="/printer.png"
            alt="Bambu P2S 3D Printer"
            className="w-full h-full object-contain drop-shadow-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/400x500/1e1b4b/818cf8?text=Bambu+P2S";
            }}
          />
        </div>

        {/* Bottom stats bar */}
        <div className="px-6 py-4 border-t border-surface-border/50 bg-surface-muted/30 backdrop-blur-sm grid grid-cols-3 gap-4">
          {[
            { label: 'Layer', value: '0.2mm' },
            { label: 'Speed', value: '500mm/s' },
            { label: 'Temp', value: '220°C' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-[10px] text-fg-subtle uppercase tracking-widest font-bold">{stat.label}</p>
              <p className="text-sm font-black text-primary-500 mt-0.5">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating orbit dots */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full border-2 border-accent-500/60 bg-accent-500/20"
          style={{
            top: '50%',
            left: '50%',
            marginTop: -6,
            marginLeft: -6,
          }}
          animate={{
            rotate: [i * 120, i * 120 + 360],
            x: [Math.cos((i * 120 * Math.PI) / 180) * 180, Math.cos(((i * 120 + 360) * Math.PI) / 180) * 180],
            y: [Math.sin((i * 120 * Math.PI) / 180) * 80, Math.sin(((i * 120 + 360) * Math.PI) / 180) * 80],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </motion.div>
  );
}

export default function Hero() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    x: `${(i * 8.3) % 100}%`,
    y: `${20 + (i * 13) % 60}%`,
    delay: i * 0.4,
  }));

  return (
    <div className="relative py-8 sm:py-12 w-full overflow-hidden">
      {/* Background orbs */}
      <FloatingOrb size={400} color="rgba(99,102,241,0.15)" x="-10%" y="10%" delay={0} duration={8} />
      <FloatingOrb size={300} color="rgba(6,182,212,0.12)" x="70%" y="20%" delay={2} duration={10} />
      <FloatingOrb size={250} color="rgba(168,85,247,0.10)" x="40%" y="60%" delay={4} duration={7} />

      {/* Particles */}
      {particles.map((p, i) => (
        <Particle key={i} x={p.x} y={p.y} delay={p.delay} />
      ))}

      {/* Cyber grid overlay */}
      <div className="absolute inset-0 cyber-grid opacity-40 pointer-events-none" />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-sm text-primary-500 font-bold mb-8"
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-accent-500"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Fast & Easy Online 3D Printing Service
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl font-black text-fg tracking-tight leading-[1.05] mb-6">
            Bambu P2S{' '}
            <span className="gradient-text block">3D Printing Service</span>
          </h1>

          <p className="text-lg sm:text-xl text-fg-muted mb-10 max-w-xl leading-relaxed">
            Get an instant price in 30 seconds. Upload your STL file, pick material, and order online. No signup needed.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold">
            {[
              { icon: <RefreshCcw className="w-4 h-4" />, text: 'Free Reprint If We Make a Mistake' },
              { icon: <ShieldCheck className="w-4 h-4" />, text: 'QC Checked Before Shipping' },
            ].map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ scale: 1.03, borderColor: 'var(--app-primary-500)' }}
                className="flex items-center gap-2 text-fg-muted border border-surface-border px-5 py-2.5 rounded-full bg-surface-card/60 backdrop-blur-sm hover:text-primary-500 transition-all cursor-default"
              >
                <span className="text-primary-500">{badge.icon}</span>
                {badge.text}
              </motion.div>
            ))}
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-8 mt-10 pt-8 border-t border-surface-border/50"
          >
            {[
              { value: '1000+', label: 'Models Printed' },
              { value: '4', label: 'Materials' },
              { value: '30s', label: 'Instant Quote' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-black gradient-text">{stat.value}</p>
                <p className="text-xs text-fg-subtle font-semibold mt-0.5 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: 3D Printer Card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="flex justify-center lg:justify-end"
        >
          <Printer3DCard />
        </motion.div>
      </div>
    </div>
  );
}
