import Link from 'next/link';

export default function Home() {
  return (
    <main className="w-full bg-gradient-to-b from-white via-blue-50 to-white">

      {/* ─── Hero Section ─── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10 overflow-hidden">

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-6 animate-slide-up">

            <div className="text-7xl md:text-8xl animate-bounce-slow">📚</div>

            <div className="space-y-3">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900">
                READPOINT
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Platform Literasi Digital Terpadu
              </p>
            </div>

            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed animate-slide-up animation-delay-100">
              Tingkatkan minat baca siswa melalui e-book interaktif, kuis edukatif yang menantang, dan sistem reward yang memotivasi
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-up animation-delay-200">
              <Link href="/login" className="btn-primary text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4">
                🚀 Masuk Sekarang
              </Link>
              <Link href="/register" className="btn-secondary text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4">
                ✨ Daftar Gratis
              </Link>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}