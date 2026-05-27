import React, { useState } from 'react';

export default function SmartQuoter({ currentUser, onSendQuote }) {
  const [form, setForm] = useState({ name: '', phone: '', sector: '', address: '' });

  const handleSubmit = () => {
    onSendQuote({ ...form, id: Date.now(), status: 'Pendiente' });
  };

  return (
    <div className="p-4 text-white">
      <div className="grid grid-cols-2 gap-4">
        <input placeholder="Nombre" className="p-2 bg-[#042120] rounded" onChange={(e) => setForm({...form, name: e.target.value})} />
        <input placeholder="Teléfono" className="p-2 bg-[#042120] rounded" onChange={(e) => setForm({...form, phone: e.target.value})} />
        <input placeholder="Sector" className="p-2 bg-[#042120] rounded" onChange={(e) => setForm({...form, sector: e.target.value})} />
        <input placeholder="Dirección" className="p-2 bg-[#042120] rounded" onChange={(e) => setForm({...form, address: e.target.value})} />
      </div>
      <button onClick={handleSubmit} className="w-full mt-4 bg-emerald-500 p-3 rounded font-bold">ENVIAR A CENTRAL</button>
    </div>
  );
}