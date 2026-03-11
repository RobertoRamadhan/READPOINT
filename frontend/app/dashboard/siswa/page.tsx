'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SiswaDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'siswa')) {
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

  if (user?.role !== 'siswa') {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-linear-to-r from-sky-400 to-sky-500 rounded-lg p-6 mb-8 shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Selamat Datang, {user?.name}! 👋</h1>
            <p className="text-sky-100">Kelas: {user?.class_name || 'Belum diatur'}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white">⭐ 2,450</p>
            <p className="text-sky-100 text-sm">Total Poin Kamu</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Buku Selesai</p>
              <p className="text-3xl font-bold text-sky-600">15</p>
            </div>
            <div className="text-4xl">📚</div>
          </div>
        </div>

        <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Halaman Dibaca</p>
              <p className="text-3xl font-bold text-sky-600">2,847</p>
            </div>
            <div className="text-4xl">📖</div>
          </div>
        </div>

        <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Kuis Diikuti</p>
              <p className="text-3xl font-bold text-sky-600">28</p>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-sky-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
            activeTab === 'overview'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-gray-600 hover:text-sky-500'
          }`}
        >
          📊 Progres Saya
        </button>
        <button
          onClick={() => setActiveTab('buku')}
          className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
            activeTab === 'buku'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-gray-600 hover:text-sky-500'
          }`}
        >
          📚 Buku Tersedia
        </button>
        <button
          onClick={() => setActiveTab('kuis')}
          className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
            activeTab === 'kuis'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-gray-600 hover:text-sky-500'
          }`}
        >
          🎯 Kuis
        </button>
        <button
          onClick={() => setActiveTab('reward')}
          className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
            activeTab === 'reward'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-gray-600 hover:text-sky-500'
          }`}
        >
          🎁 Reward
        </button>
      </div>

      {/* Progres Saya Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Weekly Progress */}
          <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-bold text-sky-700 mb-6">Progres Minggu Ini</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Target Halaman</span>
                  <span className="font-bold text-sky-600">185/250 halaman</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-sky-500 h-4 rounded-full transition-all" style={{ width: '74%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Target Poin</span>
                  <span className="font-bold text-sky-600">850/1000 poin</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-sky-500 h-4 rounded-full transition-all" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Hari Aktif</span>
                  <span className="font-bold text-sky-600">6/7 hari</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-sky-500 h-4 rounded-full transition-all" style={{ width: '85.7%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-bold text-sky-700 mb-4">Aktivitas Terbaru</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4 pb-3 border-b border-sky-100">
                <div className="text-2xl">✓</div>
                <div className="flex-1">
                  <p className="text-gray-700 font-semibold">Selesai membaca buku &quot;Laskar Pelangi&quot;</p>
                  <p className="text-gray-600 text-sm">45 halaman · 2 jam 15 menit</p>
                </div>
                <div className="text-right">
                  <p className="text-sky-600 font-bold">+225 poin</p>
                  <p className="text-gray-600 text-xs">10 Maret</p>
                </div>
              </div>

              <div className="flex items-center gap-4 pb-3 border-b border-sky-100">
                <div className="text-2xl">🎯</div>
                <div className="flex-1">
                  <p className="text-gray-700 font-semibold">Menyelesaikan kuis &quot;Laskar Pelangi Bab 1-5&quot;</p>
                  <p className="text-gray-600 text-sm">Skor: 9/10 (90%)</p>
                </div>
                <div className="text-right">
                  <p className="text-sky-600 font-bold">+90 poin</p>
                  <p className="text-gray-600 text-xs">9 Maret</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-2xl">🎁</div>
                <div className="flex-1">
                  <p className="text-gray-700 font-semibold">Menukar reward &quot;E-Voucher&quot;</p>
                  <p className="text-gray-600 text-sm">Kode: RVCH-2024-5847</p>
                </div>
                <div className="text-right">
                  <p className="text-red-600 font-bold">-300 poin</p>
                  <p className="text-gray-600 text-xs">8 Maret</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buku Tersedia Tab */}
      {activeTab === 'buku' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Book Card 1 */}
            <div className="bg-white border-2 border-sky-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <div className="bg-sky-100 h-40 flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-sky-700 mb-2">Laskar Pelangi</h3>
                <p className="text-gray-600 text-sm mb-3">Andrea Hirata</p>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-gray-600">534 halaman</span>
                  <span className="text-sky-600 font-bold">5/5 ⭐</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Kisah inspiratif tentang persahabatan dan pendidikan di pulau Belitong.
                </p>
                <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded-lg transition">
                  Mulai Membaca
                </button>
              </div>
            </div>

            {/* Book Card 2 */}
            <div className="bg-white border-2 border-sky-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <div className="bg-sky-100 h-40 flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-sky-700 mb-2">Negeri 5 Menara</h3>
                <p className="text-gray-600 text-sm mb-3">A. Fuadi</p>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-gray-600">487 halaman</span>
                  <span className="text-sky-600 font-bold">5/5 ⭐</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Petualangan 5 santri di Maroko dan Al-Azhar mencari ilmu sejati.
                </p>
                <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded-lg transition">
                  Mulai Membaca
                </button>
              </div>
            </div>

            {/* Book Card 3 */}
            <div className="bg-white border-2 border-sky-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <div className="bg-sky-100 h-40 flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-sky-700 mb-2">Sang Pemimpi</h3>
                <p className="text-gray-600 text-sm mb-3">Andrea Hirata</p>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-gray-600">456 halaman</span>
                  <span className="text-sky-600 font-bold">5/5 ⭐</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Lanjutan dari Laskar Pelangi tentang perjalanan hidup Ikal di perantauan.
                </p>
                <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded-lg transition">
                  Mulai Membaca
                </button>
              </div>
            </div>

            {/* Book Card 4 */}
            <div className="bg-white border-2 border-sky-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <div className="bg-sky-100 h-40 flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-sky-700 mb-2">Ayat-Ayat Cinta</h3>
                <p className="text-gray-600 text-sm mb-3">Habiburrahman El Shirazy</p>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-gray-600">302 halaman</span>
                  <span className="text-sky-600 font-bold">4.5/5 ⭐</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Kisah cinta dan iman di Al-Azhar dengan nilai-nilai spiritual yang mendalam.
                </p>
                <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded-lg transition">
                  Mulai Membaca
                </button>
              </div>
            </div>

            {/* Book Card 5 */}
            <div className="bg-white border-2 border-sky-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <div className="bg-sky-100 h-40 flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-sky-700 mb-2">Hafalan Sholat Delisa</h3>
                <p className="text-gray-600 text-sm mb-3">Tere Liye</p>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-gray-600">398 halaman</span>
                  <span className="text-sky-600 font-bold">5/5 ⭐</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Cerita inspiratif tentang seorang gadis yang menjalani hidup dengan penuh harapan.
                </p>
                <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded-lg transition">
                  Mulai Membaca
                </button>
              </div>
            </div>

            {/* Book Card 6 */}
            <div className="bg-white border-2 border-sky-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <div className="bg-sky-100 h-40 flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-sky-700 mb-2">Surga yang Tak Dirindukan</h3>
                <p className="text-gray-600 text-sm mb-3">Tere Liye</p>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-gray-600">352 halaman</span>
                  <span className="text-sky-600 font-bold">5/5 ⭐</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Cerita tentang keluarga, cinta, dan makna sejati dari surga di dunia.
                </p>
                <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded-lg transition">
                  Mulai Membaca
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kuis Tab */}
      {activeTab === 'kuis' && (
        <div>
          <div className="space-y-4">
            {/* Quiz 1 - Completed */}
            <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-sky-700">Kuis: Laskar Pelangi Bab 1-5</h3>
                  <p className="text-gray-600 text-sm">10 soal pilihan ganda</p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Selesai
                </span>
              </div>
              <div className="bg-sky-50 p-4 rounded mb-4 border-l-4 border-sky-400">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-gray-600 text-sm">Skor</p>
                    <p className="text-2xl font-bold text-sky-600">9/10</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Nilai</p>
                    <p className="text-2xl font-bold text-green-600">90%</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Poin</p>
                    <p className="text-2xl font-bold text-sky-600">+90</p>
                  </div>
                </div>
              </div>
              <button className="text-sky-600 hover:text-sky-700 font-semibold">
                Lihat Kembali →
              </button>
            </div>

            {/* Quiz 2 - Available */}
            <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-sky-700">Kuis: Negeri 5 Menara Bab 1-3</h3>
                  <p className="text-gray-600 text-sm">8 soal pilihan ganda · Durasi: 25 menit</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Tersedia
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                Ujian pengetahuan tentang petualangan 5 santri di Maroko dan Al-Azhar.
              </p>
              <button className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-lg transition">
                Mulai Kuis
              </button>
            </div>

            {/* Quiz 3 - Available */}
            <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-sky-700">Kuis: Sang Pemimpi</h3>
                  <p className="text-gray-600 text-sm">12 soal pilihan ganda · Durasi: 35 menit</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Tersedia
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                Kuis tentang perjalanan Ikal dan temanteman di perantauan.
              </p>
              <button className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-lg transition">
                Mulai Kuis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reward Tab */}
      {activeTab === 'reward' && (
        <div>
          <div className="mb-6 bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-sky-700">Poin Kamu</h3>
              <p className="text-4xl font-bold text-sky-600">⭐ 2,450</p>
            </div>
            <p className="text-gray-600 text-sm">
              Tukarkan poin Anda dengan reward menarik di bawah ini!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Reward 1 */}
            <div className="bg-white border-2 border-sky-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <div className="bg-sky-100 h-32 flex items-center justify-center">
                <span className="text-5xl">📚</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-sky-700 mb-2">Buku Gratis</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Dapatkan buku pilihan dari koleksi kami secara gratis
                </p>
                <div className="flex justify-between items-center mb-4 bg-sky-50 p-3 rounded">
                  <span className="text-gray-700 font-semibold">Harga:</span>
                  <span className="text-sky-600 font-bold text-lg">500 ⭐</span>
                </div>
                <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded-lg transition">
                  Tukar Sekarang
                </button>
              </div>
            </div>

            {/* Reward 2 */}
            <div className="bg-white border-2 border-sky-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <div className="bg-sky-100 h-32 flex items-center justify-center">
                <span className="text-5xl">🎟️</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-sky-700 mb-2">E-Voucher</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Voucher belanja online senilai Rp 100.000
                </p>
                <div className="flex justify-between items-center mb-4 bg-sky-50 p-3 rounded">
                  <span className="text-gray-700 font-semibold">Harga:</span>
                  <span className="text-sky-600 font-bold text-lg">300 ⭐</span>
                </div>
                <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded-lg transition">
                  Tukar Sekarang
                </button>
              </div>
            </div>

            {/* Reward 3 */}
            <div className="bg-white border-2 border-sky-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <div className="bg-sky-100 h-32 flex items-center justify-center">
                <span className="text-5xl">👕</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-sky-700 mb-2">Merchandise</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Kaos dan merchandise eksklusif READPOINT
                </p>
                <div className="flex justify-between items-center mb-4 bg-sky-50 p-3 rounded">
                  <span className="text-gray-700 font-semibold">Harga:</span>
                  <span className="text-sky-600 font-bold text-lg">1000 ⭐</span>
                </div>
                <button className="w-full bg-gray-400 text-white font-bold py-2 rounded-lg cursor-not-allowed">
                  Poin Kurang
                </button>
              </div>
            </div>
          </div>

          {/* Reward History */}
          <div className="mt-8 bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-bold text-sky-700 mb-4">Riwayat Penukaran</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-sky-100">
                <div>
                  <p className="text-gray-700 font-semibold">E-Voucher</p>
                  <p className="text-gray-600 text-sm">Kode: RVCH-2024-5847 · 8 Maret 2026</p>
                </div>
                <p className="text-red-600 font-bold">-300 ⭐</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700 font-semibold">Buku Gratis (Laskar Pelangi)</p>
                  <p className="text-gray-600 text-sm">Diklaim · 1 Maret 2026</p>
                </div>
                <p className="text-red-600 font-bold">-500 ⭐</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
