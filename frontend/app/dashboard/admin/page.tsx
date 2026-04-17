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

interface Ebook {
  id: number;
  title: string;
  author: string;
  pages: number;
  category: string;
  is_active: boolean;
  poin_per_halaman?: number;
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

interface TopStudent {
  id: number;
  name: string;
  email: string;
  total_points?: number;
}

export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats>({});
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (loading || !mounted || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="w-full h-full">
      <div className="flex h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-y-auto shadow-2xl border-r border-slate-700">
          <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-900">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-3xl">⚙️</span> ADMIN
            </h2>
          </div>

          <nav className="p-4 space-y-2">
            {[
              { id: 'overview', label: '📊 Ringkasan', icon: '📊' },
              { id: 'ebooks', label: '📚 E-Book', icon: '📚' },
              { id: 'rewards', label: '🎁 Reward', icon: '🎁' },
              { id: 'users', label: '👥 Pengguna', icon: '👥' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-4 py-3 font-semibold rounded-lg transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg transform scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-8 py-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-slide-up">
                <p className="font-bold">Error: {error}</p>
              </div>
            )}

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <OverviewTab stats={stats} topStudents={topStudents} dataLoading={dataLoading} />
            )}

            {/* E-Books Tab */}
            {activeTab === 'ebooks' && <EbookManagementTab />}

            {/* Rewards Tab */}
            {activeTab === 'rewards' && <RewardManagementTab />}

