import React from 'react';
import { ManagerCustomer, SaleDueRecord } from '../../types';
import {
  X,
  Printer,
  Download,
  Building2,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { printCustomerStatement } from '../../utils/printHelper';

interface CustomerStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: ManagerCustomer | null;
  records: SaleDueRecord[];
  businessName: string;
}

export const CustomerStatementModal: React.FC<CustomerStatementModalProps> = ({
  isOpen,
  onClose,
  customer,
  records,
  businessName
}) => {
  if (!isOpen || !customer) return null;

  // Filter records for this customer
  const customerRecords = records.filter(
    (r) =>
      r.customerName.toLowerCase().trim() === customer.name.toLowerCase().trim() ||
      r.address.toLowerCase().includes(customer.phone.toLowerCase())
  );

  const totalBilled = customerRecords.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaid = customerRecords.reduce((acc, curr) => acc + curr.paid, 0);
  const totalSacrifice = customerRecords.reduce((acc, curr) => acc + curr.sacrifice, 0);
  const runningDue = customer.dueAmount;

  const handlePrint = () => {
    printCustomerStatement(customer, records, businessName);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E5EAE8] animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#073F37] text-white flex items-center justify-between border-b border-[#06352F] shrink-0">
          <div>
            <span className="text-[10px] font-bold text-[#22A06B] uppercase tracking-wider block">
              {businessName} · CUSTOMER LEDGER STATEMENT
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Customer Statement & Account Ledger
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="Print Statement"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Customer Profile Card */}
          <div className="p-4 bg-[#F6F8F7] rounded-xl border border-[#E5EAE8] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-[#18211F]">{customer.name}</h4>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    customer.dueAmount > 0
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {customer.dueAmount > 0 ? 'Due Outstanding' : 'Settled'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-2 text-xs text-[#71807B]">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#0E5A4F]" />
                  <a href={`tel:${customer.phone}`} className="hover:underline font-mono text-[#18211F]">
                    {customer.phone}
                  </a>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0E5A4F]" />
                  <span>{customer.address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#0E5A4F]" />
                  <span>Reference: <strong className="text-[#18211F]">{customer.reference}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0E5A4F]" />
                  <span>Last Transaction: <strong className="text-[#18211F]">{customer.lastTransactionDate || 'N/A'}</strong></span>
                </div>
              </div>
            </div>

            {/* Current Due Highlight Box */}
            <div className="bg-white p-3 rounded-xl border border-[#E5EAE8] shadow-2xs text-right shrink-0 min-w-[160px]">
              <span className="text-[10px] font-bold uppercase text-[#71807B] block">Current Due Balance</span>
              <span className="text-xl font-bold font-mono text-[#D9534F] block mt-0.5">
                ৳ {customer.dueAmount.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#71807B] block mt-0.5">
                {customer.dueAmount > 0 ? 'Balance Pending' : 'Account Settled'}
              </span>
            </div>
          </div>

          {/* Financial Summary Strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-white border border-[#E5EAE8] rounded-xl text-center">
              <span className="text-[10px] font-bold uppercase text-[#71807B] block">Total Billed</span>
              <span className="text-sm sm:text-base font-bold font-mono text-[#18211F] mt-0.5 block">
                ৳ {(totalBilled || customer.totalSales || 0).toLocaleString()}
              </span>
            </div>
            <div className="p-3 bg-white border border-[#E5EAE8] rounded-xl text-center">
              <span className="text-[10px] font-bold uppercase text-[#71807B] block">Total Paid</span>
              <span className="text-sm sm:text-base font-bold font-mono text-[#22A06B] mt-0.5 block">
                ৳ {(totalPaid || customer.totalPaid || 0).toLocaleString()}
              </span>
            </div>
            <div className="p-3 bg-white border border-[#E5EAE8] rounded-xl text-center">
              <span className="text-[10px] font-bold uppercase text-[#71807B] block">Due Balance</span>
              <span className="text-sm sm:text-base font-bold font-mono text-[#D9534F] mt-0.5 block">
                ৳ {runningDue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Transaction Table */}
          <div>
            <h5 className="text-xs font-bold text-[#18211F] uppercase tracking-wider mb-2">
              Transaction Ledger History
            </h5>

            {customerRecords.length === 0 ? (
              <div className="p-6 bg-[#F6F8F7] border border-[#E5EAE8] rounded-xl text-center text-xs text-[#71807B]">
                No sales or collection records found for this customer.
              </div>
            ) : (
              <div className="border border-[#E5EAE8] rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#F6F8F7] text-[#71807B] font-bold border-b border-[#E5EAE8]">
                    <tr>
                      <th className="p-2.5">Date & Invoice</th>
                      <th className="p-2.5">Product & Qty</th>
                      <th className="p-2.5 text-right">Sale Amount</th>
                      <th className="p-2.5 text-right">Paid Amount</th>
                      <th className="p-2.5 text-right">Running Due</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EAE8] font-medium text-[#18211F]">
                    {customerRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-[#F6F8F7]/60">
                        <td className="p-2.5">
                          <div className="font-semibold">{rec.date}</div>
                          <div className="text-[10px] font-mono text-[#71807B]">{rec.invoiceNo}</div>
                        </td>
                        <td className="p-2.5">
                          <div className="font-semibold text-[#0E5A4F]">{rec.productName}</div>
                          <div className="text-[10px] text-[#71807B]">
                            {rec.quantity} {rec.productUnit} @ ৳{rec.unitPrice}
                          </div>
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold">
                          ৳ {rec.amount.toLocaleString()}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-[#22A06B]">
                          ৳ {rec.paid.toLocaleString()}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-[#D9534F]">
                          ৳ {rec.runningDue.toLocaleString()}
                        </td>
                        <td className="p-2.5 text-center">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              rec.status === 'Full Paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : rec.status === 'Overdue'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F6F8F7] border-t border-[#E5EAE8] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[#71807B]">
            Print Date: {new Date().toLocaleDateString('en-US')} · AL SAMURA Group ERP
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0E5A4F] text-white rounded-lg text-xs font-bold hover:bg-[#073F37] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
