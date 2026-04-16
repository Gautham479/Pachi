"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, ShieldCheck, Zap } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetHint, setShowResetHint] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || 'Login failed');
      setLoading(false);
      return;
    }

    router.replace('/admin');
    router.refresh();
  };

  const inputClass = "w-full rounded-xl border border-surface-border bg-surface-muted/60 px-4 py-3 text-fg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all placeholder:text-fg-subtle text-sm backdrop-blur-sm";

  return (
    <main className="min-h-screen bg-surface-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative"
      >
        {/* Card */}
        <div
          className="rounded-3xl border border-primary-500/20 bg-surface-card/80 backdrop-blur-2xl p-8 shadow-2xl relative overflow-hidden"
          style={{ boxShadow: '0 0 60px rgba(99,102,241,0.15), 0 30px 80px rgba(0,0,0,0.15)' }}
        >
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary-500/30 rounded-tl-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-accent-500/30 rounded-tr-3xl pointer-events-none" />

          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 pointer-events-none" />

          <div className="relative">
            {/* Icon */}
            <motion.div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/30 flex items-center justify-center mx-auto mb-6"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ boxShadow: '0 0 20px rgba(99,102,241,0.2)' }}
            >
              <ShieldCheck className="w-8 h-8 text-primary-500" />
            </motion.div>

            <h1 className="text-2xl font-black text-fg mb-1 text-center">Admin Login</h1>
            <p className="text-fg-muted mb-6 text-sm text-center">Manage products without editing code.</p>

            <div className="mb-6 flex items-center justify-between text-sm">
              <Link href="/" className="text-fg-muted hover:text-primary-500 transition-colors font-semibold flex items-center gap-1">
                ← Back to homepage
              </Link>
              <button
                type="button"
                onClick={() => setShowResetHint((prev) => !prev)}
                className="text-fg-muted hover:text-primary-500 transition-colors font-semibold"
              >
                Forgot password?
              </button>
            </div>

            <AnimatePresence>
              {showResetHint && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-fg-muted mb-4 bg-surface-muted/60 border border-surface-border rounded-xl p-3"
                >
                  Reset by updating <code className="text-primary-500 font-bold">ADMIN_PASSWORD</code> in your deployment environment variables, then redeploy.
                </motion.p>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-black text-fg mb-2">Username</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-subtle" />
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`${inputClass} pl-10`}
                    placeholder="admin"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-fg mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-subtle" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pl-10 pr-10`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-subtle hover:text-fg transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full btn-glow bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl py-3 font-black disabled:opacity-60 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Sign in
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
