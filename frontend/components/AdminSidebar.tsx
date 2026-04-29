'use client';

import { useState } from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  subItems?: {
    id: string;
    label: string;
    icon?: string;
  }[];
}

interface AdminSidebarProps {
  activeTab: string;
  sidebarOpen: boolean;
  onTabChange: (tabId: string) => void;
  onCloseSidebar: () => void;
  menuItems?: MenuItem[];
  role?: 'admin' | 'guru';
  user?: {
    name: string;
    email: string;
    profile_photo_url?: string;
  };
}

export default function AdminSidebar({
  activeTab,
  sidebarOpen,
  onTabChange,
  onCloseSidebar,
  menuItems,
  role = 'admin',
  user,
}: AdminSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Default menu items based on role
  const defaultMenuItems: MenuItem[] = role === 'admin' ? [
    { id: 'beranda', label: 'Beranda', icon: '🏠' },
    {
      id: 'manajemen',
      label: 'Manajemen',
      icon: '⚙️',
      subItems: [
        { id: 'ebooks', label: 'E-Book', icon: '📚' },
        { id: 'rewards', label: 'Reward', icon: '🎁' },
        { id: 'users', label: 'User', icon: '👥' },
      ],
    },
    { id: 'laporan', label: 'Laporan', icon: '📊' },
    { id: 'pengaturan', label: 'Pengaturan', icon: '🔧' },
  ] : [
    { id: 'beranda', label: 'Beranda', icon: '🏠' },
    {
      id: 'manajemen',
      label: 'Manajemen',
      icon: '⚙️',
      subItems: [
        { id: 'validasi', label: 'Validasi Pembacaan', icon: '✅' },
        { id: 'kuis', label: 'Buat Kuis', icon: '❓' },
        { id: 'siswa', label: 'Daftar Siswa', icon: '👨‍🎓' },
      ],
    },
    { id: 'laporan', label: 'Laporan', icon: '📊' },
    { id: 'pengaturan', label: 'Pengaturan', icon: '🔧' },
  ];

  const items = menuItems || defaultMenuItems;

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (itemId: string) => {
    onTabChange(itemId);
    onCloseSidebar();
  };

  const handleSubItemClick = (subItemId: string) => {
    onTabChange(subItemId);
    onCloseSidebar();
  };

  return (
    <div
      className={`fixed md:relative w-64 bg-gradient-to-b from-amber-800 to-amber-900 text-white overflow-y-auto shadow-xl z-40 transition-transform duration-300 h-[calc(100vh-80px)] ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-amber-700 sticky top-0 bg-gradient-to-r from-amber-800 to-amber-900">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          MENU
        </h2>
        {user && (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-700 overflow-hidden flex-shrink-0">
              {user.profile_photo_url ? (
                <img
                  src={user.profile_photo_url}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-amber-200 text-xl">
                  👤
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white sidebar-user-name truncate">{user.name}</p>
              <p className="text-xs text-white sidebar-user-email truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-0 pb-20">
        {items.map((item) => {
          const isExpanded = expandedItems.includes(item.id);
          const isActive = activeTab === item.id;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const anySubItemActive = item.subItems?.some((sub) => activeTab === sub.id);

          return (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (hasSubItems) {
                    toggleExpand(item.id);
                  } else {
                    handleItemClick(item.id);
                  }
                }}
                className={`w-full text-left px-6 py-3 transition-all duration-200 border-l-4 flex items-center justify-between group ${
                  isActive || anySubItemActive
                    ? 'bg-amber-700 border-amber-500 font-semibold text-white'
                    : 'border-transparent hover:bg-amber-700/50 text-amber-100'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  {item.icon && <span className="text-lg">{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
                {hasSubItems && (
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7-7m0 0L5 14m7-7v12" />
                  </svg>
                )}
              </button>

              {/* Sub Items */}
              {hasSubItems && item.subItems && (
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  {item.subItems.map((subItem) => {
                    const isSubActive = activeTab === subItem.id;
                    return (
                      <button
                        key={subItem.id}
                        onClick={() => handleSubItemClick(subItem.id)}
                        className={`w-full text-left px-6 py-2.5 pl-12 transition-all duration-200 border-l-4 flex items-center gap-3 text-sm ${
                          isSubActive
                            ? 'bg-amber-600 border-amber-400 font-semibold text-white'
                            : 'border-transparent hover:bg-amber-600/50 text-amber-100'
                        }`}
                      >
                        {subItem.icon && <span className="text-base">{subItem.icon}</span>}
                        <span>{subItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-amber-700 bg-gradient-to-t from-amber-900 to-transparent">
        <p className="text-xs text-white text-center">READPOINT Admin Panel v1.0</p>
      </div>
    </div>
  );
}
