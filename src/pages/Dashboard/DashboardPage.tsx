import React from 'react';
import { GreetingBanner } from '../../components/dashboard/GreetingBanner';
import { KpiCards } from '../../components/dashboard/KpiCards';
import { SalesCollectionChart } from '../../components/dashboard/SalesCollectionChart';
import { CriticalAlertsCard } from '../../components/dashboard/CriticalAlertsCard';
import { BusinessHealthCard } from '../../components/dashboard/BusinessHealthCard';
import { ReceivableAgingCard } from '../../components/dashboard/ReceivableAgingCard';
import { PendingApprovalsCard } from '../../components/dashboard/PendingApprovalsCard';
import {
  KpiItem,
  ChartDataPoint,
  CriticalAlert,
  BusinessHealthItem,
  ReceivableAgingItem,
  PendingApproval,
  RoutePath
} from '../../types';

interface DashboardPageProps {
  userName?: string;
  kpis: KpiItem[];
  chartData: ChartDataPoint[];
  alerts: CriticalAlert[];
  businesses: BusinessHealthItem[];
  agingData: ReceivableAgingItem[];
  approvals: PendingApproval[];
  onNavigate: (path: RoutePath) => void;
  onSelectAlert: (alert: CriticalAlert) => void;
  onSelectApproval: (approval: PendingApproval) => void;
  onSelectBusiness: (biz: BusinessHealthItem) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  userName = 'Sabuz',
  kpis,
  chartData,
  alerts,
  businesses,
  agingData,
  approvals,
  onNavigate,
  onSelectAlert,
  onSelectApproval,
  onSelectBusiness
}) => {
  const handleKpiClick = (kpiId: string) => {
    if (kpiId === 'kpi-sales' || kpiId === 'kpi-collection') {
      onNavigate('/sales-collection');
    } else if (kpiId === 'kpi-cash-bank') {
      onNavigate('/finance');
    } else if (kpiId === 'kpi-receivable') {
      onNavigate('/sales-collection');
    } else if (kpiId === 'kpi-inventory') {
      onNavigate('/inventory');
    }
  };

  return (
    <div className="space-y-4 pb-10">
      {/* 1. Greeting Banner */}
      <GreetingBanner
        userName={userName}
        onViewAttentionItems={() => onNavigate('/approvals')}
      />

      {/* 2. Top 5 KPI Cards */}
      <KpiCards
        kpis={kpis}
        onCardClick={handleKpiClick}
      />

      {/* 3. Main 12-Column High Density Layout */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left 8 Columns: Sales & Collection Trend Chart + Integrated Business Health Table */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="bg-white border border-[#E5EAE8] rounded-xl flex flex-col p-4 sm:p-5 overflow-hidden shadow-xs">
            <SalesCollectionChart data={chartData} />

            <BusinessHealthCard
              businesses={businesses}
              isCompactSection={true}
              onViewAll={() => onNavigate('/businesses')}
              onSelectBusiness={(biz) => {
                onSelectBusiness(biz);
                onNavigate('/businesses');
              }}
            />
          </div>
        </div>

        {/* Right 4 Columns: Critical Alerts + Receivable Aging + Pending Approvals */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <CriticalAlertsCard
            alerts={alerts}
            onAlertClick={onSelectAlert}
          />

          <ReceivableAgingCard
            agingData={agingData}
            totalReceivable={kpis.find(k => k.id === 'kpi-receivable')?.value}
            onViewAgingLedger={() => onNavigate('/sales-collection')}
          />

          <PendingApprovalsCard
            approvals={approvals}
            totalCount={approvals.filter(a => a.status === 'pending').length}
            onViewAllApprovals={() => onNavigate('/approvals')}
            onSelectApproval={onSelectApproval}
          />
        </div>
      </div>
    </div>
  );
};
