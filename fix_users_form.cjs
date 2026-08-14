const fs = require('fs');
let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

// 1. Fix validation to only require email
code = code.replace(
  `if (!form.firstName || !form.lastName || !form.email || !form.dni) return;`,
  `if (!form.email) return;`
);

// We need to set a default name if they are empty
code = code.replace(
  `name: \`\${form.firstName} \${form.lastName}\`.toUpperCase(),`,
  `name: \`\${form.firstName || form.email.split('@')[0]} \${form.lastName}\`.trim().toUpperCase(),`
);
code = code.replace(
  `name: \`\${form.firstName} \${form.lastName}\`.toUpperCase(),`, // for addUser
  `name: \`\${form.firstName || form.email.split('@')[0]} \${form.lastName}\`.trim().toUpperCase(),`
);

// 2. Remove the old form block. It starts at `           {/* Add User Form */}`
// and ends right before `        {/* Users List */}`. Wait, let me check what it says exactly.

const startOldForm = `           {/* Add User Form */}`;
const endOldForm = `        {/* Users List */}`;

const regexOldForm = new RegExp(startOldForm.replace(/[.*+?^$\{}()|[\]\\]/g, '\\$&') + '.*?' + endOldForm.replace(/[.*+?^$\{}()|[\]\\]/g, '\\$&'), 's');

code = code.replace(regexOldForm, `        {/* Users List */}`);


// 3. Remove 'required' from inputs in the modal, except for email
// Wait, I can just do standard string replaces on the modal fields.
const firstNameInput = `<input 
                       type="text" 
                       placeholder="NOMBRE"
                       required
                       value={form.firstName}`;
const firstNameInputNew = `<input 
                       type="text" 
                       placeholder="NOMBRE (OPCIONAL)"
                       value={form.firstName}`;
code = code.replace(firstNameInput, firstNameInputNew);

const lastNameInput = `<input 
                       type="text" 
                       placeholder="APELLIDO"
                       required
                       value={form.lastName}`;
const lastNameInputNew = `<input 
                       type="text" 
                       placeholder="APELLIDO (OPCIONAL)"
                       value={form.lastName}`;
code = code.replace(lastNameInput, lastNameInputNew);

const dniInput = `<input 
                       type="text" 
                       placeholder="DNI"
                       required
                       value={form.dni}`;
const dniInputNew = `<input 
                       type="text" 
                       placeholder="DNI (OPCIONAL)"
                       value={form.dni}`;
code = code.replace(dniInput, dniInputNew);

const phoneInput = `<input 
                       type="text" 
                       placeholder="CELULAR"
                       value={form.phone}`;
const phoneInputNew = `<input 
                       type="text" 
                       placeholder="CELULAR (OPCIONAL)"
                       value={form.phone}`;
code = code.replace(phoneInput, phoneInputNew);

fs.writeFileSync('src/components/Users.tsx', code);
