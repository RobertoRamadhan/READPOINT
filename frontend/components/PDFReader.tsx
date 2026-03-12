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

  useEffect(() => {
    // Simulate PDF loading
    setTimeout(() => setIsLoading(false), 1000);
  }, [ebookId]);

  useEffect(() => {
    // Call parent callback when page changes
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

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-sky-600 text-white p-4 shadow-lg flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="text-sm">
          Halaman {currentPage} dari {totalPages}
        </div>
      </div>

      {/* PDF Viewer Area */}
      <div className="flex-1 flex items-center justify-center bg-gray-800 p-4 overflow-auto">
        {isLoading ?  (
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Memuat halaman {currentPage}...</p>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl w-full">
            {/* Placeholder for actual PDF rendering */}
            <div className="h-96 bg-gray-50 border-2 border-gray-300 rounded flex items-center justify-center mb-6">
              <div className="text-center">
                <p className="text-gray-600 text-lg mb-4">📄 Halaman {currentPage}</p>
                <p className="text-gray-500 text-sm">
                  Integrasi dengan PDF.js untuk rendering PDF yang lebih baik
                </p>
              </div>
            </div>

            {/* Text Content Preview */}
            <div className="text-gray-700 leading-relaxed text-justify">
              <p className="mb-4">
                Ini adalah tampilan pembaca e-book. Dalam implementasi sesungguhnya, konten PDF akan ditampilkan di sini.
              </p>
              <p className="mb-4">
                Anda dapat menggunakan library seperti PDF.js untuk merender dokumen PDF secara real-time.
              </p>
              <p>
                Fitur ini akan melacak progres membaca Anda secara otomatis.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controls Footer */}
      <div className="bg-gray-800 text-white p-6 border-t-2 border-sky-600">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentPage / totalPages) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {Math.round((currentPage / totalPages) * 100)}% selesai
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="bg-sky-600 hover:bg-sky-700 disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              ← Halaman Sebelumnya
            </button>

            <div className="flex items-center gap-2">
              <label className="text-sm">Ke halaman:</label>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={handlePageChange}
                className="w-16 px-2 py-2 rounded bg-gray-700 text-white border border-sky-500 text-center"
              />
              <span className="text-sm">/ {totalPages}</span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="bg-sky-600 hover:bg-sky-700 disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Halaman Selanjutnya →
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-4 text-sm text-gray-400 flex justify-between">
            <div>Durasi: Sesuai kecepatan membaca Anda</div>
            {currentPage === totalPages && (
              <div className="text-green-400 font-semibold">✓ Buku Selesai!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
