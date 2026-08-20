import React, { useState } from 'react';
import { Boxes, Package, AlertTriangle, CheckCircle, Search } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const inventoryBatches = [
    { id: 'bat-1', item: 'Egyptian Valencia Oranges (Grade A)', chamber: 'Chamber C-01', boxes: '14,200 ctns', weight: '213 MT', value: '৳ 1.84Cr', agingDays: 14, status: 'Optimal' },
    { id: 'bat-2', item: 'South African Royal Gala Apples', chamber: 'Chamber C-02', boxes: '11,500 ctns', weight: '207 MT', value: '৳ 1.48Cr', agingDays: 28, status: 'Aging Risk' },
    { id: 'bat-3', item: 'Iranian Medjool Khorma Dates', chamber: 'Chamber C-03', boxes: '8,400 ctns', weight: '84 MT', value: '৳ 94.5L', agingDays: 45, status: 'Variance Logged' },
    { id: 'bat-4', item: 'Mandarin Oranges (Honey Murcott)', chamber: 'Chamber C-04', boxes: '6,200 ctns', weight: '93 MT', value: '৳ 78.0L', agingDays: 11, status: 'Optimal' },
    { id: 'bat-5', item: 'Himachal Shimla Red Apples', chamber: 'Chamber C-05', boxes: '5,800 ctns', weight: '116 MT', value: '৳ 57.5L', agingDays: 18, status: 'Optimal' }
  ];

  const filtered = inventoryBatches.filter(b =>
    b.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.chamber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5 pb-10">
      {/* Top Inventory KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Total Inventory Valuation</span>
            <Boxes className="w-4 h-4 text-[#0E5A4F]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">৳ 5.62Cr</p>
          <p className="text-xs text-[#71807B] mt-1">713 Metric Tons across 6 cold rooms</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Aging Exposure Risk</span>
            <AlertTriangle className="w-4 h-4 text-[#D9A441]" />
          </div>
          <p className="text-2xl font-bold text-[#D9A441] mt-2 font-['Inter',sans-serif]">৳ 21.4L</p>
          <p className="text-xs text-[#71807B] mt-1">Batches exceeding 30-day cold cycle</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Daily Dispatch Volume</span>
            <Package className="w-4 h-4 text-[#22A06B]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">2,850 Ctns</p>
          <p className="text-xs text-[#22A06B] font-medium mt-1">100% Challan Verification</p>
        </div>
      </div>

      {/* Inventory Batches Table */}
      <div className="bg-white rounded-xl border border-[#E5EAE8] shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#E5EAE8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#18211F]">Live Storage Lots & Commodity Batches</h3>
            <p className="text-xs text-[#71807B] mt-0.5">Real-time stock ledger & cold room lot tracking</p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71807B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search commodity or chamber..."
              className="text-xs pl-9 pr-3 py-1.5 bg-[#F6F8F7] border border-[#E5EAE8] rounded-lg focus:outline-none focus:border-[#0E5A4F] text-[#18211F] placeholder-[#71807B] w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-[#71807B] border-b border-[#E5EAE8] uppercase font-semibold">
              <tr>
                <th className="py-3 px-5">Commodity / Fruit Lot</th>
                <th className="py-3 px-5">Cold Chamber</th>
                <th className="py-3 px-5 text-right">Quantity</th>
                <th className="py-3 px-5 text-right">Valuation</th>
                <th className="py-3 px-5 text-right">Days Stored</th>
                <th className="py-3 px-5 text-center">Batch Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F4]">
              {filtered.map((batch) => (
                <tr key={batch.id} className="hover:bg-[#F6F8F7] transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-[#18211F]">{batch.item}</td>
                  <td className="py-3.5 px-5 text-[#71807B] font-mono">{batch.chamber}</td>
                  <td className="py-3.5 px-5 text-right text-[#18211F] font-medium">{batch.boxes} ({batch.weight})</td>
                  <td className="py-3.5 px-5 text-right font-bold text-[#18211F] font-['Inter',sans-serif]">{batch.value}</td>
                  <td className="py-3.5 px-5 text-right font-medium text-[#71807B]">{batch.agingDays} days</td>
                  <td className="py-3.5 px-5 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        batch.status === 'Optimal'
                          ? 'bg-[#DCFCE7] text-[#166534]'
                          : batch.status === 'Aging Risk'
                          ? 'bg-[#FEF3C7] text-[#B45309]'
                          : 'bg-[#FEE2E2] text-[#991B1B]'
                      }`}
                    >
                      <span>{batch.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
