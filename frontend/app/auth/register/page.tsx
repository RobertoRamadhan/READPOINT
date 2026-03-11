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
    setLoading(true);

    try {
      console.log('[Register] Attempting registration with email:', formData.email);
      const response = await api.register(formData);
      console.log('[Register] Response:', response);
      
      if (response.user && response.token) {
        console.log('[Register] Registration successful, auto-logging in user:', response.user);
        login(response.user, response.token);
        alert('Pendaftaran berhasil! Selamat datang di READPOINT.');
        router.push('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Pendaftaran gagal';
      console.error('[Register] Error:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 border-2 border-sky-200">
      <h1 className="text-3xl font-bold text-sky-600 text-center mb-8">Daftar READPOINT</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2 font-semibold">Nama Lengkap</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-sky-50 border-2 border-sky-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            placeholder="Nama Anda"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-sky-50 border-2 border-sky-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            placeholder="email@example.com"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-semibold">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-sky-50 border-2 border-sky-200 text-gray-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            disabled={loading}
          >
            <option value="siswa">Siswa</option>
            <option value="guru">Guru</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-semibold">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-sky-50 border-2 border-sky-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-semibold">Konfirmasi Password</label>
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-sky-50 border-2 border-sky-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg transition disabled:opacity-50 shadow-md hover:shadow-lg"
        >
          {loading ? 'Loading...' : 'Daftar'}
        </button>
      </form>

      <p className="text-center text-gray-600 mt-6">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-sky-600 hover:text-sky-700 font-semibold">
          Login di sini
        </Link>
      </p>
    </div>
  );
}
