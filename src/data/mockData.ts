import {
  KpiItem,
  ChartDataPoint,
  CriticalAlert,
  BusinessHealthItem,
  ReceivableAgingItem,
  PendingApproval,
  BankAccount,
  ColdStorageChamber,
  ImportShipment,
  UnitProduct,
  SaleDueRecord,
  ManagerCustomer
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
    previousSales: '৳ 10.3L',
    salesGrowth: 14.5,
    status: 'Healthy',
    collectionRate: '88.4%',
    margin: '14.2%',
    manager: 'Farhan Kabir'
  },
  {
    id: 'bh-2',
    name: 'Mourin Fruits',
    sales: '৳ 8.4L',
    previousSales: '৳ 8.95L',
    salesGrowth: -6.2,
    status: 'Watch',
    collectionRate: '62.1%',
    margin: '9.8%',
    manager: 'Tanvir Hossain'
  },
  {
    id: 'bh-3',
    name: 'Zaafran',
    sales: '৳ 6.9L',
    previousSales: '৳ 5.82L',
    salesGrowth: 18.4,
    status: 'Healthy',
    collectionRate: '91.5%',
    margin: '18.4%',
    manager: 'Rafiqul Islam'
  },
  {
    id: 'bh-4',
    name: 'Dhaka Mad',
    sales: '৳ 9.2L',
    previousSales: '৳ 9.66L',
    salesGrowth: -4.8,
    status: 'Watch',
    collectionRate: '68.3%',
    margin: '11.0%',
    manager: 'Anisur Rahman'
  },
  {
    id: 'bh-5',
    name: 'Samura Agro Cold Store',
    sales: '৳ 4.1L',
    previousSales: '৳ 3.79L',
    salesGrowth: 8.2,
    status: 'Healthy',
    collectionRate: '94.0%',
    margin: '22.5%',
    manager: 'Kamrul Hasan'
  },
  {
    id: 'bh-6',
    name: 'Samura General Hospital',
    sales: '৳ 2.4L',
    previousSales: '৳ 2.28L',
    salesGrowth: 5.1,
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
    id: 'mgr-gm-1',
    name: 'Kabir Ahmed',
    phone: '01712-998877',
    email: 'gm@alsamura.com',
    password: 'password123',
    nid: '19822699887766554',
    businessId: 'all',
    businessName: 'All Businesses',
    status: 'Active',
    createdAt: '2026-03-01',
    managerType: 'general_manager',
    assignedBusinessIds: ['bh-1', 'bh-2', 'bh-3', 'bh-4', 'bh-5', 'bh-6'],
    assignedBusinessNames: ['Elenga Fruits', 'Mourin Fruits', 'Zaafran', 'Dhaka Mad', 'Samura Cold Storage', 'Al Samura Agro']
  },
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

