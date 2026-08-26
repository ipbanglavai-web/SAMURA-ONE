import React, { useState, useMemo } from 'react';
import { SaleDueRecord, UnitProduct, BusinessHealthItem } from '../../../types';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Calendar,
  DollarSign,
  CreditCard,
  AlertTriangle,
  ArrowUpDown,
  Wallet,
  LayoutGrid,
  List,
  User,
  MapPin,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  ShoppingBag,
  Info
} from 'lucide-react';
import { printSalesDueLedger, printSaleVoucher } from '../../../utils/printHelper';

interface ManagerSalesDueTabProps {
  business: BusinessHealthItem;
  records: SaleDueRecord[];
  products: UnitProduct[];
  onOpenAddSaleModal: () => void;
  onDeleteRecord: (id: string) => void;
  onViewVoucher: (record: SaleDueRecord) => void;
  onOpenPayModal?: (record: SaleDueRecord) => void;
}

export const ManagerSalesDueTab: React.FC<ManagerSalesDueTabProps> = ({
  business,
  records,
  products,
  onOpenAddSaleModal,
  onDeleteRecord,
  onViewVoucher,
  onOpenPayModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'has_due' | 'Full Paid' | 'Overdue'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortBy, setSortBy] = useState<'date_desc' | 'due_desc' | 'amount_desc' | 'name_asc'>('date_desc');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<SaleDueRecord | null>(null);

  // Aggregate metrics
  const totalSales = records.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaid = records.reduce((acc, curr) => acc + curr.paid, 0);
  const totalRunningDue = records.reduce((acc, curr) => acc + curr.runningDue, 0);
  const totalSacrifice = records.reduce((acc, curr) => acc + curr.sacrifice, 0);
  const dueRecordsCount = records.filter((r) => r.runningDue > 0).length;
  const paidRecordsCount = records.filter((r) => r.runningDue === 0).length;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueCount = records.filter(
    (r) => r.runningDue > 0 && r.duePaymentDate && r.duePaymentDate < todayStr
  ).length;

  // Filter & Sort
  const processedRecords = useMemo(() => {
    return records
      .filter((r) => {
        const matchesSearch =
          r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.customerOf.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesStatus = true;
        if (filterStatus === 'has_due') {
          matchesStatus = r.runningDue > 0;
        } else if (filterStatus === 'Full Paid') {
          matchesStatus = r.runningDue === 0 || r.status === 'Full Paid';
        } else if (filterStatus === 'Overdue') {
          matchesStatus =
            r.runningDue > 0 && !!r.duePaymentDate && r.duePaymentDate < todayStr;
        }

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'due_desc') return b.runningDue - a.runningDue;
        if (sortBy === 'amount_desc') return b.amount - a.amount;
        if (sortBy === 'name_asc') return a.customerName.localeCompare(b.customerName);
        // default date_desc
        return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
      });
  }, [records, searchTerm, filterStatus, sortBy, todayStr]);

  const toggleExpandRow = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 animate-fade-in font-['Inter',sans-serif]">
      {/* 1. Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5EAE8] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#0E5A4F] uppercase tracking-wider bg-[#E6F4ED] px-2 py-0.5 rounded">
              SALES & DUE LEDGER
            </span>
            <span className="text-xs text-[#71807B] font-medium">{business.name}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#18211F] mt-1">
            Customer Sales & Due Ledger
          </h2>
          <p className="text-xs text-[#71807B] mt-0.5">
            Structured records of sales invoices, previous dues, collections, and remaining balances.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            id="print-ledger-btn"
            onClick={() =>
              printSalesDueLedger(
                processedRecords,
                business.name,
                filterStatus === 'all'
                  ? 'All Records'
                  : filterStatus === 'has_due'
                  ? 'Due Records'
                  : filterStatus === 'Full Paid'
                  ? 'Paid Records'
                  : 'Overdue Records'
              )
            }
            className="px-3.5 py-2.5 rounded-xl bg-white border border-[#E5EAE8] text-[#18211F] hover:bg-[#F6F8F7] hover:border-[#0E5A4F]/40 text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            title="Print Filtered Ledger"
          >
            <Printer className="w-4 h-4 text-[#0E5A4F]" />
            <span>Print Ledger ({processedRecords.length})</span>
          </button>

          <button
            id="sales-due-add-btn"
            onClick={onOpenAddSaleModal}
            className="px-4 py-2.5 rounded-xl bg-[#0E5A4F] hover:bg-[#073F37] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Sale & Due Entry</span>
          </button>
        </div>
      </div>

      {/* 2. Clean KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Sales */}
        <div className="bg-white p-4 rounded-xl border border-[#E5EAE8] shadow-xs hover:border-[#0E5A4F]/30 transition-all">
          <div className="flex items-center justify-between text-[#71807B]">
            <span className="text-[11px] font-semibold text-[#71807B]">Total Sales</span>
            <div className="w-7 h-7 rounded-lg bg-[#E6F4ED] text-[#0E5A4F] flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#18211F] font-mono mt-2">
            ৳ {totalSales.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#71807B] mt-1 flex items-center justify-between">
            <span>Total Invoices: {records.length}</span>
            {totalSacrifice > 0 && (
              <span className="text-[#D9A441] font-mono">Discount: ৳{totalSacrifice.toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* Total Collected / Paid */}
        <div className="bg-white p-4 rounded-xl border border-[#E5EAE8] shadow-xs hover:border-[#22A06B]/30 transition-all">
          <div className="flex items-center justify-between text-[#71807B]">
            <span className="text-[11px] font-semibold text-[#71807B]">Cash Collected</span>
            <div className="w-7 h-7 rounded-lg bg-[#E6F4ED] text-[#22A06B] flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#22A06B] font-mono mt-2">
            ৳ {totalPaid.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#22A06B] mt-1 font-medium">
            Paid Invoices: {paidRecordsCount}
          </div>
        </div>

        {/* Total Running Due */}
        <div className="bg-white p-4 rounded-xl border border-[#E5EAE8] shadow-xs hover:border-[#D9534F]/30 transition-all">
          <div className="flex items-center justify-between text-[#71807B]">
            <span className="text-[11px] font-semibold text-[#71807B]">Running Due</span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-[#D9534F] flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#D9534F] font-mono mt-2">
            ৳ {totalRunningDue.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#D9534F] mt-1 font-medium">
            {dueRecordsCount} invoices with due balance
          </div>
        </div>

        {/* Overdue Alert */}
        <div className="bg-white p-4 rounded-xl border border-[#E5EAE8] shadow-xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between text-[#71807B]">
            <span className="text-[11px] font-semibold text-[#71807B]">Overdue Invoices</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-600 font-mono mt-2">
            {overdueCount} <span className="text-xs font-sans font-normal text-[#71807B]">Invoices</span>
          </div>
          <div className="text-[11px] text-[#71807B] mt-1">
            Requires follow-up / collection
          </div>
        </div>
      </div>

      {/* 3. Search, Clean Filters, Sort & View Mode Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EAE8] shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#71807B]" />
            <input
              id="search-sales-due-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customer name, phone, market, product or invoice #..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#E5EAE8] bg-[#F6F8F7] focus:bg-white focus:border-[#0E5A4F] focus:outline-none transition-all placeholder:text-[#71807B]/70"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-[#71807B] hover:text-[#18211F]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-xs font-semibold text-[#71807B] shrink-0 mr-1 hidden sm:inline">
              Filter:
            </span>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === 'all'
                  ? 'bg-[#0E5A4F] text-white shadow-2xs'
                  : 'bg-[#F6F8F7] text-[#71807B] hover:bg-[#E5EAE8]'
              }`}
            >
              All ({records.length})
            </button>
            <button
              onClick={() => setFilterStatus('has_due')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === 'has_due'
                  ? 'bg-[#D9534F] text-white shadow-2xs'
                  : 'bg-[#F6F8F7] text-[#71807B] hover:bg-[#E5EAE8]'
              }`}
            >
              Has Due ({dueRecordsCount})
            </button>
            <button
              onClick={() => setFilterStatus('Full Paid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === 'Full Paid'
                  ? 'bg-[#22A06B] text-white shadow-2xs'
                  : 'bg-[#F6F8F7] text-[#71807B] hover:bg-[#E5EAE8]'
              }`}
            >
              Paid ({paidRecordsCount})
            </button>
            {overdueCount > 0 && (
              <button
                onClick={() => setFilterStatus('Overdue')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === 'Overdue'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-[#F6F8F7] text-amber-700 hover:bg-amber-100'
                }`}
              >
                Overdue ({overdueCount})
              </button>
            )}
          </div>

          {/* Sort & View Mode Switch */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 bg-[#F6F8F7] px-2 py-1 rounded-lg border border-[#E5EAE8] text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#71807B]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-medium text-[#18211F] focus:outline-none cursor-pointer"
              >
                <option value="date_desc">Newest Date First</option>
                <option value="due_desc">Highest Due First</option>
                <option value="amount_desc">Highest Sale Amount</option>
                <option value="name_asc">Customer Name (A-Z)</option>
              </select>
            </div>

            {/* View Mode Toggle: Table vs Cards */}
            <div className="flex items-center bg-[#F6F8F7] p-0.5 rounded-lg border border-[#E5EAE8]">
              <button
                onClick={() => setViewMode('table')}
                title="Table View"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-[#0E5A4F] shadow-2xs font-bold'
                    : 'text-[#71807B] hover:text-[#18211F]'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                title="Card View"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white text-[#0E5A4F] shadow-2xs font-bold'
                    : 'text-[#71807B] hover:text-[#18211F]'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Content Area (Clean Table OR Structured Cards) */}
      {processedRecords.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5EAE8] p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#F6F8F7] text-[#71807B] flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6 text-[#71807B]/60" />
          </div>
          <h3 className="text-base font-bold text-[#18211F]">No sales or due records found</h3>
          <p className="text-xs text-[#71807B] mt-1 max-w-sm mx-auto">
            Change your search filter or add a new sales and due entry.
          </p>
          <button
            onClick={onOpenAddSaleModal}
            className="mt-4 px-4 py-2 bg-[#0E5A4F] hover:bg-[#073F37] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Entry</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* ================= CLEAN REFINED TABLE VIEW ================= */
        <div className="bg-white rounded-2xl border border-[#E5EAE8] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0E5A4F] text-white font-bold text-xs border-b border-[#073F37] uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-bold text-white">Invoice & Date</th>
                  <th className="py-3.5 px-4 font-bold text-white">Customer & Area</th>
                  <th className="py-3.5 px-4 font-bold text-white">Product & Qty</th>
                  <th className="py-3.5 px-4 text-right font-bold text-white">Sale Breakdown</th>
                  <th className="py-3.5 px-4 text-right font-bold text-white">Cash Paid</th>
                  <th className="py-3.5 px-4 text-right font-bold text-white">Running Due</th>
                  <th className="py-3.5 px-4 text-center font-bold text-white">Due Date & Status</th>
                  <th className="py-3.5 px-4 text-center min-w-[130px] font-bold text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAE8]">
                {processedRecords.map((r) => {
                  const isOverdue =
                    r.runningDue > 0 &&
                    r.duePaymentDate &&
                    r.duePaymentDate < todayStr;
                  const isExpanded = expandedRowId === r.id;

                  return (
                    <React.Fragment key={r.id}>
                      <tr className="hover:bg-[#F6F8F7] transition-all group">
                        {/* 1. Memo & Date */}
                        <td className="py-3.5 px-4 align-middle">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleExpandRow(r.id)}
                              className="text-[#71807B] hover:text-[#0E5A4F] p-0.5 rounded cursor-pointer transition-colors"
                              title="Click to view details"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5 text-[#0E5A4F]" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-[#71807B]" />
                              )}
                            </button>
                            <div>
                              <span className="font-mono font-bold text-[#18211F] text-xs block group-hover:text-[#0E5A4F] transition-colors">
                                {r.invoiceNo}
                              </span>
                              <span className="text-[11px] text-[#71807B] flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-[#71807B]" />
                                {r.date}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Customer & Area */}
                        <td className="py-3.5 px-4 max-w-[200px] align-middle">
                          <div className="font-bold text-[#18211F] text-xs truncate">
                            {r.customerName}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="text-[10px] bg-[#0E5A4F]/10 text-[#0E5A4F] px-1.5 py-0.2 rounded font-bold truncate max-w-[120px]">
                              {r.customerOf || 'General'}
                            </span>
                            <span className="text-[11px] text-[#71807B] truncate max-w-[130px]" title={r.address}>
                              {r.address}
                            </span>
                          </div>
                        </td>

                        {/* 3. Product & Quantity */}
                        <td className="py-3.5 px-4 align-middle">
                          <div className="font-semibold text-[#18211F] text-xs">
                            {r.productName}
                          </div>
                          <div className="text-[11px] text-[#71807B] mt-0.5">
                            <span className="font-bold text-[#0E5A4F] bg-[#0E5A4F]/10 px-1.5 py-0.2 rounded text-[10px]">{r.quantity} {r.productUnit}</span>
                            <span className="text-[10px] ml-1.5 font-mono text-[#71807B]">(@ ৳{r.unitPrice.toLocaleString()})</span>
                          </div>
                        </td>

                        {/* 4. Sale Bill & Breakdown */}
                        <td className="py-3.5 px-4 text-right font-mono align-middle">
                          <div className="font-bold text-xs text-[#18211F]">
                            ৳ {r.amount.toLocaleString()}
                          </div>
                          {(r.exDue > 0 || r.sacrifice > 0) && (
                            <div className="text-[10px] text-[#71807B] mt-0.5 space-x-1">
                              {r.exDue > 0 && (
                                <span>Prev: +৳{r.exDue.toLocaleString()}</span>
                              )}
                              {r.sacrifice > 0 && (
                                <span className="text-amber-600">Disc: -৳{r.sacrifice.toLocaleString()}</span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* 5. Paid */}
                        <td className="py-3.5 px-4 text-right font-mono align-middle">
                          <div className="font-bold text-xs text-[#168051]">
                            ৳ {r.paid.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-[#71807B] mt-0.5">
                            {r.paid >= r.payableDue ? 'Full Paid' : r.paid > 0 ? 'Partial' : '৳0 Paid'}
                          </div>
                        </td>

                        {/* 6. Running Due */}
                        <td className="py-3.5 px-4 text-right font-mono align-middle">
                          {r.runningDue > 0 ? (
                            <span className="inline-block font-bold text-xs text-[#C93B37]">
                              ৳ {r.runningDue.toLocaleString()}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[#168051] font-bold text-[11px] bg-[#E6F4ED] px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Paid</span>
                            </span>
                          )}
                        </td>

                        {/* 7. Due Date & Status */}
                        <td className="py-3.5 px-4 text-center align-middle">
                          <div className="flex flex-col items-center gap-0.5">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                r.runningDue === 0
                                  ? 'bg-[#E6F4ED] text-[#168051] border border-[#22A06B]/20'
                                  : isOverdue
                                  ? 'bg-red-50 text-[#C93B37] border border-red-200'
                                  : 'bg-amber-50 text-[#B45309] border border-amber-200'
                              }`}
                            >
                              {r.runningDue === 0 ? 'Full Paid' : isOverdue ? 'Overdue' : 'Partial Due'}
                            </span>
                            {r.duePaymentDate && r.runningDue > 0 && (
                              <span className="text-[10px] text-[#71807B] flex items-center gap-1 font-mono mt-0.5">
                                <Calendar className="w-2.5 h-2.5" />
                                {r.duePaymentDate}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 8. Actions */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Pay Now Button */}
                            {r.runningDue > 0 && onOpenPayModal && (
                              <button
                                onClick={() => onOpenPayModal(r)}
                                className="px-2.5 py-1 rounded-lg bg-[#22A06B] hover:bg-[#1a8356] text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer active:scale-95"
                                title="Collect payment"
                              >
                                <DollarSign className="w-3 h-3" />
                                <span>Pay Now</span>
                              </button>
                            )}

                            {/* View / Print Voucher */}
                            <button
                              onClick={() => onViewVoucher(r)}
                              className="p-1.5 rounded-lg text-[#0E5A4F] hover:bg-[#E6F4ED] transition-colors cursor-pointer"
                              title="View & Print Voucher"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Record */}
                            <button
                              onClick={() => setRecordToDelete(r)}
                              className="p-1.5 rounded-lg text-[#71807B] hover:text-[#D9534F] hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Breakdown Drawer */}
                      {isExpanded && (
                        <tr className="bg-[#F8FAF9] border-b border-[#E5EAE8]">
                          <td colSpan={8} className="p-4">
                            <div className="bg-white p-3.5 rounded-xl border border-[#E5EAE8] shadow-2xs space-y-2 text-xs">
                              <div className="flex items-center justify-between border-b border-[#E5EAE8] pb-2">
                                <span className="font-bold text-[#0E5A4F] flex items-center gap-1.5">
                                  <Info className="w-3.5 h-3.5" />
                                  <span>Invoice Breakdown & Computation ({r.invoiceNo})</span>
                                </span>
                                <span className="text-[11px] text-[#71807B]">
                                  Date: <strong>{r.date}</strong> · Target Due Date: <strong>{r.duePaymentDate || 'N/A'}</strong>
                                </span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1 text-center font-mono">
                                <div className="p-2 bg-[#F6F8F7] rounded-lg">
                                  <span className="text-[10px] text-[#71807B] block">1. Sale Bill</span>
                                  <span className="font-bold text-[#18211F]">৳ {r.amount.toLocaleString()}</span>
                                </div>
                                <div className="p-2 bg-[#F6F8F7] rounded-lg">
                                  <span className="text-[10px] text-[#71807B] block">2. Prev Due (Ex-Due)</span>
                                  <span className="font-bold text-amber-700">৳ {r.exDue.toLocaleString()}</span>
                                </div>
                                <div className="p-2 bg-[#F6F8F7] rounded-lg">
                                  <span className="text-[10px] text-[#71807B] block">3. Discount</span>
                                  <span className="font-bold text-[#D9A441]">- ৳ {r.sacrifice.toLocaleString()}</span>
                                </div>
                                <div className="p-2 bg-[#F6F8F7] rounded-lg">
                                  <span className="text-[10px] text-[#71807B] block">4. Total Payable</span>
                                  <span className="font-bold text-[#0E5A4F]">৳ {r.payableDue.toLocaleString()}</span>
                                </div>
                                <div className="p-2 bg-red-50 border border-red-100 rounded-lg col-span-2 sm:col-span-1">
                                  <span className="text-[10px] text-red-600 font-sans font-medium block">Running Due</span>
                                  <span className="font-bold text-[#D9534F] text-sm">৳ {r.runningDue.toLocaleString()}</span>
                                </div>
                              </div>

                              {r.notes && (
                                <div className="pt-1.5 text-xs text-[#71807B] bg-[#F6F8F7] p-2 rounded-lg">
                                  <span className="font-semibold text-[#18211F]">Notes / Remarks:</span> {r.notes}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 bg-[#F6F8F7] border-t border-[#E5EAE8] flex flex-col sm:flex-row items-center justify-between text-xs text-[#71807B] gap-2">
            <div>
              Showing: <strong className="text-[#18211F]">{processedRecords.length}</strong> Invoices (Out of {records.length} total)
            </div>
            <div className="flex items-center gap-4">
              <span>
                Total Running Due: <strong className="text-[#D9534F] font-mono text-sm">৳ {totalRunningDue.toLocaleString()}</strong>
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ================= CLEAN CARD / GRID VIEW ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {processedRecords.map((r) => {
            const isOverdue =
              r.runningDue > 0 &&
              r.duePaymentDate &&
              r.duePaymentDate < todayStr;

            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-[#E5EAE8] shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between space-y-3 relative group"
              >
                {/* Card Top: Memo, Date, Status */}
                <div className="flex items-center justify-between border-b border-[#E5EAE8] pb-2.5">
                  <div>
                    <span className="font-mono font-bold text-xs text-[#0E5A4F] block">
                      {r.invoiceNo}
                    </span>
                    <span className="text-[10px] text-[#71807B] flex items-center gap-1 mt-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {r.date}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      r.runningDue === 0
                        ? 'bg-[#E6F4ED] text-[#22A06B]'
                        : isOverdue
                        ? 'bg-red-100 text-[#D9534F]'
                        : 'bg-[#FEF6E7] text-[#D9A441]'
                    }`}
                  >
                    {r.runningDue === 0 ? 'Full Paid' : isOverdue ? 'Overdue' : 'Due'}
                  </span>
                </div>

                {/* Customer Details */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#18211F] truncate">
                      {r.customerName}
                    </h3>
                    <span className="text-[10px] bg-[#F6F8F7] border border-[#E5EAE8] text-[#0E5A4F] px-1.5 py-0.5 rounded font-semibold shrink-0 ml-1">
                      {r.customerOf}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#71807B] truncate mt-0.5" title={r.address}>
                    {r.address}
                  </p>
                </div>

                {/* Product Detail Pill */}
                <div className="bg-[#F6F8F7] p-2.5 rounded-xl border border-[#E5EAE8]/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#18211F] block">{r.productName}</span>
                    <span className="text-[10px] text-[#71807B]">@ ৳{r.unitPrice.toLocaleString()}/{r.productUnit}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-[#0E5A4F]">
                      {r.quantity} {r.productUnit}
                    </span>
                    <span className="text-[10px] text-[#71807B] block font-mono">
                      ৳{r.amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Financial Summary Grid */}
                <div className="grid grid-cols-3 gap-2 bg-[#FAFCFA] p-2.5 rounded-xl border border-[#E5EAE8] text-center font-mono">
                  <div>
                    <span className="text-[9px] uppercase text-[#71807B] block">Total Payable</span>
                    <span className="text-xs font-bold text-[#18211F]">৳{r.payableDue.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-[#71807B] block">Cash Paid</span>
                    <span className="text-xs font-bold text-[#22A06B]">৳{r.paid.toLocaleString()}</span>
                  </div>
                  <div className="bg-red-50/80 rounded-lg p-0.5">
                    <span className="text-[9px] uppercase text-red-600 font-sans font-bold block">Running Due</span>
                    <span className={`text-xs font-bold ${r.runningDue > 0 ? 'text-[#D9534F]' : 'text-[#22A06B]'}`}>
                      ৳{r.runningDue.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Due Date & Note if available */}
                {r.duePaymentDate && r.runningDue > 0 && (
                  <div className="text-[11px] text-[#71807B] flex items-center justify-between px-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#71807B]" />
                      Payment Due Date:
                    </span>
                    <strong className={`font-mono ${isOverdue ? 'text-[#D9534F]' : 'text-[#18211F]'}`}>
                      {r.duePaymentDate}
                    </strong>
                  </div>
                )}

                {/* Card Actions Footer */}
                <div className="pt-2 border-t border-[#E5EAE8] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onViewVoucher(r)}
                      className="p-1.5 rounded-lg text-[#0E5A4F] hover:bg-[#E6F4ED] text-xs font-medium flex items-center gap-1 cursor-pointer"
                      title="Print Invoice"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Invoice</span>
                    </button>
                    <button
                      onClick={() => setRecordToDelete(r)}
                      className="p-1.5 rounded-lg text-[#71807B] hover:text-[#D9534F] hover:bg-red-50 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {r.runningDue > 0 && onOpenPayModal && (
                    <button
                      onClick={() => onOpenPayModal(r)}
                      className="px-3 py-1.5 rounded-xl bg-[#22A06B] hover:bg-[#1a8356] text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer active:scale-95"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Pay Now</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Delete Record Confirmation Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-center shadow-2xl border border-[#E5EAE8]">
            <div className="w-12 h-12 rounded-full bg-red-100 text-[#D9534F] flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#18211F]">Confirm Sale Record Deletion</h3>
            <p className="text-xs text-[#71807B] mt-1">
              Are you sure you want to delete invoice <strong>{recordToDelete.invoiceNo}</strong> for <strong>{recordToDelete.customerName}</strong>?
            </p>
            <div className="mt-5 flex items-center justify-center gap-2.5">
              <button
                onClick={() => setRecordToDelete(null)}
                className="px-4 py-2 rounded-xl border border-[#E5EAE8] text-xs font-bold text-[#71807B] hover:bg-[#F6F8F7] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteRecord(recordToDelete.id);
                  setRecordToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#D9534F] hover:bg-red-700 text-white text-xs font-bold cursor-pointer shadow-xs"
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
