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
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!mounted) {
    return null;
  }

  const roleLabels: { [key: string]: string } = {
    siswa: 'Siswa',
    guru: 'Guru',
    admin: 'Admin',
  };

  const roleLabel = mounted && user?.role ? roleLabels[user.role] || 'User' : 'User';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 border-b border-amber-900 shadow-md">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">
                READPOINT
              </h1>
            </div>

            {/* User Info & Menu */}
            <div className="flex items-center gap-3">
              {user?.role === 'siswa' ? (
                <>
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-semibold text-white">{mounted ? user?.name : 'Memuat...'}</span>
                    <span className="text-xs text-amber-100">{roleLabel}</span>
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-amber-600 text-white transition-colors duration-200"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-800 to-amber-900 overflow-hidden flex items-center justify-center">
                        {user?.profile_photo_url ? (
                          <img
                            src={user.profile_photo_url}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-sm font-bold">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push('/dashboard/siswa/profile');
                            setDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          Pengaturan Profil
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLogout();
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Keluar
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-amber-600 text-white transition-colors duration-200"
                  title="Keluar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Keluar</span>
                </button>
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
      <footer className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 border-t border-amber-900 mt-auto w-full">
        <div className="px-4 sm:px-6 lg:px-8 py-6 text-center text-sm">
          <p className="text-white !important" style={{ color: 'white' }}>© 2026 READPOINT - Platform Literasi Digital Indonesia</p>
        </div>
      </footer>
    </div>
  );
}
