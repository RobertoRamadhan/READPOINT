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
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-400 to-sky-500 rounded-lg p-6 mb-8 shadow-md">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Guru</h1>
        <p className="text-sky-100">Monitor dan atur pembelajaran siswa Anda</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md">
          <p className="text-gray-600 text-sm">Total Siswa</p>
          <p className="text-3xl font-bold text-sky-600">{stats.total_siswa || 0}</p>
        </div>
        <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md">
          <p className="text-gray-600 text-sm">Kuis Dibuat</p>
          <p className="text-3xl font-bold text-sky-600">{stats.total_kuis_dibuat || 0}</p>
        </div>
        <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md">
          <p className="text-gray-600 text-sm">Validasi Pending</p>
          <p className="text-3xl font-bold text-sky-600">{stats.validasi_pending || 0}</p>
        </div>
        <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md">
          <p className="text-gray-600 text-sm">Siswa Aktif Hari Ini</p>
          <p className="text-3xl font-bold text-sky-600">{stats.siswa_aktif_hari_ini || 0}</p>
        </div>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Aktivitas Pembacaan Menunggu Validasi</h2>
          {dataLoading ? (
            <p className="text-gray-600">Loading...</p>
          ) : (
            <p className="text-gray-600 mb-6">Total: {stats.validasi_pending || 0} aktivitas menunggu validasi</p>
          )}
          <p className="text-gray-600">Validation interface coming soon...</p>
        </div>
      )}

      {/* Monitoring Tab */}
      {activeTab === 'monitoring' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Monitoring Siswa</h2>
          <p className="text-gray-600">Monitoring interface coming soon...</p>
        </div>
      )}

      {/* Buat Kuis Tab */}
      {activeTab === 'kuis' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Buat & Kelola Kuis</h2>
          <p className="text-gray-600">Quiz creation interface coming soon...</p>
        </div>
      )}

      {/* Siswa Saya Tab */}
      {activeTab === 'siswa' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Daftar Siswa Saya</h2>
          {dataLoading ? (
            <p className="text-gray-600">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {students.map((student) => (
                <div key={student.id} className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md">
                  <h3 className="font-bold text-lg text-sky-700 mb-2">{student.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{student.email}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Poin:</span>
                      <span className="font-bold text-sky-600">{student.total_points || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Buku Selesai:</span>
                      <span className="font-bold text-sky-600">{student.books_read || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
