'use client';

import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import QuizInterface, { QuizQuestion } from '@/components/QuizInterface';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SiswaStats {
  total_points?: number;
  books_read?: number;
  pages_read?: number;
  quizzes_taken?: number;
}

interface Ebook {
  id: number;
  title: string;
  author: string;
  pages: number;
  poin_per_halaman: number;
  category: string;
}

interface Reward {
  id: number;
  name: string;
  description: string;
  points_required: number;
  icon?: string;
}

interface ReadingActivity {
  id: number;
  user_id: number;
  ebook_id: number;
  status: string;
  current_page: number;
  final_page?: number;
  duration_minutes: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  ebook?: { id: number; title: string; author: string; pages: number };
}

export default function SiswaDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<SiswaStats>({});
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [readingActivities, setReadingActivities] = useState<ReadingActivity[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'siswa')) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, user?.role, router]);

  // Fetch student data
  useEffect(() => {
    if (isAuthenticated && user?.role === 'siswa') {
      const fetchData = async () => {
        try {
          setDataLoading(true);
          const [statsRes, ebooksRes, rewardsRes, activitiesRes] = await Promise.all([
            api.dashboard.siswaStats(),
            api.dashboard.siswaBooks(),
            api.rewards.list(),
            api.getMyActivities(),
          ]);
          setStats(statsRes || {});
          setEbooks(Array.isArray(ebooksRes) ? ebooksRes : 
                   ebooksRes?.data ? ebooksRes.data : []);
          setRewards(Array.isArray(rewardsRes) ? rewardsRes : 
                    rewardsRes?.data ? rewardsRes.data : []);
          setReadingActivities(Array.isArray(activitiesRes) ? activitiesRes :
                              activitiesRes?.data ? activitiesRes.data : []);
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

  // Start quiz
  const handleStartQuiz = async (ebook: Ebook) => {
    try {
      setQuizLoading(true);
      setQuizError('');
      // Fetch quiz questions for this ebook
      const questions = await api.getQuizzes(ebook.id);
      const parsedQuestions = Array.isArray(questions) ? questions : 
                             questions?.data ? questions.data : [];
      
      if (parsedQuestions.length === 0) {
        setQuizError('Kuis untuk buku ini belum tersedia');
        setQuizLoading(false);
        return;
      }
      
      setSelectedEbook(ebook);
      setQuizQuestions(parsedQuestions);
      setShowQuiz(true);
    } catch (err) {
      console.error('Error loading quiz:', err);
      setQuizError('Gagal memuat kuis. Silakan coba lagi.');
    } finally {
      setQuizLoading(false);
    }
  };

  // Handle quiz submission
  const handleQuizSubmit = async (answers: Record<number, string>, score: number) => {
    try {
      // Submit quiz to backend
      await api.submitQuiz({
        ebook_id: selectedEbook?.id,
        answers: answers,
        score: score,
      });
      
      // Close quiz and refresh stats
      setTimeout(() => {
        setShowQuiz(false);
        setSelectedEbook(null);
        setQuizQuestions([]);
        // Refresh stats to update quizzes_taken
        if (isAuthenticated && user?.role === 'siswa') {
          api.dashboard.siswaStats().then(statsRes => {
            setStats(statsRes || {});
          });
        }
      }, 2000);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setQuizError('Gagal menyimpan hasil kuis. Silakan coba lagi.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sky-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (!mounted) {
    return null;
  }

  if (user?.role !== 'siswa') {
    return null;
  }

  // If quiz is active, show quiz interface
  if (showQuiz && selectedEbook && quizQuestions.length > 0) {
    return (
      <div>
        <QuizInterface
          quizId={selectedEbook.id}
          ebookTitle={selectedEbook.title}
          questions={quizQuestions}
          onSubmit={handleQuizSubmit}
          onCancel={() => {
            setShowQuiz(false);
            setSelectedEbook(null);
            setQuizQuestions([]);
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Sidebar + Main Content Flex Container */}
      <div className="flex h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50 relative">
        {/* Hamburger Menu Button - Mobile Only */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-20 left-4 z-40 p-2 bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-lg hover:shadow-lg transition-all"
          title="Toggle Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Backdrop Overlay - Mobile Only */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-30 top-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed md:relative md:block h-[calc(100vh-80px)] w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-y-auto shadow-xl border-r border-slate-700 z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-4">SISWA</h2>
            <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
              <p className="text-xs font-semibold uppercase text-slate-300 mb-2">Total Points</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.total_points || 0}</p>
              <p className="text-xs text-slate-400 mt-2">🎯 Keep reading to earn more!</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-2">
            {[
              { id: 'overview', label: 'Progress' },
              { id: 'buku', label: 'Library' },
              { id: 'kuis', label: 'Quizzes' },
              { id: 'history', label: 'History' },
              { id: 'reward', label: 'Rewards' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-2 font-semibold rounded-lg transition-all text-sm ${
                  activeTab === item.id
                    ? 'bg-sky-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50 overflow-y-auto w-full md:w-auto">
          {/* Content Wrapper */}
          <div className="flex-1 px-6 sm:px-8 lg:px-12 py-8 w-full">
          {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
            <p className="font-bold">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Reading Progress Section */}
            <div className="card overflow-hidden shadow-xl animate-slide-up animation-delay-100 border border-slate-200">
              <div className="bg-white px-6 py-5 flex items-center gap-3 border-b border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900">📊 Reading Progress</h3>
              </div>
              <div className="p-6 space-y-8">
                {/* Books Completed */}
                <div className="space-y-3 group">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-slate-700">Books Completed</span>
                    <span className="badge text-xs">{stats.books_read || 0} / 10</span>
                  </div>
                  <div className="progress-bar group-hover:shadow-lg transition-shadow">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${((stats.books_read || 0) / 10) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">Keep reading to unlock achievements!</p>
                </div>

                {/* Pages Read */}
                <div className="space-y-3 group">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-slate-700">Pages Read</span>
                    <span className="badge badge-success text-xs">{stats.pages_read || 0} pages</span>
                  </div>
                  <div className="progress-bar group-hover:shadow-lg transition-shadow">
                    <div
                      className="progress-bar-fill bg-gradient-to-r from-emerald-500 to-emerald-400"
                      style={{ width: `${Math.min(((stats.pages_read || 0) / 1000) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">Target: 1000 pages this month</p>
                </div>

                {/* Quizzes Completed */}
                <div className="space-y-3 group">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-slate-700">Quizzes Completed</span>
                    <span className="badge badge-secondary text-xs">{stats.quizzes_taken || 0} / 20</span>
                  </div>
                  <div className="progress-bar group-hover:shadow-lg transition-shadow">
                    <div
                      className="progress-bar-fill bg-gradient-to-r from-purple-500 to-purple-400"
                      style={{ width: `${((stats.quizzes_taken || 0) / 20) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">Master all quizzes for bonus points!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Library Tab */}
        {activeTab === 'buku' && (
          <div className="animate-slide-up">
            <div className="flex items-center gap-2 mb-8">
              <h2 className="text-3xl font-bold text-slate-900">📚 E-Book Library</h2>
            </div>
            {dataLoading ? (
              <div className="card border-slate-300 p-12 text-center bg-white shadow">
                <div className="spinner mx-auto"></div>
                <p className="text-slate-600 font-semibold mt-4">Loading books...</p>
              </div>
            ) : ebooks.length === 0 ? (
              <div className="card border-slate-300 p-12 text-center bg-white shadow">
                <p className="text-lg text-slate-600">No books available yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ebooks.map((book, idx) => (
                  <div 
                    key={book.id} 
                    className="card border-slate-200 flex flex-col overflow-hidden hover:border-slate-400 animate-slide-up bg-white shadow"
                    style={{animationDelay: `${idx * 50}ms`}}
                  >
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg h-40 flex items-center justify-center mb-4 border border-slate-700 group relative overflow-hidden">
                      <div className="group-hover:scale-110 transition-transform duration-300">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-sky-100 to-cyan-100"></div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-slate-600 mb-4">{book.author}</p>
                    
                    <div className="space-y-2 mb-6 text-sm border-t border-slate-200 pt-4 flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">📄 Pages</span>
                        <span className="font-bold text-slate-900 badge">{book.pages}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">⭐ Points/Page</span>
                        <span className="font-bold text-amber-600 badge">{book.poin_per_halaman}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">🏷️ Category</span>
                        <span className="font-bold text-slate-900 badge text-xs">{book.category}</span>
                      </div>
                    </div>

                    <button className="w-full py-2 text-sm font-bold rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors">
                      📖 Start Reading
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === 'kuis' && (
          <div className="animate-slide-up">
            <div className="flex items-center gap-2 mb-8">
              <h2 className="text-3xl font-bold text-slate-900">🎯 Available Quizzes</h2>
            </div>
            {dataLoading ? (
              <div className="card border-slate-300 p-12 text-center bg-white shadow">
                <div className="spinner mx-auto"></div>
                <p className="text-slate-600 font-semibold mt-4">Loading quizzes...</p>
              </div>
            ) : ebooks.length === 0 ? (
              <div className="card border-slate-300 p-12 text-center bg-white shadow">
                <p className="text-lg text-slate-600">No quizzes available yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ebooks.map((book, idx) => (
                  <div 
                    key={book.id} 
                    className="card border-slate-200 hover:border-slate-400 animate-slide-up bg-white shadow"
                    style={{animationDelay: `${idx * 50}ms`}}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{book.title}</h3>
                        <p className="text-sm text-slate-600">by {book.author}</p>
                      </div>
                      <span className="text-3xl">🎓</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-6">Mastery: 0% • Questions: ${Math.ceil(Math.random() * 20) + 10}</p>
                    <button
                      onClick={() => handleStartQuiz(book)}
                      disabled={quizLoading}
                      className="w-full py-2.5 text-sm font-bold rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 transition-colors"
                    >
                      {quizLoading ? '⏳ Loading...' : '🚀 Start Quiz'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reading History Tab */}
        {activeTab === 'history' && (
          <div className="animate-slide-up">
            <div className="flex items-center gap-2 mb-8">
              <h2 className="text-3xl font-bold text-slate-900">📚 Reading History</h2>
            </div>
            {dataLoading ? (
              <div className="card border-slate-300 p-12 text-center bg-white shadow">
                <div className="spinner mx-auto"></div>
                <p className="text-slate-600 font-semibold mt-4">Loading history...</p>
              </div>
            ) : readingActivities.length === 0 ? (
              <div className="card border-slate-300 p-12 text-center bg-white shadow">
                <p className="text-lg text-slate-600">No reading activity yet. Start reading a book!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {readingActivities.map((activity, idx) => (
                  <div 
                    key={activity.id} 
                    className="card border-slate-200 bg-white shadow hover:shadow-lg transition-all animate-slide-up"
                    style={{animationDelay: `${idx * 50}ms`}}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-4xl">📖</span>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{activity.ebook?.title || 'Unknown Book'}</h3>
                            <p className="text-sm text-slate-600">by {activity.ebook?.author || 'Unknown Author'}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                          <div className="bg-slate-100 rounded-lg p-3 border border-slate-200">
                            <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Pages Read</p>
                            <p className="text-2xl font-bold text-slate-900">{activity.final_page || activity.current_page}</p>
                            <p className="text-xs text-slate-500">/ {activity.ebook?.pages || '?'}</p>
                          </div>
                          
                          <div className="bg-slate-100 rounded-lg p-3 border border-slate-200">
                            <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Duration</p>
                            <p className="text-2xl font-bold text-slate-900">{activity.duration_minutes}</p>
                            <p className="text-xs text-slate-500">minutes</p>
                          </div>
                          
                          <div className="bg-slate-100 rounded-lg p-3 border border-slate-200">
                            <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Status</p>
                            <p className="text-lg font-bold text-sky-600 capitalize">{activity.status}</p>
                          </div>

                          <div className="bg-slate-100 rounded-lg p-3 border border-slate-200">
                            <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Date</p>
                            <p className="text-xs font-bold text-slate-900">
                              {new Date(activity.created_at || '').toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        {activity.notes && (
                          <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <p className="text-xs text-slate-600 font-semibold mb-1">📝 Notes</p>
                            <p className="text-sm text-slate-700">{activity.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'reward' && (
          <div className="animate-slide-up">
            <div className="flex items-center gap-2 mb-8">
              <h2 className="text-3xl font-bold text-slate-900">🎁 Reward Catalog</h2>
            </div>
            {dataLoading ? (
              <div className="card border-slate-300 p-12 text-center bg-white shadow">
                <div className="spinner mx-auto"></div>
                <p className="text-slate-600 font-semibold mt-4">Loading rewards...</p>
              </div>
            ) : rewards.length === 0 ? (
              <div className="card border-slate-300 p-12 text-center bg-white shadow">
                <p className="text-lg text-slate-600">No rewards available yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map((reward, idx) => {
                  const canRedeem = (stats.total_points || 0) >= reward.points_required;
                  return (
                    <div 
                      key={reward.id}
                      className={`card border-slate-200 flex flex-col overflow-hidden transition-all duration-300 animate-slide-up bg-white shadow ${ canRedeem ? 'hover:border-sky-400 hover:shadow-lg' : 'opacity-60 grayscale'}`}
                      style={{animationDelay: `${idx * 50}ms`}}
                    >
                      <div className={`h-32 rounded-lg flex items-center justify-center text-5xl mb-4 border ${canRedeem ? 'bg-slate-100 border-slate-300' : 'bg-slate-100 border-slate-300'}`}>
                        {reward.icon || '🎁'}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{reward.name}</h3>
                      <p className="text-sm text-slate-600 mb-6 flex-1">{reward.description}</p>
                      
                      <div className="space-y-3 border-t border-slate-200 pt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700 font-semibold">⭐ Points Required</span>
                          <span className="badge">{reward.points_required}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-100 px-3 py-2 rounded-lg">
                          <span>Your Points</span>
                          <span className="font-bold text-slate-900">{stats.total_points || 0}</span>
                        </div>
                        <button
                          disabled={!canRedeem}
                          className={`w-full rounded-lg font-bold px-4 py-2.5 transition-all ${
                            canRedeem
                              ? 'bg-sky-600 text-white hover:bg-sky-700'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {canRedeem ? 'Redeem Now' : 'Insufficient Points'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}        </div>
        </div>      </div>
    </div>
  );
}
