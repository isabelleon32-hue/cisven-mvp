import React, { useState } from 'react';

export default function AdminDashboard({ onAddUser, ...props }) {
  const [newUser, setNewUser] = useState({ name: '', rut: '', password: '' });

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.rut || !newUser.password) {
      return alert("Por favor completa todos los campos para el nuevo abonado.");
    }
    // Usamos la función onAddUser que viene de App.jsx
    onAddUser({ 
      id: Date.now(), 
      name: newUser.name, 
      rut: newUser.rut, 
      password: newUser.password, 
      role: 'client' 
    });
    alert("Abonado creado exitosamente");
    setNewUser({ name: '', rut: '', password: '' }); // Limpiar formulario
  };

  return (
    <div className="p-6 bg-[#042120] min-h-screen text-white">
      <h2 className="text-xl font-black uppercase mb-6 border-b border-teal-900 pb-2">Panel de Administración</h2>
      
      {/* Sección de Registro de Nuevos Abonados */}
      <div className="bg-[#0a3a37] p-5 rounded-2xl border border-teal-900 shadow-xl max-w-sm">
        <h3 className="text-white font-black uppercase text-xs mb-4">Registrar Nuevo Abonado</h3>
        
        <div className="space-y-3">
          <input 
            type="text" placeholder="Nombre Completo" 
            value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white text-xs focus:ring-1 focus:ring-emerald-500 outline-none" 
          />
          <input 
            type="text" placeholder="RUT (Login)" 
            value={newUser.rut} onChange={(e) => setNewUser({...newUser, rut: e.target.value})}
            className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white text-xs focus:ring-1 focus:ring-emerald-500 outline-none" 
          />
          <input 
            type="password" placeholder="Clave Provisoria" 
            value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white text-xs focus:ring-1 focus:ring-emerald-500 outline-none" 
          />
          <button 
            onClick={handleCreateUser}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl uppercase text-[10px] transition-all"
          >
            Crear Acceso Abonado
          </button>
        </div>
      </div>
      
      {/* ... Aquí continúa el resto de tu AdminDashboard (quotes, appointments, etc.) */}
    </div>
  );
}