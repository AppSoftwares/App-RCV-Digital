import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, MapPin, AlertTriangle, ArrowRight, X, Loader2, CheckCircle2 } from 'lucide-react';
import { Header } from './Header';
import { accidentService } from '../core/services/AccidentService';

interface AccidentReportScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const AccidentReportScreen: React.FC<AccidentReportScreenProps> = ({ onBack, onSuccess }) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'info' | 'photos' | 'success'>('info');

  const handlePhotoUpload = () => {
    const mockPhoto = `https://images.unsplash.com/photo-1594908900066-3f47337549d8?q=80&w=2070&auto=format&fit=crop`;
    setPhotos([...photos, mockPhoto]);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await accidentService.submitReport({
        userId: 'usr_123',
        policyId: 'pol_108991',
        location: { lat: 10.4806, lng: -66.9036, address: 'Av. Libertador, Caracas' },
        description,
        photos
      });
      setStep('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Header title="Reporte de Accidente" onBack={onBack} />

      <main className="pt-20 pb-32 px-6 max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'info' && (
            <motion.div key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[32px] flex gap-4 items-start">
                <AlertTriangle className="text-red-500 shrink-0" size={24} />
                <p className="text-xs text-red-200 leading-relaxed font-medium">Mantenga la calma. Asegúrese de estar en un lugar seguro antes de continuar con el reporte.</p>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase px-2 tracking-widest">¿Qué sucedió?</p>
                <textarea
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value.toUpperCase())}
                  placeholder="Describe brevemente el incidente..."
                  className="w-full bg-white/5 border border-white/10 rounded-[32px] p-6 text-white outline-none focus:border-brand-primary h-40 resize-none"
                />
              </div>

              <button
                onClick={() => setStep('photos')}
                disabled={description.length < 10}
                className="w-full py-5 bg-white text-slate-950 rounded-full font-black uppercase shadow-2xl disabled:opacity-50 transition-all flex items-center justify-center gap-3"
              >
                Continuar a Fotos <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {step === 'photos' && (
            <motion.div key="photos" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">Registro Visual</h3>
                <p className="text-slate-500 text-xs">Capture fotos de los daños y del entorno.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {photos.map((p: string, i: number) => (
                  <div key={i} className="aspect-square rounded-3xl overflow-hidden border border-white/10 relative">
                    <img src={p} className="w-full h-full object-cover" alt="Accident" />
                    <button 
                      onClick={() => setPhotos(photos.filter((_: string, idx: number) => idx !== i))} 
                      className="absolute top-2 right-2 p-1.5 bg-slate-950/80 rounded-full"
                      aria-label="Eliminar foto"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handlePhotoUpload}
                  className="aspect-square rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:border-brand-primary/50 transition-all"
                >
                  <Camera className="text-slate-600" size={32} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Añadir Foto</span>
                </button>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep('info')} className="flex-1 py-5 border border-white/10 rounded-full font-bold uppercase text-xs">Atrás</button>
                <button
                  onClick={handleSubmit}
                  disabled={photos.length === 0 || isSubmitting}
                  className="flex-[2] py-5 bg-brand-primary text-white rounded-full font-black uppercase flex items-center justify-center gap-3 shadow-xl"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Enviar Reporte"}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12 space-y-8">
              <div className="w-24 h-24 bg-emerald-500 rounded-[40px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
                <CheckCircle2 size={48} className="text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white mb-2">Reporte Enviado</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">Tu caso ha sido registrado. Un asesor legal se pondrá en contacto contigo en menos de 15 minutos.</p>
              </div>
              <button onClick={onSuccess} className="w-full py-5 bg-white text-slate-950 rounded-full font-black uppercase">Volver al Inicio</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
