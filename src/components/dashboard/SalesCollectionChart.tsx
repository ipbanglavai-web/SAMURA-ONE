import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { ChartDataPoint } from '../../types';

interface SalesCollectionChartProps {
  data: ChartDataPoint[];
}

export const SalesCollectionChart: React.FC<SalesCollectionChartProps> = ({ data }) => {
  // Custom tooltip matching enterprise aesthetics
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#073F37] text-white p-2.5 rounded-lg shadow-xl border border-[#0E5A4F] text-xs font-sans">
          <p className="font-semibold text-[#D1DDD7] mb-1">{label} Day Trend</p>
          <div className="space-y-0.5">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-[#A3B8B0]">
                <span className="w-2 h-2 rounded-full bg-[#0E5A4F] border border-white/40"></span>
                <span>Sales:</span>
              </span>
              <span className="font-bold text-white">৳ {payload[0]?.value}L</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-[#A3B8B0]">
                <span className="w-2 h-2 rounded-full bg-[#D9A441]"></span>
                <span>Collection:</span>
              </span>
              <span className="font-bold text-[#FDE68A]">৳ {payload[1]?.value}L</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E5EAE8] shadow-xs flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#18211F] tracking-tight">
          Sales & Collection Trend
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-3 text-[10px] text-[#71807B] font-semibold">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-[#0E5A4F] mr-1.5"></span>Sales
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-[#D9A441] mr-1.5"></span>Collection
            </span>
          </div>
          <span className="px-2 py-0.5 border border-[#E5EAE8] rounded text-[10px] bg-[#F6F8F7] font-semibold text-[#71807B]">
            Last 7 Days
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-[200px] sm:h-[220px] relative -ml-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {/* Sales Gradient fill */}
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0E5A4F" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0E5A4F" stopOpacity={0.02} />
              </linearGradient>
              {/* Collection subtle fill */}
              <linearGradient id="collectionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D9A441" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#D9A441" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F1F5F4"
            />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={{ stroke: '#E5EAE8' }}
              tick={{ fill: '#71807B', fontSize: 10, fontWeight: 600 }}
              dy={4}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#8EA39B', fontSize: 10 }}
              tickFormatter={(val) => `৳${val}L`}
              domain={[10, 50]}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Sales Line & Gradient Area */}
            <Area
              type="monotone"
              dataKey="sales"
              name="Sales"
              stroke="#0E5A4F"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#salesGradient)"
              activeDot={{ r: 4, fill: '#0E5A4F', stroke: '#FFFFFF', strokeWidth: 2 }}
            />

            {/* Collection Dashed Line */}
            <Area
              type="monotone"
              dataKey="collection"
              name="Collection"
              stroke="#D9A441"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#collectionGradient)"
              activeDot={{ r: 4, fill: '#D9A441', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
