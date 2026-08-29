import { BusinessHealthItem, KpiItem, ChartDataPoint, ReceivableAgingItem, SaleDueRecord } from '../types';

export interface BusinessGrowthData {
  growthRate: number; // e.g. 14.5 or -6.2
  isPositive: boolean;
  badgeText: string; // e.g. "Healthy (+14.5%)" or "Unhealthy (-6.2%)"
  shortText: string; // e.g. "+14.5%" or "-6.2%"
  statusLabel: 'Healthy' | 'Unhealthy' | 'Watch' | 'Critical';
  bgClass: string;
  textClass: string;
  borderClass: string;
  iconType: 'up' | 'down';
}

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
  if (lakhs < 1) {
    const taka = Math.round(lakhs * 100000);
    if (taka >= 1000) {
      return `৳ ${taka.toLocaleString('en-IN')}`;
    }
  }
  return `৳ ${lakhs.toFixed(1)}L`;
}

export function calculateDerivedBusinessData(
  businesses: BusinessHealthItem[],
  salesRecords: SaleDueRecord[] = []
): {
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

  // Calculate actual total running due from active sales records
  let totalReceivableLakhs = 0;
  if (Array.isArray(salesRecords) && salesRecords.length > 0) {
    const totalDueTaka = salesRecords.reduce((sum, r) => sum + (Number(r.runningDue) || 0), 0);
    const actualDueLakhs = totalDueTaka / 100000;

    // Add receivables for untracked business units
    const trackedBizIds = new Set(salesRecords.map(r => (r.businessId || '').toLowerCase()));
    const unTrackedDueLakhs = businesses.reduce((sum, b) => {
      const bId = (b.id || '').toLowerCase();
      const bName = (b.name || '').toLowerCase();
      const isTracked = trackedBizIds.has(bId) || bId === 'bh-1' || bId === 'bh-2' || bName.includes('elenga') || bName.includes('mourin');
      if (isTracked) return sum;
      const s = parseSalesToLakhs(b.sales);
      const rate = parseFloat(b.collectionRate?.replace('%', '') || '80') / 100;
      return sum + (s * (1 - (isNaN(rate) ? 0.8 : rate)));
    }, 0);

    totalReceivableLakhs = actualDueLakhs + unTrackedDueLakhs;
  } else {
    totalReceivableLakhs = businesses.reduce((sum, b) => {
      const s = parseSalesToLakhs(b.sales);
      const rate = parseFloat(b.collectionRate?.replace('%', '') || '80') / 100;
      return sum + (s * (1 - (isNaN(rate) ? 0.8 : rate)));
    }, 0);
  }

  const overdueLakhs = totalReceivableLakhs * 0.25;
  const totalInventoryLakhs = totalSalesLakhs * 1.2;
  const totalCashBankLakhs = totalCollectionLakhs;

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
      amount: formatLakhs(totalReceivableLakhs * 0.58),
      colorClass: 'bg-[#7E8B26]'
    },
    {
      range: '31–60 days',
      percentage: 24,
      amount: formatLakhs(totalReceivableLakhs * 0.24),
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

export function computeDynamicBusinesses(
  rawBusinesses: BusinessHealthItem[],
  salesRecords: SaleDueRecord[]
): BusinessHealthItem[] {
  if (!Array.isArray(rawBusinesses)) return [];

  return rawBusinesses.map((b) => {
    const bId = (b.id || '').toLowerCase();
    const bName = (b.name || '').toLowerCase();

    const unitRecords = (salesRecords || []).filter((r) => {
      const rBizId = (r.businessId || '').toLowerCase();
      const rBizName = (r.customerOf || '').toLowerCase();
      return (
        rBizId === bId ||
        (bName.includes('elenga') && (rBizId === 'bh-1' || rBizId === 'biz-1' || rBizName.includes('elenga'))) ||
        (bName.includes('mourin') && (rBizId === 'bh-2' || rBizId === 'biz-2' || rBizName.includes('mourin'))) ||
        (rBizName.length > 3 && rBizName.includes(bName))
      );
    });

    // If unit is tracked in salesDueRecords and records exist:
    if (unitRecords.length > 0) {
      const totalAmount = unitRecords.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
      const totalPaid = unitRecords.reduce((sum, r) => sum + (Number(r.paid) || 0), 0);
      const currentLakhs = totalAmount / 100000;
      const salesFormatted = formatLakhs(currentLakhs);
      const colRate = totalAmount > 0 ? ((totalPaid / totalAmount) * 100).toFixed(1) + '%' : '0.0%';
      const prevSalesLakhs = parseSalesToLakhs(b.previousSales || '10.0L');
      const growth = prevSalesLakhs > 0 ? Math.round(((currentLakhs - prevSalesLakhs) / prevSalesLakhs) * 1000) / 10 : 0;
      const status: 'Healthy' | 'Watch' | 'Critical' =
        growth >= 0 && totalPaid / (totalAmount || 1) >= 0.7
          ? 'Healthy'
          : growth >= -15 && totalPaid / (totalAmount || 1) >= 0.4
          ? 'Watch'
          : 'Critical';

      return {
        ...b,
        sales: salesFormatted,
        collectionRate: colRate,
        salesGrowth: growth,
        status
      };
    }

    // If no records exist for this business (e.g. all records deleted by manager):
    const isSalesTrackedUnit =
      bId === 'bh-1' ||
      bId === 'bh-2' ||
      bName.includes('elenga') ||
      bName.includes('mourin') ||
      b.manager?.toLowerCase().includes('shakil') ||
      b.manager?.toLowerCase().includes('farhan') ||
      b.manager?.toLowerCase().includes('tanvir');

    if (isSalesTrackedUnit) {
      return {
        ...b,
        sales: '৳ 0.0L',
        collectionRate: '0.0%',
        salesGrowth: -100.0,
        status: 'Critical'
      };
    }

    return b;
  });
}

export function getBusinessGrowthData(biz: {
  status?: string;
  salesGrowth?: number;
  sales?: string;
  previousSales?: string;
}): BusinessGrowthData {
  let growth = typeof biz.salesGrowth === 'number' ? biz.salesGrowth : undefined;

  // Derive if not explicitly defined
  if (growth === undefined) {
    if (biz.sales && biz.previousSales) {
      const curr = parseSalesToLakhs(biz.sales);
      const prev = parseSalesToLakhs(biz.previousSales);
      if (prev > 0) {
        growth = ((curr - prev) / prev) * 100;
      }
    }
  }

  if (growth === undefined) {
    if (biz.status === 'Healthy') {
      growth = 8.5;
    } else if (biz.status === 'Unhealthy' || biz.status === 'Critical') {
      growth = -12.4;
    } else if (biz.status === 'Watch') {
      growth = -5.8;
    } else {
      growth = 5.0;
    }
  }

  const isPositive = growth >= 0;
  const absVal = Math.abs(growth).toFixed(1);
  const formattedPercent = `${isPositive ? '+' : '-'}${absVal}%`;

  let statusLabel: 'Healthy' | 'Unhealthy' | 'Watch' | 'Critical' = isPositive ? 'Healthy' : 'Unhealthy';
  let bgClass = isPositive ? 'bg-[#DCFCE7]' : 'bg-[#FEE2E2]';
  let textClass = isPositive ? 'text-[#15803D]' : 'text-[#B91C1C]';
  let borderClass = isPositive ? 'border-[#15803D]/40' : 'border-[#B91C1C]/40';

  const badgeText = isPositive ? `Healthy (${formattedPercent})` : `Unhealthy (${formattedPercent})`;

  return {
    growthRate: growth,
    isPositive,
    badgeText,
    shortText: formattedPercent,
    statusLabel,
    bgClass,
    textClass,
    borderClass,
    iconType: isPositive ? 'up' : 'down'
  };
}

