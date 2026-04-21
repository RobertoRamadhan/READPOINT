'use client';

import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SiswaStats {
  total_points: number;
  books_read: number;
  pages_read: number;
  quizzes_taken: number;
}

interface Ebook {
  id: number;
  title: string;
  author: string;
  pages: number;
  poin_per_halaman: number;
  category: string;
  cover_image?: string;
}

interface Reward {
  id: number;
  name: string;
  description: string;
  points_required: number;
  stock: number;
  image_url?: string;
}

export default function SiswaDashboard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<SiswaStats | null>(null);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'ebooks' | 'rewards'>('overview');
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || loading || !isAuthenticated) return;

    if (!user || user.role !== 'siswa') {
      router.push('/login');
      return;
    }

    loadDashboardData();
  }, [mounted, loading, isAuthenticated, user, router]);

  const loadDashboardData = async () => {
    try {
      setLoadingData(true);
      setError(null);

      // Load stats - siswaStats returns: { total_points: X, books_read: Y, ... }
      const statsRes = await api.dashboard.siswaStats();
      if (statsRes) {
        // Backend returns the stats directly, not wrapped in data
        const statsData = statsRes as unknown as SiswaStats;
        setStats(statsData);
      }

      // Load ebooks - siswaBooks returns: { data: [...], pagination: {...} }
      const ebooksRes = await api.dashboard.siswaBooks();
      if (ebooksRes?.data) {
        const ebooksArray = Array.isArray(ebooksRes.data) 
          ? ebooksRes.data 
          : (ebooksRes.data as Record<string, unknown>)?.data && Array.isArray((ebooksRes.data as Record<string, unknown>).data)
            ? (ebooksRes.data as Record<string, unknown>).data as Ebook[]
            : [];
        setEbooks(ebooksArray as Ebook[]);
      }

      // Load rewards - rewards.list returns: [{ ... }, ...]
      const rewardsRes = await api.rewards.list();
      if (rewardsRes?.data) {
        const rewardsArray = Array.isArray(rewardsRes.data) 
          ? rewardsRes.data 
          : (rewardsRes.data as Record<string, unknown>)?.data && Array.isArray((rewardsRes.data as Record<string, unknown>).data)
            ? (rewardsRes.data as Record<string, unknown>).data as Reward[]
            : [];
        setRewards(rewardsArray as Reward[]);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(errorMsg);
      console.error('[Dashboard] Error:', errorMsg);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.warn('[Dashboard] Logout failed:', error);
      // Force redirect anyway
      router.push('/login');
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'siswa') {
    return null; // Redirect handled above
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Welcome back, {user.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-center text-gray-600">
            Keep reading and earning points to unlock rewards
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            label="Total Points"
            value={stats?.total_points ?? 0}
            icon="⭐"
            color="from-slate-500 to-slate-600"
          />
          <StatCard
            label="Books Read"
            value={stats?.books_read ?? 0}
            icon="📚"
            color="from-slate-500 to-slate-600"
          />
          <StatCard
            label="Pages Read"
            value={stats?.pages_read ?? 0}
            icon="📖"
            color="from-slate-500 to-slate-600"
          />
          <StatCard
            label="Quizzes Taken"
            value={stats?.quizzes_taken ?? 0}
            icon="✅"
            color="from-slate-500 to-slate-600"
          />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8 p-1 flex space-x-1">
          {(['overview', 'ebooks', 'rewards'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded font-medium text-sm transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'ebooks' && `E-Books (${ebooks.length})`}
              {tab === 'rewards' && `Rewards (${rewards.length})`}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {loadingData ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 text-sm">Loading content...</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <p className="text-gray-600 mb-4">Your dashboard is all set up!</p>
                  <p className="text-sm text-gray-500">
                    Browse e-books to start reading and earning points. Complete quizzes to earn bonus points and unlock rewards.
                  </p>
                </div>
              </div>
            )}

            {/* E-Books Tab */}
            {activeTab === 'ebooks' && (
              <div>
                {ebooks.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <p className="text-gray-600">No e-books available at the moment</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {ebooks.map((ebook) => (
                      <div key={ebook.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition">
                        <div className="aspect-video bg-gradient-to-br from-blue-200 to-indigo-200 flex items-center justify-center text-4xl">
                          📕
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{ebook.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{ebook.author}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                            <span>{ebook.pages} pages</span>
                            <span className="font-medium text-blue-600">{ebook.poin_per_halaman} pts/page</span>
                          </div>
                          <Link
                            href={`/dashboard/siswa/read/${ebook.id}`}
                            className="w-full inline-block text-center py-2 bg-blue-600 text-white rounded font-medium text-sm hover:bg-blue-700 transition"
                          >
                            Read Now
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Rewards Tab */}
            {activeTab === 'rewards' && (
              <div>
                {rewards.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <p className="text-gray-600">No rewards available at the moment</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rewards.map((reward) => (
                      <div key={reward.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition">
                        <div className="h-40 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-5xl">
                          🎁
                        </div>
                        <div className="p-6">
                          <h3 className="font-semibold text-gray-900 mb-2">{reward.name}</h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{reward.description}</p>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Cost:</span>
                              <span className="font-semibold text-purple-600">{reward.points_required} points</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Stock:</span>
                              <span className="font-semibold">{reward.stock} available</span>
                            </div>
                            <button
                              disabled={reward.stock <= 0 || (stats?.total_points ?? 0) < reward.points_required}
                              className={`w-full mt-4 py-2 rounded font-medium transition ${
                                reward.stock > 0 && (stats?.total_points ?? 0) >= reward.points_required
                                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {reward.stock <= 0 ? 'Out of Stock' : 'Redeem'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number | string; icon: string; color: string }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-lg shadow-lg p-6 text-white`}>
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-white/80 text-sm font-medium mb-1">{label}</p>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}
