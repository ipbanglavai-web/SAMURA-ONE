import React, { useState, useEffect } from 'react';
import { BusinessHealthItem } from '../../types';
import {
  UserCheck,
  X,
  Phone,
  Mail,
  Lock,
  CreditCard,
  Building2,
  Eye,
  EyeOff,
  AlertTriangle,
  ShieldCheck,
  Briefcase,
  CheckSquare,
  Square
} from 'lucide-react';

interface AddManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  businesses: BusinessHealthItem[];
  onAddManager: (newManager: {
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
  defaultBusinessId?: string;
}

export const AddManagerModal: React.FC<AddManagerModalProps> = ({
  isOpen,
  onClose,
  businesses,
  onAddManager,
  defaultBusinessId
}) => {
  const [managerType, setManagerType] = useState<'unit_manager' | 'general_manager'>('unit_manager');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nid, setNid] = useState('');
  const [selectedBusinessId, setSelectedBusinessId] = useState(
    defaultBusinessId || (businesses.length > 0 ? businesses[0].id : '')
  );
  // General Manager multi-business selection
  const [assignedGmBizIds, setAssignedGmBizIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (defaultBusinessId) {
        setSelectedBusinessId(defaultBusinessId);
      } else if (businesses.length > 0) {
        setSelectedBusinessId(businesses[0].id);
      }
      // By default assign all businesses when General Manager is selected
      setAssignedGmBizIds(businesses.map((b) => b.id));
      setError(null);
    }
  }, [isOpen, defaultBusinessId, businesses]);

  if (!isOpen) return null;

  const handleToggleGmBiz = (bizId: string) => {
    setAssignedGmBizIds((prev) =>
      prev.includes(bizId) ? prev.filter((id) => id !== bizId) : [...prev, bizId]
    );
  };

  const handleSelectAllGmBusinesses = () => {
    if (assignedGmBizIds.length === businesses.length) {
      setAssignedGmBizIds([]);
    } else {
      setAssignedGmBizIds(businesses.map((b) => b.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!name.trim()) {
      setError('Manager name is required.');
      return;
    }
    if (!phone.trim()) {
      setError('Phone number is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('A valid email address is required.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!nid.trim()) {
      setError('National ID (NID) number is required.');
      return;
    }

    if (managerType === 'unit_manager') {
      if (!selectedBusinessId) {
        setError('Please select a business unit to assign.');
        return;
      }
      const assignedBiz = businesses.find((b) => b.id === selectedBusinessId);
      const businessName = assignedBiz ? assignedBiz.name : 'General Business';

      onAddManager({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        nid: nid.trim(),
        businessId: selectedBusinessId,
        businessName,
        managerType: 'unit_manager',
        assignedBusinessIds: [selectedBusinessId],
        assignedBusinessNames: [businessName]
      });
    } else {
      // General Manager
      if (assignedGmBizIds.length === 0) {
        setError('Please assign at least one business to the General Manager (or select all).');
        return;
      }
      const assignedBizObjects = businesses.filter((b) => assignedGmBizIds.includes(b.id));
      const assignedNames = assignedBizObjects.map((b) => b.name);
      const isAll = assignedGmBizIds.length === businesses.length;

      onAddManager({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        nid: nid.trim(),
        businessId: 'all',
        businessName: isAll ? 'All Group Businesses' : `${assignedGmBizIds.length} Businesses Assigned`,
        managerType: 'general_manager',
        assignedBusinessIds: assignedGmBizIds,
        assignedBusinessNames: assignedNames
      });
    }

    // Reset & Close
    setName('');
    setPhone('');
    setEmail('');
    setPassword('');
    setNid('');
    setManagerType('unit_manager');
    onClose();
  };

  const isAllGmSelected = assignedGmBizIds.length === businesses.length && businesses.length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-[#E5EAE8] relative animate-scale-in my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E5EAE8] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#E6F4ED] rounded-lg text-[#0E5A4F]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#18211F] tracking-tight">
                Add Manager / General Manager
              </h3>
              <p className="text-[11px] text-[#71807B]">
                Register manager credentials and configure assigned business subsidiaries
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#71807B] hover:text-[#18211F] hover:bg-[#F6F8F7] rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-3.5 p-2.5 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs flex items-center gap-2 shrink-0">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Modal Form Scrollable */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 overflow-y-auto pr-1">
          {/* Manager Role / Type Switcher */}
          <div>
            <label className="block text-xs font-semibold text-[#18211F] mb-1.5">
              Manager Role & Privilege Scope <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#F6F8F7] rounded-lg border border-[#E5EAE8]">
              <button
                type="button"
                id="select-unit-manager-type"
                onClick={() => setManagerType('unit_manager')}
                className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  managerType === 'unit_manager'
                    ? 'bg-[#0E5A4F] text-white shadow-xs'
                    : 'text-[#71807B] hover:text-[#18211F] hover:bg-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Unit Manager</span>
              </button>

              <button
                type="button"
                id="select-general-manager-type"
                onClick={() => {
                  setManagerType('general_manager');
                  setAssignedGmBizIds(businesses.map((b) => b.id));
                }}
                className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  managerType === 'general_manager'
                    ? 'bg-[#0E5A4F] text-white shadow-xs'
                    : 'text-[#71807B] hover:text-[#18211F] hover:bg-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>General Manager (GM)</span>
              </button>
            </div>
          </div>

          {/* 1. Manager Name */}
          <div>
            <label className="block text-xs font-semibold text-[#18211F] mb-1">
              {managerType === 'general_manager' ? 'General Manager Name' : 'Manager Name'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="manager-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={managerType === 'general_manager' ? 'e.g. Md. Kabir Ahmed (GM)' : 'e.g. Tariqul Hasan'}
                className="w-full text-xs px-3 py-2 bg-[#F6F8F7] border border-[#E5EAE8] rounded-md text-[#18211F] focus:outline-none focus:border-[#0E5A4F]"
                required
              />
            </div>
          </div>

          {/* 2 & 3: Phone & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#18211F] mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71807B]" />
                <input
                  id="manager-phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01711-XXXXXX"
                  className="w-full text-xs pl-8 pr-3 py-2 bg-[#F6F8F7] border border-[#E5EAE8] rounded-md text-[#18211F] focus:outline-none focus:border-[#0E5A4F]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#18211F] mb-1">
                Login Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71807B]" />
                <input
                  id="manager-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={managerType === 'general_manager' ? 'gm@alsamura.com' : 'manager@alsamura.com'}
                  className="w-full text-xs pl-8 pr-3 py-2 bg-[#F6F8F7] border border-[#E5EAE8] rounded-md text-[#18211F] focus:outline-none focus:border-[#0E5A4F]"
                  required
                />
              </div>
            </div>
          </div>

          {/* 4 & 5: Password & NID Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#18211F] mb-1">
                Login Password (Set by Admin) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71807B]" />
                <input
                  id="manager-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password set by admin"
                  className="w-full text-xs pl-8 pr-8 py-2 bg-[#F6F8F7] border border-[#E5EAE8] rounded-md text-[#18211F] focus:outline-none focus:border-[#0E5A4F]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71807B] hover:text-[#18211F] p-0.5 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#18211F] mb-1">
                National ID (NID) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CreditCard className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71807B]" />
                <input
                  id="manager-nid-input"
                  type="text"
                  value={nid}
                  onChange={(e) => setNid(e.target.value)}
                  placeholder="10 or 17 digit NID"
                  className="w-full text-xs pl-8 pr-3 py-2 bg-[#F6F8F7] border border-[#E5EAE8] rounded-md text-[#18211F] focus:outline-none focus:border-[#0E5A4F]"
                  required
                />
              </div>
            </div>
          </div>

          {/* 6. Business Assignment Section */}
          {managerType === 'unit_manager' ? (
            <div>
              <label className="block text-xs font-semibold text-[#18211F] mb-1">
                Assign Single Business Unit <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71807B]" />
                <select
                  id="manager-business-select"
                  value={selectedBusinessId}
                  onChange={(e) => setSelectedBusinessId(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 bg-[#F6F8F7] border border-[#E5EAE8] rounded-md text-[#18211F] focus:outline-none focus:border-[#0E5A4F] cursor-pointer font-medium"
                  required
                >
                  {businesses.map((biz) => (
                    <option key={biz.id} value={biz.id}>
                      {biz.name} (Current: {biz.manager || 'Not Assigned'})
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[10px] text-[#71807B] mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#0E5A4F]" />
                The assigned manager will only have access to operations and data for this unit.
              </p>
            </div>
          ) : (
            /* General Manager Multi-Business Assignment */
            <div className="p-3 bg-[#F6F8F7] rounded-lg border border-[#E5EAE8] space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-[#18211F]">
                    Assign Businesses to General Manager <span className="text-red-500">*</span>
                  </span>
                  <span className="text-[10px] text-[#71807B]">
                    {assignedGmBizIds.length} of {businesses.length} subsidiaries assigned
                  </span>
                </div>
                <button
                  type="button"
                  id="toggle-all-businesses-btn"
                  onClick={handleSelectAllGmBusinesses}
                  className="text-xs text-[#0E5A4F] hover:text-[#073F37] font-bold px-2 py-1 rounded bg-white border border-[#E5EAE8] hover:border-[#0E5A4F] transition-colors cursor-pointer flex items-center gap-1"
                >
                  {isAllGmSelected ? (
                    <>
                      <CheckSquare className="w-3.5 h-3.5 text-[#0E5A4F]" />
                      <span>All Businesses Assigned</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-3.5 h-3.5" />
                      <span>Assign All Businesses</span>
                    </>
                  )}
                </button>
              </div>

              {/* Grid of Business Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-40 overflow-y-auto p-1 bg-white rounded-md border border-[#E5EAE8]">
                {businesses.map((biz) => {
                  const isChecked = assignedGmBizIds.includes(biz.id);
                  return (
                    <label
                      key={biz.id}
                      className={`flex items-center gap-2 p-2 rounded text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-[#E6F4ED] text-[#0E5A4F] font-semibold'
                          : 'hover:bg-[#F6F8F7] text-[#18211F]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleGmBiz(biz.id)}
                        className="rounded border-[#E5EAE8] text-[#0E5A4F] focus:ring-[#0E5A4F] w-3.5 h-3.5"
                      />
                      <span className="truncate">{biz.name}</span>
                    </label>
                  );
                })}
              </div>

              <div className="text-[10px] text-[#0E5A4F] bg-[#E6F4ED] p-2 rounded-md flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>
                  The General Manager can log in with this password and will see a business selection page displaying all assigned subsidiaries.
                </span>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E5EAE8] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-[#E5EAE8] hover:bg-[#F6F8F7] text-[#71807B] text-xs font-semibold rounded-md transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="submit-add-manager-btn"
              type="submit"
              className="px-4 py-1.5 bg-[#0E5A4F] hover:bg-[#073F37] text-white text-xs font-bold rounded-md shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>
                {managerType === 'general_manager' ? 'Save General Manager' : 'Save & Assign Manager'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

