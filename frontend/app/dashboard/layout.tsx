'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-sky-500 border-b border-sky-600 px-6 py-4 shadow-md sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">📖 READPOINT</h1>
          <div className="flex items-center gap-4">
            <div className="text-white">
              <p className="text-sm font-semibold">{user?.name || 'Loading...'}</p>
              <p className="text-xs opacity-90">{user?.role ? user.role.toUpperCase() : 'User'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-sky-600 hover:bg-red-50 hover:text-red-600 font-bold py-2 px-4 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
