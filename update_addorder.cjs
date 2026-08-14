const fs = require('fs');

let code = fs.readFileSync('src/hooks/useCatalog.ts', 'utf8');

const target = `const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: uid(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };`;

const replacement = `const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };`;

code = code.replace(target, replacement);

fs.writeFileSync('src/hooks/useCatalog.ts', code);
