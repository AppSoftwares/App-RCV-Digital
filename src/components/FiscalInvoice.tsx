import React from 'react';
import { Shield } from 'lucide-react';
import { ExtractedData } from '../types';
import QRCode from 'react-qr-code';

interface FiscalInvoiceProps {
  data: ExtractedData;
  invoiceNumber: string;
  controlNumber: string;
  date: string;
  amountUsd: number;
  bcvRate: number;
}

export const FiscalInvoice: React.FC<FiscalInvoiceProps> = ({
  data,
  invoiceNumber,
  controlNumber,
  date,
  amountUsd,
  bcvRate,
}) => {
  const amountBs = amountUsd * bcvRate;
  const ivaRate = 0.16;
  const taxableBaseUsd = amountUsd / (1 + ivaRate);
  const ivaUsd = amountUsd - taxableBaseUsd;

  const taxableBaseBs = taxableBaseUsd * bcvRate;
  const ivaBs = ivaUsd * bcvRate;

  // Datos para el QR de validación (JSON)
  const qrData = JSON.stringify({
    empresa: "RCV DIGITAL C.A.",
    rif: "J-304554141",
    numeroDocumento: invoiceNumber,
    numeroControl: controlNumber,
    fechaEmision: date,
    totalBs: amountBs.toFixed(2),
    totalUSD: amountUsd.toFixed(2),
    rifCliente: data.cedula,
    hash: btoa(`${invoiceNumber}${data.cedula}${date}${amountBs.toFixed(2)}`).substring(0, 16)
  });

  return (
    <div className="bg-white text-slate-900 p-6 shadow-2xl max-w-[800px] mx-auto font-sans border border-slate-200" id="invoice-container">
      {/* SECCIÓN FACTURA FISCAL */}
      <div className="p-4 border-b-2 border-slate-100">
        <div className="flex justify-between mb-6">
          <div className="flex gap-3 items-start">
            <img
              src="https://img.freepik.com/vector-premium/plantilla-logotipo-seguro-automovil-diseno-logotipo-proteccion-automovil_564428-360.jpg"
              alt="Logo"
              className="w-20 h-20 object-contain rounded-xl shadow-sm border border-slate-100"
            />
            <div>
              <h1 className="text-lg font-black uppercase text-slate-900 leading-tight">RCV DIGITAL C.A.</h1>
              <p className="text-[9px] font-bold text-slate-700">RIF: J-304554141</p>
              <p className="text-[8px] leading-tight max-w-[280px] text-slate-500 mt-1">
                VENEZUELA, ESTADO ZULIA, MUNICIPIO MARACAIBO, PARROQUIA FRANCISCO EUGENIO BUSTAMANTE,
                URB EL ROSAL, AVENIDA 18 CON CALLE 77, EDIF TORRE JWM PISO SEIS (06) OF 1 POSTAL 1060.
              </p>
              <p className="text-[8px] text-slate-600 mt-1">Teléfono: 0212 952 41 65 | negocios@mercosur.com.ve</p>
              <p className="text-[8px] font-bold text-brand-primary">Código CAEV: 9499</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-blue-700 font-black text-xl mb-1 italic">FACTURA</h2>
            <div className="text-[9px] space-y-0.5 font-medium">
              <p><span className="font-bold">N° Documento:</span> {invoiceNumber}</p>
              <p><span className="font-bold">Fecha de emisión:</span> {date}</p>
              <p><span className="font-bold">Hora de emisión:</span> {new Date().toLocaleTimeString('es-VE')}</p>
              <p className="text-red-600 font-bold"><span className="text-slate-900">N° de Control:</span> {controlNumber}</p>
              <p><span className="font-bold">Fecha de asignación:</span> {date}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border border-slate-200 rounded-2xl p-4 mb-6 text-[10px] bg-slate-50/50">
          <div className="space-y-1.5">
            <p><span className="font-bold uppercase text-slate-500 text-[8px] block">Nombre o Razón Social</span> <span className="text-slate-900 font-bold">{data.nombre || 'CLIENTE REGISTRADO'}</span></p>
            <p><span className="font-bold uppercase text-slate-500 text-[8px] block">Domicilio Fiscal</span> <span className="text-slate-900">{data.direccion || 'ESTADO ZULIA, VENEZUELA'}</span></p>
            <p><span className="font-bold uppercase text-slate-500 text-[8px] inline">RIF/CI:</span> <span className="text-slate-900 font-bold ml-1">{data.cedula}</span></p>
            <p className="ml-4 inline"><span className="font-bold uppercase text-slate-500 text-[8px] inline">Teléfono:</span> <span className="text-slate-900 ml-1">{data.telefono}</span></p>
          </div>
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <p><span className="font-bold uppercase text-slate-500 text-[8px] block">Condición de Pago</span> <span className="text-slate-900 font-bold">CONTADO</span></p>
              <p><span className="font-bold uppercase text-slate-500 text-[8px] block">Tipo Venta</span> <span className="text-slate-900">INTERNA</span></p>
              <p><span className="font-bold uppercase text-slate-500 text-[8px] block">Comisiones</span> <span className="text-slate-900">Varias</span></p>
            </div>
            <div className="bg-white p-2 border border-slate-200 rounded-xl shadow-sm">
              <QRCode value={qrData} size={64} />
            </div>
          </div>
        </div>

        <table className="w-full text-[9px] mb-6 border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 font-bold uppercase text-[8px]">
              <th className="py-2 px-1 text-left border-b border-slate-200 pl-3">Cant. Código</th>
              <th className="py-2 px-1 text-left border-b border-slate-200">Concepto / Descripción</th>
              <th className="py-2 px-1 border-b border-slate-200">Unid.</th>
              <th className="py-2 px-1 border-b border-slate-200">P. Unitario</th>
              <th className="py-2 px-1 border-b border-slate-200">% Desc.</th>
              <th className="py-2 px-1 border-b border-slate-200">Alic.</th>
              <th className="py-2 px-1 text-right border-b border-slate-200 pr-3">Importe</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-50 text-slate-700">
              <td className="py-2 px-1 pl-3 font-bold">1 IS0071</td>
              <td className="py-2 px-1 italic">Emisión de Póliza RCV Anual - Vehículo {data.placa}</td>
              <td className="py-2 px-1 text-center">UNIDAD</td>
              <td className="py-2 px-1 text-center">{taxableBaseBs.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.</td>
              <td className="py-2 px-1 text-center">0.00%</td>
              <td className="py-2 px-1 text-center">(G)</td>
              <td className="py-2 px-1 text-right pr-3 font-bold">{taxableBaseBs.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.</td>
            </tr>
            <tr className="border-b border-slate-50 text-slate-700">
              <td className="py-2 px-1 pl-3 font-bold">1 IS0505</td>
              <td className="py-2 px-1 italic">Gastos Administrativos y Timbres Fiscales</td>
              <td className="py-2 px-1 text-center">UNIDAD</td>
              <td className="py-2 px-1 text-center">0,00 Bs.</td>
              <td className="py-2 px-1 text-center">0.00%</td>
              <td className="py-2 px-1 text-center">(G)</td>
              <td className="py-2 px-1 text-right pr-3 font-bold">0,00 Bs.</td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-between items-start mb-4">
          <div className="text-[7px] text-slate-400 max-w-[350px]">
            <p className="font-bold text-slate-600 mb-1">Tipo de cambio BCV: {bcvRate.toLocaleString('es-VE', {minimumFractionDigits: 4})} Bs/USD</p>
            <p className="leading-tight italic">
              Este pago estará sujeto al cobro adicional del 3% del IGTF, según G.O. 42.339.
              Valores expresados en divisas según Art. 128 BCV y Art. 25 Ley de IVA.
            </p>
          </div>
          <div className="w-[280px] bg-slate-50 border border-slate-200 p-2 rounded-xl">
            <table className="w-full text-[9px]">
              <tr className="text-slate-500"><td className="font-bold">SubTotal:</td><td className="text-right">{taxableBaseUsd.toLocaleString('en-US', {minimumFractionDigits: 2})} USD</td><td className="text-right font-bold text-slate-700">{taxableBaseBs.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.</td></tr>
              <tr className="text-slate-500"><td>Exento:</td><td className="text-right">0.00 USD</td><td className="text-right">0,00 Bs.</td></tr>
              <tr className="text-slate-700 border-t border-slate-200 mt-1 font-bold"><td>Total:</td><td className="text-right">{amountUsd.toLocaleString('en-US', {minimumFractionDigits: 2})} USD</td><td className="text-right text-lg">{amountBs.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.</td></tr>
            </table>
          </div>
        </div>
      </div>

      {/* SECCIÓN CUADRO CONTRATO (POLIZA) */}
      <div className="mt-6 border-2 border-dashed border-slate-300 p-4 rounded-[20px] relative overflow-hidden bg-white">
        {/* Marca de agua */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none rotate-[-15deg]">
          <Shield size={300} />
        </div>

        <div className="flex justify-between items-center mb-4 relative z-10">
          <h3 className="text-2xl font-black italic text-slate-800">R.C.V</h3>
          <div className="flex gap-6 text-[9px] font-bold">
            <div className="text-center">
              <p className="text-slate-400 uppercase text-[7px]">Fecha Expedición</p>
              <p className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">{date}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 uppercase text-[7px]">Vencimiento</p>
              <p className="bg-red-50 text-red-700 px-3 py-1 rounded-full border border-red-100">
                {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('es-VE')}
              </p>
            </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black text-slate-400 uppercase">App Seguros</p>
             <p className="text-[7px] text-slate-300">Seguridad en tus manos</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 relative z-10 border-t border-slate-100 pt-4">
          <div className="space-y-4">
             <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
               <h4 className="text-[8px] font-black uppercase text-slate-400 mb-2 border-b border-slate-200 pb-1">Características del Vehículo</h4>
               <div className="grid grid-cols-2 gap-2 text-[9px]">
                 <p><span className="font-bold">Marca:</span> {data.marca}</p>
                 <p><span className="font-bold">Modelo:</span> {data.modelo}</p>
                 <p><span className="font-bold">Color:</span> {data.color || 'N/A'}</p>
                 <p><span className="font-bold">Año:</span> {data.año || 'N/A'}</p>
                 <p className="col-span-2"><span className="font-bold">Placa:</span> {data.placa}</p>
                 <p className="col-span-2"><span className="font-bold text-[7px]">Serial Motor:</span> {Math.random().toString(36).toUpperCase().substring(0, 10)}</p>
               </div>
             </div>

             <div className="text-center p-2 border border-slate-100 rounded-xl">
               <p className="text-[10px] font-black text-slate-800">"APP ASISTENCIA C.A."</p>
               <p className="text-[8px] font-bold text-slate-400">RIF: J-31760070-3</p>
               <span className="text-[7px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold uppercase mt-1 inline-block">Activo</span>
             </div>
          </div>

          <div className="space-y-4">
             <div className="bg-slate-900 text-white p-3 rounded-xl">
                <h4 className="text-[8px] font-bold uppercase text-slate-400 mb-2">Contratante</h4>
                <p className="text-xs font-bold uppercase">{data.nombre}</p>
                <p className="text-[9px] text-slate-300">C.I: {data.cedula}</p>
             </div>

             <div className="text-[8px] text-slate-500 space-y-1">
                <p><span className="font-bold uppercase text-slate-400 text-[6px] block">Dirección</span> {data.direccion || 'VENEZUELA'}</p>
                <div className="mt-4 pt-2 border-t border-slate-100">
                   <p className="text-[10px] font-black text-slate-800">Código de Contrato: <span className="text-brand-primary">RCV-{invoiceNumber}</span></p>
                </div>
             </div>
          </div>
        </div>

        <div className="mt-4 text-[5.5px] text-slate-400 leading-tight border-t border-slate-50 pt-2 text-justify">
          Este contrato se rige por la ley de tránsito y transporte terrestre... (Texto legal simplificado).
          App Asistencia C.A. inscrita bajo el Nro 26 Tomo 82. Cobertura nacional 24/7.
        </div>
      </div>

      <div className="mt-4 text-center text-[7px] text-slate-300 font-bold uppercase tracking-[0.2em]">
        Documento Electrónico Validado Digitalmente • Sudeaseg Cert: 00-110369
      </div>
    </div>
  );
};