export const INITIAL_PRODUCTS_DATA: UnitProduct[] = [
  // --- Dates (খেজুর) Collection ---
  {
    id: 'prd-khejur-1',
    businessId: 'bh-1',
    name: 'Ajoa',
    unit: 'Carton (5 Kg)',
    unitPrice: 5800,
    category: 'Dates (খেজুর)',
    stock: 240,
    notes: 'Ajwa Al-Madinah VIP premium grade original Saudi date'
  },
  {
    id: 'prd-khejur-2',
    businessId: 'bh-1',
    name: 'Mabrum VIP',
    unit: 'Carton (5 Kg)',
    unitPrice: 5200,
    category: 'Dates (খেজুর)',
    stock: 190,
    notes: 'Long slender VIP Mabroom dates directly imported'
  },
  {
    id: 'prd-khejur-3',
    businessId: 'bh-1',
    name: 'Morioum',
    unit: 'Carton (5 Kg)',
    unitPrice: 4500,
    category: 'Dates (খেজুর)',
    stock: 310,
    notes: 'Soft Maryam date batch, high customer demand'
  },
  {
    id: 'prd-khejur-4',
    businessId: 'bh-1',
    name: 'Mashruk',
    unit: 'Carton (5 Kg)',
    unitPrice: 2400,
    category: 'Dates (খেজুর)',
    stock: 280,
    notes: 'Popular commercial Mashrook variety'
  },
  {
    id: 'prd-khejur-5',
    businessId: 'bh-1',
    name: 'Dal Khejur',
    unit: 'Box (5 Kg)',
    unitPrice: 2100,
    category: 'Dates (খেজুর)',
    stock: 350,
    notes: 'Natural stem branch fresh dates'
  },
  {
    id: 'prd-khejur-6',
    businessId: 'bh-1',
    name: 'Teunishia',
    unit: 'Box (5 Kg)',
    unitPrice: 2650,
    category: 'Dates (খেজুর)',
    stock: 420,
    notes: 'Tunisian Deglet Nour branch dates'
  },
  {
    id: 'prd-khejur-7',
    businessId: 'bh-1',
    name: 'Khalash packet',
    unit: 'Packet (1 Kg)',
    unitPrice: 350,
    category: 'Dates (খেজুর)',
    stock: 850,
    notes: 'Vacuum packed Khalas dates'
  },
  {
    id: 'prd-khejur-8',
    businessId: 'bh-1',
    name: 'Khalash dala',
    unit: 'Carton (10 Kg)',
    unitPrice: 2900,
    category: 'Dates (খেজুর)',
    stock: 220,
    notes: 'Bulk open dala Khalas dates'
  },
  {
    id: 'prd-khejur-9',
    businessId: 'bh-1',
    name: 'Dapash Date Crown',
    unit: 'Carton (10 Kg)',
    unitPrice: 3200,
    category: 'Dates (খেজুর)',
    stock: 180,
    notes: 'Original UAE Date Crown Dabbas pack'
  },
  {
    id: 'prd-khejur-10',
    businessId: 'bh-1',
    name: 'Dapash Chips',
    unit: 'Box (5 Kg)',
    unitPrice: 1750,
    category: 'Dates (খেজুর)',
    stock: 150,
    notes: 'Crispy sweet Dabbas chips cut date'
  },
  {
    id: 'prd-khejur-11',
    businessId: 'bh-1',
    name: 'Dapash',
    unit: 'Carton (10 Kg)',
    unitPrice: 2800,
    category: 'Dates (খেজুর)',
    stock: 260,
    notes: 'Standard grade Dabbas wholesale carton'
  },
  {
    id: 'prd-khejur-12',
    businessId: 'bh-1',
    name: 'Kalmi',
    unit: 'Carton (5 Kg)',
    unitPrice: 3600,
    category: 'Dates (খেজুর)',
    stock: 310,
    notes: 'Sweet chewy Kalmi/Safawi dates'
  },
  {
    id: 'prd-khejur-13',
    businessId: 'bh-1',
    name: 'Barhi',
    unit: 'Box (5 Kg)',
    unitPrice: 2400,
    category: 'Dates (খেজুর)',
    stock: 190,
    notes: 'Rich caramel flavored Barhi dates'
  },
  {
    id: 'prd-khejur-14',
    businessId: 'bh-1',
    name: 'Barhi (Rabeya)',
    unit: 'Box (5 Kg)',
    unitPrice: 2750,
    category: 'Dates (খেজুর)',
    stock: 140,
    notes: 'Special Rabeya selection Barhi batch'
  },
  {
    id: 'prd-khejur-15',
    businessId: 'bh-1',
    name: 'Barni',
    unit: 'Carton (5 Kg)',
    unitPrice: 2300,
    category: 'Dates (খেজুর)',
    stock: 160,
    notes: 'Traditional Madinah Barni dates'
  },
  {
    id: 'prd-khejur-16',
    businessId: 'bh-1',
    name: 'Jahidi',
    unit: 'Carton (10 Kg)',
    unitPrice: 2200,
    category: 'Dates (খেজুর)',
    stock: 480,
    notes: 'Semi-dry golden Iraqi Zahidi dates'
  },
  {
    id: 'prd-khejur-17',
    businessId: 'bh-1',
    name: 'Sayer',
    unit: 'Carton (10 Kg)',
    unitPrice: 2100,
    category: 'Dates (খেজুর)',
    stock: 390,
    notes: 'Iranian Sayer pitted/unpitted bulk'
  },
  {
    id: 'prd-khejur-18',
    businessId: 'bh-1',
    name: 'Nagal',
    unit: 'Carton (10 Kg)',
    unitPrice: 2600,
    category: 'Dates (খেজুর)',
    stock: 210,
    notes: 'Omani Naghal fresh season dates'
  },
  {
    id: 'prd-khejur-19',
    businessId: 'bh-1',
    name: 'Nagal Dates crown',
    unit: 'Carton (10 Kg)',
    unitPrice: 3100,
    category: 'Dates (খেজুর)',
    stock: 175,
    notes: 'Date Crown branded Nagal pack'
  },
  {
    id: 'prd-khejur-20',
    businessId: 'bh-1',
    name: 'Lulu',
    unit: 'Carton (10 Kg)',
    unitPrice: 2700,
    category: 'Dates (খেজুর)',
    stock: 230,
    notes: 'Small round dark sweet Lulu dates'
  },
  {
    id: 'prd-khejur-21',
    businessId: 'bh-1',
    name: 'Khurma',
    unit: 'Kg',
    unitPrice: 380,
    category: 'Dates (খেজুর)',
    stock: 950,
    notes: 'Standard dry khurma for wholesale'
  },
  {
    id: 'prd-khejur-22',
    businessId: 'bh-1',
    name: 'Bosta Khejur',
    unit: 'Bosta (50 Kg)',
    unitPrice: 9500,
    category: 'Dates (খেজুর)',
    stock: 85,
    notes: 'Wholesale 50kg bulk sack dates'
  },
  {
    id: 'prd-khejur-23',
    businessId: 'bh-1',
    name: 'Khurma Bosta',
    unit: 'Bosta (50 Kg)',
    unitPrice: 14500,
    category: 'Dates (খেজুর)',
    stock: 60,
    notes: 'Wholesale 50kg sack dry khurma'
  },

  // --- Apples (আপেল) Collection ---
  {
    id: 'prd-apple-1',
    businessId: 'bh-1',
    name: 'Apple (fuji)',
    unit: 'Carton (18 Kg)',
    unitPrice: 3950,
    category: 'Apple (আপেল)',
    stock: 320,
    notes: 'Crispy sweet South African/Chinese Fuji'
  },
  {
    id: 'prd-apple-2',
    businessId: 'bh-1',
    name: 'Hani + Crown apple',
    unit: 'Carton (18 Kg)',
    unitPrice: 4200,
    category: 'Apple (আপেল)',
    stock: 210,
    notes: 'Premium Honey Crown sweet export quality'
  },
  {
    id: 'prd-apple-3',
    businessId: 'bh-1',
    name: 'Royal Gala',
    unit: 'Carton (18 Kg)',
    unitPrice: 4100,
    category: 'Apple (আপেল)',
    stock: 275,
    notes: 'New Zealand / Chilean Royal Gala'
  },
  {
    id: 'prd-apple-4',
    businessId: 'bh-1',
    name: 'KaliDebi',
    unit: 'Carton (18 Kg)',
    unitPrice: 3850,
    category: 'Apple (আপেল)',
    stock: 190,
    notes: 'Famous KaliDebi fresh apple variety'
  },
  {
    id: 'prd-apple-5',
    businessId: 'bh-1',
    name: 'Hani',
    unit: 'Carton (18 Kg)',
    unitPrice: 4050,
    category: 'Apple (আপেল)',
    stock: 240,
    notes: 'Honey crisp high brix juicy apple'
  },
  {
    id: 'prd-apple-6',
    businessId: 'bh-1',
    name: 'Ast Apple',
    unit: 'Carton (18 Kg)',
    unitPrice: 3900,
    category: 'Apple (আপেল)',
    stock: 180,
    notes: 'Ast brand premium grade apple'
  },
  {
    id: 'prd-apple-7',
    businessId: 'bh-1',
    name: 'GuGu Apple',
    unit: 'Carton (18 Kg)',
    unitPrice: 3750,
    category: 'Apple (আপেল)',
    stock: 160,
    notes: 'GuGu commercial red fresh apple'
  },

  // --- Citrus & Orange (কমলা ও মাল্টা) Collection ---
  {
    id: 'prd-citrus-1',
    businessId: 'bh-1',
    name: 'Juri komola',
    unit: 'Juri (15 Kg)',
    unitPrice: 2600,
    category: 'Citrus & Orange',
    stock: 290,
    notes: 'Fresh cane basket mandarin orange'
  },
  {
    id: 'prd-citrus-2',
    businessId: 'bh-1',
    name: 'shosha komola',
    unit: 'Carton (15 Kg)',
    unitPrice: 2850,
    category: 'Citrus & Orange',
    stock: 230,
    notes: 'Special elongated sweet shosha orange'
  },
  {
    id: 'prd-citrus-3',
    businessId: 'bh-1',
    name: 'Vitor Komola',
    unit: 'Carton (15 Kg)',
    unitPrice: 2950,
    category: 'Citrus & Orange',
    stock: 210,
    notes: 'Deep orange pulp seedless mandarin'
  },
  {
    id: 'prd-citrus-4',
    businessId: 'bh-1',
    name: 'Kenu',
    unit: 'Carton (12 Kg)',
    unitPrice: 2200,
    category: 'Citrus & Orange',
    stock: 380,
    notes: 'Pakistani high-juice Kinnow mandarin'
  },
  {
    id: 'prd-citrus-5',
    businessId: 'bh-1',
    name: 'Vhutan Komola',
    unit: 'Carton (14 Kg)',
    unitPrice: 2700,
    category: 'Citrus & Orange',
    stock: 190,
    notes: 'Organic sweet mountain Bhutan orange'
  },
  {
    id: 'prd-citrus-6',
    businessId: 'bh-1',
    name: 'Dhala Komola',
    unit: 'Dala (15 Kg)',
    unitPrice: 2500,
    category: 'Citrus & Orange',
    stock: 270,
    notes: 'Fresh arrival open dala mandarin'
  },
  {
    id: 'prd-citrus-7',
    businessId: 'bh-1',
    name: 'Malta',
    unit: 'Carton (15 Kg)',
    unitPrice: 2900,
    category: 'Citrus & Orange',
    stock: 450,
    notes: 'Egyptian Valencia & South African Malta'
  },

  // --- Grapes & Pomegranate (আঙুর ও আনার) ---
  {
    id: 'prd-grapes-1',
    businessId: 'bh-1',
    name: 'LaL Angur',
    unit: 'Carton (8 Kg)',
    unitPrice: 2600,
    category: 'Grapes & Pomegranate',
    stock: 310,
    notes: 'Sweet crispy Red Globe export grapes'
  },
  {
    id: 'prd-grapes-2',
    businessId: 'bh-1',
    name: 'Sada Angur',
    unit: 'Carton (8 Kg)',
    unitPrice: 2400,
    category: 'Grapes & Pomegranate',
    stock: 290,
    notes: 'Thompson Green seedless grapes'
  },
  {
    id: 'prd-grapes-3',
    businessId: 'bh-1',
    name: 'Kala Angur',
    unit: 'Carton (8 Kg)',
    unitPrice: 2900,
    category: 'Grapes & Pomegranate',
    stock: 180,
    notes: 'Black midnight sweet seedless grapes'
  },
  {
    id: 'prd-grapes-4',
    businessId: 'bh-1',
    name: 'Anar',
    unit: 'Box (10 Kg)',
    unitPrice: 3400,
    category: 'Grapes & Pomegranate',
    stock: 220,
    notes: 'Bhagwa Indian fresh red seed pomegranate'
  },

  // --- Nuts, Dry Fruits, Oils & Specialty ---
  {
    id: 'prd-dry-1',
    businessId: 'bh-1',
    name: 'Honey mixed',
    unit: 'Jar (500g)',
    unitPrice: 750,
    category: 'Nuts & Specialty',
    stock: 340,
    notes: 'Premium natural honey with assorted nuts'
  },
  {
    id: 'prd-dry-2',
    businessId: 'bh-1',
    name: 'Mixed Fruits',
    unit: 'Box (1 Kg)',
    unitPrice: 950,
    category: 'Nuts & Specialty',
    stock: 290,
    notes: 'Assorted dried kiwi, pineapple, berries & fruits'
  },
  {
    id: 'prd-dry-3',
    businessId: 'bh-1',
    name: 'kathbadam',
    unit: 'Kg',
    unitPrice: 850,
    category: 'Nuts & Specialty',
    stock: 620,
    notes: 'California whole kernel almond'
  },
  {
    id: 'prd-dry-4',
    businessId: 'bh-1',
    name: 'Tetul',
    unit: 'Box (500g)',
    unitPrice: 320,
    category: 'Nuts & Specialty',
    stock: 410,
    notes: 'Thai sweet seedless tamarind'
  },
  {
    id: 'prd-dry-5',
    businessId: 'bh-1',
    name: 'Cheri fol',
    unit: 'Box (1 Kg)',
    unitPrice: 1250,
    category: 'Nuts & Specialty',
    stock: 180,
    notes: 'Sweetened dried red cherry fruit'
  },
  {
    id: 'prd-dry-6',
    businessId: 'bh-1',
    name: 'kismis',
    unit: 'Kg',
    unitPrice: 550,
    category: 'Nuts & Specialty',
    stock: 750,
    notes: 'Golden Afghan/Indian raisin'
  },
  {
    id: 'prd-dry-7',
    businessId: 'bh-1',
    name: 'Kaju Badam',
    unit: 'Kg',
    unitPrice: 1150,
    category: 'Nuts & Specialty',
    stock: 480,
    notes: 'Whole white W320 cashew nuts'
  },
  {
    id: 'prd-dry-8',
    businessId: 'bh-1',
    name: 'Kaju Badam Vaja',
    unit: 'Kg',
    unitPrice: 1350,
    category: 'Nuts & Specialty',
    stock: 360,
    notes: 'Oven roasted salted cashew nuts'
  },
  {
    id: 'prd-dry-9',
    businessId: 'bh-1',
    name: 'Joitun Oil',
    unit: 'Bottle (1 Liter)',
    unitPrice: 1450,
    category: 'Nuts & Specialty',
    stock: 290,
    notes: 'Extra virgin cold pressed olive oil'
  },
  {
    id: 'prd-dry-10',
    businessId: 'bh-1',
    name: 'Joitun Fruits',
    unit: 'Jar (1 Kg)',
    unitPrice: 680,
    category: 'Nuts & Specialty',
    stock: 220,
    notes: 'Natural whole Mediterranean olives'
  },

  // --- Mourin Fruits (bh-2) items ---
  {
    id: 'prd-mf-1',
    businessId: 'bh-2',
    name: 'Apple (fuji)',
    unit: 'Carton (18 Kg)',
    unitPrice: 3950,
    category: 'Apple (আপেল)',
    stock: 280,
    notes: 'Fresh refrigerated batch'
  },
  {
    id: 'prd-mf-2',
    businessId: 'bh-2',
    name: 'Ajoa',
    unit: 'Carton (5 Kg)',
    unitPrice: 5800,
    category: 'Dates (খেজুর)',
    stock: 160,
    notes: 'Ajwa Madinah VIP dates'
  },
  {
    id: 'prd-mf-3',
    businessId: 'bh-2',
    name: 'Mabrum VIP',
    unit: 'Carton (5 Kg)',
    unitPrice: 5200,
    category: 'Dates (খেজুর)',
    stock: 140,
    notes: 'Imported Mabroom'
  },
  {
    id: 'prd-mf-4',
    businessId: 'bh-2',
    name: 'Malta',
    unit: 'Carton (15 Kg)',
    unitPrice: 2900,
    category: 'Citrus & Orange',
    stock: 320,
    notes: 'Valencia sweet malta'
  },
  {
    id: 'prd-mf-5',
    businessId: 'bh-2',
    name: 'kathbadam',
    unit: 'Kg',
    unitPrice: 850,
    category: 'Nuts & Specialty',
    stock: 450,
    notes: 'Almonds'
  }
];

