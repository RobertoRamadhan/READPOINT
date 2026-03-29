'use client';

import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AdminStats {
  total_siswa?: number;
  total_guru?: number;
  total_ebook?: number;
  total_reward?: number;
  siswa_aktif_hari_ini?: number;
  buku_dibaca_hari_ini?: number;
  kuis_dikerjakan_hari_ini?: number;
  reward_diklaim_hari_ini?: number;
}

interface TopStudent {
  id: number;
  name: string;
  email: string;
  total_points?: number;
}

export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats>({});
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, user?.role, router]);

  // Fetch admin stats
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      const fetchStats = async () => {
        try {
          setDataLoading(true);
          const [statsRes, topStudentsRes] = await Promise.all([
            api.dashboard.adminStats(),
            api.dashboard.adminTopStudents(),
          ]);
          setStats(statsRes || {});
          setTopStudents(Array.isArray(topStudentsRes) ? topStudentsRes : 
                        topStudentsRes?.data ? topStudentsRes.data : []);
        } catch (err) {
          console.error('Error fetching stats:', err);
          setError('Gagal memuat data');
        } finally {
          setDataLoading(false);
        }
      };
      fetchStats();
    }
  }, [isAuthenticated, user?.role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sky-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-4 sm:px-6 lg:px-8">
      {/* Header with Animated Background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-500 rounded-2xl p-6 md:p-8 lg:p-10 mb-8 md:mb-10 lg:mb-12 shadow-xl">
        {/* Animated blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-1/2 translate-y-1/2 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3 animate-slideInLeft">👨‍💼 Dashboard Admin</h1>
          <p className="text-sky-50 text-base md:text-lg">Kelola sistem READPOINT secara keseluruhan</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md animate-slideInUp">
          <p className="font-semibold">⚠️ Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b-2 border-slate-200 flex gap-1 overflow-x-auto bg-gradient-to-r from-sky-50 to-cyan-50 rounded-lg p-2 w-full">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 md:px-5 lg:px-6 py-2 md:py-3 font-bold text-xs md:text-sm lg:text-base transition-all whitespace-nowrap rounded-lg ${
            activeTab === 'overview'
              ? 'text-white bg-gradient-to-r from-sky-500 to-cyan-600 shadow-lg'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          📊 Ringkasan
        </button>
        <button
          onClick={() => setActiveTab('ebooks')}
          className={`px-3 md:px-5 lg:px-6 py-2 md:py-3 font-bold text-xs md:text-sm lg:text-base transition-all whitespace-nowrap rounded-lg ${
            activeTab === 'ebooks'
              ? 'text-white bg-gradient-to-r from-sky-500 to-cyan-600 shadow-lg'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          📚 E-Book
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-3 md:px-5 lg:px-6 py-2 md:py-3 font-bold text-xs md:text-sm lg:text-base transition-all whitespace-nowrap rounded-lg ${
            activeTab === 'rewards'
              ? 'text-white bg-gradient-to-r from-sky-500 to-cyan-600 shadow-lg'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          🎁 Reward
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3 md:px-5 lg:px-6 py-2 md:py-3 font-bold text-xs md:text-sm lg:text-base transition-all whitespace-nowrap rounded-lg ${
            activeTab === 'users'
              ? 'text-white bg-gradient-to-r from-sky-500 to-cyan-600 shadow-lg'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          👥 Pengguna
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="px-4 md:px-0">
          {dataLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
                <p className="text-sky-600 text-lg font-semibold">Memuat data...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
                <div className="bg-gradient-to-br from-sky-50 to-sky-100 border-2 border-sky-300 rounded-lg md:rounded-xl p-4 md:p-6 lg:p-8 hover:shadow-lg hover:scale-105 transition duration-300">
                  <div className="flex items-center justify-between gap-3 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sky-600 text-xs font-bold mb-1 md:mb-2 tracking-wide">👥 TOTAL SISWA</p>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-black text-sky-700 drop-shadow-sm">{stats.total_siswa || 0}</p>
                      <p className="text-xs text-sky-500 mt-1 font-semibold">Siswa terdaftar</p>
                    </div>
                    <div className="text-4xl md:text-5xl opacity-30 hover:opacity-100 transition-opacity shrink-0">👥</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-lg md:rounded-xl p-4 md:p-6 lg:p-8 hover:shadow-lg hover:scale-105 transition duration-300">
                  <div className="flex items-center justify-between gap-3 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-purple-600 text-xs font-bold mb-1 md:mb-2 tracking-wide">🎓 TOTAL GURU</p>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-black text-purple-700 drop-shadow-sm">{stats.total_guru || 0}</p>
                      <p className="text-xs text-purple-500 mt-1 font-semibold">Guru pengajar</p>
                    </div>
                    <div className="text-4xl md:text-5xl opacity-30 hover:opacity-100 transition-opacity shrink-0">🎓</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-lg md:rounded-xl p-4 md:p-6 lg:p-8 hover:shadow-lg hover:scale-105 transition duration-300">
                  <div className="flex items-center justify-between gap-3 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-amber-600 text-xs font-bold mb-1 md:mb-2 tracking-wide">📚 TOTAL E-BOOK</p>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-700 drop-shadow-sm">{stats.total_ebook || 0}</p>
                      <p className="text-xs text-amber-500 mt-1 font-semibold">E-book tersedia</p>
                    </div>
                    <div className="text-4xl md:text-5xl opacity-30 hover:opacity-100 transition-opacity shrink-0">📚</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-lg md:rounded-xl p-4 md:p-6 lg:p-8 hover:shadow-lg hover:scale-105 transition duration-300">
                  <div className="flex items-center justify-between gap-3 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-green-600 text-xs font-bold mb-1 md:mb-2 tracking-wide">🎁 TOTAL REWARD</p>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-black text-green-700 drop-shadow-sm">{stats.total_reward || 0}</p>
                      <p className="text-xs text-green-500 mt-1 font-semibold">Reward tersedia</p>
                    </div>
                    <div className="text-4xl md:text-5xl opacity-30 hover:opacity-100 transition-opacity shrink-0">🎁</div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-white/80 backdrop-blur-md border border-sky-100 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-lg transition-all">
                  <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-6">📈 Aktivitas Hari Ini</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-xl hover:shadow-md transition-all">
                      <span className="text-gray-700 font-semibold">👤 Siswa Aktif</span>
                      <span className="text-2xl font-bold text-sky-600">{stats.siswa_aktif_hari_ini || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl hover:shadow-md transition-all">
                      <span className="text-gray-700 font-semibold">📖 Buku Dibaca</span>
                      <span className="text-2xl font-bold text-amber-600">{stats.buku_dibaca_hari_ini || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all">
                      <span className="text-gray-700 font-semibold">🎯 Kuis Dikerjakan</span>
                      <span className="text-2xl font-bold text-purple-600">{stats.kuis_dikerjakan_hari_ini || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all">
                      <span className="text-gray-700 font-semibold">🎁 Reward Diklaim</span>
                      <span className="text-2xl font-bold text-green-600">{stats.reward_diklaim_hari_ini || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md border border-sky-100 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-lg transition-all">
                  <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-6">🏆 Top 10 Siswa</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {topStudents.slice(0, 10).map((student, idx) => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-lg hover:shadow-md hover:translate-x-1 transition-all">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-full font-bold text-sm">{idx + 1}</span>
                          <div>
                            <p className="text-gray-800 font-semibold text-sm">{student.name}</p>
                            <p className="text-gray-500 text-xs">{student.email}</p>
                          </div>
                        </div>
                        <span className="font-bold text-lg bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">{student.total_points || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* E-Books Tab */}
      {activeTab === 'ebooks' && (
        <EbookManagement />
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <RewardManagement />
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <UserManagement />
      )}
    </div>
  );
}

