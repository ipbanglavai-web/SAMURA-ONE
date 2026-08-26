import React from 'react';
import { SaleDueRecord } from '../../types';
import { FileText, X, Printer, CheckCircle2, AlertCircle, Building2, User } from 'lucide-react';
import { printSaleVoucher } from '../../utils/printHelper';

interface SaleVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: SaleDueRecord | null;
  businessName: string;
}

export const SaleVoucherModal: React.FC<SaleVoucherModalProps> = ({
  isOpen,
  onClose,
  record,
  businessName
}) => {
  if (!isOpen || !record) return null;

  const handlePrint = () => {
    printSaleVoucher(record, businessName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-['Inter',sans-serif]">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-[#E5EAE8] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Actions */}
        <div className="bg-[#073F37] px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#22A06B]" />
            <div>
              <h3 className="text-sm sm:text-base font-bold leading-tight">Sale & Due Voucher Memo</h3>
              <p className="text-[11px] text-[#A3B8B0]">Invoice #{record.invoiceNo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Voucher Body (Printable Area) */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-white text-[#18211F]">
          {/* Company & Unit Header */}
          <div className="border-b border-[#E5EAE8] pb-4 text-center">
            <span className="text-[10px] font-bold tracking-widest text-[#0E5A4F] uppercase block">
              AL SAMURA GROUP OF COMPANIES
            </span>
            <h2 className="text-xl font-bold text-[#073F37] mt-0.5">{businessName}</h2>
            <p className="text-xs text-[#71807B] mt-0.5">
              Sales, Credit Ledger & Money Receipt Statement
            </p>
            <div className="flex items-center justify-center gap-4 text-[11px] text-[#71807B] mt-2 font-mono">
              <span>Invoice: <strong>{record.invoiceNo}</strong></span>
              <span>•</span>
              <span>Date: <strong>{record.date}</strong></span>
            </div>
          </div>

          {/* Customer & Cluster Details */}
          <div className="grid grid-cols-2 gap-4 bg-[#F6F8F7] p-3.5 rounded-xl border border-[#E5EAE8] text-xs">
            <div>
              <span className="text-[10px] text-[#71807B] uppercase font-bold block">Customer / Party</span>
              <span className="font-bold text-sm text-[#18211F] block mt-0.5">{record.customerName}</span>
              <span className="text-[#71807B] mt-0.5 block">{record.address}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#71807B] uppercase font-bold block">Customer of / Cluster</span>
              <span className="font-semibold text-xs text-[#0E5A4F] block mt-0.5">{record.customerOf}</span>
              <span className="text-[10px] text-[#71807B] block mt-1">
                Due Commitment: <strong className="text-[#18211F]">{record.duePaymentDate}</strong>
              </span>
            </div>
          </div>

          {/* Sold Product Table */}
          <div className="border border-[#E5EAE8] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6F8F7] border-b border-[#E5EAE8] text-[10px] uppercase font-bold text-[#71807B]">
                <tr>
                  <th className="p-2.5">Product Description</th>
                  <th className="p-2.5 text-center">Quantity</th>
                  <th className="p-2.5 text-right">Unit Rate</th>
                  <th className="p-2.5 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAE8]">
                <tr>
                  <td className="p-2.5 font-semibold text-[#18211F]">
                    {record.productName}
                    <span className="block text-[10px] text-[#71807B] font-normal">{record.productUnit}</span>
                  </td>
                  <td className="p-2.5 text-center font-bold">{record.quantity}</td>
                  <td className="p-2.5 text-right font-mono">৳ {record.unitPrice.toLocaleString()}</td>
                  <td className="p-2.5 text-right font-bold text-[#0E5A4F] font-mono">
                    ৳ {record.amount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Breakdown */}
          <div className="bg-[#F6F8F7] p-4 rounded-xl border border-[#E5EAE8] space-y-2 text-xs">
            <div className="flex justify-between text-[#71807B]">
              <span>Previous Due (Ex-Due):</span>
              <span className="font-mono font-medium">৳ {record.exDue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#18211F] font-semibold">
              <span>Current Sale Amount:</span>
              <span className="font-mono font-bold text-[#0E5A4F]">৳ {record.amount.toLocaleString()}</span>
            </div>
            {record.sacrifice > 0 && (
              <div className="flex justify-between text-[#71807B]">
                <span>Discount / Sacrifice:</span>
                <span className="font-mono text-red-500 font-medium">- ৳ {record.sacrifice.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-[#E5EAE8] pt-2 text-[#18211F] font-bold">
              <span>Total Payable Due:</span>
              <span className="font-mono">৳ {record.payableDue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#22A06B] font-bold">
              <span>Paid Cash Amount:</span>
              <span className="font-mono">- ৳ {record.paid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t-2 border-[#0E5A4F] pt-2 text-sm font-bold">
              <span className="text-[#D9534F]">Remaining Balance (Running Due):</span>
              <span className="font-mono text-[#D9534F]">৳ {record.runningDue.toLocaleString()}</span>
            </div>
          </div>

          {record.notes && (
            <div className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-200 text-xs text-[#18211F]">
              <span className="font-bold block text-[10px] text-amber-800 uppercase">Notes:</span>
              <span>{record.notes}</span>
            </div>
          )}

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs text-[#71807B]">
            <div>
              <div className="border-t border-[#71807B]/40 pt-1.5 font-semibold">Customer Signature</div>
            </div>
            <div>
              <div className="border-t border-[#71807B]/40 pt-1.5 font-semibold">Manager / Authorized Sign</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#F6F8F7] px-6 py-3 border-t border-[#E5EAE8] flex items-center justify-between text-xs">
          <span className="text-[#71807B] text-[11px]">System Generated · SAMURA ONE Group ERP</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#0E5A4F] hover:bg-[#073F37] text-white font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
