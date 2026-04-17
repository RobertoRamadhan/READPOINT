'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = () => setDropdownOpen(false);
    
    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [dropdownOpen]);

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

  const roleIcon = mounted && user?.role ? roleIcons[user.role] || '👤' : '👤';
  const roleLabel = mounted && user?.role ? roleLabels[user.role] || 'User' : 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 sticky top-0 z-50 w-full shadow-lg">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className="font-bold text-xl text-white flex items-center gap-2">
                <span className="text-2xl">📚</span>
                READPOINT
              </div>
            </div>

            {/* User Section - Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-white transition-all duration-200"
              >
                {mounted ? (
                  <>
                    <span className="text-lg">{roleIcon}</span>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold">{user?.name || 'User'}</p>
                      <p className="text-xs text-slate-300">{roleLabel}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-lg">👤</span>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold">User</p>
                      <p className="text-xs text-slate-300">Loading...</p>
                    </div>
                  </>
                )}
                <svg
                  className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 z-10">
                  <div className="p-4 border-b border-slate-700">
                    {mounted ? (
                      <>
                        <p className="text-sm font-bold text-white">{roleIcon} {user?.name || 'User'}</p>
                        <p className="text-xs text-slate-400 mt-1">{user?.email || 'user@readpoint.id'}</p>
                        <p className="text-xs text-slate-500 mt-2">{roleLabel}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-white">👤 User</p>
                        <p className="text-xs text-slate-400 mt-1">Loading...</p>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-slate-700/50 font-semibold transition-colors rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-slate-200 mt-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-6 text-center text-sm">
          <p>© 2026 READPOINT - Platform Literasi Digital Indonesia</p>
        </div>
      </footer>
    </div>
  );
}
