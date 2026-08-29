import React, { useState, useEffect, useMemo } from 'react';
import {
  BusinessHealthItem,
  BusinessManager,
  SaleDueRecord,
  UnitProduct,
  ManagerCustomer
} from '../../types';
import {
  INITIAL_SALES_DUE_DATA,
  INITIAL_PRODUCTS_DATA,
  INITIAL_CUSTOMERS_DATA,
  getTodayIso,
  getYesterdayIso,
  getDaysAgoIso
} from '../../data/mockData';
import {
  subscribeToSalesRecords,
  subscribeToProducts,
  subscribeToCustomers,
  saveSaleRecordToFirestore,
  deleteSaleRecordFromFirestore,
  updateSalePaymentInFirestore,
  saveProductToFirestore,
  saveCustomerToFirestore,
  updateCustomerDueInFirestore
} from '../../services/firestoreService';
import { SaleVoucherModal } from './SaleVoucherModal';
import { PayDueModal } from './PayDueModal';
import { AddSaleDueModal } from './AddSaleDueModal';
import { AddProductModal } from './AddProductModal';
import { AddCustomerModal } from './AddCustomerModal';
import { printSalesDueLedger } from '../../utils/printHelper';
import { getBusinessGrowthData } from '../../utils/businessCalculations';
import {
  Building2,
  X,
  Printer,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  FileText,
  UserCheck,
  Package,
  Users,
  Shield,
  Eye,
  Trash2,
  RefreshCw,
  Phone,
  MapPin,
  Clock,
  ArrowUpRight,
  Activity,
  BadgePercent,
  PlusCircle,
  ShoppingBag
} from 'lucide-react';

export type UnitDetailsTab = 'sales_due' | 'products' | 'customers' | 'manager_info';

interface BusinessUnitDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessHealthItem | null;
  managers?: BusinessManager[];
}

