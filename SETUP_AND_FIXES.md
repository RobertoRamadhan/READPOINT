# READPOINT - Setup & Fixes Guide

## 🔧 Recent Fixes Applied (April 17, 2026)

This document outlines all critical bug fixes and improvements made to the application. Please read carefully and ensure you run the necessary migrations.

---

## 🚀 Quick Start

### Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Install dependencies
composer install

# Run migrations (including new fixes)
php artisan migrate

# Start the server
php artisan serve
```

### Frontend Setup

```bash
cd frontend

# Copy environment file
cp .env.example .env.local

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Fixed Issues

### ✅ **CRITICAL FIXES**

#### 1. **Quiz Questions - Missing `created_by` Column**
- **Migration**: `database/migrations/2026_03_17_000000_add_created_by_to_quiz_questions_table.php`
- **Status**: ✅ Fixed
- **Details**: 
  - Added `created_by` foreign key to track which teacher created a quiz
  - Updated `QuizQuestion` model with fillable and relationship
  - DashboardController::guruQuizzes() now works correctly

#### 2. **File Storage Path Consistency**
- **File**: `backend/app/Http/Controllers/Api/EbookController.php`
- **Status**: ✅ Fixed
- **Details**:
  - Files stored to `storage/app/public/` with proper error handling
  - Added `fileUrl` and `coverUrl` accessors to Ebook model
  - Retrieval now uses `asset('storage/' . $path)` for URLs

#### 3. **API Type Safety & CSRF Protection**
- **File**: `frontend/lib/api.ts`
- **Status**: ✅ Fixed
- **Details**:
  - Added TypeScript interfaces for all requests/responses
  - Implemented CSRF token fetching and injection
  - Proper error classification and status codes
  - FormData uploads handled correctly

#### 4. **React Error Boundary**
- **File**: `frontend/components/ErrorBoundary.tsx`
- **Status**: ✅ Created
- **Details**:
  - Added Error Boundary component to catch React errors
  - Graceful error display with development debug info
  - Integrated into root layout

#### 5. **Token Expiry Validation**
- **File**: `frontend/context/AuthContext.tsx`
- **Status**: ✅ Fixed
- **Details**:
  - Token validation on app initialization
  - Automatic logout if token is expired
  - useEffect with proper token verification

#### 6. **Grade Level Enum Standardization**
- **Migrations**: 
  - `2026_03_17_000001_standardize_grade_level_enums.php`
- **Status**: ✅ Fixed
- **Details**:
  - Standardized to SMK grades: `'1'`, `'2'`, `'3'` (Kelas X, XI, XII)
  - Updated validation in: UserController, EbookController, BookController
  - Database enums now consistent across all tables

#### 7. **Points Redemption Race Condition**
- **File**: `backend/app/Http/Controllers/Api/RewardController.php`
- **Status**: ✅ Fixed
- **Details**:
  - Wrapped redemption process in database transaction
  - Added pessimistic locking on User and Reward
  - Prevents double-spending and stock overflow
  - Better error messages with proper HTTP codes

#### 8. **Ebook-Book Relationship Issue**
- **File**: `backend/app/Models/Ebook.php`
- **Status**: ✅ Fixed
- **Details**:
  - Removed incomplete book() relationship (no book_id column)
  - Added documentation for future implementation
  - Model now sanitized

---

### 🟠 **HIGH PRIORITY - STILL TODO**

- [ ] **PDF Rendering** - Implement PDF.js in `PDFReader.tsx`
- [ ] **Input Validation** - Add backend validation for all user inputs
- [ ] **API Documentation** - Generate Swagger/OpenAPI specs
- [ ] **Rate Limiting** - Add middleware for auth endpoints
- [ ] **Logging** - Add audit logs for critical operations
- [ ] **Database Indexes** - Add indexes on frequently queried columns
- [ ] **Register Form** - Complete frontend registration form UI

---

## 📝 Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Backend (.env)

```env
APP_NAME="READPOINT"
APP_ENV=local
APP_KEY=base64:YOUR_KEY_HERE
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=readpoint
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=cookie
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
FILESYSTEM_DISK=public
```

---

## 🗄️ Database Migrations to Run

The following new migrations have been added and must be run:

```bash
php artisan migrate
```

**New migrations**:
1. `2026_03_17_000000_add_created_by_to_quiz_questions_table.php`
2. `2026_03_17_000001_standardize_grade_level_enums.php`

---

## 🔍 Data Model Changes

### Users Table
- `grade_level`: Changed from `enum('sd', 'smp')` to `enum('1', '2', '3')`
- `1` = SMK Kelas X (Grade 10)
- `2` = SMK Kelas XI (Grade 11)
- `3` = SMK Kelas XII (Grade 12)

### Ebooks Table
- `grade_level`: Changed from `enum('sd', 'smp')` to `enum('1', '2', '3', 'all')`
- `'all'` = Available for all grade levels

### QuizQuestions Table
- **NEW**: `created_by` - Foreign key to users table (nullable)
- Tracks which teacher created the quiz

---

## 🧪 Testing Checklist

Before deploying, test the following:

- [ ] Login/Register with correct grade levels (1, 2, or 3)
- [ ] Upload ebook - files should be accessible
- [ ] Create quiz - should save teacher ID in `created_by`
- [ ] Redeem reward - test with insufficient points (should fail)
- [ ] Redeem reward - test with concurrent requests (should lock)
- [ ] App refresh - token should be validated
- [ ] Error in component - should catch and display Error Boundary
- [ ] API CSRF - POST requests should include X-CSRF-TOKEN

---

## 📚 API Endpoints Summary

All endpoints require authentication except login/register.

**Auth**:
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`

**E-Books**:
- `GET /api/ebooks` - List all
- `GET /api/ebooks/:id` - Get detail
- `POST /api/ebooks` - Create (Admin only)

**Rewards**:
- `GET /api/rewards` - List all
- `POST /api/rewards/:id/redeem` - Redeem reward

**Validations** (Teacher):
- `GET /api/validations/pending` - Get pending activities
- `PUT /api/validations/:id/approve` - Approve activity
- `PUT /api/validations/:id/reject` - Reject activity

---

## 🚨 Known Issues to Address

1. **PDF Rendering** - PDFReader component shows placeholder - needs pdf.js implementation
2. **Social Login** - Buttons exist but are disabled and non-functional
3. **Register Form** - UI is cut off, missing submit button
4. **Database Indexes** - Missing indexes on frequently queried columns for performance
5. **Admin Dashboard** - Some guru-related statistics may be incomplete

---

## 📞 Support & Debugging

### Common Issues

**Issue**: "Insufficient points" error always appears
- **Solution**: Run migrations to fix grade level enum. Ensure PointTransaction records exist.

**Issue**: Files upload but cannot be downloaded
- **Solution**: Ensure `storage/app/public` is symlinked. Run `php artisan storage:link`

**Issue**: CSRF token mismatch errors
- **Solution**: Ensure `SANCTUM_STATEFUL_DOMAINS` includes your frontend domain

**Issue**: Token always expires after page refresh
- **Solution**: Check that `SESSION_DRIVER=cookie` is set in .env

---

## 🔄 Next Steps

1. **Run database migrations** to apply all fixes
2. **Test authentication flow** with new grade level system
3. **Implement PDF rendering** using pdf.js
4. **Add API documentation** (Swagger)
5. **Set up rate limiting** for API endpoints
6. **Add comprehensive logging** for audit trails

---

**Last Updated**: April 17, 2026  
**Status**: 7/10 Critical Issues Fixed ✅
