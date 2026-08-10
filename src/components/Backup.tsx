import { Download, Upload, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useCatalog } from '../hooks/useCatalog';
import { motion } from 'motion/react';
import React, { useState } from 'react';
import { useTerminal } from '../hooks/useTerminal';

interface BackupProps {
  catalog: ReturnType<typeof useCatalog>;
}

export default function Backup({ catalog }: BackupProps) {
  const { data, importJson, clearAll } = catalog;
  const { addLog } = useTerminal();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleExport = () => {
    addLog('Iniciando protocolo de exportación de datos...', 'process');
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SATOSHIMPORT-BACKUP-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addLog('Artifacto de respaldo generado con éxito.', 'success');
    setSuccessMsg('PROTOCOLO DE DESCARGA COMPLETADO.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addLog(`Cargando artifacto: ${file.name}...`, 'process');
    const reader = new FileReader();
    reader.onload = () => {
      const result = importJson(reader.result as string);
      if (result) {
        addLog('Inyección de datos completada. Sistema restaurado.', 'success');
        setSuccessMsg('SISTEMA RESTAURADO DESDE ARTIFACTO.');
      } else {
        addLog('Error crítico de integridad: JSON corrupto o inválido.', 'error');
        alert('ERROR DE INTEGRIDAD: JSON INVÁLIDO.');
      }
      setTimeout(() => setSuccessMsg(null), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Export Card */}
        <motion.div 
          whileHover={{ y: -10 }}
          className="glass rounded-[60px] p-12 flex flex-col gap-10 shadow-3xl relative overflow-hidden group bg-white/[0.01] border-white/5"
        >
          <div className="p-6 bg-white text-black rounded-[32px] w-fit shadow-2xl shadow-white/10 group-hover:scale-110 transition-transform duration-700">
            <Download size={32} />
          </div>
          <div>
            <h3 className="text-3xl font-black mb-4 text-white uppercase italic tracking-tighter">Nube Local</h3>
            <p className="text-sm text-white/50 leading-relaxed font-bold uppercase tracking-widest leading-loose">
              Exporta toda tu arquitectura de datos en un solo artifacto cifrado. Ideal para migraciones de alta seguridad.
            </p>
          </div>
          <button 
            onClick={handleExport}
            className="w-full py-6 bg-white text-black font-black rounded-[28px] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 shadow-[0_15px_40px_rgba(255,255,255,0.15)] tracking-widest text-[10px] uppercase italic"
          >
            <Download size={22} />
            Generar Artifacto
          </button>
        </motion.div>

        {/* Import Card */}
        <motion.div 
          whileHover={{ y: -10 }}
          className="glass rounded-[60px] p-12 flex flex-col gap-10 shadow-3xl relative overflow-hidden group bg-white/[0.01] border-white/5"
        >
          <div className="p-6 bg-white/5 border border-white/10 text-white rounded-[32px] w-fit shadow-xl group-hover:bg-white group-hover:text-black transition-all duration-700">
            <Upload size={32} />
          </div>
          <div>
            <h3 className="text-3xl font-black mb-4 text-white uppercase italic tracking-tighter">Restauración</h3>
            <p className="text-sm text-white/50 leading-relaxed font-bold uppercase tracking-widest leading-loose">
              Carga un artifacto previo para sobreescribir la sesión actual con tus registros históricos de inventario.
            </p>
          </div>
          <label className="w-full py-6 border-2 border-dashed border-white/10 rounded-[28px] hover:border-white hover:bg-white/5 transition-all flex items-center justify-center gap-4 cursor-pointer group text-white/40 hover:text-white">
            <Upload size={22} className="group-hover:translate-y-[-4px] transition-transform duration-500" />
            <span className="font-black uppercase tracking-widest text-[10px] italic">Inyectar Datos</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </motion.div>
      </div>

      {/* Danger Zone */}
      <div className="glass rounded-[60px] p-12 border-red-900/40 relative overflow-hidden shadow-3xl bg-red-950/10">
        <div className="absolute right-[-40px] bottom-[-40px] p-8 text-red-900/5 select-none pointer-events-none scale-150 rotate-12">
          <Trash2 size={300} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-4">
            <h3 className="text-3xl font-black text-red-600 flex items-center gap-4 uppercase italic tracking-tighter">
              <AlertTriangle size={32} />
              Cero Absoluto
            </h3>
            <p className="text-white/40 text-xs max-w-xl leading-loose font-bold uppercase tracking-widest">
              Esta acción purgará de forma definitiva todos los registros locales de este dominio. No existe recuperación tras el borrado masivo de hardware virtual.
            </p>
          </div>
          <button 
            onClick={() => { if(confirm('¿BORRAR TODO? Acción irreversible.')) clearAll(); }}
            className="px-12 py-6 bg-red-900/20 hover:bg-red-600 text-white font-black rounded-[28px] transition-all shadow-2xl active:scale-95 flex items-center gap-4 uppercase tracking-widest text-[10px] italic border border-red-600/20"
          >
            <Trash2 size={22} />
            Full Purge
          </button>
        </div>
      </div>

      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 p-6 glass bg-white text-black font-black rounded-[24px] flex items-center gap-4 shadow-3xl z-50 px-10 uppercase italic tracking-widest text-xs"
        >
          <CheckCircle size={24} />
          {successMsg}
        </motion.div>
      )}
    </div>
  );
}
