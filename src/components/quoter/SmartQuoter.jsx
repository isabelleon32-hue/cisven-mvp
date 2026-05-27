import React, { useState } from 'react';

export default function SmartQuoter({ catalog, onSendQuote }) {
  // Pasos del cotizador interactivo
  const [step, setStep] = useState(1);
  
  // Estados de los inputs reales del formulario
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  
  // Selección de hardware y metrajes reales
  const [selectedCamId, setSelectedCamId] = useState('2'); // Por defecto 1080p
  const [cameraCount, setCameraCount] = useState(4);
  const [meters, setMeters] = useState(15);
  const [complexHeight, setComplexHeight] = useState('Baja');

  // Catálogo de respaldo por si el estado global no carga
  const activeCatalog = Array.isArray(catalog) ? catalog : [
    { id: 1, label: '720p Básica Estándar', price: 25000, stock: 45 }, 
    { id: 2, label: '1080p Domo Alta Def.', price: 45000, stock: 30 }, 
    { id: 3, label: '4K Profesional + AI', price: 95000, stock: 12 }
  ];

  // ==========================================
  // CÁLCULO DE VALORES EN TIEMPO REAL
  // ==========================================
  const currentCam = activeCatalog.find(c => c.id === parseInt(selectedCamId)) || activeCatalog[1];
  const hardwareBasePrice = currentCam.price * cameraCount;
  const deploymentPrice = (meters * 1200) + (complexHeight === 'Alta' ? 35000 : 15000);
  const totalEstimated = hardwareBasePrice + deploymentPrice;

  // Enviar datos reales a la Mesa de Control Operativo del Admin
  const handleTriggerQuote = () => {
    if (!companyName.trim() || !contactInfo.trim()) {
      alert('⚠️ Por favor ingresa el Nombre de la Empresa y el Contacto Operativo en el Paso 1.');
      setStep(1);
      return;
    }

    if (typeof onSendQuote === 'function') {
      const summaryHardware = `${cameraCount}x ${currentCam.label}`;
      onSendQuote(
        companyName,
        `Industrial: ${industry || 'General'}`,
        summaryHardware,
        totalEstimated,
        `Sede/Despliegue (${companySize || 'Estándar'})`,
        parseInt(meters),
        contactInfo
      );
      
      alert('🚀 ¡Cotización enviada con éxito! Los datos acaban de ingresar en tiempo real a la Mesa de Control Central del Administrador.');
      
      // Limpiar formulario y regresar al inicio
      setCompanyName(''); setContactInfo(''); setIndustry(''); setCompanySize('');
      setStep(1);
    } else {
      alert('Error: La función de enlace con el Administrador no está conectada.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-50 text-zinc-950 font-sans antialiased p-4 md:p-8">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Encabezado Principal */}
        <div className="max-w-3xl">
          <p className="mb-2 inline-flex items-center rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-xs font-medium text-zinc-600 shadow-sm">
            Smart Quoter Activo
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Cotización inteligente para tu empresa
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Completa los parámetros reales. Los cálculos de hardware y despliegue se actualizan al instante.
          </p>
        </div>

        {/* Indicador de Pasos Interactivo */}
        <div className="grid grid-cols-4 bg-white border border-zinc-200 rounded-xl p-2 shadow-sm text-center font-bold text-[10px] sm:text-xs">
          {[
            { id: 1, label: '1. Perfil' },
            { id: 2, label: '2. Servicios' },
            { id: 3, label: '3. Alcance' },
            { id: 4, label: '4. Resumen' }
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(s.id)}
              className={`py-2 rounded-lg transition-all ${step === s.id ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Grilla Principal del Cotizador */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Columna de Controles Formularios (Izquierda) */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm min-h-[320px] flex flex-col justify-between">
            
            {/* PASO 1: PERFIL CON INPUTS REALES */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-1.5 uppercase tracking-wider">🏢 Perfil de la organización</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-zinc-700">Nombre de la empresa *</label>
                    <input 
                      type="text" required placeholder="Ej: Seguridad ACME S.A." value={companyName} onChange={e => setCompanyName(e.target.value)}
                      className="w-full p-2.5 border border-zinc-300 rounded-lg text-xs bg-zinc-50 font-medium focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-zinc-700">Sector Industrial</label>
                    <input 
                      type="text" placeholder="Ej: Retail / Logística" value={industry} onChange={e => setIndustry(e.target.value)}
                      className="w-full p-2.5 border border-zinc-300 rounded-lg text-xs bg-zinc-50 font-medium focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-zinc-700">Tamaño aproximado / Sedes</label>
                    <input 
                      type="text" placeholder="Ej: 3 Oficinas / 50 empleados" value={companySize} onChange={e => setCompanySize(e.target.value)}
                      className="w-full p-2.5 border border-zinc-300 rounded-lg text-xs bg-zinc-50 font-medium focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-zinc-700">Contacto Operativo (Teléfono/Email) *</label>
                    <input 
                      type="text" required placeholder="Ej: +56912345678" value={contactInfo} onChange={e => setContactInfo(e.target.value)}
                      className="w-full p-2.5 border border-zinc-300 rounded-lg text-xs bg-zinc-50 font-medium focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PASO 2: SELECCIÓN DE HARDWARE REAL */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-1.5 uppercase tracking-wider">📦 Selección de Tecnología</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-zinc-700">Modelo de Cámara en Bodega:</label>
                    <select 
                      value={selectedCamId} onChange={e => setSelectedCamId(e.target.value)}
                      className="w-full p-2.5 border border-zinc-300 rounded-lg bg-zinc-50 text-xs font-bold focus:outline-none focus:border-zinc-900"
                    >
                      {activeCatalog.map(c => (
                        <option key={c.id} value={c.id}>{c.label} (${c.price.toLocaleString('es-CL')} c/u) - Stock: {c.stock}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-zinc-700">Cantidad de Puntos de Captura (Cámaras):</label>
                    <input 
                      type="number" min="1" max="64" value={cameraCount} onChange={e => setCameraCount(parseInt(e.target.value) || 1)}
                      className="w-full p-2.5 border border-zinc-300 rounded-lg bg-zinc-50 text-xs font-mono font-bold focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PASO 3: ALCANCE TÉCNICO Y DESPLIEGUE */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-1.5 uppercase tracking-wider">📐 Parámetros de Canalización y Altura</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-zinc-700">Metraje Estimado de Cableado (Mtrs):</label>
                    <input 
                      type="number" min="5" value={meters} onChange={e => setMeters(parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 border border-zinc-300 rounded-lg bg-zinc-50 text-xs font-mono font-bold focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-zinc-700">Complejidad de Altura / Soporte:</label>
                    <select 
                      value={complexHeight} onChange={e => setComplexHeight(e.target.value)}
                      className="w-full p-2.5 border border-zinc-300 rounded-lg bg-zinc-50 text-xs font-bold focus:outline-none focus:border-zinc-900"
                    >
                      <option value="Baja">Baja (Menos de 3 metros / Muros estándar)</option>
                      <option value="Alta">Alta (Postes de acero / Techos industriales / Certificación)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* PASO 4: RESUMEN DE TRANSMISIÓN */}
            {step === 4 && (
              <div className="space-y-3 text-center py-4">
                <div className="text-3xl animate-bounce">⚡</div>
                <h3 className="text-sm font-bold text-zinc-900 uppercase">Propuesta Técnica Estructurada</h3>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  Todos los cálculos han sido procesados localmente. Al presionar el botón de envío, la orden se inyectará directamente en la Mesa del Administrador.
                </p>
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-left text-[11px] font-medium space-y-1 max-w-xs mx-auto">
                  <p><span className="font-bold text-zinc-500">Empresa:</span> {companyName || 'No especificado'}</p>
                  <p><span className="font-bold text-zinc-500">Hardware:</span> {cameraCount}x {currentCam.label}</p>
                  <p><span className="font-bold text-zinc-500">Cableado:</span> {meters} Metros ({complexHeight})</p>
                </div>
              </div>
            )}

            {/* Botonera de Control de Flujo */}
            <div className="flex justify-between items-center pt-4 border-t border-zinc-100 mt-6">
              <button
                type="button" disabled={step === 1} onClick={() => setStep(prev => prev - 1)}
                className="px-4 py-2 text-xs font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 rounded-xl transition-all"
              >
                ← Anterior
              </button>
              
              {step < 4 ? (
                <button
                  type="button" onClick={() => setStep(prev => prev + 1)}
                  className="px-4 py-2 text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all"
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  type="button" onClick={handleTriggerQuote}
                  className="px-5 py-2 text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-md transition-all uppercase tracking-wider"
                >
                  ⚡ Enviar Propuesta a Central
                </button>
              )}
            </div>

          </div>

          {/* Tarjeta de Resumen Estática (Derecha) - ACTUALIZACIÓN EN TIEMPO REAL */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">📊 Monitor de Costos Real</h3>
            <div className="space-y-2 border-b border-zinc-100 pb-3 text-zinc-600 text-xs font-medium">
              <div className="flex justify-between">
                <span>Cámaras ({cameraCount} ud)</span>
                <span className="font-mono font-bold text-zinc-900">${hardwareBasePrice.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between">
                <span>Metraje Canalización</span>
                <span className="font-mono font-bold text-zinc-900">${(meters * 1200).toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between">
                <span>Soporte Altura ({complexHeight})</span>
                <span className="font-mono font-bold text-zinc-900">${(complexHeight === 'Alta' ? 35000 : 15000).toLocaleString('es-CL')}</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="font-bold text-sm text-zinc-900">Total Estimado:</span>
              <span className="text-xl font-black text-emerald-600 font-mono">${totalEstimated.toLocaleString('es-CL')}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}