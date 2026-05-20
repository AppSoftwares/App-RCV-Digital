import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, PhoneCall, CheckCircle, Clock, Search, Filter } from 'lucide-react';
import { Header } from './Header';

export const OperatorDashboard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 pb-24 px-6 max-w-6xl mx-auto w-full"
    >
      <Header title="Consola de Operador" showBack={false} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Cola de Asistencia</h2>
          <p className="text-slate-400 text-sm">Gestiona reclamos y consultas en tiempo real.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="bg-slate-900 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-brand-primary" placeholder="Buscar placa o ID..." />
          </div>
          <button className="p-2 bg-white/5 border border-white/10 rounded-full text-slate-400"><Filter className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <ClaimTicket id="TK-882" client="Juan Perez" type="Choque Simple" time="Hace 5 min" status="pending" />
          <ClaimTicket id="TK-881" client="Maria Lopez" type="Grúa Requerida" time="Hace 12 min" status="urgent" />
          <ClaimTicket id="TK-880" client="Carlos Ruiz" type="Consulta de Póliza" time="Hace 1 hora" status="resolved" />
        </div>

        <aside className="space-y-6">
          <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-3xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-brand-primary" />
              Línea Directa
            </h3>
            <button className="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-brand-primary/30">
              Atender Siguiente Llamada
            </button>
          </div>

          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6">
            <h3 className="font-bold text-white mb-4">Tu Actividad Hoy</h3>
            <div className="space-y-3">
              <ActivityRow label="Resueltos" count={12} icon={<CheckCircle className="text-emerald-500" />} />
              <ActivityRow label="Pendientes" count={3} icon={<Clock className="text-amber-500" />} />
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

const ClaimTicket = ({ id, client, type, time, status }: any) => (
  <div className="bg-slate-900/80 border border-white/5 p-6 rounded-[32px] hover:border-white/20 transition-all cursor-pointer group">
    <div className="flex justify-between items-start">
      <div className="flex gap-4">
        <div className={`p-4 rounded-2xl ${status === 'urgent' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
          <MessageSquare />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{id}</span>
            <span className={`w-2 h-2 rounded-full ${status === 'urgent' ? 'bg-red-500 animate-pulse' : status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </div>
          <h4 className="text-white font-bold">{client}</h4>
          <p className="text-slate-400 text-xs">{type} • {time}</p>
        </div>
      </div>
      <button className="bg-white/5 group-hover:bg-white/10 text-white text-[10px] font-bold px-4 py-2 rounded-full transition-colors uppercase tracking-widest">
        Gestionar
      </button>
    </div>
  </div>
);

const ActivityRow = ({ label, count, icon }: any) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-sm text-slate-400">
      {icon}
      <span>{label}</span>
    </div>
    <span className="text-white font-bold">{count}</span>
  </div>
);
