const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

// 1. Add imports
const imports = `
import { 
  loadFromDb, 
  saveProductToDb, 
  deleteProductFromDb, 
  saveCategoriesToDb, 
  saveOrderToDb, 
  deleteOrderFromDb, 
  saveCustomerToDb, 
  deleteCustomerFromDb, 
  saveUserToDb, 
  deleteUserFromDb,
  massiveSyncToDb 
} from '../dbSync';
`;
code = code.replace("import localforage from 'localforage';", "import localforage from 'localforage';\n" + imports);

// 2. Initial load effect
const initLoad = `
  useEffect(() => {
    const initDb = async () => {
      addLog('Conectando a Firebase Cloud (Firestore)...', 'process');
      const dbData = await loadFromDb();
      if (dbData) {
        // Sync memory with cloud
        setData(dbData);
        addLog('Base de datos sincronizada desde la nube.', 'success');
      } else {
        addLog('No se encontraron datos en la nube. Usando estado local.', 'warn');
        // If local data exists, sync it up
        if (data.categories.length > 0) {
           massiveSyncToDb(data).catch(console.error);
        }
      }
    };
    initDb();
  }, []);
`;
code = code.replace("useEffect(() => {\n    addLog('SATOSHIMPORT v1.0: Conexión con inventario establecida.', 'success');\n  }, []);", initLoad);

// 3. Inject into addProduct
code = code.replace(
  "const addProduct = (submodelId: string, productData: Omit<Product, 'id' | 'createdAt'>) => {",
  "const addProduct = async (submodelId: string, productData: Omit<Product, 'id' | 'createdAt'>) => {"
);
code = code.replace(
  "_setData(newData);\n    addLog",
  `_setData(newData);\n    await saveProductToDb(newProduct, cat.id, sub.id, model.id, submodel.id);\n    addLog`
);

// 4. Inject into updateProduct
code = code.replace(
  "const updateProduct = (productId: string, productData: Partial<Product>) => {",
  "const updateProduct = async (productId: string, productData: Partial<Product>) => {"
);
code = code.replace(
  "_setData(newData);\n            addLog",
  `_setData(newData);\n            await saveProductToDb({ ...p, ...productData } as Product, cat.id, sub.id, model.id, submodel.id);\n            addLog`
);

// 5. Inject into deleteProduct
code = code.replace(
  "const deleteProduct = (productId: string) => {",
  "const deleteProduct = async (productId: string) => {"
);
code = code.replace(
  "_setData(newData);\n            addLog",
  `_setData(newData);\n            await deleteProductFromDb(productId);\n            addLog`
);

// 6. Orders
code = code.replace("const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {", "const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {");
code = code.replace("data.orders.push(newOrder);\n    _setData(newData);", "data.orders.push(newOrder);\n    _setData(newData);\n    await saveOrderToDb(newOrder);");

code = code.replace("const updateOrder = (orderId: string, updates: Partial<Order>) => {", "const updateOrder = async (orderId: string, updates: Partial<Order>) => {");
code = code.replace("Object.assign(order, { ...updates, updatedAt: Date.now() });\n      _setData(newData);", "Object.assign(order, { ...updates, updatedAt: Date.now() });\n      _setData(newData);\n      await saveOrderToDb(order);");

code = code.replace("const deleteOrder = (orderId: string) => {", "const deleteOrder = async (orderId: string) => {");
code = code.replace("newData.orders = newData.orders.filter(o => o.id !== orderId);\n    _setData(newData);", "newData.orders = newData.orders.filter(o => o.id !== orderId);\n    _setData(newData);\n    await deleteOrderFromDb(orderId);");

// 7. Customers
code = code.replace("const updateCustomer = (customerId: string, updates: Partial<Customer>) => {", "const updateCustomer = async (customerId: string, updates: Partial<Customer>) => {");
code = code.replace("Object.assign(customer, updates);\n      _setData(newData);", "Object.assign(customer, updates);\n      _setData(newData);\n      await saveCustomerToDb(customer);");

code = code.replace("const deleteCustomer = (customerId: string) => {", "const deleteCustomer = async (customerId: string) => {");
code = code.replace("newData.customers = newData.customers.filter(c => c.id !== customerId);\n    _setData(newData);", "newData.customers = newData.customers.filter(c => c.id !== customerId);\n    _setData(newData);\n    await deleteCustomerFromDb(customerId);");

