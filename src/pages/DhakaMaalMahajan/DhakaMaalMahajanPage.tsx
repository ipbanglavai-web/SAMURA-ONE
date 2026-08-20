import React from 'react';
import { Store, TrendingUp, HandCoins, Truck, CheckCircle2 } from 'lucide-react';

export const DhakaMaalMahajanPage: React.FC = () => {
  const mahajanLedger = [
    { id: 'm-1', aratName: 'Al-Haj Siddique Arat (Badam Toli)', todayChallans: '4 Trucks (1,600 Ctns)', grossSales: '৳ 14.2L', commission: '৳ 71,000 (5%)', netDue: '৳ 13.49L', status: 'Settled Today' },
    { id: 'm-2', aratName: 'Faruk Commission Agency (Babubazar)', todayChallans: '3 Trucks (1,200 Ctns)', grossSales: '৳ 10.8L', commission: '৳ 54,000 (5%)', netDue: '৳ 10.26L', status: 'In Process' },
    { id: 'm-3', aratName: 'Shahjalal Fruit Traders (Kawran Bazar)', todayChallans: '2 Trucks (850 Ctns)', grossSales: '৳ 7.6L', commission: '৳ 38,000 (5%)', netDue: '৳ 7.22L', status: 'Settled Today' },
    { id: 'm-4', aratName: 'Green Enterprise (Jatrabari Arat)', todayChallans: '2 Trucks (800 Ctns)', grossSales: '৳ 6.9L', commission: '৳ 34,500 (5%)', netDue: '৳ 6.55L', status: 'Pending Deposit' }
  ];

  return (
    <div className="space-y-5 pb-10">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Today's Arat Challan Sales</span>
            <Store className="w-4 h-4 text-[#0E5A4F]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">৳ 39.5L</p>
          <p className="text-xs text-[#22A06B] font-medium mt-1">11 Wholesale Truckloads Dispatched</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Mahajan Commission Paid</span>
            <HandCoins className="w-4 h-4 text-[#0E5A4F]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">৳ 1.97L</p>
          <p className="text-xs text-[#71807B] mt-1">Standard 5.0% wholesale arat tariff</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Net Realizable Due</span>
            <Truck className="w-4 h-4 text-[#22A06B]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">৳ 37.53L</p>
          <p className="text-xs text-[#22A06B] font-medium mt-1">৳ 28.4L collected via RTGS/Cash</p>
        </div>
      </div>

      {/* Mahajan Daily Breakdown */}
      <div className="bg-white rounded-xl border border-[#E5EAE8] shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#E5EAE8]">
          <h3 className="text-base font-bold text-[#18211F]">Dhaka Wholesale Arat Daily Ledger</h3>
          <p className="text-xs text-[#71807B] mt-0.5">Badam Toli, Babubazar, Kawran Bazar & Jatrabari wholesale lots</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-[#71807B] border-b border-[#E5EAE8] uppercase font-semibold">
              <tr>
                <th className="py-3 px-5">Aratdar / Commission Desk</th>
                <th className="py-3 px-5">Daily Consignments</th>
                <th className="py-3 px-5 text-right">Gross Sales</th>
                <th className="py-3 px-5 text-right">Arat Commission</th>
                <th className="py-3 px-5 text-right">Net Payable to Samura</th>
                <th className="py-3 px-5 text-center">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F4]">
              {mahajanLedger.map((row) => (
                <tr key={row.id} className="hover:bg-[#F6F8F7] transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-[#18211F]">{row.aratName}</td>
                  <td className="py-3.5 px-5 text-[#71807B]">{row.todayChallans}</td>
                  <td className="py-3.5 px-5 text-right font-semibold text-[#18211F]">{row.grossSales}</td>
                  <td className="py-3.5 px-5 text-right text-[#71807B]">{row.commission}</td>
                  <td className="py-3.5 px-5 text-right font-bold text-[#0E5A4F] text-sm">{row.netDue}</td>
                  <td className="py-3.5 px-5 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        row.status === 'Settled Today'
                          ? 'bg-[#DCFCE7] text-[#166534]'
                          : row.status === 'In Process'
                          ? 'bg-[#FEF3C7] text-[#B45309]'
                          : 'bg-[#FEE2E2] text-[#991B1B]'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{row.status}</span>
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
