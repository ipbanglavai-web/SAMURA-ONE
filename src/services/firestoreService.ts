import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SaleDueRecord, UnitProduct, ManagerCustomer } from '../types';
import {
  INITIAL_SALES_DUE_DATA,
  INITIAL_PRODUCTS_DATA,
  INITIAL_CUSTOMERS_DATA
} from '../data/mockData';

const SALES_COLLECTION = 'salesDueRecords';
const PRODUCTS_COLLECTION = 'managerProducts';
const CUSTOMERS_COLLECTION = 'managerCustomers';

// Seed initial dataset if Firestore collection is empty
export async function seedInitialFirestoreData() {
  try {
    const salesSnap = await getDocs(collection(db, SALES_COLLECTION));
    if (salesSnap.empty) {
      console.log('Seeding initial sales records into Firestore...');
      const batch = writeBatch(db);
      INITIAL_SALES_DUE_DATA.forEach((record) => {
        const ref = doc(db, SALES_COLLECTION, record.id);
        batch.set(ref, record);
      });
      await batch.commit();
    }

    const prodSnap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (prodSnap.empty) {
      console.log('Seeding initial products into Firestore...');
      const batch = writeBatch(db);
      INITIAL_PRODUCTS_DATA.forEach((prod) => {
        const ref = doc(db, PRODUCTS_COLLECTION, prod.id);
        batch.set(ref, prod);
      });
      await batch.commit();
    }

    const custSnap = await getDocs(collection(db, CUSTOMERS_COLLECTION));
    if (custSnap.empty) {
      console.log('Seeding initial customers into Firestore...');
      const batch = writeBatch(db);
      INITIAL_CUSTOMERS_DATA.forEach((cust) => {
        const ref = doc(db, CUSTOMERS_COLLECTION, cust.id);
        batch.set(ref, cust);
      });
      await batch.commit();
    }
  } catch (err) {
    console.warn('Firestore seed warning (offline or permissions):', err);
  }
}

// ---------------- Realtime Subscriptions ----------------

export function subscribeToSalesRecords(
  callback: (records: SaleDueRecord[]) => void
) {
  const q = query(collection(db, SALES_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const records: SaleDueRecord[] = [];
      snapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() } as SaleDueRecord);
      });
      if (records.length > 0) {
        callback(records);
      }
    },
    (error) => {
      console.warn('Sales Firestore listener error:', error);
    }
  );
}

export function subscribeToProducts(
  callback: (products: UnitProduct[]) => void
) {
  const q = query(collection(db, PRODUCTS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const products: UnitProduct[] = [];
      snapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as UnitProduct);
      });
      if (products.length > 0) {
        callback(products);
      }
    },
    (error) => {
      console.warn('Products Firestore listener error:', error);
    }
  );
}

export function subscribeToCustomers(
  callback: (customers: ManagerCustomer[]) => void
) {
  const q = query(collection(db, CUSTOMERS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const customers: ManagerCustomer[] = [];
      snapshot.forEach((doc) => {
        customers.push({ id: doc.id, ...doc.data() } as ManagerCustomer);
      });
      if (customers.length > 0) {
        callback(customers);
      }
    },
    (error) => {
      console.warn('Customers Firestore listener error:', error);
    }
  );
}

// ---------------- Sales Records CRUD ----------------

export async function saveSaleRecordToFirestore(record: SaleDueRecord) {
  const ref = doc(db, SALES_COLLECTION, record.id);
  await setDoc(ref, record, { merge: true });
}

export async function deleteSaleRecordFromFirestore(recordId: string) {
  const ref = doc(db, SALES_COLLECTION, recordId);
  await deleteDoc(ref);
}

export async function updateSalePaymentInFirestore(
  recordId: string,
  updatedData: Partial<SaleDueRecord>
) {
  const ref = doc(db, SALES_COLLECTION, recordId);
  await updateDoc(ref, updatedData);
}

// ---------------- Products CRUD ----------------

export async function saveProductToFirestore(product: UnitProduct) {
  const ref = doc(db, PRODUCTS_COLLECTION, product.id);
  await setDoc(ref, product, { merge: true });
}

export async function deleteProductFromFirestore(productId: string) {
  const ref = doc(db, PRODUCTS_COLLECTION, productId);
  await deleteDoc(ref);
}

// ---------------- Customers CRUD ----------------

export async function saveCustomerToFirestore(customer: ManagerCustomer) {
  const ref = doc(db, CUSTOMERS_COLLECTION, customer.id);
  await setDoc(ref, customer, { merge: true });
}

export async function deleteCustomerFromFirestore(customerId: string) {
  const ref = doc(db, CUSTOMERS_COLLECTION, customerId);
  await deleteDoc(ref);
}

export async function updateCustomerDueInFirestore(
  customerId: string,
  newDueAmount: number,
  additionalSales: number = 0,
  additionalPaid: number = 0,
  lastDate?: string
) {
  const ref = doc(db, CUSTOMERS_COLLECTION, customerId);
  const dataToUpdate: any = {
    dueAmount: newDueAmount
  };
  if (lastDate) dataToUpdate.lastTransactionDate = lastDate;
  await updateDoc(ref, dataToUpdate);
}