// E-Book Management Component
interface EbookData {
  id: number;
  title: string;
  author: string;
  pages: number;
  category: string;
}

interface RewardData {
  id: number;
  name: string;
  description: string;
  points_required: number;
  stock: number;
  category: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  class_name?: string;
}

function EbookManagement() {
  const [ebooks, setEbooks] = useState<EbookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<EbookData | null>(null);
  const [formData, setFormData] = useState({ title: '', author: '', pages: 0, category: '' });

  useEffect(() => {
    fetchEbooks();
  }, []);

  const fetchEbooks = async () => {
    try {
      const response = await api.dashboard.adminBooks();
      setEbooks(response.data || []);
    } catch (err) {
      console.error('Error fetching ebooks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.ebooks.update?.(editing.id, formData);
      } else {
        await api.ebooks.create?.(formData);
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ title: '', author: '', pages: 0, category: '' });
      fetchEbooks();
    } catch (err) {
      console.error('Error saving ebook:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus e-book ini?')) {
      try {
        await api.ebooks.delete?.(id);
        fetchEbooks();
      } catch (err) {
        console.error('Error deleting ebook:', err);
      }
    }
  };

  return (
    <div className="px-4 md:px-0">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">📚 Manajemen E-Book</h2>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
            setFormData({ title: '', author: '', pages: 0, category: '' });
          }}
          className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
        >
          ➕ Tambah E-Book
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md border border-sky-100 rounded-2xl p-6 md:p-8 mb-6 shadow-md animate-slideInUp">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6">{editing ? '✏️ Edit E-Book' : '➕ Tambah E-Book Baru'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Judul"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="border border-sky-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-sky-50/50"
              required
            />
            <input
              type="text"
              placeholder="Penulis"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              className="border border-sky-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-sky-50/50"
              required
            />
            <input
              type="number"
              placeholder="Jumlah Halaman"
              value={formData.pages}
              onChange={(e) => setFormData({...formData, pages: parseInt(e.target.value)})}
              className="border border-sky-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-sky-50/50"
              required
            />
            <input
              type="text"
              placeholder="Kategori"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="border border-sky-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-sky-50/50"
              required
            />
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              ✓ Simpan
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              ✕ Batal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
            <p className="text-sky-600 text-lg font-semibold">Memuat data...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-md border border-sky-100 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gradient-to-r from-sky-50 to-cyan-50 border-b border-sky-200">
                <tr>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold text-sky-700 text-sm md:text-base">Judul</th>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold text-sky-700 text-sm md:text-base">Penulis</th>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold text-sky-700 text-sm md:text-base">Halaman</th>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold text-sky-700 text-sm md:text-base">Kategori</th>
                  <th className="px-4 md:px-6 py-4 text-center font-semibold text-sky-700 text-sm md:text-base">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {ebooks.map((ebook, idx) => (
                  <tr key={ebook.id} className={`border-b ${idx % 2 === 0 ? 'bg-white/50' : 'bg-sky-50/30'} hover:bg-sky-100/50 transition-colors`}>
                    <td className="px-4 md:px-6 py-4 text-gray-700 text-sm md:text-base font-medium">{ebook.title}</td>
                    <td className="px-4 md:px-6 py-4 text-gray-700 text-sm md:text-base">{ebook.author}</td>
                    <td className="px-4 md:px-6 py-4 text-gray-700 text-sm md:text-base">{ebook.pages}</td>
                    <td className="px-4 md:px-6 py-4 text-gray-700 text-sm md:text-base"><span className="inline-block bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-semibold">{ebook.category}</span></td>
                    <td className="px-4 md:px-6 py-4 text-center">
                      <div className="flex flex-col md:flex-row gap-2 justify-center">
                        <button
                          onClick={() => {
                            setEditing(ebook);
                            setFormData(ebook);
                            setShowForm(true);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all hover:shadow-md transform hover:scale-105"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(ebook.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all hover:shadow-md transform hover:scale-105"
                        >
                          🗑️ Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Reward Management Component
function RewardManagement() {
  const [rewards, setRewards] = useState<RewardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<RewardData | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', points_required: 0, stock: 0, category: '' });

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await api.rewards.list();
      setRewards(response.data || []);
    } catch (err) {
      console.error('Error fetching rewards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.rewards?.update?.(editing.id, formData);
      } else {
        await api.rewards?.create?.(formData);
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ name: '', description: '', points_required: 0, stock: 0, category: '' });
      fetchRewards();
    } catch (err) {
      console.error('Error saving reward:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus reward ini?')) {
      try {
        await api.rewards?.delete?.(id);
        fetchRewards();
      } catch (err) {
        console.error('Error deleting reward:', err);
      }
    }
  };

  return (
    <div className="px-4 md:px-0">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">🎁 Manajemen Reward</h2>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
            setFormData({ name: '', description: '', points_required: 0, stock: 0, category: '' });
          }}
          className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
        >
          ➕ Tambah Reward
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md border border-sky-100 rounded-2xl p-6 md:p-8 mb-6 shadow-md animate-slideInUp">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6">{editing ? '✏️ Edit Reward' : '➕ Tambah Reward Baru'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nama Reward"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="border border-sky-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-sky-50/50"
              required
            />
            <input
              type="number"
              placeholder="Poin Diperlukan"
              value={formData.points_required}
              onChange={(e) => setFormData({...formData, points_required: parseInt(e.target.value)})}
              className="border border-sky-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-sky-50/50"
              required
            />
            <input
              type="number"
              placeholder="Stok"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
              className="border border-sky-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-sky-50/50"
              required
            />
            <input
              type="text"
              placeholder="Kategori"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="border border-sky-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-sky-50/50"
              required
            />
            <textarea
              placeholder="Deskripsi"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="border border-sky-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-sky-50/50 md:col-span-2"
              required
            />
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              ✓ Simpan
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              ✕ Batal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
            <p className="text-sky-600 text-lg font-semibold">Memuat data...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-md border border-sky-100 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gradient-to-r from-sky-50 to-cyan-50 border-b border-sky-200">
                <tr>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold text-sky-700 text-sm md:text-base">Nama</th>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold text-sky-700 text-sm md:text-base">Poin</th>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold text-sky-700 text-sm md:text-base">Stok</th>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold text-sky-700 text-sm md:text-base">Kategori</th>
                  <th className="px-4 md:px-6 py-4 text-center font-semibold text-sky-700 text-sm md:text-base">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((reward, idx) => (
                  <tr key={reward.id} className={`border-b ${idx % 2 === 0 ? 'bg-white/50' : 'bg-sky-50/30'} hover:bg-sky-100/50 transition-colors`}>
                    <td className="px-4 md:px-6 py-4 text-gray-700 text-sm md:text-base font-medium">{reward.name}</td>
                    <td className="px-4 md:px-6 py-4 text-gray-700 text-sm md:text-base">{reward.points_required}</td>
                    <td className="px-4 md:px-6 py-4 text-gray-700 text-sm md:text-base"><span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${reward.stock > 5 ? 'bg-green-100 text-green-700' : reward.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{reward.stock}</span></td>
                    <td className="px-4 md:px-6 py-4 text-gray-700 text-sm md:text-base"><span className="inline-block bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-semibold">{reward.category}</span></td>
                    <td className="px-4 md:px-6 py-4 text-center">
                      <div className="flex flex-col md:flex-row gap-2 justify-center">
                        <button
                          onClick={() => {
                            setEditing(reward);
                            setFormData(reward);
                            setShowForm(true);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all hover:shadow-md transform hover:scale-105"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(reward.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all hover:shadow-md transform hover:scale-105"
                        >
                          🗑️ Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// User Management Component
function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'siswa' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.users.getAll();
      setUsers(response.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.users?.update?.(editing.id, formData);
      } else {
        // For creating users, you might need to add email and password
        console.log('Create user:', formData);
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ name: '', email: '', role: 'siswa' });
      fetchUsers();
    } catch (err) {
      console.error('Error saving user:', err);
    }
  };

  return (
    <div className="px-4 md:px-0">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">👥 Manajemen Pengguna</h2>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
            setFormData({ name: '', email: '', role: 'siswa' });
          }}
          className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
        >
          ➕ Tambah Pengguna
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md border border-sky-100 rounded-2xl p-6 md:p-8 mb-6 shadow-md animate-slideInUp">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6">{editing ? '✏️ Edit Pengguna' : '➕ Tambah Pengguna Baru'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nama"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="border border-sky-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-sky-50/50"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="border border-sky-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-sky-50/50"
              required
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="border border-sky-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-sky-50/50"
              aria-label="Pilih role pengguna"
            >
              <option value="siswa">👤 Siswa</option>
              <option value="guru">🎓 Guru</option>
              <option value="admin">👨‍💼 Admin</option>
            </select>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              ✓ Simpan
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              ✕ Batal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
            <p className="text-sky-600 text-lg font-semibold">Memuat data...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-md border border-sky-100 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gradient-to-r from-sky-50 to-cyan-50 border-b border-sky-200">
                <tr>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold text-sky-700 text-sm md:text-base">Nama</th>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold text-sky-700 text-sm md:text-base">Email</th>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold text-sky-700 text-sm md:text-base">Role</th>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold text-sky-700 text-sm md:text-base">Kelas</th>
                  <th className="px-4 md:px-6 py-4 text-center font-semibold text-sky-700 text-sm md:text-base">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id} className={`border-b ${idx % 2 === 0 ? 'bg-white/50' : 'bg-sky-50/30'} hover:bg-sky-100/50 transition-colors`}>
                    <td className="px-4 md:px-6 py-4 text-gray-700 text-sm md:text-base font-medium">{user.name}</td>
                    <td className="px-4 md:px-6 py-4 text-gray-700 text-sm md:text-base">{user.email}</td>
                    <td className="px-4 md:px-6 py-4 text-sm md:text-base">
                      <span className={`inline-block px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'guru' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {user.role === 'admin' ? '👨‍💼 ' : user.role === 'guru' ? '🎓 ' : '👤 '}{user.role}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-gray-700 text-sm md:text-base">{user.class_name || '-'}</td>
                    <td className="px-4 md:px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setEditing(user);
                          setFormData(user);
                          setShowForm(true);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all hover:shadow-md transform hover:scale-105"
                      >
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
