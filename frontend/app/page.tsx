'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="w-full overflow-hidden relative bg-white flex flex-col items-center justify-center">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm w-full">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">📚</span>
            <h1 className="text-2xl font-bold text-slate-900">READPOINT</h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="hidden sm:block px-4 py-2 text-slate-700 font-semibold hover:text-slate-900 transition">
              Fitur
            </a>
            <a href="#howto" className="hidden sm:block px-4 py-2 text-slate-700 font-semibold hover:text-slate-900 transition">
              Cara Kerja
            </a>
            <Link href="/login" className="px-6 py-2 text-slate-700 font-semibold hover:text-slate-900 transition">
              Login
            </Link>
            <Link href="/register" className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition hover:shadow-lg">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100 py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-5xl text-center">
          {/* Hero Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 mb-6 leading-tight">
            Platform Literasi Digital <span className="text-sky-600">Interaktif</span> untuk Siswa
          </h2>

          {/* Hero Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-500 mb-8 sm:mb-12 w-full mx-auto leading-relaxed text-center">
            Baca e-book, kerjakan kuis, kumpulkan poin, dan raih hadiah menarik.
            Belajar jadi lebih seru dan penghargaan jadi lebih bermakna.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center sm:items-stretch">
            <a href="#features" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-slate-300 text-slate-700 font-bold rounded-lg hover:border-slate-400 hover:bg-slate-50 transition text-base sm:text-lg text-center">
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full px-4 sm:px-6 lg:px-8 py-20 lg:py-28 bg-white relative overflow-hidden z-10 flex items-center justify-center">
        <div className="w-full max-w-5xl">
          <div className="mb-16 sm:mb-20 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 text-slate-900 tracking-tight">
              Fitur-Fitur Unggulan
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Semua yang Anda perlukan untuk pengalaman belajar yang optimal dan bermakna
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8">
            {/* Feature 1 */}
            <div className="card-gradient card group relative overflow-hidden border-blue-200 p-5 sm:p-6 lg:p-8">
              <div className="mb-6 flex justify-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 group-hover:from-blue-200 group-hover:to-cyan-200 transition-colors duration-300"></div>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-2 sm:mb-3 lg:mb-4 text-center">E-Book Digital</h3>
              <p className="text-xs sm:text-sm lg:text-base leading-relaxed text-center">Koleksi lengkap e-book berkualitas untuk semua mata pelajaran SMK dengan format interaktif yang menarik.</p>
            </div>

            {/* Feature 2 */}
            <div className="card-gradient card group relative overflow-hidden border-blue-200 p-5 sm:p-6 lg:p-8">
              <div className="mb-6 flex justify-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 group-hover:from-purple-200 group-hover:to-pink-200 transition-colors duration-300"></div>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-2 sm:mb-3 lg:mb-4 text-center">Kuis Interaktif</h3>
              <p className="text-xs sm:text-sm lg:text-base leading-relaxed text-center">Sistem gamifikasi penuh dengan kuis menarik yang membuat proses pembelajaran lebih engaging dan efektif.</p>
            </div>

            {/* Feature 3 */}
            <div className="card-gradient card group relative overflow-hidden border-blue-200 p-5 sm:p-6 lg:p-8">
              <div className="mb-6 flex justify-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 group-hover:from-amber-200 group-hover:to-orange-200 transition-colors duration-300"></div>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-2 sm:mb-3 lg:mb-4 text-center">Reward Program</h3>
              <p className="text-xs sm:text-sm lg:text-base leading-relaxed text-center">Tukar poin Anda dengan hadiah menarik dan nikmati apresiasi atas setiap pencapaian.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="howto" className="w-full px-4 sm:px-6 lg:px-8 py-20 lg:py-28 bg-slate-50 relative overflow-hidden z-10 flex items-center justify-center">
        <div className="w-full max-w-5xl">
          <div className="mb-16 sm:mb-20 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 text-slate-900 tracking-tight">
              Cara Kerja Platform
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Proses yang sederhana dan mudah untuk memulai perjalanan belajar Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-4">
            {[
              {
                number: 1,
                title: 'Daftar Akun',
                description: 'Buat akun gratis atau ditambahkan oleh guru Anda'
              },
              {
                number: 2,
                title: 'Pilih Buku',
                description: 'Browse 500+ e-book dan pilih yang sesuai minat'
              },
              {
                number: 3,
                title: 'Baca & Kerjakan Kuis',
                description: 'Baca buku dan jawab kuis untuk kumpulkan poin'
              },
              {
                number: 4,
                title: 'Raih Reward',
                description: 'Tukar poin Anda dengan hadiah menarik'
              }
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="card card-gradient border-slate-200 h-full p-5 sm:p-6 lg:p-8 animate-slide-up text-center" style={{animationDelay: `${idx * 100}ms`}}>
                  <div className="flex flex-col items-center gap-3 sm:gap-4 mb-3 sm:mb-5 lg:mb-6">
                    <div className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                      {item.number}
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-2 sm:mb-3 text-center">{item.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm lg:text-base text-center">{item.description}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-7 w-6 h-0.5 bg-slate-700 group-hover:w-8 transition-all duration-300 transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-900 to-slate-950 text-gray-400 relative z-10 flex items-center justify-center">
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 mb-12 sm:mb-16">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">📚</span>
                <h4 className="font-black text-white text-lg sm:text-xl tracking-tight">READPOINT</h4>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed mb-6">Platform literasi digital terpercaya yang memberikan pengalaman belajar interaktif dan bermakna untuk siswa di seluruh Indonesia.</p>
              <div className="flex gap-4">
                <a href="#" title="Twitter" className="hover:text-white transition-colors text-xs sm:text-sm">𝕏</a>
                <a href="#" title="LinkedIn" className="hover:text-white transition-colors text-xs sm:text-sm">in</a>
                <a href="#" title="Email" className="hover:text-white transition-colors text-xs sm:text-sm">✉️</a>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm mb-4 uppercase tracking-widest">Produk</h4>
              <ul className="text-xs sm:text-sm space-y-2.5">
                <li><a href="#" className="hover:text-white transition-colors">E-Books</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kuis Interaktif</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reward System</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm mb-4 uppercase tracking-widest">Dukungan</h4>
              <ul className="text-xs sm:text-sm space-y-2.5">
                <li><a href="#" className="hover:text-white transition-colors">Pusat Bantuan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hubungi Kami</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm mb-4 uppercase tracking-widest">Perusahaan</h4>
              <ul className="text-xs sm:text-sm space-y-2.5">
                <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Karir</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm mb-4 uppercase tracking-widest">Legal</h4>
              <ul className="text-xs sm:text-sm space-y-2.5">
                <li><a href="#" className="hover:text-white transition-colors">Privasi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-slate-700 pt-8 sm:pt-10">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-400 mb-3">
                READPOINT - Platform Literasi Digital | Dikembangkan dengan dedikasi untuk meningkatkan literasi Indonesia
              </p>
              <p className="text-xs sm:text-sm text-gray-400">© 2026 READPOINT Indonesia. Semua hak dilindungi. 🌟</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}