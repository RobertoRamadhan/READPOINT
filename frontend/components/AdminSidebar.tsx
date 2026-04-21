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
  menuItems: MenuItem[];
}

export default function AdminSidebar({
  activeTab,
  sidebarOpen,
  onTabChange,
  onCloseSidebar,
  menuItems,
}: AdminSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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
      className={`fixed md:relative w-64 bg-gradient-to-b from-blue-900 to-blue-950 text-white overflow-y-auto shadow-xl z-40 transition-transform duration-300 h-[calc(100vh-80px)] ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-blue-800 sticky top-0 bg-gradient-to-r from-blue-900 to-blue-950">
        <h2 className="text-xl font-bold flex items-center gap-2">
          MENU
        </h2>
      </div>

      {/* Navigation */}
      <nav className="p-0 pb-20">
        {menuItems.map((item) => {
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
                    ? 'bg-blue-800 border-blue-400 font-semibold text-blue-50'
                    : 'border-transparent hover:bg-blue-800/50 text-blue-100'
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
              {hasSubItems && (
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
                            ? 'bg-blue-700 border-blue-300 font-semibold text-white'
                            : 'border-transparent hover:bg-blue-700/50 text-blue-100'
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
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-800 bg-gradient-to-t from-blue-950 to-transparent">
        <p className="text-xs text-blue-300 text-center">READPOINT Admin Panel v1.0</p>
      </div>
    </div>
  );
}
