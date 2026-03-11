import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center text-center gap-8">
          <h1 className="text-5xl md:text-6xl font-bold text-sky-600 mb-4">
            READPOINT
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mb-8">
            Platform literasi digital dengan gamifikasi untuk meningkatkan minat baca siswa
          </p>

          <div className="flex gap-4 mb-12">
            <Link
              href="/login"
              className="px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 bg-white hover:bg-sky-50 text-sky-600 rounded-lg font-semibold transition border-2 border-sky-500"
            >
              Register
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <div className="bg-sky-50 border-2 border-sky-200 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-sky-700 mb-2">E-Book Digital</h3>
              <p className="text-gray-600">Koleksi buku dengan tracking progress membaca</p>
            </div>

            <div className="bg-sky-50 border-2 border-sky-200 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-sky-700 mb-2">Gamifikasi</h3>
              <p className="text-gray-600">Kuis dan sistem poin untuk setiap pencapaian</p>
            </div>

            <div className="bg-sky-50 border-2 border-sky-200 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-sky-700 mb-2">Reward Nyata</h3>
              <p className="text-gray-600">Tukar poin dengan hadiah menarik</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

