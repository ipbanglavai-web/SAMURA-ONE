import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useLogo } from '../../context/LogoContext';
import { ManagerTab } from './ManagerSidebar';
import {
  Menu,
  Building,
  LogOut,
  Shield,
  Check,
  Bell,
  Building2,
  Calendar,
  ChevronDown,
  Clock,
  CalendarDays
} from 'lucide-react';

interface ManagerHeaderProps {
  activeTab: ManagerTab;
  onOpenMobileMenu: () => void;
  businessName: string;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const ManagerHeader: React.FC<ManagerHeaderProps> = ({
  activeTab,
  onOpenMobileMenu,
  businessName,
  selectedDate,
  onSelectDate
}) => {
  const { user, logout } = useAuth();
  const { customLogo } = useLogo();
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [customDateInput, setCustomDateInput] = useState('');
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const dateRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setDateDropdownOpen(false);
        setShowCustomPicker(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageInfo = (tab: ManagerTab) => {
    switch (tab) {
      case 'overview':
        return {
          title: `${businessName} · Unit Overview`,
          subtitle: 'Real-time sales, collections, due summaries & today metrics'
        };
      case 'sales_due':
        return {
          title: `${businessName} · Sales & Due Ledger`,
          subtitle: 'Daily customer invoices, collection status, dues & voucher receipts'
        };
      case 'customers':
        return {
          title: `${businessName} · Customer Directory & Dues`,
          subtitle: 'Customer profiles, contact details, references & running due balances'
        };
      case 'products':
        return {
          title: `${businessName} · Products & Pricing`,
          subtitle: 'Unit item catalog, stock availability & per-unit sales rates'
        };
      default:
        return {
          title: `${businessName} · Manager Portal`,
          subtitle: 'AL SAMURA Group Subsidiary Operations'
        };
    }
  };

  const pageInfo = getPageInfo(activeTab);

  const datePresets = [
    { label: 'Today (Default)', value: 'Today' },
    { label: 'Yesterday', value: 'Yesterday' },
    { label: 'Last 7 Days', value: 'Last 7 Days' },
    { label: 'This Month', value: 'This Month' },
    { label: 'All Records', value: 'All Records' }
  ];

  const handleApplyCustomDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDateInput) {
      onSelectDate(customDateInput);
      setDateDropdownOpen(false);
      setShowCustomPicker(false);
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
    <header className="h-14 bg-white border-b border-[#E5EAE8] flex items-center justify-between px-4 sm:px-6 flex-shrink-0 sticky top-0 z-30 transition-colors">
      {/* Left: Mobile Toggle & Page Info */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="p-1.5 -ml-1 text-[#4B5563] hover:text-[#111827] hover:bg-[#F6F8F7] rounded-md lg:hidden cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Custom Brand Logo if uploaded */}
        {customLogo && (
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="h-8 max-w-[120px] sm:max-w-[140px] px-1 flex items-center justify-center">
              <img
                src={customLogo}
                alt="Brand Logo"
                className="max-h-7 max-w-full object-contain"
              />
            </div>
            <div className="h-5 w-px bg-[#E5EAE8] hidden sm:block" />
          </div>
        )}

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-[#111827] tracking-tight leading-snug truncate">
            {pageInfo.title}
          </h1>
          <p className="text-[10px] sm:text-xs text-[#4B5563] font-medium leading-none truncate">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3 shrink-0">
        {/* Date Selector Dropdown */}
        <div className="relative" ref={dateRef}>
          <button
            id="manager-header-date-selector"
            onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
            className="text-xs font-bold px-3 py-1.5 border border-[#0E5A4F]/40 hover:border-[#0E5A4F] rounded-lg flex items-center bg-[#F6F8F7] hover:bg-[#E6F4ED] shadow-2xs transition-all cursor-pointer text-[#0A4A41] active:scale-98"
            title="Change Date Filter"
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#0E5A4F]" />
            <span className="font-semibold text-[#111827]">
              {selectedDate}
            </span>
            <ChevronDown className={`ml-1.5 w-3.5 h-3.5 text-[#0E5A4F] transition-transform duration-200 ${dateDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dateDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5EAE8] rounded-xl shadow-xl py-1.5 z-50 text-xs font-medium animate-fade-in">
              <div className="px-3 py-1.5 text-[10px] font-bold text-[#71807B] uppercase tracking-wider border-b border-[#E5EAE8]">
                Select Date Range
              </div>

              {datePresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => {
                    onSelectDate(preset.value);
                    setDateDropdownOpen(false);
                    setShowCustomPicker(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#F6F8F7] cursor-pointer transition-colors ${
                    selectedDate === preset.value
                      ? 'text-[#0E5A4F] font-bold bg-[#E6F4ED]'
                      : 'text-[#111827]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#71807B]" />
                    <span className="block font-medium">{preset.label}</span>
                  </div>
                  {selectedDate === preset.value && (
                    <Check className="w-4 h-4 text-[#0E5A4F] stroke-[2.5]" />
                  )}
                </button>
              ))}

              <div className="border-t border-[#E5EAE8] mt-1 pt-1 px-3 py-1">
                {!showCustomPicker ? (
                  <button
                    onClick={() => setShowCustomPicker(true)}
                    className="w-full text-left py-1.5 text-xs text-[#0E5A4F] font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>+ Select Specific Date</span>
                  </button>
                ) : (
                  <form onSubmit={handleApplyCustomDate} className="space-y-2 py-1">
                    <label className="text-[10px] font-bold text-[#4B5563] block">
                      Choose from Calendar:
                    </label>
                    <input
                      type="date"
                      value={customDateInput}
                      onChange={(e) => setCustomDateInput(e.target.value)}
                      className="w-full text-xs p-1.5 rounded-lg border border-[#E5EAE8] bg-[#F6F8F7] text-[#111827] focus:outline-none focus:border-[#0E5A4F]"
                      required
                    />
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        type="submit"
                        className="flex-1 py-1 rounded-lg bg-[#0E5A4F] text-white text-xs font-bold hover:bg-[#073F37] cursor-pointer"
                      >
                        Apply
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCustomPicker(false)}
                        className="py-1 px-2 rounded-lg border border-[#E5EAE8] text-xs text-[#4B5563] hover:bg-[#F6F8F7] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Assigned Business Unit Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#E6F4ED] border border-[#22A06B]/30 rounded-md text-xs font-bold text-[#0E5A4F]">
          <Building2 className="w-3.5 h-3.5 text-[#22A06B]" />
          <span className="truncate max-w-[140px]">{businessName}</span>
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            id="manager-header-notification-bell-btn"
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="w-8 h-8 rounded-full bg-[#F6F8F7] flex items-center justify-center text-xs text-[#4B5563] border border-[#E5EAE8] cursor-pointer hover:text-[#111827] hover:bg-[#E5EAE8] transition-colors relative"
            aria-label="Unit notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#22A06B] rounded-full border border-white"></span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5EAE8] rounded-xl shadow-xl py-2 z-50 text-xs">
              <div className="px-4 py-2 border-b border-[#E5EAE8] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#111827]">{businessName} Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#22A06B]/10 text-[#22A06B] text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => setUnreadCount(0)}
                    className="text-[11px] text-[#0E5A4F] hover:underline font-semibold cursor-pointer"
                  >
                    Mark read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#E5EAE8]">
                <div className="p-3 hover:bg-[#F6F8F7] transition-colors cursor-pointer flex gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#22A06B] mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-[#111827]">Voucher Approved</p>
                    <p className="text-[#4B5563] text-[11px] mt-0.5">Head Office approved your transport voucher receipt.</p>
                    <span className="text-[10px] text-[#9CA3AF] mt-1 block">25 mins ago</span>
                  </div>
                </div>

                <div className="p-3 hover:bg-[#F6F8F7] transition-colors cursor-pointer flex gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#22A06B] mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-[#111827]">Due Payment Received</p>
                    <p className="text-[#4B5563] text-[11px] mt-0.5">Customer submitted ৳50,000 partial payment entry.</p>
                    <span className="text-[10px] text-[#9CA3AF] mt-1 block">2 hours ago</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E5EAE8] pt-2 px-3 text-center">
                <span className="text-[11px] text-[#0E5A4F] font-bold hover:underline cursor-pointer">
                  Unit Activity History
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            id="manager-header-avatar-btn"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="w-8 h-8 rounded-full bg-[#0E5A4F] text-white flex items-center justify-center text-[10px] font-bold shadow-xs hover:bg-[#073F37] transition-colors cursor-pointer border border-[#22A06B]/30"
            aria-label="User profile menu"
          >
            {getInitials(user?.name)}
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E5EAE8] rounded-xl shadow-xl py-2 z-50 text-xs">
              {/* User info */}
              <div className="px-4 py-2 border-b border-[#E5EAE8]">
                <p className="font-semibold text-sm text-[#111827]">{user?.name || 'Unit Manager'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] text-[#0E5A4F] font-bold">{businessName}</span>
                  <span className="text-[10px] text-[#4B5563]">· In-Charge</span>
                </div>
                <p className="text-[11px] text-[#4B5563] font-mono mt-0.5">{user?.email}</p>
              </div>

              <div className="py-1">
                <div className="px-4 py-1.5 flex items-center gap-2 text-[#4B5563]">
                  <Shield className="w-3.5 h-3.5 text-[#22A06B]" />
                  <span>Role: Business Unit Manager</span>
                </div>
                <div className="px-4 py-1.5 flex items-center gap-2 text-[#4B5563]">
                  <Building className="w-3.5 h-3.5 text-[#0E5A4F]" />
                  <span>Enterprise: {businessName}</span>
                </div>
              </div>

              <div className="border-t border-[#E5EAE8] pt-1 mt-1">
                <button
                  id="manager-header-logout-btn"
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

