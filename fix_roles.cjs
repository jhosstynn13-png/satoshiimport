const fs = require('fs');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const { searchValue, replaceValue } of replacements) {
        content = content.split(searchValue).join(replaceValue);
    }
    fs.writeFileSync(filePath, content);
}

replaceInFile('src/components/public/PublicLayout.tsx', [
    { searchValue: "const isAdmin = currentUser?.role === 'admin';", replaceValue: "const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';" }
]);

replaceInFile('src/components/Orders.tsx', [
    { searchValue: "const isAdmin = currentUser?.role === 'admin';", replaceValue: "const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';" }
]);

replaceInFile('src/components/Catalog.tsx', [
    { searchValue: "const isStaff = currentUser?.role === 'admin';", replaceValue: "const isStaff = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';" },
    { searchValue: "const isAdmin = currentUser?.role === 'admin';", replaceValue: "const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';" }
]);

replaceInFile('src/components/public/UserProfile.tsx', [
    { searchValue: "currentUser.role === 'admin' ? 'Administrador'", replaceValue: "currentUser.role === 'admin' || currentUser.role === 'superadmin' ? 'Administrador'" }
]);

replaceInFile('src/hooks/useCatalog.ts', [
    { searchValue: "users: prev.users.filter(u => u.role === 'admin')", replaceValue: "users: prev.users.filter(u => u.role === 'admin' || u.role === 'superadmin')" }
]);

console.log('Roles fixed in files');
