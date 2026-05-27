import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  // Manejamos tres roles de acceso claros y definidos
  const [role, setRole] = useState('client'); 
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Leer credenciales del archivo .env de forma segura
  const ADMIN_RUT = import.meta.env.VITE_ADMIN_RUT || 'admin';
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'cisven2026';
  
  const TECH_RUT = import.meta.env.VITE_TECH_RUT || 'tech';
  const TECH_PASSWORD = import.meta.env.VITE_TECH_PASSWORD || 'tech2026';

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanRut = rut.trim();
    const cleanPass = password.trim();

    if (role === 'admin') {
      if (cleanRut === ADMIN_RUT && cleanPass === ADMIN_PASSWORD) {
        return onLoginSuccess({ role: 'admin', user: 'Central Admin' });
      } else {
        return setError('🔒 Credenciales de Consola de Administración Incorrectas.');
      }
    }

    if (role === 'tech') {
      if (cleanRut === TECH_RUT && cleanPass === TECH_PASSWORD) {
        return onLoginSuccess({ role: 'tech', user: 'Técnico Terreno' });
      } else {
        return setError('👷 Acceso de Operador de Campo denegado.');
      }
    }

    if (role === 'client') {
      // Flujo de Cliente Exclusivo CISVEN: Acceso simplificado o mediante credencial de abonado
      if (cleanRut && cleanPass === '1234') { 
        return onLoginSuccess({ role: 'client', user: cleanRut });
      } else {
        // Por defecto, permitimos una clave genérica de demostración si el admin no lo ha registrado
        if (cleanRut.toLowerCase() === 'invitado') {
          return onLoginSuccess({ role: 'client', user: 'Cliente Invitado' });
        }
        return setError('🔑 Ingrese su Cuenta de Abonado o Clave de Activación Digital.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#021312] flex flex-col justify-center items-center p-4 font-sans text-xs text-emerald-100 selection:bg-emerald-500 selection:text-black">
      <div className="w-full max-w-sm bg-[#0a3a37] border-2 border-teal-900 rounded-3xl p-6 shadow-2xl space-y-6">
        
        {/* Identidad de la Marca */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-black text-white tracking-widest uppercase">🛡️ CISVEN SISTEMAS</h1>
          <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">Plataforma de Control Homologada</p>
        </div>

        {/* Selector de Roles de Tres Vías (Evita el bloqueo de pantallas) */}
        <div className="grid grid-cols-3 bg-[#042120] p-1 rounded-xl border border-teal-950 font-bold">
          <button 
            type="button" 
            onClick={() => { setRole('client'); setError(''); }} 
            className={`py-2 text-center rounded-lg transition-all text-[10px] uppercase ${role === 'client' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-[#021312] font-black shadow-md' : 'text-teal-400 opacity-70 hover:opacity-100'}`}
          >
            Abonado
          </button>
          <button 
            type="button" 
            onClick={() => { setRole('tech'); setError(''); }} 
            className={`py-2 text-center rounded-lg transition-all text-[10px] uppercase ${role === 'tech' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-[#021312] font-black shadow-md' : 'text-teal-400 opacity-70 hover:opacity-100'}`}
          >
            Técnico
          </button>
          <button 
            type="button" 
            onClick={() => { setRole('admin'); setError(''); }} 
            className={`py-2 text-center rounded-lg transition-all text-[10px] uppercase ${role === 'admin' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-[#021312] font-black shadow-md' : 'text-teal-400 opacity-70 hover:opacity-100'}`}
          >
            Central
          </button>
        </div>

        {/* Formulario Dinámico según el Rol */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 font-bold rounded-xl text-center text-[10px]">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-[9px] uppercase font-black text-gray-400 tracking-wider mb-1">
                {role === 'admin' && 'Identificador Master (RUT/User)'}
                {role === 'tech' && 'Código de Operador (Terreno)'}
                {role === 'client' && 'RUT de Abonado o Código QR'}
              </label>
              <input 
                type="text" 
                required
                value={rut}
                onChange={e => setRut(e.target.value)}
                placeholder={role === 'client' ? "Ej: 19.876.543-2 o 'invitado'" : "Ingrese credencial"}
                className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white font-bold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-black text-gray-400 tracking-wider mb-1">
                Clave de Seguridad Encritada
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white font-mono font-bold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-[#021312] font-black py-3 rounded-xl uppercase tracking-wider text-[11px] shadow-lg active:scale-[0.99] transition-all"
          >
            {role === 'admin' && '🔒 Acceder a Consola de Control'}
            {role === 'tech' && '👷 Vincular Terminal de Campo'}
            {role === 'client' && '🚀 Entrar a mi Portal de Monitoreo'}
          </button>
        </form>

        {/* Marco Informativo de la propuesta de exclusividad */}
        {role === 'client' && (
          <div className="pt-3 border-t border-teal-950 text-center space-y-1.5">
            <p className="text-[9px] text-teal-500 font-medium">
              🔒 Acceso Restringido para Abonados Activos CISVEN.
            </p>
            <div className="inline-block bg-[#042120] p-2 rounded-lg border border-teal-900/40 text-[9px] text-gray-400 font-bold">
              📲 Escanea tu QR de Contrato para validación directa
            </div>
          </div>
        )}
      </div>
    </div>
  );
}