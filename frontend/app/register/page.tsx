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

    setLoading(true);

    try {
      const response = await api.register(formData);
      
      if (response.user && response.token) {
        login(response.user, response.token);
        alert('Pendaftaran berhasil! Selamat datang di READPOINT.');
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
            <div className="text-6xl md:text-7xl animate-bounce-slow">✨</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Bergabunglah</h1>
          <p className="text-lg text-slate-600">Mulai petualangan literasi digital Anda</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-slide-up">
            <p className="font-semibold text-sm">⚠️ Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Register Card */}
        <div className="card animate-slide-up animation-delay-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="form-label">👤 Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Nama Anda"
                disabled={loading}
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="form-label">📧 Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="nama@email.com"
                disabled={loading}
                required
              />
            </div>

            {/* Role Select */}
            <div>
              <label className="form-label">🎯 Peran / Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-input"
                disabled={loading}
                required
              >
                <option value="siswa">👨‍🎓 Siswa (Pelajar)</option>
                <option value="guru">👨‍🏫 Guru (Pengajar)</option>
                <option value="admin">⚙️ Admin (Pengelola)</option>
              </select>
            </div>

            {/* Password Input */}
            <div>
              <label className="form-label">🔐 Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="form-label">✓ Konfirmasi Password</label>
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className="form-input"
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>

            {/* Terms & Conditions */}
            <label className="flex items-start gap-2 cursor-pointer mt-2">
              <input type="checkbox" className="w-4 h-4 mt-1 rounded border-slate-300" required />
              <span className="text-sm text-slate-600">
                Saya setuju dengan <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold">Syarat Layanan</a> dan <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold">Kebijakan Privasi</a>
              </span>
            </label>

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
                <span>🎉 Daftar Sekarang</span>
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

          {/* Login Link */}
          <p className="text-center text-slate-600">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-bold">
              Login di sini
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Bergabung berarti Anda menerima Syarat Layanan kami
        </p>
      </div>
    </div>
  );
}
