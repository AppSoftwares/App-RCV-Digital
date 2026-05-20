import React from 'react';
import { Shield, Heart, Phone, Info } from 'lucide-react';
import { ExtractedData } from '../lib/gemini';

interface PhysicalCredentialProps {
  data: ExtractedData & { medicalInfo?: { tipoSangre?: string; alergias?: boolean } };
}

export const PhysicalCredential: React.FC<PhysicalCredentialProps> = ({ data }) => {
  return (
    <div className="bg-white p-8 rounded-[40px] shadow-2xl max-w-sm mx-auto overflow-hidden">
      {/* Parte para el vidrio/casco */}
      <div className="border-4 border-slate-900 rounded-[32px] p-6 relative">
        <div className="absolute top-0 right-0 bg-slate-900 text-white px-4 py-1 rounded-bl-2xl text-[10px] font-bold uppercase tracking-widest">
          RCV DIGITAL 2026
        </div>

        <div className="flex items-center gap-4 mb-6 pt-4">
          <div className="bg-brand-primary p-3 rounded-2xl text-white">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-slate-900 font-black text-xl leading-none">IDENTIDAD VIAL</h4>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Válido en Territorio Nacional</p>
          </div>
        </div>

        <div className="bg-slate-100 rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">PLACA IDENTIFICADORA</p>
              <p className="text-3xl font-black text-slate-900 font-mono leading-none">{data.placa || "AA123BB"}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">PÓLIZA</p>
              <p className="text-xs font-bold text-slate-900">RCV-2024-V</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4">
            <div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">MARCA</p>
              <p className="text-xs font-bold text-slate-900">{data.marca || "TOYOTA"}</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">TITULAR</p>
              <p className="text-xs font-bold text-slate-900 truncate">{data.nombre || "JUAN PEREZ"}</p>
            </div>
          </div>
        </div>

        {/* Zona de Emergencia QR */}
        <div className="flex gap-4 items-center bg-red-50 p-4 rounded-3xl border border-red-100">
          <div className="bg-white p-2 rounded-2xl shadow-sm">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3PAut2MiDVYdxZ5Zp2UCyexO1Fom7C-Fwmm3hkMhKcifpc2443qtDpHpG5yMa0f5Aufr2wJX3BJ7dNQ56_TKh6mots-BUsRoN0cR9trn37UpWhWxC5Md1GWzVQ_Yi_WHtfDhsEwQ8SEZhEgn6pBH3SZkrtnJ3DRwO1eOnSdwYnCBQC8LFdNbsKhrTzL7zQQ6Kz5j9hePtZZilCk56IV3iv19pu_80joticBPg1EXiwxlexTvg326mkRMuU0mi7g-7BOsY6ygXmbXk" className="w-16 h-16 grayscale contrast-125" alt="Emergency QR" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-red-600 mb-1">
              <Heart className="w-3 h-3 fill-current" />
              <p className="text-[10px] font-black uppercase tracking-tighter">S.O.S. INFO MÉDICA</p>
            </div>
            <p className="text-[8px] text-red-800 font-bold leading-tight">ESCANEE PARA CONTACTO DE EMERGENCIA Y GRUPO SANGUÍNEO.</p>
            <div className="mt-2 flex gap-2">
               <span className="text-[9px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">{data.medicalInfo?.tipoSangre || "ORH+"}</span>
               <span className="text-[9px] bg-slate-900 text-white px-2 py-0.5 rounded-full font-bold">ALERGIAS: {data.medicalInfo?.alergias ? 'SÍ' : 'NO'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
          <Info className="w-3 h-3" /> FORMALIZADO POR SUDEASEG 2026
        </p>
      </div>
    </div>
  );
};
