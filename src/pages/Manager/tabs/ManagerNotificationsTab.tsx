import React, { useState, useMemo } from 'react';
import {
  BusinessHealthItem,
  SaleDueRecord,
  UnitProduct,
  ManagerCustomer,
  PendingApproval
} from '../../../types';
import {
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  AlertCircle,
  FileText,
  CreditCard,
  DollarSign,
  Phone,
  Package,
  Search,
  Filter,
  CheckCheck,
  ShieldCheck,
  Building2,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Sparkles,
  Trash2
} from 'lucide-react';

interface ManagerNotificationsTabProps {
  business: BusinessHealthItem;
  records: SaleDueRecord[];
  products: UnitProduct[];
  customers: ManagerCustomer[];
  approvals: PendingApproval[];
  onOpenPayModal?: (record: SaleDueRecord) => void;
  onOpenPayCustomerModal?: (customer: ManagerCustomer) => void;
  onViewVoucher?: (record: SaleDueRecord) => void;
  onNavigateToProducts?: () => void;
  onNavigateToSalesDue?: () => void;
  onClearAllNotifications?: () => void;
  onDeleteApprovalNotification?: (approvalId: string) => void;
}

export const ManagerNotificationsTab: React.FC<ManagerNotificationsTabProps> = ({
  business,
  records,
  products,
  customers,
  approvals,
  onOpenPayModal,
  onOpenPayCustomerModal,
  onViewVoucher,
  onNavigateToProducts,
  onNavigateToSalesDue,
  onClearAllNotifications,
  onDeleteApprovalNotification
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'admin_approvals' | 'overdue_payments' | 'operational_alerts'
  >('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'approved' | 'rejected' | 'pending'>('all');
  const [dismissedNotificationIds, setDismissedNotificationIds] = useState<Set<string>>(new Set());

  const todayStr = new Date().toISOString().split('T')[0];

  // Dismiss single notification
  const handleDismissNotification = (id: string, isApproval: boolean = false) => {
    setDismissedNotificationIds((prev) => new Set(prev).add(id));
    if (isApproval && onDeleteApprovalNotification) {
      onDeleteApprovalNotification(id);
    }
  };

  // Clear all notifications
  const handleClearAll = () => {
    if (onClearAllNotifications) {
      onClearAllNotifications();
    }
    // Also dismiss all currently visible items locally
    const allIds = new Set<string>();
    unitApprovals.forEach((a) => allIds.add(a.id));
    overdueRecords.forEach((r) => allIds.add(r.id));
    lowStockProducts.forEach((p) => allIds.add(p.id));
    setDismissedNotificationIds(allIds);
  };

  // 1. Category 1: Admin Approvals relevant to this unit
  const unitApprovals = useMemo(() => {
    return approvals.filter((a) => {
      if (dismissedNotificationIds.has(a.id)) return false;
      if (!a.business) return true;
      const bName = a.business.toLowerCase();
      const currName = business.name.toLowerCase();
      return bName.includes(currName) || currName.includes(bName) || a.department === 'Unit Manager';
    });
  }, [approvals, business.name, dismissedNotificationIds]);

  // 2. Category 2: Overdue Sales & Dues
  const overdueRecords = useMemo(() => {
    return records.filter((r) => {
      if (dismissedNotificationIds.has(r.id)) return false;
      if (r.runningDue <= 0) return false;
      const isPastDue = r.duePaymentDate && r.duePaymentDate < todayStr;
      const isUnpaidOrOverdue = r.status === 'Overdue' || r.status === 'Unpaid' || isPastDue;
      return isUnpaidOrOverdue;
    });
  }, [records, todayStr, dismissedNotificationIds]);

  // Overdue Customers
  const overdueCustomers = useMemo(() => {
    return customers.filter((c) => c.dueAmount > 0);
  }, [customers]);

  // 3. Category 3: Low Stock & Operational Alerts
  const lowStockProducts = useMemo(() => {
    return products.filter((p) => {
      if (dismissedNotificationIds.has(p.id)) return false;
      return p.stock !== undefined && p.stock <= 15;
    });
  }, [products, dismissedNotificationIds]);

  // Metrics
  const approvedCount = unitApprovals.filter((a) => a.status === 'approved').length;
  const rejectedCount = unitApprovals.filter((a) => a.status === 'rejected').length;
  const pendingApprovalsCount = unitApprovals.filter((a) => a.status === 'pending').length;
  const overdueCount = overdueRecords.length;
  const totalOverdueAmount = overdueRecords.reduce((acc, r) => acc + r.runningDue, 0);
  const lowStockCount = lowStockProducts.length;

  const totalNotificationsCount = unitApprovals.length + overdueRecords.length + lowStockProducts.length;

  // Filtered Lists
  const filteredApprovals = useMemo(() => {
    return unitApprovals.filter((a) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        a.title.toLowerCase().includes(term) ||
        a.description.toLowerCase().includes(term) ||
        (a.amount && a.amount.toLowerCase().includes(term));

      let matchesStatus = true;
      if (statusFilter === 'approved') matchesStatus = a.status === 'approved';
      if (statusFilter === 'rejected') matchesStatus = a.status === 'rejected';
      if (statusFilter === 'pending') matchesStatus = a.status === 'pending';

      return matchesSearch && matchesStatus;
    });
  }, [unitApprovals, searchTerm, statusFilter]);

  const filteredOverdues = useMemo(() => {
    return overdueRecords.filter((r) => {
      const term = searchTerm.toLowerCase();
      return (
        r.customerName.toLowerCase().includes(term) ||
        r.customerOf.toLowerCase().includes(term) ||
        r.invoiceNo.toLowerCase().includes(term) ||
        r.productName.toLowerCase().includes(term)
      );
    });
  }, [overdueRecords, searchTerm]);

  const filteredLowStock = useMemo(() => {
    return lowStockProducts.filter((p) => {
      const term = searchTerm.toLowerCase();
      return p.name.toLowerCase().includes(term) || (p.category && p.category.toLowerCase().includes(term));
    });
  }, [lowStockProducts, searchTerm]);

  return (
    <div className="space-y-5">
      {/* Top Banner & Summary Cards */}
      <div className="bg-white p-5 rounded-xl border border-[#E5EAE8] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5EAE8] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#E6F4ED] text-[#0E5A4F]">
                <Bell className="w-5 h-5 text-[#0E5A4F]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#18211F] tracking-tight">
                  Unit Notifications & Admin Decisions
                </h2>
                <p className="text-xs text-[#71807B]">
                  Live updates for <strong className="text-[#18211F]">{business.name}</strong> • Category-wise tracking
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs text-[#71807B] font-medium">Total Alerts:</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-[#0E5A4F] text-white">
              {totalNotificationsCount} Notifications
            </span>

            {totalNotificationsCount > 0 && (
              <button
                type="button"
                id="gm-clear-all-notifications-btn"
                onClick={handleClearAll}
                className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ml-2"
                title="Clear and delete all notifications for GM"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span>Clear All Notifications</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Stat 1: Admin Approvals */}
          <button
            type="button"
            onClick={() => setSelectedCategory('admin_approvals')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedCategory === 'admin_approvals'
                ? 'bg-[#E6F4ED] border-[#22A06B] shadow-xs'
                : 'bg-[#F6F8F7] border-[#E5EAE8] hover:border-[#22A06B]/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#71807B]">
                Admin Approvals
              </span>
              <ShieldCheck className="w-4 h-4 text-[#0E5A4F]" />
            </div>
            <div className="text-xl font-bold text-[#18211F] mt-1">
              {unitApprovals.length}{' '}
              <span className="text-xs font-normal text-[#71807B]">Decisions</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-[10px] font-semibold">
              <span className="text-[#22A06B] flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> {approvedCount} Approved
              </span>
              <span className="text-red-600 flex items-center gap-0.5">
                <XCircle className="w-3 h-3" /> {rejectedCount} Rejected
              </span>
              {pendingApprovalsCount > 0 && (
                <span className="text-amber-600 flex items-center gap-0.5">
                  <Clock className="w-3 h-3" /> {pendingApprovalsCount} Pending
                </span>
              )}
            </div>
          </button>

          {/* Stat 2: Overdue Payments */}
          <button
            type="button"
            onClick={() => setSelectedCategory('overdue_payments')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedCategory === 'overdue_payments'
                ? 'bg-red-50 border-red-300 shadow-xs'
                : 'bg-[#F6F8F7] border-[#E5EAE8] hover:border-red-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">
                Overdue Payments
              </span>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-xl font-bold text-red-700 mt-1">
              {overdueCount}{' '}
              <span className="text-xs font-normal text-red-600">Pending Dues</span>
            </div>
            <div className="text-[10px] text-red-600 font-mono font-semibold mt-1.5 truncate">
              Total Overdue: ৳ {totalOverdueAmount.toLocaleString()}
            </div>
          </button>

          {/* Stat 3: Stock & Operational Alerts */}
          <button
            type="button"
            onClick={() => setSelectedCategory('operational_alerts')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedCategory === 'operational_alerts'
                ? 'bg-amber-50 border-amber-300 shadow-xs'
                : 'bg-[#F6F8F7] border-[#E5EAE8] hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Low Stock & Inventory
              </span>
              <Package className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl font-bold text-amber-900 mt-1">
              {lowStockCount}{' '}
              <span className="text-xs font-normal text-amber-700">Low Stock Items</span>
            </div>
            <div className="text-[10px] text-amber-700 font-medium mt-1.5">
              Items under 15 units threshold
            </div>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-[#E5EAE8] shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#0E5A4F] text-white shadow-xs'
                  : 'bg-[#F6F8F7] text-[#71807B] hover:text-[#18211F] hover:bg-[#E5EAE8]'
              }`}
            >
              All Notifications ({totalNotificationsCount})
            </button>
            <button
              onClick={() => setSelectedCategory('admin_approvals')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedCategory === 'admin_approvals'
                  ? 'bg-[#0E5A4F] text-white shadow-xs'
                  : 'bg-[#F6F8F7] text-[#71807B] hover:text-[#18211F] hover:bg-[#E5EAE8]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Approvals ({unitApprovals.length})</span>
            </button>
            <button
              onClick={() => setSelectedCategory('overdue_payments')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedCategory === 'overdue_payments'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-[#F6F8F7] text-[#71807B] hover:text-red-700 hover:bg-red-50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              <span>Overdue Payments ({overdueCount})</span>
            </button>
            <button
              onClick={() => setSelectedCategory('operational_alerts')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedCategory === 'operational_alerts'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-[#F6F8F7] text-[#71807B] hover:text-amber-800 hover:bg-amber-50'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-amber-600" />
              <span>Low Stock ({lowStockCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-[#71807B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#F6F8F7] border border-[#E5EAE8] rounded-lg text-xs text-[#18211F] placeholder:text-[#71807B] focus:outline-none focus:border-[#22A06B]"
            />
          </div>
        </div>

        {/* Sub-status filter for Admin Approvals if category selected */}
        {selectedCategory === 'admin_approvals' && (
          <div className="flex items-center gap-2 pt-2 border-t border-[#E5EAE8] text-xs">
            <span className="text-[#71807B] text-[11px] font-medium">Filter Status:</span>
            {(['all', 'approved', 'rejected', 'pending'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#0E5A4F] text-white'
                    : 'bg-[#F6F8F7] text-[#71807B] hover:text-[#18211F]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main List Sections */}

      {/* SECTION 1: ADMIN APPROVALS & DECISIONS */}
      {(selectedCategory === 'all' || selectedCategory === 'admin_approvals') && (
        <div className="bg-white rounded-xl border border-[#E5EAE8] shadow-2xs overflow-hidden">
          <div className="p-4 bg-[#F6F8F7] border-b border-[#E5EAE8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0E5A4F]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#18211F]">
                Category 1: Admin Approvals & HQ Decisions
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#71807B]">
              {filteredApprovals.length} Record(s)
            </span>
          </div>

          {filteredApprovals.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <CheckCheck className="w-8 h-8 text-[#22A06B] mx-auto opacity-70" />
              <p className="text-xs font-semibold text-[#18211F]">No Admin approval notifications found</p>
              <p className="text-[11px] text-[#71807B]">
                All requests submitted to HQ will appear here once reviewed or updated.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E5EAE8]">
              {filteredApprovals.map((app) => {
                const isApproved = app.status === 'approved';
                const isRejected = app.status === 'rejected';

                return (
                  <div
                    key={app.id}
                    className="p-4 hover:bg-[#F6F8F7]/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Status Badge */}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F4ED] text-[#22A06B] border border-[#22A06B]/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>APPROVED BY ADMIN</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                            <XCircle className="w-3 h-3 text-red-600" />
                            <span>REJECTED BY ADMIN</span>
                          </span>
                        )}
                        {!isApproved && !isRejected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>PENDING HQ REVIEW</span>
                          </span>
                        )}

                        <span className="text-xs font-bold text-[#18211F]">{app.title}</span>
                      </div>

                      <p className="text-xs text-[#71807B] leading-relaxed">
                        {app.description}
                      </p>

                      <div className="flex items-center gap-3 text-[10px] text-[#71807B] flex-wrap pt-0.5">
                        <span>Requester: <strong className="text-[#18211F]">{app.requester}</strong></span>
                        <span>•</span>
                        <span>Department: {app.department}</span>
                        <span>•</span>
                        <span className="font-mono">{app.age}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-[#E5EAE8] pt-2 sm:pt-0 shrink-0">
                      {app.amount && (
                        <div className="text-sm font-bold font-mono text-[#18211F]">
                          {app.amount}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {onNavigateToSalesDue && (
                          <button
                            type="button"
                            onClick={onNavigateToSalesDue}
                            className="px-2.5 py-1 bg-[#E6F4ED] hover:bg-[#0E5A4F] text-[#0E5A4F] hover:text-white rounded-md text-[11px] font-semibold transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>View Sales & Dues</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDismissNotification(app.id, true)}
                          className="p-1 text-[#71807B] hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Delete / Clear this notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: OVERDUE PAYMENTS & RECEIVABLES ALERTS */}
      {(selectedCategory === 'all' || selectedCategory === 'overdue_payments') && (
        <div className="bg-white rounded-xl border border-red-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-red-50/70 border-b border-red-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-900">
                Category 2: Overdue Payments & Customer Collection Dues
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
              {filteredOverdues.length} Overdue Voucher(s)
            </span>
          </div>

          {filteredOverdues.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#22A06B] mx-auto opacity-80" />
              <p className="text-xs font-semibold text-[#18211F]">No overdue payment alerts</p>
              <p className="text-[11px] text-[#71807B]">
                All customer dues are within agreed terms or fully collected!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E5EAE8]">
              {filteredOverdues.map((rec) => {
                const isSeverelyOverdue = rec.duePaymentDate && rec.duePaymentDate < todayStr;

                return (
                  <div
                    key={rec.id}
                    className="p-4 hover:bg-red-50/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold font-mono uppercase border ${
                            isSeverelyOverdue
                              ? 'bg-red-600 text-white border-red-700'
                              : 'bg-amber-100 text-amber-900 border-amber-300'
                          }`}
                        >
                          {isSeverelyOverdue ? 'CRITICAL OVERDUE' : 'PAYMENT DUE'}
                        </span>

                        <span className="text-xs font-bold text-[#18211F]">
                          {rec.customerName}
                        </span>

                        {rec.customerOf && (
                          <span className="text-[10px] text-[#71807B] bg-[#F6F8F7] px-2 py-0.5 rounded border border-[#E5EAE8]">
                            Ref: {rec.customerOf}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[#71807B] flex items-center gap-3 flex-wrap">
                        <span>Invoice: <strong className="font-mono text-[#18211F]">{rec.invoiceNo}</strong></span>
                        <span>•</span>
                        <span>Product: {rec.productName} ({rec.quantity} {rec.productUnit})</span>
                        {rec.duePaymentDate && (
                          <>
                            <span>•</span>
                            <span className="text-red-600 font-medium">
                              Due Date: {rec.duePaymentDate}
                            </span>
                          </>
                        )}
                      </div>

                      {rec.address && (
                        <p className="text-[11px] text-[#71807B] truncate">
                          Address: {rec.address}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-[#E5EAE8] pt-2 md:pt-0">
                      <div className="text-right">
                        <span className="block text-[10px] text-[#71807B] uppercase font-bold">
                          Running Due
                        </span>
                        <span className="text-base font-extrabold text-red-600 font-mono">
                          ৳ {rec.runningDue.toLocaleString()}
                        </span>
                        <span className="block text-[10px] text-[#71807B]">
                          Paid: ৳ {rec.paid.toLocaleString()} / ৳ {rec.amount.toLocaleString()}
                        </span>
                      </div>

                      {/* Action CTA Buttons */}
                      <div className="flex items-center gap-1.5">
                        {onOpenPayModal && (
                          <button
                            type="button"
                            onClick={() => onOpenPayModal(rec)}
                            className="px-3 py-1.5 bg-[#0E5A4F] hover:bg-[#073F37] text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay Due</span>
                          </button>
                        )}

                        {onViewVoucher && (
                          <button
                            type="button"
                            onClick={() => onViewVoucher(rec)}
                            className="p-1.5 bg-[#F6F8F7] hover:bg-[#E5EAE8] text-[#18211F] rounded-lg transition-colors cursor-pointer"
                            title="View Voucher"
                          >
                            <FileText className="w-4 h-4 text-[#0E5A4F]" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDismissNotification(rec.id, false)}
                          className="p-1 text-[#71807B] hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Dismiss / Clear notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: LOW STOCK & INVENTORY ALERTS */}
      {(selectedCategory === 'all' || selectedCategory === 'operational_alerts') && (
        <div className="bg-white rounded-xl border border-amber-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-amber-50/70 border-b border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Category 3: Inventory & Low Stock Alerts
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
              {filteredLowStock.length} Low Stock Item(s)
            </span>
          </div>

          {filteredLowStock.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#22A06B] mx-auto opacity-80" />
              <p className="text-xs font-semibold text-[#18211F]">All inventory levels are healthy</p>
              <p className="text-[11px] text-[#71807B]">
                No products are currently under the low-stock alert threshold.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E5EAE8]">
              {filteredLowStock.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 hover:bg-amber-50/20 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#18211F]">{prod.name}</span>
                      {prod.category && (
                        <span className="text-[10px] bg-[#F6F8F7] text-[#71807B] px-2 py-0.5 rounded border border-[#E5EAE8]">
                          {prod.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#71807B]">
                      Unit Rate: <strong className="font-mono text-[#18211F]">৳ {prod.unitPrice} / {prod.unit}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="block text-[10px] text-amber-800 uppercase font-bold">
                        Current Stock
                      </span>
                      <span className="text-sm font-extrabold text-amber-900 font-mono">
                        {prod.stock || 0} {prod.unit}s
                      </span>
                    </div>

                    {onNavigateToProducts && (
                      <button
                        type="button"
                        onClick={onNavigateToProducts}
                        className="px-2.5 py-1 bg-[#F6F8F7] hover:bg-[#E5EAE8] text-[#0E5A4F] rounded-md text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Manage Stock
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDismissNotification(prod.id, false)}
                      className="p-1 text-[#71807B] hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="Dismiss / Clear notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
