import React, { useState } from 'react';

export default function SmartQuoter({ onSendQuote }) {
  const [formData, setFormData] = useState({ empresa: '', telefono: '', sector: '', direccion: '' });

  const handleSend = () => {
    if (!formData.empresa || !formData.telefono) return alert("Faltan campos obligatorios");
    onSendQuote(formData); // Esto envía el objeto con los datos
    alert("Propuesta recibida en Central");
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-white text-lg font-bold">Nueva Solicitud</h2>
      <div className="grid grid-cols-1 gap-3">
        <label className="text-gray-400 text-xs">Nombre Empresa *</label>
        <input className="p-2 bg-[#042120] border border-teal-900 rounded text-white" onChange={e => setFormData({...formData, empresa: e.target.value})} />
        <label className="text-gray-400 text-xs">Teléfono *</label>
        <input className="p-2 bg-[#042120] border border-teal-900 rounded text-white" onChange={e => setFormData({...formData, telefono: e.target.value})} />
        {/* ... agrega los otros 2 campos iguales ... */}
        <button onClick={handleSend} className="w-full bg-emerald-500 py-3 rounded font-black mt-4">ENVIAR A CENTRAL</button>
      </div>
    </div>
  );
}