import React from 'react';
import { SaleDueRecord, UnitProduct, BusinessHealthItem } from '../../../types';
import {
  TrendingUp,
  CreditCard,
  Coins,
  CheckCircle2,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  DollarSign,
  Plus,
  PlusCircle,
  FileText,
  Calendar,
  Layers,
  BadgePercent
} from 'lucide-react';

interface ManagerOverviewTabProps {
  business: BusinessHealthItem;
  records: SaleDueRecord[];
  products: UnitProduct[];
  onOpenAddSaleModal: () => void;
  onOpenAddProductModal: () => void;
  onNavigateToSalesDue: () => void;
  onNavigateToProducts: () => void;
  onNavigateToCustomers?: () => void;
}

export const ManagerOverviewTab: React.FC<ManagerOverviewTabProps> = ({
  business,
  records,
  products,
  onOpenAddSaleModal,
  onOpenAddProductModal,
  onNavigateToSalesDue,
  onNavigateToProducts,
  onNavigateToCustomers
}) => {
  // Aggregate Calculations
  const totalSalesAmount = records.reduce((acc, curr) => acc + curr.amount, 0);
  const totalCollections = records.reduce((acc, curr) => acc + curr.paid, 0);
  const totalRunningDue = records.reduce((acc, curr) => acc + curr.runningDue, 0);
  const totalSacrifice = records.reduce((acc, curr) => acc + curr.sacrifice, 0);
  const totalExDue = records.reduce((acc, curr) => acc + curr.exDue, 0);
  const totalPayableDue = records.reduce((acc, curr) => acc + curr.payableDue, 0);

  // Collection efficiency
  const grossPayable = totalExDue + totalSalesAmount - totalSacrifice;
  const collectionRatio = grossPayable > 0 ? ((totalCollections / grossPayable) * 100).toFixed(1) : '100.0';

  // Overdue count
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueRecords = records.filter(
    (r) => r.runningDue > 0 && r.duePaymentDate && r.duePaymentDate < todayStr
  );
  const overdueAmount = overdueRecords.reduce((acc, curr) => acc + curr.runningDue, 0);

  // Recent 5 entries
  const recentRecords = [...records].reverse().slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in font-['Inter',sans-serif]">
      {/* Top Banner / Welcome Summary */}
      <div className="bg-[#073F37] rounded-2xl p-5 sm:p-6 text-white border border-[#0E5A4F] relative overflow-hidden shadow-lg">
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#0E5A4F] rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0E5A4F] border border-[#22A06B]/30 text-xs font-semibold text-[#22A06B] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#22A06B] animate-pulse" />
              <span>{business.name} · Unit Command Dashboard</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Unit Overview & Financial Summary</h1>
            <p className="text-xs sm:text-sm text-[#A3B8B0] mt-1 max-w-2xl">
              Real-time balance sheet for daily sales, cash collections, customer dues, and inventory.
            </p>
          </div>

          {/* Quick Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="overview-add-sale-btn"
              onClick={onOpenAddSaleModal}
              className="px-4 py-2.5 rounded-xl bg-[#22A06B] hover:bg-[#1C885A] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Sale & Due</span>
            </button>
            <button
              id="overview-add-product-btn"
              onClick={onOpenAddProductModal}
              className="px-4 py-2.5 rounded-xl bg-[#0E5A4F] hover:bg-[#135E54] text-white text-xs font-bold border border-[#22A06B]/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Package className="w-4 h-4" />
              <span>New Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Key Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E5EAE8] shadow-xs hover:border-[#0E5A4F] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#71807B] uppercase tracking-wider">Total Sales</span>
            <div className="w-8 h-8 rounded-lg bg-[#E6F4ED] text-[#0E5A4F] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#18211F] font-mono">
              ৳ {totalSalesAmount.toLocaleString()}
            </h3>
            <span className="text-xs text-[#22A06B] font-semibold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{records.length} Sales Entries</span>
            </span>
          </div>
        </div>

        {/* Total Collections */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E5EAE8] shadow-xs hover:border-[#22A06B] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#71807B] uppercase tracking-wider">Cash Collection</span>
            <div className="w-8 h-8 rounded-lg bg-[#E6F4ED] text-[#22A06B] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#22A06B] font-mono">
              ৳ {totalCollections.toLocaleString()}
            </h3>
            <span className="text-xs text-[#71807B] font-medium mt-1 block">
              Collection Rate: <strong className="text-[#18211F]">{collectionRatio}%</strong>
            </span>
          </div>
        </div>

        {/* Total Running Due */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E5EAE8] shadow-xs hover:border-red-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#71807B] uppercase tracking-wider">Running Due</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-[#D9534F] flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#D9534F] font-mono">
              ৳ {totalRunningDue.toLocaleString()}
            </h3>
            <span className="text-xs text-[#D9534F] font-semibold mt-1 block">
              {overdueRecords.length > 0 ? `${overdueRecords.length} Overdue Accounts` : 'No overdue accounts'}
            </span>
          </div>
        </div>

        {/* Total Sacrifice / Concession */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E5EAE8] shadow-xs hover:border-[#D9A441] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#71807B] uppercase tracking-wider">Sacrifice / Discount</span>
            <div className="w-8 h-8 rounded-lg bg-[#FEF6E7] text-[#D9A441] flex items-center justify-center">
              <BadgePercent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#D9A441] font-mono">
              ৳ {totalSacrifice.toLocaleString()}
            </h3>
            <span className="text-xs text-[#71807B] font-medium mt-1 block">
              Catalog Items: <strong className="text-[#18211F]">{products.length} Products</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Financial Ratio Progress & Product Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Health & Collection Progress */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5EAE8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#18211F] uppercase tracking-wider">
                Collection vs Due Ratio
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#E6F4ED] text-[#22A06B]">
                {collectionRatio}% Collected
              </span>
            </div>

            {/* Visual Multi-Segment Progress Bar */}
            <div className="h-3 w-full bg-[#F6F8F7] rounded-full overflow-hidden flex border border-[#E5EAE8] mb-4">
              <div
                style={{ width: `${Math.min(100, parseFloat(collectionRatio))}%` }}
                className="bg-[#22A06B] h-full"
                title={`Collected: ৳ ${totalCollections.toLocaleString()}`}
              />
              <div
                style={{ width: `${Math.max(0, 100 - parseFloat(collectionRatio))}%` }}
                className="bg-[#D9534F] h-full"
                title={`Due: ৳ ${totalRunningDue.toLocaleString()}`}
              />
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F6F8F7]">
                <span className="text-[#71807B] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22A06B]" />
                  Total Cash Collected:
                </span>
                <span className="font-bold text-[#22A06B] font-mono">৳ {totalCollections.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F6F8F7]">
                <span className="text-[#71807B] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D9534F]" />
                  Total Running Due:
                </span>
                <span className="font-bold text-[#D9534F] font-mono">৳ {totalRunningDue.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F6F8F7]">
                <span className="text-[#71807B] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D9A441]" />
                  Previous Due (Ex-Due):
                </span>
                <span className="font-bold text-[#18211F] font-mono">৳ {totalExDue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToSalesDue}
            className="w-full mt-4 py-2 px-3 rounded-lg border border-[#0E5A4F] text-xs font-bold text-[#0E5A4F] hover:bg-[#0E5A4F] hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>View Full Sales & Due Ledger</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Unit Top Products */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-[#E5EAE8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#18211F] uppercase tracking-wider">
                  Product Catalog & Price Chart
                </h3>
                <span className="text-xs text-[#71807B]">{products.length} Registered Products</span>
              </div>
              <button
                onClick={onNavigateToProducts}
                className="text-xs text-[#0E5A4F] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View All Products</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {products.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-[#F6F8F7] border border-[#E5EAE8] hover:border-[#0E5A4F] transition-all flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-[#71807B] font-bold uppercase block truncate">
                      {p.category || 'Product'}
                    </span>
                    <h4 className="text-xs font-bold text-[#18211F] truncate mt-0.5">{p.name}</h4>
                    <span className="text-[11px] text-[#71807B] mt-0.5 block">{p.unit}</span>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <span className="text-xs sm:text-sm font-bold text-[#0E5A4F] font-mono block">
                      ৳ {p.unitPrice.toLocaleString()}
                    </span>
                    {p.stock !== undefined && (
                      <span className="text-[10px] text-[#22A06B] font-semibold block">Stock: {p.stock}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5EAE8] flex items-center justify-between text-xs text-[#71807B]">
            <span>Products can be searched and selected during sale entries.</span>
            <button
              onClick={onOpenAddProductModal}
              className="text-[#0E5A4F] font-bold hover:underline cursor-pointer"
            >
              + Add New Product
            </button>
          </div>
        </div>
      </div>

      {/* Recent Sales & Due Entries Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAE8] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E5EAE8] flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#18211F]">Recent Sales & Due Transactions</h3>
            <p className="text-xs text-[#71807B] mt-0.5">Latest customer entries and running statuses</p>
          </div>
          <button
            onClick={onNavigateToSalesDue}
            className="px-3 py-1.5 rounded-lg bg-[#0E5A4F] hover:bg-[#073F37] text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>All Entries ({records.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentRecords.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#71807B]">
            No sales or due entries recorded yet.{' '}
            <button
              onClick={onOpenAddSaleModal}
              className="text-[#0E5A4F] font-bold underline ml-1 cursor-pointer"
            >
              Create first entry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFA] border-b border-[#E5EAE8] text-[11px] uppercase font-bold text-[#556963] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Date & Voucher</th>
                  <th className="py-3.5 px-4">Customer & Area</th>
                  <th className="py-3.5 px-4">Product & Quantity</th>
                  <th className="py-3.5 px-4 text-right">Total Amount</th>
                  <th className="py-3.5 px-4 text-right">Paid Cash</th>
                  <th className="py-3.5 px-4 text-right">Running Due</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBF0EE]">
                {recentRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F6F8F7] transition-all group">
                    <td className="py-3.5 px-4 align-middle">
                      <span className="font-mono font-bold text-[#18211F] text-xs block group-hover:text-[#0E5A4F] transition-colors">
                        {r.invoiceNo}
                      </span>
                      <span className="text-[11px] text-[#71807B] mt-0.5 block">{r.date}</span>
                    </td>
                    <td className="py-3.5 px-4 align-middle">
                      <span className="font-bold text-[#18211F] text-xs block">{r.customerName}</span>
                      <span className="text-[11px] text-[#71807B] mt-0.5 block">{r.customerOf || 'General Customer'}</span>
                    </td>
                    <td className="py-3.5 px-4 align-middle">
                      <span className="font-semibold text-[#2C3E3A] text-xs block">{r.productName}</span>
                      <span className="text-[10px] font-bold text-[#0E5A4F] bg-[#0E5A4F]/10 px-1.5 py-0.5 rounded-sm inline-block mt-0.5">
                        {r.quantity} {r.productUnit}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right align-middle">
                      <span className="font-mono font-bold text-[#18211F] text-xs">
                        ৳ {r.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right align-middle">
                      <span className="font-mono font-bold text-[#168051] text-xs">
                        ৳ {r.paid.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right align-middle">
                      <span className={`font-mono font-bold text-xs ${r.runningDue > 0 ? 'text-[#C93B37]' : 'text-[#71807B]'}`}>
                        ৳ {r.runningDue.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center align-middle">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          r.status === 'Full Paid'
                            ? 'bg-[#E6F4ED] text-[#168051] border border-[#22A06B]/20'
                            : r.status === 'Overdue'
                            ? 'bg-red-50 text-[#C93B37] border border-red-200'
                            : 'bg-amber-50 text-[#B45309] border border-amber-200'
                        }`}
                      >
                        {r.status === 'Full Paid' ? 'Full Paid' : r.status === 'Overdue' ? 'Overdue' : 'Partial Due'}
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
  );
};
