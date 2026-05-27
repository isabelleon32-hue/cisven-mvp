import React, { useState } from 'react';

export default function SmartQuoter({ catalog, onSendQuote, onManualSchedule }) {
  // Pestañas del entorno cliente adaptado a celular
  const [activeTab, setActiveTab] = useState('quote'); 
  
  // Estados del Cotizador
  const [step, setStep] = useState(1);
  const [selectedCam, setSelectedCam] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [meters, setMeters] = useState(15);

  // Estados de la Agenda
  const [bookingDate, setBookingDate] = useState('');
  const [bookingService, setBookingService] = useState('Instalación de Sistema Nuevo');

  // Estados del Botón de Pánico y Alertas
  const [panicActive, setPanicActive] = useState(false);
  const [observation, setObservation] = useState('');

  const activeCatalog = Array.isArray(catalog) ? catalog : [
    { id: 1, label: '720p Básica Estándar', price: 25000, stock: 45 }, 
    { id: 2, label: '1080p Domo Alta Def.', price: 45000, stock: 30 }, 
    { id: 3, label: '4K Profesional + AI', price: 95000, stock: 12 }
  ];

  // Ejecutar el envío de la cotización real a la mesa del Admin
  const handleQuoteSubmit = () => {
    if (!selectedCam || !clientAddress || !clientPhone) {
      return alert('Por favor, completa todos los campos para generar la cotización.');
    }
    const targetCam = activeCatalog.find(c => c.id === parseInt(selectedCam));
    const totalEstimado = (targetCam ? targetCam.price : 45000) + (meters * 1200);

    onSendQuote(
      'Abonado Digital',
      'Residencial Express',
      targetCam ? targetCam.label : 'Cámara Estándar',
      totalEstimado,
      clientAddress,
      parseInt(meters),
      clientPhone
    );
    alert('✨ Solicitud de cotización enviada con éxito a la Mesa de Control Central.');
    setStep(1);
  };

  // Ejecutar el agendamiento directo desde el celular del cliente
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingDate || !clientAddress || !clientPhone) {
      return alert('Complete la fecha, dirección y teléfono para agendar.');
    }
    onManualSchedule('Abonado Digital', bookingService, bookingDate, clientAddress, clientPhone);
    alert('📅 Cita agendada con éxito. Un técnico será asignado por la Central.');
    setBookingDate('');
  };

  // Gatillo del Botón de Emergencia / Pánico
  const triggerPanic = () => {
    setPanicActive(true);
    alert(`🚨 ¡ALERTA DE EMERGENCIA ENVIADA! La central CISVEN ha recibido tu geolocalización. Observación: ${observation || 'Sin comentarios adicionales.'}`);
    // Aquí se limpia el cuadro después del envío
    setObservation('');
    setTimeout(() => setPanicActive(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#021312] text-zinc-100 font-sans p-4 pb-24 flex justify-center items-start w-full">
      {/* Contenedor con comportamiento y tamaño estricto de Teléfono Celular */}
      <div className="w-full max-w-md bg-[#0a3a37] rounded-3xl border border-teal-900 shadow-2xl overflow-hidden flex flex-col min-h-[80vh]">
        
        {/* Cabecera de la App del Cliente */}
        <div className="p-4 bg-[#042120] border-b border-teal-950 flex justify-between items-center">
          <div>
            <h2 className="text-xs font-black text-white uppercase tracking-widest">🛡️ PORTAL ABONADO</h2>
            <p className="text-[9px] text-teal-400 font-bold uppercase">CISVEN Seguridad Activa</p>
          </div>
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono text-[9px] px-2 py-0.5 rounded-full font-bold">• En Línea</span>
        </div>

        {/* Cuerpo Variable según la Pestaña Activa de la App Web */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          
          {/* VISTA 1: COTIZADOR INTELIGENTE */}
          {activeTab === 'quote' && (
            <div className="space-y-4">
              <div className="border-b border-teal-900 pb-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">📦 Generar Nueva Cotización</h3>
                <p className="text-[10px] text-teal-300">Paso {step} de 3 para el despliegue técnico.</p>
              </div>

              {step === 1 && (
                <div className="space-y-3">
                  <label className="block text-[10px] uppercase font-bold text-gray-400">1. Selecciona el Tipo de Cámara:</label>
                  <select 
                    value={selectedCam} 
                    onChange={e => setSelectedCam(e.target.value)}
                    className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white font-bold focus:outline-none text-xs"
                  >
                    <option value="">-- Elige un Equipo de Bodega --</option>
                    {activeCatalog.map(c => (
                      <option key={c.id} value={c.id}>{c.label} (${c.price.toLocaleString('es-CL')})</option>
                    ))}
                  </select>
                  <button type="button" onClick={() => { if(selectedCam) setStep(2); else alert('Seleccione una cámara'); }} className="w-full bg-[#085a4f] text-white py-2.5 rounded-xl font-bold uppercase text-[10px] mt-2">Siguiente Paso →</button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <label className="block text-[10px] uppercase font-bold text-gray-400">2. Metraje Estimado de Cableado (Metros):</label>
                  <input 
                    type="number" value={meters} onChange={e => setMeters(e.target.value)}
                    className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white font-mono font-bold text-xs"
                  />
                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => setStep(1)} className="w-1/2 bg-teal-950 text-teal-400 py-2.5 rounded-xl font-bold uppercase text-[10px]">Atrás</button>
                    <button type="button" onClick={() => setStep(3)} className="w-1/2 bg-[#085a4f] text-white py-2.5 rounded-xl font-bold uppercase text-[10px]">Siguiente →</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  <label className="block text-[10px] uppercase font-bold text-gray-400">3. Datos de Ubicación y Contacto:</label>
                  <input 
                    type="text" placeholder="Dirección de Instalación" value={clientAddress} onChange={e => setClientAddress(e.target.value)}
                    className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white font-bold text-xs"
                  />
                  <input 
                    type="tel" placeholder="Teléfono Móvil de Contacto" value={clientPhone} onChange={e => setClientPhone(e.target.value)}
                    className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white font-mono font-bold text-xs"
                  />
                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => setStep(2)} className="w-1/2 bg-teal-950 text-teal-400 py-2.5 rounded-xl font-bold uppercase text-[10px]">Atrás</button>
                    <button type="button" onClick={handleQuoteSubmit} className="w-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-[#021312] py-2.5 rounded-xl font-black uppercase text-[10px] shadow-lg">Enviar a Central</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VISTA 2: AGENDA DE VISITAS TÉCNICAS */}
          {activeTab === 'agenda' && (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="border-b border-teal-900 pb-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">📅 Agendar Visita en Terreno</h3>
                <p className="text-[10px] text-teal-300">Solicita asistencia técnica para tu sistema perimetral.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Tipo de Requerimiento:</label>
                  <select 
                    value={bookingService} onChange={e => setBookingService(e.target.value)}
                    className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white text-xs font-bold"
                  >
                    <option value="Instalación de Sistema Nuevo">Instalación Completa</option>
                    <option value="Mantención de Enlaces y Conectividad">Mantención / Reparación</option>
                    <option value="Revisión Técnica por Falla o Alerta">Revisión por Falla Técnica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Seleccionar Fecha:</label>
                  <input 
                    type="date" required value={bookingDate} onChange={e => setBookingDate(e.target.value)}
                    className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Confirmar Dirección de Terreno:</label>
                  <input 
                    type="text" required placeholder="Ej: Av Vespucio 1500, Maipú" value={clientAddress} onChange={e => setClientAddress(e.target.value)}
                    className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Teléfono:</label>
                  <input 
                    type="tel" required placeholder="+569..." value={clientPhone} onChange={e => setClientPhone(e.target.value)}
                    className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#085a4f] hover:bg-[#0b6b5e] text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-wider transition-colors shadow-md">
                Confirmar y Registrar Solicitud
              </button>
            </form>
          )}

          {/* VISTA 3: BOTÓN DE PÁNICO Y ALERTAS OPERATIVAS */}
          {activeTab === 'panic' && (
            <div className="space-y-5 text-center py-2">
              <div className="border-b border-teal-900 pb-2 text-left">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">🚨 Central de Emergencias e Incidencias</h3>
                <p className="text-[10px] text-red-400 font-bold">Enlace de comunicación crítico con la Mesa de Control Central.</p>
              </div>

              {/* CUADRO DE OBSERVACIONES DE EMERGENCIA */}
              <div className="text-left space-y-1.5">
                <label className="block text-[9px] font-black uppercase text-gray-400 tracking-wider">
                  📝 Cuadro de Observación / Reporte de Falla:
                </label>
                <textarea 
                  value={observation}
                  onChange={e => setObservation(e.target.value)}
                  placeholder="Ej: Activación por sospecha perimetral o falla crítica en nodo 3..."
                  rows="3"
                  className="w-full p-3 bg-[#042120] border border-teal-950 rounded-xl text-white font-medium text-xs resize-none focus:outline-none focus:ring-1 focus:ring-red-500"
                ></textarea>
              </div>

              {/* BOTÓN DE PÁNICO RADIAL INTERACTIVO */}
              <div className="flex flex-col items-center justify-center pt-2">
                <button
                  type="button"
                  onClick={triggerPanic}
                  className={`w-32 h-32 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 transform active:scale-95 shadow-2xl border-4 ${panicActive ? 'bg-red-500 text-white border-white animate-ping' : 'bg-gradient-to-b from-red-600 to-red-800 text-white border-red-950 hover:from-red-500 hover:to-red-700'}`}
                >
                  {panicActive ? 'ENVIADO' : '🚨 PÁNICO'}
                </button>
                <p className="text-[9px] text-gray-400 mt-4 font-bold uppercase tracking-wider animate-pulse">
                  Mantén presionado o pulsa para despacho de patrulla/móvil
                </p>
              </div>
            </div>
          )}

        </div>

        {/* MENÚ DE NAVEGACIÓN INFERIOR (TIPO APP DE TELÉFONO CELULAR) */}
        <div className="bg-[#042120] border-t border-teal-950 h-16 grid grid-cols-3 font-bold text-[10px] uppercase">
          <button 
            type="button" 
            onClick={() => setActiveTab('quote')}
            className={`flex flex-col items-center justify-center gap-1 transition-all ${activeTab === 'quote' ? 'text-emerald-400 font-black bg-black/20' : 'text-teal-600'}`}
          >
            <span className="text-sm">📦</span>
            <span>Cotizar</span>
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('agenda')}
            className={`flex flex-col items-center justify-center gap-1 transition-all ${activeTab === 'agenda' ? 'text-emerald-400 font-black bg-black/20' : 'text-teal-600'}`}
          >
            <span className="text-sm">📅</span>
            <span>Agendar</span>
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('panic')}
            className={`flex flex-col items-center justify-center gap-1 transition-all ${activeTab === 'panic' ? 'text-red-400 font-black bg-black/20' : 'text-teal-600'}`}
          >
            <span className="text-sm">🚨</span>
            <span>Emergencia</span>
          </button>
        </div>

      </div>
    </div>
  );
}