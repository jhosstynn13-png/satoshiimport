import { useState } from 'react';
import { UploadCloud, FileText, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { useCatalog } from '../hooks/useCatalog';
import { motion } from 'motion/react';
import { useTerminal } from '../hooks/useTerminal';

interface BulkUploadProps {
  catalog: ReturnType<typeof useCatalog>;
}

export default function BulkUpload({ catalog }: BulkUploadProps) {
  const { importCsv } = catalog;
  const { addLog } = useTerminal();
  const [csvText, setCsvText] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleImport = () => {
    if (!csvText.trim()) return;
    addLog('Analizando buffer CSV para sincronización por lotes...', 'process');
    const count = importCsv(csvText);
    addLog(`Buffer procesado: ${count} nuevos registros inyectados en la base de datos.`, 'success');
    setResult(`PROCESADO: ${count} REGISTROS VIRTUALES CARGADOS.`);
    setCsvText('');
    setTimeout(() => setResult(null), 5000);
  };

  const sampleCsv = `ZAPATILLAS,HOMBRE,Master Stealth Low,499.00,MS-001,https://via.placeholder.com/300,Edición especial monochrome
BOLSOS,CARTERAS,Elite Carbon Pouch,299.00,EC-88,https://via.placeholder.com/300,Accesorios de alta gama
MODA,ACCESORIOS,GS Signature Watch,899.00,SW-PRO,https://via.placeholder.com/300,Cronógrafo mecánico local`;

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="glass rounded-[60px] p-12 shadow-3xl overflow-hidden relative border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-6 mb-12">
          <div className="p-5 bg-white text-black rounded-3xl shadow-2xl shadow-white/10">
            <UploadCloud size={32} />
          </div>
          <div>
            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white font-black italic">Ingreso de Productos</h3>
            <p className="text-[10px] text-white/60 font-black uppercase tracking-[0.3em] mt-1">Sincronización por protocolos CSV Pro</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-8 bg-white/5 border border-white/5 rounded-[40px] space-y-4">
            <h4 className="text-[10px] font-black flex items-center gap-3 text-white/60 uppercase tracking-[0.2em]">
              <Info size={18} className="text-white" />
              Dataset Schema
            </h4>
            <p className="text-[10px] text-white/60 leading-loose font-mono uppercase font-black">
              <code>CATEGORÍA,LÍNEA,NOMBRE,VALOR,SKU,SOURCE,DETALLES</code>
            </p>
          </div>
          <div className="p-8 bg-white/5 border border-white/5 rounded-[40px] space-y-4">
            <h4 className="text-[10px] font-black flex items-center gap-3 text-white uppercase tracking-[0.2em]">
              <CheckCircle size={18} />
              Procesado IA
            </h4>
            <p className="text-[10px] text-white/60 leading-loose uppercase font-black">
              El sistema autogenera las jerarquías detectadas basándose en el dataset proporcionado.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <textarea 
            value={csvText}
            onChange={e => setCsvText(e.target.value)}
            placeholder="PEGA EL BUFFER DE DATOS AQUÍ..."
            className="w-full min-h-[350px] p-10 bg-white/5 border border-white/10 rounded-[48px] outline-none focus:bg-white/10 focus:border-white font-mono text-xs leading-loose custom-scrollbar resize-none transition-all placeholder:text-white/20 uppercase"
          />

          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={() => setCsvText(sampleCsv)}
              className="flex-1 py-5 px-8 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-black rounded-[28px] transition-all flex items-center justify-center gap-4 uppercase tracking-widest text-[10px] italic"
            >
              <FileText size={20} />
              Cargar Template
            </button>
            <button 
              onClick={handleImport}
              disabled={!csvText.trim()}
              className="flex-[2] py-5 px-8 bg-white text-black font-black rounded-[28px] hover:scale-105 active:scale-95 disabled:opacity-10 disabled:grayscale disabled:cursor-not-allowed transition-all shadow-[0_15px_40px_rgba(255,255,255,0.15)] flex items-center justify-center gap-4 uppercase tracking-widest text-[10px] italic"
            >
              <UploadCloud size={24} />
              Ejecutar Sync
            </button>
          </div>

          {result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-white text-black rounded-[24px] flex items-center justify-center gap-4 font-black text-xs uppercase italic tracking-widest shadow-2xl"
            >
              <CheckCircle size={24} />
              {result}
            </motion.div>
          )}
        </div>
      </div>

      <div className="p-10 bg-white/5 rounded-[48px] border border-white/10 flex items-start gap-6 group hover:bg-white/10 transition-colors">
        <AlertCircle className="text-white/40 group-hover:text-white flex-shrink-0 transition-colors" size={32} />
        <div>
          <h4 className="text-xs font-black text-white uppercase italic tracking-widest mb-2">Protocolos de Escalamiento</h4>
          <p className="text-[10px] text-white/60 leading-relaxed font-bold uppercase tracking-widest">
            Limitación de Hardware Local: Recuerda que el navegador restringe el buffer de almacenamiento a 10MB. Para inventarios masivos con assets pesados, utiliza fuentes externas de imagen.
          </p>
        </div>
      </div>
    </div>
  );
}
