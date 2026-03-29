'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
      console.log('[Login] Attempting login with email:', email);
      const response = await api.login(email, password);
      console.log('[Login] Response:', response);
      
      if (response.user && response.token) {
        console.log('[Login] Login successful, calling login() with user:', response.user);
        login(response.user, response.token);
        console.log('[Login] Redirecting to dashboard...');
        router.push('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed';
      console.error('[Login] Error:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 pt-20">
          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="text-5xl">📚</div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black bg-linear-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">READPOINT</h1>
                <p className="text-sm text-slate-600 font-semibold">Platform Literasi Digital Siswa</p>
              </div>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed">
              Masuk ke dunia literasi digital dan mulai petualangan membaca Anda bersama ribuan siswa lainnya.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-slate-100">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl text-sm font-medium flex items-start gap-3">
                <span className="text-xl mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition duration-200 text-sm"
                    placeholder="nama@email.com"
                    disabled={loading}
                    required
                  />
                  <span className="absolute right-4 top-3 text-lg">✉️</span>
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition duration-200 text-sm"
                    placeholder="••••••••"
                    disabled={loading}
                    required
                  />
                  <span className="absolute right-4 top-3 text-lg">🔐</span>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-2 border-slate-300 accent-sky-500" />
                  <span className="text-slate-700 font-medium">Ingat saya</span>
                </label>
                <a href="#" className="text-sky-600 hover:text-sky-700 font-semibold transition">Lupa password?</a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-base rounded-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 mt-8"
              >
                {loading ? 'Sedang Masuk...' : 'Masuk ke Dashboard'}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-slate-500 text-xs font-semibold">ATAU</span>
                </div>
              </div>

              {/* Register Link */}
              <p className="text-center text-slate-700 text-sm font-medium mb-3">
                Belum punya akun?
              </p>
              <a
                href="/register"
                className="block w-full py-3.5 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-base rounded-xl transition duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 text-center"
              >
                Daftar Akun Baru
              </a>
            </form>

            {/* Footer Info */}
            <p className="text-center text-slate-600 text-xs mt-8">
              Platform aman dengan enkripsi SSL dan perlindungan data terjamin
            </p>
          </div>
        </div>
  );
}
