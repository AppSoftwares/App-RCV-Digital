import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Moon,
  Sun,
  Bell,
  Volume2,
  Vibrate,
  Fingerprint,
  KeyRound,
  Trash2,
  MessageSquare,
  AlertCircle,
  Languages,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { Header } from './Header';

export const SettingsScreen: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifs, setNotifs] = useState({ push: true, sound: true, vibration: true });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Header title="Ajustes" />
      <main className="pt-20 pb-32 px-6 max-w-2xl mx-auto space-y-12">
        <section className="flex flex-col items-center pt-4">
          <div className="w-28 h-24 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-[40px] p-1 shadow-2xl">
            <div className="w-full h-full bg-slate-900 rounded-[38px] flex items-center justify-center border-4 border-slate-950">
              <User size={48} className="text-slate-700" />
            </div>
          </div>
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-black text-white tracking-tight">Lic. Maria Contador</h2>
            <p className="text-slate-500 font-medium text-sm">maria.lic@rcvdigital.com</p>
          </div>
          <button className="mt-6 px-8 py-3 bg-white/5 border border-white/5 hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
            Editar Perfil
          </button>
        </section>

        <div className="space-y-10">
          <SettingsGroup title="Apariencia">
            <SettingsToggle icon={darkMode ? <Moon size={18}/> : <Sun size={18}/>} label="Modo Oscuro" value={darkMode} onToggle={() => setDarkMode(!darkMode)} />
            <SettingsItem icon={<Languages size={18}/>} label="Idioma" value="Español" />
          </SettingsGroup>

          <SettingsGroup title="Notificaciones">
            <SettingsToggle icon={<Bell size={18}/>} label="Push" value={notifs.push} onToggle={() => setNotifs({...notifs, push: !notifs.push})} />
            <SettingsToggle icon={<Volume2 size={18}/>} label="Sonido" value={notifs.sound} onToggle={() => setNotifs({...notifs, sound: !notifs.sound})} />
            <SettingsToggle icon={<Vibrate size={18}/>} label="Vibración" value={notifs.vibration} onToggle={() => setNotifs({...notifs, vibration: !notifs.vibration})} />
          </SettingsGroup>

          <SettingsGroup title="Seguridad">
            <SettingsItem icon={<KeyRound size={18}/>} label="Contraseña" />
            <SettingsToggle icon={<Fingerprint size={18}/>} label="Biometría" value={true} onToggle={() => {}} />
            <button className="w-full flex items-center justify-between p-6 text-red-500 hover:bg-red-500/5 transition-all">
               <div className="flex items-center gap-4"><Trash2 size={18} /><span className="text-sm font-bold">Eliminar Cuenta</span></div>
               <ChevronRight size={16} />
            </button>
          </SettingsGroup>

          <section className="text-center pt-8 border-t border-white/5 space-y-4">
             <p className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.4em]">Versión 1.0.0 • © 2026 RCV Digital</p>
             <button className="flex items-center gap-2 mx-auto text-red-500/60 font-black text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors pt-4">
                <LogOut size={14} /> Cerrar Sesión
             </button>
          </section>
        </div>
      </main>
    </div>
  );
};

interface SettingsGroupProps {
  title: string;
  children: React.ReactNode;
}

const SettingsGroup = ({ title, children }: SettingsGroupProps) => (
  <div className="space-y-4">
    <h3 className="text-xs font-black text-brand-primary uppercase tracking-[0.2em] px-2">{title}</h3>
    <div className="bg-slate-900/50 border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">{children}</div>
  </div>
);

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
}

const SettingsItem = ({ icon, label, value }: SettingsItemProps) => (
  <button className="w-full flex items-center justify-between p-6 border-b border-white/5 last:border-0 hover:bg-white/5 transition-all group">
    <div className="flex items-center gap-4">
      <div className="text-slate-500 group-hover:text-brand-primary transition-colors">{icon}</div>
      <span className="text-sm font-bold text-white">{label}</span>
    </div>
    <div className="flex items-center gap-3">
      {value && <span className="text-[10px] font-black text-slate-500 uppercase">{value}</span>}
      <ChevronRight size={16} className="text-slate-700" />
    </div>
  </button>
);

interface SettingsToggleProps {
  icon: React.ReactNode;
  label: string;
  value: boolean;
  onToggle: () => void;
}

const SettingsToggle = ({ icon, label, value, onToggle }: SettingsToggleProps) => (
  <div className="flex items-center justify-between p-6 border-b border-white/5 last:border-0">
    <div className="flex items-center gap-4">
      <div className="text-slate-500">{icon}</div>
      <span className="text-sm font-bold text-white">{label}</span>
    </div>
    <button
      onClick={onToggle}
      className={`w-14 h-8 rounded-full p-1.5 transition-colors relative ${value ? 'bg-brand-primary' : 'bg-slate-800'}`}
    >
      <motion.div animate={{ x: value ? 24 : 0 }} className="w-5 h-5 bg-white rounded-full shadow-lg" />
    </button>
  </div>
);
