import {
  KpiItem,
  ChartDataPoint,
  CriticalAlert,
  BusinessHealthItem,
  ReceivableAgingItem,
  PendingApproval,
  BankAccount,
  ColdStorageChamber,
  ImportShipment
} from '../types';

export const KPI_DATA: KpiItem[] = [
  {
    id: 'kpi-sales',
    title: "Today's Sales",
    value: "৳ 42.8L",
    secondary: "+8.4% vs Yesterday",
    trend: "up",
    iconName: "sales"
  },
  {
    id: 'kpi-collection',
    title: "Today's Collection",
    value: "৳ 31.6L",
    secondary: "73.8% collection ratio",
    trend: "neutral",
    iconName: "collection"
  },
  {
    id: 'kpi-cash-bank',
    title: "Cash & Bank",
    value: "৳ 3.74Cr",
    secondary: "13 accounts",
    trend: "neutral",
    iconName: "bank"
  },
  {
    id: 'kpi-receivable',
    title: "Receivable",
    value: "৳ 2.18Cr",
    secondary: "৳ 38.5L overdue",
    trend: "down",
    isAlert: true,
    iconName: "receivable"
  },
  {
    id: 'kpi-inventory',
    title: "Inventory Value",
    value: "৳ 5.62Cr",
    secondary: "৳ 21.4L ageing risk",
    trend: "down",
    isAlert: true,
    iconName: "inventory"
  }
];

export const SALES_COLLECTION_CHART_DATA: ChartDataPoint[] = [
  { day: 'Thu', sales: 24.5, collection: 18.2 },
  { day: 'Fri', sales: 29.8, collection: 22.0 },
  { day: 'Sat', sales: 27.2, collection: 20.5 },
  { day: 'Sun', sales: 38.4, collection: 33.1 },
  { day: 'Mon', sales: 34.1, collection: 28.9 },
  { day: 'Tue', sales: 40.5, collection: 35.2 },
  { day: 'Wed', sales: 42.8, collection: 31.6 }
];

export const CRITICAL_ALERTS_DATA: CriticalAlert[] = [
  {
    id: 'alt-1',
    title: "Overdue receivable increased",
    description: "3 customers crossed 60 days · ৳ 12.7L exposure",
    type: "receivable",
    severity: "high",
    time: "12m ago",
    status: "open",
    business: "Mourin Fruits"
  },
  {
    id: 'alt-2',
    title: "Shipment landed cost variance",
    description: "Egyptian citrus cargo is 6.8% above approved budget",
    type: "shipment",
    severity: "medium",
    time: "45m ago",
    status: "open",
    business: "Elenga Fruits"
  },
  {
    id: 'alt-3',
    title: "Cold room excursion",
    description: "Chamber C-02 recorded 2 deviations; acknowledged",
    type: "coldroom",
    severity: "low",
    time: "2h ago",
    status: "acknowledged",
    business: "Samura Agro Cold Store"
  }
];

export const BUSINESS_HEALTH_DATA: BusinessHealthItem[] = [
  {
    id: 'bh-1',
    name: 'Elenga Fruits',
    sales: '৳ 11.8L',
    status: 'Healthy',
    collectionRate: '88.4%',
    margin: '14.2%',
    manager: 'Farhan Kabir'
  },
  {
    id: 'bh-2',
    name: 'Mourin Fruits',
    sales: '৳ 8.4L',
    status: 'Watch',
    collectionRate: '62.1%',
    margin: '9.8%',
    manager: 'Tanvir Hossain'
  },
  {
    id: 'bh-3',
    name: 'Zaafran',
    sales: '৳ 6.9L',
    status: 'Healthy',
    collectionRate: '91.5%',
    margin: '18.4%',
    manager: 'Rafiqul Islam'
  },
  {
    id: 'bh-4',
    name: 'Dhaka Mad',
    sales: '৳ 9.2L',
    status: 'Watch',
    collectionRate: '68.3%',
    margin: '11.0%',
    manager: 'Anisur Rahman'
  },
  {
    id: 'bh-5',
    name: 'Samura Agro Cold Store',
    sales: '৳ 4.1L',
    status: 'Healthy',
    collectionRate: '94.0%',
    margin: '22.5%',
    manager: 'Kamrul Hasan'
  },
  {
    id: 'bh-6',
    name: 'Samura General Hospital',
    sales: '৳ 2.4L',
    status: 'Healthy',
    collectionRate: '98.2%',
    margin: '16.8%',
    manager: 'Dr. Shahadat Hossain'
  }
];

export const RECEIVABLE_AGING_DATA: ReceivableAgingItem[] = [
  {
    range: '0–30 days',
    percentage: 58,
    amount: '৳ 1.26Cr',
    colorClass: 'bg-[#7E8B26]' // Olive/green tint matching the screenshot
  },
  {
    range: '31–60 days',
    percentage: 24,
    amount: '৳ 52.3L',
    colorClass: 'bg-[#C98A2C]' // Amber/gold
  },
  {
    range: '61–90 days',
    percentage: 11,
    amount: '৳ 24.0L',
    colorClass: 'bg-[#B45309]' // Dark amber
  },
  {
    range: '90+ days',
    percentage: 7,
    amount: '৳ 15.3L',
    colorClass: 'bg-[#DC2626]' // Red
  }
];

