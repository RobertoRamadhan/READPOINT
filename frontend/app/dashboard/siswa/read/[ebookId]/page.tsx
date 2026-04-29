'use client';

import { useEffect, useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

interface Ebook {
  id: number;
  title: string;
  author: string;
  pages: number;
  pdf_file?: string;
  cover_image?: string;
}

export default function ReadEbookPage({ params }: { params: Promise<{ ebookId: string }> }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const resolvedParams = use(params);
  const ebookId = parseInt(resolvedParams.ebookId);
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [loadingEbook, setLoadingEbook] = useState(true);
  const [bookText, setBookText] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [readingActivityId, setReadingActivityId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user || user.role !== 'siswa')) {
      router.push('/login');
      return;
    }

    loadEbook();
  }, [loading, isAuthenticated, user, router, ebookId]);

  const loadEbook = async () => {
    try {
      setLoadingEbook(true);
      const response = await api.ebooks.get(ebookId);
      setEbook(response?.data as Ebook || null);
      
      // Extract text from PDF
      await loadBookText(ebookId);
      
      // Start reading activity
      await startReadingActivity();
    } catch (err) {
      setError('Gagal memuat e-book');
      console.error('Error loading ebook:', err);
    } finally {
      setLoadingEbook(false);
    }
  };

  const loadBookText = async (ebookId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ebooks/${ebookId}/text`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setBookText(data?.data?.text || '');
    } catch (err) {
      console.error('Error loading book text:', err);
      setError('Gagal memuat teks buku');
    }
  };

  const startReadingActivity = async () => {
    try {
      const response = await api.startReading(ebookId);
      const data = response as any;
      setReadingActivityId(data?.data?.id || null);
    } catch (err) {
      console.error('Error starting reading activity:', err);
    }
  };

  const handleScroll = () => {
    if (contentRef.current) {
      const scrollTop = contentRef.current.scrollTop;
      const scrollHeight = contentRef.current.scrollHeight - contentRef.current.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
      
      // Update progress to backend (debounced)
      if (readingActivityId) {
        updateProgress(progress);
      }
    }
  };

  const updateProgress = async (progress: number) => {
    if (readingActivityId) {
      try {
        // Calculate approximate page based on progress
        const estimatedPage = Math.ceil((progress / 100) * (ebook?.pages || 1));
        await api.updateActivityProgress(readingActivityId, {
          current_page: estimatedPage,
          final_page: estimatedPage,
        });
      } catch (err) {
        console.error('Error updating progress:', err);
      }
    }
  };

  const completeReading = async () => {
    if (readingActivityId) {
      try {
        const estimatedPage = Math.ceil((scrollProgress / 100) * (ebook?.pages || 1));
        await api.completeReading(readingActivityId, {
          final_page: estimatedPage,
          notes: '',
        });
        router.push('/dashboard/siswa');
      } catch (err) {
        console.error('Error completing reading:', err);
      }
    }
  };

  if (loading || loadingEbook) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="w-12 h-12 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">E-book tidak ditemukan</p>
          <button
            onClick={() => router.push('/dashboard/siswa')}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-900 text-white p-4 shadow-md flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard/siswa')}
            className="flex items-center gap-2 hover:bg-amber-700 px-3 py-2 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Kembali</span>
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold">{ebook.title}</h1>
            <p className="text-sm text-amber-200">{ebook.author}</p>
          </div>
          <button
            onClick={completeReading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Selesai Baca</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-amber-200 p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Progress Membaca
            </span>
            <span className="text-sm font-bold text-amber-600">
              {Math.round(scrollProgress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-amber-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Book Content */}
      <div className="flex-1 overflow-hidden">
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto px-4 py-8"
        >
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            {bookText ? (
              <div className="prose prose-lg max-w-none">
                {bookText.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-800 leading-relaxed">
                    {paragraph || '\u00A0'}
                  </p>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Memuat teks buku...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
