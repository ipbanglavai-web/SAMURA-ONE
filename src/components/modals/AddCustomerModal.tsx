import React, { useState } from 'react';
import { ManagerCustomer } from '../../types';
import { X, User, Phone, MapPin, Building, DollarSign, FileText } from 'lucide-react';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  businessName: string;
  onAddCustomer: (customer: Omit<ManagerCustomer, 'id'>) => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  businessId,
  businessName,
  onAddCustomer
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [reference, setReference] = useState('');
  const [openingDue, setOpeningDue] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Customer or Party Name is required.');
      return;
    }

    if (!phone.trim()) {
      setError('Phone number is required.');
      return;
    }

    if (!address.trim()) {
      setError('Customer address is required.');
      return;
    }

    const due = parseFloat(openingDue) || 0;

    onAddCustomer({
      businessId,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      reference: reference.trim() || 'Direct Customer',
      dueAmount: due,
      totalSales: due,
      totalPaid: 0,
      lastTransactionDate: new Date().toISOString().split('T')[0],
      status: due > 100000 ? 'Defaulter' : due > 0 ? 'Active' : 'Clear',
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString()
    });

    // Reset
    setName('');
    setPhone('');
    setAddress('');
    setReference('');
    setOpeningDue('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E5EAE8] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#073F37] text-white flex items-center justify-between border-b border-[#06352F]">
          <div>
            <span className="text-[10px] font-bold text-[#22A06B] uppercase tracking-wider block">
              {businessName} · NEW CUSTOMER
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Add New Customer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* 1. Customer Name */}
          <div>
            <label className="block text-xs font-bold text-[#18211F] mb-1">
              Customer / Party Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#71807B] absolute left-3 top-2.5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Haji Mokbul Traders / Bablu Fruits"
                className="w-full pl-9 pr-3 py-2 border border-[#E5EAE8] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0E5A4F] text-[#18211F]"
                required
              />
            </div>
          </div>

          {/* 2. Phone Number & Reference Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#18211F] mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#71807B] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01712-XXXXXX"
                  className="w-full pl-9 pr-3 py-2 border border-[#E5EAE8] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0E5A4F] text-[#18211F]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18211F] mb-1">
                Reference / Market Cluster
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-[#71807B] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. Kawran Bazar Cluster"
                  className="w-full pl-9 pr-3 py-2 border border-[#E5EAE8] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0E5A4F] text-[#18211F]"
                />
              </div>
            </div>
          </div>

          {/* 3. Address */}
          <div>
            <label className="block text-xs font-bold text-[#18211F] mb-1">
              Address & Market Area <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#71807B] absolute left-3 top-2.5" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Badamtoli Ghat-4, Sadarghat, Dhaka"
                className="w-full pl-9 pr-3 py-2 border border-[#E5EAE8] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0E5A4F] text-[#18211F]"
                required
              />
            </div>
          </div>

          {/* 4. Opening Due */}
          <div>
            <label className="block text-xs font-bold text-[#18211F] mb-1">
              Opening Due Balance (৳)
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-[#71807B] absolute left-3 top-2.5" />
              <input
                type="number"
                min="0"
                step="any"
                value={openingDue}
                onChange={(e) => setOpeningDue(e.target.value)}
                placeholder="0.00"
                className="w-full pl-9 pr-3 py-2 border border-[#E5EAE8] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0E5A4F] text-[#18211F] font-mono"
              />
            </div>
            <p className="text-[10px] text-[#71807B] mt-0.5">
              If the customer has existing previous dues, enter amount here (otherwise leave 0).
            </p>
          </div>

          {/* 5. Notes */}
          <div>
            <label className="block text-xs font-bold text-[#18211F] mb-1">
              Optional Notes
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-[#71807B] absolute left-3 top-2.5" />
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Credit terms or special instructions..."
                className="w-full pl-9 pr-3 py-2 border border-[#E5EAE8] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0E5A4F] text-[#18211F] resize-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#E5EAE8] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E5EAE8] rounded-xl text-xs font-semibold text-[#71807B] hover:bg-[#F6F8F7] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0E5A4F] hover:bg-[#073F37] text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
