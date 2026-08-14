const fs = require('fs');

// 1. Update App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

appCode = appCode.replace(
  "if (currentView !== 'catalog' && e.target.value) setCurrentView('catalog');",
  "if (!['catalog', 'orders', 'customers', 'users'].includes(currentView) && e.target.value) setCurrentView('catalog');"
);

appCode = appCode.replace(
  "{currentView === 'orders' && <Orders catalog={catalog} />}",
  "{currentView === 'orders' && <Orders catalog={catalog} searchQuery={searchQuery} />}"
);

appCode = appCode.replace(
  "{currentView === 'customers' && <Customers catalog={catalog} />}",
  "{currentView === 'customers' && <Customers catalog={catalog} searchQuery={searchQuery} />}"
);

fs.writeFileSync('src/App.tsx', appCode);

// 2. Update Orders.tsx
let ordersCode = fs.readFileSync('src/components/Orders.tsx', 'utf8');

ordersCode = ordersCode.replace(
  "export default function Orders({ catalog }: { catalog: any }) {",
  "export default function Orders({ catalog, searchQuery = '' }: { catalog: any, searchQuery?: string }) {"
);

ordersCode = ordersCode.replace(
  "  const [searchQuery, setSearchQuery] = useState('');\n",
  ""
);

fs.writeFileSync('src/components/Orders.tsx', ordersCode);

// 3. Update Customers.tsx
let customersCode = fs.readFileSync('src/components/Customers.tsx', 'utf8');

customersCode = customersCode.replace(
  "export default function Customers({ catalog }: { catalog: any }) {",
  "export default function Customers({ catalog, searchQuery = '' }: { catalog: any, searchQuery?: string }) {"
);

customersCode = customersCode.replace(
  "  const [search, setSearch] = useState('');\n",
  ""
);

customersCode = customersCode.replace(
  /c\.name\.toLowerCase\(\)\.includes\(search\.toLowerCase\(\)\)/g,
  "c.name.toLowerCase().includes(searchQuery.toLowerCase())"
);
customersCode = customersCode.replace(
  /c\.email\.toLowerCase\(\)\.includes\(search\.toLowerCase\(\)\)/g,
  "c.email.toLowerCase().includes(searchQuery.toLowerCase())"
);
customersCode = customersCode.replace(
  /c\.id\.toLowerCase\(\)\.includes\(search\.toLowerCase\(\)\)/g,
  "c.id.toLowerCase().includes(searchQuery.toLowerCase())"
);

customersCode = customersCode.replace(
  /<input[^>]*value=\{search\}[^>]*onChange=\{e => setSearch\(e\.target\.value\)\}[^>]*\/>/g,
  ""
); // wait, Customers.tsx has a local search bar that I should keep maybe?
// If I remove it, I should just hide it, but wait, if it uses global search, I don't need local.

fs.writeFileSync('src/components/Customers.tsx', customersCode);

