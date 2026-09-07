import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useLogo } from '../../context/LogoContext';
import {
  LayoutGrid,
  FileSpreadsheet,
  Package,
  Building2,
  Receipt,
  Sparkles,
  Settings,
  X,
  TrendingUp,
  LogOut,
  ShieldCheck,
  Users,
  Bell
} from 'lucide-react';

export type ManagerTab = 'overview' | 'sales_due' | 'products' | 'customers' | 'notifications';

interface ManagerSidebarProps {
  activeTab: ManagerTab;
  onSelectTab: (tab: ManagerTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  businessName: string;
  salesDueCount: number;
  productCount: number;
  customerCount?: number;
  notificationCount?: number;
}

interface ManagerNavItem {
  id: ManagerTab;
  name: string;
  banglaName?: string;
  icon: React.ElementType;
  badge?: number | string;
  description?: string;
}

export const ManagerSidebar: React.FC<ManagerSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile = false,
  onCloseMobile,
  businessName,
  salesDueCount,
  productCount,
  customerCount = 0,
  notificationCount = 0
}) => {
  const { user, logout } = useAuth();
  const { customLogo } = useLogo();

  const commandNavItems: ManagerNavItem[] = [
    {
      id: 'overview',
      name: 'Unit Overview',
      icon: LayoutGrid,
      description: 'Summary & KPIs'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      badge: notificationCount > 0 ? notificationCount : undefined,
      description: 'Admin Approvals & Dues'
    },
    {
      id: 'sales_due',
      name: 'Sales & Dues',
      icon: TrendingUp,
      badge: salesDueCount,
      description: 'Records & Vouchers'
    },
    {
      id: 'customers',
      name: 'Customer List',
      icon: Users,
      badge: customerCount,
      description: 'Profiles & Ledger'
    },
    {
      id: 'products',
      name: 'Products & Inventory',
      icon: Package,
      badge: productCount,
      description: 'Inventory & Rates'
    }
  ];

  const handleItemClick = (tab: ManagerTab) => {
    onSelectTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'MG';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
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

      {/* Sidebar Container - Identical style & structure to Admin Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#073F37] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-[#06352F] flex-shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Branding & Business Unit Badge */}
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {customLogo ? (
                <div className="h-10 max-w-[140px] px-2 py-1 bg-white rounded-lg flex items-center justify-center shadow-xs border border-white/40">
                  <img
                    src={customLogo}
                    alt="Brand Logo"
                    className="max-h-8 max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-[#0E5A4F] border border-[#22A06B]/30 flex items-center justify-center font-bold text-xs tracking-wider text-white shadow-sm shrink-0">
                  <span>SO</span>
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white leading-none">
                  {customLogo ? 'CUSTOM' : 'SAMURA ONE'}
                </h1>
                <p className="text-[10px] text-[#22A06B] font-medium tracking-widest uppercase mt-1 opacity-90">
                  Unit Manager Portal
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            {isOpenMobile && (
              <button
                onClick={onCloseMobile}
                className="p-1 rounded text-white/70 hover:text-white hover:bg-[#0E5A4F] lg:hidden cursor-pointer"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Assigned Unit Badge */}
          <div className="mt-3 flex items-center gap-1.5 bg-[#0E5A4F] px-2.5 py-1.5 rounded-md text-[11px] font-mono text-[#D5E2DC] font-semibold tracking-wide border border-white/10 max-w-full">
            <Building2 className="w-3.5 h-3.5 text-[#22A06B] shrink-0" />
            <span className="truncate">{businessName}</span>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-5 text-xs select-none">
          {/* Command Group */}
          <div>
            <p className="text-[10px] text-[#71807B] uppercase font-bold tracking-wider mb-2 px-2">
              Unit Navigation
            </p>
            <ul className="space-y-1" role="list">
              {commandNavItems.map((item) => {
                const isActive = activeTab === item.id;
                const IconComponent = item.icon;

                return (
                  <li key={item.id}>
                    <button
                      id={`manager-nav-${item.id}`}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full px-3 py-2.5 rounded-md flex items-center transition-colors cursor-pointer text-left text-xs font-medium ${
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
                      <div className="min-w-0 flex-1">
                        <span className="truncate block font-semibold">{item.name}</span>
                      </div>

                      {item.badge !== undefined && (
                        <span
                          className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                            isActive
                              ? 'bg-[#22A06B] text-white'
                              : 'bg-white/10 text-white/90'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Unit Scope Info Box */}
          <div className="px-2 pt-2">
            <div className="p-3 bg-[#06352F] rounded-lg border border-[#0E5A4F]/60 text-[11px] space-y-2">
              <div className="flex items-center gap-2 text-[#22A06B] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authorized Scope</span>
              </div>
              <p className="text-[#A3B8B0] text-[10px] leading-relaxed">
                You are managing <strong className="text-white">{businessName}</strong>. Sales records, dues, and product prices sync live to Group HQ.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Footer: Manager In-Charge View */}
        <div className="p-4 bg-[#06352F] mt-auto border-t border-[#094A41]/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#0E5A4F] flex items-center justify-center text-xs font-bold border border-white/10 text-white shrink-0">
                {getInitials(user?.name)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Unit Manager'}</p>
                <p className="text-[10px] text-[#22A06B] uppercase tracking-tighter font-semibold truncate">
                  Unit In-Charge
                </p>
              </div>
            </div>

            <button
              id="manager-sidebar-logout"
              onClick={logout}
              className="p-1.5 text-white/60 hover:text-red-300 hover:bg-red-500/20 rounded-md transition-colors cursor-pointer shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
