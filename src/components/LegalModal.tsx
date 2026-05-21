import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert, Scale, ScrollText } from 'lucide-react';
import { CONTRACT_CONTENT } from '../data/contractContent';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  type: 'terms' | 'privacy';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, onAccept, type }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
            className="max-w-2xl w-full bg-slate-900 border border-white/10 rounded-[32px] flex flex-col max-h-[90vh] overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center gap-3">
                {type === 'terms' ? <ScrollText className="text-brand-primary" /> : <ShieldAlert className="text-brand-primary" />}
                <h3 className="text-xl font-bold text-white">
                  {type === 'terms' ? 'Contrato de Garantía RCV' : 'Política de Privacidad'}
                </h3>
              </div>
              <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X />
              </button>
            </div>

            <div className="p-8 overflow-y-auto text-slate-300 text-sm space-y-6 custom-scrollbar">
              {type === 'terms' ? (
                <div className="space-y-6">
                  <div className="text-center border-b border-white/5 pb-6">
                    <h2 className="text-white font-black text-lg mb-1">{CONTRACT_CONTENT.title}</h2>
                    <p className="text-brand-primary font-bold text-xs tracking-widest">{CONTRACT_CONTENT.subtitle}</p>
                  </div>

                  <p className="leading-relaxed italic text-slate-400">
                    {CONTRACT_CONTENT.header}
                  </p>

                  {CONTRACT_CONTENT.clauses.map((clause, index) => (
                    <section key={index} className="bg-white/5 p-5 rounded-2xl border border-white/5">
                      <h4 className="font-black text-white mb-3 uppercase tracking-tighter text-sm border-l-2 border-brand-primary pl-3">
                        {clause.title}
                      </h4>
                      <p className="leading-relaxed text-slate-300 text-xs">
                        {clause.content}
                      </p>
                    </section>
                  ))}
                </div>
              ) : (
                <>
                  <section>
                    <h4 className="font-bold text-white mb-2 uppercase tracking-widest text-xs">Recopilación de Datos</h4>
                    <p>Recopilamos datos de identidad (Cédula, Nombre), del vehículo (Placa, Título) y ubicación geográfica únicamente en caso de activar el botón S.O.S. o escanear el QR de auxilio.</p>
                  </section>
                  <section>
                    <h4 className="font-bold text-white mb-2 uppercase tracking-widest text-xs">Derecho al Olvido</h4>
                    <p>El usuario puede solicitar la baja total de sus datos y la eliminación de su cuenta desde el panel de perfil, conforme a las políticas de seguridad de datos internacionales.</p>
                  </section>
                </>
              )}
            </div>

            <div className="p-6 border-t border-white/5 bg-slate-900/50 flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-4 border border-white/10 text-slate-400 rounded-2xl font-bold hover:bg-white/5 transition-all text-xs uppercase tracking-widest"
              >
                Declinar
              </button>
              <button
                onClick={onAccept}
                className="flex-1 py-4 bg-white text-slate-900 rounded-2xl font-black shadow-lg shadow-white/10 hover:scale-[1.02] transition-all text-xs uppercase tracking-widest"
              >
                Aceptar Contrato
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
