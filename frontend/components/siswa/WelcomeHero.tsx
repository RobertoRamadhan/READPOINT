'use client';

import React from 'react';

interface SiswaStats {
  total_points: number;
  books_read: number;
  pages_read: number;
  quizzes_taken: number;
}

interface WelcomeHeroProps {
  stats: SiswaStats | null;
  userName?: string;
}

export default function WelcomeHero({ stats, userName }: WelcomeHeroProps) {
  return (
    <div className="mb-12 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 rounded-lg shadow-lg p-8 md:p-12">
      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-black mb-2 !text-white">Selamat Datang, {userName || 'Siswa'}!</h2>
        <p className="mb-8 font-semibold max-w-2xl leading-relaxed text-lg !text-white">
          Lanjutkan perjalanan literasi Anda, baca lebih banyak buku, selesaikan quiz, dan kumpulkan rewards eksklusif.
        </p>

        {/* Quick Action Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-2">
          <StatCard label="Poin Saya" value={stats?.total_points ?? 0} />
          <StatCard label="Buku Dibaca" value={stats?.books_read ?? 0} />
          <StatCard label="Halaman" value={stats?.pages_read ?? 0} />
          <StatCard label="Quiz Selesai" value={stats?.quizzes_taken ?? 0} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-white/40 rounded-lg p-4 text-center hover:bg-gray-50 transition-all">
      <p className="text-xs text-gray-600 font-semibold mb-1">{label}</p>
      <p className="text-2xl font-black text-blue-600">{value}</p>
    </div>
  );
}
