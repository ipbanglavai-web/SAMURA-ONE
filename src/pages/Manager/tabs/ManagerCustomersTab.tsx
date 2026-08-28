import React, { useState } from 'react';
import { ManagerCustomer, SaleDueRecord, BusinessHealthItem } from '../../../types';
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  MapPin,
  Building,
  FileText,
  DollarSign,
  TrendingUp,
  ArrowUpDown,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  MessageSquare,
  Printer,
  Wallet,
  CreditCard
} from 'lucide-react';
import { CustomerStatementModal } from '../../../components/modals/CustomerStatementModal';
import { printCustomerList } from '../../../utils/printHelper';

interface ManagerCustomersTabProps {
  business: BusinessHealthItem;
  customers: ManagerCustomer[];
  records: SaleDueRecord[];
  onOpenAddCustomerModal: () => void;
  onOpenAddSaleModal: () => void;
  onDeleteCustomer: (id: string) => void;
  onUpdateCustomerDue: (id: string, newDue: number) => void;
  onOpenPayCustomerModal?: (customer: ManagerCustomer) => void;
}

export const ManagerCustomersTab: React.FC<ManagerCustomersTabProps> = ({
  business,
  customers,
  records,
  onOpenAddCustomerModal,
  onOpenAddSaleModal,
  onDeleteCustomer,
  onUpdateCustomerDue,
  onOpenPayCustomerModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDue, setFilterDue] = useState<'all' | 'has_due' | 'clear' | 'high_due'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCustomerForStatement, setSelectedCustomerForStatement] = useState<ManagerCustomer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<ManagerCustomer | null>(null);
  const [settleCustomer, setSettleCustomer] = useState<ManagerCustomer | null>(null);
  const [settleAmount, setSettleAmount] = useState('');

  // Calculate dynamic due from records if available or fallback to customer.dueAmount
  const enrichedCustomers = customers.map((c) => {
    // Check if there are sales records for this customer
    const cRecords = records.filter(
      (r) =>
        r.customerName.toLowerCase().trim() === c.name.toLowerCase().trim() ||
        r.address.toLowerCase().includes(c.phone.toLowerCase())
    );

    if (cRecords.length > 0) {
      // Latest running due from records
      const latestRecord = cRecords[0];
      return {
        ...c,
        dueAmount: c.dueAmount !== undefined ? c.dueAmount : latestRecord.runningDue,
        totalSales: cRecords.reduce((acc, curr) => acc + curr.amount, 0),
        totalPaid: (c.totalPaid || 0) + cRecords.reduce((acc, curr) => acc + curr.paid, 0),
        lastTransactionDate: latestRecord.date
      };
    }
    return c;
  });

  // Aggregates
  const totalCustomers = enrichedCustomers.length;
  const totalDueAmount = enrichedCustomers.reduce((acc, curr) => acc + (curr.dueAmount || 0), 0);
  const withDueCount = enrichedCustomers.filter((c) => (c.dueAmount || 0) > 0).length;
  const clearDueCount = enrichedCustomers.filter((c) => (c.dueAmount || 0) === 0).length;

  // Filtering
  const filteredCustomers = enrichedCustomers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.reference.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterDue === 'has_due') return c.dueAmount > 0;
    if (filterDue === 'clear') return c.dueAmount === 0;
    if (filterDue === 'high_due') return c.dueAmount >= 100000;

    return true;
  });

  const handleCopyPhone = (id: string, phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePayClick = (cust: ManagerCustomer) => {
    if (onOpenPayCustomerModal) {
      onOpenPayCustomerModal(cust);
    } else {
      setSettleCustomer(cust);
      setSettleAmount(cust.dueAmount.toString());
    }
  };

  const handleSettleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settleCustomer) return;
    const paid = parseFloat(settleAmount);
    if (isNaN(paid) || paid <= 0) return;

    const remaining = Math.max(0, settleCustomer.dueAmount - paid);
    onUpdateCustomerDue(settleCustomer.id, remaining);
    setSettleCustomer(null);
    setSettleAmount('');
  };

  return (
    <div className="space-y-6 animate-fade-in font-['Inter',sans-serif]">
      {/* 1. Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5EAE8] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#0E5A4F] uppercase tracking-wider bg-[#E6F4ED] px-2 py-0.5 rounded">
              CUSTOMER DIRECTORY
            </span>
            <span className="text-xs text-[#71807B]">{business.name}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#18211F] mt-1">
            Customer Directory & Due Balances
          </h2>
          <p className="text-xs text-[#71807B] mt-0.5">
            Live records of regular buyers, phone numbers, addresses, references, and pending dues.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            id="print-customers-btn"
            onClick={() => printCustomerList(filteredCustomers, business.name)}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E5EAE8] hover:bg-[#F6F8F7] hover:border-[#0E5A4F]/40 text-[#18211F] text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Print Customer List"
          >
            <Printer className="w-4 h-4 text-[#0E5A4F]" />
            <span>Print List ({filteredCustomers.length})</span>
          </button>

          <button
            id="customer-list-add-sale-btn"
            onClick={onOpenAddSaleModal}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E5EAE8] hover:bg-[#F6F8F7] text-[#18211F] text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-[#0E5A4F]" />
            <span>+ New Sale Entry</span>
          </button>

          <button
            id="customer-list-add-btn"
            onClick={onOpenAddCustomerModal}
            className="px-4 py-2 rounded-xl bg-[#0E5A4F] hover:bg-[#073F37] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Customer</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E5EAE8] shadow-xs">
          <div className="flex items-center justify-between text-[#71807B]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Customers</span>
            <Users className="w-4 h-4 text-[#0E5A4F]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#18211F] font-mono mt-1">
            {totalCustomers}
          </div>
          <div className="text-[11px] text-[#71807B] mt-1">
            Registered wholesale & retail buyers
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5EAE8] shadow-xs">
          <div className="flex items-center justify-between text-[#71807B]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Due Receivable</span>
            <DollarSign className="w-4 h-4 text-[#D9534F]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#D9534F] font-mono mt-1">
            ৳ {totalDueAmount.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#D9534F] font-medium mt-1">
            {withDueCount} parties with due balance
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5EAE8] shadow-xs">
          <div className="flex items-center justify-between text-[#71807B]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Zero Due Parties</span>
            <CheckCircle2 className="w-4 h-4 text-[#22A06B]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#22A06B] font-mono mt-1">
            {clearDueCount}
          </div>
          <div className="text-[11px] text-[#22A06B] font-medium mt-1">
            Fully settled accounts
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5EAE8] shadow-xs">
          <div className="flex items-center justify-between text-[#71807B]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Due Ratio</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#18211F] font-mono mt-1">
            {totalCustomers > 0 ? ((withDueCount / totalCustomers) * 100).toFixed(0) : 0}%
          </div>
          <div className="text-[11px] text-[#71807B] mt-1">
            Percentage of customers with due
          </div>
        </div>
      </div>

      {/* 3. Search and Quick Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E5EAE8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#71807B]" />
          <input
            id="search-customers-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, phone, address or reference..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#E5EAE8] bg-[#F6F8F7] focus:bg-white focus:border-[#0E5A4F] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-[#71807B] shrink-0 mr-1">Filter:</span>
          <button
            onClick={() => setFilterDue('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filterDue === 'all'
                ? 'bg-[#0E5A4F] text-white shadow-2xs font-semibold'
                : 'bg-[#F6F8F7] text-[#71807B] hover:text-[#18211F]'
            }`}
          >
            All ({totalCustomers})
          </button>
          <button
            onClick={() => setFilterDue('has_due')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filterDue === 'has_due'
                ? 'bg-[#D9534F] text-white shadow-2xs font-semibold'
                : 'bg-[#F6F8F7] text-[#71807B] hover:text-[#18211F]'
            }`}
          >
            Has Due ({withDueCount})
          </button>
          <button
            onClick={() => setFilterDue('clear')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filterDue === 'clear'
                ? 'bg-[#22A06B] text-white shadow-2xs font-semibold'
                : 'bg-[#F6F8F7] text-[#71807B] hover:text-[#18211F]'
            }`}
          >
            Paid / Clear ({clearDueCount})
          </button>
          <button
            onClick={() => setFilterDue('high_due')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filterDue === 'high_due'
                ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                : 'bg-[#F6F8F7] text-[#71807B] hover:text-[#18211F]'
            }`}
          >
            ৳100K+ Due
          </button>
        </div>
      </div>

      {/* 4. Customer List Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAE8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#F6F8F7] text-[#71807B] font-bold border-b border-[#E5EAE8] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center"># SL</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Reference / Customer Of</th>
                <th className="py-3 px-4 text-right">Due Amount</th>
                <th className="py-3 px-4 text-center min-w-[130px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE8]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#71807B]">
                    <div className="max-w-sm mx-auto space-y-2">
                      <Users className="w-8 h-8 text-[#71807B]/40 mx-auto" />
                      <p className="font-semibold text-[#18211F]">No customer information found</p>
                      <p className="text-[11px]">Change your search query or add a new customer.</p>
                      <button
                        onClick={onOpenAddCustomerModal}
                        className="mt-2 px-3 py-1.5 bg-[#0E5A4F] text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        + Add New Customer
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust, idx) => {
                  const hasDue = cust.dueAmount > 0;
                  const isCopied = copiedId === cust.id;

                  return (
                    <tr
                      key={cust.id}
                      className="hover:bg-[#F6F8F7]/70 transition-colors group"
                    >
                      {/* SL */}
                      <td className="py-3.5 px-4 text-center font-mono text-[#71807B]">
                        {idx + 1}
                      </td>

                      {/* 1. Customer Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0E5A4F]/10 text-[#0E5A4F] font-bold flex items-center justify-center text-xs shrink-0 border border-[#0E5A4F]/20">
                            {cust.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-[#18211F] text-sm group-hover:text-[#0E5A4F] transition-colors truncate max-w-[200px]">
                              {cust.name}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono uppercase tracking-wider ${
                                  hasDue
                                    ? cust.dueAmount >= 100000
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-amber-100 text-amber-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                {hasDue ? 'Due Party' : 'Clear'}
                              </span>
                              {cust.lastTransactionDate && (
                                <span className="text-[10px] text-[#71807B] truncate">
                                  · Last: {cust.lastTransactionDate}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Number (Phone) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${cust.phone}`}
                            className="font-mono font-semibold text-[#18211F] hover:text-[#0E5A4F] hover:underline flex items-center gap-1"
                            title="Call customer"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#0E5A4F]" />
                            <span>{cust.phone}</span>
                          </a>

                          <button
                            onClick={() => handleCopyPhone(cust.id, cust.phone)}
                            className="p-1 text-[#71807B] hover:text-[#18211F] rounded transition-colors cursor-pointer"
                            title="Copy number"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-[#22A06B]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* 3. Address */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <div className="flex items-start gap-1.5 text-[#71807B]">
                          <MapPin className="w-3.5 h-3.5 text-[#71807B] shrink-0 mt-0.5" />
                          <span className="text-xs text-[#18211F] leading-snug line-clamp-2">
                            {cust.address}
                          </span>
                        </div>
                      </td>

                      {/* 4. Reference / Customer of */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-[#0E5A4F] shrink-0" />
                          <span className="bg-[#F6F8F7] text-[#18211F] border border-[#E5EAE8] px-2 py-0.5 rounded-md text-[11px] font-semibold">
                            {cust.reference || 'Direct Party'}
                          </span>
                        </div>
                      </td>

                      {/* 5. Due amount */}
                      <td className="py-3.5 px-4 text-right">
                        {hasDue ? (
                          <div>
                            <span className="font-mono font-bold text-sm text-[#D9534F]">
                              ৳ {cust.dueAmount.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="font-mono font-bold text-sm text-[#22A06B]">
                              ৳ 0
                            </span>
                            <span className="text-[10px] text-[#22A06B] block">
                              (Paid)
                            </span>
                          </div>
                        )}
                      </td>

                      {/* 6. Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Pay Now Button */}
                          {hasDue && (
                            <button
                              id={`customer-settle-btn-${cust.id}`}
                              onClick={() => handlePayClick(cust)}
                              className="px-2.5 py-1 bg-[#22A06B] hover:bg-[#1C885A] text-white rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                              title="Collect Payment (Pay Now)"
                            >
                              <DollarSign className="w-3 h-3" />
                              <span>Pay Now</span>
                            </button>
                          )}

                          {/* Statement / Ledger */}
                          <button
                            id={`customer-statement-btn-${cust.id}`}
                            onClick={() => setSelectedCustomerForStatement(cust)}
                            className="p-1.5 text-[#0E5A4F] hover:bg-[#0E5A4F]/10 rounded-md transition-colors cursor-pointer"
                            title="View Customer Statement"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            id={`customer-delete-btn-${cust.id}`}
                            onClick={() => setCustomerToDelete(cust)}
                            className="p-1.5 text-[#71807B] hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Delete Customer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="p-4 bg-[#F6F8F7] border-t border-[#E5EAE8] flex flex-col sm:flex-row items-center justify-between text-xs text-[#71807B] gap-2 font-medium">
          <div>
            Showing: <strong className="text-[#18211F]">{filteredCustomers.length}</strong> Customers (Out of {enrichedCustomers.length} total)
          </div>
          <div className="flex items-center gap-4">
            <span>
              Total Due Receivable: <strong className="text-[#D9534F] font-mono text-sm">৳ {totalDueAmount.toLocaleString()}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 5. Statement Modal */}
      <CustomerStatementModal
        isOpen={!!selectedCustomerForStatement}
        onClose={() => setSelectedCustomerForStatement(null)}
        customer={selectedCustomerForStatement}
        records={records}
        businessName={business.name}
      />

      {/* 6. Quick Payment Collection / Settle Due Modal Fallback */}
      {settleCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-[#E5EAE8] animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 bg-[#073F37] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#22A06B] uppercase tracking-wider block">
                  PAYMENT COLLECTION
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  Settle Customer Due
                </h3>
              </div>
              <button
                onClick={() => setSettleCustomer(null)}
                className="p-1 rounded-lg text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSettleSubmit} className="p-5 space-y-4">
              <div>
                <p className="text-xs text-[#71807B]">Customer Name:</p>
                <p className="text-sm font-bold text-[#18211F] mt-0.5">{settleCustomer.name}</p>
                <p className="text-xs text-[#71807B] mt-0.5">{settleCustomer.phone} · {settleCustomer.address}</p>
              </div>

              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between">
                <span className="text-xs text-red-700 font-medium">Current Total Due:</span>
                <span className="text-base font-bold font-mono text-red-600">
                  ৳ {settleCustomer.dueAmount.toLocaleString()}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18211F] mb-1">
                  Collected Amount (৳) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 border border-[#E5EAE8] rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#0E5A4F] text-[#18211F]"
                  required
                  autoFocus
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSettleCustomer(null)}
                  className="px-3 py-1.5 border border-[#E5EAE8] rounded-lg text-xs font-semibold text-[#71807B] hover:bg-[#F6F8F7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#22A06B] hover:bg-[#1a8356] text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Delete Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-[#E5EAE8] space-y-4">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h4 className="text-sm font-bold text-[#18211F]">Delete Customer Record?</h4>
              <p className="text-xs text-[#71807B] mt-1">
                <strong>{customerToDelete.name}</strong> will be permanently removed from the customer directory.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCustomerToDelete(null)}
                className="px-4 py-2 border border-[#E5EAE8] rounded-xl text-xs font-semibold text-[#71807B] hover:bg-[#F6F8F7]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteCustomer(customerToDelete.id);
                  setCustomerToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
