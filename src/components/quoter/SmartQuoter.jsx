import React, { useState } from 'react';
import StepIndicator from './StepIndicator';
import ServiceCard from './ServiceCard';

function FieldShell({ label, hint }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-zinc-800">{label}</span>
        {hint ? <span className="text-xs text-zinc-400">{hint}</span> : null}
      </div>
      <div className="h-10 rounded-lg border border-dashed border-zinc-200 bg-zinc-50/80" />
    </div>
  );
}

export default function SmartQuoter({ catalog, onSendQuote }) {
  // Estado local para maquetar el recorrido visual del MVP
  const [step, setStep] = useState(1);

  // Usamos el catálogo inyectado dinámicamente o un respaldo local si viene vacío
  const activeCatalog = Array.isArray(catalog) ? catalog : [
    { id: 1, label: '720p Básica Estándar', price: 25000, stock: 45 }, 
    { id: 2, label: '1080p Domo Alta Def.', price: 45000, stock: 30 }, 
    { id: 3, label: '4K Profesional + AI', price: 95000, stock: 12 }
  ];

  return (
    <div className="w-full min-h-screen bg-zinc-50 text-zinc-950 font-sans antialiased p-4 md:p-8">
      {/* Contenedor fluido expansivo adaptado a la identidad visual original */}
      <div className="w-full space-y-8">
        
        {/* Encabezado Principal */}
        <div className="max-w-3xl">
          <p className="mb-3 inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm">
            Smart Quoter
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Cotización inteligente para tu empresa
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            Estructura visual del flujo: perfil, servicios sugeridos y resumen operativo de red.
          </p>
        </div>

        {/* Indicador de Pasos del Proceso (Nativo) */}
        <div className="w-full bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm">
          <StepIndicator currentStep={step} setStep={setStep} />
        </div>

        {/* Grilla Operativa del Cotizador */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Columna Izquierda: Formulario e Interfaz Variable */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-100 pb-2">📋 Perfil de la organización</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FieldShell label="Nombre de la empresa" hint="Ej: ACME S.A." />
                  <FieldShell label="Sector Industrial" hint="Selección futura" />
                  <FieldShell label="Tamaño aproximado" hint="Empleados / Sedes" />
                  <FieldShell label="Contacto Operativo" hint="Correo o Teléfono" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-100 pb-2">📦 Selección de Equipos del Catálogo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeCatalog.map((item) => (
                    <ServiceCard 
                      key={item.id}
                      title={item.label}
                      price={`$${item.price.toLocaleString('es-CL')} / ud`}
                      description={`Disponibilidad en bodega: ${item.stock} unidades listas para despacho.`}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-100 pb-2">📐 Alcance técnico y despliegue</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FieldShell label="Metraje Estimado de Cableado" hint="Fibra / UTP" />
                  <FieldShell label="Complejidad de Altura" hint="Pisos / Postes" />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 text-center py-6">
                <div className="text-3xl">🚀</div>
                <h3 className="text-base font-bold text-zinc-900">¡Configuración del MVP Lista!</h3>
                <p className="text-zinc-500 text-xs max-w-sm mx-auto">
                  La estructura de datos está lista. Al presionar enviar, se transmitirá la propuesta directamente a la Mesa de Control Central del Administrador.
                </p>
              </div>
            )}

            {/* Botones de Navegación del Flujo */}
            <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
              <button
                type="button"
                disabled={step === 1}
                onClick={() => setStep(prev => prev - 1)}
                className="px-4 py-2 text-xs font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 rounded-xl transition-all"
              >
                ← Anterior
              </button>
              
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(prev => prev + 1)}
                  className="px-4 py-2 text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all"
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (typeof onSendQuote === 'function') {
                      onSendQuote('Cliente Invitado', 'Residencial Pro', 'Pack Cámaras AI Estándar', 165000, 'Santiago Región', 25, '+56976543210');
                      alert('✨ Solicitud de cotización inyectada con éxito en la Mesa del Admin.');
                      setStep(1);
                    }
                  }}
                  className="px-5 py-2 text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-md transition-all"
                >
                  ⚡ Enviar Propuesta Oficial a Central
                </button>
              )}
            </div>
          </div>

          {/* Columna Derecha: Tarjeta Resumen de Inversión Estática */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider">📊 Resumen Estimado</h3>
            <div className="space-y-2 border-b border-zinc-100 pb-3 text-zinc-600">
              <div className="flex justify-between"><span>Evaluación Inicial</span><span className="font-mono font-bold">$0</span></div>
              <div className="flex justify-between"><span>Hardware Base</span><span className="font-mono font-bold">$125.000</span></div>
              <div className="flex justify-between"><span>Despliegue Técnico</span><span className="font-mono font-bold">$40.000</span></div>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="font-bold text-zinc-900">Total Estimado:</span>
              <span className="text-lg font-black text-zinc-900 font-mono">$165.000</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}