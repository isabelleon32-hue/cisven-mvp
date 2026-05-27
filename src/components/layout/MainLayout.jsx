import React from 'react';

export default function MainLayout({ children, onLogout }) {
  return (
    <div className="min-h-screen bg-[#021312] flex flex-col justify-center items-center p-0 md:p-4 antialiased font-sans">
      {/* Contenedor con la Maqueta Rígida de Celular para resguardar la identidad visual */}
      <div className="w-full max-w-md min-h-screen md:min-h-[85vh] bg-[#021312] flex flex-col shadow-2xl relative border-x border-teal-900/60 md:rounded-3xl overflow-hidden">
        
        {/* Barra superior de control integrada */}
        <div className="bg-[#042120] border-b border-teal-950 px-4 py-3 flex justify-between items-center select-none">
          <div>
            <h1 className="text-xs font-black text-white tracking-widest">CIS<span className="text-gray-400">VEN</span> MÓVIL</h1>
          </div>
          <button 
            onClick={onLogout} 
            className="bg-[#021312] hover:bg-red-950/40 text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-red-900/30 transition-all"
          >
            Salir
          </button>
        </div>

        {/* Área del Cotizador / Contenido */}
        <main className="flex-1 overflow-y-auto pb-4">
          {children}
        </main>
        
      </div>
    </div>
  );
}