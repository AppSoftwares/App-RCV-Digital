import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert, Scale, ScrollText } from 'lucide-react';

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
                {type === 'terms' ? <Scale className="text-brand-primary" /> : <ShieldAlert className="text-brand-primary" />}
                <h3 className="text-xl font-bold text-white">
                  {type === 'terms' ? 'Términos y Condiciones de Uso' : 'Política de Privacidad'}
                </h3>
              </div>
              <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X />
              </button>
            </div>

            <div className="p-8 overflow-y-auto text-slate-300 text-sm space-y-6 custom-scrollbar">
              {type === 'terms' ? (
                <>
                  <section>
                    <h4 className="font-bold text-white mb-2 uppercase tracking-widest text-xs">1. Limitación de Responsabilidad</h4>
                    <p>RCV Digital es una plataforma de gestión de pólizas. El usuario reconoce que la empresa NO se hace responsable por siniestros derivados de:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
                      <li>Conducción bajo efectos del alcohol o sustancias psicotrópicas.</li>
                      <li>Uso de vehículos por terceros sin licencia válida.</li>
                      <li>Exceso de velocidad o maniobras imprudentes que violen la Ley de Tránsito Terrestre.</li>
                      <li>Información falsa o documentos forjados suministrados durante el registro.</li>
                    </ul>
                  </section>
                  <section>
                    <h4 className="font-bold text-white mb-2 uppercase tracking-widest text-xs">2. Propiedad Intelectual</h4>
                    <p>Todos los activos, iconos, logos y código fuente son propiedad de RCV Digital. Las librerías de terceros utilizadas (React, Lucide, Capacitor) se rigen bajo sus respectivas licencias MIT/Apache 2.0.</p>
                  </section>
                </>
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
                className="flex-1 py-4 border border-white/10 text-slate-400 rounded-2xl font-bold hover:bg-white/5 transition-all"
              >
                Cerrar
              </button>
              <button
                onClick={onAccept}
                className="flex-1 py-4 bg-white text-slate-900 rounded-2xl font-bold shadow-lg shadow-white/10 hover:scale-[1.02] transition-all"
              >
                Aceptar y Continuar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
