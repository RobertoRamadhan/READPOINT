'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (user?.role === 'guru') {
        router.push('/dashboard/guru');
      } else if (user?.role === 'siswa') {
        router.push('/dashboard/siswa');
      }
    }
  }, [loading, isAuthenticated, user?.role, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-sky-600 text-lg">Memuat...</div>
    </div>
  );
}
