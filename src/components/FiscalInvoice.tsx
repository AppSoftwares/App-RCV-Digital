import React from 'react';
import { Shield, QrCode } from 'lucide-react';
import { ExtractedData } from '../lib/gemini';

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

  return (
    <div className="bg-white text-slate-900 p-8 shadow-2xl max-w-[800px] mx-auto font-serif border border-slate-200" id="fiscal-invoice">
      {/* Encabezado Emisor */}
      <div className="flex justify-between mb-8">
        <div className="flex gap-4 items-center">
          <div className="bg-slate-900 text-white p-3 rounded-lg">
            <Shield size={40} />
          </div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight">RCV Digital Services, C.A.</h1>
            <p className="text-[10px] font-bold">RIF: J-50344514-1</p>
            <p className="text-[9px] leading-tight max-w-[300px]">
              AV. PRINCIPAL DE LAS MERCEDES, EDIF. TORRE DIGITAL, PISO 12, OFIC. 12-A.
              CARACAS, DISTRITO CAPITAL. ZONA POSTAL 1060.
              Teléfono: 0212-952.00.00 | Correo: facturacion@rcvdigital.com
            </p>
            <p className="text-[9px] font-bold mt-1">Código de Actividad Económica: 65121</p>
          </div>
        </div>
        <div className="text-right border-l border-slate-200 pl-6">
          <h2 className="text-blue-700 font-bold text-lg mb-1">FACTURA</h2>
          <div className="text-[10px] space-y-0.5">
            <p><span className="font-bold">N° Documento:</span> {invoiceNumber}</p>
            <p><span className="font-bold">Fecha de emisión:</span> {date}</p>
            <p><span className="font-bold">Hora de emisión:</span> {new Date().toLocaleTimeString('es-VE')}</p>
            <p className="text-red-600 font-bold"><span className="text-slate-900">N° de Control:</span> {controlNumber}</p>
            <p><span className="font-bold">Fecha de asignación:</span> {date}</p>
          </div>
        </div>
      </div>

      {/* Datos del Cliente */}
      <div className="border border-slate-300 rounded-lg p-4 mb-6 flex justify-between text-[11px]">
        <div className="space-y-1">
          <p><span className="font-bold uppercase">Nombre o Razón Social:</span> {data.nombre || 'CLIENTE FINAL'}</p>
          <p><span className="font-bold uppercase">Domicilio Fiscal:</span> {data.direccion || 'VENEZUELA'}</p>
          <p><span className="font-bold uppercase">RIF/CI:</span> {data.cedula || 'V-00000000'}</p>
          <p><span className="font-bold uppercase">Teléfono:</span> {data.telefono || 'N/A'}</p>
        </div>
        <div className="text-right space-y-1">
          <p><span className="font-bold uppercase">Condición de Pago:</span> CONTADO</p>
          <p><span className="font-bold uppercase">Tipo Venta:</span> INTERNA</p>
          <div className="mt-2 inline-block border-2 border-slate-900 p-1">
             <QrCode size={60} />
          </div>
        </div>
      </div>

      {/* Tabla de Conceptos */}
      <table className="w-full text-[10px] mb-8 border-collapse">
        <thead>
          <tr className="border-y border-slate-300 bg-slate-50 text-center font-bold">
            <th className="py-2 px-1 border-r border-slate-200">Cant.</th>
            <th className="py-2 px-1 border-r border-slate-200">Código</th>
            <th className="py-2 px-1 border-r border-slate-200 w-1/2">Concepto / Descripción</th>
            <th className="py-2 px-1 border-r border-slate-200">Unid.</th>
            <th className="py-2 px-1 border-r border-slate-200">Precio Unitario</th>
            <th className="py-2 px-1 border-r border-slate-200">% Desc.</th>
            <th className="py-2 px-1 border-r border-slate-200">Alic.</th>
            <th className="py-2 px-1">Importe</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-100 text-center">
            <td className="py-3 border-r border-slate-100">1</td>
            <td className="py-3 border-r border-slate-100">RCV-2026</td>
            <td className="py-3 border-r border-slate-100 text-left px-2 italic">
              Póliza de Responsabilidad Civil de Vehículos (RCV). Vigencia Anual.
              Vehículo: {data.marca} {data.modelo} | Placa: {data.placa}
            </td>
            <td className="py-3 border-r border-slate-100">SERVICIO</td>
            <td className="py-3 border-r border-slate-100">{taxableBaseBs.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.</td>
            <td className="py-3 border-r border-slate-100">0.00%</td>
            <td className="py-3 border-r border-slate-100">(G)</td>
            <td className="py-3 font-bold">{taxableBaseBs.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.</td>
          </tr>
        </tbody>
      </table>

      {/* Totales */}
      <div className="flex justify-between items-start">
        <div className="text-[9px] text-slate-500 max-w-[400px]">
          <p className="font-bold text-slate-700 mb-1">Tipo de cambio BCV a la fecha de emisión: {bcvRate.toLocaleString('es-VE', {minimumFractionDigits: 4})} Bs/USD</p>
          <p className="leading-tight italic">
            Este pago estará sujeto al cobro adicional del 3% del Impuesto a las Grandes Transacciones Financieras (IGTF),
            de conformidad con la Providencia Administrativa SNAT/2022/000013 publicada en la G.O. N 42.339 del 17-03-2022.
            Este documento se expresa en divisas con su equivalente en Bolívares al tipo de cambio corriente del mercado a la fecha de su emisión.
          </p>
        </div>

        <div className="w-[300px]">
          <table className="w-full text-[11px] border-collapse">
            <tr className="border-b border-slate-200">
              <td className="py-1 px-2 font-bold">SubTotal:</td>
              <td className="py-1 px-2 text-right text-slate-500">{taxableBaseUsd.toLocaleString('en-US', {minimumFractionDigits: 2})} USD</td>
              <td className="py-1 px-2 text-right font-bold">{taxableBaseBs.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-1 px-2 font-bold">Exento:</td>
              <td className="py-1 px-2 text-right text-slate-500">0.00 USD</td>
              <td className="py-1 px-2 text-right font-bold">0,00 Bs.</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-1 px-2 font-bold">Base Imponible 16,00%:</td>
              <td className="py-1 px-2 text-right text-slate-500">{taxableBaseUsd.toLocaleString('en-US', {minimumFractionDigits: 2})} USD</td>
              <td className="py-1 px-2 text-right font-bold">{taxableBaseBs.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-1 px-2 font-bold">IVA 16,00%:</td>
              <td className="py-1 px-2 text-right text-slate-500">{ivaUsd.toLocaleString('en-US', {minimumFractionDigits: 2})} USD</td>
              <td className="py-1 px-2 text-right font-bold">{ivaBs.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-1 px-2 font-bold">IGTF (3%):</td>
              <td className="py-1 px-2 text-right text-slate-500">0.00 USD</td>
              <td className="py-1 px-2 text-right font-bold">0,00 Bs.</td>
            </tr>
            <tr className="bg-slate-900 text-white">
              <td className="py-2 px-2 font-bold uppercase">Total:</td>
              <td className="py-2 px-2 text-right font-bold">{amountUsd.toLocaleString('en-US', {minimumFractionDigits: 2})} USD</td>
              <td className="py-2 px-2 text-right font-bold">{amountBs.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.</td>
            </tr>
          </table>
        </div>
      </div>

      {/* Pie de Página Legal */}
      <div className="mt-12 pt-4 border-t-2 border-slate-900 text-center">
        <p className="text-[9px] font-bold uppercase mb-2">
          DOCUMENTO EMITIDO DE ACUERDO A LO DISPUESTO EN LA PROVIDENCIA ADMINISTRATIVA SNAT/2024/000102 DE FECHA 17/10/2024
        </p>
        <p className="text-[8px] leading-tight text-slate-600">
          PROVEEDOR DE CERTIFICADOS RCV DIGITAL ITPB, C.A. J-50344514-1, AV. PRINCIPAL LAS MERCEDES, TORRE DIGITAL, PISO 12, CARACAS.
          Imprenta Digital Autorizada mediante la Providencia Administrativa Nro. SENIAT/INTI/2021/0000064 de fecha 13-05-2021.
          Nro de Control desde 00-100001 hasta el Nro. 00-200000 generados digitalmente en fecha {date} {new Date().toLocaleTimeString('es-VE')}.
        </p>
      </div>
    </div>
  );
};
