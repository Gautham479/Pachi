"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="w-full relative overflow-hidden">
      {/* Top border gradient */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      {/* Background */}
      <div className="absolute inset-0 bg-surface-card/60 backdrop-blur-xl pointer-events-none" />
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              className="flex items-center gap-2.5 mb-5"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 opacity-20" />
                <div className="absolute inset-0 rounded-xl border border-primary-500/30" />
                <span className="text-xl relative z-10">🖨️</span>
              </div>
              <span className="font-black text-xl tracking-tight text-fg">
                Pachi <span className="gradient-text">3D</span>
              </span>
            </motion.div>

            <p className="text-fg-muted max-w-sm leading-relaxed mb-6 text-sm">
              Industrial grade 3D printing for everyone. Upload, customize, and order high-quality parts in seconds.
            </p>

            {/* Status indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-xs font-bold text-green-400">
              <motion.span
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              All Systems Operational
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-fg font-black mb-5 text-sm uppercase tracking-widest">Company</h4>
            <ul className="space-y-3">
              {['About Us', 'Contact', 'Careers'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-fg-subtle hover:text-primary-500 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-surface-border group-hover:bg-primary-500 transition-colors" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-fg font-black mb-5 text-sm uppercase tracking-widest">Legal</h4>
            <ul className="space-y-3">
              {['Terms & Conditions', 'Privacy Policy', 'Refund Policy', 'Shipping Policy'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-fg-subtle hover:text-primary-500 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-surface-border group-hover:bg-primary-500 transition-colors" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-surface-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-fg-subtle text-sm">
            © {new Date().getFullYear()} Pachi 3D. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-fg-subtle text-sm">Made with precision in India</span>
            <span className="text-lg">🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