// Helper functions for dynamic realistic relative dates
export const getTodayIso = () => new Date().toISOString().split('T')[0];
export const getYesterdayIso = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};
export const getDaysAgoIso = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};
export const getFutureDaysIso = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const INITIAL_SALES_DUE_DATA: SaleDueRecord[] = [
  // Elenga Fruits (bh-1) - Today Records (Default Live Data)
  {
    id: 'sd-ef-today-1',
    businessId: 'bh-1',
    invoiceNo: 'INV-EF-TODAY-01',
    date: getTodayIso(),
    customerName: 'Haji Mokbul Traders',
    address: 'Kawran Bazar, Dhaka · 01712-445566',
    customerOf: 'Kawran Bazar Wholesale Cluster',
    exDue: 45000,
    productId: 'prd-citrus-7',
    productName: 'Malta',
    productUnit: 'Carton (15 Kg)',
    unitPrice: 2900,
    quantity: 50,
    amount: 145000,
    paid: 120000,
    sacrifice: 2500,
    payableDue: 187500,
    runningDue: 67500,
    duePaymentDate: getFutureDaysIso(5),
    notes: 'Morning shipment dispatched. Advance payment received.',
    status: 'Partial Due',
    createdAt: getTodayIso()
  },
  {
    id: 'sd-ef-today-2',
    businessId: 'bh-1',
    invoiceNo: 'INV-EF-TODAY-02',
    date: getTodayIso(),
    customerName: 'Bismillah Fruit Agency',
    address: 'Badamtoli, Sadarghat · 01819-332211',
    customerOf: 'Badamtoli Fruit Market',
    exDue: 80000,
    productId: 'prd-apple-1',
    productName: 'Apple (fuji)',
    productUnit: 'Carton (18 Kg)',
    unitPrice: 3950,
    quantity: 40,
    amount: 158000,
    paid: 200000,
    sacrifice: 3000,
    payableDue: 235000,
    runningDue: 35000,
    duePaymentDate: getFutureDaysIso(7),
    notes: 'Payment cleared via City Bank Instant transfer.',
    status: 'Partial Due',
    createdAt: getTodayIso()
  },
  {
    id: 'sd-ef-today-3',
    businessId: 'bh-1',
    invoiceNo: 'INV-EF-TODAY-03',
    date: getTodayIso(),
    customerName: 'Al-Madina Fruit Corner',
    address: 'Mirpur-10, Dhaka · 01911-889900',
    customerOf: 'Mirpur Retail Syndicate',
    exDue: 0,
    productId: 'prd-grapes-4',
    productName: 'Anar',
    productUnit: 'Box (10 Kg)',
    unitPrice: 3400,
    quantity: 25,
    amount: 85000,
    paid: 85000,
    sacrifice: 0,
    payableDue: 85000,
    runningDue: 0,
    duePaymentDate: getTodayIso(),
    notes: 'Spot cash transaction on loading at counter.',
    status: 'Full Paid',
    createdAt: getTodayIso()
  },
  {
    id: 'sd-ef-today-4',
    businessId: 'bh-1',
    invoiceNo: 'INV-EF-TODAY-04',
    date: getTodayIso(),
    customerName: 'Chowdhury Fruit Depot',
    address: 'Tangail Sadar · 01715-667788',
    customerOf: 'District Distribution Agent',
    exDue: 120000,
    productId: 'prd-khejur-1',
    productName: 'Ajoa',
    productUnit: 'Carton (5 Kg)',
    unitPrice: 5800,
    quantity: 20,
    amount: 116000,
    paid: 80000,
    sacrifice: 2000,
    payableDue: 234000,
    runningDue: 154000,
    duePaymentDate: getFutureDaysIso(4),
    notes: 'VIP Ajwa batch loading with Tangail truck receipt.',
    status: 'Partial Due',
    createdAt: getTodayIso()
  },
  // Yesterday and earlier records
  {
    id: 'sd-ef-1',
    businessId: 'bh-1',
    invoiceNo: 'INV-EF-2026-0801',
    date: getYesterdayIso(),
    customerName: 'Haji Mokbul Traders',
    address: 'Kawran Bazar, Dhaka · 01712-445566',
    customerOf: 'Kawran Bazar Wholesale Cluster',
    exDue: 45000,
    productId: 'prd-citrus-7',
    productName: 'Malta',
    productUnit: 'Carton (15 Kg)',
    unitPrice: 2900,
    quantity: 30,
    amount: 87000,
    paid: 87000,
    sacrifice: 0,
    payableDue: 132000,
    runningDue: 45000,
    duePaymentDate: getYesterdayIso(),
    notes: 'Yesterday evening delivery clearance.',
    status: 'Partial Due',
    createdAt: getYesterdayIso()
  },
  {
    id: 'sd-ef-2',
    businessId: 'bh-1',
    invoiceNo: 'INV-EF-2026-0802',
    date: getDaysAgoIso(3),
    customerName: 'Rahman & Sons Enterprise',
    address: 'Chawkbazar Arat, Chattogram · 01720-998877',
    customerOf: 'Chattogram Division Wholesale Association',
    exDue: 50000,
    productId: 'prd-apple-3',
    productName: 'Galafit',
    productUnit: 'Carton (18 Kg)',
    unitPrice: 4200,
    quantity: 35,
    amount: 147000,
    paid: 115000,
    sacrifice: 0,
    payableDue: 197000,
    runningDue: 82000,
    duePaymentDate: getFutureDaysIso(2),
    notes: 'Chattogram delivery consignment.',
    status: 'Partial Due',
    createdAt: getDaysAgoIso(3)
  },
  // Mourin Fruits (bh-2) - Today & Yesterday Records
  {
    id: 'sd-mf-today-1',
    businessId: 'bh-2',
    invoiceNo: 'INV-MF-TODAY-01',
    date: getTodayIso(),
    customerName: 'Khan Brothers Fruits',
    address: 'Jatrabari Arat, Dhaka · 01815-112233',
    customerOf: 'Jatrabari Wholesale',
    exDue: 60000,
    productId: 'prd-mf-1',
    productName: 'Apple (fuji)',
    productUnit: 'Carton (18 Kg)',
    unitPrice: 3950,
    quantity: 30,
    amount: 118500,
    paid: 100000,
    sacrifice: 1500,
    payableDue: 177000,
    runningDue: 77000,
    duePaymentDate: getFutureDaysIso(6),
    notes: 'Today advance booking delivery at Jatrabari.',
    status: 'Partial Due',
    createdAt: getTodayIso()
  },
  {
    id: 'sd-mf-1',
    businessId: 'bh-2',
    invoiceNo: 'INV-MF-2026-0801',
    date: getYesterdayIso(),
    customerName: 'Khan Brothers Fruits',
    address: 'Jatrabari Arat, Dhaka · 01815-112233',
    customerOf: 'Jatrabari Wholesale',
    exDue: 60000,
    productId: 'prd-mf-2',
    productName: 'Ajoa',
    productUnit: 'Carton (5 Kg)',
    unitPrice: 5800,
    quantity: 15,
    amount: 87000,
    paid: 87000,
    sacrifice: 0,
    payableDue: 147000,
    runningDue: 60000,
    duePaymentDate: getYesterdayIso(),
    notes: 'Yesterday Ajwa delivery.',
    status: 'Partial Due',
    createdAt: getYesterdayIso()
  }
];

