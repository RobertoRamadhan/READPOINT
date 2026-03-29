'use client';

import React, { useState, useEffect } from 'react';

interface PDFReaderProps {
  ebookId: number;
  title: string;
  totalPages: number;
  onProgress?: (page: number) => void;
}

export default function PDFReader({ ebookId, title, totalPages, onProgress }: PDFReaderProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    // Simulate PDF loading
    setTimeout(() => setIsLoading(false), 800);
  }, [ebookId]);

  useEffect(() => {
    if (onProgress) {
      onProgress(currentPage);
    }
  }, [currentPage, onProgress]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleBookmark = () => {
    setBookmarks(prev =>
      prev.includes(currentPage)
        ? prev.filter(p => p !== currentPage)
        : [...prev, currentPage]
    );
  };

  const progress = Math.round((currentPage / totalPages) * 100);
  const isBookmarked = bookmarks.includes(currentPage);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-500 text-white px-4 sm:px-6 py-4 sm:py-5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold truncate animate-slideInLeft">📖 {title}</h1>
            <p className="text-xs sm:text-sm text-sky-50 mt-1 font-medium">
              Halaman <span className="bg-white bg-opacity-20 px-2 py-0.5 rounded">{currentPage}</span> dari <span className="bg-white bg-opacity-20 px-2 py-0.5 rounded">{totalPages}</span>
            </p>
          </div>
          <button
            onClick={toggleBookmark}
            className={`p-3 rounded-xl transition-all transform hover:scale-110 ${
              isBookmarked
                ? 'bg-yellow-300 text-yellow-900 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            title={isBookmarked ? 'Hapus bookmark' : 'Tambah bookmark'}
          >
            {isBookmarked ? '⭐' : '☆'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-4">
        {isLoading ? (
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
            <p className="text-sky-600 font-semibold text-lg animate-pulse">Memuat halaman {currentPage}...</p>
          </div>
        ) : (
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* PDF Placeholder with improved styling */}
            <div className="bg-gradient-to-b from-sky-100 via-cyan-50 to-white p-6 sm:p-12 min-h-96 flex flex-col items-center justify-center">
              <div className="text-7xl mb-6 drop-shadow-lg">📄</div>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-3">Halaman {currentPage}</p>
              <p className="text-slate-600 text-center max-w-md mb-8 leading-relaxed">
                Konten PDF akan ditampilkan di sini dengan library PDF.js untuk rendering yang optimal dan pengalaman membaca terbaik.
              </p>
              <div className="mt-6 p-6 bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl w-full sm:max-w-md border border-sky-200">
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <footer className="bg-white/80 backdrop-blur-md border-t-2 border-sky-100 px-4 sm:px-6 py-4 sm:py-6 shadow-xl">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-sky-100 rounded-full h-3 overflow-hidden shadow-sm">
              <div
                className="bg-gradient-to-r from-sky-500 to-cyan-400 h-3 rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs sm:text-sm text-slate-600 font-medium">{progress}% Selesai</p>
              <p className="text-xs sm:text-sm text-slate-500">
                {currentPage === totalPages ? (
                  <span className="text-green-600 font-semibold">✓ Buku Selesai!</span>
                ) : null}
              </p>
            </div>
          </div>

          {/* Page Input */}
          <div className="flex items-center gap-2 sm:gap-3 justify-center">
            <label className="text-sm font-semibold text-slate-700 hidden sm:block">Ke halaman:</label>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={handlePageChange}
              className="w-20 sm:w-24 px-3 py-2.5 rounded-lg border-2 border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 focus:outline-none text-center font-semibold text-slate-700 bg-sky-50/50 transition-all"
            />
            <span className="text-sm font-semibold text-slate-600">/ {totalPages}</span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2 sm:gap-3 justify-between items-center">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex-1 sm:flex-none bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold px-3 sm:px-6 py-2.5 rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 shadow-md hover:shadow-lg"
            >
              <span className="hidden sm:inline">← Sebelumnya</span>
              <span className="sm:hidden">←</span>
            </button>

            {/* Quick page navigation */}
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, currentPage - 2) + i;
                if (page > totalPages) return null;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-semibold transition-all transform hover:scale-110 ${
                      page === currentPage
                        ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg'
                        : 'bg-sky-50 text-slate-700 hover:bg-sky-100 border border-sky-200'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex-1 sm:flex-none bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold px-3 sm:px-6 py-2.5 rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 shadow-md hover:shadow-lg"
            >
              <span className="hidden sm:inline">Selanjutnya →</span>
              <span className="sm:hidden">→</span>
            </button>
          </div>

          {/* Bookmarks Section */}
          {bookmarks.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm font-semibold text-yellow-800 mb-2">⭐ Bookmark Anda ({bookmarks.length}):</p>
              <div className="flex flex-wrap gap-2">
                {bookmarks.map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white border border-yellow-300 text-yellow-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-yellow-100 transition-all transform hover:scale-105"
                  >
                    Hal. {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
