# READPOINT - Platform Literasi Digital

Full-stack application untuk meningkatkan minat baca siswa SMP melalui gamifikasi, sistem poin, dan penukaran hadiah.

## Quick Start

### Backend (Laravel 12)

```bash
cd backend
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

Server akan berjalan di `http://localhost:8000`

### Frontend (Next.js 15)

```bash
cd frontend
npm install
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## Fitur Utama

- 📚 **E-Book Digital** - Koleksi buku dengan tracking progress
- 🎯 **Gamifikasi & Kuis** - Sistem poin untuk setiap pencapaian
- 🎁 **Reward System** - Tukar poin dengan hadiah nyata
- 👥 **Multi-Role** - Admin, Guru, dan Siswa
- 📊 **Analytics** - Tracking kemajuan membaca

## Tech Stack

**Backend:**
- Laravel 12
- PHP 8.2+
- SQLite (Development)
- RESTful API

**Frontend:**
- Next.js 15
- TypeScript
- Tailwind CSS
- React Context API

## Project Structure

```
readpoint/
├── backend/              # Laravel API
│   ├── app/
│   │   ├── Models/      # Database Models
│   │   └── Http/
│   │       └── Controllers/Api/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/api.php
│
└── frontend/            # Next.js App
    ├── app/
    │   ├── (auth)/
    │   ├── (dashboard)/
    │   └── page.tsx
    ├── components/
    ├── context/
    └── lib/
```

## Models

- **User** - Admin, Guru, Siswa
- **Book** - Data buku
- **Ebook** - File e-book
- **BookAssignment** - Penugasan buku
- **ReadingProgress** - Progress membaca siswa
- **ReadingActivity** - Aktivitas membaca
- **QuizQuestion** - Pertanyaan kuis
- **QuizAttempt** - Percobaan kuis
- **PointTransaction** - Transaksi poin
- **Reward** - Daftar hadiah
- **Redemption** - Penukaran hadiah
- **Validation** - Validasi guru

## API Endpoints

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/register` - Register

### Books
- `GET /api/books` - Daftar buku
- `GET /api/books/{id}` - Detail buku
- `POST /api/books` - Tambah buku (Admin)

### Reading Progress
- `GET /api/reading-progress` - Progress siswa
- `PUT /api/reading-progress/{id}` - Update progress

### Rewards
- `GET /api/rewards` - Daftar reward
- `POST /api/rewards/{id}/redeem` - Redeem reward

## Development

```bash
# Start both servers simultaneously
# Terminal 1: Backend
cd backend && php artisan serve

# Terminal 2: Frontend
cd frontend && npm run dev
```

## License

MIT
