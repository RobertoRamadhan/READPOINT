'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    grade_level: '',
    role: 'siswa',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.password_confirmation) {
      setError('Password tidak sesuai');
      return;
    }

    if (!formData.grade_level) {
      setError('Kelas harus dipilih');
      return;
    }

    setLoading(true);

    try {
      const response = await api.register(formData as any);
      
      if (response.user && response.token) {
        login(response.user, response.token);
        router.push('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Pendaftaran gagal';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'url(/teknologi.jpg)',
        backgroundSize: '100%',
      }}
    >
      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm pointer-events-none z-0"></div>
      
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl font-bold text-white mb-3">Daftar</h1>
          <p className="text-lg text-cyan-300">Mulai petualangan literasi digital Anda</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-950 border-l-4 border-red-500 text-red-200 rounded-lg animate-slide-up">
            <p className="font-semibold text-sm">Terjadi Kesalahan</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Register Card */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-10 animate-slide-up animation-delay-200 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300">
          {/* Decorative Top Border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-500 rounded-t-2xl"></div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div className="animate-slide-up animation-delay-300">
              <label className="block text-sm font-semibold text-cyan-300 mb-3">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-cyan-500/30 rounded-lg bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                placeholder="Nama Anda"
                disabled={loading}
                required
              />
            </div>

            {/* Email Input */}
            <div className="animate-slide-up animation-delay-400">
              <label className="block text-sm font-semibold text-cyan-300 mb-3">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-cyan-500/30 rounded-lg bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                placeholder="nama@email.com"
                disabled={loading}
                required
              />
            </div>

            {/* Grade Level Selection */}
            <div className="animate-slide-up animation-delay-500">
              <label className="block text-sm font-semibold text-cyan-300 mb-3">
                Kelas
              </label>
              <select
                name="grade_level"
                value={formData.grade_level}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-slate-800/50"
                disabled={loading}
                required
              >
                <option value="" className="bg-slate-900 text-white">Pilih Kelas Anda</option>
                <option value="1" className="bg-slate-900 text-white">Kelas X</option>
                <option value="2" className="bg-slate-900 text-white">Kelas XI</option>
                <option value="3" className="bg-slate-900 text-white">Kelas XII</option>
              </select>
            </div>

            {/* Password Input */}
            <div className="animate-slide-up animation-delay-600">
              <label className="block text-sm font-semibold text-cyan-300 mb-3">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-cyan-500/30 rounded-lg bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>

            {/* Confirm Password Input */}
            <div className="animate-slide-up animation-delay-700">
              <label className="block text-sm font-semibold text-cyan-300 mb-3">
                Konfirmasi Password
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-cyan-500/30 rounded-lg bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover-lift shadow-lg shadow-cyan-500/20 animate-slide-up animation-delay-800"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sedang memproses...
                </span>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cyan-500/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-slate-800/80 to-slate-900/80 text-slate-400">sudah punya akun?</span>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-slate-300 text-sm animate-slide-up animation-delay-900">
            <Link href="/login" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors duration-200">
              Masuk di sini
            </Link>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center text-slate-400 text-xs mt-8 animate-slide-up animation-delay-1000">
          Dengan mendaftar, Anda menyetujui Syarat Layanan kami
        </p>
      </div>
    </div>
  );
}
