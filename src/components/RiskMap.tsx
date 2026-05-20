import React from 'react';

/**
 * Mapa de Riesgo utilizando OpenStreetMap (Leaflet).
 * La opción más funcional y 100% gratuita.
 *
 * NOTA: Requiere instalar: npm install leaflet react-leaflet
 * Para propósitos de este prototipo, usaremos un iframe con capas de riesgo de OSM
 * para evitar errores de compilación antes de que instales las dependencias.
 */
export const RiskMap: React.FC<{ lat?: number, lng?: number, zoom?: number }> = ({
  lat = 10.4806,
  lng = -66.9036,
  zoom = 13
}) => {
  return (
    <div className="w-full h-full min-h-[300px] bg-slate-900 rounded-[32px] overflow-hidden border border-white/10 relative group">
      {/* Simulación de Mapa con capas de OpenStreetMap */}
      <iframe
        title="RCV Risk Map"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.05}%2C${lat-0.05}%2C${lng+0.05}%2C${lat+0.05}&layer=mapnik`}
        className="grayscale invert brightness-50 opacity-80 group-hover:opacity-100 transition-opacity"
      ></iframe>

      {/* Overlay de Datos de Riesgo */}
      <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="bg-slate-950/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
             <p className="text-[10px] font-black text-brand-primary uppercase mb-1">Capa de Riesgo Activa</p>
             <h4 className="text-white text-xs font-bold flex items-center gap-2">
               <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
               Zonas de Alta Siniestralidad
             </h4>
          </div>
          <div className="bg-slate-950/80 backdrop-blur-md border border-white/10 p-2 rounded-xl flex flex-col gap-2">
             <div className="w-6 h-6 bg-white/5 rounded-md flex items-center justify-center text-white text-xs">+</div>
             <div className="w-6 h-6 bg-white/5 rounded-md flex items-center justify-center text-white text-xs">-</div>
          </div>
        </div>

        <div className="flex gap-2">
           <RiskBadge label="Bajo" color="bg-emerald-500" />
           <RiskBadge label="Medio" color="bg-amber-500" />
           <RiskBadge label="Alto" color="bg-red-500" />
        </div>
      </div>

      {/* Indicador de "Live" */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
         <div className="relative">
            <div className="absolute inset-0 bg-brand-primary rounded-full animate-ping opacity-20 scale-150"></div>
            <div className="w-4 h-4 bg-brand-primary rounded-full border-2 border-white shadow-2xl"></div>
         </div>
      </div>
    </div>
  );
};

interface RiskBadgeProps {
  label: string;
  color: string;
}

const RiskBadge = ({ label, color }: RiskBadgeProps) => (
  <div className="bg-slate-950/80 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-full flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${color}`}></div>
    <span className="text-[9px] font-bold text-white uppercase">{label}</span>
  </div>
);
