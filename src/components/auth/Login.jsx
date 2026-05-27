import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Limpieza básica del RUT antes de validar
    const cleanRut = rut.replace(/\./g, '').replace(/-/g, '').trim().toLowerCase();

    // Obtener las credenciales seguras desde las variables de entorno de Vite
    const adminRut = import.meta.env.VITE_ADMIN_RUT ? import.meta.env.VITE_ADMIN_RUT.toLowerCase() : 'admin';
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'cisven2026';
    
    const techRut = import.meta.env.VITE_TECH_RUT ? import.meta.env.VITE_TECH_RUT.toLowerCase() : 'tecnico';
    const techPass = import.meta.env.VITE_TECH_PASSWORD || 'tecnico2026';

    // Validación de Roles con variables de entorno blindadas
    if (cleanRut === adminRut && password === adminPass) {
      onLoginSuccess({ role: 'admin', user: 'Central CISVEN' });
    } else if (cleanRut === techRut && password === techPass) {
      onLoginSuccess({ role: 'tech', user: 'Técnico en Terreno' });
    } else {
      setError('RUT o contraseña incorrectos. Verifica tus credenciales de acceso.');
    }
  };

  return (
    <div className="min-h-screen bg-[#062c2a] flex flex-col justify-center items-center px-4 font-sans">
      <div className="max-w-md w-full space-y-8 bg-black/30 p-8 rounded-2xl border border-teal-900/40 backdrop-blur-sm shadow-2xl">
        
        {/* Encabezado del Formulario */}
        <div className="text-center">
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
            Mesa de Control Operativo
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Ingresa tus credenciales autorizadas de CISVEN
          </p>
        </div>

        {/* Formulario */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}
          
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="rut" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                RUT / Usuario
              </label>
              <input
                id="rut"
                name="rut"
                type="text"
                required
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-teal-900/60 bg-black/40 text-white placeholder-zinc-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all"
                placeholder="12.345.678-9"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Contraseña Secreta
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-teal-900/60 bg-black/40 text-white placeholder-zinc-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-[#062c2a] bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#062c2a] focus:ring-teal-500 transition-all shadow-lg active:scale-[0.98]"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}