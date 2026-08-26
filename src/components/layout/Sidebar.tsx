import React from 'react';
import { RoutePath } from '../../types';
import {
  LayoutGrid,
  Building2,
  UserCheck,
  Receipt,
  TrendingUp,
  Package,
  Ship,
  Snowflake,
  Box,
  PlusSquare,
  CheckCircle,
  Sparkles,
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  currentPath: RoutePath;
  onNavigate: (path: RoutePath) => void;
  pendingApprovalsCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: string;
  name: string;
  path: RoutePath;
  icon: React.ElementType;
  badge?: number | string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  pendingApprovalsCount = 7,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const commandNavItems: NavItem[] = [
    { id: 'group-overview', name: 'Group Overview', path: '/dashboard', icon: LayoutGrid },
    { id: 'businesses', name: 'Businesses', path: '/businesses', icon: Building2 },
    { id: 'managers', name: 'Managers', path: '/managers', icon: UserCheck },
    { id: 'finance', name: 'Finance', path: '/finance', icon: Receipt },
    { id: 'sales-collection', name: 'Sales & Collection', path: '/sales-collection', icon: TrendingUp },
    { id: 'inventory', name: 'Inventory', path: '/inventory', icon: Package },
    { id: 'import-shipments', name: 'Import Shipments', path: '/import-shipments', icon: Ship },
    { id: 'cold-storage', name: 'Cold Storage', path: '/cold-storage', icon: Snowflake },
    { id: 'packaging', name: 'Packaging', path: '/packaging', icon: Box },
    { id: 'hospital-summary', name: 'Hospital Summary', path: '/hospital-summary', icon: PlusSquare },
    { id: 'approvals', name: 'Approvals', path: '/approvals', icon: CheckCircle, badge: pendingApprovalsCount },
    { id: 'ask-samura', name: 'ASK SAMURA', path: '/ask-samura', icon: Sparkles }
  ];

  const systemNavItems: NavItem[] = [
    { id: 'settings', name: 'Settings & Governance', path: '/settings', icon: Settings }
  ];

  const handleItemClick = (path: RoutePath) => {
    onNavigate(path);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#073F37] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-[#06352F] flex-shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Branding & Foundation Badge */}
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">SAMURA ONE</h1>
              <p className="text-[10px] text-[#22A06B] font-medium tracking-widest uppercase mt-0.5 opacity-90">
                AL SAMURA Group Command
              </p>
            </div>

            {/* Mobile Close Button */}
            {isOpenMobile && (
              <button
                onClick={onCloseMobile}
                className="p-1 rounded text-white/70 hover:text-white hover:bg-[#0E5A4F] lg:hidden"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="mt-3 bg-[#0E5A4F] px-2 py-1 rounded text-[10px] w-fit font-mono text-[#D5E2DC] font-semibold tracking-wide">
            FOUNDATION v0.2
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-5 text-xs select-none">
          {/* Command Group */}
          <div>
            <p className="text-[10px] text-[#71807B] uppercase font-bold tracking-wider mb-2 px-2">
              Command
            </p>
            <ul className="space-y-1" role="list">
              {commandNavItems.map((item) => {
                const isActive = currentPath === item.path;
                const IconComponent = item.icon;

                return (
                  <li key={item.id}>
                    <button
                      id={`nav-item-${item.id}`}
                      onClick={() => handleItemClick(item.path)}
                      className={`w-full px-3 py-2 rounded-md flex items-center transition-colors cursor-pointer text-left text-xs font-medium ${
                        isActive
                          ? 'bg-[#0E5A4F] text-white shadow-xs font-semibold'
                          : 'text-white/70 hover:text-white hover:bg-[#0E5A4F]'
                      }`}
                    >
                      <IconComponent
                        className={`w-4 h-4 mr-2.5 shrink-0 transition-opacity ${
                          isActive ? 'opacity-100 text-white' : 'opacity-80 text-white/80'
                        }`}
                      />
                      <span className="truncate">{item.name}</span>

                      {item.badge !== undefined && (
                        <span className="ml-auto bg-[#D9534F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* System Group */}
          <div>
            <p className="text-[10px] text-[#71807B] uppercase font-bold tracking-wider mb-2 px-2">
              System
            </p>
            <ul className="space-y-1" role="list">
              {systemNavItems.map((item) => {
                const isActive = currentPath === item.path;
                const IconComponent = item.icon;

                return (
                  <li key={item.id}>
                    <button
                      id={`nav-item-${item.id}`}
                      onClick={() => handleItemClick(item.path)}
                      className={`w-full px-3 py-2 rounded-md flex items-center transition-colors cursor-pointer text-left text-xs font-medium ${
                        isActive
                          ? 'bg-[#0E5A4F] text-white shadow-xs font-semibold'
                          : 'text-white/70 hover:text-white hover:bg-[#0E5A4F]'
                      }`}
                    >
                      <IconComponent
                        className={`w-4 h-4 mr-2.5 shrink-0 transition-opacity ${
                          isActive ? 'opacity-100 text-white' : 'opacity-80 text-white/80'
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Sidebar Footer: Founder View */}
        <div className="p-4 bg-[#06352F] mt-auto border-t border-[#094A41]/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#0E5A4F] flex items-center justify-center text-xs font-bold border border-white/10 text-white shrink-0">
              ML
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Md. Labibul Haque Sabuz</p>
              <p className="text-[10px] text-[#22A06B] uppercase tracking-tighter font-semibold">
                Founder View
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
