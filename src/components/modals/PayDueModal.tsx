import React, { useState, useEffect } from 'react';
import { SaleDueRecord, ManagerCustomer } from '../../types';
import {
  DollarSign,
  X,
  Check,
  AlertCircle,
  Calendar,
  CreditCard,
  Building,
  User,
  FileText,
  Wallet,
  ArrowRight
} from 'lucide-react';

interface PayDueModalProps {
  isOpen: boolean;
  onClose: () => void;
  record?: SaleDueRecord | null;
  customer?: ManagerCustomer | null;
  businessName?: string;
  onConfirmPayment: (params: {
    recordId?: string;
    customerId?: string;
    customerName: string;
    amount: number;
    paymentMethod: string;
    paymentDate: string;
    note?: string;
  }) => void;
}

export const PayDueModal: React.FC<PayDueModalProps> = ({
  isOpen,
  onClose,
  record,
  customer,
  businessName = 'AL SAMURA Unit',
  onConfirmPayment
}) => {
  // Current due amount to be settled
  const currentDue = record ? record.runningDue : customer ? customer.dueAmount : 0;
  const customerName = record ? record.customerName : customer ? customer.name : '';
  const customerPhone = customer ? customer.phone : record?.address.split('·')[1]?.trim() || '';
  const customerAddress = customer ? customer.address : record?.address.split('·')[0]?.trim() || record?.address || '';
  const reference = customer?.reference || record?.customerOf || 'Direct';

  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Cash');
  const [paymentDate, setPaymentDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('বকেয়া আদায় / আংশিক পরিশোধ');
  const [error, setError] = useState<string | null>(null);

  // Initialize payment amount with current due or empty
  useEffect(() => {
    if (isOpen && currentDue > 0) {
      setPaymentAmount(currentDue.toString());
      setError(null);
    }
  }, [isOpen, currentDue]);

  if (!isOpen) return null;

  const numAmount = parseFloat(paymentAmount) || 0;
  const remainingDue = Math.max(0, currentDue - numAmount);
  const isFullPayment = numAmount >= currentDue && currentDue > 0;

  const handleQuickAmount = (amt: number) => {
    setPaymentAmount(amt.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('পরিশোধের পরিমাণ সঠিকভাবে লিখুন (Please enter a valid amount).');
      return;
    }

    if (numAmount > currentDue) {
      setError(`পরিশোধের পরিমাণ বকেয়া টাকার (৳${currentDue.toLocaleString()}) চেয়ে বেশি হতে পারে না।`);
      return;
    }

    onConfirmPayment({
      recordId: record?.id,
      customerId: customer?.id,
      customerName,
      amount: numAmount,
      paymentMethod,
      paymentDate,
      note: notes.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in font-['Inter',sans-serif]">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E5EAE8] flex flex-col">
        {/* Header */}
        <div className="bg-[#0E5A4F] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#22A06B]/20 border border-[#22A06B]/40 flex items-center justify-center text-[#22A06B]">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#22A06B] uppercase tracking-wider block">
                PAY NOW · বকেয়া আদায় / টাকা জমা
              </span>
              <h3 className="text-base font-bold text-white">
                {record ? `মেমো বকেয়া আদায় (${record.invoiceNo})` : 'কাস্টমার বকেয়া খতিয়ান আদায়'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer & Due Info Card */}
        <div className="bg-[#F6F8F7] p-5 border-b border-[#E5EAE8] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0E5A4F] text-white flex items-center justify-center text-xs font-bold font-mono">
                {customerName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#18211F]">{customerName}</h4>
                <p className="text-[11px] text-[#71807B]">
                  {customerPhone ? `${customerPhone} · ` : ''}{customerAddress}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#71807B] block">রেফারেন্স</span>
              <span className="text-xs font-semibold text-[#0E5A4F] bg-white border border-[#E5EAE8] px-2 py-0.5 rounded">
                {reference}
              </span>
            </div>
          </div>

          {/* Current Due vs Remaining Due live banner */}
          <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-[#E5EAE8]">
            <div>
              <span className="text-[10px] font-semibold text-[#71807B] uppercase block">বর্তমান বকেয়া</span>
              <span className="text-sm sm:text-base font-bold font-mono text-[#D9534F]">
                ৳ {currentDue.toLocaleString()}
              </span>
            </div>

            <div className="text-center border-x border-[#E5EAE8] px-1">
              <span className="text-[10px] font-semibold text-[#71807B] uppercase block">এখন জমা দিচ্ছেন</span>
              <span className="text-sm sm:text-base font-bold font-mono text-[#22A06B]">
                ৳ {numAmount.toLocaleString()}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-semibold text-[#71807B] uppercase block">অবশিষ্ট ডিউ</span>
              <span
                className={`text-sm sm:text-base font-bold font-mono ${
                  remainingDue === 0 ? 'text-[#22A06B]' : 'text-[#18211F]'
                }`}
              >
                {remainingDue === 0 ? '৳ 0 (ক্লিয়ার)' : `৳ ${remainingDue.toLocaleString()}`}
              </span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-[#D9534F]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Pay Buttons */}
          <div>
            <label className="block text-xs font-bold text-[#18211F] mb-1.5">
              জমার পরিমাণ (Payment Amount, ৳) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 font-bold text-[#0E5A4F] text-sm">৳</span>
              <input
                id="pay-amount-input"
                type="number"
                min="1"
                max={currentDue}
                step="any"
                required
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="টাকার পরিমাণ লিখুন"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#E5EAE8] bg-white text-base font-bold font-mono text-[#18211F] focus:border-[#0E5A4F] focus:ring-2 focus:ring-[#0E5A4F]/10 focus:outline-none"
                autoFocus
              />
            </div>

            {/* Quick Fill Shortcuts */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <button
                type="button"
                onClick={() => handleQuickAmount(currentDue)}
                className="px-2.5 py-1 rounded-lg bg-[#E6F4ED] hover:bg-[#22A06B] hover:text-white text-[#0E5A4F] text-[11px] font-bold transition-colors cursor-pointer"
              >
                সম্পূর্ণ বকেয়া (৳{currentDue.toLocaleString()})
              </button>
              {currentDue > 10000 && (
                <button
                  type="button"
                  onClick={() => handleQuickAmount(Math.round(currentDue / 2))}
                  className="px-2.5 py-1 rounded-lg bg-[#F6F8F7] hover:bg-[#E5EAE8] text-[#18211F] text-[11px] font-medium transition-colors cursor-pointer"
                >
                  ৫০% (৳{Math.round(currentDue / 2).toLocaleString()})
                </button>
              )}
              {currentDue >= 20000 && (
                <button
                  type="button"
                  onClick={() => handleQuickAmount(20000)}
                  className="px-2.5 py-1 rounded-lg bg-[#F6F8F7] hover:bg-[#E5EAE8] text-[#18211F] text-[11px] font-medium transition-colors cursor-pointer"
                >
                  ৳ ২০,০০০
                </button>
              )}
              {currentDue >= 10000 && (
                <button
                  type="button"
                  onClick={() => handleQuickAmount(10000)}
                  className="px-2.5 py-1 rounded-lg bg-[#F6F8F7] hover:bg-[#E5EAE8] text-[#18211F] text-[11px] font-medium transition-colors cursor-pointer"
                >
                  ৳ ১০,০০০
                </button>
              )}
            </div>
          </div>

          {/* Payment Method & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#18211F] mb-1">
                পেমেন্ট মাধ্যম (Payment Method) <span className="text-red-500">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5EAE8] bg-white text-xs font-semibold text-[#18211F] focus:border-[#0E5A4F] focus:outline-none cursor-pointer"
              >
                <option value="Cash">নগদ ক্যাশ (Cash)</option>
                <option value="Bank Transfer">ব্যাংক ট্রান্সফার (Bank Transfer)</option>
                <option value="bKash / Nagad">বিকাশ / নগদ (Mobile Banking)</option>
                <option value="Cheque">চেক (Cheque)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18211F] mb-1">
                পেমেন্টের তারিখ (Payment Date) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5EAE8] bg-white text-xs font-medium text-[#18211F] focus:border-[#0E5A4F] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Transaction Note */}
          <div>
            <label className="block text-xs font-bold text-[#18211F] mb-1">
              লেনদেন বিবরণ বা নোট (Transaction Note)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. ক্যাশ ভাউচার মারফত জমা / ব্যাংক রশিদ নং"
              className="w-full px-3 py-2 rounded-xl border border-[#E5EAE8] bg-white text-xs text-[#18211F] focus:border-[#0E5A4F] focus:outline-none"
            />
          </div>

          {/* Confirmation Info Box */}
          <div className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
            isFullPayment ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <Check className="w-4 h-4 shrink-0 text-current" />
            <span>
              {isFullPayment
                ? `সম্পূর্ণ ৳${currentDue.toLocaleString()} পরিশোধ সম্পন্ন হলে ${customerName}-এর বকেয়া শূন্য (৳0) হয়ে যাবে।`
                : `৳${numAmount.toLocaleString()} জমা হলে ${customerName}-এর অবশিষ্ট বকেয়া থাকবে ৳${remainingDue.toLocaleString()}।`}
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-[#E5EAE8] rounded-xl text-xs font-bold text-[#71807B] hover:bg-[#F6F8F7] transition-colors cursor-pointer"
            >
              বাতিল (Cancel)
            </button>
            <button
              type="submit"
              id="confirm-pay-now-btn"
              className="px-5 py-2.5 bg-[#22A06B] hover:bg-[#1C885A] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>জমা নিশ্চিত করুন (Confirm Pay Now)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
