'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/shared';

export default function OverviewTab() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-gray-200 shadow-lg">
        <CardHeader>
          <h3 className="text-2xl md:text-3xl font-black text-gray-900">🚀 Panduan Penggunaan</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GuideCard
              icon="📚"
              title="Baca Buku"
              description="Pilih buku favorit dan mulai baca. Dapatkan poin untuk setiap halaman yang dibaca."
              color="border-blue-200"
            />
            <GuideCard
              icon="❓"
              title="Selesaikan Quiz"
              description="Jawab pertanyaan tentang buku yang telah dibaca untuk mendapatkan bonus poin tambahan."
              color="border-yellow-200"
            />
            <GuideCard
              icon="🎁"
              title="Tukar Rewards"
              description="Kumpulkan poin Anda dan tukarkan dengan rewards eksklusif yang tersedia."
              color="border-pink-200"
            />
          </div>
        </CardContent>
      </Card>

      <QuickStats />
    </div>
  );
}

function GuideCard({ 
  icon, 
  title, 
  description, 
  color 
}: { 
  icon: string; 
  title: string; 
  description: string; 
  color: string;
}) {
  return (
    <Card className={`bg-white p-6 rounded-xl border-2 ${color}`}>
      <div className="text-4xl mb-3">{icon}</div>
      <h4 className="font-black text-gray-900 mb-2">{title}</h4>
      <p className="text-sm text-gray-700 font-semibold">{description}</p>
    </Card>
  );
}

function QuickStats() {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
      <CardHeader>
        <h3 className="text-xl font-black text-gray-900">📈 Tips Cepat Naik Level</h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TipCard
            tip="Baca buku setiap hari minimal 30 menit"
            points="+50 Poin/Hari"
            icon="⏰"
          />
          <TipCard
            tip="Selesaikan quiz dengan skor ≥80%"
            points="+100 Poin/Quiz"
            icon="🎯"
          />
          <TipCard
            tip="Baca buku dari kategori berbeda"
            points="+25 Poin/Kategori"
            icon="📚"
          />
          <TipCard
            tip="Ajak teman untuk ikut program"
            points="+75 Poin/Referral"
            icon="👥"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function TipCard({ 
  tip, 
  points, 
  icon 
}: { 
  tip: string; 
  points: string; 
  icon: string;
}) {
  return (
    <div className="bg-white p-4 rounded-lg border-2 border-gray-200 flex items-center gap-3">
      <div className="text-2xl">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-bold text-gray-900">{tip}</p>
        <p className="text-xs font-black text-green-600">{points}</p>
      </div>
    </div>
  );
}
