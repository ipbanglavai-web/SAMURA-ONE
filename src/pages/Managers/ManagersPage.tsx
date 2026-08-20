import React, { useState } from 'react';
import { BusinessHealthItem, BusinessManager } from '../../types';
import { AddManagerModal } from '../../components/modals/AddManagerModal';
import {
  UserCheck,
  Plus,
  Trash2,
  Search,
  Building2,
  Phone,
  Mail,
  CreditCard,
  Lock,
  ShieldCheck,
  Users,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Filter,
  Eye,
  EyeOff,
  UserPlus
} from 'lucide-react';

interface ManagersPageProps {
  managers: BusinessManager[];
  businesses: BusinessHealthItem[];
  onAddManager: (newManager: {
    name: string;
    phone: string;
    email: string;
    password: string;
    nid: string;
    businessId: string;
    businessName: string;
  }) => void;
  onDeleteManager: (id: string) => void;
  onNavigate?: (path: any) => void;
}

export const ManagersPage: React.FC<ManagersPageProps> = ({
  managers,
  businesses,
  onAddManager,
  onDeleteManager,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBusinessFilter, setSelectedBusinessFilter] = useState('all');
  const [isAddManagerModalOpen, setIsAddManagerModalOpen] = useState(false);
  const [managerToDelete, setManagerToDelete] = useState<BusinessManager | null>(null);
  const [showPasswordId, setShowPasswordId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleConfirmDeleteManager = () => {
    if (managerToDelete) {
      const deletedName = managerToDelete.name;
      onDeleteManager(managerToDelete.id);
      setManagerToDelete(null);
      showToast(`ম্যানেজার "${deletedName}" সফলভাবে অপসারণ করা হয়েছে!`);
    }
  };

  // Filtered Managers
  const filteredManagers = managers.filter((m) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(term) ||
      m.businessName.toLowerCase().includes(term) ||
      m.phone.toLowerCase().includes(term) ||
      m.email.toLowerCase().includes(term) ||
      m.nid.toLowerCase().includes(term);

    const matchesBusiness =
      selectedBusinessFilter === 'all' ||
      m.businessId === selectedBusinessFilter ||
      m.businessName.toLowerCase() === selectedBusinessFilter.toLowerCase();

    return matchesSearch && matchesBusiness;
  });

  return (
    <div className="space-y-4 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#073F37] text-white px-4 py-3 rounded-lg shadow-xl border border-[#22A06B] flex items-center gap-2.5 text-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#22A06B] shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E5EAE8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#E6F4ED] rounded-lg text-[#0E5A4F]">
              <UserCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#18211F] tracking-tight">
              Business Unit Managers (ম্যানেজার ব্যবস্থাপনা)
            </h2>
          </div>
          <p className="text-xs text-[#71807B] mt-1">
            ম্যানেজারদের নাম, মোবাইল নাম্বার, ইমেইল, পাসওয়ার্ড, এনআইডি ও দায়িত্বপ্রাপ্ত প্রতিষ্ঠান পরিচালনা করুন
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71807B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, phone, NID, unit..."
              className="text-xs pl-8 pr-3 py-1.5 bg-[#F6F8F7] border border-[#E5EAE8] rounded-md focus:outline-none focus:border-[#0E5A4F] text-[#18211F] placeholder-[#71807B] w-48 sm:w-60"
            />
          </div>

          <select
            value={selectedBusinessFilter}
            onChange={(e) => setSelectedBusinessFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-[#F6F8F7] border border-[#E5EAE8] rounded-md text-[#18211F] focus:outline-none focus:border-[#0E5A4F] cursor-pointer font-medium"
          >
            <option value="all">All Businesses ({businesses.length})</option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Primary + Add Manager Button */}
          <button
            id="open-add-manager-btn"
            onClick={() => setIsAddManagerModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#0E5A4F] hover:bg-[#073F37] text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Manager</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-[#E5EAE8] shadow-2xs">
          <span className="text-[10px] text-[#71807B] uppercase font-bold tracking-wider block">
            Total Unit Managers
          </span>
          <div className="text-xl font-bold text-[#18211F] mt-1">{managers.length} Officers</div>
          <span className="text-[10px] text-[#0E5A4F] font-semibold mt-0.5 block">Active Credentials</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E5EAE8] shadow-2xs">
          <span className="text-[10px] text-[#71807B] uppercase font-bold tracking-wider block">
            Covered Businesses
          </span>
          <div className="text-xl font-bold text-[#22A06B] mt-1">
            {new Set(managers.map((m) => m.businessId)).size} / {businesses.length} Units
          </div>
          <span className="text-[10px] text-[#22A06B] font-semibold mt-0.5 block">Direct Supervision</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E5EAE8] shadow-2xs">
          <span className="text-[10px] text-[#71807B] uppercase font-bold tracking-wider block">
            NID Verified Status
          </span>
          <div className="text-xl font-bold text-[#0E5A4F] mt-1">100% Verified</div>
          <span className="text-[10px] text-[#0E5A4F] font-semibold mt-0.5 block">KYC Compliant</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E5EAE8] shadow-2xs">
          <span className="text-[10px] text-[#71807B] uppercase font-bold tracking-wider block">
            Role Permission
          </span>
          <div className="text-xl font-bold text-[#18211F] mt-1">Unit Operations</div>
          <span className="text-[10px] text-[#71807B] font-semibold mt-0.5 block">Isolated Access</span>
        </div>
      </div>

      {/* Managers List Table & Detailed Directory */}
      <div className="bg-white rounded-xl border border-[#E5EAE8] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E5EAE8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FCFDFD]">
          <div>
            <h3 className="text-sm font-bold text-[#18211F] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0E5A4F]" />
              Assigned Managers Directory ({filteredManagers.length} Officers)
            </h3>
            <p className="text-xs text-[#71807B] mt-0.5">
              নিচে প্রতিটি নির্দিষ্ট বিজনেস ইউনিটের দায়িত্বরত ম্যানেজারের বিস্তারিত তথ্য প্রদর্শিত হচ্ছে
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#71807B] bg-[#F6F8F7] px-2.5 py-1 rounded-md border border-[#E5EAE8]">
              Showing: <strong className="text-[#18211F]">{filteredManagers.length}</strong> of {managers.length}
            </span>
          </div>
        </div>

        {filteredManagers.length === 0 ? (
          <div className="p-12 text-center text-[#71807B]">
            <AlertCircle className="w-9 h-9 mx-auto mb-2 opacity-40 text-[#71807B]" />
            <p className="text-sm font-bold text-[#18211F]">কোনো ম্যানেজার পাওয়া যায়নি</p>
            <p className="text-xs text-[#71807B] mt-1">
              অনুগ্রহ করে সার্চ পরিবর্তন করুন অথবা নতুন ম্যানেজার যোগ করুন।
            </p>
            <button
              onClick={() => setIsAddManagerModalOpen(true)}
              className="mt-4 px-4 py-2 bg-[#0E5A4F] hover:bg-[#073F37] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Manager</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F6F8F7] text-[#71807B] font-bold border-b border-[#E5EAE8]">
                  <th className="py-3 px-4">Manager Name (নাম)</th>
                  <th className="py-3 px-4">Contact (ফোন ও ইমেইল)</th>
                  <th className="py-3 px-4">NID No. (এনআইডি নম্বর)</th>
                  <th className="py-3 px-4">Assigned Business (বিজনেস ইউনিট)</th>
                  <th className="py-3 px-4">Password & Access</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAE8]">
                {filteredManagers.map((mgr) => {
                  const isPasswordShown = showPasswordId === mgr.id;
                  const displayPassword = mgr.password || 'password123';

                  return (
                    <tr key={mgr.id} className="hover:bg-[#F6F8F7]/60 transition-colors">
                      {/* Name & Role */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#E6F4ED] text-[#0E5A4F] font-bold flex items-center justify-center text-xs shrink-0 border border-[#22A06B]/30 shadow-2xs">
                            {mgr.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-[#18211F] text-xs block">{mgr.name}</span>
                            <span className="text-[10px] text-[#71807B] flex items-center gap-1">
                              <ShieldCheck className="w-2.5 h-2.5 text-[#22A06B]" />
                              Unit Officer • {mgr.createdAt || 'Active'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Phone & Email */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <a
                            href={`tel:${mgr.phone}`}
                            className="flex items-center gap-1.5 text-[#18211F] hover:text-[#0E5A4F] font-medium transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#0E5A4F]" />
                            <span>{mgr.phone}</span>
                          </a>
                          <a
                            href={`mailto:${mgr.email}`}
                            className="flex items-center gap-1.5 text-[#71807B] hover:text-[#0E5A4F] text-[11px] transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5 text-[#71807B]" />
                            <span className="truncate max-w-[180px]">{mgr.email}</span>
                          </a>
                        </div>
                      </td>

                      {/* NID */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#18211F]">
                        <div className="flex items-center gap-1.5 bg-[#F6F8F7] px-2 py-1 rounded-md border border-[#E5EAE8] w-fit">
                          <CreditCard className="w-3.5 h-3.5 text-[#71807B]" />
                          <span>{mgr.nid}</span>
                        </div>
                      </td>

                      {/* Assigned Business */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#E6F4ED] text-[#0E5A4F] border border-[#22A06B]/20">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{mgr.businessName}</span>
                        </div>
                      </td>

                      {/* Password & Security Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-[#F6F8F7] px-2 py-1 rounded border border-[#E5EAE8] text-[11px] font-mono">
                            <KeyRound className="w-3 h-3 text-[#71807B]" />
                            <span>{isPasswordShown ? displayPassword : '••••••••'}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowPasswordId(isPasswordShown ? null : mgr.id)}
                            className="p-1 text-[#71807B] hover:text-[#18211F] rounded transition-colors cursor-pointer"
                            title={isPasswordShown ? 'Hide Password' : 'Show Password'}
                          >
                            {isPasswordShown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setManagerToDelete(mgr)}
                          className="p-1.5 text-[#71807B] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1"
                          title={`Remove ${mgr.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-semibold text-red-600">Remove</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ----------------- ADD MANAGER MODAL ----------------- */}
      <AddManagerModal
        isOpen={isAddManagerModalOpen}
        onClose={() => setIsAddManagerModalOpen(false)}
        businesses={businesses}
        onAddManager={(newMgr) => {
          onAddManager(newMgr);
          showToast(`ম্যানেজার "${newMgr.name}" "${newMgr.businessName}" ইউনিটের জন্য সফলভাবে যুক্ত হয়েছে!`);
        }}
      />

      {/* ----------------- DELETE MANAGER CONFIRMATION MODAL ----------------- */}
      {managerToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-[#E5EAE8] relative animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#18211F]">
                  ম্যানেজার অপসারণ করবেন?
                </h3>
                <p className="text-xs text-[#71807B] mt-0.5">
                  Confirm Manager Removal
                </p>
              </div>
            </div>

            <div className="my-4 p-3.5 bg-red-50/80 border border-red-200 rounded-lg text-xs text-red-800 space-y-1.5">
              <p className="font-semibold text-red-900">
                আপনি কি নিশ্চিত যে <strong className="font-bold underline">"{managerToDelete.name}"</strong> কে অপসারণ করতে চান?
              </p>
              <ul className="text-[11px] text-red-700 list-disc list-inside space-y-0.5 pt-1">
                <li>দায়িত্বপ্রাপ্ত প্রতিষ্ঠান: <strong>{managerToDelete.businessName}</strong></li>
                <li>জাতীয় পরিচয়পত্র (NID): <strong>{managerToDelete.nid}</strong></li>
                <li>এই ম্যানেজারের লগইন এক্সেস নিষ্ক্রিয় হয়ে যাবে</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setManagerToDelete(null)}
                className="px-4 py-2 bg-[#F6F8F7] hover:bg-[#E5EAE8] text-[#18211F] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel (বাতিল)
              </button>
              <button
                type="button"
                id="confirm-remove-mgr-btn"
                onClick={handleConfirmDeleteManager}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Manager (অপসারণ করুন)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
