'use client';

import React, { ReactNode } from 'react';
import Header from './Header';
import Navigation from './Navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <main className="px-8 py-8">
        {children}
      </main>
    </div>
  );
}
