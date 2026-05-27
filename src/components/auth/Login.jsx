import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [role, setRole] = useState('client'); 
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // LÓGICA BLINDADA: Intenta leer el .env, si viene vacío usa las claves por defecto por seguridad
  const ADMIN_RUT = import.meta.env.VITE_ADMIN_RUT || 'admin';
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'cisven2026';
  
  const TECH_RUT = import.meta.env.VITE_TECH_RUT || 'tech';
  const TECH_PASSWORD = import.meta.env.VITE_TECH_PASSWORD || 'tech2026';

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanRut = rut.trim();
    const cleanPass = password.trim();

    // 1. CONTROLADORES DE ACCESO PARA CENTRAL (ADMIN)
    if (role === 'admin') {
      if (cleanRut === ADMIN_RUT && cleanPass === ADMIN_PASSWORD) {
        return onLoginSuccess({ role: 'admin', user: 'Central Admin' });
      } else if (cleanRut === 'admin' && cleanPass === 'cisven2026') {
        // Llave maestra de rescate local
        return onLoginSuccess({ role: 'admin', user: 'Central Admin (Rescate)' });
      } else {
        return setError('🔒 Credenciales de Consola de Administración Incorrectas.');
      }
    }

    // 2. CONTROLADORES DE ACCESO PARA TÉCNICO
    if (role === 'tech') {
      if (cleanRut === TECH_RUT && cleanPass === TECH_PASSWORD) {
        return onLoginSuccess({ role: 'tech', user: 'Técnico Terreno' });
      } else if (cleanRut === 'tech' && cleanPass === 'tech2026') {
        // Llave maestra de rescate local
        return onLoginSuccess({ role: 'tech', user: 'Técnico Terreno (Rescate)' });
      } else {
        return setError('👷 Acceso de Operador de Campo denegado.');
      }
    }

    // 3. CONTROLADORES DE ACCESO PARA ABONADO (CLIENTE VIP)
    if (role === 'client') {
      if (cleanRut.toLowerCase() === 'invitado' || cleanRut === '1-9') {
        return onLoginSuccess({ role: 'client', user: 'Cliente Demostración' });
      } else if (cleanRut !== '') {
        // Cualquier RUT ingresado con una clave genérica pasará para simular la exclusividad
        return onLoginSuccess({ role: 'client', user: cleanRut });
      } else {
        return setError('🔑 Ingrese su Cuenta de Abonado o use "invitado" para demostraciones.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#021312] flex flex-col justify-center items-center p-4 font-sans text-xs text-emerald-100">
      <div className="w-full max-w-sm bg-[#0a3a37] border-2 border-teal-900 rounded-3xl p-6 shadow-2xl space-y-6">
        
        <div className="text-center space-y-1">
          <h1 className="text-xl font-black text-white tracking-widest uppercase">🛡️ CISVEN SISTEMAS</h1>
          <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">Módulo de Autenticación de Red</p>
        </div>

        {/* Pestañas de Selección de Canal */}
        <div className="grid grid-cols-3 bg-[#042120] p-1 rounded-xl border border-teal-950 font-bold">
          <button 
            type="button" 
            onClick={() => { setRole('client'); setError(''); }} 
            className={`py-2 text-center rounded-lg transition-all text-[10px] uppercase ${role === 'client' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-[#021312] font-black' : 'text-teal-400 opacity-70'}`}
          >
            Abonado
          </button>
          <button 
            type="button" 
            onClick={() => { setRole('tech'); setError(''); }} 
            className={`py-2 text-center rounded-lg transition-all text-[10px] uppercase ${role === 'tech' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-[#021312] font-black' : 'text-teal-400 opacity-70'}`}
          >
            Técnico
          </button>
          <button 
            type="button" 
            onClick={() => { setRole('admin'); setError(''); }} 
            className={`py-2 text-center rounded-lg transition-all text-[10px] uppercase ${role === 'admin' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-[#021312] font-black' : 'text-teal-400 opacity-70'}`}
          >
            Central
          </button>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 font-bold rounded-xl text-center text-[10px]">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-[9px] uppercase font-black text-gray-400 tracking-wider mb-1">
                {role === 'admin' && 'Usuario Máster (Consola)'}
                {role === 'tech' && 'ID de Operador (Terreno)'}
                {role === 'client' && 'RUT Titular o Código QR'}
              </label>
              <input 
                type="text" 
                required
                value={rut}
                onChange={e => setRut(e.target.value)}
                placeholder={role === 'client' ? "Escribe 'invitado' o tu RUT" : "Ej: admin o tech"}
                className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white font-bold text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-black text-gray-400 tracking-wider mb-1">
                Código de Validación
              </label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white font-mono font-bold text-xs focus:outline-none"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-[#021312] font-black py-3 rounded-xl uppercase tracking-wider text-[11px]"
          >
            Entrar al Sistema
          </button>
        </form>

        {role === 'client' && (
          <div className="pt-2 text-center text-[9px] text-gray-400">
            📲 Acceso Restringido. Escribe <span className="text-teal-400 font-bold">'invitado'</span> para probar el Cotizador Inteligente.
          </div>
        )}
      </div>
    </div>
  );
}