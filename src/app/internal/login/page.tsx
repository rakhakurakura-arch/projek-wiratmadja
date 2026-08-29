'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, KeyRound, AlertCircle } from 'lucide-react';

export default function InternalLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/internal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login gagal. Periksa kembali email & kata sandi.');
      } else {
        router.push('/internal/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-950 flex flex-col justify-center items-center p-4 selection:bg-sage-400 selection:text-forest-950">
      
      {/* Container Box */}
      <div className="max-w-md w-full bg-ivory-200 rounded-3xl p-8 shadow-2xl border border-forest-800/80 space-y-6 relative overflow-hidden">
        
        {/* Subtle Decorative Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-forest-800 via-sage-500 to-forest-700" />

        {/* Brand Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-forest-800 text-sage-100 flex items-center justify-center font-serif text-3xl font-bold mx-auto border border-forest-700 shadow-md">
            W
          </div>
          <h1 className="font-serif text-2xl font-bold text-charcoal-900 tracking-tight">
            WIRATMADJA
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Portal Pengelola Internal</span>
          </div>
        </div>

        {/* Notice Info */}
        <div className="p-3.5 bg-sage-100/70 border border-sage-200 rounded-xl text-xs text-charcoal-800 space-y-1">
          <p className="font-bold flex items-center gap-1 text-forest-900">
            <ShieldCheck className="w-4 h-4 text-forest-700" /> Akses Terbatas & Terproteksi
          </p>
          <p className="text-[11px] text-sage-700">
            Halaman ini khusus Pemilik & Kontributor internal keluarga yang diundang secara manual. Tidak ada pendaftaran umum.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
              Email Pengelola Internal
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@wiratmadja.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-sage-200 rounded-xl py-3 pl-10 pr-3.5 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
              <Mail className="w-4 h-4 text-sage-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sage-700 mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-sage-200 rounded-xl py-3 pl-10 pr-3.5 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
              <KeyRound className="w-4 h-4 text-sage-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest-800 hover:bg-forest-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Memverifikasi Akses...' : 'Masuk Panel Internal'}</span>
          </button>
        </form>

        {/* Demo Credential Note */}
        <div className="pt-2 text-center text-[11px] text-sage-600 space-y-1">
          <p className="font-semibold text-charcoal-800">Akun Pengujian Demo (Otomatis Terbaca):</p>
          <p>Admin Pemilik: <code className="bg-sage-100 px-1 py-0.5 rounded font-mono text-forest-900">admin@wiratmadja.id</code> / <code className="bg-sage-100 px-1 py-0.5 rounded font-mono text-forest-900">admin123</code></p>
          <p>Kontributor Keluarga: <code className="bg-sage-100 px-1 py-0.5 rounded font-mono text-forest-900">keluarga@wiratmadja.id</code> / <code className="bg-sage-100 px-1 py-0.5 rounded font-mono text-forest-900">keluarga123</code></p>
        </div>

      </div>

      <p className="mt-8 text-xs text-sage-400">
        © {new Date().getFullYear()} Wiratmadja Catalog Internal Governance
      </p>
    </div>
  );
}
