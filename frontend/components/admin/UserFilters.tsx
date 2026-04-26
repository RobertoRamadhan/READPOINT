'use client';

import React from 'react';
import { Button } from '@/components/shared';

interface UserFiltersProps {
  activeRole: 'all' | 'admin' | 'guru' | 'siswa';
  onRoleChange: (role: 'all' | 'admin' | 'guru' | 'siswa') => void;
  activeStatus: 'all' | 'active' | 'inactive';
  onStatusChange: (status: 'all' | 'active' | 'inactive') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddUser: () => void;
}

export default function UserFilters({
  activeRole,
  onRoleChange,
  activeStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  onAddUser
}: UserFiltersProps) {
  const roles = [
    { key: 'all' as const, label: 'Semua Role' },
    { key: 'admin' as const, label: 'Admin' },
    { key: 'guru' as const, label: 'Guru' },
    { key: 'siswa' as const, label: 'Siswa' }
  ];

  const statuses = [
    { key: 'all' as const, label: 'Semua Status' },
    { key: 'active' as const, label: 'Aktif' },
    { key: 'inactive' as const, label: 'Tidak Aktif' }
  ];

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau email..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-semibold text-gray-900"
            />
            <div className="absolute left-4 top-3.5 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        {/* Role Filter */}
        <div className="flex gap-2">
          {roles.map((role) => (
            <Button
              key={role.key}
              onClick={() => onRoleChange(role.key)}
              variant={activeRole === role.key ? 'primary' : 'outline'}
              size="sm"
            >
              {role.label}
            </Button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          {statuses.map((status) => (
            <Button
              key={status.key}
              onClick={() => onStatusChange(status.key)}
              variant={activeStatus === status.key ? 'primary' : 'outline'}
              size="sm"
            >
              {status.label}
            </Button>
          ))}
        </div>

        {/* Add User Button */}
        <Button
          onClick={onAddUser}
          variant="success"
          size="sm"
        >
          ➕ Tambah User
        </Button>
      </div>
    </div>
  );
}
