import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useLogo } from '../../context/LogoContext';
import { BusinessHealthItem } from '../../types';
import {
  Building2,
  Briefcase,
  ArrowRight,
  Search,
  LogOut,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CheckCircle2,
  AlertTriangle,
  Layers
} from 'lucide-react';

interface GeneralManagerBusinessSelectPageProps {
  businesses: BusinessHealthItem[];
  onSelectBusiness: (businessId: string, businessName: string) => void;
}

export const GeneralManagerBusinessSelectPage: React.FC<GeneralManagerBusinessSelectPageProps> = ({
  businesses,
  onSelectBusiness
}) => {
  const { user, logout } = useAuth();
  const { customLogo } = useLogo();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Healthy' | 'Watch' | 'Critical'>('All');

  // Determine assigned businesses for this General Manager
  const assignedIds = user?.assignedBusinessIds || [];
  const isAllAssigned = assignedIds.length === 0 || assignedIds.includes('all') || assignedIds.length >= businesses.length;

  const accessibleBusinesses = businesses.filter((b) => {
    if (isAllAssigned) return true;
    return assignedIds.includes(b.id) || (user?.assignedBusinessNames && user.assignedBusinessNames.includes(b.name));
  });

  const filteredBusinesses = accessibleBusinesses.filter((b) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = b.name.toLowerCase().includes(term) || (b.manager && b.manager.toLowerCase().includes(term));
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F6F8F7] text-[#18211F] flex flex-col font-['Inter',sans-serif]">
      {/* Top Executive Header */}
      <header className="bg-[#073F37] text-white border-b border-[#0E5A4F] px-4 sm:px-8 py-3.5 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {customLogo ? (
              <div className="h-9 px-2 py-0.5 bg-white rounded-lg flex items-center justify-center border border-white/20">
                <img src={customLogo} alt="Brand Logo" className="max-h-7 max-w-[120px] object-contain" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#0E5A4F] border border-[#22A06B]/40 flex items-center justify-center font-bold text-xs text-white">
                AS
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight leading-none">
                  AL SAMURA GROUP
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0E5A4F] text-[#E6F4ED] border border-[#22A06B]/30 flex items-center gap-1">
                  <Briefcase className="w-2.5 h-2.5 text-[#22A06B]" />
                  General Manager
                </span>
              </div>
              <p className="text-[11px] text-[#A3B8B0] font-medium">
                Multi-Unit Enterprise Command Gateway
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-white">{user?.name || 'General Manager'}</span>
              <span className="text-[10px] text-[#A3B8B0]">{user?.email}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#0E5A4F] border border-[#22A06B]/30 flex items-center justify-center text-xs font-bold text-white">
              {user?.avatarInitials || 'GM'}
            </div>
            <button
              onClick={logout}
              id="gm-logout-btn"
              className="p-1.5 text-[#A3B8B0] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5EAE8] shadow-xs relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#E6F4ED] rounded-full blur-3xl opacity-60 pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#E6F4ED] text-[#0E5A4F] text-xs font-semibold mb-3 border border-[#22A06B]/20">
              <Briefcase className="w-3.5 h-3.5 text-[#0E5A4F]" />
              <span>Executive Business Selection</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18211F] tracking-tight">
              Select a Subsidiary Business Unit to Manage
            </h2>
            <p className="text-xs sm:text-sm text-[#71807B] mt-2 leading-relaxed">
              Welcome, <span className="font-semibold text-[#18211F]">{user?.name}</span>. You have executive access to{' '}
              <span className="font-semibold text-[#0E5A4F]">{accessibleBusinesses.length} assigned business units</span>.
              Select any unit below to instantly open its dedicated command dashboard with full manager privileges (Sales & Ledger, Due Collections, Inventory, Vouchers, and Customers).
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-6 pt-5 border-t border-[#E5EAE8] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71807B]" />
              <input
                type="text"
                id="search-assigned-business"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search assigned business..."
                className="w-full text-xs pl-9 pr-3 py-2 bg-[#F6F8F7] border border-[#E5EAE8] rounded-lg text-[#18211F] focus:outline-none focus:border-[#0E5A4F]"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              {(['All', 'Healthy', 'Watch', 'Critical'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === status
                      ? 'bg-[#0E5A4F] text-white shadow-2xs font-bold'
                      : 'bg-[#F6F8F7] text-[#71807B] hover:text-[#18211F] hover:bg-[#E5EAE8]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Business Unit Cards Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0E5A4F]" />
              <h3 className="text-sm font-bold text-[#18211F] uppercase tracking-wider">
                Assigned Business Units ({filteredBusinesses.length})
              </h3>
            </div>
            <span className="text-xs text-[#71807B]">
              Click on any business to open its Unit Overview
            </span>
          </div>

          {filteredBusinesses.length === 0 ? (
            <div className="bg-white rounded-xl p-10 border border-[#E5EAE8] text-center">
              <Building2 className="w-10 h-10 text-[#71807B] mx-auto mb-3 opacity-50" />
              <h4 className="text-sm font-bold text-[#18211F]">No Business Units Match Your Search</h4>
              <p className="text-xs text-[#71807B] mt-1">Try clearing your search query or filter options.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredBusinesses.map((biz) => {
                const isHealthy = biz.status === 'Healthy';
                const isWatch = biz.status === 'Watch';
                const isCritical = biz.status === 'Critical';

                return (
                  <div
                    key={biz.id}
                    id={`gm-select-biz-${biz.id}`}
                    onClick={() => onSelectBusiness(biz.id, biz.name)}
                    className="bg-white rounded-xl border border-[#E5EAE8] hover:border-[#0E5A4F] hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
                  >
                    {/* Top Accent Strip */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 transition-colors ${
                        isHealthy ? 'bg-[#22A06B]' : isWatch ? 'bg-[#E59819]' : 'bg-[#D9534F]'
                      }`}
                    />

                    <div>
                      {/* Card Header: Name & Status */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-lg bg-[#E6F4ED] text-[#0E5A4F] flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-[#0E5A4F] group-hover:text-white transition-colors">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-[#18211F] group-hover:text-[#0E5A4F] transition-colors leading-snug">
                              {biz.name}
                            </h4>
                            <span className="text-[11px] text-[#71807B]">
                              Unit Manager: <strong className="text-[#18211F]">{biz.manager || 'Assigned'}</strong>
                            </span>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold shrink-0 flex items-center gap-1 ${
                            isHealthy
                              ? 'bg-[#DCFCE7] text-[#15803D]'
                              : isWatch
                              ? 'bg-[#FEF9C3] text-[#A16207]'
                              : 'bg-[#FEE2E2] text-[#B91C1C]'
                          }`}
                        >
                          {isHealthy ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                          {biz.status}
                        </span>
                      </div>

                      {/* Performance Metrics Row */}
                      <div className="grid grid-cols-2 gap-2.5 py-3 my-3 border-y border-[#E5EAE8] bg-[#F6F8F7]/50 rounded-lg px-3">
                        <div>
                          <span className="block text-[10px] text-[#71807B] uppercase font-semibold">
                            Today Sales
                          </span>
                          <span className="text-sm font-bold text-[#18211F] font-mono">
                            {biz.sales || '৳ 0.0L'}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-[#71807B] uppercase font-semibold">
                            Collection Rate
                          </span>
                          <span className="text-sm font-bold text-[#0E5A4F] font-mono">
                            {biz.collectionRate || '85.0%'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-[#71807B] font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#22A06B]" />
                        Full Manager Controls
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBusiness(biz.id, biz.name);
                        }}
                        className="px-3 py-1.5 bg-[#0E5A4F] group-hover:bg-[#073F37] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <span>Open Dashboard</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
