const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  if (val) {
                    if (val.toUpperCase().startsWith('ORD-')) {
                      setCurrentView('orders');
                    } else if (!['catalog', 'orders', 'customers', 'users'].includes(currentView)) {
                      setCurrentView('catalog');
                    }
                  }
                }}`;

const replacement = `                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  if (val) {
                    const upperVal = val.toUpperCase();
                    if (upperVal.startsWith('ORD-')) {
                      setCurrentView('orders');
                      return;
                    }
                    
                    const isCatalogMatch = catalog.allProducts?.some(p => p.name.toUpperCase().includes(upperVal) || p.sku.toUpperCase().includes(upperVal));
                    const isCustomerMatch = catalog.data.customers?.some(c => c.name.toUpperCase().includes(upperVal) || c.email.toUpperCase().includes(upperVal));
                    const isOrderMatch = catalog.data.orders?.some(o => o.customerName.toUpperCase().includes(upperVal) || o.id.toUpperCase().includes(upperVal));
                    
                    if (currentView === 'catalog' && isCatalogMatch) return;
                    if (currentView === 'customers' && isCustomerMatch) return;
                    if (currentView === 'orders' && isOrderMatch) return;
                    
                    if (isCatalogMatch) setCurrentView('catalog');
                    else if (isCustomerMatch) setCurrentView('customers');
                    else if (isOrderMatch) setCurrentView('orders');
                    else if (!['catalog', 'orders', 'customers', 'users'].includes(currentView)) {
                      setCurrentView('catalog');
                    }
                  }
                }}`;

appCode = appCode.replace(target, replacement);
fs.writeFileSync('src/App.tsx', appCode);
