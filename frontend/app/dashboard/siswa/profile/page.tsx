'use client';

import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageLoading } from '@/components/shared';

export default function SiswaProfilePage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    wali_kelas: '',
    current_password: '',
    new_password: '',
    password_confirmation: '',
    avatar: null as File | null,
  });
  const [guruList, setGuruList] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingGuru, setLoadingGuru] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || loading || !isAuthenticated) return;

    if (!user || user.role !== 'siswa') {
      router.push('/login');
      return;
    }

    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        wali_kelas: (user as any).wali_kelas || '',
        current_password: '',
        new_password: '',
        password_confirmation: '',
        avatar: null,
      });
    }
  }, [mounted, loading, isAuthenticated, user, router]);

  useEffect(() => {
    // Hardcoded list of wali_kelas - should be fetched from database in production
    const waliKelasList = [
      { id: '1', name: 'Pak Budi Santoso' },
      { id: '2', name: 'Ibu Siti Aminah' },
      { id: '3', name: 'Pak Ahmad Fauzi' },
      { id: '4', name: 'Ibu Dewi Kartika' },
      { id: '5', name: 'Pak Hendra Wijaya' },
      { id: '6', name: 'Ibu Rina Melati' },
      { id: '7', name: 'Pak Dedi Kurniawan' },
      { id: '8', name: 'Ibu Maya Sari' },
    ];
    setGuruList(waliKelasList);
  }, []);

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
      
      const uploadFormData = new FormData();
      uploadFormData.append('name', formData.name);
      uploadFormData.append('email', formData.email);
      uploadFormData.append('wali_kelas', formData.wali_kelas);
      if (formData.avatar) {
        uploadFormData.append('avatar', formData.avatar);
      }
      
      await api.users.update(user!.id, uploadFormData);
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

  if (!isAuthenticated || !user || user.role !== 'siswa') {
    return null;
  }

  return (
    <div className="w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.push('/dashboard/siswa')}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-all"
            >
              ← Kembali
            </button>
          </div>

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
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-6">Informasi Profil</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              {/* Avatar Upload */}
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {formData.avatar ? (
                    <img
                      src={URL.createObjectURL(formData.avatar)}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : user?.profile_photo_url ? (
                    <img
                      src={user.profile_photo_url}
                      alt="Current Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
                      👤
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Foto Profil</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.files?.[0] || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG. Maksimal 5MB</p>
                </div>
              </div>

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
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Wali Kelas</label>
                <select
                  value={formData.wali_kelas}
                  onChange={(e) => setFormData({ ...formData, wali_kelas: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loadingGuru}
                >
                  <option value="">Pilih Wali Kelas</option>
                  {guruList.map((guru) => (
                    <option key={guru.id} value={guru.id.toString()}>
                      {guru.name}
                    </option>
                  ))}
                </select>
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
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
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
