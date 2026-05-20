import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Plane, ShieldAlert, ShieldCheck, Gauge, ArrowRight } from 'lucide-react';
import { Header } from './Header';

type UsageCategory = 'recreativo' | 'comercial' | 'fotografia';
type Zone = 'urbana' | 'rural' | 'restringida';

export const DroneRCScreen: React.FC = () => {
  const [serial, setSerial] = useState('');
  const [uso, setUso] = useState<UsageCategory>('recreativo');
  const [peso, setPeso] = useState<number>(0);
  const [zona, setZona] = useState<Zone>('urbana');
  const [coberturas, setCoberturas] = useState({
    terceros: true,
    materiales: false,
    lesiones: true
  });

  const riskAnalysis = useMemo(() => {
    let score = 0;
    if (peso > 2000) score += 3;
    else if (peso > 250) score += 1;
    if (uso === 'comercial') score += 2;
    if (zona === 'urbana') score += 2;
    if (zona === 'restringida') score += 5;

    if (score >= 5) return { label: 'ALTO', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', desc: 'Revisión técnica manual requerida.' };
    if (score >= 2) return { label: 'MEDIO', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', desc: 'Póliza estándar con recargo.' };
    return { label: 'BAJO', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', desc: 'Emisión inmediata.' };
  }, [peso, uso, zona]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Header title="RC Drones" />
      <main className="pt-20 pb-32 px-6 max-w-2xl mx-auto space-y-8">
        <section className="bg-slate-900/50 border border-white/5 rounded-[40px] p-8 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <Plane className="text-brand-primary" />
            <h3 className="font-bold text-white uppercase tracking-widest text-xs">Especificaciones</h3>
          </div>
          <div className="space-y-4">
            <InputField label="Número de Serie" value={serial} onChange={setSerial} placeholder="Serie ID" />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Peso (G)" type="number" value={peso} onChange={(v) => setPeso(Number(v))} />
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase px-2">Zona</p>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm outline-none focus:border-brand-primary"
                  value={zona}
                  onChange={(e) => setZona(e.target.value as Zone)}
                >
                  <option value="rural">Rural</option>
                  <option value="urbana">Urbana</option>
                  <option value="restringida">Restringida</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase px-2">Uso</p>
              <div className="flex gap-2">
                {(['recreativo', 'comercial', 'fotografia'] as UsageCategory[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setUso(cat)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase border transition-all ${uso === cat ? 'bg-brand-primary border-brand-primary text-white shadow-xl' : 'bg-white/5 border-white/10 text-slate-500'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
           <ToggleOption label="Daños a Terceros" active={coberturas.terceros} />
           <ToggleOption label="Lesiones" active={coberturas.lesiones} onClick={() => setCoberturas({...coberturas, lesiones: !coberturas.lesiones})} />
           <ToggleOption label="Daños Materiales" active={coberturas.materiales} onClick={() => setCoberturas({...coberturas, materiales: !coberturas.materiales})} />
        </section>

        <motion.div className={`${riskAnalysis.bg} ${riskAnalysis.border} border p-6 rounded-[32px] flex gap-5 items-center`}>
          <div className={`p-3 rounded-2xl bg-white/5 ${riskAnalysis.color}`}><Gauge /></div>
          <div>
            <span className={`text-xs font-black ${riskAnalysis.color}`}>RIESGO {riskAnalysis.label}</span>
            <p className="text-slate-400 text-xs">{riskAnalysis.desc}</p>
          </div>
        </motion.div>

        <div className="bg-white text-slate-950 p-8 rounded-[40px] shadow-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase opacity-50">Prima</p>
            <h4 className="text-3xl font-black">$85.00</h4>
          </div>
          <button className="bg-slate-950 text-white p-5 rounded-3xl hover:scale-105 active:scale-95 transition-all">
            <ArrowRight size={24} />
          </button>
        </div>
      </main>
    </div>
  );
};

const InputField = ({ label, value, onChange, placeholder, type = 'text' }: any) => (
  <div className="space-y-2">
    <p className="text-[10px] font-bold text-slate-500 uppercase px-2">{label}</p>
    <input
      type={type}
      value={String(value)}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value.toUpperCase())}
      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-brand-primary transition-all text-sm font-medium"
    />
  </div>
);

const ToggleOption = ({ label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${active ? 'bg-white/5 border-emerald-500/30' : 'bg-transparent border-white/5 opacity-50'}`}
  >
    <span className="text-sm font-bold">{label}</span>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? 'border-emerald-500 bg-emerald-500' : 'border-slate-700'}`}>
      {active && <ShieldCheck size={12} className="text-white" />}
    </div>
  </button>
);
