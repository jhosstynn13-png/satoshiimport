const fs = require('fs');
let code = fs.readFileSync('src/components/StoreSettings.tsx', 'utf8');

const target = `              <button 
                onClick={() => setEditSettings({
                  ...editSettings, 
                  clientLoginEnabled: editSettings.clientLoginEnabled !== false
                })}`;

const replacement = `              <button 
                onClick={() => setEditSettings({
                  ...editSettings, 
                  clientLoginEnabled: editSettings.clientLoginEnabled === false
                })}`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/StoreSettings.tsx', code);
