import React, { useState } from 'react';
import { BusinessHealthItem, BusinessManager } from '../../types';
import { AddManagerModal } from '../../components/modals/AddManagerModal';
import { BusinessUnitDetailsModal } from '../../components/modals/BusinessUnitDetailsModal';
import { getBusinessGrowthData } from '../../utils/businessCalculations';
import {
  Building2,
  Plus,
  Trash2,
  Search,
  ArrowUpRight,
  AlertTriangle,
  X,
  CheckCircle2,
  UserCheck,
  ShieldCheck,
  AlertCircle,
  UserPlus,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface BusinessesPageProps {
  businesses: BusinessHealthItem[];
  managers?: BusinessManager[];
  onAddBusiness: (newBiz: Omit<BusinessHealthItem, 'id'>) => void;
  onDeleteBusiness: (id: string) => void;
  onAddManager?: (newManager: {
    name: string;
    phone: string;
    email: string;
    password: string;
    nid: string;
    businessId: string;
    businessName: string;
    managerType?: 'unit_manager' | 'general_manager';
    assignedBusinessIds?: string[];
    assignedBusinessNames?: string[];
  }) => void;
}

export const BusinessesPage: React.FC<BusinessesPageProps> = ({
  businesses,
  managers = [],
  onAddBusiness,
  onDeleteBusiness,
  onAddManager
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Healthy' | 'Watch' | 'Critical'>('all');

  // Add Business Modal State
  const [isAddBusinessModalOpen, setIsAddBusinessModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [sales, setSales] = useState('');
  const [salesGrowth, setSalesGrowth] = useState('+8.5%');
  const [status, setStatus] = useState<'Healthy' | 'Watch' | 'Critical'>('Healthy');
  const [collectionRate, setCollectionRate] = useState('85.0%');
  const [margin, setMargin] = useState('12.5%');
  const [manager, setManager] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Business Unit Details Modal State (opens live manager data submitted for Elenga Fruits / unit)
  const [selectedBusinessForDetails, setSelectedBusinessForDetails] = useState<BusinessHealthItem | null>(null);

  // Add Manager Modal State (for business card '+ Add Manager' action)
  const [isAddManagerModalOpen, setIsAddManagerModalOpen] = useState(false);
  const [selectedBusinessForManager, setSelectedBusinessForManager] = useState<string | undefined>(undefined);

  // Delete Confirmation Modal
  const [businessToDelete, setBusinessToDelete] = useState<BusinessHealthItem | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenAddBusinessModal = () => {
    setName('');
    setSales('৳ 10.0L');
    setSalesGrowth('+8.5%');
    setStatus('Healthy');
    setCollectionRate('85.0%');
    setMargin('12.5%');
    setManager('');
    setFormError(null);
    setIsAddBusinessModalOpen(true);
  };

  const handleBusinessFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Business unit name is required.');
      return;
    }

    const formattedSales = sales.trim().startsWith('৳') ? sales.trim() : `৳ ${sales.trim()}`;
    const parsedGrowth = parseFloat(salesGrowth.replace(/[+%]/g, ''));
    const finalGrowth = isNaN(parsedGrowth) ? (status === 'Healthy' ? 8.5 : -5.0) : parsedGrowth;
    const finalStatus: 'Healthy' | 'Watch' | 'Critical' = finalGrowth >= 0 ? 'Healthy' : (finalGrowth >= -10 ? 'Watch' : 'Critical');

    onAddBusiness({
      name: name.trim(),
      sales: formattedSales || '৳ 0.0L',
      status: finalStatus,
      salesGrowth: finalGrowth,
      collectionRate: collectionRate.trim() || '80.0%',
      margin: margin.trim() || '10.0%',
      manager: manager.trim() || 'Assigned Officer'
    });

    setIsAddBusinessModalOpen(false);
    showToast(`"${name.trim()}" added successfully!`);
  };

  const handleConfirmDeleteBusiness = () => {
    if (businessToDelete) {
      const deletedName = businessToDelete.name;
      onDeleteBusiness(businessToDelete.id);
      setBusinessToDelete(null);
      showToast(`"${deletedName}" and all associated sales records were removed.`);
    }
  };

  // Filtered Businesses
  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.manager && b.manager.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const healthyCount = businesses.filter((b) => b.status === 'Healthy').length;
  const watchCount = businesses.filter((b) => b.status === 'Watch' || b.status === 'Critical').length;

  return (
    <div className="space-y-4 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#073F37] text-white px-4 py-3 rounded-lg shadow-xl border border-[#22A06B] flex items-center gap-2.5 text-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#22A06B] shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner & Action Bar */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E5EAE8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#E6F4ED] rounded-lg text-[#0E5A4F]">
              <Building2 className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#18211F] tracking-tight">
              AL SAMURA Business Units
            </h2>
          </div>
          <p className="text-xs text-[#71807B] mt-1">
            Overview of group business units, health metrics, sales growth, and collection ratios
          </p>
        </div>

        {/* Right Action: Search, Filter & Add Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71807B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search business unit..."
              className="text-xs pl-8 pr-3 py-1.5 bg-[#F6F8F7] border border-[#E5EAE8] rounded-md focus:outline-none focus:border-[#0E5A4F] text-[#18211F] placeholder-[#71807B] w-48 sm:w-60"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="text-xs px-2.5 py-1.5 bg-[#F6F8F7] border border-[#E5EAE8] rounded-md text-[#18211F] focus:outline-none focus:border-[#0E5A4F] cursor-pointer font-medium"
          >
            <option value="all">All Statuses ({businesses.length})</option>
            <option value="Healthy">Healthy Only ({healthyCount})</option>
            <option value="Watch">Watch / Risk ({watchCount})</option>
          </select>

          {/* Add Business Unit Button */}
          <button
            id="admin-add-business-btn"
            onClick={handleOpenAddBusinessModal}
            className="px-3.5 py-1.5 bg-[#0E5A4F] hover:bg-[#073F37] text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Business Unit</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-[#E5EAE8] shadow-2xs">
          <span className="text-[10px] text-[#71807B] uppercase font-bold tracking-wider block">
            Total Business Units
          </span>
          <div className="text-xl font-bold text-[#18211F] mt-1">{businesses.length} Units</div>
          <span className="text-[10px] text-[#0E5A4F] font-semibold mt-0.5 block">Active Subsidiaries</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E5EAE8] shadow-2xs">
          <span className="text-[10px] text-[#71807B] uppercase font-bold tracking-wider block">
            Healthy Units
          </span>
          <div className="text-xl font-bold text-[#22A06B] mt-1">{healthyCount} Units</div>
          <span className="text-[10px] text-[#22A06B] font-semibold mt-0.5 block">Target Achieved</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E5EAE8] shadow-2xs">
          <span className="text-[10px] text-[#71807B] uppercase font-bold tracking-wider block">
            Watch / Attention List
          </span>
          <div className="text-xl font-bold text-[#D9A441] mt-1">{watchCount} Units</div>
          <span className="text-[10px] text-[#D9A441] font-semibold mt-0.5 block">Supervision Flagged</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E5EAE8] shadow-2xs">
          <span className="text-[10px] text-[#71807B] uppercase font-bold tracking-wider block">
            Group Operations
          </span>
          <div className="text-xl font-bold text-[#18211F] mt-1">Multi-Sector</div>
          <span className="text-[10px] text-[#71807B] font-semibold mt-0.5 block">Agro, Hospital, Trade</span>
        </div>
      </div>

      {/* BUSINESS UNITS GRID */}
      {filteredBusinesses.length === 0 ? (
        <div className="bg-white rounded-xl p-10 border border-[#E5EAE8] text-center shadow-xs">
          <AlertCircle className="w-8 h-8 text-[#71807B] mx-auto mb-2 opacity-50" />
          <h3 className="text-sm font-bold text-[#18211F]">কোনো বিজনেস ইউনিট পাওয়া যায়নি</h3>
          <p className="text-xs text-[#71807B] mt-1">
            অনুগ্রহ করে সার্চ ফিল্টার পরিবর্তন করুন অথবা নতুন বিজনেস ইউনিট যুক্ত করুন।
          </p>
          <button
            onClick={handleOpenAddBusinessModal}
            className="mt-4 px-4 py-2 bg-[#0E5A4F] hover:bg-[#073F37] text-white rounded-md text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Business Unit</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBusinesses.map((biz) => {
            const assignedMgr = managers.find(
              (m) =>
                m.businessId === biz.id ||
                m.businessName.toLowerCase() === biz.name.toLowerCase()
            );
            const isUnassigned =
              !assignedMgr &&
              (!biz.manager ||
                biz.manager.toLowerCase() === 'none' ||
                biz.manager.toLowerCase() === 'unassigned' ||
                biz.manager.trim() === '');
            const displayManagerName = assignedMgr
              ? assignedMgr.name
              : !isUnassigned
              ? biz.manager
              : null;

            return (
              <div
                key={biz.id}
                className="bg-white rounded-xl p-4 sm:p-5 border border-[#E5EAE8] shadow-xs hover:shadow-sm hover:border-[#0E5A4F] transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Name + Status + Delete button */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-[#71807B] uppercase tracking-wider block">
                        Subsidiary Unit
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#18211F] mt-0.5 truncate group-hover:text-[#0E5A4F] transition-colors">
                        {biz.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {(() => {
                        const growthInfo = getBusinessGrowthData(biz);
                        return (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-black tracking-wide border shadow-2xs ${growthInfo.bgClass} ${growthInfo.textClass} ${growthInfo.borderClass}`}
                            title={`24h Sales difference: ${growthInfo.badgeText}`}
                          >
                            {growthInfo.isPositive ? (
                              <TrendingUp className="w-3.5 h-3.5 text-[#15803D] shrink-0 stroke-[2.5]" />
                            ) : (
                              <TrendingDown className="w-3.5 h-3.5 text-[#B91C1C] shrink-0 stroke-[2.5]" />
                            )}
                            <span className="font-extrabold">{growthInfo.badgeText}</span>
                          </span>
                        );
                      })()}

                      {/* Admin Delete Action Button */}
                      <button
                        id={`delete-biz-${biz.id}`}
                        onClick={() => setBusinessToDelete(biz)}
                        className="p-1 text-[#71807B] hover:text-[#D9534F] hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title={`Delete ${biz.name}`}
                        aria-label={`Delete ${biz.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 3-Column Metrics Box */}
                  <div className="grid grid-cols-3 gap-2 my-3.5 pt-3 border-t border-[#E5EAE8] text-center">
                    <div className="p-2 rounded-lg bg-[#F6F8F7] border border-[#E5EAE8]/40">
                      <span className="text-[9px] text-[#71807B] uppercase font-bold block truncate">
                        Today Sales
                      </span>
                      <span className="text-xs font-bold text-[#18211F] mt-0.5 block truncate">
                        {biz.sales}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-[#F6F8F7] border border-[#E5EAE8]/40">
                      <span className="text-[9px] text-[#71807B] uppercase font-bold block truncate">
                        Collection
                      </span>
                      <span className="text-xs font-bold text-[#0E5A4F] mt-0.5 block truncate">
                        {biz.collectionRate || '85.0%'}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-[#F6F8F7] border border-[#E5EAE8]/40">
                      <span className="text-[9px] text-[#71807B] uppercase font-bold block truncate">
                        Margin
                      </span>
                      <span className="text-xs font-bold text-[#18211F] mt-0.5 block truncate">
                        {biz.margin || '12.0%'}
                      </span>
                    </div>
                  </div>

                  {/* In-Charge Officer Info */}
                  {displayManagerName ? (
                    <div className="p-2.5 bg-[#F6F8F7] rounded-lg border border-[#E5EAE8]/60 mb-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#71807B] text-[11px]">Assigned In-Charge:</span>
                        <div className="flex items-center gap-1 font-semibold text-[#18211F]">
                          <UserCheck className="w-3.5 h-3.5 text-[#0E5A4F]" />
                          <span>{displayManagerName}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-[#FFF9F2] rounded-lg border border-[#FFE7C2] mb-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#71807B] text-[11px]">Assigned In-Charge:</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white text-[#D9534F] border border-red-200 shadow-2xs">
                            None
                          </span>
                        </div>
                        <button
                          id={`add-manager-for-${biz.id}`}
                          type="button"
                          onClick={() => {
                            setSelectedBusinessForManager(biz.id);
                            setIsAddManagerModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-[#0E5A4F] hover:bg-[#073F37] text-white rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>Add Manager</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-2.5 border-t border-[#E5EAE8] flex items-center justify-between text-[11px] text-[#71807B]">
                  <span className="text-[10px] text-[#22A06B] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#22A06B]" />
                    Active Unit
                  </span>
                  <button
                    type="button"
                    id={`unit-details-${biz.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBusinessForDetails(biz);
                    }}
                    className="px-2.5 py-1 bg-[#E6F4ED] hover:bg-[#D1ECE0] text-[#0E5A4F] rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-2xs border border-[#22A06B]/20"
                  >
                    <span>Unit Details</span>
                    <ArrowUpRight className="w-3 h-3 text-[#0E5A4F]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ----------------- ADD BUSINESS UNIT MODAL ----------------- */}
      {isAddBusinessModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-[#E5EAE8] relative animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE8]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#E6F4ED] rounded-lg text-[#0E5A4F]">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#18211F] tracking-tight">
                    Add New Business Unit (নতুন বিজনেস ইউনিট যোগ করুন)
                  </h3>
                  <p className="text-[11px] text-[#71807B]">
                    Enter subsidiary details to include in group monitoring & reports
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddBusinessModalOpen(false)}
                className="p-1 text-[#71807B] hover:text-[#18211F] hover:bg-[#F6F8F7] rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error banner */}
            {formError && (
              <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{formError}</span>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleBusinessFormSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#18211F] mb-1">
                  Business Unit Name (প্রতিষ্ঠানের নাম) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="e.g. AL SAMURA Logistics & Supply"
                  className="w-full px-3 py-2 text-xs bg-[#F6F8F7] border border-[#E5EAE8] rounded-lg focus:outline-none focus:border-[#0E5A4F] text-[#18211F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18211F] mb-1">
                    Today's Sales (বিক্রির পরিমাণ)
                  </label>
                  <input
                    type="text"
                    value={sales}
                    onChange={(e) => setSales(e.target.value)}
                    placeholder="e.g. ৳ 12.5L"
                    className="w-full px-3 py-2 text-xs bg-[#F6F8F7] border border-[#E5EAE8] rounded-lg focus:outline-none focus:border-[#0E5A4F] text-[#18211F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18211F] mb-1">
                    Sales Growth / Diff (%)
                  </label>
                  <input
                    type="text"
                    value={salesGrowth}
                    onChange={(e) => {
                      setSalesGrowth(e.target.value);
                      const val = parseFloat(e.target.value.replace(/[+%]/g, ''));
                      if (!isNaN(val)) {
                        setStatus(val >= 0 ? 'Healthy' : (val >= -10 ? 'Watch' : 'Critical'));
                      }
                    }}
                    placeholder="e.g. +8.5% or -4.2%"
                    className="w-full px-3 py-2 text-xs bg-[#F6F8F7] border border-[#E5EAE8] rounded-lg focus:outline-none focus:border-[#0E5A4F] text-[#18211F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18211F] mb-1">
                    Health Status (অবস্থা)
                  </label>
                  <select
                    value={status}
                    onChange={(e) => {
                      const newStatus = e.target.value as 'Healthy' | 'Watch' | 'Critical';
                      setStatus(newStatus);
                      if (newStatus === 'Healthy') setSalesGrowth('+8.5%');
                      else if (newStatus === 'Watch') setSalesGrowth('-4.5%');
                      else setSalesGrowth('-12.0%');
                    }}
                    className="w-full px-3 py-2 text-xs bg-[#F6F8F7] border border-[#E5EAE8] rounded-lg focus:outline-none focus:border-[#0E5A4F] text-[#18211F] cursor-pointer"
                  >
                    <option value="Healthy">Healthy (+ Growth / স্বাভাবিক)</option>
                    <option value="Watch">Watch (- Down / পর্যবেক্ষণাধীন)</option>
                    <option value="Critical">Critical (- High Down / ঝুঁকিপূর্ণ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18211F] mb-1">
                    Collection Rate (আদায়ের হার)
                  </label>
                  <input
                    type="text"
                    value={collectionRate}
                    onChange={(e) => setCollectionRate(e.target.value)}
                    placeholder="e.g. 85.0%"
                    className="w-full px-3 py-2 text-xs bg-[#F6F8F7] border border-[#E5EAE8] rounded-lg focus:outline-none focus:border-[#0E5A4F] text-[#18211F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18211F] mb-1">
                    Profit Margin (মুনাফার মার্জিন)
                  </label>
                  <input
                    type="text"
                    value={margin}
                    onChange={(e) => setMargin(e.target.value)}
                    placeholder="e.g. 12.5%"
                    className="w-full px-3 py-2 text-xs bg-[#F6F8F7] border border-[#E5EAE8] rounded-lg focus:outline-none focus:border-[#0E5A4F] text-[#18211F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18211F] mb-1">
                  In-Charge Officer Name
                </label>
                <input
                  type="text"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  placeholder="e.g. Md. Shafiul Alam"
                  className="w-full px-3 py-2 text-xs bg-[#F6F8F7] border border-[#E5EAE8] rounded-lg focus:outline-none focus:border-[#0E5A4F] text-[#18211F]"
                />
              </div>

              {/* Form Actions */}
              <div className="pt-3 border-t border-[#E5EAE8] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddBusinessModalOpen(false)}
                  className="px-4 py-2 bg-[#F6F8F7] hover:bg-[#E5EAE8] text-[#18211F] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0E5A4F] hover:bg-[#073F37] text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Unit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- DELETE BUSINESS CONFIRMATION MODAL ----------------- */}
      {businessToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-[#E5EAE8] relative animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#18211F]">
                  Delete Business Unit?
                </h3>
                <p className="text-xs text-[#71807B] mt-0.5">
                  Confirm removal of business unit
                </p>
              </div>
            </div>

            <div className="my-4 p-3.5 bg-red-50/80 border border-red-200 rounded-lg text-xs text-red-800 space-y-1.5">
              <p className="font-semibold text-red-900">
                Are you sure you want to delete <strong className="font-bold underline">"{businessToDelete.name}"</strong>?
              </p>
              <ul className="text-[11px] text-red-700 list-disc list-inside space-y-0.5 pt-1">
                <li>Daily sales entries for this unit will be removed</li>
                <li>Collection ratios will automatically recalculate</li>
                <li>Associated dues, alerts, and pending approvals will be cleared</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setBusinessToDelete(null)}
                className="px-4 py-2 bg-[#F6F8F7] hover:bg-[#E5EAE8] text-[#18211F] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-delete-biz-btn"
                onClick={handleConfirmDeleteBusiness}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Unit</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ----------------- BUSINESS UNIT DETAILS MODAL (Live Manager Submitted Data) ----------------- */}
      {selectedBusinessForDetails && (
        <BusinessUnitDetailsModal
          isOpen={!!selectedBusinessForDetails}
          onClose={() => setSelectedBusinessForDetails(null)}
          business={selectedBusinessForDetails}
          managers={managers}
        />
      )}

      {/* ----------------- ADD MANAGER MODAL (For quick assignment from business card) ----------------- */}
      {onAddManager && (
        <AddManagerModal
          isOpen={isAddManagerModalOpen}
          onClose={() => {
            setIsAddManagerModalOpen(false);
            setSelectedBusinessForManager(undefined);
          }}
          businesses={businesses}
          defaultBusinessId={selectedBusinessForManager}
          onAddManager={(newMgr) => {
            onAddManager(newMgr);
            showToast(`Manager "${newMgr.name}" assigned to "${newMgr.businessName}".`);
          }}
        />
      )}
    </div>
  );
};
