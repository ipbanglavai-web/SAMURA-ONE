import React from 'react';
import { PendingApproval } from '../../types';

interface PendingApprovalsCardProps {
  approvals: PendingApproval[];
  totalCount?: number;
  onViewAllApprovals?: () => void;
  onQuickApprove?: (id: string) => void;
  onSelectApproval?: (approval: PendingApproval) => void;
}

export const PendingApprovalsCard: React.FC<PendingApprovalsCardProps> = ({
  approvals,
  totalCount = 7,
  onViewAllApprovals,
  onSelectApproval
}) => {
  // Take top 3 for the dashboard summary widget
  const displayItems = approvals.slice(0, 3);

  return (
    <div className="bg-white border border-[#E5EAE8] rounded-xl p-4 shadow-xs">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="font-bold text-sm text-[#18211F]">
          Pending Approvals
        </div>
        <span className="bg-[#D9534F] text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
          {totalCount} PENDING
        </span>
      </div>

      {/* Approvals List */}
      <div className="space-y-2">
        {displayItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectApproval && onSelectApproval(item)}
            className="border-b border-[#F6F8F7] pb-2 last:border-0 cursor-pointer hover:bg-[#F6F8F7] -mx-1 px-1 py-1 rounded transition-colors"
          >
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-[#18211F] truncate max-w-[170px]">
                {item.title}
              </span>
              <span className="text-[10px] font-mono font-bold text-[#0E5A4F] shrink-0">
                {item.amount || '—'}
              </span>
            </div>
            <div className="text-[10px] text-[#71807B] truncate mt-0.5">
              {item.business} · {item.description}
            </div>
          </div>
        ))}
      </div>

      {/* Review Action */}
      <button
        onClick={onViewAllApprovals}
        className="w-full mt-3 py-2 bg-[#F6F8F7] hover:bg-[#E5EAE8] rounded-lg text-[10px] font-bold text-[#0E5A4F] uppercase tracking-wider transition-colors cursor-pointer"
      >
        Review All Approvals
      </button>
    </div>
  );
};
