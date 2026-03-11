<?php

namespace App\Http\Controllers\Api;

use App\Models\Reward;
use App\Models\Redemption;
use App\Models\PointTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;

class RewardController extends Controller
{
    // Get semua reward aktif (reward catalog)
    public function index()
    {
        $rewards = Reward::where('is_active', true)
            ->select('id', 'name', 'description', 'points_required', 'stock', 'icon', 'category')
            ->get();

        return response()->json([
            'data' => $rewards,
        ]);
    }

    // Store reward baru (Admin only)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'points_required' => 'required|integer|min:1',
            'stock' => 'required|integer|min:0',
            'category' => 'required|string',
        ]);

        $reward = Reward::create($validated + ['is_active' => true]);

        return response()->json([
            'message' => 'Reward created',
            'data' => $reward,
        ], 201);
    }

    // Get reward by ID
    public function show(string $id)
    {
        $reward = Reward::findOrFail($id);

        return response()->json([
            'data' => $reward,
        ]);
    }

    // Update reward (Admin only)
    public function update(Request $request, string $id)
    {
        $reward = Reward::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'description' => 'sometimes|string',
            'points_required' => 'sometimes|integer|min:1',
            'stock' => 'sometimes|integer|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        $reward->update($validated);

        return response()->json([
            'message' => 'Reward updated',
            'data' => $reward,
        ]);
    }

    // Hapus reward (soft delete)
    public function destroy(string $id)
    {
        $reward = Reward::findOrFail($id);
        $reward->update(['is_active' => false]);

        return response()->json([
            'message' => 'Reward deactivated',
        ]);
    }

    // Redeem reward (tukar poin dengan hadiah)
    public function redeem(Request $request, $rewardId)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $reward = Reward::findOrFail($rewardId);
        $user = $request->user();
        $totalPointsNeeded = $reward->points_required * $validated['quantity'];

        // Get user's current points
        $userPoints = PointTransaction::where('user_id', $user->id)
            ->sum('points');

        // Check if user has enough points
        if ($userPoints < $totalPointsNeeded) {
            return response()->json([
                'message' => 'Insufficient points',
                'required_points' => $totalPointsNeeded,
                'user_points' => $userPoints,
            ], 402);
        }

        // Check stock
        if ($reward->stock < $validated['quantity']) {
            return response()->json([
                'message' => 'Insufficient stock',
                'available_stock' => $reward->stock,
                'requested_quantity' => $validated['quantity'],
            ], 400);
        }

        // Generate unique claim code
        $claimCode = 'CLAIM-' . strtoupper(Str::random(8)) . '-' . $reward->id;

        // Create redemption record
        $redemption = Redemption::create([
            'user_id' => $user->id,
            'reward_id' => $rewardId,
            'quantity' => $validated['quantity'],
            'points_used' => $totalPointsNeeded,
            'claim_code' => $claimCode,
            'status' => 'pending', // Pending pickup at library/admin
            'claimed_at' => null,
        ]);

        // Deduct points
        PointTransaction::create([
            'user_id' => $user->id,
            'redemption_id' => $redemption->id,
            'points' => -$totalPointsNeeded,
            'type' => 'reward_redemption',
            'description' => "Penukaran reward '{$reward->name}' (x{$validated['quantity']})",
        ]);

        // Update reward stock
        $reward->decrement('stock', $validated['quantity']);

        return response()->json([
            'message' => 'Reward redeemed successfully',
            'redemption' => [
                'id' => $redemption->id,
                'claim_code' => $claimCode,
                'reward_name' => $reward->name,
                'quantity' => $validated['quantity'],
                'points_used' => $totalPointsNeeded,
                'status' => 'pending',
                'instructions' => 'Tunjukkan kode klaim ini ke perpustakaan untuk mengambil hadiah Anda',
            ],
        ], 201);
    }

    // Get redemption history 
    public function getMyRedemptions(Request $request)
    {
        $redemptions = Redemption::where('user_id', $request->user()->id)
            ->with('reward')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $redemptions,
        ]);
    }

    // Get user's total points
    public function getUserPoints(Request $request)
    {
        $totalPoints = PointTransaction::where('user_id', $request->user()->id)
            ->sum('points');

        $recentTransactions = PointTransaction::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'total_points' => $totalPoints,
            'recent_transactions' => $recentTransactions,
        ]);
    }

    // Admin: Verify claim code (for library staff)
    public function verifyClaim(Request $request)
    {
        $validated = $request->validate([
            'claim_code' => 'required|string',
        ]);

        $redemption = Redemption::where('claim_code', $validated['claim_code'])
            ->with('reward', 'user')
            ->firstOrFail();

        if ($redemption->status !== 'pending') {
            return response()->json([
                'message' => 'Reward already claimed or invalid',
            ], 400);
        }

        // Mark as claimed
        $redemption->update([
            'status' => 'claimed',
            'claimed_at' => now(),
            'verified_by' => $request->user()->id, // Admin/library staff
        ]);

        return response()->json([
            'message' => 'Reward verified and claimed',
            'redemption' => $redemption,
        ]);
    }
}
