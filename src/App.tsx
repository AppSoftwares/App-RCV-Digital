import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  ArrowRight,
  CheckCircle2, 
  BadgeCheck, 
  Zap, 
  FileText, 
  Car, 
  User,
  Camera,
  Info,
  ShieldCheck,
  Download,
  Scale,
  Loader2,
  Edit2,
  Phone,
  Mail,
  LogOut,
  Users,
  Briefcase,
  HeartPulse,
  Printer
} from 'lucide-react';

// Components
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ProgressBar } from './components/ProgressBar';
import { AdminDashboard } from './components/AdminDashboard';
import { OperatorDashboard } from './components/OperatorDashboard';
import { EmergencyActions } from './components/EmergencyActions';
import { PhysicalCredential } from './components/PhysicalCredential';
import { LegalModal } from './components/LegalModal';
import { PaymentScreen } from './components/PaymentScreen';
import { FiscalInvoice } from './components/FiscalInvoice';
import { NotificationPanel } from './components/NotificationPanel';
import { AccidentReportScreen } from './components/AccidentReportScreen';
import { DroneRCScreen } from './components/DroneRCScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { securityService } from './core/services/SecurityService';
import { financialService } from './core/services/FinancialService';
import { notificationService } from './core/services/NotificationService';
import { Calculator } from 'lucide-react';

// Services
import { AuthScreen } from './components/AuthScreen';
import { RegistrationFlow } from './components/RegistrationFlow';
import { analyzeDocument } from './lib/gemini';
import { savePolicy } from './lib/supabase';
import { authService } from './core/services/AuthService';
import { ExtractedData, UserRole, UserProfile } from './types';
import { pdfService } from './lib/pdfService';
import { Share } from '@capacitor/share';

// --- Assets ---
const IMAGES = {
  HERO_CAR: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlgqB0bqEL6ssBuduqYbYU5IQyeqiIs6QSekHZS33eCXq7p3woOUkk2gTghJ7e7Uw65yYapsjPprJrI3Ue7SC1av6sXgmKunblClAgnzDDo7LKtUgkTIejmOIM8zpx1bx3G-xs3gGB1nyDDYt_DCDFdCMMHCmQzUj2L-zyZ_XruWNkQ0sPKO6RVyMKmxOg9wVYbETGLK0YJIvx5fp0HcXiWqdxLUcnt5VsPlumXiCsjnxJOyejl8XNUzca4-UZn8Pv2z_h_cApJlev",
  UPLOAD_ID: "https://images.unsplash.com/photo-1634733988138-bf2c3a2a13fa?q=80&w=2070&auto=format&fit=crop",
  UPLOAD_TITLE: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2011&auto=format&fit=crop",
  SUMMARY_CAR: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDF7tuGd2Rpl962bNrod4fxUi5q1bPChSUQxFHjjX3H_ZGoQEY2WiwWhvw-GqAHTgdoKXqxB6qSHQ-_0O42rjzdpK5vNL1XsbvcvUv77Cx-10S5MiH9ZmpusbKGCMTbQqZMj9vUkWjsEtKJxFjWZ561siFAm1xxc5bM73BcgY-mR57lN-MNUaG4OldnnuAmpHh1z1qHbilpmAfqPXeiPCR_NBMu6Wbs1G-oh62NJxS6AUm3loXCW80ndKzr25ABeSoN7ayaF3lfVEI",
  QR_CODE: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3PAut2MiDVYdxZ5Zp2UCyexO1Fom7C-Fwmm3hkMhKcifpc2443qtDpHpG5yMa0f5Aufr2wJX3BJ7dNQ56_TKh6mots-BUsRoN0cR9trn37UpWhWxC5Md1GWzVQ_Yi_WHtfDhsEwQ8SEZhEgn6pBH3SZkrtnJ3DRwO1eOnSdwYnCBQC8LFdNbsKhrTzL7zQQ6Kz5j9hePtZZilCk56IV3iv19pu_80joticBPg1EXiwxlexTvg326mkRMuU0mi7g-7BOsY6ygXmbXk",
  WHATSAPP: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6WYZEGyRyEvVe4emgEI5l9alU1oGskKtbu760te4XKWERpHsskQ_RAZEoHkxBlWZMGXG-Ef55qM5BCjXom637T6sDqxP7cH8LlNumnhfh5HPT273Qb7nXsS8jFwihauUVHMtL1QsMSZUAiOZVbUqWE84YhsS56-YMY5qVMBQb3bEss7M560Yf8t4Eq7xY0KcRxO-DBNF9Hzy5VQdmu7Yi1X1V22k6R2hw_dtELu5jizKcyhnb8Ov9kCt_sukk2fY0x8gyJv_Clp3S"
};

