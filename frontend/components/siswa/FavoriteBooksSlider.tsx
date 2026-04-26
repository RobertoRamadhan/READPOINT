'use client';

import React, { useState, useEffect } from 'react';
import { LazyImage } from '@/components/shared';

interface Ebook {
  id: number;
  title: string;
  author: string;
  cover_image?: string;
  category: string;
  pdf_file?: string;
}

interface FavoriteBooksSliderProps {
  books: Ebook[];
  onBookClick?: (bookId: number) => void;
}

export default function FavoriteBooksSlider({ books, onBookClick }: FavoriteBooksSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    if (books.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, books.length - itemsPerPage);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 4000); // Auto-slide every 4 seconds

    return () => clearInterval(interval);
  }, [books.length, itemsPerPage]);

  if (books.length === 0) {
    return null;
  }

  const maxIndex = Math.max(0, books.length - itemsPerPage);
  const visibleBooks = books.slice(currentIndex, currentIndex + itemsPerPage);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-black text-white mb-4">📚 Buku Populer</h2>
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ◀
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ▶
        </button>

        {/* Slider Container */}
        <div className="overflow-hidden mx-12">
          <div 
            className="flex transition-transform duration-500 ease-in-out gap-4"
            style={{ transform: `translateX(0)` }}
          >
            {visibleBooks.map((book) => (
              <div
                key={book.id}
                className="w-64 max-w-sm bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer transform hover:scale-105 flex flex-col"
                onClick={() => onBookClick?.(book.id)}
              >
                <div className="aspect-[2/3] bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 relative overflow-hidden flex-shrink-0">
                  {book.cover_image ? (
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl opacity-50">📕</div>
                  )}
                </div>
                <div className="p-3 flex flex-col flex-shrink-0">
                  <h3 className="font-black text-gray-900 text-sm line-clamp-1 mb-1">{book.title}</h3>
                  <p className="text-xs text-gray-600">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: Math.ceil(books.length / itemsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * itemsPerPage)}
              className={`w-2 h-2 rounded-full transition-all ${
                Math.floor(currentIndex / itemsPerPage) === index ? 'bg-blue-600 w-4' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
