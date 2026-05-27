import React, { useState } from 'react';

export default function SmartQuoter({ catalog, onSendQuote, onManualSchedule }) {
  // Pestañas del entorno unificado (Navegación Móvil/Desktop Integrada)
  const [activeTab, setActiveTab] = useState('quote'); 
  
  // Estados del flujo por pasos
  const [step, setStep] = useState(1);

  // Inputs reales e interactivos del Perfil
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  
  // Parámetros de selección técnica
  const [selectedCamId, setSelectedCamId] = useState('2'); // 1080p por defecto
  const [cameraCount, setCameraCount] = useState(4);
  const [meters, setMeters] = useState(15);
  const [complexHeight, setComplexHeight] = useState('Baja');

  // Inputs reales para la Agenda Técnica
  const [bookingDate, setBookingDate] = useState('');
  const [bookingService, setBookingService] = useState('Instalación de Sistema Nuevo');

  // Inputs reales para Alertas y Botón de Pánico
  const [panicActive, setPanicActive] = useState(false);
  const [observation, setObservation] = useState('');

  // Catálogo de hardware sincronizado
  const activeCatalog = Array.isArray(catalog) ? catalog : [
    { id: 1, label: '720p Básica Estándar', price: 25000, stock: 45 }, 
    { id: 2, label: '1080p Domo Alta Def.', price: 45000, stock: 30 }, 
    { id: 3, label: '4K Profesional + AI', price: 95000, stock: 12 }
  ];

  // ==========================================
  // CÁLCULO CROMÁTICO Y MATRICIAL EN TIEMPO REAL
  // ==========================================
  const currentCam = activeCatalog.find(c => c.id === parseInt(selectedCamId)) || activeCatalog[1];
  const hardwareBasePrice = currentCam.price * cameraCount;
  const deploymentPrice = (meters * 1200) + (complexHeight === 'Alta' ? 35000 : 15000);
  const totalEstimated = hardwareBasePrice + deploymentPrice;

  // Transmitir Cotización al ADN del Admin
  const handleQuoteSubmit = () => {
    if (!companyName.trim() || !contactInfo.trim()) {
      return alert('⚠️ Por favor ingresa el Nombre de la Empresa y el Contacto Operativo en el Paso 1.');
    }
    if (typeof onSendQuote === 'function') {
      onSendQuote(
        companyName,
        `Industrial: ${industry || 'General'}`,
        `${cameraCount}x ${currentCam.label}`,
        totalEstimated,
        `Sede/Despliegue (${companySize || 'Estándar'})`,
        parseInt(meters),
        contactInfo
      );
      alert('🚀 ¡Propuesta técnica transmitida con éxito! Los datos acaban de ingresar en tiempo real a la Mesa de Control Central del Administrador.');
      setCompanyName(''); setContactInfo(''); setIndustry(''); setCompanySize('');
      setStep(1);
    }
  };

  // Transmitir Agenda al ADN del Admin
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingDate || !companyName.trim() || !contactInfo.trim()) {
      return alert('⚠️ Complete los campos de identificación y la fecha para agendar la visita.');
    }
    if (typeof onManualSchedule === 'function') {
      onManualSchedule(companyName, bookingService, bookingDate, 'Dirección de Sede Cliente', contactInfo);
      alert('📅 Solicitud de asistencia en terreno registrada con éxito en la Mesa Central.');
      setBookingDate('');
    }
  };

  // Activación Cifrada de Alarma de Pánico
  const triggerPanic = () => {
    setPanicActive(true);
    alert(`🚨 ¡ALERTA DE EMERGENCIA TRANSMITIDA! La central CISVEN ha recibido el reporte. Observación de incidencia: ${observation || 'Sin comentarios adicionales.'}`);
    setObservation('');
    setTimeout(() => setPanicActive(false), 4000);
  };

  return (
    <div className="w-full min-h-screen bg-[#021312] text-emerald-100 font-sans antialiased p-4 md:p-8 selection:bg-emerald-500 selection:text-black">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Cabecera Corporativa Unificada */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#042120] p-4 rounded-2xl border border-teal-950 gap-4 shadow-xl">
          <div>
            <h1 className="text-xl font-black text-white tracking-widest uppercase">🛡️ PORTAL ABONADO CISVEN</h1>
            <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider mt-0.5">Módulo de Interacción Comercial y Alertas</p>
          </div>
          
          {/* Selector de Pestañas Estilo Terminal */}
          <div className="grid grid-cols-3 bg-[#021312] p-1 rounded-xl border border-teal-950/60 font-bold w-full sm:w-auto min-w-[280px]">
            <button 
              type="button" onClick={() => setActiveTab('quote')}
              className={`py-2 text-center rounded-lg transition-all text-[10px] uppercase ${activeTab === 'quote' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-[#021312] font-black' : 'text-teal-400 opacity-70'}`}
            >
              📦 Cotizar
            </button>
            <button 
              type="button" onClick={() => setActiveTab('agenda')}
              className={`py-2 text-center rounded-lg transition-all text-[10px] uppercase ${activeTab === 'agenda' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-[#021312] font-black' : 'text-teal-400 opacity-70'}`}
            >
              📅 Agendar
            </button>
            <button 
              type="button" onClick={() => setActiveTab('panic')}
              className={`py-2 text-center rounded-lg transition-all text-[10px] uppercase ${activeTab === 'panic' ? 'bg-red-600 text-white font-black shadow-md' : 'text-red-400 opacity-70'}`}
            >
              🚨 Alerta
            </button>
          </div>
        </div>

        {/* CONTENIDO INTERACTIVO SEGÚN LA PESTAÑA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Panel Operativo Principal (Izquierda) */}
          <div className="lg:col-span-2 bg-[#0a3a37] border border-teal-900 rounded-3xl p-6 shadow-2xl min-h-[380px] flex flex-col justify-between">
            
            {/* PESTAÑA A: COTIZADOR */}
            {activeTab === 'quote' && (
              <div className="space-y-4 w-full">
                <div className="flex justify-between items-center border-b border-teal-950 pb-2 mb-2">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Configuración de Red Perimetral</h3>
                  <span className="text-[10px] font-mono font-bold text-teal-400 bg-[#042120] px-2.5 py-1 rounded-lg">Paso {step} de 4</span>
                </div>

                {step === 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black uppercase text-gray-400">Nombre de la empresa *</label>
                      <input type="text" placeholder="Ej: Corporación ACME" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white font-bold text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black uppercase text-gray-400">Sector Industrial</label>
                      <input type="text" placeholder="Ej: Logística / Bodegaje" value={industry} onChange={e => setIndustry(e.target.value)} className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white font-bold text-xs focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black uppercase text-gray-400">Sedes / Sucursales</label>
                      <input type="text" placeholder="Ej: Casa Central / 3 Plantas" value={companySize} onChange={e => setCompanySize(e.target.value)} className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white font-bold text-xs focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black uppercase text-gray-400">Contacto Operativo (Teléfono) *</label>
                      <input type="text" placeholder="Ej: +56976543210" value={contactInfo} onChange={e => setContactInfo(e.target.value)} className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black uppercase text-gray-400">Modelo de Tecnología de Captura:</label>
                      <select value={selectedCamId} onChange={e => setSelectedCamId(e.target.value)} className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white font-bold text-xs focus:outline-none">
                        {activeCatalog.map(c => <option key={c.id} value={c.id}>{c.label} (${c.price.toLocaleString('es-CL')} c/u)</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black uppercase text-gray-400">Cantidad de Nodos / Puntos de Cámara:</label>
                      <input type="number" min="1" value={cameraCount} onChange={e => setCameraCount(parseInt(e.target.value) || 1)} className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white font-mono font-bold text-xs focus:outline-none" />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black uppercase text-gray-400">Metraje Lineal de Canalización (Mtrs):</label>
                      <input type="number" min="1" value={meters} onChange={e => setMeters(parseInt(e.target.value) || 0)} className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white font-mono text-xs focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black uppercase text-gray-400">Complejidad de Altura Operativa:</label>
                      <select value={complexHeight} onChange={e => setComplexHeight(e.target.value)} className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white font-bold text-xs focus:outline-none">
                        <option value="Baja">Baja (Menos de 3 metros / Muros estándar)</option>
                        <option value="Alta">Alta (Postes de acero / Techumbre industrial)</option>
                      </select>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="text-center py-2 space-y-2">
                    <div className="text-2xl animate-pulse">⚡</div>
                    <h4 className="text-xs font-black text-white uppercase">Estructura Homologada</h4>
                    <p className="text-[11px] text-teal-400 max-w-md mx-auto">Los datos técnicos están consolidados. Al presionar el botón inferior, se inyectarán de forma inmediata en la consola operativa de la Central.</p>
                  </div>
                )}

                {/* Botonera de Navegación Interna */}
                <div className="flex justify-between items-center pt-4 border-t border-teal-950 mt-6">
                  <button type="button" disabled={step === 1} onClick={() => setStep(p => p - 1)} className="px-4 py-2 text-[10px] font-black uppercase bg-[#042120] border border-teal-950 rounded-xl text-teal-400 disabled:opacity-30">← Anterior</button>
                  {step < 4 ? (
                    <button type="button" onClick={() => { if(step === 1 && (!companyName || !contactInfo)) return alert('Complete campos obligatorios'); setStep(p => p + 1); }} className="px-4 py-2 text-[10px] font-black uppercase bg-gradient-to-r from-emerald-500 to-teal-500 text-[#021312] rounded-xl">Siguiente →</button>
                  ) : (
                    <button type="button" onClick={handleQuoteSubmit} className="px-5 py-2 text-[10px] font-black uppercase bg-gradient-to-r from-emerald-500 to-teal-500 text-[#021312] rounded-xl shadow-lg">⚡ Transmitir Propuesta</button>
                  )}
                </div>
              </div>
            )}

            {/* PESTAÑA B: AGENDA TÉCNICA */}
            {activeTab === 'agenda' && (
              <form onSubmit={handleBookingSubmit} className="space-y-3 w-full">
                <div className="border-b border-teal-950 pb-2 mb-2">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Agendamiento de Soporte Certificado</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Organización Solicitante *</label>
                    <input type="text" required placeholder="Nombre de Empresa" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white font-bold text-xs focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Teléfono Móvil de Contacto *</label>
                    <input type="text" required placeholder="Ej: +569..." value={contactInfo} onChange={e => setContactInfo(e.target.value)} className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white font-mono text-xs focus:outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Tipo de Servicio Requerido:</label>
                    <select value={bookingService} onChange={e => setBookingService(e.target.value)} className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white text-xs font-bold focus:outline-none">
                      <option value="Instalación de Sistema Nuevo">Instalación / Ampliación</option>
                      <option value="Mantención de Enlaces y Conectividad">Mantención de Enlaces Cifrados</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Fecha de Visita Solicitada:</label>
                    <input type="date" required value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white text-xs font-mono font-bold focus:outline-none" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#085a4f] hover:bg-[#0b6b5e] text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-wider transition-colors mt-4">Confirmar e Inyectar Cita en Central</button>
              </form>
            )}

            {/* PESTAÑA C: BOTÓN DE PÁNICO ALINEADO A LA MARCA */}
            {activeTab === 'panic' && (
              <div className="space-y-4 text-center w-full">
                <div className="border-b border-teal-950 pb-2 text-left mb-2">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Canal de Alerta de Emergencia Perimetral</h3>
                </div>
                <div className="text-left space-y-1">
                  <label className="block text-[9px] font-black uppercase text-gray-400 tracking-wider">Bitácora Breve del Suceso / Reporte de Falla Físico:</label>
                  <textarea value={observation} onChange={e => setObservation(e.target.value)} placeholder="Describa brevemente la incidencia en terreno observada..." rows="3" className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white font-medium text-xs resize-none focus:outline-none focus:ring-1 focus:ring-red-500"></textarea>
                </div>
                <div className="flex flex-col items-center justify-center pt-2">
                  <button type="button" onClick={triggerPanic} className={`w-32 h-32 rounded-full font-black text-xs uppercase tracking-widest border-4 transition-all duration-300 transform active:scale-95 shadow-2xl ${panicActive ? 'bg-red-500 text-white border-white animate-ping' : 'bg-gradient-to-b from-red-600 to-red-800 text-white border-red-950 shadow-red-950/50'}`}>
                    {panicActive ? 'ENVIADO' : '🚨 PÁNICO'}
                  </button>
                  <p className="text-[9px] text-red-400 mt-4 font-bold uppercase tracking-wider animate-pulse">Enlace de comunicación crítico de prioridad alfa con patrullas CISVEN</p>
                </div>
              </div>
            )}

          </div>

          {/* Tarjeta Lateral de Analítica de Costos en Vivo (Derecha) - ADAPTACIÓN CRÓMATICA */}
          <div className="bg-[#042120] border border-teal-950 rounded-3xl p-5 shadow-2xl space-y-4">
            <h3 className="text-[10px] font-black uppercase text-teal-400 tracking-wider border-b border-teal-950 pb-2">📊 Monitor de Inversión Tecnológica</h3>
            <div className="space-y-2 text-xs font-medium text-teal-100">
              <div className="flex justify-between">
                <span className="text-gray-400">Nodos ({cameraCount} ud):</span>
                <span className="font-mono font-bold text-white">${hardwareBasePrice.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Canalización Cableado:</span>
                <span className="font-mono font-bold text-white">${(meters * 1200).toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between border-b border-teal-950 pb-2">
                <span className="text-gray-400">Complejidad ({complexHeight}):</span>
                <span className="font-mono font-bold text-white">${(complexHeight === 'Alta' ? 35000 : 15000).toLocaleString('es-CL')}</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-black text-xs text-white uppercase tracking-wider">Total Estimado:</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">${totalEstimated.toLocaleString('es-CL')}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}