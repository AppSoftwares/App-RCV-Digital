import React from 'react';
import { motion } from 'motion/react';
import { Users, FileBarChart, Settings, ShieldCheck, AlertCircle, TrendingUp, Landmark, Calculator, ReceiptText, UserPlus, ShieldOff, UserCheck, ShieldAlert, History, LayoutDashboard, Database, Map as MapIcon } from 'lucide-react';
import { Header } from './Header';
import { accountingService } from '../core/services/AccountingService';
import { globalRateLimiter } from '../infrastructure/network/RateLimiter';
import { securityService } from '../core/services/SecurityService';
import { auditService, AuditEntry } from '../core/services/AuditService';
import { AccountingTable } from './AccountingTable';
import { RiskMap } from './RiskMap';
import { UserRole } from '../types';
import { Transaction } from '../core/entities/Accounting';

interface AdminDashboardProps {
  currentRole?: UserRole;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentRole = 'admin' }) => {
  const isAdmin = currentRole === 'admin';
  const isContador = currentRole === 'contador';
  const [logs, setLogs] = React.useState<AuditEntry[]>([]);
  const [anomalies, setAnomalies] = React.useState<string[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [activeView, setActiveView] = React.useState<'overview' | 'accounting' | 'security' | 'map' | 'customers'>(isContador ? 'accounting' : 'overview');
  const [selectedCustomer, setSelectedCustomer] = React.useState<any>(null);

  React.useEffect(() => {
    setLogs(auditService.getLogs());
    setAnomalies(auditService.detectAnomalies());

    // Simulación de carga de transacciones (en tiempo real vendría de un Hook de Supabase)
    const mockTransactions: Transaction[] = [
      { id: '1', invoice_id: '108991', user_id: 'V12345678', type: 'income', category: 'policy_premium', amount_usd: 44.22, amount_ves: 20962.80, exchange_rate: 474.05, status: 'posted', description: '', created_at: new Date().toISOString() },
      { id: '2', invoice_id: '108991', user_id: 'V12345678', type: 'income', category: 'tax_iva', amount_usd: 7.08, amount_ves: 3356.30, exchange_rate: 474.05, status: 'posted', description: '', created_at: new Date().toISOString() },
      { id: '3', invoice_id: '108990', user_id: 'J99887766', type: 'income', category: 'policy_premium', amount_usd: 100.00, amount_ves: 47405.00, exchange_rate: 474.05, status: 'posted', description: '', created_at: new Date(Date.now() - 86400000).toISOString() }
    ];
    setTransactions(mockTransactions);
  }, []);

  const handleGenerateReport = () => {
    if (!globalRateLimiter.isAllowed('admin_report_gen')) {
      alert("Límite de peticiones alcanzado. Por favor, espere un minuto.");
      return;
    }

    const csvContent = "data:text/plain;charset=utf-8," +
      accountingService.generateSeniatTxt([]);

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SENIAT_VENTAS_${new Date().toISOString().slice(0,7)}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    auditService.log({
      action: 'REPORT_GENERATED',
      category: 'admin',
      severity: 'low',
      details: 'Reporte TXT SENIAT generado por el administrador'
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-950 w-full overflow-hidden">
      {/* Sidebar - Interfaz Web Optimizada para Contador/Admin */}
      <aside className="hidden lg:flex w-64 border-r border-white/5 flex-col p-6 fixed h-full bg-slate-900/40 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="text-white font-black tracking-tighter text-xl italic uppercase">RCV Digital</span>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarLink active={activeView === 'overview'} onClick={() => setActiveView('overview')} icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <SidebarLink active={activeView === 'accounting'} onClick={() => setActiveView('accounting')} icon={<Calculator size={18} />} label="Contabilidad" />
          <SidebarLink active={activeView === 'map'} onClick={() => setActiveView('map')} icon={<MapIcon size={18} />} label="Mapa de Riesgo" />
          {isAdmin && <SidebarLink active={activeView === 'security'} onClick={() => setActiveView('security')} icon={<ShieldAlert size={18} />} label="Seguridad" />}
          <SidebarLink active={activeView === 'customers'} onClick={() => setActiveView('customers')} icon={<Users size={18} />} label="Gestión Clientes" />
        </nav>

        <div className="mt-auto p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Sincronizado</span>
          </div>
          <p className="text-[9px] text-slate-500 font-medium italic">Datos en tiempo real</p>
        </div>
      </aside>

      {/* Área de Contenido Principal */}
      <main className="flex-1 lg:ml-64 relative min-h-screen">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-20 pb-24 px-6 max-w-7xl mx-auto w-full"
        >
          <Header title={activeView === 'accounting' ? "Control Fiscal y Contable" : activeView === 'security' ? "Monitor de Seguridad" : "Panel de Gestión"} showBack={false} />

          {activeView === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatCard title="Usuarios Totales" value="1,284" icon={<Users className="w-6 h-6" />} color="text-blue-500" />
                <StatCard title="Ingresos Brutos (USD)" value="$43,912" icon={<TrendingUp className="w-6 h-6" />} color="text-emerald-500" />
                <StatCard title="Reserva de Fianza" value="$1,317" icon={<Landmark className="w-6 h-6" />} color="text-purple-500" />
                <StatCard title="Reclamos Activos" value="12" icon={<AlertCircle className="w-6 h-6" />} color="text-amber-500" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <section className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 border-l-4 border-l-blue-600 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <ReceiptText className="text-blue-600" />
                    <h3 className="text-lg font-bold text-white">Libro SENIAT</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 font-medium">IVA por Pagar (VES):</span>
                      <span className="text-white font-mono">312.450,22</span>
                    </div>
                    <button
                      onClick={handleGenerateReport}
                      className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
                    >
                      Generar TXT SENIAT
                    </button>
                  </div>
                </section>

                <section className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 border-l-4 border-l-purple-600 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <ShieldCheck className="text-purple-600" />
                    <h3 className="text-lg font-bold text-white">Fianza SUDEASEG</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 font-medium">Fondo Constituido:</span>
                      <span className="text-purple-400 font-black tracking-tight">$1,317.36</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-4">
                       <div className="bg-purple-600 h-full w-[85%]"></div>
                    </div>
                  </div>
                </section>

                <section className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-6">Accesos Rápidos</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <SettingsButton icon={<Calculator />} label="Tasas BCV" />
                    <SettingsButton icon={<FileBarChart />} label="Reportes" />
                  </div>
                </section>
              </div>
            </>
          )}

          {activeView === 'accounting' && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-brand-primary/10 to-transparent border border-white/10 p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">Módulo de Auditoría</h2>
                  <p className="text-slate-400 text-sm">Interfaz densa optimizada para PC/Navegador. Sincronización móvil 1:1.</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => {}} className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase border border-white/10 transition-all">
                    Imprimir Libro
                  </button>
                  <button onClick={handleGenerateReport} className="bg-white text-slate-950 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                    Exportar Reporte
                  </button>
                </div>
              </div>
              <AccountingTable transactions={transactions} />
            </div>
          )}

          {activeView === 'map' && (
            <div className="space-y-8">
              <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[40px] shadow-2xl">
                 <h2 className="text-2xl font-black text-white mb-2">Visualización de Riesgos</h2>
                 <p className="text-slate-500 text-xs mb-8">Análisis geo-espacial para vehículos y drones. Datos de siniestralidad en tiempo real.</p>
                 <div className="h-[600px] w-full">
                    <RiskMap />
                 </div>
              </div>
            </div>
          )}

          {activeView === 'customers' && (
            <div className="space-y-8">
              <AnimatePresence mode="wait">
                {!selectedCustomer ? (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-slate-900/50 border border-white/5 p-8 rounded-[40px] shadow-2xl"
                  >
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h2 className="text-2xl font-black text-white">Directorio de Clientes</h2>
                        <p className="text-slate-500 text-xs">Administración de pólizas y perfiles de usuario.</p>
                      </div>
                      <button className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase hover:scale-105 transition-transform">
                        Nuevo Cliente
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <CustomerCard
                        name="Juan Perez"
                        id="V-12.345.678"
                        status="Activo"
                        policies={1}
                        onClick={() => setSelectedCustomer({ name: 'Juan Perez', id: 'V-12.345.678', status: 'Activo', email: 'juan@email.com', phone: '+58 412-1112233', address: 'Caracas, Chacao' })}
                      />
                      <CustomerCard
                        name="Maria Rodriguez"
                        id="V-15.987.654"
                        status="Activo"
                        policies={2}
                        onClick={() => setSelectedCustomer({ name: 'Maria Rodriguez', id: 'V-15.987.654', status: 'Activo', email: 'maria@email.com', phone: '+58 424-5556677', address: 'Valencia, Carabobo' })}
                      />
                      <CustomerCard
                        name="Corporación Gamma"
                        id="J-30555444"
                        status="Pendiente"
                        policies={5}
                        onClick={() => setSelectedCustomer({ name: 'Corporación Gamma', id: 'J-30555444', status: 'Pendiente', email: 'contacto@gamma.com', phone: '0212-9998877', address: 'Maracay, Aragua' })}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4"
                    >
                      <ArrowRight size={14} className="rotate-180" /> Volver al Listado
                    </button>

                    <div className="bg-slate-900/50 border border-white/5 p-10 rounded-[40px] shadow-2xl">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="flex gap-6 items-center">
                          <div className="w-24 h-24 bg-brand-primary/10 rounded-[32px] flex items-center justify-center text-brand-primary border border-brand-primary/20">
                            <Users size={40} />
                          </div>
                          <div>
                            <h2 className="text-4xl font-black text-white mb-1">{selectedCustomer.name}</h2>
                            <p className="text-brand-primary font-mono font-bold">{selectedCustomer.id}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-bold uppercase">Editar Perfil</button>
                          <button className="px-6 py-3 bg-red-600/10 border border-red-600/20 text-red-500 rounded-2xl text-xs font-bold uppercase">Suspender</button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/5">
                        <InfoItem label="Correo Electrónico" value={selectedCustomer.email} />
                        <InfoItem label="Teléfono Contacto" value={selectedCustomer.phone} />
                        <InfoItem label="Dirección Fiscal" value={selectedCustomer.address} />
                      </div>

                      <div className="mt-12 space-y-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <ShieldCheck size={20} className="text-emerald-500" />
                          Historial de Pólizas
                        </h3>
                        <div className="bg-black/20 rounded-3xl overflow-hidden">
                           <table className="w-full text-left">
                              <thead className="bg-white/5 text-[10px] uppercase font-bold text-slate-500">
                                <tr>
                                  <th className="p-4">ID Póliza</th>
                                  <th className="p-4">Tipo</th>
                                  <th className="p-4">Vencimiento</th>
                                  <th className="p-4 text-right">Estatus</th>
                                </tr>
                              </thead>
                              <tbody className="text-xs text-white">
                                <tr className="border-t border-white/5">
                                  <td className="p-4 font-mono">#POL-88231</td>
                                  <td className="p-4">RCV Vehicular</td>
                                  <td className="p-4 text-slate-500">15/12/2026</td>
                                  <td className="p-4 text-right"><span className="text-emerald-500 font-bold">VIGENTE</span></td>
                                </tr>
                              </tbody>
                           </table>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {activeView === 'security' && isAdmin && (
            <section className="space-y-10">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-white flex items-center gap-3">
                  <ShieldAlert className="w-8 h-8 text-red-500" />
                  Auditoría de Seguridad
                </h2>
                {anomalies.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-4 py-2 rounded-full animate-pulse uppercase tracking-widest">
                    {anomalies.length} Amenazas Detectadas
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900/50 border border-white/5 rounded-[40px] p-8 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                    <History size={20} className="text-brand-primary" />
                    Trazabilidad Global
                  </h3>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                    {logs.length === 0 ? (
                      <p className="text-slate-500 text-center py-20 text-sm italic">Cargando eventos...</p>
                    ) : (
                      logs.map(log => <AuditItem key={log.id} log={log} />)
                    )}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[40px] shadow-2xl">
                    <h4 className="text-red-500 text-lg font-black mb-4 flex items-center gap-3">
                      <ShieldOff size={24} /> Desactivación Remota
                    </h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">Invalida inmediatamente el acceso desde dispositivos móviles extraviados o personal desvinculado.</p>
                    <div className="relative mb-6">
                      <input type="text" placeholder="Email del usuario..." className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-red-500 outline-none transition-all" />
                    </div>
                    <button className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-600/20">
                      BLOQUEAR TERMINAL
                    </button>
                  </div>

                  <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[40px] shadow-2xl">
                    <h4 className="text-white font-bold mb-6 italic underline">Usuarios con Acceso Privilegiado</h4>
                    <div className="space-y-4">
                      <UserAccessItem name="Lic. Maria (Contador)" role="Contador" status="active" />
                      <UserAccessItem name="Pedro Operador" role="Operador" status="active" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeView === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
              <section className="bg-slate-900/50 border border-white/5 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-6">Métricas de Usuarios</h3>
                <div className="space-y-4">
                  <RoleItem name="Administradores" count={3} />
                  <RoleItem name="Contadores" count={2} />
                  <RoleItem name="Operadores Técnicos" count={15} />
                  <RoleItem name="Clientes Activos" count={1266} />
                </div>
              </section>

              <section className="bg-slate-900/50 border border-white/5 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-6">Opciones del Sistema</h3>
                <div className="grid grid-cols-2 gap-4">
                  <SettingsButton icon={<Settings />} label="Ajustes" />
                  <SettingsButton icon={<FileBarChart />} label="Logs Aud." />
                </div>
              </section>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <div className="bg-slate-900/80 border border-white/5 p-6 rounded-[32px] shadow-xl">
    <div className={`p-3 rounded-2xl bg-white/5 w-fit mb-4 ${color}`}>{icon}</div>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
    <p className="text-3xl font-extrabold text-white">{value}</p>
  </div>
);

const AuditItem = ({ log }: { log: AuditEntry }) => (
  <div className={`p-4 rounded-2xl border ${log.severity === 'critical' ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/5'}`}>
    <div className="flex justify-between items-start mb-1">
      <span className={`text-[10px] font-bold uppercase tracking-widest ${log.category === 'security' ? 'text-brand-primary' : 'text-blue-400'}`}>
        {log.category}
      </span>
      <span className="text-slate-600 text-[9px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
    </div>
    <p className="text-white text-xs font-bold mb-1">{log.action}</p>
    <p className="text-slate-500 text-[10px] leading-tight">{log.details}</p>
  </div>
);

interface UserAccessItemProps {
  name: string;
  role: string;
  status: 'active' | 'deactivated';
}

const UserAccessItem = ({ name, role, status }: UserAccessItemProps) => (
  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
    <div>
      <p className="text-white font-medium text-sm">{name}</p>
      <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{role}</p>
    </div>
    <div className="flex items-center gap-2">
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${status === 'active' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
        {status.toUpperCase()}
      </span>
      <button className="p-2 text-slate-500 hover:text-white transition-colors">
        {status === 'active' ? <ShieldOff size={16} /> : <UserCheck size={16} />}
      </button>
    </div>
  </div>
);

const TransactionItem = ({ desc, amount, date }: any) => (
  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl text-xs">
    <div>
      <p className="text-white font-medium">{desc}</p>
      <p className="text-slate-500 text-[10px]">{date}</p>
    </div>
    <span className={amount.startsWith('+') ? 'text-emerald-500 font-bold' : 'text-slate-400'}>{amount}</span>
  </div>
);

interface RoleItemProps {
  name: string;
  count: number;
}

const RoleItem = ({ name, count }: RoleItemProps) => (
  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
    <span className="text-slate-300 font-medium">{name}</span>
    <span className="bg-brand-primary/20 text-brand-primary px-3 py-1 rounded-full text-xs font-bold">{count}</span>
  </div>
);

interface SettingsButtonProps {
  icon: React.ReactNode;
  label: string;
}

const SettingsButton = ({ icon, label }: SettingsButtonProps) => (
  <button className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors gap-3 border border-white/5">
    <div className="text-slate-400">{icon}</div>
    <span className="text-xs font-bold text-white uppercase tracking-widest">{label}</span>
  </button>
);

interface CustomerCardProps {
  name: string;
  id: string;
  status: string;
  policies: number;
  onClick: () => void;
}

const CustomerCard = ({ name, id, status, policies, onClick }: CustomerCardProps) => (
  <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] hover:border-brand-primary/30 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
        <Users size={24} />
      </div>
      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${status === 'Activo' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
        {status}
      </span>
    </div>
    <h4 className="text-white font-bold text-lg mb-1">{name}</h4>
    <p className="text-slate-500 text-xs font-mono mb-4">{id}</p>
    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
      <span className="text-[10px] text-slate-500 font-bold uppercase">Pólizas: {policies}</span>
      <button
        onClick={onClick}
        className="text-brand-primary text-[10px] font-black uppercase hover:underline"
      >
        Ver Detalle
      </button>
    </div>
  </div>
);

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-white font-bold text-sm">{value}</p>
  </div>
);

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarLink = ({ icon, label, active, onClick }: SidebarLinkProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${active ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
  >
    {icon}
    <span className="font-bold text-sm tracking-tight">{label}</span>
  </button>
);
