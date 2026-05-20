import React from 'react';
import { ArrowLeft, HelpCircle, Shield, Bell } from 'lucide-react';

interface HeaderProps {
  onBack?: () => void;
  title: string;
  showBack?: boolean;
  onNotificationsClick?: () => void;
  hasUnread?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onBack, title, showBack = true, onNotificationsClick, hasUnread }) => (
  <header className="bg-slate-950/50 backdrop-blur-md border-b border-white/5 fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16">
    <div className="flex items-center gap-4">
      {showBack && (
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors active:scale-95 text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      {!showBack && (
        <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
      )}
      <h1 className="text-base font-bold text-white">{title}</h1>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={onNotificationsClick}
        className="p-2 hover:bg-white/5 rounded-full transition-colors active:scale-95 text-slate-400 relative"
      >
        <Bell className="w-5 h-5" />
        {hasUnread && <span className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full border border-slate-950"></span>}
      </button>
      <button className="p-2 hover:bg-white/5 rounded-full transition-colors active:scale-95 text-slate-400">
        <HelpCircle className="w-5 h-5" />
      </button>
    </div>
  </header>
);
