export default function MainLayout({ children, onLogout }) {
  return (
    <div className="min-h-screen bg-[#021312] flex flex-col items-center">
      <div className="w-full max-w-[400px] min-h-screen bg-[#021312] shadow-2xl border-x border-teal-900 flex flex-col">
        {/* Header Móvil */}
        <div className="flex justify-between items-center p-4 bg-[#042120] border-b border-teal-900">
          <span className="text-white font-black">CIS<span className="text-emerald-500">VEN</span> MÓVIL</span>
          <button onClick={onLogout} className="text-[10px] text-red-400 border border-red-900 px-2 py-1 rounded">Salir</button>
        </div>
        {/* Contenido */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}