            {/* Users Tab */}
            {activeTab === 'users' && <UserManagementTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============== OVERVIEW TAB ==============
function OverviewTab({ stats, topStudents, dataLoading }: { stats: AdminStats; topStudents: TopStudent[]; dataLoading: boolean }) {
  if (dataLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <div className="w-12 h-12 border-4 border-sky-300 border-t-sky-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-600 font-semibold mt-4">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">📊</span>
        <h2 className="text-3xl font-bold text-slate-900">Dashboard Ringkasan</h2>
      </div>

      {/* Key Stats Grid - 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="👨‍🎓"
          title="Siswa"
          value={stats.total_siswa || 0}
          gradient="from-blue-500 to-blue-600"
          borderColor="border-blue-200"
        />
        <StatCard
          icon="👨‍🏫"
          title="Guru"
          value={stats.total_guru || 0}
          gradient="from-emerald-500 to-emerald-600"
          borderColor="border-emerald-200"
        />
        <StatCard
          icon="📚"
          title="E-Book"
          value={stats.total_ebook || 0}
          gradient="from-amber-500 to-amber-600"
          borderColor="border-amber-200"
        />
        <StatCard
          icon="🎁"
          title="Reward"
          value={stats.total_reward || 0}
          gradient="from-rose-500 to-rose-600"
          borderColor="border-rose-200"
        />
      </div>

      {/* Activity & Top Students */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityWidget stats={stats} />
        <TopStudentsWidget students={topStudents} />
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, gradient, borderColor }: any) {
  return (
    <div className={`card border-2 ${borderColor} hover:border-opacity-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group`}>
      <div className={`bg-gradient-to-br ${gradient} rounded-lg w-16 h-16 flex items-center justify-center text-white text-3xl mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <p className="text-sm font-semibold text-slate-600 uppercase">{title}</p>
      <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
    </div>
  );
}

function ActivityWidget({ stats }: { stats: AdminStats }) {
  return (
    <div className="lg:col-span-2 card border-2 border-slate-200 shadow-lg overflow-hidden hover:shadow-xl transition-all">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 flex items-center gap-3">
        <span className="text-3xl">⚡</span>
        <h3 className="text-xl font-bold text-white">Aktivitas Hari Ini</h3>
      </div>
      <div className="p-6 space-y-3">
        {[
          { label: 'Siswa Aktif', value: stats.siswa_aktif_hari_ini || 0, icon: '👤', color: 'sky' },
          { label: 'Buku Dibaca', value: stats.buku_dibaca_hari_ini || 0, icon: '📖', color: 'emerald' },
          { label: 'Kuis Diselesaikan', value: stats.kuis_dikerjakan_hari_ini || 0, icon: '🎯', color: 'amber' },
          { label: 'Reward Diklaim', value: stats.reward_diklaim_hari_ini || 0, icon: '🏆', color: 'rose' },
        ].map((item, idx) => (
          <div key={idx} className={`flex items-center justify-between p-4 bg-${item.color}-50 border border-${item.color}-200 rounded-lg hover:shadow-md transition-all`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <p className="font-semibold text-slate-900">{item.label}</p>
            </div>
            <span className={`text-2xl font-bold text-${item.color}-600`}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopStudentsWidget({ students }: { students: TopStudent[] }) {
  return (
    <div className="card border-2 border-sky-200 shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-all">
      <div className="bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-4 flex items-center gap-3">
        <span className="text-3xl">🏆</span>
        <h3 className="text-xl font-bold text-white">Top Siswa</h3>
      </div>
      <div className="p-6 overflow-y-auto flex-1 space-y-2">
        {students.slice(0, 5).map((student, idx) => (
          <div
            key={student.id}
            className="flex items-center justify-between p-3 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-lg border border-sky-100 hover:border-sky-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {idx + 1}
              </span>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 truncate text-sm">{student.name}</p>
                <p className="text-xs text-slate-600 truncate">{student.email}</p>
              </div>
            </div>
            <span className="font-bold text-sky-600 text-lg ml-2">{student.total_points || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============== E-BOOK MANAGEMENT TAB ==============
function EbookManagementTab() {
  const [data, setData] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEbooks();
  }, []);

  const fetchEbooks = async () => {
    try {
      setLoading(true);
      const response = await api.dashboard.adminBooks();
      setData(response.data || []);
    } catch (err) {
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin?')) return;
    try {
      await api.ebooks.delete?.(id);
      fetchEbooks();
    } catch (err) {
      setError('Gagal menghapus e-book');
    }
  };

  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="card border-2 border-amber-200 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <h2 className="text-xl font-bold text-white">Manajemen E-Book</h2>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-amber-600 px-4 py-2 rounded-lg font-bold hover:bg-amber-50 transition-all"
          >
            {showForm ? '✕ Close' : '+ Tambah'}
          </button>
        </div>

        <div className="p-6 space-y-4">
          {showForm && <EbookForm onSuccess={() => { setShowForm(false); fetchEbooks(); }} />}

          <input
            type="text"
            placeholder="🔍 Cari e-book..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.map(ebook => (
                <div key={ebook.id} className="card border-2 border-amber-100 hover:border-amber-400 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900">{ebook.title}</h3>
                      <p className="text-sm text-slate-600">{ebook.author}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${ebook.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {ebook.is_active ? '✓ Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 space-y-1 mb-4">
                    <p>📄 {ebook.pages} halaman</p>
                    <p>🏷️ {ebook.category}</p>
                    <p>⭐ {ebook.poin_per_halaman} poin/halaman</p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleDelete(ebook.id)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-200 transition-all"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EbookForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    pages: 100,
    category: '',
    poin_per_halaman: 5,
    grade_level: '1',
  });
  const [files, setFiles] = useState({ image: null as File | null, pdf: null as File | null });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.author || !formData.category) {
      setError('Semua field teks harus diisi');
      return;
    }

    if (!files.image || !files.pdf) {
      setError('Gambar dan PDF harus diunggah');
      return;
    }

    try {
      setUploading(true);
      const form = new FormData();
      form.append('title', formData.title);
      form.append('author', formData.author);
      form.append('pages', formData.pages.toString());
      form.append('category', formData.category);
      form.append('poin_per_halaman', formData.poin_per_halaman.toString());
      form.append('grade_level', formData.grade_level);
      form.append('cover_image', files.image!);
      form.append('pdf_file', files.pdf!);

      const result = await api.ebooks.create(form);
      console.log('[EbookForm] Upload successful:', result);
      onSuccess();
    } catch (err) {
      console.error('[EbookForm] Upload error:', err);
      setError(err instanceof Error ? err.message : 'Gagal mengunggah e-book');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 space-y-4">
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-bold">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Judul Buku"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="border border-amber-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        />
        <input
          type="text"
          placeholder="Pengarang"
          value={formData.author}
          onChange={(e) => setFormData({...formData, author: e.target.value})}
          className="border border-amber-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        />
        <input
          type="number"
          placeholder="Total Halaman"
          value={formData.pages}
          onChange={(e) => setFormData({...formData, pages: parseInt(e.target.value) || 1})}
          className="border border-amber-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          min="1"
          required
        />
        <input
          type="text"
          placeholder="Kategori"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          className="border border-amber-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        />
        <input
          type="number"
          placeholder="Poin per Halaman"
          value={formData.poin_per_halaman}
          onChange={(e) => setFormData({...formData, poin_per_halaman: parseInt(e.target.value) || 1})}
          className="border border-amber-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          min="1"
          required
        />
        <select
          value={formData.grade_level}
          onChange={(e) => setFormData({...formData, grade_level: e.target.value})}
          className="border border-amber-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        >
          <option value="1">📚 Kelas 1</option>
          <option value="2">📚 Kelas 2</option>
          <option value="3">📚 Kelas 3</option>
          <option value="all">🌍 Semua Kelas</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">📷 Gambar Sampul</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFiles({...files, image: e.target.files?.[0] || null})}
            className="w-full border border-amber-300 rounded-lg px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">📄 File PDF</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFiles({...files, pdf: e.target.files?.[0] || null})}
            className="w-full border border-amber-300 rounded-lg px-4 py-2"
            required
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="submit"
          disabled={uploading}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {uploading ? 'Mengunggah...' : '✓ Simpan'}
        </button>
      </div>
    </form>
  );
}

// ============== REWARD MANAGEMENT TAB ==============
function RewardManagementTab() {
  const [data, setData] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const response = await api.rewards.list?.() || await api.getRewards?.();
      setData(Array.isArray(response) ? response : response?.data || []);
    } catch (err) {
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin?')) return;
    try {
      await api.rewards.delete?.(id);
      fetchRewards();
    } catch (err) {
      setError('Gagal menghapus reward');
    }
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="card border-2 border-rose-200 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎁</span>
            <h2 className="text-xl font-bold text-white">Manajemen Reward</h2>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-rose-600 px-4 py-2 rounded-lg font-bold hover:bg-rose-50 transition-all"
          >
            {showForm ? '✕ Close' : '+ Tambah'}
          </button>
        </div>

        <div className="p-6 space-y-4">
          {showForm && <RewardForm onSuccess={() => { setShowForm(false); fetchRewards(); }} />}

          <input
            type="text"
            placeholder="🔍 Cari reward..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.map(reward => (
                <div key={reward.id} className="card border-2 border-rose-100 hover:border-rose-400 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900">{reward.name}</h3>
                      <p className="text-sm text-slate-600 line-clamp-2">{reward.description}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${reward.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {reward.is_active ? '✓' : 'X'}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 space-y-1 mb-4">
                    <p>⭐ {reward.points_required} poin</p>
                    <p>📦 {reward.stock} tersedia</p>
                    <p>🏷️ {reward.category}</p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleDelete(reward.id)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-200 transition-all"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RewardForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    points_required: 100,
    stock: 10,
    category: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.description || !formData.category) {
      setError('Semua field teks harus diisi');
      return;
    }

    try {
      setSubmitting(true);
      const result = await api.rewards.create(formData);
      console.log('[RewardForm] Save successful:', result);
      onSuccess();
    } catch (err) {
      console.error('[RewardForm] Save error:', err);
      setError(err instanceof Error ? err.message : 'Gagal menyimpan reward');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-rose-50 border-2 border-rose-200 rounded-lg p-6 space-y-4">
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-bold">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nama Reward"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="border border-rose-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
          required
        />
        <input
          type="text"
          placeholder="Kategori"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          className="border border-rose-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
          required
        />
        <input
          type="number"
          placeholder="Poin Diperlukan"
          value={formData.points_required}
          onChange={(e) => setFormData({...formData, points_required: parseInt(e.target.value) || 1})}
          className="border border-rose-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
          min="1"
          required
        />
        <input
          type="number"
          placeholder="Stok Tersedia"
          value={formData.stock}
          onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 1})}
          className="border border-rose-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
          min="0"
          required
        />
      </div>

      <textarea
        placeholder="Deskripsi Reward"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        rows={3}
        className="w-full border border-rose-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
        required
      />

      <div className="flex gap-2 justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {submitting ? 'Menyimpan...' : '✓ Simpan'}
        </button>
      </div>
    </form>
  );
}

// ============== USER MANAGEMENT TAB ==============
function UserManagementTab() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.users?.getAll?.();
      setData(response?.data || response || []);
    } catch (err) {
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin akan menghapus user ini?')) return;
    try {
      // Implementasi delete jika ada
      await api.users?.delete?.(id);
      fetchUsers();
    } catch (err) {
      setError('Gagal menghapus user');
    }
  };

  const filteredData = data.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || item.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="card border-2 border-cyan-200 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👥</span>
            <h2 className="text-xl font-bold text-white">Manajemen Pengguna</h2>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-cyan-600 px-4 py-2 rounded-lg font-bold hover:bg-cyan-50 transition-all"
          >
            {showForm ? '✕ Close' : '+ Tambah'}
          </button>
        </div>

        <div className="p-6 space-y-4">
          {showForm && <UserForm onSuccess={() => { setShowForm(false); fetchUsers(); }} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="🔍 Cari user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-cyan-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-cyan-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Semua Role</option>
              <option value="admin">Admin</option>
              <option value="guru">Guru</option>
              <option value="siswa">Siswa</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-cyan-200 bg-cyan-50">
                    <th className="px-4 py-2 text-left font-bold text-slate-900">Nama</th>
                    <th className="px-4 py-2 text-left font-bold text-slate-900">Email</th>
                    <th className="px-4 py-2 text-left font-bold text-slate-900">Role</th>
                    <th className="px-4 py-2 text-left font-bold text-slate-900">Kelas</th>
                    <th className="px-4 py-2 text-center font-bold text-slate-900">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(user => (
                    <tr key={user.id} className="border-b border-cyan-100 hover:bg-cyan-50 transition-all">
                      <td className="px-4 py-3 font-semibold text-slate-900">{user.name}</td>
                      <td className="px-4 py-3 text-slate-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.role === 'admin' ? 'bg-red-100 text-red-700' :
                          user.role === 'guru' ? 'bg-purple-100 text-purple-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role === 'admin' ? '⚙️ Admin' : user.role === 'guru' ? '👨‍🏫 Guru' : '👨‍🎓 Siswa'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{user.class_name || '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-200 transition-all"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UserForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'siswa',
    class_name: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Semua field harus diisi');
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError('Password tidak cocok');
      return;
    }

    try {
      setSubmitting(true);
      await api.users?.create?.(formData);
      onSuccess();
    } catch (err) {
      setError('Gagal menyimpan user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-cyan-50 border-2 border-cyan-200 rounded-lg p-6 space-y-4">
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-bold">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nama Lengkap"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="border border-cyan-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="border border-cyan-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          className="border border-cyan-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        >
          <option value="siswa">Siswa</option>
          <option value="guru">Guru</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="text"
          placeholder="Kelas/Divisi (opsional)"
          value={formData.class_name}
          onChange={(e) => setFormData({...formData, class_name: e.target.value})}
          className="border border-cyan-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          className="border border-cyan-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        />
        <input
          type="password"
          placeholder="Konfirmasi Password"
          value={formData.password_confirmation}
          onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
          className="border border-cyan-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {submitting ? 'Menyimpan...' : '✓ Simpan'}
        </button>
      </div>
    </form>
  );
}
