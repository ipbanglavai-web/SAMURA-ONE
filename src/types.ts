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
  userType?: 'admin' | 'manager' | 'general_manager';
  managerType?: 'unit_manager' | 'general_manager';
  businessId?: string;
  businessName?: string;
  phone?: string;
  nid?: string;
  assignedBusinessIds?: string[];
  assignedBusinessNames?: string[];
  selectedBusinessId?: string;
  selectedBusinessName?: string;
}

export type ManagerNavTab = 'overview' | 'sales-due' | 'products' | 'customers';

export interface ManagerCustomer {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  address: string;
  reference: string; // Reference / Customer of
  dueAmount: number; // Current Running Due
  totalSales?: number;
  totalPaid?: number;
  lastTransactionDate?: string;
  notes?: string;
  status?: 'Active' | 'Defaulter' | 'Clear';
  createdAt?: string;
}

export interface UnitProduct {
  id: string;
  businessId: string;
  name: string;
  unit: string; // e.g. 'Kg', 'Carton', 'Piece', 'Box', 'Ton', 'Liter', 'Bag'
  unitPrice: number;
  category?: string;
  stock?: number;
  notes?: string;
  createdAt?: string;
}

export interface SaleDueRecord {
  id: string;
  businessId: string;
  invoiceNo: string;
  date: string;
  customerName: string; // Name
  address: string; // Address (area+Contact)
  customerOf: string; // Customer of
  exDue: number; // Ex-Due
  productId: string;
  productName: string; // Sold products ( product Search & Selection )
  productUnit: string;
  unitPrice: number;
  quantity: number; // Product quantity
  amount: number; // Amount (quantity * unitPrice or custom sale total)
  paid: number; // Paid
  sacrifice: number; // Sacrifice
  payableDue: number; // Payable due = (Ex-Due + Amount - Sacrifice)
  runningDue: number; // Running Due = (Payable due - Paid)
  duePaymentDate: string; // Due Payment Date
  notes?: string;
  status: 'Full Paid' | 'Partial Due' | 'Overdue' | 'Unpaid' | 'Void Pending';
  voidRequested?: boolean;
  createdAt: string;
}

export interface KpiItem {
  id: string;
  title: string;
  value: string;
  secondary: string;
  trend?: 'up' | 'down' | 'neutral';
  isAlert?: boolean;
  iconName: 'sales' | 'collection' | 'bank' | 'receivable' | 'inventory';
  badge?: string;
  badgeColor?: string;
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
  salesGrowth?: number; // % growth difference, positive for up e.g. 14.5, negative for down e.g. -6.2
  previousSales?: string;
  salesLakhs?: number;
  totalSalesTaka?: number;
  totalPaidTaka?: number;
  todaySalesTaka?: number;
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
  managerType?: 'unit_manager' | 'general_manager';
  assignedBusinessIds?: string[];
  assignedBusinessNames?: string[];
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
  type: 'payment' | 'inventory' | 'credit' | 'void';
  age: string;
  requester: string;
  department: string;
  status: 'pending' | 'approved' | 'rejected';
  business?: string;
  saleId?: string;
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
