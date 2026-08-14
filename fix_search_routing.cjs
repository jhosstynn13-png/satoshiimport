const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!['catalog', 'orders', 'customers', 'users'].includes(currentView) && e.target.value) setCurrentView('catalog');
                }}`;

const replacement = `                onChange={(e) => {
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

appCode = appCode.replace(target, replacement);
fs.writeFileSync('src/App.tsx', appCode);
