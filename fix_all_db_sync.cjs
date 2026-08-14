const fs = require('fs');
let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

// The best way to sync is to use a useEffect that listens to 'data' and syncs it entirely?
// NO, that would write the whole 7500 products every time we change one thing.
// We must patch the individual functions.

// Let's replace the whole file with a correctly patched version! Wait, it's 1000 lines.
// I will patch them by matching the start of the function and injecting the DB call inside.

code = code.replace(
  /const addUser = async \(userData.*?\{([\s\S]*?)setData\(prev => \(\{/s,
  (match, inner) => match.replace('setData(prev => ({', `saveUserToDb(newUser).catch(console.error);\n    setData(prev => ({`)
);

code = code.replace(
  /const updateUser = \(userId: string, update: Partial<User>\) => \{[\s\S]*?setData\(prev => \(\{/s,
  (match) => match.replace('setData(prev => ({', `
    const user = data.users.find(u => u.id === userId);
    if(user) saveUserToDb({...user, ...update}).catch(console.error);
    setData(prev => ({`)
);

code = code.replace(
  /const deleteUser = \(userId: string\) => \{[\s\S]*?setData\(prev => \(\{/s,
  (match) => match.replace('setData(prev => ({', `deleteUserFromDb(userId).catch(console.error);\n    setData(prev => ({`)
);

// Products
code = code.replace(
  /const addProduct = async \(submodelId: string, productData: Omit<Product, 'id' | 'createdAt'>\) => \{([\s\S]*?)setData\(prev => \(\{/s,
  (match, inner) => {
    return match.replace('setData(prev => ({', `
    const cat = data.categories.find(c => c.subcategories.some(s => s.models.some(m => m.submodels.some(sm => sm.id === submodelId))));
    const sub = cat?.subcategories.find(s => s.models.some(m => m.submodels.some(sm => sm.id === submodelId)));
    const mod = sub?.models.find(m => m.submodels.some(sm => sm.id === submodelId));
    if(cat && sub && mod) {
       saveProductToDb(newProduct, cat.id, sub.id, mod.id, submodelId).catch(console.error);
    }
    setData(prev => ({`);
  }
);

code = code.replace(
  /const addProductsBulk = \(submodelId: string, productsData: Omit<Product, 'id' | 'createdAt'>\[\]\) => \{([\s\S]*?)setData\(prev => \(\{/s,
  (match, inner) => {
    return match.replace('setData(prev => ({', `
    const cat = data.categories.find(c => c.subcategories.some(s => s.models.some(m => m.submodels.some(sm => sm.id === submodelId))));
    const sub = cat?.subcategories.find(s => s.models.some(m => m.submodels.some(sm => sm.id === submodelId)));
    const mod = sub?.models.find(m => m.submodels.some(sm => sm.id === submodelId));
    if(cat && sub && mod) {
       Promise.all(newProducts.map(p => saveProductToDb(p, cat.id, sub.id, mod.id, submodelId))).catch(console.error);
    }
    setData(prev => ({`);
  }
);

code = code.replace(
  /const updateProduct = \(productId: string, update: Partial<Product>\) => \{([\s\S]*?)setData\(prev => \(\{/s,
  (match, inner) => {
    return match.replace('setData(prev => ({', `
    // Find the product to get its hierarchy
    let foundProduct, fCatId, fSubId, fModId, fSubmodId;
    data.categories.forEach(c => c.subcategories.forEach(s => s.models.forEach(m => m.submodels.forEach(sm => {
      const p = sm.products.find(p => p.id === productId);
      if(p) { foundProduct = p; fCatId = c.id; fSubId = s.id; fModId = m.id; fSubmodId = sm.id; }
    }))));
    if(foundProduct) {
       saveProductToDb({...foundProduct, ...update}, fCatId, fSubId, fModId, fSubmodId).catch(console.error);
    }
    setData(prev => ({`);
  }
);

code = code.replace(
  /const deleteProduct = \(productId: string\) => \{([\s\S]*?)setData\(prev => \(\{/s,
  (match, inner) => match.replace('setData(prev => ({', `deleteProductFromDb(productId).catch(console.error);\n    setData(prev => ({`)
);

// Orders
code = code.replace(
  /const addOrder = \(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>\) => \{([\s\S]*?)setData\(prev => \(\{/s,
  (match, inner) => match.replace('setData(prev => ({', `saveOrderToDb(newOrder).catch(console.error);\n    setData(prev => ({`)
);

code = code.replace(
  /const updateOrder = \(orderId: string, update: Partial<Order>\) => \{([\s\S]*?)setData\(prev => \(\{/s,
  (match, inner) => match.replace('setData(prev => ({', `
    const order = data.orders.find(o => o.id === orderId);
    if(order) saveOrderToDb({...order, ...update, updatedAt: Date.now()}).catch(console.error);
    setData(prev => ({`)
);

code = code.replace(
  /const deleteOrder = \(orderId: string\) => \{([\s\S]*?)setData\(prev => \(\{/s,
  (match, inner) => match.replace('setData(prev => ({', `deleteOrderFromDb(orderId).catch(console.error);\n    setData(prev => ({`)
);

// Customers
code = code.replace(
  /const updateCustomer = \(customerId: string, update: Partial<Customer>\) => \{([\s\S]*?)setData\(prev => \(\{/s,
  (match, inner) => match.replace('setData(prev => ({', `
    const customer = data.customers.find(c => c.id === customerId);
    if(customer) saveCustomerToDb({...customer, ...update}).catch(console.error);
    setData(prev => ({`)
);

code = code.replace(
  /const deleteCustomer = \(customerId: string\) => \{([\s\S]*?)setData\(prev => \(\{/s,
  (match, inner) => match.replace('setData(prev => ({', `deleteCustomerFromDb(customerId).catch(console.error);\n    setData(prev => ({`)
);

fs.writeFileSync('src/hooks/useCatalog.ts', code);
