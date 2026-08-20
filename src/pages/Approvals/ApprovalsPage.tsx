import React, { useState } from 'react';
import { PendingApproval } from '../../types';
import { ShieldCheck, CheckCircle2, XCircle, Filter, Search, Check, Clock, User, Building } from 'lucide-react';

interface ApprovalsPageProps {
  approvals: PendingApproval[];
  onApprove: (id: string, remarks?: string) => void;
  onReject: (id: string, remarks?: string) => void;
  onSelectApproval: (approval: PendingApproval) => void;
}

export const ApprovalsPage: React.FC<ApprovalsPageProps> = ({
  approvals,
  onApprove,
  onReject,
  onSelectApproval
}) => {
  const [filterType, setFilterType] = useState<'all' | 'payment' | 'inventory' | 'credit'>('all');
  const [search, setSearch] = useState('');

  const filtered = approvals.filter(item => {
    const matchesFilter = filterType === 'all' || item.type === filterType;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.description.toLowerCase().includes(search.toLowerCase()) ||
                          item.requester.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = approvals.filter(a => a.status === 'pending').length;

  const handleBatchApproveAll = () => {
    approvals.filter(a => a.status === 'pending').forEach(a => {
      onApprove(a.id, 'Batch authorized by Founder & MD');
    });
  };

  return (
    <div className="space-y-5 pb-10">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#18211F] tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0E5A4F]" />
            <span>Founder Executive Authorization Desk</span>
          </h2>
          <p className="text-xs text-[#71807B] mt-0.5">
            {pendingCount} pending authorizations requiring executive approval
          </p>
        </div>

        {pendingCount > 0 && (
          <button
            onClick={handleBatchApproveAll}
            className="px-4 py-2 bg-[#0E5A4F] hover:bg-[#135E54] active:bg-[#0B4A40] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve All {pendingCount} Pending Items</span>
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E5EAE8]">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-[#0E5A4F] text-white'
                : 'text-[#71807B] hover:bg-[#F6F8F7]'
            }`}
          >
            All Items ({approvals.length})
          </button>
          <button
            onClick={() => setFilterType('payment')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'payment'
                ? 'bg-[#0E5A4F] text-white'
                : 'text-[#71807B] hover:bg-[#F6F8F7]'
            }`}
          >
            Payments
          </button>
          <button
            onClick={() => setFilterType('inventory')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'inventory'
                ? 'bg-[#0E5A4F] text-white'
                : 'text-[#71807B] hover:bg-[#F6F8F7]'
            }`}
          >
            Inventory & Variances
          </button>
          <button
            onClick={() => setFilterType('credit')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'credit'
                ? 'bg-[#0E5A4F] text-white'
                : 'text-[#71807B] hover:bg-[#F6F8F7]'
            }`}
          >
            Credit Overrides
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71807B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search request or submitter..."
            className="text-xs pl-9 pr-3 py-1.5 bg-[#F6F8F7] border border-[#E5EAE8] rounded-lg text-[#18211F] placeholder-[#71807B] w-full sm:w-60 focus:outline-none focus:border-[#0E5A4F]"
          />
        </div>
      </div>

      {/* Approvals Items List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-xl p-4 sm:p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs ${
              item.status === 'approved'
                ? 'border-[#DCFCE7] bg-[#F0FDF4]/40'
                : item.status === 'rejected'
                ? 'border-[#FEE2E2] bg-[#FEF2F2]/30'
                : 'border-[#E5EAE8] hover:border-[#CBD5E1]'
            }`}
          >
            <div
              onClick={() => onSelectApproval(item)}
              className="flex items-start gap-3.5 cursor-pointer min-w-0 flex-1"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F6F8F7] border border-[#E5EAE8] flex items-center justify-center font-bold text-sm text-[#0E5A4F] shrink-0 mt-0.5">
                {item.type === 'payment' ? '৳' : item.type === 'credit' ? '%' : '📦'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#18211F] hover:text-[#0E5A4F] transition-colors truncate">
                    {item.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'approved'
                        ? 'bg-[#DCFCE7] text-[#166534]'
                        : item.status === 'rejected'
                        ? 'bg-[#FEE2E2] text-[#991B1B]'
                        : 'bg-[#FEF3C7] text-[#B45309]'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-[#71807B] mt-1">{item.description}</p>
                <div className="flex items-center gap-4 text-[11px] text-[#71807B] mt-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{item.requester}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" />
                    <span>{item.department}</span>
                  </span>
                  <span className="flex items-center gap-1 text-[#D9A441] font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.age}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {item.status === 'pending' ? (
                <>
                  <button
                    onClick={() => onReject(item.id, 'Declined by Founder')}
                    className="px-3 py-1.5 text-xs font-semibold text-[#D9534F] bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FCA5A5] rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => onApprove(item.id, 'Authorized by Founder')}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0E5A4F] hover:bg-[#135E54] rounded-lg flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                </>
              ) : (
                <span className="text-xs font-semibold text-[#71807B] px-3 py-1 bg-[#F6F8F7] rounded-lg">
                  Processed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
