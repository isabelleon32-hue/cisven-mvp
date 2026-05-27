import React, { useState } from 'react';

export default function SmartQuoter({ catalog, onSendQuote, onManualSchedule }) {
  const [activeTab, setActiveTab] = useState('quote');
  const [step, setStep] = useState(1);
  
  // Estados de inputs (ahora garantizamos que sean editables)
  const [form, setForm] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    contactInfo: '',
    selectedCamId: '2',
    cameraCount: 4,
    meters: 15,
    complexHeight: 'Baja',
    bookingDate: '',
    observation: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleQuoteSubmit = () => {
    if (!form.companyName || !form.contactInfo) return alert('Campos obligatorios marcados con * son requeridos.');
    
    // Cálculo interno para el envío
    const activeCatalog = catalog || [];
    const currentCam = activeCatalog.find(c => c.id === parseInt(form.selectedCamId)) || { price: 45000, label: '1080p Domo' };
    const total = (currentCam.price * form.cameraCount) + (form.meters * 1200) + (form.complexHeight === 'Alta' ? 35000 : 15000);

    onSendQuote(form.companyName, form.industry, `${form.cameraCount}x ${currentCam.label}`, total, form.companySize, form.meters, form.contactInfo);
    alert('✅ Propuesta enviada al Admin');
  };

  return (
    <div className="w-full text-emerald-100 font-sans p-2">
      {/* Selector de Pestañas */}
      <div className="flex bg-[#021312] p-1 rounded-xl border border-teal-900 mb-4">
        {['quote', 'agenda', 'panic'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 text-[10px] uppercase font-black rounded-lg ${activeTab === tab ? 'bg-emerald-500 text-[#021312]' : 'text-teal-400'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Flujo Cotizar */}
      {activeTab === 'quote' && (
        <div className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-900 space-y-4">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-2">
              <input name="companyName" placeholder="Nombre/Empresa *" value={form.companyName} onChange={handleChange} className="w-full p-2 bg-[#042120] border border-teal-950 rounded-lg text-white text-xs" />
              <input name="contactInfo" placeholder="Teléfono *" value={form.contactInfo} onChange={handleChange} className="w-full p-2 bg-[#042120] border border-teal-950 rounded-lg text-white text-xs" />
              <input name="industry" placeholder="Sector" value={form.industry} onChange={handleChange} className="w-full p-2 bg-[#042120] border border-teal-950 rounded-lg text-white text-xs" />
              <input name="companySize" placeholder="Sedes" value={form.companySize} onChange={handleChange} className="w-full p-2 bg-[#042120] border border-teal-950 rounded-lg text-white text-xs" />
            </div>
          )}
          
          <button onClick={() => step < 4 ? setStep(step + 1) : handleQuoteSubmit()} className="w-full bg-emerald-500 text-[#021312] font-black py-2 rounded-lg uppercase text-xs">
            {step < 4 ? 'Siguiente' : 'Enviar a Central'}
          </button>
        </div>
      )}
      
      {/* Aquí integrarías las otras pestañas (Agenda y Pánico) de forma similar */}
    </div>
  );
}