type AppStep = 'landing' | 'registration' | 'payment' | 'success' | 'accident_report';

// --- Login Screen ---

const LoginScreen: React.FC<{ onLogin: (user: UserProfile) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await authService.login(email, password);
      onLogin(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role: string) => {
    setEmail(`${role}@rcv.com`);
    setPassword('password123');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center p-6 bg-mesh">
      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-white text-center mb-2">RCV Digital</h2>
        <p className="text-slate-400 text-center text-sm mb-8 font-medium italic">Acceso al Sistema Nacional</p>

        <form onSubmit={handleAuth} className="space-y-4 mb-4">
          <div>
            <input
              type="text"
              placeholder="USUARIO O EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value.toUpperCase())}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-primary outline-none transition-all placeholder:text-slate-600 font-bold"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="CONTRASEÑA"
              value={password}
              onChange={(e) => setPassword(e.target.value.toUpperCase())}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-primary outline-none transition-all placeholder:text-slate-600 font-bold"
            />
          </div>

          {error && (
            <p className="text-red-500 text-[10px] text-center font-black uppercase tracking-widest animate-pulse">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-slate-900 font-black py-5 rounded-3xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/10"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "ACCEDER"}
          </button>
        </form>

        <div className="flex flex-col gap-4 mt-6">
           <button className="text-[10px] font-bold text-brand-primary uppercase tracking-widest hover:underline">Crear Nueva Cuenta</button>
           <button className="text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:text-slate-400 transition-colors">Validar con Gmail</button>
        </div>
      </div>
    </motion.div>
  );
};

const QuickRoleBtn = ({ label, onClick }: any) => (
  <button
    onClick={onClick}
    className="py-2 px-4 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-slate-400 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest"
  >
    {label}
  </button>
);

// --- Screen Components ---

const LandingScreen: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col">
    <Header title="RCV Digital" showBack={false} />
    <main className="pt-16 pb-24 relative z-10">
      <section className="w-full relative h-[500px] overflow-hidden bg-slate-950">
        <img src={IMAGES.HERO_CAR} alt="Hero" className="w-full h-full object-cover opacity-60 hero-mask" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-8">
          <div className="max-w-4xl mx-auto w-full">
            <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">Digital Safety Standard 2026</span>
            <h1 className="text-white text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tighter">
              Seguro RCV <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">100% Digital</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="max-w-xl mx-auto px-6 py-12 flex flex-col gap-10">
        <div className="space-y-4">
          <p className="text-xl text-slate-400 font-medium">Emisión inmediata bajo estándares de Sudeaseg. El sistema más robusto para tu tranquilidad vial.</p>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 w-fit px-4 py-2 rounded-full">
            <BadgeCheck className="w-5 h-5 text-brand-primary" />
            <span className="text-xs font-bold text-slate-300">Certificación Sudeaseg Activa</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-white/5 p-5 rounded-3xl flex gap-4 items-start shadow-2xl">
            <div className="bg-brand-primary/20 p-3 rounded-2xl text-brand-primary"><Zap className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-white mb-1">Instante</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Certificado legal emitido en segundos.</p>
            </div>
          </div>
          <div className="bg-slate-900 border border-white/5 p-5 rounded-3xl flex gap-4 items-start shadow-2xl">
            <div className="bg-brand-secondary/20 p-3 rounded-2xl text-brand-secondary"><FileText className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-white mb-1">Paperless</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Gestión optimizada sin documentos físicos.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <button onClick={onNext} className="w-full bg-white text-slate-950 font-extrabold py-5 rounded-full shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-3 hover:bg-slate-100 active:scale-95 transition-all">
            Comenzar Registro <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </main>
  </motion.div>
);

const UploadScreen: React.FC<{ onNext: () => void, onBack: () => void, onDataExtracted: (data: ExtractedData) => void }> = ({ onNext, onBack, onDataExtracted }) => {
  const [loading, setLoading] = useState<'id' | 'title' | null>(null);
  const [completed, setCompleted] = useState({ id: false, title: false });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentType, setCurrentType] = useState<'id' | 'title' | null>(null);

  const handleUploadClick = (type: 'id' | 'title') => {
    setCurrentType(type);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentType) {
      setLoading(currentType);
      try {
        const data = await analyzeDocument(file, currentType);
        onDataExtracted(data);
        setCompleted(prev => ({ ...prev, [currentType]: true }));
      } finally {
        setLoading(null);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-screen flex flex-col">
      <Header title="Carga de Documentos" onBack={onBack} />
      <main className="flex-1 mt-16 pb-32 px-6 max-w-2xl mx-auto w-full relative z-10">
        <ProgressBar step={1} total={4} progress={completed.id && completed.title ? 50 : completed.id || completed.title ? 25 : 0} />
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-white mb-3">Carga de Documentos</h2>
          <p className="text-sm text-slate-400">Nuestro motor de IA extraerá automáticamente la información técnica.</p>
        </div>

        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />

        <div className="space-y-6">
          <UploadCard
            title="Cédula de Identidad"
            desc="Verificación de identidad oficial"
            icon={<User className="w-6 h-6" />}
            type="primary"
            loading={loading === 'id'}
            completed={completed.id}
            onClick={() => handleUploadClick('id')}
            image={IMAGES.UPLOAD_ID}
          />
          <UploadCard
            title="Título de Propiedad"
            desc="Documentación del vehículo"
            icon={<FileText className="w-6 h-6" />}
            type="secondary"
            loading={loading === 'title'}
            completed={completed.title}
            onClick={() => handleUploadClick('title')}
            image={IMAGES.UPLOAD_TITLE}
          />
        </div>

        <div className="mt-10">
          <button
            onClick={onNext}
            disabled={!completed.id || !completed.title}
            className={`w-full font-extrabold py-5 rounded-full shadow-2xl active:scale-95 transition-all ${completed.id && completed.title ? 'bg-white text-slate-950' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
          >
            Validar Documentación
          </button>
        </div>
      </main>
      <BottomNav activeTab="home" />
    </motion.div>
  );
};

const UploadCard = ({ title, desc, icon, type, loading, completed, onClick, image }: any) => (
  <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl border ${type === 'primary' ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' : 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20'}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{title}</h3>
            <p className="text-xs text-slate-500">{desc}</p>
          </div>
        </div>
        <span className={`px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-widest ${completed ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-slate-400 border-white/10'}`}>
          {completed ? 'Listo' : 'Pendiente'}
        </span>
      </div>

      <div onClick={onClick} className="relative aspect-[16/10] bg-slate-950/50 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer group hover:border-brand-primary/50 transition-colors overflow-hidden">
        {loading && <div className="scan-line" />}
        <img src={image} className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale brightness-200" />
        <div className="relative z-10 text-center p-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
              <p className="font-bold text-white text-sm">IA Analizando...</p>
            </div>
          ) : completed ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              <p className="font-bold text-white text-sm">Documento Verificado</p>
            </div>
          ) : (
            <>
              <Camera className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="font-bold text-white text-sm">Capturar Documento</p>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);

const SummaryScreen: React.FC<{ onNext: () => void, onBack: () => void, data: ExtractedData, onUpdate: (data: ExtractedData) => void }> = ({ onNext, onBack, data, onUpdate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data);
  const [showLegal, setShowLegal] = useState(false);
  const [acceptedLegal, setAcceptedLegal] = useState(false);

  const handleConfirm = async () => {
    if (!acceptedLegal) {
      setShowLegal(true);
      return;
    }
    onNext();
  };

  const handleSaveEdit = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-screen flex flex-col bg-mesh">
      <Header title="Revisión de Datos" onBack={onBack} />
      <main className="flex-1 mt-16 pb-32 px-6 max-w-4xl mx-auto w-full relative z-10">
        <ProgressBar step={3} total={4} progress={75} />
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-extrabold text-white mb-3">Verificación Final</h2>
            <p className="text-sm text-slate-400">Asegúrese de que la información extraída sea correcta.</p>
          </div>
          <button
            onClick={() => isEditing ? handleSaveEdit() : setIsEditing(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${isEditing ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'}`}
          >
            {isEditing ? <CheckCircle2 className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            {isEditing ? "Guardar Cambios" : "Editar Datos"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <section className="bg-slate-900/40 backdrop-blur-3xl rounded-[40px] shadow-2xl border border-white/5 p-8 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-white/5 text-brand-primary rounded-2xl flex items-center justify-center border border-white/10"><Car className="w-7 h-7" /></div>
              <h3 className="text-2xl font-extrabold text-white">Titular y Vehículo</h3>
            </div>

            <div className="space-y-6">
              <EditableField label="Nombre Completo" value={formData.nombre} isEditing={isEditing} onChange={(v: string) => setFormData({...formData, nombre: v})} />
              <EditableField label="Cédula" value={formData.cedula} isEditing={isEditing} onChange={(v: string) => setFormData({...formData, cedula: v})} />

              <div className="border-b border-white/5 pb-4">
                <p className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-[0.2em]">Placa</p>
                {isEditing ? (
                  <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-xl focus:border-brand-primary outline-none" value={formData.placa} onChange={(e) => setFormData({...formData, placa: e.target.value.toUpperCase()})} />
                ) : (
                  <p className="font-mono text-2xl text-white">{formData.placa || "---"}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <EditableField label="Marca" value={formData.marca} isEditing={isEditing} onChange={(v: string) => setFormData({...formData, marca: v})} />
                <EditableField label="Modelo" value={formData.modelo} isEditing={isEditing} onChange={(v: string) => setFormData({...formData, modelo: v})} />
              </div>

              <div className="pt-4 border-t border-white/5 space-y-4">
                <h4 className="text-xs font-bold text-brand-primary uppercase tracking-widest flex items-center gap-2">
                   <Phone className="w-3 h-3" /> Contacto Requerido
                </h4>
                <EditableField label="Correo Electrónico" value={formData.email} placeholder="ejemplo@correo.com" isEditing={isEditing} onChange={(v: string) => setFormData({...formData, email: v})} />
                <EditableField label="Teléfono" value={formData.telefono} placeholder="+58 412..." isEditing={isEditing} onChange={(v: string) => setFormData({...formData, telefono: v})} />
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                   <HeartPulse className="w-3 h-3" /> Ficha Médica (Opcional)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <EditableField label="Tipo de Sangre" value={formData.medicalInfo?.tipoSangre} placeholder="Ej: O+" isEditing={isEditing} onChange={(v: string) => setFormData({...formData, medicalInfo: { ...formData.medicalInfo, tipoSangre: v }})} />
                  <EditableField label="Contacto de Emergencia" value={formData.medicalInfo?.contactoEmergenciaTelefono} placeholder="+58 424..." isEditing={isEditing} onChange={(v: string) => setFormData({...formData, medicalInfo: { ...formData.medicalInfo, contactoEmergenciaTelefono: v }})} />
                </div>
                <EditableField label="Alergias / Medicamentos" value={formData.medicalInfo?.alergias} placeholder="Ej: Penicilina, ninguna..." isEditing={isEditing} onChange={(v: string) => setFormData({...formData, medicalInfo: { ...formData.medicalInfo, alergias: v }})} />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[40px] shadow-2xl border border-white/5 overflow-hidden">
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-2xl font-extrabold text-white">Liquidación</h3>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex justify-between"><span className="text-slate-400">Prima RCV Reglada</span> <span className="text-white font-bold">$45.00</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Impuestos y Tasas</span>
                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-500">14% Total</span>
                  <span className="text-white font-bold">$6.30</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Transaccional</p>
                    <p className="text-[9px] text-slate-600">Calculado a Tasa BCV</p>
                  </div>
                  <span className="text-4xl font-extrabold text-white">$51.30</span>
                </div>
              </div>
            </div>

            <div className="bg-brand-primary/5 rounded-[32px] p-6 border border-brand-primary/20 flex gap-4">
              <Scale className="w-6 h-6 text-brand-primary shrink-0" />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Al proceder, usted acepta que los datos suministrados son fidedignos y autoriza la emisión de la póliza bajo la normativa de la <strong>SUDEASEG</strong>.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 flex gap-4">
          <button onClick={onBack} className="flex-1 py-5 border border-white/10 text-slate-400 rounded-full font-bold uppercase text-xs hover:bg-white/5 transition-all">Regresar</button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting || !formData.email || !formData.telefono}
            className={`flex-[2] py-5 rounded-full font-extrabold flex items-center justify-center gap-3 transition-all shadow-2xl ${isSubmitting || !formData.email || !formData.telefono ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-950 shadow-indigo-500/20 hover:scale-[1.02]'}`}
          >
            {acceptedLegal ? "Proceder al Pago" : "Revisar Contrato"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>

      <LegalModal
        isOpen={showLegal}
        onClose={() => setShowLegal(false)}
        onAccept={() => {
          setAcceptedLegal(true);
          setShowLegal(false);
        }}
        type="terms"
      />
    </motion.div>
  );
};

const EditableField = ({ label, value, isEditing, onChange, placeholder }: any) => (
  <div>
    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-[0.2em]">{label}</p>
    {isEditing ? (
      <input
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:border-brand-primary outline-none"
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <p className="font-bold text-white uppercase text-sm">{value || "---"}</p>
    )}
  </div>
);

import { pdfService } from './lib/pdfService';
import { Share } from '@capacitor/share';

const SuccessScreen: React.FC<{ onReset: () => void, data: ExtractedData }> = ({ onReset, data }) => {
  const [view, setView] = useState<'digital' | 'physical' | 'invoice'>('digital');
  const [bcvRate, setBcvRate] = useState(474.0598);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    financialService.getExchangeRate().then(setBcvRate);

    // Generación automática del PDF al cargar la pantalla de éxito
    const timer = setTimeout(() => {
       handleAutoGenerate();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleAutoGenerate = async () => {
    // Solo generamos si estamos en la vista de factura para capturar el DOM
    // Forzamos un renderizado momentáneo si es necesario o capturamos el elemento oculto
    console.log("Generando factura automática...");
  };

  const downloadPDF = async () => {
    setIsGenerating(true);
    setView('invoice'); // Cambiamos a la vista de factura para asegurar que esté en el DOM

    setTimeout(async () => {
      await pdfService.generateInvoice('invoice-container', `Factura_RCV_${data.placa || 'Digital'}`);
      setIsGenerating(false);
    }, 500);
  };

  const shareInvoice = async () => {
    try {
      await Share.share({
        title: 'Mi Póliza RCV Digital',
        text: `Hola, adjunto mi póliza RCV Digital del vehículo placa ${data.placa}.`,
        url: '', // Aquí iría el base64 del PDF si lo generamos en memoria
        dialogTitle: 'Compartir Póliza y Factura',
      });
    } catch (error) {
      console.error('Error al compartir', error);
    }
  };
      <div className="text-center mb-16">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-brand-primary to-brand-secondary text-white rounded-[32px] mb-8 shadow-2xl shadow-indigo-500/40">
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tighter">Éxito Total</h1>
        <p className="text-lg text-slate-400 max-w-sm mx-auto font-medium">Su póliza RCV ha sido validada y está plenamente vigente en el sistema nacional.</p>
      </div>

      <AnimatePresence mode="wait">
        {view === 'physical' ? (
          <motion.div key="physical" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-10">
            <PhysicalCredential data={data} />
            <div className="mt-8 flex justify-center">
              <button onClick={() => setView('digital')} className="text-slate-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                <ArrowRight className="w-4 h-4 rotate-180" /> Volver al Certificado Digital
              </button>
            </div>
          </motion.div>
        ) : view === 'invoice' ? (
          <motion.div key="invoice" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-10 overflow-x-auto bg-white rounded-3xl p-2">
            <FiscalInvoice
              data={data}
              invoiceNumber="108991"
              controlNumber="00-110369"
              date={new Date().toLocaleDateString('es-VE')}
              amountUsd={51.30}
              bcvRate={bcvRate}
            />
            <div className="mt-8 flex justify-center pb-4">
              <button onClick={() => setView('digital')} className="text-slate-600 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                <ArrowRight className="w-4 h-4 rotate-180" /> Volver al Certificado Digital
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="digital"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-slate-900/80 backdrop-blur-2xl rounded-[40px] overflow-hidden shadow-2xl border border-white/10 relative mb-10"
          >
            <div className="p-8 border-b border-white/5 flex justify-between items-start">
              <div>
                <p className="text-[10px] text-brand-primary font-bold tracking-[0.3em] uppercase mb-2">Digital Security Pass</p>
                <h3 className="text-3xl font-extrabold text-white">Certificado 2026</h3>
              </div>
              <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">Active</div>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <SummaryField label="Titular" value={data.nombre} />
                <SummaryField label="Placa" value={data.placa} />
                <SummaryField label="Expiración" value="15 OCT 2025" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="bg-white p-4 rounded-[32px] shadow-2xl"><img src={IMAGES.QR_CODE} className="w-32 h-32 grayscale" alt="QR" /></div>
                <p className="text-[9px] text-slate-500 mt-4 uppercase font-bold tracking-widest">Validación Sudeaseg</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {view === 'digital' && (
          <>
            <button
              onClick={downloadPDF}
              disabled={isGenerating}
              className="w-full bg-slate-100 text-slate-900 font-extrabold py-5 rounded-full flex items-center justify-center gap-3 shadow-xl hover:bg-white transition-all"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : <Download className="w-5 h-5" />}
              Descargar Factura y Póliza (PDF)
            </button>
            <button
              onClick={shareInvoice}
              className="w-full bg-emerald-500 text-white font-extrabold py-5 rounded-full flex items-center justify-center gap-3 shadow-xl hover:bg-emerald-600 transition-all"
            >
              <Mail className="w-5 h-5" /> Enviar por WhatsApp / Correo
            </button>
            <button
              onClick={() => setView('physical')}
              className="w-full bg-brand-primary/10 border border-brand-primary/30 text-brand-primary font-extrabold py-5 rounded-full flex items-center justify-center gap-3 shadow-xl hover:bg-brand-primary/20 transition-all"
            >
              <Printer className="w-5 h-5" /> Formato para Vidrio / Casco
            </button>
          </>
        )}

        {(view === 'physical' || view === 'invoice') && (
          <button
            onClick={downloadPDF}
            className="w-full bg-white text-slate-900 font-extrabold py-5 rounded-full flex items-center justify-center gap-3 shadow-xl"
          >
            <Download className="w-5 h-5" /> Confirmar Descarga
          </button>
        )}

        <button onClick={onReset} className="w-full bg-transparent border border-white/10 text-white py-5 rounded-full font-bold hover:bg-white/5 transition-all">Emitir Nueva Póliza</button>
      </div>

      {/* Elemento oculto para generación de PDF si no está visible */}
      <div className="hidden">
         <div id="hidden-invoice">
            <FiscalInvoice
              data={data}
              invoiceNumber="108991"
              controlNumber="00-110369"
              date={new Date().toLocaleDateString('es-VE')}
              amountUsd={51.30}
              bcvRate={bcvRate}
            />
         </div>
      </div>

      <div className="mt-12 text-center">
         <p className="text-[10px] text-slate-600 uppercase font-bold tracking-[0.3em]">Copia enviada a: {data.email}</p>
      </div>
    </motion.div>
  );
};

const SummaryField = ({ label, value }: any) => (
  <div>
    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-[0.2em]">{label}</p>
    <p className="font-bold text-white uppercase text-sm">{value || "---"}</p>
  </div>
);

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [step, setStep] = useState<AppStep>('landing');
  const [activeTab, setActiveTab] = useState<'home' | 'policies' | 'drones' | 'settings'>('home');
  const [extractedData, setExtractedData] = useState<ExtractedData>({});
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    if (user && user.role === 'cliente') {
      notificationService.checkPolicyExpirations([
        { id: '108991', email: user.email, expiryDate: new Date(Date.now() + 86400000 * 3).toISOString() }
      ]);
    }
  }, [user]);

  const handleLogin = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setStep('landing');
    setActiveTab('home');
  };

  const handleDataExtracted = (newData: ExtractedData) => {
    setExtractedData(prev => ({ ...prev, ...newData }));
  };

  const handleUpdateData = (updatedData: ExtractedData) => {
    setExtractedData(updatedData);
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  if (!securityService.isActive(user.status)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-red-500/10 border border-red-500/20 p-8 rounded-[40px]">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Acceso Denegado</h2>
          <p className="text-slate-400 text-sm mb-6">Su cuenta ha sido desactivada por seguridad (reporte de extravío o cambio administrativo).</p>
          <button onClick={handleLogout} className="text-white font-bold underline">Volver al inicio</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 flex flex-col overflow-x-hidden relative">
      <Header
        title={step === 'landing' ? "RCV Digital" : "Registro"}
        showBack={step !== 'landing'}
        onBack={() => setStep('landing')}
        onNotificationsClick={() => setIsNotifOpen(true)}
        hasUnread={notificationService.getNotifications().some(n => !n.read)}
      />

      <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

      {/* Background Decor */}
      <div className="fixed top-[-200px] left-[-200px] w-[600px] h-[600px] bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-brand-secondary/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Logout Overlay Button (Dev only) */}
      <button
        onClick={handleLogout}
        className="fixed top-20 right-6 z-[60] bg-white/5 hover:bg-red-500/20 p-2 rounded-full text-slate-500 hover:text-red-500 transition-all border border-white/5"
      >
        <LogOut className="w-4 h-4" />
      </button>

      <EmergencyActions onReportAccident={() => setStep('accident_report')} />

      <AnimatePresence mode="wait">
        {user.role === 'cliente' && (
          <div key="cliente-flow" className="pb-24">
            {activeTab === 'home' && (
              <>
                {step === 'landing' && <LandingScreen key="landing" onNext={() => setStep('registration')} />}
                {step === 'registration' && <RegistrationFlow key="registration" onComplete={(data) => {
                  setExtractedData(prev => ({ ...prev, ...data }));
                  setStep('payment');
                }} />}
                {step === 'payment' && <PaymentScreen key="payment" amount={51.30} onBack={() => setStep('registration')} onSuccess={() => setStep('success')} />}
                {step === 'success' && <SuccessScreen key="success" data={extractedData} onReset={() => setStep('landing')} />}
                {step === 'accident_report' && <AccidentReportScreen key="accident" onBack={() => setStep('landing')} onSuccess={() => setStep('landing')} />}
              </>
            )}

            {activeTab === 'drones' && <DroneRCScreen key="drones" />}
            {activeTab === 'settings' && <SettingsScreen key="settings" />}
            {activeTab === 'policies' && (
              <div className="pt-24 px-6 text-center">
                <ShieldCheck size={48} className="mx-auto text-brand-primary mb-4 opacity-20" />
                <h3 className="text-xl font-bold text-white mb-2">Mis Pólizas</h3>
                <p className="text-slate-500 text-sm">Próximamente: Historial completo de coberturas.</p>
              </div>
            )}

            <BottomNav activeTab={activeTab} onChange={(tab) => {
              setActiveTab(tab);
              if (tab !== 'home') setStep('landing');
            }} />
          </div>
        )}

        {user.role === 'operador' && <OperatorDashboard key="operator" />}
        {user.role === 'contador' && <AdminDashboard key="contador" currentRole="contador" />}
        {user.role === 'admin' && <AdminDashboard key="admin" currentRole="admin" />}
      </AnimatePresence>

      <div className="fixed bottom-24 md:bottom-8 left-0 right-0 text-center text-slate-600 text-[8px] uppercase tracking-[0.4em] font-bold z-0 pointer-events-none">
        Secure Transaction Layer • v2.6.0 • ROLE: {user.role.toUpperCase()}
      </div>
    </div>
  );
}
