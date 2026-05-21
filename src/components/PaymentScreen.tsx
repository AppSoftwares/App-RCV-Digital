import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, CreditCard, ArrowRight, CheckCircle2, Copy, Smartphone, Globe, Landmark, Mail, FileText } from 'lucide-react';
import { Header } from './Header';
import { validateEmail, validateRIF } from '../shared/security';
import { billingService } from '../core/services/BillingService';
import { accountingService } from '../core/services/AccountingService';
import { financialService } from '../core/services/FinancialService';

interface PaymentScreenProps {
  amount: number;
  onSuccess: () => void;
  onBack: () => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({ amount, onSuccess, onBack }) => {
  const [method, setMethod] = useState<'pago_movil' | 'zelle' | 'p2p' | null>(null);
  const [loading, setLoading] = useState(false);
  const [fiscalEmail, setFiscalEmail] = useState('');
  const [fiscalRIF, setFiscalRIF] = useState('');
  const [reference, setReference] = useState('');

  const isFormValid = method &&
    validateEmail(fiscalEmail) &&
    validateRIF(fiscalRIF) &&
    reference.length > 4;

  const handlePay = async () => {
    if (!isFormValid) return;
    setLoading(true);

    try {
      // 1. Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 2. Generación y Envío AUTOMÁTICO de PDF al correo
      const bcvRate = await financialService.getExchangeRate();

      // Llamamos al servicio de generación silenciosa
      await billingService.processDigitalInvoice({
        invoice_number: "108991",
        total_amount: amount,
      }, fiscalEmail);

      // Descarga automática silenciosa (Simulada para el cliente)
      // @ts-ignore
      if (window.html2pdf) {
        const element = document.getElementById('hidden-invoice');
        if (element) {
           const options = {
              margin: 0,
              filename: `Factura_RCV_Digital_${fiscalRIF}.pdf`,
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { scale: 2 },
              jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
           };
           // @ts-ignore
           await window.html2pdf().from(element).set(options).save();
        }
      }

      onSuccess();
    } catch (error) {
      console.error("Error en el procesamiento:", error);
      alert("Hubo un problema al procesar su pago. El servicio está protegido por Circuit Breaker.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-screen flex flex-col bg-mesh">
      <Header title="Pasarela de Pago Premium" onBack={onBack} />
      <main className="flex-1 mt-16 pb-32 px-6 max-w-2xl mx-auto w-full relative z-10">
        <div className="text-center mb-10">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-2">Checkout Seguro</p>
          <h2 className="text-4xl font-extrabold text-white mb-2">${amount.toFixed(2)}</h2>
          <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-4 py-1.5 rounded-full border border-brand-primary/20">Pago Único Anual</span>
        </div>

        <div className="space-y-4 mb-10">
          <PaymentMethodCard
            id="pago_movil"
            title="Pago Móvil (Bs.)"
            desc="Tasa BCV instantánea"
            icon={<Smartphone />}
            active={method === 'pago_movil'}
            onClick={() => setMethod('pago_movil')}
          />
          <PaymentMethodCard
            id="zelle"
            title="Zelle (USD)"
            desc="Confirmación en 5 min"
            icon={<Globe />}
            active={method === 'zelle'}
            onClick={() => setMethod('zelle')}
          />
          <PaymentMethodCard
            id="p2p"
            title="Transferencia P2P"
            desc="Binance / Otros"
            icon={<Landmark />}
            active={method === 'p2p'}
            onClick={() => setMethod('p2p')}
          />
        </div>

        {method && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Datos Fiscales */}
            <div className="bg-slate-900/80 border border-white/10 rounded-[32px] p-8 shadow-2xl">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <FileText size={18} className="text-brand-primary" />
                Datos para Factura Fiscal Digital
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-2 tracking-widest">Correo para envío de Factura y Póliza</p>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={fiscalEmail}
                      onChange={(e) => setFiscalEmail(e.target.value.toUpperCase())}
                      placeholder="usuario@ejemplo.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-brand-primary outline-none"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-2 tracking-widest">RIF / Cédula del Pagador</p>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={fiscalRIF}
                      onChange={(e) => setFiscalRIF(e.target.value.toUpperCase())}
                      placeholder="V-12345678-0"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-brand-primary outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Instrucciones */}
            <div className="bg-slate-900/80 border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10"><Wallet size={80} /></div>
               <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-brand-primary" />
                  Instrucciones de Depósito
               </h3>

             {method === 'pago_movil' && (
               <div className="space-y-4">
                 <CopyField label="Banco" value="Banesco (0134)" />
                 <CopyField label="Teléfono" value="0412-1234567" />
                 <CopyField label="RIF / CI" value="V-12345678" />
               </div>
             )}

             {method === 'zelle' && (
               <div className="space-y-4">
                 <CopyField label="Email Zelle" value="pagos@rcvdigital.com" />
                 <CopyField label="Titular" value="RCV DIGITAL SERVICES LLC" />
               </div>
             )}

             <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-4 tracking-widest">Ingrese Número de Referencia</p>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value.toUpperCase())}
                  placeholder="Ej: 998234..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono focus:border-brand-primary outline-none transition-all"
                />
             </div>
            </div>
          </motion.div>
        )}

        <div className="h-10" />

        <button
          onClick={handlePay}
          disabled={!isFormValid || loading}
          className={`w-full py-6 rounded-full font-black text-lg shadow-2xl transition-all flex items-center justify-center gap-3 ${!isFormValid || loading ? 'bg-slate-800 text-slate-500' : 'bg-white text-slate-900 shadow-indigo-500/20 hover:scale-[1.02]'}`}
        >
          {loading ? "PROCESANDO PAGO..." : "CONFIRMAR TRANSACCIÓN"}
          {!loading && <ArrowRight />}
        </button>
      </main>
    </motion.div>
  );
};

interface PaymentMethodCardProps {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const PaymentMethodCard = ({ title, desc, icon, active, onClick }: PaymentMethodCardProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-6 p-6 rounded-3xl border transition-all ${active ? 'bg-brand-primary/10 border-brand-primary shadow-lg shadow-brand-primary/10' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
  >
    <div className={`p-4 rounded-2xl ${active ? 'bg-brand-primary text-white' : 'bg-white/10 text-slate-400'}`}>{icon}</div>
    <div className="text-left">
      <p className="text-white font-bold">{title}</p>
      <p className="text-slate-500 text-xs font-medium">{desc}</p>
    </div>
    {active && <CheckCircle2 className="ml-auto text-brand-primary" />}
  </button>
);

interface CopyFieldProps {
  label: string;
  value: string;
}

const CopyField = ({ label, value }: CopyFieldProps) => (
  <div className="flex justify-between items-center bg-white/5 px-5 py-3 rounded-xl border border-white/5">
    <div>
      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-white">{value}</p>
    </div>
    <button onClick={() => navigator.clipboard.writeText(value)} className="p-2 text-slate-500 hover:text-white transition-colors">
      <Copy size={16} />
    </button>
  </div>
);
