'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  id: string;
  label: string;
  href: string;
}

interface NavigationProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  items?: NavItem[];
}

const defaultNavItems: NavItem[] = [
  { id: 'overview', label: 'overview', href: '/dashboard' },
  { id: 'ebook', label: 'E-Book', href: '/dashboard/ebook' },
  { id: 'kuis', label: 'kuis', href: '/dashboard/kuis' },
  { id: 'reward', label: 'reward', href: '/dashboard/reward' },
];

export default function Navigation({ activeTab, onTabChange, items = defaultNavItems }: NavigationProps) {
  const pathname = usePathname();
  
  return (
    <nav className="w-full px-6 py-4 md:px-8">
      <div className="inline-flex gap-4 bg-gray-100 rounded-full p-1">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => onTabChange?.(item.id)}
            className={`px-4 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === item.id || pathname === item.href
                ? 'bg-white text-black border-2 border-black shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
