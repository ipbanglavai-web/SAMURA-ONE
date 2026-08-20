export type RoutePath =
  | '/dashboard'
  | '/businesses'
  | '/managers'
  | '/finance'
  | '/sales-collection'
  | '/inventory'
  | '/dhaka-maal-mahajan'
  | '/import-shipments'
  | '/cold-storage'
  | '/packaging'
  | '/hospital-summary'
  | '/approvals'
  | '/ask-samura'
  | '/settings';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
  title: string;
}

export interface KpiItem {
  id: string;
  title: string;
  value: string;
  secondary: string;
  trend?: 'up' | 'down' | 'neutral';
  isAlert?: boolean;
  iconName: 'sales' | 'collection' | 'bank' | 'receivable' | 'inventory';
}

export interface ChartDataPoint {
  day: string;
  sales: number;
  collection: number;
}

export interface CriticalAlert {
  id: string;
  title: string;
  description: string;
  type: 'receivable' | 'shipment' | 'coldroom';
  severity: 'high' | 'medium' | 'low';
  time: string;
  status: 'open' | 'acknowledged' | 'resolved';
  business?: string;
}

export interface BusinessHealthItem {
  id: string;
  name: string;
  sales: string;
  status: 'Healthy' | 'Watch' | 'Critical';
  collectionRate?: string;
  margin?: string;
  manager?: string;
}

export interface BusinessManager {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  nid: string;
  businessId: string;
  businessName: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface ReceivableAgingItem {
  range: string;
  percentage: number;
  amount: string;
  colorClass: string;
}

export interface PendingApproval {
  id: string;
  title: string;
  description: string;
  amount?: string;
  type: 'payment' | 'inventory' | 'credit';
  age: string;
  requester: string;
  department: string;
  status: 'pending' | 'approved' | 'rejected';
  business?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  balance: string;
  branch: string;
  type: string;
  status: 'Active' | 'Restricted';
}

export interface ColdStorageChamber {
  id: string;
  name: string;
  temperature: number;
  setPoint: number;
  humidity: number;
  capacityUsed: number;
  totalCapacityTons: number;
  commodity: string;
  status: 'Normal' | 'Deviation' | 'Maintenance';
  lastLog: string;
}

export interface ImportShipment {
  id: string;
  lcNumber: string;
  commodity: string;
  origin: string;
  vesselName: string;
  eta: string;
  status: 'At Sea' | 'Port Clearance' | 'Customs' | 'Discharging' | 'Completed';
  containers: number;
  budgetLandedCost: string;
  actualEstimatedCost: string;
  variancePercent: number;
}
