'use client';

import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import AdminSidebar from '@/components/AdminSidebar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
  const [activeTab, setActiveTab] = useState('beranda');
  const [stats, setStats] = useState<AdminStats>({});
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          setStats((statsRes?.data as any) || statsRes || {});
          setTopStudents((Array.isArray(topStudentsRes) ? topStudentsRes : 
                        topStudentsRes?.data ? topStudentsRes.data : []) as TopStudent[]);
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

  const menuItems = [
    { id: 'beranda', label: 'Beranda' },
    {
      id: 'manajemen',
      label: 'Manajemen',
      subItems: [
        { id: 'ebooks', label: 'E-Book' },
        { id: 'rewards', label: 'Reward' },
        { id: 'users', label: 'User' },
      ],
    },
    { id: 'laporan', label: 'Laporan' },
    { id: 'pengaturan', label: 'Pengaturan' },
  ];

  return (
    <div className="flex w-full">
      {/* Hamburger Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-16 left-4 z-40 p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all md:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Backdrop - Mobile Only */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden top-14"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* New Sidebar Component with Dropdown */}
        <AdminSidebar
          activeTab={activeTab}
          sidebarOpen={sidebarOpen}
          onTabChange={setActiveTab}
          onCloseSidebar={() => setSidebarOpen(false)}
          menuItems={menuItems}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {error && (
              <div className="m-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p className="font-bold">Error: {error}</p>
              </div>
            )}

            {/* Beranda Tab */}
            {activeTab === 'beranda' && (
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
  );
}

// ============== OVERVIEW TAB ==============
function OverviewTab({ stats, topStudents, dataLoading }: { stats: AdminStats; topStudents: TopStudent[]; dataLoading: boolean }) {
  if (dataLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600 font-semibold mt-4">Memuat data...</p>
      </div>
    );
  }

  // Prepare data for bar chart
  const barChartData = [
    { name: 'Siswa', value: stats.total_siswa || 0 },
    { name: 'Guru', value: stats.total_guru || 0 },
    { name: 'Buku', value: stats.total_ebook || 0 },
    { name: 'Reward', value: stats.total_reward || 0 },
  ];

  // Prepare data for pie chart (Reward)
  const pieChartData = [
    { name: 'Reward Diklaim', value: stats.reward_diklaim_hari_ini || 0 },
    { name: 'Reward Tersisa', value: Math.max(0, (stats.total_reward || 0) - (stats.reward_diklaim_hari_ini || 0)) },
  ];

  const COLORS = ['#3b82f6', '#f59e0b'];

  return (
    <div className="p-8 space-y-8 w-full">
      {/* Activity Widget */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg shadow-lg p-10 animate-slide-up">
        <h2 className="text-4xl font-bold text-white mb-8">Today's Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
          <ActivityItem label="Active Students" value={stats.siswa_aktif_hari_ini || 0} delay="0.1s" />
          <ActivityItem label="Books Read" value={stats.buku_dibaca_hari_ini || 0} delay="0.15s" />
          <ActivityItem label="Quizzes Completed" value={stats.kuis_dikerjakan_hari_ini || 0} delay="0.2s" />
          <ActivityItem label="Rewards Claimed" value={stats.reward_diklaim_hari_ini || 0} delay="0.25s" />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-300 animate-scale-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-2xl font-bold text-gray-900 mb-8">System Statistics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-300 animate-scale-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Rewards Status Today</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, delay = '0s' }: { title: string; value: number; delay?: string }) {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-8 border border-gray-300 hover:shadow-lg transition-all hover:border-gray-400 flex justify-between items-center transform hover:scale-105 animate-scale-up"
      style={{ animationDelay: delay }}
    >
      <div>
        <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
        <p className="text-4xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ label, value, delay = '0s' }: { label: string; value: number; delay?: string }) {
  return (
    <div
      className="bg-white/15 backdrop-blur-sm rounded-lg p-6 border border-white/20 text-center text-white hover:bg-white/20 transition-all transform hover:scale-105 animate-scale-up"
      style={{ animationDelay: delay }}
    >
      <p className="text-sm font-semibold mb-3 uppercase tracking-wide opacity-100">{label}</p>
      <p className="text-4xl font-bold">{value}</p>
      <div className="h-1 w-12 bg-white/40 mx-auto rounded-full mt-4"></div>
    </div>
  );
}

// ============== EBOOK MANAGEMENT TAB ==============
function EbookManagementTab() {
  const [data, setData] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEbooks();
  }, []);

  const fetchEbooks = async () => {
    try {
      setLoading(true);
      const response = await api.dashboard.adminBooks();
      setData((response.data || []) as Ebook[]);
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
    <div className="p-8 space-y-6">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">Manajemen E-Book</h2>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition-all"
          >
            {showForm ? 'Tutup' : '+ Tambah'}
          </button>
        </div>

        <div className="p-8 space-y-4">
          {showForm && <EbookForm onSuccess={() => { setShowForm(false); fetchEbooks(); }} />}

          <input
            type="text"
            placeholder="Cari e-book..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.map(ebook => (
                <div key={ebook.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{ebook.title}</h3>
                      <p className="text-sm text-gray-600">{ebook.author}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700`}>
                      {ebook.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <p>{ebook.pages} halaman</p>
                    <p>🏷️ {ebook.category}</p>
                    <p>⭐ {ebook.poin_per_halaman} poin/halaman</p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleDelete(ebook.id)}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-200 transition-all"
                    >
                      Hapus
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
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.author || !formData.category) {
      setError('Semua field teks harus diisi');
      return;
    }

    try {
      setSubmitting(true);
      await api.ebooks.create(formData);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-bold">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Judul Buku"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Pengarang"
          value={formData.author}
          onChange={(e) => setFormData({...formData, author: e.target.value})}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="number"
          placeholder="Total Halaman"
          value={formData.pages}
          onChange={(e) => setFormData({...formData, pages: parseInt(e.target.value) || 1})}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="1"
          required
        />
        <input
          type="text"
          placeholder="Kategori"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {submitting ? 'Menyimpan...' : 'Simpan'}
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
      const response = await api.rewards.list();
      setData((Array.isArray(response) ? response : response?.data || []) as Reward[]);
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
    <div className="p-8 space-y-6">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">Manajemen Reward</h2>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition-all"
          >
            {showForm ? 'Tutup' : '+ Tambah'}
          </button>
        </div>

        <div className="p-8 space-y-4">
          {showForm && <RewardForm onSuccess={() => { setShowForm(false); fetchRewards(); }} />}

          <input
            type="text"
            placeholder="Cari reward..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.map(reward => (
                <div key={reward.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{reward.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{reward.description}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700`}>
                      {reward.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <p>{reward.points_required} poin</p>
                    <p>{reward.stock} tersedia</p>
                    <p>{reward.category}</p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleDelete(reward.id)}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-200 transition-all"
                    >
                      Hapus
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
      setError('Semua field harus diisi');
      return;
    }

    try {
      setSubmitting(true);
      await api.rewards.create(formData);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-bold">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nama Reward"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Kategori"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <textarea
        placeholder="Deskripsi Reward"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        rows={3}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Poin Diperlukan"
          value={formData.points_required}
          onChange={(e) => setFormData({...formData, points_required: parseInt(e.target.value) || 1})}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="1"
          required
        />
        <input
          type="number"
          placeholder="Stok Tersedia"
          value={formData.stock}
          onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 1})}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="0"
          required
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {submitting ? 'Menyimpan...' : 'Simpan'}
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
      setData((response?.data || response || []) as User[]);
    } catch (err) {
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin akan menghapus user ini?')) return;
    try {
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
    <div className="p-8 space-y-6">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">Manajemen Pengguna</h2>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition-all"
          >
            {showForm ? 'Tutup' : '+ Tambah'}
          </button>
        </div>

        <div className="p-8 space-y-4">
          {showForm && <UserForm onSuccess={() => { setShowForm(false); fetchUsers(); }} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Cari user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Role</option>
              <option value="admin">Admin</option>
              <option value="guru">Guru</option>
              <option value="siswa">Siswa</option>
            </select>
          </div>

          {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left font-bold text-gray-800">Nama</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-800">Email</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-800">Role</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-800">Kelas</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-800">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(user => (
                    <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition-all">
                      <td className="px-4 py-3 font-semibold text-gray-900">{user.name}</td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${'bg-blue-100 text-blue-700'}`}>
                          {user.role === 'admin' ? 'Admin' : user.role === 'guru' ? 'Guru' : 'Siswa'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{user.class_name || '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-200 transition-all"
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
      await api.users?.create?.(formData as any);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-purple-50 border border-purple-200 rounded-lg p-6 space-y-4">
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-bold">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nama Lengkap"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Konfirmasi Password"
          value={formData.password_confirmation}
          onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {submitting ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}