export const INITIAL_CUSTOMERS_DATA: ManagerCustomer[] = [
  {
    id: 'cust-1',
    businessId: 'bh-1',
    name: 'Haji Mokbul Traders',
    phone: '01712-445566',
    address: 'Kawran Bazar, Block-B, Dhaka',
    reference: 'Kawran Bazar Wholesale Cluster',
    dueAmount: 67500,
    totalSales: 145000,
    totalPaid: 120000,
    lastTransactionDate: '2026-08-21',
    status: 'Active',
    notes: 'Regular wholesale party. Promise to clear next Friday.'
  },
  {
    id: 'cust-2',
    businessId: 'bh-1',
    name: 'Bismillah Fruit Agency',
    phone: '01819-332211',
    address: 'Badamtoli Ghat-4, Sadarghat, Dhaka',
    reference: 'Badamtoli Fruit Market',
    dueAmount: 35000,
    totalSales: 158000,
    totalPaid: 200000,
    lastTransactionDate: '2026-08-21',
    status: 'Active',
    notes: 'Payment received via City Bank transfer.'
  },
  {
    id: 'cust-3',
    businessId: 'bh-1',
    name: 'Al-Madina Fruit Corner',
    phone: '01911-889900',
    address: 'Mirpur-10 Main Roundabout, Dhaka',
    reference: 'Mirpur Retail Syndicate',
    dueAmount: 0,
    totalSales: 85000,
    totalPaid: 85000,
    lastTransactionDate: '2026-08-22',
    status: 'Clear',
    notes: 'Spot cash transaction on loading.'
  },
  {
    id: 'cust-4',
    businessId: 'bh-1',
    name: 'Chowdhury Fruit Depot',
    phone: '01715-667788',
    address: 'Station Road, Tangail Sadar, Tangail',
    reference: 'District Distribution Agent',
    dueAmount: 154000,
    totalSales: 116000,
    totalPaid: 80000,
    lastTransactionDate: '2026-08-20',
    status: 'Defaulter',
    notes: 'Heavy credit balance; follow-up scheduled.'
  },
  {
    id: 'cust-5',
    businessId: 'bh-1',
    name: 'Rahman & Sons Enterprise',
    phone: '01720-998877',
    address: 'Chawkbazar Arat, Chattogram',
    reference: 'Chattogram Division Wholesale Association',
    dueAmount: 82000,
    totalSales: 210000,
    totalPaid: 150000,
    lastTransactionDate: '2026-08-19',
    status: 'Active',
    notes: 'Bi-weekly date & apple supply taker.'
  },
  {
    id: 'cust-6',
    businessId: 'bh-1',
    name: 'Sonar Bangla Fruit Centre',
    phone: '01688-443322',
    address: 'Shibbari More, Gazipur Chowrasta',
    reference: 'Gazipur Local Retail Chain',
    dueAmount: 48000,
    totalSales: 95000,
    totalPaid: 50000,
    lastTransactionDate: '2026-08-18',
    status: 'Active',
    notes: 'Weekly orange & malta delivery point.'
  },
  {
    id: 'cust-7',
    businessId: 'bh-1',
    name: 'Shah Amanat Fruit Store',
    phone: '01844-556677',
    address: 'Khatungonj Commercial Area, Chattogram',
    reference: 'Khatungonj Merchants Guild',
    dueAmount: 0,
    totalSales: 320000,
    totalPaid: 320000,
    lastTransactionDate: '2026-08-17',
    status: 'Clear',
    notes: 'Ajoa & Mabrum bulk buyer. Always 100% advance or spot clear.'
  },
  {
    id: 'cust-8',
    businessId: 'bh-1',
    name: 'Mayer Doa Banijjaloy',
    phone: '01923-114455',
    address: 'Shaheb Bazar, Rajshahi',
    reference: 'Rajshahi Fruit Federation',
    dueAmount: 96000,
    totalSales: 180000,
    totalPaid: 90000,
    lastTransactionDate: '2026-08-16',
    status: 'Active',
    notes: 'Regular credit line approved by Regional In-charge.'
  },
  // Mourin Fruits (bh-2)
  {
    id: 'cust-mf-1',
    businessId: 'bh-2',
    name: 'Khan Brothers Fruits',
    phone: '01815-112233',
    address: 'Jatrabari Arat, Dhaka',
    reference: 'Jatrabari Wholesale',
    dueAmount: 77000,
    totalSales: 118500,
    totalPaid: 100000,
    lastTransactionDate: '2026-08-21',
    status: 'Active',
    notes: 'Advance booking delivery'
  }
];

