import React from 'react';
import { KPI_DATA, SALES_COLLECTION_CHART_DATA, RECEIVABLE_AGING_DATA, BUSINESS_HEALTH_DATA } from '../../data/mockData';
import { SalesCollectionChart } from '../../components/dashboard/SalesCollectionChart';
import { ReceivableAgingCard } from '../../components/dashboard/ReceivableAgingCard';
import { TrendingUp, ArrowDownLeft, AlertCircle, Users, CheckCircle, Building2 } from 'lucide-react';
import { KpiItem, ChartDataPoint, ReceivableAgingItem, BusinessHealthItem } from '../../types';

interface SalesCollectionPageProps {
  kpis?: KpiItem[];
  chartData?: ChartDataPoint[];
  agingData?: ReceivableAgingItem[];
  businesses?: BusinessHealthItem[];
}

export const SalesCollectionPage: React.FC<SalesCollectionPageProps> = ({
  kpis = KPI_DATA,
  chartData = SALES_COLLECTION_CHART_DATA,
  agingData = RECEIVABLE_AGING_DATA,
  businesses = BUSINESS_HEALTH_DATA
}) => {
  const salesKpi = kpis.find(k => k.id === 'kpi-sales') || kpis[0];
  const collectionKpi = kpis.find(k => k.id === 'kpi-collection') || kpis[1];
  const receivableKpi = kpis.find(k => k.id === 'kpi-receivable') || kpis[3];

  return (
    <div className="space-y-5 pb-10">
      {/* Top Sales & Collection KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Today's Gross Sales</span>
            <TrendingUp className="w-4 h-4 text-[#0E5A4F]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">{salesKpi?.value || '৳ 0.0L'}</p>
          <p className="text-xs text-[#22A06B] font-medium mt-1">{salesKpi?.secondary || '+8.4% vs Yesterday'}</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Realized Collections</span>
            <ArrowDownLeft className="w-4 h-4 text-[#22A06B]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">{collectionKpi?.value || '৳ 0.0L'}</p>
          <p className="text-xs text-[#71807B] mt-1">{collectionKpi?.secondary || '73.8% Collection Ratio'}</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Total Outstanding</span>
            <AlertCircle className="w-4 h-4 text-[#D9534F]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">{receivableKpi?.value || '৳ 0.0Cr'}</p>
          <p className="text-xs text-[#D9534F] font-medium mt-1">{receivableKpi?.secondary || '৳ 38.5L Overdue (>30d)'}</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Active Business Units</span>
            <Building2 className="w-4 h-4 text-[#0E5A4F]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">{businesses.length} Units</p>
          <p className="text-xs text-[#22A06B] font-medium mt-1">Live synchronized ledger</p>
        </div>
      </div>

      {/* Main Charts & Aging Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <SalesCollectionChart data={chartData} />
        </div>
        <div className="lg:col-span-4">
          <ReceivableAgingCard agingData={agingData} totalReceivable={receivableKpi?.value} />
        </div>
      </div>

      {/* Customer Exposure Watchlist */}
      <div className="bg-white rounded-xl border border-[#E5EAE8] shadow-2xs p-5">
        <h3 className="text-base font-bold text-[#18211F] mb-1">Overdue Credit Exposure Watchlist</h3>
        <p className="text-xs text-[#71807B] mb-4">Clients requiring collection follow-up or temporary credit stop</p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-[#71807B] border-b border-[#E5EAE8] uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-4">Client / Arat Name</th>
                <th className="py-2.5 px-4">Location</th>
                <th className="py-2.5 px-4 text-right">Outstanding</th>
                <th className="py-2.5 px-4 text-right">Days Overdue</th>
                <th className="py-2.5 px-4 text-center">Credit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F4]">
              <tr className="hover:bg-[#F6F8F7]">
                <td className="py-3 px-4 font-semibold text-[#18211F]">M/S Bhai Bhai Fruits</td>
                <td className="py-3 px-4 text-[#71807B]">Badam Toli Arat, Dhaka</td>
                <td className="py-3 px-4 text-right font-bold text-[#D9534F]">৳ 14.8L</td>
                <td className="py-3 px-4 text-right text-[#D9534F] font-semibold">68 Days</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FEE2E2] text-[#991B1B]">
                    Credit Stop
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#F6F8F7]">
                <td className="py-3 px-4 font-semibold text-[#18211F]">Rahman & Sons Enterprise</td>
                <td className="py-3 px-4 text-[#71807B]">Babubazar Market</td>
                <td className="py-3 px-4 text-right font-bold text-[#D9A441]">৳ 8.2L</td>
                <td className="py-3 px-4 text-right text-[#D9A441] font-semibold">42 Days</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FEF3C7] text-[#B45309]">
                    Notice Issued
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#F6F8F7]">
                <td className="py-3 px-4 font-semibold text-[#18211F]">Al-Madina Fruit Agency</td>
                <td className="py-3 px-4 text-[#71807B]">Kawran Bazar, Dhaka</td>
                <td className="py-3 px-4 text-right font-bold text-[#18211F]">৳ 5.5L</td>
                <td className="py-3 px-4 text-right text-[#71807B] font-semibold">28 Days</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#DCFCE7] text-[#166534]">
                    Active
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