export const PENDING_APPROVALS_DATA: PendingApproval[] = [
  {
    id: 'app-1',
    title: 'Supplier payment',
    description: '৳ 8.75L · Import supplier · 5h old',
    amount: '৳ 8,75,000',
    type: 'payment',
    age: '5h old',
    requester: 'Accounts Dept - M. Karim',
    department: 'Procurement',
    status: 'pending',
    business: 'Elenga Fruits'
  },
  {
    id: 'app-2',
    title: 'Stock adjustment',
    description: 'Khorma batch · ৳ 1.42L variance',
    amount: '৳ 1,42,000',
    type: 'inventory',
    age: '3h old',
    requester: 'Cold Store C-04 Supervisor',
    department: 'Warehouse & Quality',
    status: 'pending',
    business: 'Samura Agro Cold Store'
  },
  {
    id: 'app-3',
    title: 'Credit override',
    description: 'Customer limit exceeded by ৳ 3.2L',
    amount: '৳ 3,20,000',
    type: 'credit',
    age: '1h old',
    requester: 'Sales Team - Badam Toli Arat',
    department: 'Commercial Credit',
    status: 'pending',
    business: 'Mourin Fruits'
  },
  {
    id: 'app-4',
    title: 'Challan clearance authorization',
    description: 'Egyptian Navel Oranges · 40ft container release',
    amount: '৳ 14,50,000',
    type: 'payment',
    age: '6h old',
    requester: 'Import Division',
    department: 'Logistics',
    status: 'pending',
    business: 'Elenga Fruits'
  },
  {
    id: 'app-5',
    title: 'Custom duty prepayment',
    description: 'Chittagong Port C&F charges',
    amount: '৳ 5,60,000',
    type: 'payment',
    age: '8h old',
    requester: 'Treasury Desk',
    department: 'Finance',
    status: 'pending',
    business: 'Zaafran'
  },
  {
    id: 'app-6',
    title: 'Packaging vendor contract renewal',
    description: '20,000 Heavy Master Cartons batch',
    amount: '৳ 4,80,000',
    type: 'inventory',
    age: '1d old',
    requester: 'Packaging Plant Manager',
    department: 'Operations',
    status: 'pending',
    business: 'Dhaka Mad'
  },
  {
    id: 'app-7',
    title: 'Hospital medical gas cylinder replenishment',
    description: 'Liquid oxygen central tank fill',
    amount: '৳ 2,10,000',
    type: 'payment',
    age: '1d old',
    requester: 'Samura Hospital Admin',
    department: 'Healthcare',
    status: 'pending',
    business: 'Samura General Hospital'
  }
];

export const BANK_ACCOUNTS_DATA: BankAccount[] = [
  { id: 'bnk-1', bankName: 'Islami Bank Bangladesh Ltd', accountNumber: '2050...4891', balance: '৳ 1.45Cr', branch: 'Dilkusha Corporate', type: 'Current CD', status: 'Active' },
  { id: 'bnk-2', bankName: 'Eastern Bank PLC', accountNumber: '1041...7723', balance: '৳ 88.4L', branch: 'Principal Branch', type: 'Foreign Exchange / LC', status: 'Active' },
  { id: 'bnk-3', bankName: 'City Bank Ltd', accountNumber: '1102...9382', balance: '৳ 42.1L', branch: 'Motijheel Branch', type: 'Collections STD', status: 'Active' },
  { id: 'bnk-4', bankName: 'Standard Chartered Bank', accountNumber: '0189...2214', balance: '৳ 35.0L', branch: 'Gulshan Branch', type: 'Trade Services', status: 'Active' },
  { id: 'bnk-5', bankName: 'BRAC Bank PLC', accountNumber: '1501...6643', balance: '৳ 28.5L', branch: 'Agrabad Chittagong', type: 'Port Operations', status: 'Active' },
  { id: 'bnk-6', bankName: 'Dutch-Bangla Bank', accountNumber: '1161...0911', balance: '৳ 18.2L', branch: 'Babubazar Branch', type: 'Wholesale Deposit', status: 'Active' },
  { id: 'bnk-7', bankName: 'Pubali Bank Ltd', accountNumber: '0822...4419', balance: '৳ 16.8L', branch: 'Elenga Branch', type: 'Agro Operations', status: 'Active' }
];

