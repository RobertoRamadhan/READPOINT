'use client';

import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageLoading } from '@/components/shared';

export default function AdminProfilePage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    current_password: '',
    new_password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || loading || !isAuthenticated) return;

    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }

    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        current_password: '',
        new_password: '',
        password_confirmation: '',
      });
    }
  }, [mounted, loading, isAuthenticated, user, router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.email) {
      setError('Nama dan email harus diisi');
      return;
    }

    try {
      setSubmitting(true);
      await api.users.update(user!.id, {
        name: formData.name,
        email: formData.email,
      });
      setSuccess('Profil berhasil diperbarui');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal memperbarui profil';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.current_password || !formData.new_password) {
      setError('Password saat ini dan password baru harus diisi');
      return;
    }

    if (formData.new_password !== formData.password_confirmation) {
      setError('Password baru tidak cocok dengan konfirmasi');
      return;
    }

    try {
      setSubmitting(true);
      await api.users.update(user!.id, {
        current_password: formData.current_password,
        password: formData.new_password,
        password_confirmation: formData.password_confirmation,
      });
      setSuccess('Password berhasil diperbarui');
      setFormData({
        ...formData,
        current_password: '',
        new_password: '',
        password_confirmation: '',
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal memperbarui password';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted || loading) {
    return <PageLoading />;
  }

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="text-3xl font-black text-gray-900 mb-8">Pengaturan Profil</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Profile Information */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-black text-gray-900 mb-6">Informasi Profil</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Profil'}
                </button>
              </div>
            </form>
          </div>

          {/* Password Change */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h2 className="text-xl font-black text-gray-900 mb-6">Ubah Password</h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Password Saat Ini</label>
                <input
                  type="password"
                  value={formData.current_password}
                  onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Password Baru</label>
                <input
                  type="password"
                  value={formData.new_password}
                  onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Ubah Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
