import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Package, 
  Clock, 
  ChevronRight, 
  Settings, 
  UserCircle, 
  Phone, 
  CreditCard, 
  MapPin, 
  Lock,
  LogOut,
  ArrowLeft,
  Download
} from 'lucide-react';
import { downloadReceipt } from '../../lib/receipt';

export default function UserProfile({ catalog }: { catalog: any }) {
  const { currentUser, data, logout, onShowAuth, updateUser } = catalog;
  const [view, setView] = useState<'dashboard' | 'settings'>('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...currentUser });

  if (!currentUser || currentUser.id === 'guest') {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center flex flex-col items-center justify-center">
        <button 
          onClick={onShowAuth}
          className="px-12 py-5 bg-white text-black rounded-full font-black uppercase tracking-[0.3em] text-xs hover:scale-105 transition-all shadow-xl shadow-white/10"
        >
          Iniciar Sesión
        </button>
      </div>
    );
  }

  const userOrders = data.orders.filter((o: any) => o.customerId === currentUser.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-emerald-400 bg-emerald-400/10';
      case 'shipped': return 'text-blue-400 bg-blue-400/10';
      case 'pending': return 'text-amber-400 bg-amber-400/10';
      case 'cancelled': return 'text-red-400 bg-red-400/10';
      default: return 'text-white/40 bg-white/5';
    }
  };

  const handleUpdateProfile = () => {
    updateUser(currentUser.id, formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      <AnimatePresence mode="wait">
        {view === 'dashboard' ? (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            {/* Profile Header */}
            <section className="glass p-8 md:p-12 rounded-[40px] border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="relative group/avatar">
                  <div className="w-32 h-32 rounded-full bg-white text-black flex items-center justify-center text-5xl font-black italic shadow-[0_0_40px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform">
                    {currentUser.name?.charAt(0) || currentUser.firstName?.charAt(0) || 'U'}
                  </div>
                  <button 
                    onClick={() => setView('settings')}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-white/10 hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center transition-all border border-white/10 shadow-xl backdrop-blur-md"
                  >
                    <Settings size={18} />
                  </button>
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-tight">
                        {currentUser.firstName} {currentUser.lastName}
                      </h2>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                        <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                          <Mail size={12} />
                          <span>{currentUser.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                          <Shield size={12} />
                          <span>{currentUser.role === 'admin' || currentUser.role === 'superadmin' ? 'Administrador' : 'Socio SATOSHIMPORT'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setView('settings')}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                      >
                        <Settings size={14} /> Configurar
                      </button>
                      <button 
                        onClick={logout}
                        className="px-4 py-2 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
                      >
                        <LogOut size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-center md:justify-start gap-6">
                    <div className="text-center md:text-left">
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">Adquisiciones</p>
                      <p className="text-2xl font-black italic">{userOrders.length}</p>
                    </div>
                    <div className="w-[1px] h-10 bg-white/10 hidden md:block"></div>
                    <div className="text-center md:text-left">
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">Nivel Miembro</p>
                      <p className="text-2xl font-black italic text-emerald-400">Verificado</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Orders History */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                  <Package className="text-white/20" />
                  Historial de <span className="text-white/20">Órdenes</span>
                </h3>
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest italic">{userOrders.length} registros</span>
              </div>

              <div className="space-y-4">
                {userOrders.length > 0 ? (
                  userOrders.map((order: any, i: number) => (
                    <motion.div 
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass p-6 rounded-3xl border-white/5 hover:bg-white/[0.03] transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 font-mono text-xs">
                          #{order.id.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase italic tracking-wider">
                            {order.items.length} {order.items.length === 1 ? 'Artículo' : 'Artículos'}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 font-mono text-[10px] text-white/40 uppercase">
                            <span className="flex items-center gap-1.5"><Clock size={10} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>Total: ${order.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <ChevronRight size={18} className="text-white/20 group-hover:text-white transition-colors" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="glass p-16 rounded-[40px] border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-white/20">
                      <Package size={32} />
                    </div>
                    <h4 className="text-lg font-black uppercase italic tracking-wider text-white/40">Sin registros</h4>
                    <p className="text-sm text-white/20 mt-2 italic">Aún no has realizado ninguna adquisición.</p>
                  </div>
                )}
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div 
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setView('dashboard')}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver al Perfil
              </button>
              <h2 className="text-3xl font-black italic uppercase italic tracking-tighter">Configuración <span className="text-white/20">Perfil</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Sidebar Menu */}
              <div className="space-y-2">
                <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px]">
                  <UserCircle size={18} /> Datos Personales
                </button>
                <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all">
                  <Lock size={18} /> Seguridad
                </button>
                <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all">
                  <CreditCard size={18} /> Metodos de Pago
                </button>
                <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all">
                  <MapPin size={18} /> Direcciones
                </button>
              </div>

              {/* Settings Form */}
              <div className="md:col-span-2 space-y-6">
                <div className="glass p-8 rounded-[40px] border-white/5 space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black uppercase italic tracking-wider">Información Básica</h3>
                    <button 
                      onClick={() => {
                        if (isEditing) handleUpdateProfile();
                        else setIsEditing(true);
                      }}
                      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                        isEditing ? 'bg-emerald-500 text-white' : 'border border-white/10 text-white/40 hover:text-white hover:border-white'
                      }`}
                    >
                      {isEditing ? 'Guardar Cambios' : 'Editar Datos'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 block ml-4">Nombre</label>
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={formData.firstName}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm font-black disabled:opacity-50 transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 block ml-4">Apellido</label>
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={formData.lastName}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm font-black disabled:opacity-50 transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 block ml-4">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <input 
                          type="email" 
                          disabled={true}
                          value={formData.email}
                          className="w-full bg-white/5 border border-white/10 rounded-full pl-14 pr-6 py-4 text-sm font-black opacity-30 cursor-not-allowed font-mono"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 block ml-4">DNI / ID</label>
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={formData.dni}
                        onChange={e => setFormData({ ...formData, dni: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm font-black disabled:opacity-50 transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 block ml-4">Teléfono</label>
                      <div className="relative">
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-full pl-14 pr-6 py-4 text-sm font-black disabled:opacity-50 transition-all font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-[40px] flex items-center justify-between gap-6">
                  <div>
                    <h4 className="text-lg font-black uppercase italic tracking-wider text-red-500">Zona de Peligro</h4>
                    <p className="text-xs text-white/30 mt-1 italic">Eliminar tu cuenta es una acción irreversible que borrará todo tu historial de adquisiciones.</p>
                  </div>
                  <button className="px-6 py-3 border border-red-500/20 text-red-500 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                    Eliminar Cuenta
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