export const COLD_STORAGE_CHAMBERS: ColdStorageChamber[] = [
  { id: 'c-01', name: 'Chamber C-01', temperature: 0.8, setPoint: 1.0, humidity: 92, capacityUsed: 420, totalCapacityTons: 500, commodity: 'Egyptian Valencia Orange', status: 'Normal', lastLog: '3m ago' },
  { id: 'c-02', name: 'Chamber C-02', temperature: 3.4, setPoint: 0.5, humidity: 84, capacityUsed: 380, totalCapacityTons: 450, commodity: 'South African Royal Gala Apples', status: 'Deviation', lastLog: '1m ago' },
  { id: 'c-03', name: 'Chamber C-03', temperature: -1.2, setPoint: -1.0, humidity: 94, capacityUsed: 520, totalCapacityTons: 600, commodity: 'Iranian Khorma (Medjool Dates)', status: 'Normal', lastLog: '4m ago' },
  { id: 'c-04', name: 'Chamber C-04', temperature: 2.1, setPoint: 2.0, humidity: 89, capacityUsed: 310, totalCapacityTons: 400, commodity: 'Mandarin Oranges (Honey Murcott)', status: 'Normal', lastLog: '7m ago' },
  { id: 'c-05', name: 'Chamber C-05', temperature: 0.2, setPoint: 0.0, humidity: 95, capacityUsed: 460, totalCapacityTons: 500, commodity: 'Fuji Apples (Export Grade)', status: 'Normal', lastLog: '2m ago' },
  { id: 'c-06', name: 'Chamber C-06', temperature: 1.5, setPoint: 1.5, humidity: 90, capacityUsed: 290, totalCapacityTons: 450, commodity: 'Pomegranate & Grapes', status: 'Normal', lastLog: '5m ago' }
];

export const IMPORT_SHIPMENTS_DATA: ImportShipment[] = [
  { id: 'shp-1', lcNumber: 'LC-2026-EGY-0941', commodity: 'Egyptian Navel Oranges (Grade A)', origin: 'Port Said, Egypt', vesselName: 'MSC ANNA V.2608', eta: '24 Jul 2026', status: 'Port Clearance', containers: 12, budgetLandedCost: '৳ 1.85Cr', actualEstimatedCost: '৳ 1.98Cr', variancePercent: 6.8 },
  { id: 'shp-2', lcNumber: 'LC-2026-ZAF-0312', commodity: 'South African Royal Gala Apples', origin: 'Durban, South Africa', vesselName: 'MAERSK KALAMATA', eta: '29 Jul 2026', status: 'At Sea', containers: 8, budgetLandedCost: '৳ 1.42Cr', actualEstimatedCost: '৳ 1.41Cr', variancePercent: -0.7 },
  { id: 'shp-3', lcNumber: 'LC-2026-IRN-1120', commodity: 'Iranian Premium Khorma Dates', origin: 'Bandar Abbas, Iran', vesselName: 'CMA CGM BENGAL', eta: '02 Aug 2026', status: 'At Sea', containers: 6, budgetLandedCost: '৳ 95.0L', actualEstimatedCost: '৳ 96.2L', variancePercent: 1.2 },
  { id: 'shp-4', lcNumber: 'LC-2026-IND-0883', commodity: 'Himachal Shimla Apples', origin: 'Kolkata Land Border (Benapole)', vesselName: 'Overland Road Convoy', eta: '22 Jul 2026', status: 'Discharging', containers: 14, budgetLandedCost: '৳ 1.10Cr', actualEstimatedCost: '৳ 1.09Cr', variancePercent: -0.9 }
];

export const INITIAL_MANAGERS_DATA: import('../types').BusinessManager[] = [
  {
    id: 'mgr-1',
    name: 'Md. Rafiqul Islam',
    phone: '01711-234567',
    email: 'rafiqul@alsamura.com',
    password: 'password123',
    nid: '19882691234567890',
    businessId: 'bh-1',
    businessName: 'Elenga Fruits',
    status: 'Active',
    createdAt: '2026-01-15'
  },
  {
    id: 'mgr-2',
    name: 'Tariqul Hasan',
    phone: '01819-876543',
    email: 'tariqul@alsamura.com',
    password: 'password123',
    nid: '19852699876543210',
    businessId: 'bh-2',
    businessName: 'Mourin Fruits',
    status: 'Active',
    createdAt: '2026-02-01'
  },
  {
    id: 'mgr-3',
    name: 'Engr. Kamal Hossain',
    phone: '01912-345678',
    email: 'kamal@alsamura.com',
    password: 'password123',
    nid: '19792691122334455',
    businessId: 'bh-3',
    businessName: 'Samura Agro Cold Store',
    status: 'Active',
    createdAt: '2026-02-10'
  },
  {
    id: 'mgr-4',
    name: 'Shamim Reza',
    phone: '01715-998877',
    email: 'shamim@alsamura.com',
    password: 'password123',
    nid: '19902695544332211',
    businessId: 'bh-4',
    businessName: 'Zaafran',
    status: 'Active',
    createdAt: '2026-03-01'
  },
  {
    id: 'mgr-5',
    name: 'Arifur Rahman',
    phone: '01822-334455',
    email: 'arif@alsamura.com',
    password: 'password123',
    nid: '19862696677889900',
    businessId: 'bh-5',
    businessName: 'Dhaka Mad',
    status: 'Active',
    createdAt: '2026-03-12'
  },
  {
    id: 'mgr-6',
    name: 'Dr. Mahmudul Hasan',
    phone: '01713-445566',
    email: 'mahmud@alsamura.com',
    password: 'password123',
    nid: '19822692233445566',
    businessId: 'bh-6',
    businessName: 'Samura General Hospital',
    status: 'Active',
    createdAt: '2026-03-20'
  }
];
