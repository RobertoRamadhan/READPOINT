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

  const roleLabel = mounted && user?.role ? roleLabels[user.role] || 'User' : 'User';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                READPOINT
              </h1>
            </div>

            {/* Center - User Info */}
            <div className="hidden sm:flex items-center gap-2 text-slate-700">
              <span className="text-sm font-semibold">{mounted ? user?.name : 'Loading...'}</span>
              <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                {roleLabel}
              </span>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 px-2 py-2 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-sm font-bold">
                  {mounted ? user?.name?.charAt(0).toUpperCase() : 'U'}
                </div>
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
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 z-10 animate-slide-up">
                  <div className="p-4 border-b border-slate-200">
                    <p className="text-sm font-bold text-slate-900">{mounted ? user?.name : 'User'}</p>
                    <p className="text-xs text-slate-500 mt-1">{mounted ? user?.email : 'Loading...'}</p>
                    <p className="text-xs text-blue-600 font-semibold mt-2">{roleLabel}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-semibold transition-colors rounded-b-lg"
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-slate-600">
          <p>© 2026 READPOINT - Platform Literasi Digital Indonesia</p>
        </div>
      </footer>
    </div>
  );
}
