"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  return (
    <main className="min-h-screen bg-surface-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface-card border border-surface-border rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-fg mb-2">Admin Login</h1>
        <p className="text-fg-muted mb-6 text-sm">Manage products without editing code.</p>
        <div className="mb-6 flex items-center justify-between text-sm">
          <Link href="/" className="text-fg-muted hover:text-fg underline underline-offset-4">
            Back to homepage
          </Link>
          <button
            type="button"
            onClick={() => setShowResetHint((prev) => !prev)}
            className="text-fg-muted hover:text-fg underline underline-offset-4"
          >
            Forgot password?
          </button>
        </div>

        {showResetHint ? (
          <p className="text-xs text-fg-muted mb-4">
            Reset by updating `ADMIN_PASSWORD` in your deployment environment variables, then redeploy.
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-fg mb-1">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-surface-muted px-3 py-2.5 text-fg focus:outline-none focus:border-primary-500"
              placeholder="admin"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-fg mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-surface-muted px-3 py-2.5 text-fg focus:outline-none focus:border-primary-500"
              placeholder="••••••••"
              required
            />
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <button
            disabled={loading}
            className="w-full bg-cta text-cta-contrast rounded-lg py-2.5 font-bold disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}
