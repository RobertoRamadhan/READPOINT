'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login({ email, password });
      
      if (response.user && response.token) {
        login(response.user, response.token);
        router.push('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-white via-blue-50 to-white">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="flex justify-center mb-4">
            <div className="text-6xl md:text-7xl animate-bounce-slow">📚</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">READPOINT</h1>
          <p className="text-lg text-slate-600">Masuk ke dunia literasi digital</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-slide-up">
            <p className="font-semibold text-sm">⚠️ Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Login Card */}
        <div className="card animate-slide-up animation-delay-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="form-label">📧 Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="nama@email.com"
                disabled={loading}
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="form-label">🔐 Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                <span className="text-slate-600">Ingat saya</span>
              </label>
              <Link href="#" className="text-primary-600 hover:text-primary-700 font-semibold">
                Lupa password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6 text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner"></span> Loading...
                </span>
              ) : (
                <span>🚀 Login</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">atau</span>
            </div>
          </div>

          {/* Social Login (Optional) */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="btn-secondary" disabled={loading}>
              Google
            </button>
            <button className="btn-secondary" disabled={loading}>
              GitHub
            </button>
          </div>

          {/* Register Link */}
          <p className="text-center text-slate-600">
            Belum punya akun?{' '}
            <Link href="/register" className="text-primary-600 hover:text-primary-700 font-bold">
              Daftar di sini
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Dengan login, Anda menyetujui Syarat Layanan kami
        </p>
      </div>
    </div>
  );
}