export const BusinessUnitDetailsModal: React.FC<BusinessUnitDetailsModalProps> = ({
  isOpen,
  onClose,
  business,
  managers = []
}) => {
  if (!isOpen || !business) return null;

  // Active sub-tab state
  const [activeTab, setActiveTab] = useState<UnitDetailsTab>('sales_due');

  // Date filter state (Default to 'Today')
  const [dateFilter, setDateFilter] = useState<'Today' | 'Yesterday' | 'Last 7 Days' | 'This Month' | 'All Records'>('Today');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'has_due' | 'Full Paid' | 'Overdue'>('all');

  // Sub-modals
  const [selectedVoucherRecord, setSelectedVoucherRecord] = useState<SaleDueRecord | null>(null);
  const [selectedPayDueRecord, setSelectedPayDueRecord] = useState<SaleDueRecord | null>(null);
  const [isAddSaleModalOpen, setIsAddSaleModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Find assigned manager
  const assignedManager = managers.find(
    (m) =>
      m.businessId === business.id ||
      m.businessName.toLowerCase() === business.name.toLowerCase() ||
      m.name === business.manager
  );

  // 1. Sales & Due State
  const [allSalesRecords, setAllSalesRecords] = useState<SaleDueRecord[]>(() => {
    try {
      const stored = localStorage.getItem('samura_sales_due_records_v2') || localStorage.getItem('samura_sales_due_records');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SALES_DUE_DATA;
  });

  // 2. Products State
  const [allProducts, setAllProducts] = useState<UnitProduct[]>(() => {
    try {
      const stored = localStorage.getItem('samura_unit_products_v2') || localStorage.getItem('samura_unit_products');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRODUCTS_DATA;
  });

  // 3. Customers State
  const [allCustomers, setAllCustomers] = useState<ManagerCustomer[]>(() => {
    try {
      const stored = localStorage.getItem('samura_manager_customers_v2') || localStorage.getItem('samura_manager_customers');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CUSTOMERS_DATA;
  });

  // Realtime Firestore listeners
  useEffect(() => {
    const unsubSales = subscribeToSalesRecords((remoteRecords) => {
      setAllSalesRecords(remoteRecords);
    });
    const unsubProducts = subscribeToProducts((remoteProducts) => {
      setAllProducts(remoteProducts);
    });
    const unsubCustomers = subscribeToCustomers((remoteCustomers) => {
      setAllCustomers(remoteCustomers);
    });

    return () => {
      unsubSales();
      unsubProducts();
      unsubCustomers();
    };
  }, []);

  // Filter dataset for current business unit (e.g. Elenga Fruits)
  const isTargetBusiness = (businessId?: string) => {
    if (!businessId) return false;
    const cleanBizId = business.id.toLowerCase();
    const cleanBizName = business.name.toLowerCase();

    // Map common aliases
    if (cleanBizName.includes('elenga') || cleanBizId.includes('elenga') || cleanBizId === 'bh-1' || cleanBizId === 'biz-1') {
      return businessId === 'bh-1' || businessId === 'biz-1' || businessId.toLowerCase().includes('elenga') || businessId.toLowerCase().includes('ef');
    }
    if (cleanBizName.includes('mourin') || cleanBizId.includes('mourin') || cleanBizId === 'bh-2' || cleanBizId === 'biz-2') {
      return businessId === 'bh-2' || businessId === 'biz-2' || businessId.toLowerCase().includes('mourin') || businessId.toLowerCase().includes('mf');
    }
    if (cleanBizName.includes('kushtia') || cleanBizId === 'bh-3' || cleanBizId === 'biz-3') {
      return businessId === 'bh-3' || businessId === 'biz-3' || businessId.toLowerCase().includes('kushtia');
    }
    return businessId === business.id;
  };

  const unitSalesRecords = useMemo(() => {
    const matched = allSalesRecords.filter((r) => isTargetBusiness(r.businessId));
    // If no records specifically match by ID, provide the general records if it's the primary Elenga Fruits unit
    if (matched.length === 0 && (business.name.toLowerCase().includes('elenga') || business.id === 'bh-1')) {
      return allSalesRecords;
    }
    return matched;
  }, [allSalesRecords, business]);

  const unitProducts = useMemo(() => {
    const matched = allProducts.filter((p) => isTargetBusiness(p.businessId));
    if (matched.length === 0 && (business.name.toLowerCase().includes('elenga') || business.id === 'bh-1')) {
      return allProducts;
    }
    return matched.length > 0 ? matched : allProducts;
  }, [allProducts, business]);

  const unitCustomers = useMemo(() => {
    const matched = allCustomers.filter((c) => isTargetBusiness(c.businessId));
    if (matched.length === 0 && (business.name.toLowerCase().includes('elenga') || business.id === 'bh-1')) {
      return allCustomers;
    }
    return matched.length > 0 ? matched : allCustomers;
  }, [allCustomers, business]);

  // Date filtering logic
  const todayStr = getTodayIso();
  const yesterdayStr = getYesterdayIso();
  const last7DaysStr = getDaysAgoIso(7);
  const currentMonthPrefix = todayStr.substring(0, 7);

  const dateFilteredRecords = useMemo(() => {
    if (dateFilter === 'All Records') return unitSalesRecords;
    if (dateFilter === 'Today') {
      return unitSalesRecords.filter((r) => r.date === todayStr);
    }
    if (dateFilter === 'Yesterday') {
      return unitSalesRecords.filter((r) => r.date === yesterdayStr);
    }
    if (dateFilter === 'Last 7 Days') {
      return unitSalesRecords.filter((r) => !r.date || r.date >= last7DaysStr);
    }
    if (dateFilter === 'This Month') {
      return unitSalesRecords.filter((r) => !r.date || r.date.startsWith(currentMonthPrefix));
    }
    return unitSalesRecords;
  }, [unitSalesRecords, dateFilter, todayStr, yesterdayStr, last7DaysStr, currentMonthPrefix]);

  // Search & Status filtering
  const filteredRecords = useMemo(() => {
    return dateFilteredRecords.filter((r) => {
      const matchesSearch =
        r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.customerOf.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.address.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStatus = true;
      if (statusFilter === 'has_due') matchesStatus = r.runningDue > 0;
      if (statusFilter === 'Full Paid') matchesStatus = r.runningDue === 0;
      if (statusFilter === 'Overdue') {
        matchesStatus = r.runningDue > 0 && !!r.duePaymentDate && r.duePaymentDate < todayStr;
      }

      return matchesSearch && matchesStatus;
    });
  }, [dateFilteredRecords, searchTerm, statusFilter, todayStr]);

  // Real-time KPI calculations
  const totalSalesAmount = dateFilteredRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalPaidAmount = dateFilteredRecords.reduce((sum, r) => sum + (r.paid || 0), 0);
  const totalRunningDue = dateFilteredRecords.reduce((sum, r) => sum + (r.runningDue || 0), 0);
  const totalSacrifice = dateFilteredRecords.reduce((sum, r) => sum + (r.sacrifice || 0), 0);
  const overdueCount = dateFilteredRecords.filter(
    (r) => r.runningDue > 0 && !!r.duePaymentDate && r.duePaymentDate < todayStr
  ).length;

  const collectionRatio = totalSalesAmount > 0 ? ((totalPaidAmount / totalSalesAmount) * 100).toFixed(1) : '100.0';

  // Format currency
  const formatBDT = (amount: number) => {
    return `৳ ${amount.toLocaleString('en-IN')}`;
  };

  // Handlers for Add, Delete, Payment
  const handleAddRecord = async (newRecordData: Omit<SaleDueRecord, 'id' | 'invoiceNo'>) => {
    const nextInvoiceNumber = `INV-${(business.name.split(' ')[0] || 'SAM').toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const newRecord: SaleDueRecord = {
      id: `sd-${Date.now()}`,
      invoiceNo: nextInvoiceNumber,
      ...newRecordData,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newRecord, ...allSalesRecords];
    setAllSalesRecords(updated);
    try {
      localStorage.setItem('samura_sales_due_records_v2', JSON.stringify(updated));
      await saveSaleRecordToFirestore(newRecord);
    } catch (e) {
      console.error(e);
    }
    showToast(`Invoice #${newRecord.invoiceNo} successfully created!`);
  };

  const handleDeleteRecord = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sales/due record?')) return;
    const updated = allSalesRecords.filter((r) => r.id !== id);
    setAllSalesRecords(updated);
    try {
      localStorage.setItem('samura_sales_due_records_v2', JSON.stringify(updated));
      await deleteSaleRecordFromFirestore(id);
    } catch (e) {
      console.error(e);
    }
    showToast('Record deleted successfully.');
  };

  const handleConfirmPayment = async (params: {
    recordId?: string;
    customerId?: string;
    customerName: string;
    amount: number;
    paymentMethod: string;
    paymentDate: string;
    note?: string;
  }) => {
    if (params.recordId) {
      const target = allSalesRecords.find((r) => r.id === params.recordId);
      if (target) {
        const newPaid = target.paid + params.amount;
        const newRunningDue = Math.max(0, target.payableDue - newPaid);
        const newStatus = newRunningDue === 0 ? 'Full Paid' : 'Partial Due';

        const updatedRecords = allSalesRecords.map((r) =>
          r.id === params.recordId
            ? {
                ...r,
                paid: newPaid,
                runningDue: newRunningDue,
                status: newStatus as any,
                notes: `${r.notes || ''} [Payment: ${formatBDT(params.amount)} via ${params.paymentMethod} on ${params.paymentDate}]`.trim()
              }
            : r
        );
        setAllSalesRecords(updatedRecords);
        try {
          localStorage.setItem('samura_sales_due_records_v2', JSON.stringify(updatedRecords));
          await updateSalePaymentInFirestore(params.recordId, {
            paid: newPaid,
            runningDue: newRunningDue,
            status: newStatus as any
          });
        } catch (e) {
          console.error(e);
        }
      }
    }

    if (params.customerId) {
      const updatedCust = allCustomers.map((c) =>
        c.id === params.customerId
          ? {
              ...c,
              dueAmount: Math.max(0, c.dueAmount - params.amount),
              totalPaid: (c.totalPaid || 0) + params.amount,
              lastTransactionDate: params.paymentDate
            }
          : c
      );
      setAllCustomers(updatedCust);
      try {
        localStorage.setItem('samura_manager_customers_v2', JSON.stringify(updatedCust));
        await updateCustomerDueInFirestore(
          params.customerId,
          Math.max(0, (allCustomers.find((c) => c.id === params.customerId)?.dueAmount || 0) - params.amount),
          0,
          params.amount,
          params.paymentDate
        );
      } catch (e) {
        console.error(e);
      }
    }

    setSelectedPayDueRecord(null);
    showToast(`Payment of ${formatBDT(params.amount)} recorded successfully!`);
  };

  const handlePrintLedger = () => {
    printSalesDueLedger(filteredRecords, business.name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 font-['Inter',sans-serif]">
      <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl border border-[#E5EAE8] flex flex-col max-h-[94vh] overflow-hidden">
        {/* Toast */}
        {toastMessage && (
          <div className="absolute top-4 right-4 z-50 bg-[#073F37] text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#22A06B] flex items-center gap-2 text-xs animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-[#22A06B] shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* 1. Header Banner */}
        <div className="bg-gradient-to-r from-[#0E5A4F] via-[#0B4B42] to-[#073F37] p-4 sm:p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl border border-white/20 text-white shrink-0">
              <Building2 className="w-6 h-6 text-[#22A06B]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">{business.name}</h2>
                {(() => {
                  const growthInfo = getBusinessGrowthData(business);
                  return (
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-black tracking-wide flex items-center gap-1.5 border shadow-2xs ${
                        growthInfo.isPositive
                          ? 'bg-[#DCFCE7] text-[#15803D] border-[#15803D]/40'
                          : 'bg-[#FEE2E2] text-[#B91C1C] border-[#B91C1C]/40'
                      }`}
                    >
                      {growthInfo.isPositive ? (
                        <TrendingUp className="w-3.5 h-3.5 text-[#15803D] shrink-0 stroke-[2.5]" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-[#B91C1C] shrink-0 stroke-[2.5]" />
                      )}
                      <span>{growthInfo.badgeText}</span>
                    </span>
                  );
                })()}
                <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded-md text-[#A3B8B0]">
                  ID: {business.id}
                </span>
              </div>
              <p className="text-xs text-[#A3B8B0] mt-0.5 flex items-center gap-2 flex-wrap">
                <span>In-Charge: <strong className="text-white font-medium">{assignedManager ? assignedManager.name : business.manager || 'Assigned Officer'}</strong></span>
                {assignedManager && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#22A06B]" />
                      {assignedManager.phone}
                    </span>
                  </>
                )}
                <span>·</span>
                <span className="text-[#22A06B] font-semibold flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Live Manager Sync
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
            <button
              type="button"
              onClick={handlePrintLedger}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Ledger</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddSaleModalOpen(true)}
              className="px-3 py-1.5 bg-[#22A06B] hover:bg-[#1B8356] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Sale Voucher</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Top Summary KPI Cards & Global Date Filter */}
        <div className="p-4 bg-[#F8FAF9] border-b border-[#E5EAE8] space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#18211F] uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#0E5A4F]" />
                <span>Live Financial Metrics ({dateFilter}):</span>
              </span>
            </div>

            {/* Date Preset Filter */}
            <div className="flex items-center gap-1 bg-[#E5EAE8] p-1 rounded-xl">
              {(['Today', 'Yesterday', 'Last 7 Days', 'This Month', 'All Records'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setDateFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    dateFilter === filter
                      ? 'bg-white text-[#0E5A4F] shadow-xs'
                      : 'text-[#71807B] hover:text-[#18211F]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            <div className="bg-white p-3 rounded-xl border border-[#E5EAE8] shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#71807B]">Total Sales</span>
                <DollarSign className="w-3.5 h-3.5 text-[#0E5A4F]" />
              </div>
              <p className="text-sm sm:text-base font-black text-[#18211F] mt-1">
                {formatBDT(totalSalesAmount)}
              </p>
              <span className="text-[10px] text-[#71807B]">{dateFilteredRecords.length} invoices generated</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#E5EAE8] shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#71807B]">Cash Collection</span>
                <Wallet className="w-3.5 h-3.5 text-[#22A06B]" />
              </div>
              <p className="text-sm sm:text-base font-black text-[#22A06B] mt-1">
                {formatBDT(totalPaidAmount)}
              </p>
              <span className="text-[10px] text-[#22A06B] font-semibold">{collectionRatio}% collected</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#E5EAE8] shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#71807B]">Running Due</span>
                <CreditCard className="w-3.5 h-3.5 text-[#D9534F]" />
              </div>
              <p className="text-sm sm:text-base font-black text-[#D9534F] mt-1">
                {formatBDT(totalRunningDue)}
              </p>
              <span className="text-[10px] text-[#71807B]">Outstanding balance</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#E5EAE8] shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#71807B]">Discounts / ছাড়</span>
                <BadgePercent className="w-3.5 h-3.5 text-[#D9A441]" />
              </div>
              <p className="text-sm sm:text-base font-black text-[#18211F] mt-1">
                {formatBDT(totalSacrifice)}
              </p>
              <span className="text-[10px] text-[#71807B]">Special party rebate</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#E5EAE8] shadow-2xs col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#71807B]">Overdue Invoices</span>
                <AlertTriangle className="w-3.5 h-3.5 text-[#D9534F]" />
              </div>
              <p className="text-sm sm:text-base font-black text-[#18211F] mt-1">
                {overdueCount} <span className="text-xs font-normal text-[#71807B]">Alerts</span>
              </p>
              <span className="text-[10px] text-[#D9534F] font-semibold">Requires follow-up</span>
            </div>
          </div>
        </div>

        {/* 3. Sub-Navigation Tabs */}
        <div className="bg-[#F1F6F4] px-4 pt-2 border-b border-[#E5EAE8] flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('sales_due')}
            className={`pb-2.5 px-3 font-bold text-xs flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sales_due'
                ? 'border-[#0E5A4F] text-[#0E5A4F]'
                : 'border-transparent text-[#71807B] hover:text-[#18211F]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#22A06B]" />
            <span>Sales & Due Ledger ({dateFilteredRecords.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`pb-2.5 px-3 font-bold text-xs flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-[#0E5A4F] text-[#0E5A4F]'
                : 'border-transparent text-[#71807B] hover:text-[#18211F]'
            }`}
          >
            <Package className="w-4 h-4 text-[#22A06B]" />
            <span>Products & Stock ({unitProducts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('customers')}
            className={`pb-2.5 px-3 font-bold text-xs flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'customers'
                ? 'border-[#0E5A4F] text-[#0E5A4F]'
                : 'border-transparent text-[#71807B] hover:text-[#18211F]'
            }`}
          >
            <Users className="w-4 h-4 text-[#22A06B]" />
            <span>Customers Directory ({unitCustomers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manager_info')}
            className={`pb-2.5 px-3 font-bold text-xs flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'manager_info'
                ? 'border-[#0E5A4F] text-[#0E5A4F]'
                : 'border-transparent text-[#71807B] hover:text-[#18211F]'
            }`}
          >
            <UserCheck className="w-4 h-4 text-[#22A06B]" />
            <span>Manager & Unit Info</span>
          </button>
        </div>

        {/* 4. Tab Contents (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-white">
          {/* TAB 1: SALES & DUE LEDGER */}
          {activeTab === 'sales_due' && (
            <div className="space-y-3.5">
              {/* Filter Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#F8FAF9] p-3 rounded-xl border border-[#E5EAE8]">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-[#71807B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search invoices, customer name, arat market, product or phone..."
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#E5EAE8] rounded-lg text-xs text-[#18211F] placeholder-[#71807B] focus:border-[#0E5A4F] focus:outline-none"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71807B] hover:text-[#18211F]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="flex items-center gap-1 bg-white border border-[#E5EAE8] p-1 rounded-lg">
                    {(['all', 'has_due', 'Full Paid', 'Overdue'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatusFilter(st)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                          statusFilter === st
                            ? 'bg-[#0E5A4F] text-white'
                            : 'text-[#71807B] hover:text-[#18211F]'
                        }`}
                      >
                        {st === 'all' ? 'All Status' : st === 'has_due' ? 'With Due' : st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Invoices Table */}
              {filteredRecords.length === 0 ? (
                <div className="py-12 text-center bg-[#F8FAF9] rounded-xl border border-[#E5EAE8]">
                  <FileText className="w-10 h-10 text-[#A3B8B0] mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-[#18211F]">No sales & due records found</h4>
                  <p className="text-xs text-[#71807B] mt-0.5">
                    No transactions match the selected filter ({dateFilter} / {statusFilter}).
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAddSaleModalOpen(true)}
                    className="mt-3 px-3.5 py-1.5 bg-[#0E5A4F] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create First Voucher for {business.name}</span>
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto border border-[#E5EAE8] rounded-xl shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#F6F8F7] text-[#71807B] border-b border-[#E5EAE8] text-[11px] font-bold uppercase">
                        <th className="py-2.5 px-3">Invoice & Date</th>
                        <th className="py-2.5 px-3">Customer / Party</th>
                        <th className="py-2.5 px-3">Product & Qty</th>
                        <th className="py-2.5 px-3 text-right">Amount (৳)</th>
                        <th className="py-2.5 px-3 text-right">Paid (৳)</th>
                        <th className="py-2.5 px-3 text-right">Running Due (৳)</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                        <th className="py-2.5 px-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5EAE8]">
                      {filteredRecords.map((record) => {
                        const isOverdue =
                          record.runningDue > 0 &&
                          record.duePaymentDate &&
                          record.duePaymentDate < todayStr;

                        return (
                          <tr key={record.id} className="hover:bg-[#F8FAF9] transition-colors">
                            {/* Invoice & Date */}
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-[#0E5A4F] shrink-0" />
                                <span className="font-bold text-[#18211F]">{record.invoiceNo}</span>
                              </div>
                              <span className="text-[10px] text-[#71807B] block mt-0.5">
                                {record.date}
                              </span>
                            </td>

                            {/* Customer */}
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-[#18211F]">{record.customerName}</div>
                              <span className="text-[10px] text-[#71807B] block truncate max-w-[200px]">
                                {record.address}
                              </span>
                              {record.customerOf && (
                                <span className="text-[9px] text-[#0E5A4F] font-semibold bg-[#E6F4ED] px-1.5 py-0.2 rounded inline-block mt-0.5">
                                  {record.customerOf}
                                </span>
                              )}
                            </td>

                            {/* Product & Qty */}
                            <td className="py-2.5 px-3">
                              <div className="font-semibold text-[#18211F]">{record.productName}</div>
                              <span className="text-[10px] text-[#71807B] block">
                                {record.quantity} × ৳{record.unitPrice} ({record.productUnit})
                              </span>
                            </td>

                            {/* Amount */}
                            <td className="py-2.5 px-3 text-right font-bold text-[#18211F]">
                              {formatBDT(record.amount)}
                            </td>

                            {/* Paid */}
                            <td className="py-2.5 px-3 text-right font-bold text-[#22A06B]">
                              {formatBDT(record.paid)}
                              {record.sacrifice > 0 && (
                                <span className="text-[9px] text-[#71807B] block font-normal">
                                  ছাড়: {formatBDT(record.sacrifice)}
                                </span>
                              )}
                            </td>

                            {/* Running Due */}
                            <td className="py-2.5 px-3 text-right">
                              <span
                                className={`font-bold block ${
                                  record.runningDue > 0 ? 'text-[#D9534F]' : 'text-[#71807B]'
                                }`}
                              >
                                {formatBDT(record.runningDue)}
                              </span>
                              {record.runningDue > 0 && record.duePaymentDate && (
                                <span
                                  className={`text-[9px] block ${
                                    isOverdue ? 'text-red-600 font-bold' : 'text-[#71807B]'
                                  }`}
                                >
                                  Next: {record.duePaymentDate}
                                </span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  record.runningDue === 0
                                    ? 'bg-[#DCFCE7] text-[#166534]'
                                    : isOverdue
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-[#FEF9C3] text-[#854D0E]'
                                }`}
                              >
                                {record.runningDue === 0 ? 'Full Paid' : isOverdue ? 'Overdue' : 'Partial Due'}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-2.5 px-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedVoucherRecord(record)}
                                  title="View Official Voucher Memo"
                                  className="p-1.5 hover:bg-[#E6F4ED] text-[#0E5A4F] rounded-md transition-colors cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                {record.runningDue > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedPayDueRecord(record)}
                                    title="Collect Due / Record Payment"
                                    className="px-2 py-1 bg-[#0E5A4F] hover:bg-[#073F37] text-white rounded-md text-[10px] font-bold transition-colors cursor-pointer shadow-2xs"
                                  >
                                    Pay Due
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleDeleteRecord(record.id)}
                                  title="Delete Record"
                                  className="p-1.5 hover:bg-red-50 text-red-500 rounded-md transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTS & STOCK */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#18211F]">Subsidiary Fruit Products & Catalog</h4>
                  <p className="text-xs text-[#71807B]">Stock inventory, arrival dates and price parameters</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="px-3 py-1.5 bg-[#0E5A4F] hover:bg-[#073F37] text-white font-semibold rounded-lg flex items-center gap-1.5 text-xs transition-colors cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Product</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {unitProducts.map((p) => (
                  <div key={p.id} className="p-3.5 rounded-xl border border-[#E5EAE8] bg-[#F8FAF9] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#0E5A4F] bg-[#E6F4ED] px-2 py-0.5 rounded">
                        {p.category}
                      </span>
                      <span className="text-xs font-bold text-[#22A06B]">
                        Stock: {p.stock} {p.unit}
                      </span>
                    </div>
                    <h5 className="font-bold text-sm text-[#18211F]">{p.name}</h5>
                    <div className="pt-2 border-t border-[#E5EAE8] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-[#71807B] block">Unit Price / Rate</span>
                        <span className="font-bold text-[#18211F]">৳{p.unitPrice} / {p.unit}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#71807B] block">Category</span>
                        <span className="font-medium text-[#71807B]">{p.category || 'Produce'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMERS & PARTIES */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#18211F]">Arat & Wholesale Customer Parties</h4>
                  <p className="text-xs text-[#71807B]">Registered parties, addresses and outstanding balances</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddCustomerModalOpen(true)}
                  className="px-3 py-1.5 bg-[#0E5A4F] hover:bg-[#073F37] text-white font-semibold rounded-lg flex items-center gap-1.5 text-xs transition-colors cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Customer</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {unitCustomers.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-xl border border-[#E5EAE8] bg-[#F8FAF9] flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-sm text-[#18211F]">{c.name}</h5>
                      <p className="text-xs text-[#71807B] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#0E5A4F]" />
                        <span>{c.address}</span>
                      </p>
                      <p className="text-xs text-[#71807B] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-[#22A06B]" />
                        <span>{c.phone}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[#71807B] block">Total Due</span>
                      <span className={`text-sm font-bold block ${c.dueAmount > 0 ? 'text-[#D9534F]' : 'text-[#22A06B]'}`}>
                        {formatBDT(c.dueAmount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MANAGER & UNIT INFO */}
          {activeTab === 'manager_info' && (
            <div className="space-y-4">
              <div className="bg-[#F8FAF9] p-4 rounded-xl border border-[#E5EAE8] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#0E5A4F] text-white flex items-center justify-center font-black text-base shadow-xs">
                    {assignedManager ? assignedManager.name.substring(0, 2).toUpperCase() : 'EF'}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#18211F]">
                      {assignedManager ? assignedManager.name : business.manager || 'Assigned Officer'}
                    </h4>
                    <p className="text-xs text-[#71807B]">
                      Unit Manager · Assigned to {business.name}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-[#E5EAE8] text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#71807B] block">Phone / Mobile</span>
                    <span className="font-semibold text-[#18211F]">{assignedManager?.phone || '01712-445566'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#71807B] block">Login Email</span>
                    <span className="font-semibold text-[#18211F]">{assignedManager?.email || 'manager1@al-samura.com'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#71807B] block">National ID / NID</span>
                    <span className="font-semibold text-[#18211F]">{assignedManager?.nid || '19882691234567890'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#71807B] block">Role & Access</span>
                    <span className="font-semibold text-[#22A06B]">Subsidiary Portal Operations</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#71807B] block">Live Status</span>
                    <span className="font-semibold text-[#22A06B] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#22A06B]" />
                      Active & Synchronized
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#71807B] block">Assigned Since</span>
                    <span className="font-semibold text-[#18211F]">2026-01-01</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Modal Footer */}
        <div className="p-4 bg-[#F8FAF9] border-t border-[#E5EAE8] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#71807B]">
            <Shield className="w-4 h-4 text-[#0E5A4F]" />
            <span>AL SAMURA Enterprise Command · Real-time subsidiary ledger inspection</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#0E5A4F] hover:bg-[#073F37] text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>

      {/* Sub Modals */}
      {selectedVoucherRecord && (
        <SaleVoucherModal
          isOpen={!!selectedVoucherRecord}
          onClose={() => setSelectedVoucherRecord(null)}
          record={selectedVoucherRecord}
          businessName={business.name}
        />
      )}

      {selectedPayDueRecord && (
        <PayDueModal
          isOpen={!!selectedPayDueRecord}
          onClose={() => setSelectedPayDueRecord(null)}
          record={selectedPayDueRecord}
          businessName={business.name}
          onConfirmPayment={handleConfirmPayment}
        />
      )}

      {isAddSaleModalOpen && (
        <AddSaleDueModal
          isOpen={isAddSaleModalOpen}
          onClose={() => setIsAddSaleModalOpen(false)}
          businessId={business.id}
          businessName={business.name}
          products={unitProducts}
          customers={unitCustomers}
          onAddRecord={handleAddRecord}
        />
      )}

      {isAddProductModalOpen && (
        <AddProductModal
          isOpen={isAddProductModalOpen}
          onClose={() => setIsAddProductModalOpen(false)}
          businessId={business.id}
          businessName={business.name}
          onAddProduct={async (p) => {
            const newProd: UnitProduct = {
              id: `prd-${Date.now()}`,
              ...p
            };
            const updated = [newProd, ...allProducts];
            setAllProducts(updated);
            try {
              localStorage.setItem('samura_unit_products_v2', JSON.stringify(updated));
              await saveProductToFirestore(newProd);
            } catch (e) {
              console.error(e);
            }
            setIsAddProductModalOpen(false);
            showToast(`Product "${p.name}" added to catalog!`);
          }}
        />
      )}

      {isAddCustomerModalOpen && (
        <AddCustomerModal
          isOpen={isAddCustomerModalOpen}
          onClose={() => setIsAddCustomerModalOpen(false)}
          businessId={business.id}
          businessName={business.name}
          onAddCustomer={async (c) => {
            const newCust: ManagerCustomer = {
              id: `cust-${Date.now()}`,
              ...c,
              totalSales: 0,
              totalPaid: 0,
              lastTransactionDate: new Date().toISOString().split('T')[0]
            };
            const updated = [newCust, ...allCustomers];
            setAllCustomers(updated);
            try {
              localStorage.setItem('samura_manager_customers_v2', JSON.stringify(updated));
              await saveCustomerToFirestore(newCust);
            } catch (e) {
              console.error(e);
            }
            setIsAddCustomerModalOpen(false);
            showToast(`Customer "${c.name}" registered!`);
          }}
        />
      )}
    </div>
  );
};
