import React, { useState } from 'react';

export default function TechnicianApp({ setView, appointments, onUpdateTechReport }) {
  // Estado para simular la sesión del operador específico en terreno
  const [currentTech, setCurrentTech] = useState('Juan Pérez (Móvil 1)');
  const [selectedApp, setSelectedApp] = useState(null);
  const [reportText, setReportText] = useState('');
  const [usedHardware, setUsedHardware] = useState('');
  const [metersDeployed, setMetersDeployed] = useState('');

  const staffList = [
    'Juan Pérez (Móvil 1)',
    'Carlos Silva (Móvil 2)',
    'Andrés León (Móvil 3)'
  ];

  const safeAppointments = Array.isArray(appointments) ? appointments : [];

  // FILTRADO ESTRICTO: Solo las citas asignadas directamente a este operador
  const myTasks = safeAppointments.filter(app => app && app.technician === currentTech);

  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!reportText.trim()) return alert('Ingrese los detalles técnicos del cierre.');
    
    const meters = parseInt(metersDeployed) || 0;
    onUpdateTechReport(selectedApp.id, reportText, usedHardware, meters);
    
    alert('🚀 Reporte transmitido. Esperando validación de cierre desde Central.');
    setSelectedApp(null);
    setReportText(''); setUsedHardware(''); setMetersDeployed('');
  };

  return (
    <div className="min-h-screen bg-[#042120] flex justify-center items-start font-sans antialiased text-xs text-emerald-100 p-4">
      <div className="w-full max-w-md bg-[#021312] rounded-3xl border border-teal-900/60 shadow-2xl overflow-hidden p-4 space-y-4">
        
        {/* Encabezado Móvil de Operación */}
        <div className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-950 flex justify-between items-center shadow-md">
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-wider">👷 MÓVIL EN TERRENO</h1>
            <p className="text-[10px] text-teal-400 font-bold mt-0.5">Terminal Operativa de Red</p>
          </div>
          <button 
            type="button" 
            onClick={() => { setView(); setSelectedApp(null); }} 
            className="bg-[#042120] border border-teal-900 text-teal-400 font-black px-3 py-1.5 rounded-xl text-[10px]"
          >
            🔒 Salir
          </button>
        </div>

        {/* FILTRO DE SELECCIÓN DE TÉCNICO (REPARADO) */}
        {!selectedApp && (
          <div className="bg-[#042120] p-3 rounded-xl border border-teal-950 space-y-1.5">
            <label className="block text-[9px] font-black uppercase text-gray-400 tracking-wider">
              👤 Operador Logueado en Terminal:
            </label>
            <select 
              value={currentTech} 
              onChange={(e) => setCurrentTech(e.target.value)}
              className="w-full p-2.5 bg-[#0a3a37] border border-teal-900 rounded-lg text-white font-bold text-xs focus:outline-none"
            >
              {staffList.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        )}

        {/* Listado Principal de Tareas */}
        {!selectedApp ? (
          <div className="space-y-3">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-1">📋 Mi Hoja de Ruta Activa</h2>
            
            {myTasks.length === 0 ? (
              <div className="p-8 bg-[#0a3a37]/20 border border-teal-950/40 rounded-2xl text-center italic text-teal-600 font-bold">
                Sin órdenes asignadas para {currentTech.split(' ')[0]} hoy.
              </div>
            ) : (
              myTasks.map(app => (
                <div 
                  key={app.id} 
                  onClick={() => { if (app.status !== 'Revisión Técnico') setSelectedApp(app); }}
                  className={`p-4 rounded-xl border transition-all ${app.status === 'Revisión Técnico' ? 'bg-[#042120]/50 border-teal-950 opacity-60 cursor-not-allowed' : 'bg-[#0a3a37] hover:bg-[#0d4743] border-teal-900 cursor-pointer'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-white text-xs">{app.user}</h3>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase font-mono ${app.status === 'En Ruta' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : app.status === 'Revisión Técnico' ? 'bg-amber-950 text-[#ecc245] border border-amber-900' : 'bg-teal-950 text-teal-400 border border-teal-900'}`}>
                      {app.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-teal-200">
                    <p><span className="text-gray-400 font-bold">🛠️ Servicio:</span> {app.service}</p>
                    <p><span className="text-gray-400 font-bold">📍 Dirección:</span> {app.address}</p>
                  </div>

                  {app.status === 'Revisión Técnico' && (
                    <p className="text-[9px] font-bold text-[#ecc245] mt-2 bg-amber-950/40 p-1.5 rounded border border-amber-900/40 italic">
                      ⏳ Reporte enviado. Esperando validación de la Central.
                    </p>
                  )}

                  {app.status !== 'Revisión Técnico' && (
                    <div className="text-right text-[9px] text-emerald-400 font-black mt-2 tracking-wider uppercase">
                      Ingresar Reporte de Campo →
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          /* Formulario de Cierre Técnico */
          <div className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-900 space-y-4">
            <div className="flex justify-between items-center border-b border-teal-950 pb-2">
              <div>
                <h2 className="font-black text-white text-xs">Cierre de Incidente</h2>
                <p className="text-[9px] text-teal-400">Cliente: {selectedApp.user}</p>
              </div>
              <button type="button" onClick={() => setSelectedApp(null)} className="bg-[#042120] text-teal-400 px-2.5 py-1 rounded-lg font-bold">← Volver</button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">📝 Bitácora Técnico en Terreno</label>
                <textarea
                  required rows="3" value={reportText} onChange={e => setReportText(e.target.value)}
                  placeholder="Ej: Se instaló la base domo, cableado UTP canalizado por tubería existente. Enlace activo..."
                  className="w-full p-2.5 bg-[#042120] border border-teal-950 rounded-xl text-white font-medium text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">📦 Equipos</label>
                  <input type="text" value={usedHardware} onChange={e => setUsedHardware(e.target.value)} placeholder="Ej: 1 Domo 4K" className="w-full p-2 bg-[#042120] border border-teal-950 rounded-lg text-white font-bold" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">📏 Metros Cable</label>
                  <input type="number" value={metersDeployed} onChange={e => setMetersDeployed(e.target.value)} placeholder="Ej: 20" className="w-full p-2 bg-[#042120] border border-teal-950 rounded-lg text-white font-mono font-bold" />
                </div>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-[#021312] font-black py-2.5 rounded-xl uppercase tracking-wider text-[10px] shadow-lg">
                Transmitir Cierre a Central
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}