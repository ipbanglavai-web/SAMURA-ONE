import { BusinessHealthItem, KpiItem, ChartDataPoint, ReceivableAgingItem } from '../types';

export function parseSalesToLakhs(salesStr: string): number {
  if (!salesStr) return 0;
  const clean = salesStr.replace(/[৳,\s]/g, '').trim();
  if (clean.toLowerCase().endsWith('cr')) {
    const num = parseFloat(clean.slice(0, -2));
    return isNaN(num) ? 0 : num * 100;
  }
  if (clean.toLowerCase().endsWith('l')) {
    const num = parseFloat(clean.slice(0, -1));
    return isNaN(num) ? 0 : num;
  }
  if (clean.toLowerCase().endsWith('k')) {
    const num = parseFloat(clean.slice(0, -1));
    return isNaN(num) ? 0 : num / 100;
  }
  const directNum = parseFloat(clean);
  return isNaN(directNum) ? 0 : directNum;
}

export function formatLakhs(lakhs: number): string {
  if (lakhs <= 0) return '৳ 0.0L';
  if (lakhs >= 100) {
    const cr = lakhs / 100;
    return `৳ ${cr.toFixed(2)}Cr`;
  }
  return `৳ ${lakhs.toFixed(1)}L`;
}

export function calculateDerivedBusinessData(businesses: BusinessHealthItem[]): {
  kpis: KpiItem[];
  chartData: ChartDataPoint[];
  agingData: ReceivableAgingItem[];
  totalSalesFormatted: string;
  totalCollectionFormatted: string;
  totalReceivableFormatted: string;
  collectionRatio: string;
} {
  const totalSalesLakhs = businesses.reduce((sum, b) => sum + parseSalesToLakhs(b.sales), 0);
  
  const totalCollectionLakhs = businesses.reduce((sum, b) => {
    const s = parseSalesToLakhs(b.sales);
    const rate = parseFloat(b.collectionRate?.replace('%', '') || '80') / 100;
    return sum + (s * (isNaN(rate) ? 0.8 : rate));
  }, 0);

  const ratio = totalSalesLakhs > 0 ? ((totalCollectionLakhs / totalSalesLakhs) * 100).toFixed(1) : '0.0';
  const totalReceivableLakhs = totalSalesLakhs * 5.093;
  const overdueLakhs = totalReceivableLakhs * 0.1766;
  const totalInventoryLakhs = totalSalesLakhs * 13.13;
  const totalCashBankLakhs = totalSalesLakhs * 8.738;

  const totalSalesFormatted = formatLakhs(totalSalesLakhs);
  const totalCollectionFormatted = formatLakhs(totalCollectionLakhs);
  const totalReceivableFormatted = formatLakhs(totalReceivableLakhs);

  const kpis: KpiItem[] = [
    {
      id: 'kpi-sales',
      title: "Today's Sales",
      value: totalSalesFormatted,
      secondary: "+8.4% vs Yesterday",
      trend: "up",
      iconName: "sales"
    },
    {
      id: 'kpi-collection',
      title: "Today's Collection",
      value: totalCollectionFormatted,
      secondary: `${ratio}% collection ratio`,
      trend: "neutral",
      iconName: "collection"
    },
    {
      id: 'kpi-cash-bank',
      title: "Cash & Bank",
      value: formatLakhs(totalCashBankLakhs),
      secondary: `${Math.max(2, businesses.length * 2)} accounts`,
      trend: "neutral",
      iconName: "bank"
    },
    {
      id: 'kpi-receivable',
      title: "Receivable",
      value: totalReceivableFormatted,
      secondary: `${formatLakhs(overdueLakhs)} overdue`,
      trend: "down",
      isAlert: true,
      iconName: "receivable"
    },
    {
      id: 'kpi-inventory',
      title: "Inventory Value",
      value: formatLakhs(totalInventoryLakhs),
      secondary: `${formatLakhs(totalInventoryLakhs * 0.038)} ageing risk`,
      trend: "down",
      isAlert: true,
      iconName: "inventory"
    }
  ];

  const scale = totalSalesLakhs / 42.8 || 1;
  const colScale = totalCollectionLakhs / 31.6 || 1;

  const chartData: ChartDataPoint[] = [
    { day: 'Thu', sales: Math.round(24.5 * scale * 10) / 10, collection: Math.round(18.2 * colScale * 10) / 10 },
    { day: 'Fri', sales: Math.round(29.8 * scale * 10) / 10, collection: Math.round(22.0 * colScale * 10) / 10 },
    { day: 'Sat', sales: Math.round(27.2 * scale * 10) / 10, collection: Math.round(20.5 * colScale * 10) / 10 },
    { day: 'Sun', sales: Math.round(38.4 * scale * 10) / 10, collection: Math.round(33.1 * colScale * 10) / 10 },
    { day: 'Mon', sales: Math.round(34.1 * scale * 10) / 10, collection: Math.round(28.9 * colScale * 10) / 10 },
    { day: 'Tue', sales: Math.round(40.5 * scale * 10) / 10, collection: Math.round(35.2 * colScale * 10) / 10 },
    { day: 'Wed', sales: Math.round(totalSalesLakhs * 10) / 10, collection: Math.round(totalCollectionLakhs * 10) / 10 }
  ];

  const agingData: ReceivableAgingItem[] = [
    {
      range: '0–30 days',
      percentage: 58,
      amount: formatLakhs(totalReceivableLakhs * 0.578),
      colorClass: 'bg-[#7E8B26]'
    },
    {
      range: '31–60 days',
      percentage: 24,
      amount: formatLakhs(totalReceivableLakhs * 0.239),
      colorClass: 'bg-[#C98A2C]'
    },
    {
      range: '61–90 days',
      percentage: 11,
      amount: formatLakhs(totalReceivableLakhs * 0.11),
      colorClass: 'bg-[#B45309]'
    },
    {
      range: '90+ days',
      percentage: 7,
      amount: formatLakhs(totalReceivableLakhs * 0.07),
      colorClass: 'bg-[#DC2626]'
    }
  ];

  return {
    kpis,
    chartData,
    agingData,
    totalSalesFormatted,
    totalCollectionFormatted,
    totalReceivableFormatted,
    collectionRatio: ratio
  };
}
