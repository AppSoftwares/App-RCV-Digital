import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, ShieldAlert, CheckCircle2, Info, X, Clock } from 'lucide-react';
import { AppNotification } from '../types';
import { notificationService } from '../core/services/NotificationService';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = React.useState<AppNotification[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      setNotifications(notificationService.getNotifications());
    }
  }, [isOpen]);

  const handleRead = (id: string) => {
    notificationService.markAsRead(id);
    setNotifications([...notificationService.getNotifications()]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-slate-900 border-l border-white/10 z-[101] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="text-brand-primary" size={20} />
                <h3 className="text-lg font-black text-white uppercase tracking-tighter">Centro de Avisos</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Bell size={24} className="text-slate-700" />
                  </div>
                  <p className="text-slate-500 text-sm font-medium">No tienes notificaciones pendientes por ahora.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    layout
                    onClick={() => handleRead(n.id)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer ${n.read ? 'bg-white/5 border-white/5 opacity-60' : 'bg-white/10 border-white/10 shadow-lg'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                        n.severity === 'urgent' ? 'bg-red-500 text-white' :
                        n.severity === 'warning' ? 'bg-amber-500 text-white' : 'bg-brand-primary text-white'
                      }`}>
                        {n.type.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Clock size={10} />
                        <span className="text-[9px] font-bold">Hoy</span>
                      </div>
                    </div>
                    <h4 className="text-white text-sm font-bold mb-1">{n.title}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">{n.body}</p>
                  </motion.div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-white/5 bg-slate-950/50">
              <button className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">
                Configurar Preferencias
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
