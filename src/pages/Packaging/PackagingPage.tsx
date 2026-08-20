import React from 'react';
import { Box, Layers, Scissors, CheckCircle } from 'lucide-react';

export const PackagingPage: React.FC = () => {
  const packagingStock = [
    { id: 'pkg-1', name: '5-Ply Heavy Corrugated Master Carton (15kg Citrus)', stock: '48,000 Pcs', unitCost: '৳ 62.50', totalValue: '৳ 30.0L', bufferDays: '22 Days' },
    { id: 'pkg-2', name: '3-Ply Printed Apple Tray Box (18kg)', stock: '32,500 Pcs', unitCost: '৳ 74.00', totalValue: '৳ 24.05L', bufferDays: '18 Days' },
    { id: 'pkg-3', name: 'Micro-Perforated Date Khorma Poly Liners (1kg/5kg)', stock: '120,000 Pcs', unitCost: '৳ 4.20', totalValue: '৳ 5.04L', bufferDays: '40 Days' },
    { id: 'pkg-4', name: 'Reinforced PP Strapping Rolls (12mm Green)', stock: '450 Rolls', unitCost: '৳ 850.00', totalValue: '৳ 3.82L', bufferDays: '35 Days' }
  ];

  return (
    <div className="space-y-5 pb-10">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Packaging Material Inventory</span>
            <Box className="w-4 h-4 text-[#0E5A4F]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">৳ 62.91L</p>
          <p className="text-xs text-[#22A06B] font-medium mt-1">Sufficient for 24 days peak season</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Avg Carton Unit Cost</span>
            <Layers className="w-4 h-4 text-[#0E5A4F]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">৳ 64.80</p>
          <p className="text-xs text-[#22A06B] font-medium mt-1">-3.2% vs previous tender</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Carton Conversion Rate</span>
            <Scissors className="w-4 h-4 text-[#22A06B]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">99.4%</p>
          <p className="text-xs text-[#22A06B] font-medium mt-1">Low wastage manufacturing standard</p>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-xl border border-[#E5EAE8] shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#E5EAE8]">
          <h3 className="text-base font-bold text-[#18211F]">Packaging Raw Materials & Carton Stock</h3>
          <p className="text-xs text-[#71807B] mt-0.5">Inventory level at packaging conversion plant</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-[#71807B] border-b border-[#E5EAE8] uppercase font-semibold">
              <tr>
                <th className="py-3 px-5">Material Description</th>
                <th className="py-3 px-5 text-right">In-Stock Quantity</th>
                <th className="py-3 px-5 text-right">Unit Rate</th>
                <th className="py-3 px-5 text-right">Total Valuation</th>
                <th className="py-3 px-5 text-right">Production Buffer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F4]">
              {packagingStock.map((item) => (
                <tr key={item.id} className="hover:bg-[#F6F8F7] transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-[#18211F]">{item.name}</td>
                  <td className="py-3.5 px-5 text-right font-medium text-[#18211F]">{item.stock}</td>
                  <td className="py-3.5 px-5 text-right text-[#71807B]">{item.unitCost}</td>
                  <td className="py-3.5 px-5 text-right font-bold text-[#18211F]">{item.totalValue}</td>
                  <td className="py-3.5 px-5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#DCFCE7] text-[#166534]">
                      {item.bufferDays}
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
