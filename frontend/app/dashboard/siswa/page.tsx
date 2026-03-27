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
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-400 to-sky-500 rounded-lg p-6 mb-8 shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Selamat Datang, {user?.name}! 👋</h1>
            <p className="text-sky-100">Kelas: {user?.class_name || 'Belum diatur'}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white">⭐ {stats.total_points || 0}</p>
            <p className="text-sky-100 text-sm">Total Poin Kamu</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Buku Selesai</p>
              <p className="text-3xl font-bold text-sky-600">{stats.books_read || 0}</p>
            </div>
            <div className="text-4xl">📚</div>
          </div>
        </div>

        <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Halaman Dibaca</p>
              <p className="text-3xl font-bold text-sky-600">{stats.pages_read || 0}</p>
            </div>
            <div className="text-4xl">📖</div>
          </div>
        </div>

        <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Kuis Diikuti</p>
              <p className="text-3xl font-bold text-sky-600">{stats.quizzes_taken || 0}</p>
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
          onClick={() => setActiveTab('reward')}
          className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
            activeTab === 'reward'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-gray-600 hover:text-sky-500'
          }`}
        >
          🎁 Reward
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
      </div>

      {/* Progres Saya Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-bold text-sky-700 mb-4">Progres Kamu</h3>
            <p className="text-gray-600">Terus tingkatkan pencapaian membacamu! 📈</p>
          </div>
        </div>
      )}

      {/* Buku Tersedia Tab */}
      {activeTab === 'buku' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Buku Tersedia</h2>
          {dataLoading ? (
            <p className="text-gray-600">Memuat buku...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ebooks.map((book) => (
                <div key={book.id} className="bg-white border-2 border-sky-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                  <div className="bg-sky-100 h-40 flex items-center justify-center">
                    <span className="text-6xl">📚</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-sky-700 mb-2">{book.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{book.author}</p>
                    <div className="flex justify-between items-center text-sm mb-4">
                      <span className="text-gray-600">{book.pages} halaman</span>
                      <span className="text-sky-600 font-bold">{book.poin_per_halaman} poin/hal</span>
                    </div>
                    <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded-lg transition">
                      Mulai Membaca
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
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Reward Tersedia</h2>
          {dataLoading ? (
            <p className="text-gray-600">Memuat reward...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <div key={reward.id} className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
                  <div className="text-5xl mb-4">{reward.icon || '🎁'}</div>
                  <h3 className="text-lg font-bold text-sky-700 mb-2">{reward.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sky-600 font-bold">{reward.points_required} poin</span>
                    <button className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition">
                      Tukar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Kuis Tab */}
      {activeTab === 'kuis' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Kuis Tersedia</h2>
          
          {quizError && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {quizError}
            </div>
          )}

          {dataLoading || quizLoading ? (
            <p className="text-gray-600">Memuat kuis...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ebooks.map((book) => (
                <div key={book.id} className="bg-white border-2 border-sky-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                  <div className="bg-sky-100 h-40 flex items-center justify-center">
                    <span className="text-6xl">🎯</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-sky-700 mb-2">{book.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{book.author}</p>
                    <div className="text-sm text-gray-600 mb-4">
                      <p>📖 {book.pages} halaman</p>
                      <p>⭐ {book.poin_per_halaman} poin/halaman</p>
                    </div>
                    <button
                      onClick={() => handleStartQuiz(book)}
                      className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded-lg transition disabled:bg-sky-300 disabled:cursor-not-allowed"
                      disabled={quizLoading}
                    >
                      {quizLoading ? 'Memuat...' : 'Mulai Kuis'}
                    </button>
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
