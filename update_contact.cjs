const fs = require('fs');
let code = fs.readFileSync('src/components/public/PublicContact.tsx', 'utf8');

code = code.replace("import React from 'react';", "import React, { useState } from 'react';");
code = code.replace("export default function PublicContact() {", "export default function PublicContact({ catalog }: { catalog?: any }) {\n  const [nombre, setNombre] = useState('');\n  const [apellidos, setApellidos] = useState('');\n  const [departamento, setDepartamento] = useState('');\n  const [mensaje, setMensaje] = useState('');\n  const [isSubmitting, setIsSubmitting] = useState(false);\n\n  const isGuest = !catalog?.currentUser || catalog.currentUser.id === 'guest';\n\n  const handleSubmit = (e: React.FormEvent) => {\n    e.preventDefault();\n    if (isGuest) {\n      if (catalog?.onShowAuth) catalog.onShowAuth();\n      return;\n    }\n    \n    if (!nombre || !apellidos || !mensaje) {\n      alert('Por favor completa los campos requeridos.');\n      return;\n    }\n\n    const subject = encodeURIComponent(`Atención Personalizada: ${nombre} ${apellidos}`);\n    const body = encodeURIComponent(\n      `Nombre: ${nombre} ${apellidos}\\n` +\n      `Departamento: ${departamento}\\n\\n` +\n      `Mensaje:\\n${mensaje}`\n    );\n    \n    window.location.href = `mailto:IMPORTSATOSHI@HOTMAIL.COM?subject=${subject}&body=${body}`;\n    \n    // Limpiar formulario tras unos segundos si se desea\n    setNombre('');\n    setApellidos('');\n    setDepartamento('');\n    setMensaje('');\n  };\n");

code = code.replace(
  '<form className="flex flex-col gap-4 relative z-10" onSubmit={(e) => e.preventDefault()}>',
  '<form className="flex flex-col gap-4 relative z-10" onSubmit={handleSubmit}>'
);

code = code.replace('placeholder="INGRESAR_NOMBRE" />', 'placeholder="INGRESAR_NOMBRE" value={nombre} onChange={e => setNombre(e.target.value)} required />');
code = code.replace('placeholder="INGRESAR_APELLIDOS" />', 'placeholder="INGRESAR_APELLIDOS" value={apellidos} onChange={e => setApellidos(e.target.value)} required />');
code = code.replace('placeholder="LIMA_CUZCO..." />', 'placeholder="LIMA_CUZCO..." value={departamento} onChange={e => setDepartamento(e.target.value)} />');
code = code.replace('placeholder="MENSAJE..."></textarea>', 'placeholder="MENSAJE..." value={mensaje} onChange={e => setMensaje(e.target.value)} required></textarea>');

code = code.replace(
  '<button type="submit" className="bg-white text-black font-black text-xs uppercase tracking-[0.2em] py-4 px-10 rounded-full hover:bg-gray-200 transition-all active:scale-95 w-full sm:w-auto shadow-sm">\n                  Transmitir Datos\n                </button>',
  `<button type="submit" className="bg-white text-black font-black text-xs uppercase tracking-[0.2em] py-4 px-10 rounded-full hover:bg-gray-200 transition-all active:scale-95 w-full sm:w-auto shadow-sm">
                  {isGuest ? 'INICIAR SESIÓN PARA ENVIAR' : 'TRANSMITIR DATOS'}
                </button>`
);

fs.writeFileSync('src/components/public/PublicContact.tsx', code);
