import React, { useState } from 'react';

export default function SmartQuoter({ catalog, currentUser, onSendQuote, onManualSchedule }) {
  // Secciones: 0=Inicio, 1=Cotizar, 2=Agendar, 3=Alerta
  const [activeView, setActiveView] = useState(0); 
  
  return (
    <div className="flex flex-col h-full">
      {/* 1. Área de Contenido Dinámico */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeView === 0 && (
          <div className="text-white">
            <h2 className="text-lg font-bold mb-4">Tus Servicios</h2>
            <div className="bg-[#0a3a37] p-4 rounded-xl border border-teal-900">
              <p>Hola, {currentUser?.name}</p>
              <p className="text-sm text-teal-400">Estado: {currentUser?.status || 'Activo'}</p>
              <p className="mt-2 text-xs">Instalación: {currentUser?.installedHardware || 'No disponible'}</p>
            </div>
          </div>
        )}
        
        {activeView === 1 && (
          <div className="text-white">
            <h2 className="text-lg font-bold mb-4">Nueva Cotización</h2>
            {/* Aquí tus campos de nombre, sector, sedes */}
            <input placeholder="Nombre" className="w-full p-2 mb-2 bg-[#042120] rounded" />
            <input placeholder="Sector" className="w-full p-2 mb-2 bg-[#042120] rounded" />
            <button className="w-full bg-emerald-500 p-2 rounded text-black font-bold">Enviar</button>
          </div>
        )}
        
        {activeView === 2 && <div className="text-white"><h2>Agendar Visita</h2></div>}
        {activeView === 3 && <div className="text-white"><h2>BOTÓN DE PÁNICO</h2></div>}
      </div>

      {/* 2. Barra de Navegación Inferior (Las 4 secciones) */}
      <div className="grid grid-cols-4 bg-[#042120] p-2 border-t border-teal-900">
        <NavButton active={activeView === 0} onClick={() => setActiveView(0)} label="Inicio" />
        <NavButton active={activeView === 1} onClick={() => setActiveView(1)} label="Cotizar" />
        <NavButton active={activeView === 2} onClick={() => setActiveView(2)} label="Agendar" />
        <NavButton active={activeView === 3} onClick={() => setActiveView(3)} label="Alerta" />
      </div>
    </div>
  );
}

const NavButton = ({ active, onClick, label }) => (
  <button onClick={onClick} className={`p-2 text-[9px] font-bold uppercase ${active ? 'text-emerald-500' : 'text-gray-500'}`}>
    {label}
  </button>
);