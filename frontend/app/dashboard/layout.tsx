'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    logout();
    router.push('/login');
  };

  const roleIcons: { [key: string]: string } = {
    siswa: '👨‍🎓',
    guru: '👨‍🏫',
    admin: '⚙️',
  };

  const roleLabels: { [key: string]: string } = {
    siswa: 'Siswa',
    guru: 'Guru',
    admin: 'Admin',
  };

  const roleIcon = roleIcons[user?.role || ''] || '👤';
  const roleLabel = roleLabels[user?.role || ''] || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-sky-600 text-white shadow-lg sticky top-0 z-50 w-full">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className="text-3xl">📚</div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">READPOINT</h1>
                <p className="text-xs sm:text-sm text-sky-100">Dashboard</p>
              </div>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                <p className="text-xs text-sky-100">
                  {roleIcon} {roleLabel}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="bg-sky-500 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                title="Logout"
              >
                🚪
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-6 text-center text-slate-600 text-sm">
          <p>© 2026 READPOINT - Platform Literasi Digital Indonesia</p>
        </div>
      </footer>
    </div>
  );
}
