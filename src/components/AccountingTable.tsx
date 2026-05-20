import React, { useState } from 'react';
import { Download, Search, Filter, FileSpreadsheet } from 'lucide-react';
import { Transaction } from '../core/entities/Accounting';

interface AccountingTableProps {
  transactions: Transaction[];
}

export const AccountingTable: React.FC<AccountingTableProps> = ({ transactions }) => {
  const [filter, setFilter] = useState('');

  const handleExportExcel = () => {
    const header = "Fecha,ID Factura,Cliente,Categoría,Monto USD,Monto VES,Tasa BCV,Estado\n";
    const rows = transactions.map(t =>
      `${t.created_at},${t.invoice_id},${t.user_id},${t.category},${t.amount_usd},${t.amount_ves},${t.exchange_rate},${t.status}`
    ).join("\n");

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `REPORTE_CONTABLE_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/50 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por factura, RIF o cliente..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:border-brand-primary outline-none"
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all">
            <Filter size={14} /> Filtros
          </button>
          <button
            onClick={handleExportExcel}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-500 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            <FileSpreadsheet size={14} /> Exportar Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Factura</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4 text-right">USD</th>
              <th className="px-6 py-4 text-right">VES (BCV)</th>
              <th className="px-6 py-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm italic">
                  No se encontraron transacciones en el periodo seleccionado.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors group text-xs">
                  <td className="px-6 py-4 text-slate-400 font-mono">
                    {new Date(t.created_at).toLocaleDateString('es-VE')}
                  </td>
                  <td className="px-6 py-4 font-bold text-white">#{t.invoice_id}</td>
                  <td className="px-6 py-4">
                    <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-md text-[10px] uppercase font-bold text-slate-300">
                      {t.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-400">${t.amount_usd.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-slate-400">{t.amount_ves.toLocaleString('es-VE', { minimumFractionDigits: 2 })} Bs.</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${t.status === 'posted' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">{t.status}</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
        <span>Mostrando {transactions.length} registros</span>
        <span>Sincronizado en tiempo real • {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};
