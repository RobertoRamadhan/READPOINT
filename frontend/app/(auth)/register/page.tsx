'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
      await api.register(formData);
      alert('Pendaftaran berhasil! Silakan login.');
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Pendaftaran gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-blue-900 rounded-lg shadow-xl p-8 border border-blue-700">
      <h1 className="text-3xl font-bold text-white text-center mb-8">Daftar READPOINT</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-200 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-blue-200 mb-2 font-semibold">Nama Lengkap</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-blue-700 text-white placeholder-blue-400 focus:outline-none focus:border-blue-500"
            placeholder="Nama Anda"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-blue-200 mb-2 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-blue-700 text-white placeholder-blue-400 focus:outline-none focus:border-blue-500"
            placeholder="email@example.com"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-blue-200 mb-2 font-semibold">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-blue-700 text-white focus:outline-none focus:border-blue-500"
            disabled={loading}
          >
            <option value="siswa">Siswa</option>
            <option value="guru">Guru</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-blue-200 mb-2 font-semibold">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-blue-700 text-white placeholder-blue-400 focus:outline-none focus:border-blue-500"
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-blue-200 mb-2 font-semibold">Konfirmasi Password</label>
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-blue-700 text-white placeholder-blue-400 focus:outline-none focus:border-blue-500"
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Daftar'}
        </button>
      </form>

      <p className="text-center text-blue-300 mt-6">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
          Login di sini
        </Link>
      </p>
    </div>
  );
}
