<?php

namespace App\Http\Controllers\Api;

use App\Models\Ebook;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class EbookController extends Controller
{
    // Get semua e-book aktif
    public function index()
    {
        $ebooks = Ebook::where('is_active', true)
            ->select('id', 'title', 'author', 'pages', 'poin_per_halaman', 'file_path', 'cover_image', 'category', 'grade_level')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $ebooks,
        ]);
    }

    // Get e-book by ID (untuk baca)
    public function show($id)
    {
        $ebook = Ebook::where('is_active', true)
            ->findOrFail($id);

        return response()->json([
            'data' => $ebook,
        ]);
    }

    // Get file PDF (stream untuk reader)
    public function getPDF($id)
    {
        $ebook = Ebook::where('is_active', true)
            ->findOrFail($id);

        $filePath = storage_path('app/' . $ebook->file_path);

        if (!file_exists($filePath)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return response()->file($filePath, [
            'Content-Disposition' => 'inline; filename="' . $ebook->title . '.pdf"',
            'Content-Type' => 'application/pdf',
        ]);
    }

    // Admin: Upload e-book baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'pages' => 'required|integer|min:1',
            'poin_per_halaman' => 'required|integer|min:1',
            'category' => 'required|string',
            'grade_level' => 'required|in:sd,smp',
            'pdf_file' => 'required|file|mimes:pdf|max:50000', // max 50MB
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png|max:5000',
        ]);

        // Store PDF
        $pdfPath = $request->file('pdf_file')->store('ebooks/pdfs', 'public');

        // Store cover image jika ada
        $coverPath = null;
        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->store('ebooks/covers', 'public');
        }

        $ebook = Ebook::create([
            'title' => $validated['title'],
            'author' => $validated['author'],
            'pages' => $validated['pages'],
            'poin_per_halaman' => $validated['poin_per_halaman'],
            'category' => $validated['category'],
            'grade_level' => $validated['grade_level'],
            'file_path' => $pdfPath,
            'cover_image' => $coverPath,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'E-book uploaded successfully',
            'data' => $ebook,
        ], 201);
    }

    // Admin: Update e-book metadata
    public function update(Request $request, $id)
    {
        $ebook = Ebook::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'author' => 'sometimes|string|max:255',
            'pages' => 'sometimes|integer|min:1',
            'poin_per_halaman' => 'sometimes|integer|min:1',
            'category' => 'sometimes|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $ebook->update($validated);

        return response()->json([
            'message' => 'E-book updated',
            'data' => $ebook,
        ]);
    }

    // Admin: Soft delete e-book
    public function destroy($id)
    {
        $ebook = Ebook::findOrFail($id);
        $ebook->update(['is_active' => false]);

        return response()->json([
            'message' => 'E-book deactivated',
        ]);
    }

    // Get user's reading progress for specific e-book
    public function getUserProgress(Request $request, $ebookId)
    {
        $activity = \App\Models\ReadingActivity::where('user_id', $request->user()->id)
            ->where('ebook_id', $ebookId)
            ->latest()
            ->first();

        return response()->json([
            'data' => $activity,
        ]);
    }
}
