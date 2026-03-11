'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('[Login] Attempting login with email:', email);
      const response = await api.login(email, password);
      console.log('[Login] Response:', response);
      
      if (response.user && response.token) {
        console.log('[Login] Login successful, calling login() with user:', response.user);
        login(response.user, response.token);
        console.log('[Login] Redirecting to dashboard...');
        router.push('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed';
      console.error('[Login] Error:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 border-2 border-sky-200">
      <h1 className="text-3xl font-bold text-sky-600 text-center mb-8">READPOINT</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2 font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-sky-50 border-2 border-sky-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            placeholder="email@example.com"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-semibold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-sky-50 border-2 border-sky-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg transition disabled:opacity-50 shadow-md hover:shadow-lg"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>

      <p className="text-center text-gray-600 mt-6">
        Belum punya akun?{' '}
        <Link href="/register" className="text-sky-600 hover:text-sky-700 font-semibold">
          Daftar di sini
        </Link>
      </p>
    </div>
  );
}
