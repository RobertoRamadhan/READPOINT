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

export default function SiswaDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
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
          const [statsRes, ebooksRes, rewardsRes] = await Promise.all([
            api.dashboard.siswaStats(),
            api.dashboard.siswaBooks(),
            api.rewards.list(),
          ]);
          setStats(statsRes || {});
          setEbooks(Array.isArray(ebooksRes) ? ebooksRes : 
                   ebooksRes?.data ? ebooksRes.data : []);
          setRewards(Array.isArray(rewardsRes) ? rewardsRes : 
                    rewardsRes?.data ? rewardsRes.data : []);
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
    <div className="w-full space-y-0">
      {/* Hero Header - Full Width */}
      <div className="w-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 p-6 md:p-8 lg:p-12 shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 md:w-48 lg:w-64 h-32 md:h-48 lg:h-64 bg-white opacity-10 rounded-full -mr-8 md:-mr-16 lg:-mr-20 -mt-8 md:-mt-16 lg:-mt-20"></div>
        <div className="absolute bottom-0 left-0 w-24 md:w-32 lg:w-48 h-24 md:h-32 lg:h-48 bg-white opacity-10 rounded-full -ml-4 md:-ml-8 lg:-ml-10 -mb-4 md:-mb-8 lg:-mb-10"></div>
        <div className="relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-3 md:gap-4 lg:gap-6">
            <div className="flex-1">
              <p className="text-blue-100 text-xs md:text-sm font-bold mb-1 md:mb-2 lg:mb-3 tracking-wide">👋 SELAMAT DATANG KEMBALI,</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-1 md:mb-2 lg:mb-3 drop-shadow-lg line-clamp-2">{user?.name}!</h1>
              <p className="text-blue-100 text-xs md:text-sm lg:text-base flex items-center gap-2 font-semibold flex-wrap">
                <span>🎓</span> Kelas: <span className="text-white font-bold">{user?.class_name || 'Belum diatur'}</span>
              </p>
            </div>
            <div className="bg-white/25 backdrop-blur-xl rounded-lg md:rounded-2xl p-4 md:p-6 lg:p-8 min-w-fit border-2 border-white/30 shadow-lg md:shadow-xl">
              <p className="text-blue-100 text-xs font-bold mb-1 md:mb-2 lg:mb-3 tracking-wide text-center">TOTAL POIN</p>
              <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg text-center">⭐ {stats.total_points || 0}</p>
              <p className="text-blue-100 text-xs mt-1 md:mt-2 lg:mt-3 font-semibold animate-pulse text-center">🔥 Terus kumpulkan poin!</p>
            </div>
          </div>
        </div>
      </div>

      {/* All other content with padding */}
      <div className="w-full space-y-8 px-4 sm:px-6 lg:px-8">

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-slide-up">
          <p className="font-semibold">⚠️ Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg md:rounded-xl p-4 md:p-6 lg:p-8 hover:shadow-lg hover:scale-105 transition duration-300">
          <div className="flex items-center justify-between gap-3 md:gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-blue-600 text-xs font-bold mb-1 md:mb-2 tracking-wide">📚 BUKU SELESAI</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-blue-700 drop-shadow-sm">{stats.books_read || 0}</p>
              <p className="text-xs text-blue-500 mt-1 font-semibold">Terus tingkatkan!</p>
            </div>
            <div className="text-4xl md:text-5xl opacity-30 hover:opacity-100 transition-opacity shrink-0">📕</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-lg md:rounded-xl p-4 md:p-6 lg:p-8 hover:shadow-lg hover:scale-105 transition duration-300">
          <div className="flex items-center justify-between gap-3 md:gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-purple-600 text-xs font-bold mb-1 md:mb-2 tracking-wide">📖 HALAMAN DIBACA</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-purple-700 drop-shadow-sm">{stats.pages_read || 0}</p>
              <p className="text-xs text-purple-500 mt-1 font-semibold">Halaman total</p>
            </div>
            <div className="text-4xl md:text-5xl opacity-30 hover:opacity-100 transition-opacity shrink-0">📄</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-lg md:rounded-xl p-4 md:p-6 lg:p-8 hover:shadow-lg hover:scale-105 transition duration-300 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between gap-3 md:gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-amber-600 text-xs font-bold mb-1 md:mb-2 tracking-wide">🎯 KUIS DIIKUTI</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-700 drop-shadow-sm">{stats.quizzes_taken || 0}</p>
              <p className="text-xs text-amber-500 mt-1 font-semibold">Sempurna!</p>
            </div>
            <div className="text-4xl md:text-5xl opacity-30 hover:opacity-100 transition-opacity shrink-0">✅</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b-2 border-slate-200 flex gap-1 overflow-x-auto bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-2 w-full">
        {[
          { id: 'overview', label: '📊 Progres Saya' },
          { id: 'buku', label: '📚 Buku Tersedia' },
          { id: 'reward', label: '🎁 Reward' },
          { id: 'kuis', label: '🎯 Kuis' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 md:px-5 lg:px-6 py-2 md:py-3 font-bold text-xs md:text-sm lg:text-base transition-all whitespace-nowrap rounded-lg ${
              activeTab === tab.id
                ? 'text-white bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Progres Saya Tab */}
      {activeTab === 'overview' && (
        <div className="animate-slide-up space-y-4 md:space-y-6">
          <div className="card p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">📈 Progres Membaca Anda</h3>
            <div className="space-y-4 md:space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600 font-medium text-sm md:text-base">Buku Selesai</span>
                  <span className="text-sky-600 font-bold text-sm md:text-base">{stats.books_read || 0} / 10</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 md:h-3">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-blue-600 h-2 md:h-3 rounded-full transition-all duration-500"
                    style={{ width: `${((stats.books_read || 0) / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600 font-medium text-sm md:text-base">Halaman Dibaca</span>
                  <span className="text-sky-600 font-bold text-sm md:text-base">{stats.pages_read || 0} halaman</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 md:h-3">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 md:h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(((stats.pages_read || 0) / 1000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600 font-medium text-sm md:text-base">Kuis Selesai</span>
                  <span className="text-sky-600 font-bold text-sm md:text-base">{stats.quizzes_taken || 0} / 20</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 md:h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 md:h-3 rounded-full transition-all duration-500"
                    style={{ width: `${((stats.quizzes_taken || 0) / 20) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <h3 className="text-xl font-bold text-slate-800 mb-3">💡 Tips untuk Sukses</h3>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-xl">📖</span>
                <span>Baca minimal 1 buku seminggu untuk mendapat bonus poin</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">🎯</span>
                <span>Kerjakan kuis setelah membaca untuk mengasah pemahaman</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">⭐</span>
                <span>Tukarkan poin Anda dengan reward menarik di menu Reward</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Buku Tersedia Tab */}
      {activeTab === 'buku' && (
        <div className="animate-slide-up">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">📚 Katalog E-Book</h2>
          {dataLoading ? (
            <div className="card p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
              <p className="text-slate-600">Memuat koleksi buku...</p>
            </div>
          ) : ebooks.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-slate-600 text-lg">📭 Belum ada buku tersedia</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ebooks.map((book) => (
                <div key={book.id} className="card-hover overflow-hidden flex flex-col">
                  <div className="bg-gradient-to-br from-sky-300 to-blue-400 h-48 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-7xl drop-shadow-lg">📚</span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-slate-500 mb-4">Oleh: {book.author}</p>
                    
                    <div className="space-y-2 mb-4 text-sm text-slate-600">
                      <div className="flex justify-between items-center">
                        <span>📄 Halaman</span>
                        <span className="font-semibold text-slate-700">{book.pages}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>⭐ Per Halaman</span>
                        <span className="font-semibold text-amber-600">{book.poin_per_halaman} poin</span>
                      </div>
                    </div>

                    <button className="mt-auto btn-primary w-full">
                      🚀 Mulai Membaca
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reward Tab */}
      {activeTab === 'reward' && (
        <div className="animate-slide-up">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">🎁 Catalog Reward</h2>
          {dataLoading ? (
            <div className="card p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
              <p className="text-slate-600">Memuat reward...</p>
            </div>
          ) : rewards.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-slate-600 text-lg">📭 Belum ada reward tersedia</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => {
                const canRedeem = (stats.total_points || 0) >= reward.points_required;
                return (
                  <div key={reward.id} className={`card-hover p-6 flex flex-col ${!canRedeem ? 'opacity-60' : ''}`}>
                    <div className="text-6xl mb-4">{reward.icon || '🎁'}</div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{reward.name}</h3>
                    <p className="text-slate-600 text-sm mb-4 flex-1">{reward.description}</p>
                    
                    <div className="space-y-3 border-t border-slate-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">Diperlukan:</span>
                        <span className="text-lg font-bold gradient-text">{reward.points_required} ⭐</span>
                      </div>
                      <button
                        disabled={!canRedeem}
                        className={`w-full py-3 rounded-lg font-semibold transition-all ${
                          canRedeem
                            ? 'btn-primary'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {canRedeem ? '🎉 Tukar Sekarang' : '🔒 Belum Cukup'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Kuis Tab */}
      {activeTab === 'kuis' && (
        <div className="animate-slide-up">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">🎯 Kuis Tersedia</h2>
          
          {quizError && (
            <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-700 rounded-lg">
              <p className="font-semibold">⚠️ Perhatian</p>
              <p className="text-sm mt-1">{quizError}</p>
            </div>
          )}

          {dataLoading || quizLoading ? (
            <div className="card p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
              <p className="text-slate-600">Memuat kuis...</p>
            </div>
          ) : ebooks.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-slate-600 text-lg">📭 Belum ada kuis tersedia</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ebooks.map((book) => (
                <div key={book.id} className="card-hover overflow-hidden flex flex-col">
                  <div className="bg-gradient-to-br from-amber-300 to-orange-400 h-48 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-7xl drop-shadow-lg">🎯</span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-slate-500 mb-4">Oleh: {book.author}</p>
                    
                    <div className="space-y-2 mb-4 text-sm text-slate-600">
                      <div className="flex justify-between items-center">
                        <span>📖 Halaman</span>
                        <span className="font-semibold text-slate-700">{book.pages}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>⭐ Poin/Halaman</span>
                        <span className="font-semibold text-amber-600">{book.poin_per_halaman}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartQuiz(book)}
                      disabled={quizLoading}
                      className="mt-auto btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {quizLoading ? '⏳ Memuat...' : '🚀 Mulai Kuis'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
