'use client';

import React from 'react';

interface HeaderProps {
  title?: string;
  logoUrl?: string;
}

export default function Header({ title = 'Readpoint', logoUrl }: HeaderProps) {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="px-6 py-6 md:px-8 lg:px-8">
        {logoUrl ? (
          <img src={logoUrl} alt={title} className="h-12" />
        ) : (
          <h1 className="text-4xl md:text-[2.25rem] font-bold text-gray-900">{title}</h1>
        )}
      </div>
    </header>
  );
}
