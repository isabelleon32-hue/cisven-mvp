import React, { useState } from 'react';

export default function TechnicianApp({ setView, appointments, onUpdateTechReport }) {
  const [selectedApp, setSelectedApp] = useState(null);
  const [reportText, setReportText] = useState('');
  const [usedHardware, setUsedHardware] = useState('');
  const [metersDeployed, setMetersDeployed] = useState('');

  // Filtrar solo las citas que están destinadas a terreno (Asignadas, En Ruta o en revisión)
  const myTasks = appointments.filter(app => app.status === 'Asignado' || app.status === 'En Ruta' || app.status === 'Revisión Técnico');

  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!reportText.trim()) return alert('Por favor, ingrese el detalle del reporte técnico.');
    
    const meters = parseInt(metersDeployed) || 0;
    
    // Enviar los datos del terreno de vuelta al cerebro global
    onUpdateTechReport(selectedApp.id, reportText, usedHardware, meters);
    
    alert('🚀 Reporte de campo transmitido a la Central con éxito. Estado cambiado a Revisión.');
    setSelectedApp(null);
    setReportText('');
    setUsedHardware('');
    setMetersDeployed('');
  };

  return (
    <div className="min-h-screen bg-[#021312] text-xs text-emerald-100 font-sans p-4 w-full">
      {/* Encabezado de la App Móvil del Técnico */}
      <div className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-950 flex justify-between items-center mb-4 shadow-xl">
        <div>
          <h1 className="text-sm font-black text-white uppercase tracking-wider">👷 MÓVIL EN TERRENO</h1>
          <p className="text-[10px] text-teal-400 font-bold mt-0.5">Sincronización Operativa CISVEN</p>
        </div>
        <button 
          type="button" 
          onClick={() => { setView('landing'); setSelectedApp(null); }} 
          className="bg-[#042120] hover:bg-red-950 border border-teal-900 text-teal-400 hover:text-red-400 font-black px-3 py-2 rounded-xl transition-colors"
        >
          🔒 Salir
        </button>
      </div>

      {/* Contenido Principal */}
      {!selectedApp ? (
        <div className="space-y-3">
          <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-wide px-1">📋 Órdenes de Trabajo Asignadas</h2>
          
          {myTasks.length === 0 ? (
            <div className="p-8 bg-[#0a3a37]/30 border border-teal-950/60 rounded-2xl text-center italic text-teal-600 font-bold">
              No tienes rutas o incidentes despachados por la central en este momento.
            </div>
          ) : (
            myTasks.map(app => (
              <div 
                key={app.id} 
                onClick={() => { if (app.status !== 'Revisión Técnico') setSelectedApp(app); }}
                className={`p-4 rounded-xl border transition-all shadow-md ${app.status === 'Revisión Técnico' ? 'bg-[#042120]/40 border-teal-950 opacity-60 cursor-not-allowed' : 'bg-[#0a3a37] hover:bg-[#0d4743] border-teal-900 cursor-pointer active:scale-[0.99]'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-white text-sm">{app.user}</h3>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase font-mono ${app.status === 'En Ruta' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : app.status === 'Revisión Técnico' ? 'bg-amber-950 text-[#ecc245] border border-amber-900' : 'bg-teal-950 text-teal-400 border border-teal-900'}`}>
                    {app.status === 'Asignado' ? 'En Espera' : app.status}
                  </span>
                </div>
                
                <div className="space-y-1 text-teal-200">
                  <p className="font-bold"><span className="text-gray-400">🛠️ Servicio:</span> {app.service}</p>
                  <p><span className="text-gray-400">📍 Dirección:</span> <span className="text-white font-medium">{app.address}</span></p>
                  <p><span className="text-gray-400">📞 Teléfono:</span> <span className="text-teal-300 font-mono font-bold">{app.phone}</span></p>
                </div>

                {app.status === 'Revisión Técnico' && (
                  <p className="text-[9px] font-bold text-[#ecc245] mt-2 bg-amber-950/40 p-1.5 rounded border border-amber-900/40 italic">
                    ⏳ Esperando validación y cierre de la mesa de control central.
                  </p>
                )}
                
                {app.status !== 'Revisión Técnico' && (
                  <div className="text-right text-[10px] text-emerald-400 font-black mt-2 underline tracking-wider">
                    Abrir Orden y Reportar Terreno →
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        /* Formulario de Reporte de la Orden Seleccionada */
        <div className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-900 space-y-4 shadow-2xl">
          <div className="flex justify-between items-center border-b border-teal-950 pb-2">
            <div>
              <h2 className="font-black text-white text-sm">Cierre de Orden de Campo</h2>
              <p className="text-[9px] text-teal-400">Cliente: {selectedApp.user}</p>
            </div>
            <button 
              type="button" 
              onClick={() => setSelectedApp(null)} 
              className="bg-[#042120] text-teal-400 px-3 py-1 rounded-lg font-bold"
            >
              ← Volver
            </button>
          </div>

          <form onSubmit={handleSubmitReport} className="space-y-4">
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">
                📝 Observaciones y Detalles del Trabajo (Bitácora)
              </label>
              <textarea
                required
                rows="4"
                value={reportText}
                onChange={e => setReportText(e.target.value)}
                placeholder="Ej: Se instalaron las 4 cámaras perimetrales, enlace configurado con el nodo principal y tests de velocidad conformes..."
                className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">
                  📦 Hardware / Equipos Utilizados
                </label>
                <input
                  type="text"
                  value={usedHardware}
                  onChange={e => setUsedHardware(e.target.value)}
                  placeholder="Ej: 4 Cámaras Bullet, 1 DVR 4CH, 1 Fuente"
                  className="w-full p-2.5 bg-[#042120] border border-teal-950 rounded-xl text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">
                  📏 Metraje de Cable Desplegado (Fibra/UTP)
                </label>
                <input
                  type="number"
                  value={metersDeployed}
                  onChange={e => setMetersDeployed(e.target.value)}
                  placeholder="Ej: 35"
                  className="w-full p-2.5 bg-[#042120] border border-teal-950 rounded-xl text-white font-mono font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#021312] font-black py-3 rounded-xl uppercase tracking-wider text-[11px] shadow-lg active:scale-[0.98] transition-all"
            >
              🚀 Transmitir Cierre Operativo a Central
            </button>
          </form>
        </div>
      )}
    </div>
  );
}