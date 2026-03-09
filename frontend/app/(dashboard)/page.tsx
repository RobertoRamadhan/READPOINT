'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-blue-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Selamat Datang, {user?.name}!
        </h2>
        <p className="text-blue-200">Role: {user?.role}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-2">📚 Buku</h3>
          <p className="text-blue-200">Kelola koleksi buku digital</p>
        </div>

        <div className="bg-blue-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-2">🎯 Kuis</h3>
          <p className="text-blue-200">Ikuti kuis dan dapatkan poin</p>
        </div>

        <div className="bg-blue-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-2">🎁 Reward</h3>
          <p className="text-blue-200">Tukar poin dengan hadiah</p>
        </div>
      </div>
    </div>
  );
}
