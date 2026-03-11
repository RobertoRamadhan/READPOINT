'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, user?.role, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sky-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-400 to-sky-500 rounded-lg p-6 mb-8 shadow-md">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Admin</h1>
        <p className="text-sky-100">Kelola sistem READPOINT secara keseluruhan</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-sky-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'overview'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-gray-600 hover:text-sky-500'
          }`}
        >
          📊 Ringkasan
        </button>
        <button
          onClick={() => setActiveTab('ebooks')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'ebooks'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-gray-600 hover:text-sky-500'
          }`}
        >
          📚 E-Book
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'rewards'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-gray-600 hover:text-sky-500'
          }`}
        >
          🎁 Reward
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'users'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-gray-600 hover:text-sky-500'
          }`}
        >
          👥 Pengguna
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Siswa</p>
                  <p className="text-3xl font-bold text-sky-600">245</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </div>

            <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Guru</p>
                  <p className="text-3xl font-bold text-sky-600">12</p>
                </div>
                <div className="text-4xl">🎓</div>
              </div>
            </div>

            <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total E-Book</p>
                  <p className="text-3xl font-bold text-sky-600">87</p>
                </div>
                <div className="text-4xl">📚</div>
              </div>
            </div>

            <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Reward</p>
                  <p className="text-3xl font-bold text-sky-600">42</p>
                </div>
                <div className="text-4xl">🎁</div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-sky-700 mb-4">📈 Statistik Aktivitas</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Siswa Aktif Hari Ini</span>
                  <span className="font-bold text-sky-600">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Buku Dibaca Hari Ini</span>
                  <span className="font-bold text-sky-600">89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Kuis Dikerjakan Hari Ini</span>
                  <span className="font-bold text-sky-600">124</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reward Diklaim Hari Ini</span>
                  <span className="font-bold text-sky-600">23</span>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-sky-700 mb-4">🎯 Top Siswa</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-sky-100">
                  <span className="text-gray-700">1. Rina Kartika</span>
                  <span className="font-bold text-sky-600">2,450 poin</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-sky-100">
                  <span className="text-gray-700">2. Budi Santoso</span>
                  <span className="font-bold text-sky-600">2,180 poin</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-sky-100">
                  <span className="text-gray-700">3. Siti Nurhaliza</span>
                  <span className="font-bold text-sky-600">2,045 poin</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">4. Ahmad Ibrahim</span>
                  <span className="font-bold text-sky-600">1,890 poin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* E-Books Tab */}
      {activeTab === 'ebooks' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Manajemen E-Book</h2>
            <button className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition">
              ➕ Tambah E-Book
            </button>
          </div>

          <div className="bg-white border-2 border-sky-200 rounded-lg overflow-hidden shadow-md">
            <table className="w-full">
              <thead className="bg-sky-50 border-b border-sky-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Judul</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Penulis</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Halaman</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-sky-100 hover:bg-sky-50">
                  <td className="px-6 py-4 text-gray-700">Laskar Pelangi</td>
                  <td className="px-6 py-4 text-gray-700">Andrea Hirata</td>
                  <td className="px-6 py-4 text-gray-700">534</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Aktif</span>
                  </td>
                  <td className="px-6 py-4 text-sky-600 hover:text-sky-700 cursor-pointer">Edit</td>
                </tr>
                <tr className="border-b border-sky-100 hover:bg-sky-50">
                  <td className="px-6 py-4 text-gray-700">Negeri 5 Menara</td>
                  <td className="px-6 py-4 text-gray-700">A. Fuadi</td>
                  <td className="px-6 py-4 text-gray-700">487</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Aktif</span>
                  </td>
                  <td className="px-6 py-4 text-sky-600 hover:text-sky-700 cursor-pointer">Edit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Manajemen Reward</h2>
            <button className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition">
              ➕ Tambah Reward
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-sky-700">Buku Gratis</h3>
                <span className="text-2xl">📚</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">Dapatkan buku pilihan gratis</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Harga Poin</span>
                  <span className="font-bold text-sky-600">500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stok Tersisa</span>
                  <span className="font-bold text-sky-600">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Terklaim</span>
                  <span className="font-bold text-sky-600">155</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded transition">
                Edit
              </button>
            </div>

            <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-sky-700">E-Voucher</h3>
                <span className="text-2xl">🎟️</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">Voucher belanja online terpilih</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Harga Poin</span>
                  <span className="font-bold text-sky-600">300</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stok Tersisa</span>
                  <span className="font-bold text-sky-600">120</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Terklaim</span>
                  <span className="font-bold text-sky-600">80</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded transition">
                Edit
              </button>
            </div>

            <div className="bg-white border-2 border-sky-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-sky-700">Merchandise</h3>
                <span className="text-2xl">👕</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">Kaos dan merchandise eksklusif</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Harga Poin</span>
                  <span className="font-bold text-sky-600">1000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stok Tersisa</span>
                  <span className="font-bold text-sky-600">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Terklaim</span>
                  <span className="font-bold text-sky-600">77</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded transition">
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Manajemen Pengguna</h2>
            <div className="flex gap-4">
              <button className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition">
                👨‍🎓 Siswa ({245})
              </button>
              <button className="border-2 border-sky-300 text-sky-600 hover:bg-sky-50 font-bold py-2 px-4 rounded-lg transition">
                🎓 Guru ({12})
              </button>
            </div>
          </div>

          <div className="bg-white border-2 border-sky-200 rounded-lg overflow-hidden shadow-md">
            <table className="w-full">
              <thead className="bg-sky-50 border-b border-sky-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Nama</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Kelas</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-sky-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-sky-100 hover:bg-sky-50">
                  <td className="px-6 py-4 text-gray-700">Rina Kartika</td>
                  <td className="px-6 py-4 text-gray-600">rina@example.com</td>
                  <td className="px-6 py-4 text-gray-700">6 A</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Aktif</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <button className="text-sky-600 hover:text-sky-700 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-700">Hapus</button>
                  </td>
                </tr>
                <tr className="border-b border-sky-100 hover:bg-sky-50">
                  <td className="px-6 py-4 text-gray-700">Budi Santoso</td>
                  <td className="px-6 py-4 text-gray-600">budi@example.com</td>
                  <td className="px-6 py-4 text-gray-700">7 B</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Aktif</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <button className="text-sky-600 hover:text-sky-700 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-700">Hapus</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
