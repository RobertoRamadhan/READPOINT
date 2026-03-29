'use client';

import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface GuruStats {
  total_siswa?: number;
  total_kuis_dibuat?: number;
  validasi_pending?: number;
  siswa_aktif_hari_ini?: number;
}

interface Student {
  id: number;
  name: string;
  email: string;
  class_name?: string;
  total_points?: number;
  books_read?: number;
}

export default function GuruDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('validasi');
  const [stats, setStats] = useState<GuruStats>({});
  const [students, setStudents] = useState<Student[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && (!isAuthenticated || (user?.role !== 'guru' && user?.role !== 'admin'))) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, user?.role, router]);

  // Fetch guru stats and students
  useEffect(() => {
    if (isAuthenticated && (user?.role === 'guru' || user?.role === 'admin')) {
      const fetchData = async () => {
        try {
          setDataLoading(true);
          const [statsRes, studentsRes] = await Promise.all([
            api.dashboard.guruStats(),
            api.dashboard.guruStudents(),
          ]);
          setStats(statsRes || {});
          setStudents(Array.isArray(studentsRes) ? studentsRes : 
                      studentsRes?.data ? studentsRes.data : []);
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Gagal memuat data');
        } finally {
          setDataLoading(false);
        }
      };
      fetchData();
    }
  }, [isAuthenticated, user?.role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sky-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (user?.role !== 'guru' && user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="w-full space-y-8 md:space-y-10 lg:space-y-12">
      {/* Hero Header */}
      <div className="w-full bg-gradient-to-r from-purple-500 via-pink-400 to-red-400 p-6 md:p-8 lg:p-10 shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-40 md:w-56 lg:w-80 h-40 md:h-56 lg:h-80 bg-white opacity-10 rounded-full -mr-10 md:-mr-20 lg:-mr-40 -mt-10 md:-mt-20 lg:-mt-40"></div>
        <div className="absolute bottom-0 left-0 w-40 md:w-56 lg:w-80 h-40 md:h-56 lg:h-80 bg-white opacity-10 rounded-full -ml-10 md:-ml-20 lg:-ml-40 -mb-10 md:-mb-20 lg:-mb-40"></div>
        <div className="relative z-10 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3 lg:mb-4">Dashboard Guru</h1>
          <p className="text-red-50 text-base md:text-lg lg:text-xl">Monitor, validasi, dan atur pembelajaran siswa Anda dengan mudah</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-slide-up">
          <p className="font-semibold">⚠️ Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-lg md:rounded-xl p-4 md:p-6 lg:p-8 hover:shadow-lg hover:scale-105 transition duration-300">
          <div className="flex items-center justify-between gap-3 md:gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-purple-600 text-xs font-bold mb-1 md:mb-2 tracking-wide">👥 TOTAL SISWA</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-purple-700 drop-shadow-sm">{stats.total_siswa || 0}</p>
              <p className="text-xs text-purple-500 mt-1 font-semibold">Dalam kelas</p>
            </div>
            <div className="text-4xl md:text-5xl opacity-30 hover:opacity-100 transition-opacity shrink-0">👨‍🎓</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-300 rounded-lg md:rounded-xl p-4 md:p-6 lg:p-8 hover:shadow-lg hover:scale-105 transition duration-300">
          <div className="flex items-center justify-between gap-3 md:gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-pink-600 text-xs font-bold mb-1 md:mb-2 tracking-wide">🎯 KUIS DIBUAT</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-pink-700 drop-shadow-sm">{stats.total_kuis_dibuat || 0}</p>
              <p className="text-xs text-pink-500 mt-1 font-semibold">Total aktif</p>
            </div>
            <div className="text-4xl md:text-5xl opacity-30 hover:opacity-100 transition-opacity shrink-0">📝</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-lg md:rounded-xl p-4 md:p-6 lg:p-8 hover:shadow-lg hover:scale-105 transition duration-300">
          <div className="flex items-center justify-between gap-3 md:gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-amber-600 text-xs font-bold mb-1 md:mb-2 tracking-wide">⏳ VALIDASI PENDING</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-700 drop-shadow-sm">{stats.validasi_pending || 0}</p>
              <p className="text-xs text-amber-500 mt-1 font-semibold">Menunggu review</p>
            </div>
            <div className="text-4xl md:text-5xl opacity-30 hover:opacity-100 transition-opacity shrink-0">⌛</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-lg md:rounded-xl p-4 md:p-6 lg:p-8 hover:shadow-lg hover:scale-105 transition duration-300">
          <div className="flex items-center justify-between gap-3 md:gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-green-600 text-xs font-bold mb-1 md:mb-2 tracking-wide">🔥 AKTIF HARI INI</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-green-700 drop-shadow-sm">{stats.siswa_aktif_hari_ini || 0}</p>
              <p className="text-xs text-green-500 mt-1 font-semibold">Siswa online</p>
            </div>
            <div className="text-4xl md:text-5xl opacity-30 hover:opacity-100 transition-opacity shrink-0">🌟</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b-2 border-slate-200 flex gap-1 overflow-x-auto bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-2 w-full">
        {[
          { id: 'validasi', label: '✓ Validasi Pembacaan' },
          { id: 'monitoring', label: '📊 Monitoring' },
          { id: 'kuis', label: '🎯 Buat Kuis' },
          { id: 'siswa', label: '👥 Siswa Saya' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 md:px-5 lg:px-6 py-2 md:py-3 font-bold text-xs md:text-sm lg:text-base transition-all whitespace-nowrap rounded-lg ${
              activeTab === tab.id
                ? 'text-white bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Validasi Pembacaan Tab */}
      {activeTab === 'validasi' && (
        <div className="animate-slide-up">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">✓ Validasi Pembacaan</h2>
            <p className="text-slate-600 mb-6">Review aktivitas membaca siswa yang menunggu validasi</p>

            {dataLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                  <p className="text-blue-900 font-semibold mb-2">📌 Total Menunggu Validasi</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.validasi_pending || 0}</p>
                </div>
                <p className="text-slate-600 text-center py-8">
                  Fitur validasi pembacaan akan segera diluncurkan. Anda akan bisa melihat daftar aktivitas membaca siswa yang perlu divalidasi di sini.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Monitoring Tab */}
      {activeTab === 'monitoring' && (
        <div className="animate-slide-up">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">📊 Monitoring Siswa</h2>
            <p className="text-slate-600 mb-6">Pantau progress dan statistik pembelajaran siswa Anda secara real-time</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-semibold mb-2">📈 Total Progress</p>
                <p className="text-3xl font-bold text-blue-600">-</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-700 font-semibold mb-2">🏆 Top Performer</p>
                <p className="text-3xl font-bold text-purple-600">-</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-semibold mb-2">📊 Rata-rata Nilai</p>
                <p className="text-3xl font-bold text-green-600">-</p>
              </div>
            </div>

            <p className="text-slate-600 text-center py-8">
              Dashboard monitoring akurat akan ditampilkan di sini dengan grafik dan analytics yang lengkap.
            </p>
          </div>
        </div>
      )}

      {/* Buat Kuis Tab */}
      {activeTab === 'kuis' && (
        <div className="animate-slide-up">
          <div className="card p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">🎯 Buat & Kelola Kuis</h2>
                <p className="text-slate-600">Buat soal kuis interaktif untuk menguji pemahaman siswa</p>
              </div>
              <button className="btn-primary">
                + Kuis Baru
              </button>
            </div>

            <p className="text-slate-600 text-center py-12">
              Interface untuk membuat kuis akan ditampilkan di sini. Anda bisa membuat soal pilihan ganda, essay, dan jenis soal lainnya.
            </p>
          </div>
        </div>
      )}

      {/* Siswa Saya Tab */}
      {activeTab === 'siswa' && (
        <div className="animate-slide-up">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">👥 Daftar Siswa Saya</h2>
          
          {dataLoading ? (
            <div className="card p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading daftar siswa...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-slate-600 text-lg">📭 Belum ada siswa terdaftar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {students.map((student) => (
                <div key={student.id} className="card-hover p-6 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-800 mb-1">{student.name}</h3>
                      <p className="text-sm text-slate-500">{student.email}</p>
                    </div>
                    <div className="text-4xl opacity-50 group-hover:opacity-100 transition-opacity">👨‍🎓</div>
                  </div>

                  {student.class_name && (
                    <p className="text-sm text-slate-600 mb-4">
                      <span className="font-semibold">Kelas:</span> {student.class_name}
                    </p>
                  )}

                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">⭐ Total Poin</span>
                      <span className="text-2xl font-bold gradient-text">{student.total_points || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">📚 Buku Selesai</span>
                      <span className="text-2xl font-bold text-blue-600">{student.books_read || 0}</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 btn-secondary">
                    👁️ Lihat Detail
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
