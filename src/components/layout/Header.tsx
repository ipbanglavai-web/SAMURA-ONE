import React, { useState, useRef, useEffect } from 'react';
import { RoutePath, BusinessHealthItem } from '../../types';
import { useAuth } from '../../auth/AuthContext';
import {
  Menu,
  ChevronDown,
  Calendar,
  Building,
  LogOut,
  User,
  Shield,
  Check,
  Bell
} from 'lucide-react';

interface HeaderProps {
  currentPath: RoutePath;
  onOpenMobileMenu: () => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedBusiness: string;
  onSelectBusiness: (business: string) => void;
  businesses?: BusinessHealthItem[];
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onOpenMobileMenu,
  selectedDate,
  onSelectDate,
  selectedBusiness,
  onSelectBusiness,
  businesses
}) => {
  const { user, logout } = useAuth();
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [businessDropdownOpen, setBusinessDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const dateRef = useRef<HTMLDivElement>(null);
  const businessRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setDateDropdownOpen(false);
      }
      if (businessRef.current && !businessRef.current.contains(event.target as Node)) {
        setBusinessDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageInfo = (path: RoutePath) => {
    switch (path) {
      case '/dashboard':
        return { title: 'Group Overview', subtitle: 'Wednesday, 22 July 2026 · Demo environment' };
      case '/businesses':
        return { title: 'Businesses', subtitle: 'Group enterprise performance & subsidiary breakdown' };
      case '/finance':
        return { title: 'Finance & Treasury', subtitle: 'Cash flow, 13 bank accounts, liquidity & balance analysis' };
      case '/sales-collection':
        return { title: 'Sales & Collection', subtitle: 'Daily receivables, realization rates & arat credit ledgers' };
      case '/inventory':
        return { title: 'Inventory Valuation', subtitle: 'Stock balances, cold storage lots, and aging exposure' };
      case '/dhaka-maal-mahajan':
        return { title: 'Dhaka Maal & Mahajan', subtitle: 'Arat commission desks, wholesale challans & mahajan settlements' };
      case '/import-shipments':
        return { title: 'Import Shipments', subtitle: 'Egypt citrus, South Africa apples, sea cargo & landed cost variance' };
      case '/cold-storage':
        return { title: 'Cold Storage Operations', subtitle: 'Chamber C-01 to C-08 telemetry, temperature excursions & capacity' };
      case '/packaging':
        return { title: 'Packaging & Cartons', subtitle: 'Corrugated cartons, strapping materials & unit cost optimization' };
      case '/hospital-summary':
        return { title: 'Hospital Summary', subtitle: 'Healthcare division, patient admissions & pharmacy diagnostics' };
      case '/approvals':
        return { title: 'Executive Approvals', subtitle: '7 pending authorizations requiring Founder review & decision' };
      case '/ask-samura':
        return { title: 'ASK SAMURA', subtitle: 'Executive AI Copilot & Group Intelligence Query Assistant' };
      case '/settings':
        return { title: 'Settings & Governance', subtitle: 'System security, role-based controls & operational parameters' };
      default:
        return { title: 'SAMURA ONE', subtitle: 'AL SAMURA Group Command Platform' };
    }
  };

  const pageInfo = getPageInfo(currentPath);

  const dateOptions = ['Today', 'Yesterday', 'Last 7 Days', 'This Month', 'Q3 2026', 'Custom Range'];
  const businessOptions = [
    'All Businesses',
    ...(businesses && businesses.length > 0
      ? businesses.map((b) => b.name)
      : [
          'Elenga Fruits',
          'Mourin Fruits',
          'Zaafran',
          'Dhaka Mad',
          'Samura Agro Cold Store',
          'Samura General Hospital'
        ])
  ];

  return (
    <header className="h-14 bg-white border-b border-[#E5EAE8] flex items-center justify-between px-4 sm:px-6 flex-shrink-0 sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="p-1.5 -ml-1 text-[#71807B] hover:text-[#18211F] hover:bg-[#F6F8F7] rounded-md lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-[#18211F] tracking-tight leading-snug truncate">
            {pageInfo.title}
          </h1>
          <p className="text-[10px] sm:text-xs text-[#71807B] font-medium leading-none truncate">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3 shrink-0">
        {/* Date Selector Dropdown */}
        <div className="relative" ref={dateRef}>
          <button
            id="header-date-selector"
            onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
            className="text-xs font-semibold px-3 py-1.5 border border-[#E5EAE8] rounded-md flex items-center bg-white shadow-2xs hover:bg-[#F6F8F7] transition-all cursor-pointer text-[#18211F]"
          >
            <span>{selectedDate}</span>
            <span className="ml-2 text-[10px] text-[#71807B]">▼</span>
          </button>

          {dateDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-40 bg-white border border-[#E5EAE8] rounded-lg shadow-lg py-1 z-50 text-xs font-medium">
              {dateOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onSelectDate(opt);
                    setDateDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#F6F8F7] ${
                    selectedDate === opt ? 'text-[#0E5A4F] font-semibold bg-[#0E5A4F]/5' : 'text-[#18211F]'
                  }`}
                >
                  <span>{opt}</span>
                  {selectedDate === opt && <Check className="w-3.5 h-3.5 text-[#0E5A4F]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Business Selector Dropdown */}
        <div className="relative" ref={businessRef}>
          <button
            id="header-business-selector"
            onClick={() => setBusinessDropdownOpen(!businessDropdownOpen)}
            className="text-xs font-semibold px-3 py-1.5 border border-[#E5EAE8] rounded-md flex items-center bg-white shadow-2xs hover:bg-[#F6F8F7] transition-all cursor-pointer text-[#18211F]"
          >
            <span className="max-w-[100px] sm:max-w-[150px] truncate">{selectedBusiness}</span>
            <span className="ml-2 text-[10px] text-[#71807B]">▼</span>
          </button>

          {businessDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-56 bg-white border border-[#E5EAE8] rounded-lg shadow-lg py-1 z-50 text-xs font-medium">
              <div className="px-3 py-1 text-[10px] uppercase font-semibold text-[#71807B] border-b border-[#E5EAE8]">
                Filter by Enterprise
              </div>
              {businessOptions.map((biz) => (
                <button
                  key={biz}
                  onClick={() => {
                    onSelectBusiness(biz);
                    setBusinessDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#F6F8F7] ${
                    selectedBusiness === biz ? 'text-[#0E5A4F] font-semibold bg-[#0E5A4F]/5' : 'text-[#18211F]'
                  }`}
                >
                  <span className="truncate">{biz}</span>
                  {selectedBusiness === biz && <Check className="w-3.5 h-3.5 text-[#0E5A4F] shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="w-8 h-8 rounded-full bg-[#F6F8F7] flex items-center justify-center text-xs text-[#71807B] border border-[#E5EAE8] cursor-pointer hover:text-[#18211F] hover:bg-[#E5EAE8] transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#D9534F] rounded-full"></span>
        </div>

        {/* User Profile Avatar with Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            id="header-user-avatar-btn"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="w-8 h-8 rounded-full bg-[#0E5A4F] text-white flex items-center justify-center text-[10px] font-bold shadow-xs hover:bg-[#073F37] transition-colors cursor-pointer"
            aria-label="User profile menu"
          >
            {user?.avatarInitials || 'ADM'}
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E5EAE8] rounded-xl shadow-xl py-2 z-50 text-xs">
              {/* User info */}
              <div className="px-4 py-2 border-b border-[#E5EAE8]">
                <p className="font-semibold text-sm text-[#18211F]">{user?.name || 'Md. Labibul Haque Sabuz'}</p>
                <p className="text-[11px] text-[#71807B] mt-0.5">{user?.role || 'Founder & Group MD'}</p>
                <p className="text-[11px] text-[#0E5A4F] font-mono mt-0.5">{user?.email || 'admin@admin.com'}</p>
              </div>

              <div className="py-1">
                <div className="px-4 py-1.5 flex items-center gap-2 text-[#71807B]">
                  <Shield className="w-3.5 h-3.5 text-[#22A06B]" />
                  <span>Security Level: Super Administrator</span>
                </div>
                <div className="px-4 py-1.5 flex items-center gap-2 text-[#71807B]">
                  <Bell className="w-3.5 h-3.5 text-[#D9A441]" />
                  <span>7 Pending Executive Actions</span>
                </div>
              </div>

              <div className="border-t border-[#E5EAE8] pt-1 mt-1">
                <button
                  id="header-logout-btn"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-[#D9534F] hover:bg-[#FEF2F2] flex items-center gap-2 font-medium transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
