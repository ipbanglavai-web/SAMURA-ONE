import React, { useState } from 'react';
import { PendingApproval } from '../../types';
import { X, CheckCircle, XCircle, ShieldCheck, FileText, User, Calendar, AlertCircle } from 'lucide-react';

interface ApprovalDetailModalProps {
  approval: PendingApproval | null;
  onClose: () => void;
  onApprove: (id: string, remarks?: string) => void;
  onReject: (id: string, reason?: string) => void;
}

export const ApprovalDetailModal: React.FC<ApprovalDetailModalProps> = ({
  approval,
  onClose,
  onApprove,
  onReject
}) => {
  const [remarks, setRemarks] = useState('');
  const [actionDone, setActionDone] = useState<'approved' | 'rejected' | null>(null);

  if (!approval) return null;

  const handleApproveAction = () => {
    setActionDone('approved');
    setTimeout(() => {
      onApprove(approval.id, remarks);
      onClose();
    }, 400);
  };

  const handleRejectAction = () => {
    setActionDone('rejected');
    setTimeout(() => {
      onReject(approval.id, remarks);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-[#E5EAE8] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#073F37] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#22A06B]" />
            <div>
              <h3 className="font-semibold text-base">Executive Authorization Review</h3>
              <p className="text-xs text-[#A3B8B0]">Founder Final Approval Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#A3B8B0] hover:text-white hover:bg-[#0E5A4F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-sm text-[#18211F]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#71807B]">
              Item & Action Required
            </span>
            <h4 className="text-lg font-bold text-[#18211F] mt-0.5">{approval.title}</h4>
            <p className="text-sm text-[#71807B] mt-1">{approval.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F6F8F7] rounded-lg border border-[#E5EAE8] text-xs">
            <div>
              <span className="text-[#71807B] block">Requested Amount</span>
              <span className="font-bold text-[#18211F] text-sm mt-0.5 block">{approval.amount || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[#71807B] block">Originating Dept</span>
              <span className="font-semibold text-[#18211F] mt-0.5 block">{approval.department}</span>
            </div>
            <div>
              <span className="text-[#71807B] block">Requested By</span>
              <span className="font-semibold text-[#18211F] mt-0.5 block">{approval.requester}</span>
            </div>
            <div>
              <span className="text-[#71807B] block">Submission Age</span>
              <span className="font-semibold text-[#D9A441] mt-0.5 block">{approval.age}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#71807B] uppercase tracking-wider mb-1.5">
              Founder Remarks / Instructions
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Optional approval conditions, ledger references, or rejection notes..."
              rows={2}
              className="w-full text-xs p-2.5 border border-[#E5EAE8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E5A4F] focus:border-[#0E5A4F] bg-[#FDFEFE]"
            />
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E5EAE8] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleRejectAction}
            disabled={actionDone !== null}
            className="px-4 py-2 text-xs font-semibold text-[#D9534F] bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FCA5A5] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject Request</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-[#71807B] hover:text-[#18211F] hover:bg-[#E5EAE8] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApproveAction}
              disabled={actionDone !== null}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#0E5A4F] hover:bg-[#135E54] active:bg-[#0B4A40] rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{actionDone === 'approved' ? 'Approved!' : 'Authorize & Approve'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
