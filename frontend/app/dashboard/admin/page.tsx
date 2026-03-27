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

interface Ebook {
  id: number;
  title: string;
  author: string;
  pages: number;
  category: string;
  is_active: boolean;
}

interface Reward {
  id: number;
  name: string;
  description: string;
  points_required: number;
  stock: number;
  category: string;
  is_active: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  class_name?: string;
}

export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats>({});
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  // Data lists
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Modal states
  const [showEbookForm, setShowEbookForm] = useState(false);
  const [showRewardForm, setShowRewardForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);

  // Form states
  const [ebookForm, setEbookForm] = useState({ title: '', author: '', pages: 0, category: '' });
  const [rewardForm, setRewardForm] = useState({ name: '', description: '', points_required: 0, stock: 0, category: '' });
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'siswa' });

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
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-400 to-sky-500 rounded-lg p-6 mb-8 shadow-md">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Admin</h1>
        <p className="text-sky-100">Kelola sistem READPOINT secara keseluruhan</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-sky-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'overview'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-gray-600 hover:text-sky-500'
          }`}
        >
          📊 Ringkasan
        </button>
        <button
          onClick={() => setActiveTab('ebooks')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'ebooks'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-gray-600 hover:text-sky-500'
          }`}
        >
          📚 E-Book
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'rewards'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-gray-600 hover:text-sky-500'
          }`}
        >
          🎁 Reward
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'users'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-gray-600 hover:text-sky-500'
          }`}
        >
          👥 Pengguna
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {dataLoading ? (
            <div className="text-center py-10 text-sky-600">Loading data...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Siswa</p>
                      <p className="text-3xl font-bold text-sky-600">{stats.total_siswa || 0}</p>
                    </div>
                    <div className="text-4xl">👥</div>
                  </div>
                </div>

                <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Guru</p>
                      <p className="text-3xl font-bold text-sky-600">{stats.total_guru || 0}</p>
                    </div>
                    <div className="text-4xl">🎓</div>
                  </div>
                </div>

                <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total E-Book</p>
                      <p className="text-3xl font-bold text-sky-600">{stats.total_ebook || 0}</p>
                    </div>
                    <div className="text-4xl">📚</div>
                  </div>
                </div>

                <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Reward</p>
                      <p className="text-3xl font-bold text-sky-600">{stats.total_reward || 0}</p>
                    </div>
                    <div className="text-4xl">🎁</div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-bold text-sky-700 mb-4">📈 Statistik Aktivitas Hari Ini</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Siswa Aktif</span>
                      <span className="font-bold text-sky-600">{stats.siswa_aktif_hari_ini || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Buku Dibaca</span>
                      <span className="font-bold text-sky-600">{stats.buku_dibaca_hari_ini || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Kuis Dikerjakan</span>
                      <span className="font-bold text-sky-600">{stats.kuis_dikerjakan_hari_ini || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Reward Diklaim</span>
                      <span className="font-bold text-sky-600">{stats.reward_diklaim_hari_ini || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-bold text-sky-700 mb-4">🎯 Top 10 Siswa</h3>
                  <div className="space-y-2">
                    {topStudents.slice(0, 10).map((student, idx) => (
                      <div key={student.id} className="flex justify-between items-center pb-2 border-b border-sky-100">
                        <span className="text-gray-700">{idx + 1}. {student.name}</span>
                        <span className="font-bold text-sky-600">{student.total_points || 0} poin</span>
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
function EbookManagement() {
  const [ebooks, setEbooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
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
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen E-Book</h2>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
            setFormData({ title: '', author: '', pages: 0, category: '' });
          }}
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          ➕ Tambah E-Book
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-sky-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">{editing ? 'Edit E-Book' : 'Tambah E-Book Baru'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Judul"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Penulis"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Jumlah Halaman"
              value={formData.pages}
              onChange={(e) => setFormData({...formData, pages: parseInt(e.target.value)})}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Kategori"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              ✓ Simpan
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
            >
              ✕ Batal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="bg-white border-2 border-sky-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-sky-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-sky-700">Judul</th>
                <th className="px-6 py-3 text-left font-semibold text-sky-700">Penulis</th>
                <th className="px-6 py-3 text-left font-semibold text-sky-700">Halaman</th>
                <th className="px-6 py-3 text-left font-semibold text-sky-700">Kategori</th>
                <th className="px-6 py-3 text-center font-semibold text-sky-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {ebooks.map((ebook) => (
                <tr key={ebook.id} className="border-b hover:bg-sky-50">
                  <td className="px-6 py-4 text-gray-700">{ebook.title}</td>
                  <td className="px-6 py-4 text-gray-700">{ebook.author}</td>
                  <td className="px-6 py-4 text-gray-700">{ebook.pages}</td>
                  <td className="px-6 py-4 text-gray-700">{ebook.category}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => {
                        setEditing(ebook);
                        setFormData(ebook);
                        setShowForm(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ebook.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Reward Management Component
function RewardManagement() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
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
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Reward</h2>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
            setFormData({ name: '', description: '', points_required: 0, stock: 0, category: '' });
          }}
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          ➕ Tambah Reward
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-sky-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">{editing ? 'Edit Reward' : 'Tambah Reward Baru'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nama Reward"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Poin Diperlukan"
              value={formData.points_required}
              onChange={(e) => setFormData({...formData, points_required: parseInt(e.target.value)})}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Stok"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Kategori"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
            <textarea
              placeholder="Deskripsi"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2 md:col-span-2"
              required
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              ✓ Simpan
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
            >
              ✕ Batal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="bg-white border-2 border-sky-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-sky-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-sky-700">Nama</th>
                <th className="px-6 py-3 text-left font-semibold text-sky-700">Poin</th>
                <th className="px-6 py-3 text-left font-semibold text-sky-700">Stok</th>
                <th className="px-6 py-3 text-left font-semibold text-sky-700">Kategori</th>
                <th className="px-6 py-3 text-center font-semibold text-sky-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rewards.map((reward) => (
                <tr key={reward.id} className="border-b hover:bg-sky-50">
                  <td className="px-6 py-4 text-gray-700">{reward.name}</td>
                  <td className="px-6 py-4 text-gray-700">{reward.points_required}</td>
                  <td className="px-6 py-4 text-gray-700">{reward.stock}</td>
                  <td className="px-6 py-4 text-gray-700">{reward.category}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => {
                        setEditing(reward);
                        setFormData(reward);
                        setShowForm(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(reward.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// User Management Component
function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
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
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h2>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
            setFormData({ name: '', email: '', role: 'siswa' });
          }}
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          ➕ Tambah Pengguna
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-sky-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">{editing ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nama"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="siswa">Siswa</option>
              <option value="guru">Guru</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              ✓ Simpan
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
            >
              ✕ Batal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="bg-white border-2 border-sky-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-sky-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-sky-700">Nama</th>
                <th className="px-6 py-3 text-left font-semibold text-sky-700">Email</th>
                <th className="px-6 py-3 text-left font-semibold text-sky-700">Role</th>
                <th className="px-6 py-3 text-left font-semibold text-sky-700">Kelas</th>
                <th className="px-6 py-3 text-center font-semibold text-sky-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-sky-50">
                  <td className="px-6 py-4 text-gray-700">{user.name}</td>
                  <td className="px-6 py-4 text-gray-700">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'guru' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{user.class_name || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => {
                        setEditing(user);
                        setFormData(user);
                        setShowForm(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
