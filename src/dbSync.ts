import { db } from './firebase';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { Product, Order, Customer, User, Category, StoreSettings, CatalogData } from './types';

// Load all data from Firestore
export const loadFromDb = async (): Promise<CatalogData | null> => {
  try {
    const configSnap = await getDoc(doc(db, 'store', 'config'));
    if (!configSnap.exists()) return null;

    const data = configSnap.data();
    
    // Fetch collections
    const productsSnap = await getDocs(collection(db, 'products'));
    const ordersSnap = await getDocs(collection(db, 'orders'));
    const customersSnap = await getDocs(collection(db, 'customers'));
    const usersSnap = await getDocs(collection(db, 'users'));

    const products = productsSnap.docs.map(d => d.data() as Product);
    const orders = ordersSnap.docs.map(d => d.data() as Order);
    const customers = customersSnap.docs.map(d => d.data() as Customer);
    const users = usersSnap.docs.map(d => d.data() as User);

    // Re-assemble categories with products
    const categories: Category[] = data.categories || [];
    
    categories.forEach(cat => {
      cat.subcategories?.forEach(sub => {
        sub.models?.forEach(mod => {
          mod.submodels?.forEach(submod => {
            // Find products for this submodel
            submod.products = products.filter(p => p.submodelId === submod.id);
          });
        });
      });
    });

    return {
      categories,
      orders,
      customers,
      users,
      storeSettings: data.storeSettings
    };
  } catch (err) {
    console.error("Error loading from DB:", err);
    return null;
  }
};

// Save a product
export const saveProductToDb = async (product: Product, categoryId: string, subcategoryId: string, modelId: string, submodelId: string) => {
  const p = { ...product, categoryId, subcategoryId, modelId, submodelId };
  await setDoc(doc(db, 'products', p.id), p);
};

export const deleteProductFromDb = async (productId: string) => {
  await deleteDoc(doc(db, 'products', productId));
};

// Save structural data (Categories tree without products)
export const saveCategoriesToDb = async (categories: Category[], settings?: StoreSettings) => {
  // Deep clone and strip products to save space
  const cleanCategories = categories.map(cat => ({
    ...cat,
    subcategories: cat.subcategories?.map(sub => ({
      ...sub,
      models: sub.models?.map(mod => ({
        ...mod,
        submodels: mod.submodels?.map(submod => ({
          ...submod,
          products: [] // Strip products before saving structural tree!
        }))
      }))
    }))
  }));
  
  await setDoc(doc(db, 'store', 'config'), { 
    categories: cleanCategories,
    storeSettings: settings || null
  }, { merge: true });
};

// Orders
export const saveOrderToDb = async (order: Order) => {
  await setDoc(doc(db, 'orders', order.id), order);
};
export const deleteOrderFromDb = async (orderId: string) => {
  await deleteDoc(doc(db, 'orders', orderId));
};

// Customers
export const saveCustomerToDb = async (customer: Customer) => {
  await setDoc(doc(db, 'customers', customer.id), customer);
};
export const deleteCustomerFromDb = async (customerId: string) => {
  await deleteDoc(doc(db, 'customers', customerId));
};

// Users
export const saveUserToDb = async (user: User) => {
  await setDoc(doc(db, 'users', user.id), user);
};
export const deleteUserFromDb = async (userId: string) => {
  await deleteDoc(doc(db, 'users', userId));
};

// Massive Sync (for demo load)
export const massiveSyncToDb = async (data: CatalogData) => {
  await saveCategoriesToDb(data.categories, data.storeSettings);
  
  // Note: Firestore batch has a 500 limit. For demo data, it's fine.
  // For 7500 real products, this would need chunks.
  const allProducts = data.categories.flatMap(c => 
    c.subcategories.flatMap(s => 
      s.models.flatMap(m => 
        m.submodels.flatMap(sm => 
          sm.products.map(p => ({ ...p, categoryId: c.id, subcategoryId: s.id, modelId: m.id, submodelId: sm.id }))
        )
      )
    )
  );
  
  // We will just do standard sets for demo
  for(const p of allProducts) {
    await setDoc(doc(db, 'products', p.id), p);
  }
  for(const o of data.orders) { await saveOrderToDb(o); }
  for(const c of data.customers) { await saveCustomerToDb(c); }
  for(const u of data.users) { await saveUserToDb(u); }
};
