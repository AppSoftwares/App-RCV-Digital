import React from 'react';
import { Home, ShieldCheck, Settings, Plane } from 'lucide-react';

interface BottomNavProps {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

type TabType = 'home' | 'policies' | 'drones' | 'settings';

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChange }) => (
  <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 lg:hidden">
    <NavItem icon={Home} label="Inicio" active={activeTab === 'home'} onClick={() => onChange('home')} />
    <NavItem icon={ShieldCheck} label="RCV" active={activeTab === 'policies'} onClick={() => onChange('policies')} />
    <NavItem icon={Plane} label="Drones" active={activeTab === 'drones'} onClick={() => onChange('drones')} />
    <NavItem icon={Settings} label="Ajustes" active={activeTab === 'settings'} onClick={() => onChange('settings')} />
  </nav>
);

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem = ({ icon: Icon, label, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 transition-all ${active ? 'text-brand-primary' : 'text-slate-500 hover:text-slate-300'}`}
  >
    <div className={`p-1.5 rounded-xl transition-colors ${active ? 'bg-brand-primary/10 scale-110' : ''}`}>
      <Icon className="w-5 h-5" />
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);
