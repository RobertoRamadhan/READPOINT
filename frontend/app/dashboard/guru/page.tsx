'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GuruDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('validasi');

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'guru')) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, user?.role, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sky-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (user?.role !== 'guru') {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-linear-to-r from-sky-400 to-sky-500 rounded-lg p-6 mb-8 shadow-md">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Guru</h1>
        <p className="text-sky-100">Monitor dan atur pembelajaran siswa Anda</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-sky-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('validasi')}
          className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
            activeTab === 'validasi'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-gray-600 hover:text-sky-500'
          }`}
        >
          ✓ Validasi Pembacaan
        </button>
        <button
          onClick={() => setActiveTab('monitoring')}
          className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
            activeTab === 'monitoring'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-gray-600 hover:text-sky-500'
          }`}
        >
          📊 Monitoring
        </button>
        <button
          onClick={() => setActiveTab('kuis')}
          className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
            activeTab === 'kuis'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-gray-600 hover:text-sky-500'
          }`}
        >
          🎯 Buat Kuis
        </button>
        <button
          onClick={() => setActiveTab('siswa')}
          className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
            activeTab === 'siswa'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-gray-600 hover:text-sky-500'
          }`}
        >
          👥 Siswa Saya
        </button>
      </div>

      {/* Validasi Pembacaan Tab */}
      {activeTab === 'validasi' && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Aktivitas Pembacaan Menunggu Validasi</h2>
            <p className="text-gray-600">Total: 12 aktivitas menunggu validasi</p>
          </div>

          <div className="space-y-4">
            {/* Validation Item 1 */}
            <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-sky-700 mb-1">Rina Kartika</h3>
                  <p className="text-gray-600 text-sm">Buku: Laskar Pelangi | 45 halaman</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Pending
                </span>
              </div>

              <div className="bg-sky-50 rounded p-3 mb-4 border-l-4 border-sky-400">
                <p className="text-gray-700 text-sm">
                  <strong>Durasi Membaca:</strong> 2 jam 15 menit | <strong>Tanggal:</strong> 10 Maret 2026
                </p>
                <p className="text-gray-700 text-sm mt-2">
                  <strong>Catatan Siswa:</strong> &quot;Saya menyukai cerita tentang karakter Ikal yang unik dan petualangannya di pulau Belitong.&quot;
                </p>
              </div>

              <div className="flex gap-3">
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition">
                  ✓ Validasi
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition">
                  ✕ Tolak
                </button>
              </div>
            </div>

            {/* Validation Item 2 */}
            <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-sky-700 mb-1">Budi Santoso</h3>
                  <p className="text-gray-600 text-sm">Buku: Negeri 5 Menara | 67 halaman</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Pending
                </span>
              </div>

              <div className="bg-sky-50 rounded p-3 mb-4 border-l-4 border-sky-400">
                <p className="text-gray-700 text-sm">
                  <strong>Durasi Membaca:</strong> 3 jam 30 menit | <strong>Tanggal:</strong> 10 Maret 2026
                </p>
                <p className="text-gray-700 text-sm mt-2">
                  <strong>Catatan Siswa:</strong> &quot;Kisah Alif dan teman-temannya sangat menginspirasi saya untuk bersahabat dengan orang-orang baik.&quot;
                </p>
              </div>

              <div className="flex gap-3">
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition">
                  ✓ Validasi
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition">
                  ✕ Tolak
                </button>
              </div>
            </div>

            {/* Validation Item 3 */}
            <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-sky-700 mb-1">Siti Nurhaliza</h3>
                  <p className="text-gray-600 text-sm">Buku: Laskar Pelangi | 32 halaman</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Pending
                </span>
              </div>

              <div className="bg-sky-50 rounded p-3 mb-4 border-l-4 border-sky-400">
                <p className="text-gray-700 text-sm">
                  <strong>Durasi Membaca:</strong> 1 jam 45 menit | <strong>Tanggal:</strong> 10 Maret 2026
                </p>
                <p className="text-gray-700 text-sm mt-2">
                  <strong>Catatan Siswa:</strong> &quot;Pelajaran hidup dari buku ini adalah tentang pentingnya pendidikan dan persahabatan.&quot;
                </p>
              </div>

              <div className="flex gap-3">
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition">
                  ✓ Validasi
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition">
                  ✕ Tolak
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monitoring Tab */}
      {activeTab === 'monitoring' && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Monitoring Kelas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Siswa</p>
                  <p className="text-3xl font-bold text-sky-600">32</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </div>

            <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Siswa Aktif</p>
                  <p className="text-3xl font-bold text-green-600">28</p>
                </div>
                <div className="text-4xl">✓</div>
              </div>
            </div>

            <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Rata-rata Poin</p>
                  <p className="text-3xl font-bold text-sky-600">1,245</p>
                </div>
                <div className="text-4xl">⭐</div>
              </div>
            </div>

            <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Buku Selesai</p>
                  <p className="text-3xl font-bold text-sky-600">87</p>
                </div>
                <div className="text-4xl">📚</div>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-bold text-sky-700 mb-4">Progres Kelas (Minggu Ini)</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Siswa Sudah Membaca</span>
                  <span className="font-bold text-sky-600">28/32</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-sky-500 h-3 rounded-full" style={{ width: '87.5%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Target Halaman Tercapai</span>
                  <span className="font-bold text-sky-600">145/160</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-sky-500 h-3 rounded-full" style={{ width: '90.6%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buat Kuis Tab */}
      {activeTab === 'kuis' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Kuis yang Dibuat</h2>
            <button className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition">
              ➕ Buat Kuis Baru
            </button>
          </div>

          <div className="space-y-4">
            {/* Quiz Item 1 */}
            <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-sky-700">Kuis: Laskar Pelangi Bab 1-5</h3>
                  <p className="text-gray-600 text-sm">10 soal pilihan ganda | Durasi: 30 menit</p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Aktif</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div className="bg-sky-50 p-3 rounded">
                  <p className="text-gray-600 text-sm">Dikerjakan</p>
                  <p className="text-2xl font-bold text-sky-600">28/32</p>
                </div>
                <div className="bg-sky-50 p-3 rounded">
                  <p className="text-gray-600 text-sm">Rata-rata Nilai</p>
                  <p className="text-2xl font-bold text-sky-600">82%</p>
                </div>
                <div className="bg-sky-50 p-3 rounded">
                  <p className="text-gray-600 text-sm">Tanggal Dibuat</p>
                  <p className="text-lg font-bold text-sky-600">5 Mar</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition">
                  Edit
                </button>
                <button className="border-2 border-sky-300 text-sky-600 hover:bg-sky-50 font-bold py-2 px-4 rounded-lg transition">
                  Lihat Hasil
                </button>
              </div>
            </div>

            {/* Quiz Item 2 */}
            <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-sky-700">Kuis: Negeri 5 Menara Bab 1-3</h3>
                  <p className="text-gray-600 text-sm">8 soal pilihan ganda | Durasi: 25 menit</p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Aktif</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div className="bg-sky-50 p-3 rounded">
                  <p className="text-gray-600 text-sm">Dikerjakan</p>
                  <p className="text-2xl font-bold text-sky-600">25/32</p>
                </div>
                <div className="bg-sky-50 p-3 rounded">
                  <p className="text-gray-600 text-sm">Rata-rata Nilai</p>
                  <p className="text-2xl font-bold text-sky-600">75%</p>
                </div>
                <div className="bg-sky-50 p-3 rounded">
                  <p className="text-gray-600 text-sm">Tanggal Dibuat</p>
                  <p className="text-lg font-bold text-sky-600">3 Mar</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition">
                  Edit
                </button>
                <button className="border-2 border-sky-300 text-sky-600 hover:bg-sky-50 font-bold py-2 px-4 rounded-lg transition">
                  Lihat Hasil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Siswa Saya Tab */}
      {activeTab === 'siswa' && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Daftar Siswa Kelas Saya</h2>
          </div>

          <div className="bg-white border-2 border-sky-200 rounded-lg overflow-hidden shadow-md">
            <table className="w-full">
              <thead className="bg-sky-50 border-b border-sky-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Nama</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">No. Induk</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Poin Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Buku Selesai</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-sky-100 hover:bg-sky-50 cursor-pointer">
                  <td className="px-6 py-4 text-gray-700 font-semibold">Rina Kartika</td>
                  <td className="px-6 py-4 text-gray-600">2024001</td>
                  <td className="px-6 py-4 text-sky-600 font-bold">2,450</td>
                  <td className="px-6 py-4 text-gray-700">15</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Aktif</span>
                  </td>
                </tr>
                <tr className="border-b border-sky-100 hover:bg-sky-50 cursor-pointer">
                  <td className="px-6 py-4 text-gray-700 font-semibold">Budi Santoso</td>
                  <td className="px-6 py-4 text-gray-600">2024002</td>
                  <td className="px-6 py-4 text-sky-600 font-bold">2,180</td>
                  <td className="px-6 py-4 text-gray-700">14</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Aktif</span>
                  </td>
                </tr>
                <tr className="border-b border-sky-100 hover:bg-sky-50 cursor-pointer">
                  <td className="px-6 py-4 text-gray-700 font-semibold">Siti Nurhaliza</td>
                  <td className="px-6 py-4 text-gray-600">2024003</td>
                  <td className="px-6 py-4 text-sky-600 font-bold">2,045</td>
                  <td className="px-6 py-4 text-gray-700">13</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Aktif</span>
                  </td>
                </tr>
                <tr className="border-b border-sky-100 hover:bg-sky-50 cursor-pointer">
                  <td className="px-6 py-4 text-gray-700 font-semibold">Ahmad Ibrahim</td>
                  <td className="px-6 py-4 text-gray-600">2024004</td>
                  <td className="px-6 py-4 text-sky-600 font-bold">1,890</td>
                  <td className="px-6 py-4 text-gray-700">12</td>
                  <td className="px-6 py-4">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Pasif</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
