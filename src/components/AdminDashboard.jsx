import React, { useState } from 'react';

export default function AdminDashboard({ 
  setView, catalog, onAddProduct, onDeleteProduct, 
  quotes, onAdjustQuote, appointments, onManualSchedule, 
  blockedDates, onToggleBlockDate, users, onAssignTech, onConfirmDispatch, onArchiveJob,
  onApproveQuote, analytics
}) {
  const [tab, setTab] = useState('ops');
  const [selectedUserFolder, setSelectedUserFolder] = useState(null);
  
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemStock, setNewItemStock] = useState('');

  const [localPrices, setLocalPrices] = useState({});
  const [localNotes, setLocalNotes] = useState({});

  const [extName, setExtName] = useState('');
  const [extService, setExtService] = useState('Instalación de Sistema Nuevo');
  const [extAddr, setExtAddr] = useState('');
  const [extPhone, setExtPhone] = useState('');
  const [extDate, setExtDate] = useState('');

  const [dateToBlock, setDateToBlock] = useState('');
  
  const staff = ['Sin Asignar', 'Juan Pérez (Móvil 1)', 'Carlos Silva (Móvil 2)', 'Andrés León (Móvil 3)'];

  // Validar que appointments sea un arreglo antes de filtrar para evitar crasheos
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const activeAppointments = safeAppointments.filter(app => app && (app.status === 'Asignado' || app.status === 'Pendiente Despacho' || app.status === 'En Ruta'));
  const reviewAppointments = safeAppointments.filter(app => app && app.status === 'Revisión Técnico');

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newItemLabel || !newItemPrice || !newItemStock) return alert('Por favor rellene todos los datos.');
    onAddProduct(newItemLabel, parseInt(newItemPrice), parseInt(newItemStock));
    setNewItemLabel(''); setNewItemPrice(''); setNewItemStock('');
    alert('📦 Producto inyectado con éxito en el Maestro de Inventario.');
  };

  const handleExternalScheduleSubmit = (e) => {
    e.preventDefault();
    if (!extName || !extAddr || !extPhone || !extDate) return alert('Complete todos los campos de la cita externa.');
    
    const existingCount = safeAppointments.filter(app => app && app.date === extDate).length;
    if (existingCount >= 6) return alert('🚫 No se puede agendar. Esta fecha ya alcanzó el tope máximo de 6 visitas.');
    if (blockedDates.includes(extDate)) return alert('🔒 Esta fecha está bloqueada manualmente por la administración.');

    onManualSchedule(extName, extService, extDate, extAddr, extPhone);
    setExtName(''); setExtAddr(''); setExtPhone(''); setExtDate('');
    alert('📅 Cita externa inyectada exitosamente ocupando 1 cupo del día.');
  };

  return (
    <div className="min-h-screen bg-[#042120] flex font-sans text-xs text-teal-100 w-full">
      {/* Barra Lateral de Navegación Local */}
      <div className="w-52 bg-[#0a3a37] border-r border-teal-900 p-4 flex flex-col justify-between flex-shrink-0 font-bold">
        <div className="space-y-6">
          <div className="flex justify-center py-2 bg-[#042120]/40 rounded-xl border border-teal-900/30">
            <span className="text-[#ecc245] tracking-widest font-black uppercase text-[11px]">🛡️ CENTRAL CISVEN</span>
          </div>
          <nav className="flex flex-col gap-1.5 pt-4">
            <button type="button" onClick={() => { setTab('ops'); setSelectedUserFolder(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-2 ${tab === 'ops' ? 'bg-[#085a4f] text-white' : 'opacity-70 hover:bg-[#042120]'}`}>📊 Tráfico Operativo</button>
            <button type="button" onClick={() => { setTab('price'); setSelectedUserFolder(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-2 ${tab === 'price' ? 'bg-[#085a4f] text-white' : 'opacity-70 hover:bg-[#042120]'}`}>📦 Catálogo y Tarifas</button>
            <button type="button" onClick={() => { setTab('users'); setSelectedUserFolder(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-2 ${tab === 'users' ? 'bg-[#085a4f] text-white' : 'opacity-70 hover:bg-[#042120]'}`}>👥 Abonados ({Array.isArray(users) ? users.length : 0})</button>
            <button type="button" onClick={() => { setTab('reports'); setSelectedUserFolder(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-2 ${tab === 'reports' ? 'bg-[#085a4f] text-white' : 'opacity-70 hover:bg-[#042120]'}`}>📈 Reportes de Producción</button>
          </nav>
        </div>
        <button type="button" onClick={() => setView('landing')} className="bg-[#042120] text-center font-bold py-2 rounded-xl text-teal-400 border border-teal-900">
          🔒 Cerrar Sesión Central
        </button>
      </div>

      {/* Área de Contenido de la Consola */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        <h1 className="text-base font-black text-white uppercase tracking-wider">
          {tab === 'ops' && 'Mesa de Control de Incidentes y Despachos'}
          {tab === 'price' && 'Maestro de Inventario y Carga de Existencias'}
          {tab === 'users' && !selectedUserFolder && 'Fichero General de Abonados'}
          {tab === 'reports' && 'Inteligencia de Negocios y Rendimiento Semanal'}
          {selectedUserFolder && `Expediente: ${selectedUserFolder.name}`}
        </h1>

        {tab === 'ops' && (
          <div className="space-y-6">
            {/* RETORNO TÉCNICO */}
            {reviewAppointments.length > 0 && (
              <div className="bg-[#0f4d39] p-4 rounded-2xl border-2 border-emerald-500 shadow-2xl space-y-3">
                <h3 className="font-black text-emerald-300 uppercase flex justify-between items-center text-xs tracking-wider animate-pulse">
                  <span>📥 OBSERVACIONES TÉCNICAS POR REVISAR (RETORNO DE TERRENO)</span>
                  <span className="bg-emerald-900 text-emerald-300 px-2.5 py-0.5 rounded-full font-black text-[10px]">{reviewAppointments.length}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reviewAppointments.map(app => (
                    <div key={app.id} className="p-3 bg-[#042120] border border-emerald-600 rounded-xl space-y-2">
                      <div className="text-[11px] space-y-1">
                        <p className="font-black text-white text-xs">Abonado: {app.user}</p>
                        <p className="text-teal-400">📍 Dirección: <span className="text-white font-medium">{app.address}</span></p>
                        <p className="text-teal-400">👷 Cerrado por: <span className="text-[#ecc245] font-bold">{app.technician}</span></p>
                        
                        <div className="mt-2 p-2.5 bg-emerald-950/80 border border-emerald-500/40 rounded-lg">
                          <p className="text-[9px] font-black text-[#ecc245] uppercase tracking-wide">📝 Reporte del Instalador en Terreno:</p>
                          <p className="text-emerald-200 font-bold italic text-xs mt-0.5">"{app.techObservation}"</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button 
                          type="button" 
                          onClick={() => {
                            // Validamos y limpiamos los datos antes de enviarlos al App.jsx para evitar la pantalla blanca
                            const safeId = app.id;
                            const safeUser = app.user || 'Abonado General';
                            const safeTech = app.technician || 'Sin Asignar';
                            const safeObs = app.techObservation || 'Orden procesada.';
                            const safeService = app.service || 'Servicio Técnico';
                            const safePrice = parseInt(app.price) || 45000;
                            const safeMeters = parseInt(app.meters) || 15;

                            if (typeof onArchiveJob === 'function') {
                              onArchiveJob(safeId, safeUser, safeTech, safeObs, safeService, safePrice, safeMeters);
                              alert('✓ Órden archivada con éxito en el historial y sumada al panel de analíticas.');
                            } else {
                              alert('Error: La función de archivado no está conectada correctamente.');
                            }
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2 rounded-lg uppercase text-[10px] tracking-wider"
                        >
                          ✓ Validar, Archivar Historial y Limpiar Mesa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AGENDA TELEFÓNICA Y BLOQUEOS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <form onSubmit={handleExternalScheduleSubmit} className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-800/40 space-y-3">
                <h3 className="font-bold text-[#ecc245] uppercase text-[11px] tracking-wider">➕ Agendar Cita Manual (Llamados por fuera de la App)</h3>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Nombre del Cliente" value={extName} onChange={e => setExtName(e.target.value)} className="p-2 bg-[#042120] border border-teal-900 rounded-lg text-white font-bold" />
                  <input type="tel" placeholder="Teléfono" value={extPhone} onChange={e => setExtPhone(e.target.value)} className="p-2 bg-[#042120] border border-teal-900 rounded-lg text-white font-bold" />
                  <input type="text" placeholder="Dirección del Trabajo" value={extAddr} onChange={e => setExtAddr(e.target.value)} className="col-span-2 p-2 bg-[#042120] border border-teal-900 rounded-lg text-white font-bold" />
                  <select value={extService} onChange={e => setExtService(e.target.value)} className="p-2 bg-[#042120] border border-teal-900 rounded-lg text-white font-bold">
                    <option value="Instalación de Sistema Nuevo">Instalación de Sistema Nuevo</option>
                    <option value="Ampliación de Cobertura Domo">Ampliación de Cobertura Domo</option>
                    <option value="Mantención de Enlaces y Conectividad">Mantención de Enlaces</option>
                    <option value="Revisión Técnica por Falla o Alerta">Revisión por Falla</option>
                  </select>
                  <input type="date" value={extDate} onChange={e => setExtDate(e.target.value)} className="p-2 bg-[#042120] border border-teal-900 rounded-lg text-white font-bold" />
                </div>
                <button type="submit" className="w-full bg-[#085a4f] hover:bg-[#0b6b5e] text-white font-black py-2 rounded-xl uppercase tracking-wider text-[10px]">
                  Insertar Cita y Restar Cupo Diario
                </button>
              </form>

              <div className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-800/40 space-y-3 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-red-400 uppercase text-[11px] tracking-wider">🔒 Bloqueo Preventivo de Calendario</h3>
                  <p className="text-[10px] text-teal-400 mt-1">Seleccione un día para cerrarlo por completo.</p>
                  <div className="flex gap-2 mt-3">
                    <input type="date" value={dateToBlock} onChange={e => setDateToBlock(e.target.value)} className="p-2 bg-[#042120] border border-teal-900 rounded-lg text-white font-bold flex-1" />
                    <button 
                      type="button" 
                      onClick={() => {
                        if (!dateToBlock) return alert('Seleccione una fecha.');
                        onToggleBlockDate(dateToBlock); setDateToBlock('');
                      }} 
                      className="bg-red-600 hover:bg-red-700 text-white font-black px-4 rounded-lg uppercase text-[10px]"
                    >
                      Alternar Bloqueo
                    </button>
                  </div>
                </div>
                {Array.isArray(blockedDates) && blockedDates.length > 0 && (
                  <div className="pt-2 border-t border-teal-900">
                    <p className="text-[9px] font-black text-gray-400 uppercase">Días Cerrados:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {blockedDates.map(d => (
                        <span key={d} className="bg-red-950 text-red-400 border border-red-900 px-2 py-0.5 rounded font-mono text-[9px] font-bold">{d}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* COTIZACIONES INTERACTIVAS Y CITAS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-800/40 space-y-2">
                <h3 className="font-bold text-teal-400 border-b border-teal-900 pb-2 uppercase flex justify-between items-center">
                  <span>📦 Cotizaciones Inteligentes de Clientes</span>
                  <span className="bg-teal-950 text-teal-400 px-2.5 py-0.5 rounded-full font-black text-[10px]">{Array.isArray(quotes) ? quotes.length : 0}</span>
                </h3>
                {(!quotes || quotes.length === 0) ? <p className="italic text-teal-600 text-center py-4">Sin solicitudes pendientes</p> : quotes.map(q => (
                  <div key={q.id} className="p-3 bg-[#042120] border border-teal-900 rounded-xl flex flex-col space-y-2 shadow-lg">
                    <div>
                      <div className="flex justify-between items-start">
                        <p className="font-black text-white text-sm">{q.user}</p>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${q.status === 'Respondido' ? 'bg-amber-950 text-[#ecc245] border border-amber-800' : q.status === 'Aceptado por Cliente' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-teal-950 text-teal-400 border border-teal-900'}`}>
                          {q.status === 'Respondido' ? 'Enviado a Cliente' : q.status === 'Aceptado por Cliente' ? 'Aceptado por Cliente' : 'Por Estudiar'}
                        </span>
                      </div>
                      <p className="text-gray-400 font-bold mt-1 text-xs">Precio Sugerido IA: <span className="text-teal-400 font-mono font-black">${q.total ? q.total.toLocaleString('es-CL') : '0'}</span></p>
                      {q.status === 'Respondido' && (
                        <p className="text-amber-400 font-mono font-bold text-[11px] mt-0.5">➔ Rebote de Valor Real: ${q.adjustedTotal?.toLocaleString('es-CL')}</p>
                      )}
                      <p className="text-slate-400 font-mono text-[10px] mt-1.5">⚙️ Solicitud: {q.cam}</p>
                      <p className="text-[10px] text-teal-400 mt-0.5">📍 Ubicación: {q.address}</p>
                      <p className="text-[10px] text-emerald-400 font-bold mt-1 bg-teal-950/40 p-1 rounded inline-block border border-teal-900/40">📞 Fono: {q.phone}</p>
                    </div>

                    {(q.status === 'Pending' || q.status === 'Pendiente') && (
                      <div className="bg-[#0a3a37] p-2.5 rounded-xl border border-teal-800 space-y-2 mt-2">
                        <p className="text-[9px] font-black text-[#ecc245] uppercase tracking-wider">✏️ Formulario de Ajuste Comercial (Rebote Real):</p>
                        <div className="grid grid-cols-3 gap-1.5">
                          <input 
                            type="number" placeholder="Valor Real ($)" value={localPrices[q.id] || ''}
                            onChange={e => setLocalPrices({...localPrices, [q.id]: e.target.value})}
                            className="col-span-1 p-2 bg-[#042120] border border-teal-950 rounded-lg text-xs text-[#ecc245] font-mono font-bold focus:outline-none"
                          />
                          <input 
                            type="text" placeholder="Nota de ajuste..." value={localNotes[q.id] || ''}
                            onChange={e => setLocalNotes({...localNotes, [q.id]: e.target.value})}
                            className="col-span-2 p-2 bg-[#042120] border border-teal-950 rounded-lg text-xs text-white focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const pReal = parseInt(localPrices[q.id]);
                            const nReal = localNotes[q.id] || 'Presupuesto oficial ajustado.';
                            if (!pReal) return alert('Por favor, ingrese el Valor Real Ajustado.');
                            onAdjustQuote(q.id, pReal, nReal);
                            alert('¡Rebote enviado con éxito!');
                          }}
                          className="w-full bg-[#085a4f] hover:bg-[#0b6b5e] text-white font-black py-2 rounded-lg text-[9px] uppercase tracking-wider transition-colors"
                        >
                          ⚡ Lanzar Rebote de Valor Real
                        </button>
                      </div>
                    )}

                    {q.status === 'Aceptado por Cliente' && (
                      <button 
                        type="button" 
                        onClick={() => { onApproveQuote(q); alert('✓ Cita técnica activada en tránsito.'); }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl uppercase text-[10px] tracking-wider mt-1"
                      >
                        ✓ CONFIRMAR Y CREAR CITA EN TRÁNSITO
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* CITAS EN TRÁNSITO */}
              <div className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-800/40 space-y-2">
                <h3 className="font-bold text-red-400 border-b border-teal-900 pb-2 uppercase">📅 Citas Técnicas en Tránsito ({activeAppointments.length})</h3>
                {activeAppointments.length === 0 ? <p className="italic text-teal-600 text-center py-4">Sin órdenes activas en tránsito.</p> : activeAppointments.map(app => {
                  const dayTotal = safeAppointments.filter(a => a && a.date === app.date).length;
                  return (
                    <div key={app.id} className="p-3 bg-[#042120] border border-teal-900 rounded-xl space-y-2">
                      <div className="space-y-0.5">
                        <div className="flex justify-between items-center">
                          <p className="font-black text-white">{app.user} - <span className="text-teal-300">"{app.service}"</span></p>
                          <span className="bg-teal-950 text-teal-400 px-2 py-0.5 rounded font-mono text-[9px]">📅 {app.date} ({dayTotal}/6 Cupos)</span>
                        </div>
                        <p className="text-[10px] text-teal-400">📍 Dirección: <span className="text-white font-bold">{app.address}</span></p>
                        <p className="text-[10px] text-teal-400">📞 Contacto: <span className="text-teal-200 font-mono font-bold">{app.phone}</span></p>
                        <p className="text-[10px] text-teal-500">👷 Operador Asignado: <span className={`font-bold underline ${app.status === 'En Ruta' ? 'text-emerald-400' : 'text-teal-300'}`}>{app.technician || 'Sin Asignar'} ({app.status})</span></p>
                      </div>
                      
                      {app.status !== 'En Ruta' && (
                        <div className="space-y-1.5 pt-1">
                          <select 
                            value={app.technician || 'Sin Asignar'} 
                            onChange={(e) => onAssignTech(app.id, e.target.value)} 
                            className="w-full p-2 bg-[#0a3a37] border border-teal-800 rounded-lg text-white font-bold focus:outline-none text-[11px]"
                          >
                            {staff.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          {app.technician && app.technician !== 'Sin Asignar' && (
                            <button type="button" onClick={() => onConfirmDispatch(app.id)} className="w-full bg-[#085a4f] hover:bg-[#0b6b5e] text-white text-[10px] font-black py-1.5 rounded-lg uppercase tracking-wider transition-all">
                              🚀 Confirmar y Despachar Ruta
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PANTALLA DE REPORTES */}
        {tab === 'reports' && (
          <div className="space-y-6 w-full block">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0a3a37] p-5 rounded-2xl border border-teal-800/40 shadow-xl flex flex-col items-center justify-center text-center">
                <p className="text-[#ecc245] font-black uppercase text-[10px] tracking-widest mb-1">💰 Facturación Bruta Semanal</p>
                <p className="text-3xl font-black text-white font-mono">${(analytics?.totalRevenue || 0).toLocaleString('es-CL')}</p>
                <div className="w-full h-1 bg-teal-900 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-[#ecc245]" style={{width: '100%'}}></div>
                </div>
              </div>
              <div className="bg-[#0a3a37] p-5 rounded-2xl border border-teal-800/40 shadow-xl flex flex-col items-center justify-center text-center">
                <p className="text-teal-400 font-black uppercase text-[10px] tracking-widest mb-1">🔧 Trabajos Finalizados</p>
                <p className="text-3xl font-black text-white font-mono">{analytics?.closedTicketsCount || 0}</p>
                <p className="text-[9px] text-teal-600 mt-2 font-bold uppercase">Mesa Operativa Limpia al 100%</p>
              </div>
              <div className="bg-[#0a3a37] p-5 rounded-2xl border border-teal-800/40 shadow-xl flex flex-col items-center justify-center text-center">
                <p className="text-emerald-400 font-black uppercase text-[10px] tracking-widest mb-1">📍 Despliegue de Fibra/UTP</p>
                <p className="text-3xl font-black text-white font-mono">{analytics?.totalMeters || 0}m</p>
                <p className="text-[9px] text-emerald-700 mt-2 font-bold uppercase">Metraje Real Sincronizado</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-[#0a3a37] p-5 rounded-2xl border border-teal-800/40 space-y-4">
                <h3 className="font-black text-white uppercase text-xs tracking-wider">👷 Ranking de Eficiencia Técnica</h3>
                <div className="space-y-3">
                  {!analytics?.techPerformance || Object.entries(analytics.techPerformance).length === 0 ? (
                    <p className="text-teal-700 italic py-4 text-center">Aguardando cierres de órdenes en terreno.</p>
                  ) : (
                    Object.entries(analytics.techPerformance)
                      .sort((a, b) => b[1] - a[1])
                      .map(([name, count], index) => (
                        <div key={name} className="flex items-center justify-between p-3 bg-[#042120] rounded-xl border border-teal-900">
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] ${index === 0 ? 'bg-[#ecc245] text-[#042120]' : 'bg-teal-900 text-teal-400'}`}>{index + 1}</span>
                            <span className="font-bold text-teal-100">{name}</span>
                          </div>
                          <p className="text-white font-black text-xs">{count} Cierres</p>
                        </div>
                      ))
                  )}
                </div>
              </div>

              <div className="bg-[#0a3a37] p-5 rounded-2xl border border-teal-800/40 space-y-4">
                <h3 className="font-black text-white uppercase text-xs tracking-wider">💎 Cartera de Clientes VIP (Inversión Semanal)</h3>
                <div className="space-y-3">
                  {!analytics?.customerSpend || Object.entries(analytics.customerSpend).length === 0 ? (
                    <p className="text-teal-700 italic py-4 text-center">Sin facturaciones archivadas todavía.</p>
                  ) : (
                    Object.entries(analytics.customerSpend)
                      .sort((a, b) => b[1] - a[1])
                      .map(([name, money]) => (
                        <div key={name} className="p-3 bg-[#042120] rounded-xl border border-emerald-900/40 flex justify-between items-center">
                          <span className="font-black text-white">{name}</span>
                          <span className="text-[#ecc245] font-black font-mono">${money.toLocaleString('es-CL')}</span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'price' && (
          <div className="space-y-4">
            <form onSubmit={handleCreateProduct} className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-800/40 space-y-3">
              <h3 className="font-bold text-[#ecc245] uppercase text-[11px] tracking-wider">📥 Inyectar Nuevo Producto al Catálogo</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-bold text-gray-300">Nombre del Equipo</label>
                  <input type="text" placeholder="Ej: Cámara Bullet 5MP AI" value={newItemLabel} onChange={e => setNewItemLabel(e.target.value)} className="p-2 bg-[#042120] border border-teal-900 rounded-xl text-white font-bold text-xs" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-bold text-gray-300">Precio CLP ($)</label>
                  <input type="number" placeholder="Ej: 55000" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} className="p-2 bg-[#042120] border border-teal-900 rounded-xl text-[#ecc245] font-mono font-bold text-xs" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-bold text-gray-300">Stock Físico Inicial</label>
                  <input type="number" placeholder="Ej: 25" value={newItemStock} onChange={e => setNewItemStock(e.target.value)} className="p-2 bg-[#042120] border border-teal-900 rounded-xl text-white text-center font-bold text-xs" />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#085a4f] hover:bg-[#0b6b5e] text-white text-[10px] font-black py-2 rounded-xl uppercase tracking-wider">+ Cargar Producto al Maestro e Inyectar a Clientes</button>
            </form>

            <div className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-800/40 space-y-3">
              <h3 className="font-bold text-white uppercase text-[11px]">📦 Inventario Físico Actual</h3>
              <div className="space-y-2">
                {Array.isArray(catalog) && catalog.map((item) => (
                  <div key={item.id} className="p-2.5 bg-[#042120] rounded-xl border border-teal-900/60 grid grid-cols-12 gap-2 items-center font-bold">
                    <span className="col-span-5 text-teal-200">{item.label}</span>
                    <div className="col-span-3 text-right text-[#ecc245] font-mono pr-2">
                      ${item.price ? item.price.toLocaleString('es-CL') : '0'}
                    </div>
                    <div className="col-span-3 text-center text-white font-mono">
                      {item.stock} uds
                    </div>
                    <div className="col-span-1 text-center">
                      <button type="button" onClick={() => { if(confirm(`¿Desea eliminar ${item.label}?`)) onDeleteProduct(item.id); }} className="text-red-400 hover:text-red-500 text-sm font-sans">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'users' && !selectedUserFolder && (
          <div className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-800/40 space-y-2">
            {Array.isArray(users) && users.map(u => (
              <div key={u.id} onClick={() => setSelectedUserFolder(u)} className="p-3 bg-[#042120] hover:bg-[#07302e] border border-teal-900 rounded-xl flex justify-between items-center cursor-pointer">
                <div>
                  <p className="font-black text-white">{u.name}</p>
                  <p className="text-[10px] text-teal-600">RUT: {u.rut} | Fono: {u.phone}</p>
                </div>
                <span className="text-teal-400 font-bold">Ver Historial →</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'users' && selectedUserFolder && (
          <div className="bg-[#0a3a37] p-5 rounded-2xl border border-teal-800/40 space-y-4">
            <div className="flex justify-between items-center border-b border-teal-900 pb-2">
              <h2 className="text-sm font-black text-white">{selectedUserFolder.name}</h2>
              <button onClick={() => setSelectedUserFolder(null)} className="bg-[#042120] text-teal-400 px-3 py-1 rounded-lg">Atrás</button>
            </div>
            <p><strong>📍 Dirección Registrada:</strong> {selectedUserFolder.address}</p>
            <p><strong>📞 Teléfono Principal:</strong> <span className="text-[#ecc245] font-mono">{selectedUserFolder.phone}</span></p>
            <p><strong>🛠️ Equipamiento en Propiedad:</strong> {selectedUserFolder.installedHardware}</p>
            
            <div className="space-y-2 pt-2">
              <h4 className="font-black text-teal-400 uppercase text-[10px]">📜 Historial / Bitácora de Campo Guardada:</h4>
              {(!selectedUserFolder.historyLog || selectedUserFolder.historyLog.length === 0) ? (
                <p className="text-teal-600 italic">No hay registros cerrados todavía.</p>
              ) : selectedUserFolder.historyLog.map(log => (
                <div key={log.id} className="p-2.5 bg-[#042120] border border-teal-950 rounded-xl">
                  <div className="flex justify-between font-bold text-gray-300 text-[10px]">
                    <span>🛠️ {log.type}</span>
                    <span className="text-teal-500">👷 {log.technician}</span>
                  </div>
                  <p className="text-emerald-400 mt-1 italic font-medium">Observación: "{log.detail}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}