// 8. Users
code = code.replace("const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {", "const addUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {");
code = code.replace("newData.users.push(newUser);\n    _setData(newData);", "newData.users.push(newUser);\n    _setData(newData);\n    await saveUserToDb(newUser);");

code = code.replace("const updateUser = (userId: string, updates: Partial<User>) => {", "const updateUser = async (userId: string, updates: Partial<User>) => {");
code = code.replace("Object.assign(user, updates);\n      _setData(newData);", "Object.assign(user, updates);\n      _setData(newData);\n      await saveUserToDb(user);");

code = code.replace("const deleteUser = (userId: string) => {", "const deleteUser = async (userId: string) => {");
code = code.replace("newData.users = newData.users.filter(u => u.id !== userId);\n    _setData(newData);", "newData.users = newData.users.filter(u => u.id !== userId);\n    _setData(newData);\n    await deleteUserFromDb(userId);");

// 9. structural sync on category modifications
// Create a wrapper for category structural sync
const structuralSync = `\n    saveCategoriesToDb(newData.categories, newData.storeSettings).catch(console.error);`;

code = code.replace(/_setData\(newData\);\s+addLog\(`Categoría agregada/g, "_setData(newData);" + structuralSync + "\n    addLog(`Categoría agregada");
code = code.replace(/_setData\(newData\);\s+addLog\(`Categoría eliminada/g, "_setData(newData);" + structuralSync + "\n    addLog(`Categoría eliminada");
code = code.replace(/_setData\(newData\);\s+addLog\(`Subcategoría agregada/g, "_setData(newData);" + structuralSync + "\n    addLog(`Subcategoría agregada");
code = code.replace(/_setData\(newData\);\s+addLog\(`Subcategoría eliminada/g, "_setData(newData);" + structuralSync + "\n    addLog(`Subcategoría eliminada");
code = code.replace(/_setData\(newData\);\s+addLog\(`Modelo agregado/g, "_setData(newData);" + structuralSync + "\n    addLog(`Modelo agregado");
code = code.replace(/_setData\(newData\);\s+addLog\(`Modelo eliminado/g, "_setData(newData);" + structuralSync + "\n    addLog(`Modelo eliminado");
code = code.replace(/_setData\(newData\);\s+addLog\(`Sub-modelo agregado/g, "_setData(newData);" + structuralSync + "\n    addLog(`Sub-modelo agregado");
code = code.replace(/_setData\(newData\);\s+addLog\(`Sub-modelo eliminado/g, "_setData(newData);" + structuralSync + "\n    addLog(`Sub-modelo eliminado");

code = code.replace(
  "const updateStoreSettings = (newSettings: any) => {",
  "const updateStoreSettings = async (newSettings: any) => {"
);
code = code.replace(
  "addLog('Ajustes globales actualizados exitosamente.', 'success');",
  "saveCategoriesToDb(data.categories, newSettings).catch(console.error);\n    addLog('Ajustes globales actualizados exitosamente.', 'success');"
);

// 10. Fix addProductsBulk
code = code.replace(
  "const addProductsBulk = (submodelId: string, products: Omit<Product, 'id' | 'createdAt'>[]) => {",
  "const addProductsBulk = async (submodelId: string, products: Omit<Product, 'id' | 'createdAt'>[]) => {"
);
code = code.replace(
  "submodel.products.push(...newProducts);\n            _setData(newData);\n            addLog(`Bulk: ${products.length} productos agregados`, 'success');",
  "submodel.products.push(...newProducts);\n            _setData(newData);\n            // Save each to DB\n            await Promise.all(newProducts.map(p => saveProductToDb(p, cat.id, sub.id, model.id, submodel.id)));\n            addLog(`Bulk: ${products.length} productos agregados`, 'success');"
);

// 11. Fix loadMassiveDemo
code = code.replace(
  "const loadMassiveDemo = () => {",
  "const loadMassiveDemo = async () => {"
);
code = code.replace(
  "localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));\n      addLog('Carga masiva completada",
  "localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));\n      await massiveSyncToDb(demoData);\n      addLog('Carga masiva completada"
);


fs.writeFileSync('src/hooks/useCatalog.ts', code);
