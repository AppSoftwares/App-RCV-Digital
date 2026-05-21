import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Car, Shield, FileText, Camera, ArrowRight, ArrowLeft,
  CheckCircle2, MapPin, Briefcase, Phone, Mail, Calendar, ShieldCheck
} from 'lucide-react';
import { VENEZUELA_STATES, VEHICLE_BRANDS, POLICE_ORGANISMS } from '../data/venezuelaData';

type TabType = 'personal' | 'vehicle' | 'police' | 'documents';

export const RegistrationFlow: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [isPolice, setIsPolice] = useState(false);

  // State simplificado para el formulario
  const [formData, setFormData] = useState({
    nombres: '', apellidos: '', cedulaNumero: '', email: '',
    placa: '', marca: '', modelo: '', año: 2024,
    funcionario: { esFuncionario: false, organismo: '', rango: '' }
  });

  const tabs: {id: TabType, label: string, icon: any}[] = [
    { id: 'personal', label: 'Personales', icon: <User size={18}/> },
    { id: 'vehicle', label: 'Vehículo', icon: <Car size={18}/> },
    { id: 'police', label: 'Policial', icon: <Shield size={18}/> },
    { id: 'documents', label: 'Documentos', icon: <FileText size={18}/> },
  ];

  const next = () => {
    if (activeTab === 'personal') setActiveTab('vehicle');
    else if (activeTab === 'vehicle') setActiveTab('police');
    else if (activeTab === 'police') setActiveTab('documents');
  };

  const back = () => {
    if (activeTab === 'documents') setActiveTab('police');
    else if (activeTab === 'police') setActiveTab('vehicle');
    else if (activeTab === 'vehicle') setActiveTab('personal');
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-32 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Tabs de Navegación */}
        <div className="flex bg-slate-900/50 p-2 rounded-2xl border border-white/5 mb-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'personal' && (
            <motion.div key="personal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="bg-slate-900/80 border border-white/10 rounded-[40px] p-8 shadow-2xl">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                   <div className="w-32 h-32 bg-white/5 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-brand-primary transition-all shrink-0">
                      <Camera className="text-slate-500 group-hover:text-brand-primary" />
                      <span className="text-[8px] font-bold text-slate-500 uppercase">Foto Perfil</span>
                   </div>
                   <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField label="Nombres" placeholder="Ej: Jesús Enrique" />
                      <InputField label="Apellidos" placeholder="Ej: Pirela Espejo" />
                      <div className="grid grid-cols-3 gap-2">
                         <SelectField label="Tipo" options={['V', 'E', 'J', 'G']} />
                         <div className="col-span-2">
                            <InputField label="Número Cédula" placeholder="00000000" />
                         </div>
                      </div>
                      <InputField label="Fecha Nacimiento" placeholder="DD/MM/AAAA" type="date" />
                      <SelectField label="Estado Residencia" options={VENEZUELA_STATES} />
                      <InputField label="Correo Electrónico" placeholder="usuario@correo.com" />
                   </div>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-white/10 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-white font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
                   <ShieldCheck className="text-brand-primary" size={16}/> Información de Póliza
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <SelectField label="Tipo Póliza" options={['RCV', 'BPV', 'TPG', 'Casco Amplio']} />
                   <InputField label="Fecha Inicio" type="date" />
                   <InputField label="Monto Asegurado ($)" placeholder="0.00" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'vehicle' && (
            <motion.div key="vehicle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
               <div className="bg-slate-900/80 border border-white/10 rounded-[40px] p-8 shadow-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                     <InputField label="Placa" placeholder="AAA-000" />
                     <SelectField label="Marca" options={VEHICLE_BRANDS} />
                     <InputField label="Modelo" placeholder="Ej: Corolla" />
                     <InputField label="Año" type="number" />
                     <InputField label="N° Serial Chasis (VIN)" placeholder="17 dígitos" />
                     <InputField label="N° Motor" placeholder="Código de motor" />
                  </div>

                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Fotos del Vehículo</h4>
                  <div className="grid grid-cols-3 gap-4">
                     <PhotoPlaceholder label="Frente" />
                     <PhotoPlaceholder label="Lateral" />
                     <PhotoPlaceholder label="Trasero" />
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'police' && (
            <motion.div key="police" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <div className="bg-slate-900/80 border border-white/10 rounded-[40px] p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                     <div>
                        <h3 className="text-white font-bold text-lg">Estatus Policial</h3>
                        <p className="text-xs text-slate-500">¿El asegurado es funcionario de seguridad?</p>
                     </div>
                     <button
                        onClick={() => setIsPolice(!isPolice)}
                        className={`w-14 h-8 rounded-full transition-all relative ${isPolice ? 'bg-brand-primary' : 'bg-slate-800'}`}
                     >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isPolice ? 'left-7' : 'left-1'}`} />
                     </button>
                  </div>

                  {isPolice && (
                     <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <SelectField label="Organismo" options={POLICE_ORGANISMS} />
                        <InputField label="Rango / Jerarquía" placeholder="Ej: Inspector" />
                        <InputField label="Unidad Asignada" placeholder="Ej: Sub-Delegación" />
                        <InputField label="N° Credencial" placeholder="Carnet institucional" />
                        <div className="col-span-2 grid grid-cols-2 gap-4 mt-4">
                           <PhotoPlaceholder label="Foto Credencial" />
                           <PhotoPlaceholder label="Foto Cédula" />
                        </div>
                     </motion.div>
                  )}
               </div>
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div key="documents" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <div className="bg-slate-900/80 border border-white/10 rounded-[40px] p-8 shadow-2xl space-y-8">
                  <section>
                     <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Cédula de Identidad</h4>
                     <div className="grid grid-cols-2 gap-4">
                        <PhotoPlaceholder label="Anverso (Frente)" tall />
                        <PhotoPlaceholder label="Reverso (Dorso)" tall />
                     </div>
                  </section>
                  <section>
                     <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Carnet de Circulación</h4>
                     <PhotoPlaceholder label="Capturar Documento Completo" fullWidth />
                  </section>

                  <div className="pt-8 border-t border-white/5">
                     <button
                        onClick={() => onComplete(formData)}
                        className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                     >
                        ✓ Guardar Registro Completo
                     </button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navegación Inferior */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 p-4 z-50">
           <div className="max-w-4xl mx-auto flex gap-4">
              {activeTab !== 'personal' && (
                <button onClick={back} className="flex-1 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
                   <ArrowLeft size={18}/> Anterior
                </button>
              )}
              {activeTab !== 'documents' && (
                <button onClick={next} className="flex-[2] py-4 bg-brand-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20">
                   Siguiente <ArrowRight size={18}/>
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, placeholder, type = "text" }: any) => (
  <div className="space-y-2">
    <p className="text-[10px] font-black text-slate-500 uppercase px-1 tracking-widest">{label}</p>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm focus:border-brand-primary outline-none transition-all"
    />
  </div>
);

const SelectField = ({ label, options }: any) => (
  <div className="space-y-2">
    <p className="text-[10px] font-black text-slate-500 uppercase px-1 tracking-widest">{label}</p>
    <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm focus:border-brand-primary outline-none appearance-none">
      {options.map((opt: string) => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
    </select>
  </div>
);

const PhotoPlaceholder = ({ label, tall, fullWidth }: any) => (
  <div className={`bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-primary transition-all p-4 ${tall ? 'aspect-[3/4]' : fullWidth ? 'aspect-video' : 'aspect-square'}`}>
    <Camera className="text-slate-600" size={24} />
    <span className="text-[8px] font-bold text-slate-500 uppercase text-center">{label}</span>
  </div>
);
