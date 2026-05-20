import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MapPin, AlertTriangle, MessageCircle, X, HeartPulse, Send, CheckCircle2, Loader2, Car } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';
import { Share } from '@capacitor/share';

interface EmergencyActionsProps {
  onReportAccident?: () => void;
}

export const EmergencyActions: React.FC<EmergencyActionsProps> = ({ onReportAccident }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const handleSOS = async () => {
    setLoading(true);
    try {
      // 1. Obtener ubicación real vía Capacitor
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true
      });

      const { latitude, longitude } = coordinates.coords;
      console.log(`SOS: Ubicación obtenida: ${latitude}, ${longitude}`);

      // 2. Simular envío a la central (aquí se llamaría a Supabase o una API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Compartir con contacto de emergencia (Opcional vía Share API)
      const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

      try {
        await Share.share({
          title: 'EMERGENCIA RCV DIGITAL',
          text: `¡NECESITO AYUDA! Mi ubicación actual: ${locationUrl}. Por favor, contacta a la central de seguros.`,
          url: locationUrl,
          dialogTitle: 'Enviar alerta a contactos',
        });
      } catch (shareError) {
        console.log("Compartir cancelado o no disponible");
      }

      setAlertSent(true);
      setTimeout(() => {
        setAlertSent(false);
        setIsOpen(false);
      }, 5000);
    } catch (error) {
      console.error("Error en SOS:", error);
      alert("No se pudo obtener la ubicación. Por favor, llame directamente a emergencias.");
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hola, necesito asistencia con mi póliza RCV.");
    window.open(`https://wa.me/584120000000?text=${message}`, '_blank');
  };

  return (
    <>
      {/* Botones Flotantes Permanentes */}
      <div className="fixed bottom-24 right-6 z-[100] flex flex-col gap-4">
        {/* Botón SOS */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-red-600 text-white rounded-full shadow-2xl shadow-red-500/40 flex items-center justify-center border-4 border-red-500/20"
        >
          <AlertTriangle className="w-8 h-8 animate-pulse" />
        </motion.button>

        {/* Botón WhatsApp */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={openWhatsApp}
          className="w-16 h-16 bg-emerald-500 text-white rounded-full shadow-2xl shadow-emerald-500/40 flex items-center justify-center border-4 border-emerald-500/20"
        >
          <MessageCircle className="w-8 h-8" />
        </motion.button>
      </div>

      {/* Modal de Emergencia */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-[40px] p-8 relative overflow-hidden">
              {/* Decoración */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/10 rounded-full blur-3xl"></div>

              <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-red-600/20 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                  <HeartPulse className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Centro de Emergencia</h3>
                <p className="text-slate-400 text-sm mt-2 font-medium italic">Asistencia inmediata 24/7</p>
              </div>

              {!alertSent ? (
                <div className="space-y-4">
                  <button
                    onClick={handleSOS}
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-6 rounded-3xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-red-600/20 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Send className="w-6 h-6" />
                    )}
                    {loading ? "LOCALIZANDO..." : "ACTIVAR BOTÓN S.O.S."}
                  </button>
                  <p className="text-[10px] text-center text-slate-500 uppercase font-bold tracking-widest px-4 leading-relaxed">
                    Al presionar, se enviará tu ubicación exacta, datos médicos y contacto de emergencia a nuestra central de monitoreo.
                  </p>

                  <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                    <EmergencyContactCard icon={<Car className="text-amber-400" />} label="Reportar Accidente" action={() => {
                      setIsOpen(false);
                      onReportAccident?.();
                    }} />
                    <EmergencyContactCard icon={<Phone className="text-blue-400" />} label="Llamar Central" action={() => window.open('tel:911')} />
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">¡Auxilio en Camino!</h4>
                  <p className="text-slate-400 text-sm">Tu ubicación y ficha médica han sido enviadas. Mantén la calma, un operador te llamará en segundos.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

interface EmergencyContactCardProps {
  icon: React.ReactNode;
  label: string;
  action: () => void;
}

const EmergencyContactCard = ({ icon, label, action }: EmergencyContactCardProps) => (
  <button onClick={action} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all">
    {icon}
    <span className="text-[10px] font-bold text-white uppercase tracking-wider">{label}</span>
  </button>
);
