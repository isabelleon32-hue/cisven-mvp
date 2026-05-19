import React, { useState, useEffect } from 'react';

// ==========================================
// COMPONENTE DE LOGO CORPORATIVO CON ANIMACIÓN
// ==========================================
export const BrandLogo = ({ size = "md" }) => (
  <div className="flex items-center gap-2.5 justify-center">
    <div className={`bg-gradient-to-br from-[#004aad] to-blue-600 flex items-center justify-center rounded-xl font-black text-white shadow-lg shadow-blue-500/20 border border-blue-400/30 relative ${size === 'lg' ? 'w-12 h-12 text-xl' : 'w-9 h-9 text-sm'}`}>
      <span className="relative z-10">C</span>
      <div className="absolute w-full h-full bg-blue-400/20 rounded-xl animate-ping opacity-40"></div>
    </div>
    <div className="text-left">
      <h1 className={`font-black tracking-tight text-white leading-none ${size === 'lg' ? 'text-2xl' : 'text-base'}`}>
        CIS<span className="text-blue-400">VEN</span>
      </h1>
      <p className="text-[8px] text-yellow-400 uppercase tracking-widest font-bold mt-0.5">Seguridad AI</p>
    </div>
  </div>
);

// ==========================================
// PANTALLA DE BIENVENIDA (LANDING)
// ==========================================
function Landing({ setView }) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const handleAdminAccess = (e) => {
    e.preventDefault();
    if (adminPassword === 'cisven2026') {
      setView('admin-ops');
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert('🔒 Credencial de Central Incorrecta. Acceso Denegado.');
      setAdminPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col justify-center items-center p-6 text-center relative overflow-hidden font-sans">
      <div className="absolute w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-3xl -top-20 -left-20"></div>
      
      <div className="space-y-2 mb-10 relative z-10">
        <BrandLogo size="lg" />
      </div>

      {!showAdminLogin ? (
        <>
          <div className="bg-[#0f172a] p-5 rounded-2xl text-left text-xs mb-8 space-y-2 border border-slate-800 shadow-xl max-w-xs w-full animate-fadeIn">
            <p className="text-blue-400 font-bold uppercase text-[9px] tracking-wider mb-1">Módulos de Control Técnico:</p>
            <p className="text-slate-300">● Trazabilidad de hojas de ruta por instalador asignado.</p>
            <p className="text-slate-300">● Inyección de bitácora histórica desde terreno.</p>
            <p className="text-slate-300">● Despacho inmediato por coordenadas S.O.S.</p>
          </div>

          <div className="flex flex-col w-full max-w-xs gap-3 relative z-10">
            <button onClick={() => setView('app-dashboard')} className="w-full bg-[#004aad] hover:bg-blue-600 text-white py-3.5 rounded-xl font-black text-xs tracking-wider uppercase shadow-lg shadow-blue-500/10 transition-all active:scale-95">
              Ingresar como Cliente
            </button>
            <button onClick={() => setShowAdminLogin(true)} className="w-full bg-slate-950 hover:bg-slate-900 text-slate-400 py-3 rounded-xl border border-slate-800 text-xs font-bold transition-all uppercase tracking-wider">
              Consola Central (Admin)
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleAdminAccess} className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-2xl max-w-xs w-full text-left space-y-4 animate-fadeIn relative z-10">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wide">Autenticación de Central</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Módulo restringido para personal autorizado.</p>
          </div>
          
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Contraseña Administrativa</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={adminPassword} 
              onChange={e => setAdminPassword(e.target.value)} 
              className="w-full p-2.5 bg-[#0b0f19] border border-slate-800 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-blue-500"
              required 
              autoFocus
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => { setShowAdminLogin(false); setAdminPassword(''); }} className="w-1/3 bg-[#0b0f19] border border-slate-800 text-slate-400 text-[10px] font-bold rounded-xl py-2 uppercase">
              Cancelar
            </button>
            <button type="submit" className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black rounded-xl py-2 uppercase tracking-wider">
              Verificar Token
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
function ClientAuth({ users, onRegister, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [rut, setRut] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanRut = rut.trim();
    if (isLogin) {
      const found = users.find(u => u.rut.trim() === cleanRut);
      if (found) onLoginSuccess(found);
      else alert('RUT no registrado. Usa el RUT de prueba rápido 1-9.');
    } else {
      if (!name || !cleanRut || !address) return alert('Completa todos los campos.');
      if (users.find(u => u.rut.trim() === cleanRut)) return alert('Este RUT ya existe.');
      const newUser = { id: Date.now(), name, rut: cleanRut, address, contract: 'Monitoreo Estándar AI', installedHardware: '4x Cámaras Domo 1080p / 1x Grabador NVR', status: 'Activo', historyLog: [] };
      onRegister(newUser);
      onLoginSuccess(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col justify-center max-w-md mx-auto p-6 text-white">
      <div className="bg-[#0f172a] p-6 rounded-2xl shadow-xl border border-slate-800 space-y-4">
        <div className="flex border-b border-slate-800 pb-2">
          <button onClick={() => setIsLogin(true)} className={`w-1/2 text-center py-1 text-xs font-bold ${isLogin ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-500'}`}>Iniciar Sesión</button>
          <button onClick={() => setIsLogin(false)} className={`w-1/2 text-center py-1 text-xs font-bold ${!isLogin ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-500'}`}>Registrarse</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <>
              <input type="text" placeholder="Nombre o Razón Social" value={name} onChange={e => setName(e.target.value)} className="w-full p-2.5 bg-[#0b0f19] border border-slate-800 rounded-xl text-xs text-white" required />
              <input type="text" placeholder="Dirección de la Propiedad" value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2.5 bg-[#0b0f19] border border-slate-800 rounded-xl text-xs text-white" required />
            </>
          )}
          <input type="text" placeholder="RUT (Ej: 1-9)" value={rut} onChange={e => setRut(e.target.value)} className="w-full p-2.5 bg-[#0b0f19] border border-slate-800 rounded-xl text-xs font-bold text-white" required />
          <button type="submit" className="w-full bg-[#004aad] hover:bg-blue-600 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider">
            {isLogin ? 'Entrar Seguro' : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// DASHBOARD ADMINISTRATIVO CENTRAL
// ==========================================
function AdminDashboard({ setView, catalog, setCatalog, quotes, setQuotes, appointments, setAppointments, users, calendarDays, setCalendarDays, onAssignTech }) {
  const [tab, setTab] = useState('ops');
  const [selectedUserFolder, setSelectedUserFolder] = useState(null);
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemStock, setNewItemStock] = useState('');

  const staff = ['Sin Asignar', 'Juan Pérez (Móvil 1)', 'Carlos Silva (Móvil 2)', 'Andrés León (Móvil 3)'];

  return (
    <div className="min-h-screen bg-[#0b0f19] flex font-sans text-xs text-slate-300">
      <div className="w-52 bg-[#0f172a] border-r border-slate-800 p-4 flex flex-col justify-between flex-shrink-0 font-bold">
        <div className="space-y-6">
          <BrandLogo />
          <nav className="flex flex-col gap-1.5 pt-4">
            <button onClick={() => { setTab('ops'); setSelectedUserFolder(null); }} className={`w-full text-left p-2 rounded-lg ${tab === 'ops' ? 'bg-[#004aad] text-white' : 'opacity-70 hover:bg-slate-800'}`}>📊 Tráfico Operativo</button>
            <button onClick={() => { setTab('price'); setSelectedUserFolder(null); }} className={`w-full text-left p-2 rounded-lg ${tab === 'price' ? 'bg-[#004aad] text-white' : 'opacity-70 hover:bg-slate-800'}`}>📦 Catálogo e Inventario</button>
            <button onClick={() => { setTab('users'); setSelectedUserFolder(null); }} className={`w-full text-left p-2 rounded-lg ${tab === 'users' ? 'bg-[#004aad] text-white' : 'opacity-70 hover:bg-slate-800'}`}>👥 Abonados ({users.length})</button>
          </nav>
        </div>
        <div className="flex flex-col gap-2 border-t border-slate-800 pt-3">
          <button onClick={() => setView('tecnico-app')} className="text-yellow-400 text-left underline font-bold">→ Ver App Técnico</button>
          <button onClick={() => setView('landing')} className="opacity-50 text-left font-medium">← Volver al Inicio</button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        <h1 className="text-base font-black text-white uppercase tracking-wider">
          {tab === 'ops' && 'Mesa de Incidentes y Tráfico Operativo'}
          {tab === 'price' && 'Maestro de Tarifas y Gestión de Stock'}
          {tab === 'users' && !selectedUserFolder && 'Fichero General de Abonados'}
          {selectedUserFolder && `Expediente: ${selectedUserFolder.name}`}
        </h1>

        {tab === 'ops' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-blue-400 border-b border-slate-800 pb-2 uppercase flex justify-between items-center">
                <span>📦 Cotizaciones Recibidas</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full font-black">{quotes.length}</span>
              </h3>
              {quotes.length === 0 ? <p className="italic text-slate-500 text-center py-4">Sin solicitudes pendientes</p> : quotes.map(q => (
                <div key={q.id} className="p-3 bg-[#0b0f19] border border-slate-800/60 rounded-xl flex justify-between items-start">
                  <div>
                    <p className="font-bold text-white">{q.user}</p>
                    <p className="text-slate-400 font-mono font-bold mt-0.5">{q.cam}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">📍 {q.address}</p>
                    <p className="text-yellow-400 font-black mt-1 text-sm font-mono">${q.total.toLocaleString('es-CL')}</p>
                  </div>
                  <button onClick={() => setQuotes(quotes.filter(item => item.id !== q.id))} className="text-[10px] bg-red-500/10 text-red-400 font-bold px-2 py-1 rounded-lg">✕ Quitar</button>
                </div>
              ))}
            </div>

            <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-red-400 border-b border-slate-800 pb-2 uppercase flex justify-between items-center">
                <span>📅 Citas y Alertas S.O.S</span>
                <span className="text-[10px] bg-red-500/20 text-red-400 px-2.5 py-0.5 rounded-full font-black">{appointments.length}</span>
              </h3>
              {appointments.length === 0 ? <p className="italic text-slate-500 text-center py-4">Sistemas estables en Chile.</p> : appointments.map(app => (
                <div key={app.id} className="p-3 bg-[#0b0f19] border border-slate-800 rounded-xl flex flex-col space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black text-white">{app.user} - <span className="text-red-400 font-black">"{app.service}"</span></p>
                      <p className="text-[10px] text-slate-400">📍 Dirección: <span className="font-bold">{app.address}</span></p>
                      <p className="text-[10px] text-slate-500">🛠️ Asignado a: <span className="text-blue-400 underline font-bold">{app.technician || 'Sin Asignar'}</span></p>
                    </div>
                    <button onClick={() => setAppointments(appointments.filter(item => item.id !== app.id))} className="text-[10px] text-slate-500">✕</button>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80">
                    <select value={app.technician || 'Sin Asignar'} onChange={(e) => onAssignTech(app.id, e.target.value)} className="w-full p-2 bg-[#0f172a] border border-slate-800 rounded-lg text-slate-300 font-bold">
                      {staff.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'price' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <form onSubmit={(e) => {
              e.preventDefault(); if(!newItemLabel || !newItemPrice || !newItemStock) return;
              setCatalog([...catalog, { id: Date.now(), label: newItemLabel, price: parseInt(newItemPrice), stock: parseInt(newItemStock) }]);
              setNewItemLabel(''); setNewItemPrice(''); setNewItemStock('');
            }} className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="font-bold text-blue-400 uppercase">➕ Agregar Ítems</h3>
              <input type="text" placeholder="Nombre Equipo" value={newItemLabel} onChange={e => setNewItemLabel(e.target.value)} className="w-full p-2.5 bg-[#0b0f19] border border-slate-800 rounded-xl text-white" required />
              <input type="number" placeholder="Precio CLP" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} className="w-full p-2.5 bg-[#0b0f19] border border-slate-800 rounded-xl text-white" required />
              <input type="number" placeholder="Stock Físico" value={newItemStock} onChange={e => setNewItemStock(e.target.value)} className="w-full p-2.5 bg-[#0b0f19] border border-slate-800 rounded-xl text-white" required />
              <button type="submit" className="w-full bg-[#004aad] text-white py-2 rounded-xl font-bold uppercase">Cargar Maestro</button>
            </form>

            <div className="xl:col-span-2 bg-[#0f172a] p-4 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="font-bold text-white uppercase">📦 Inventario Activo</h3>
              <div className="space-y-2">
                {catalog.map((item) => (
                  <div key={item.id} className="p-2.5 bg-[#0b0f19] rounded-xl border border-slate-800/60 grid grid-cols-4 gap-2 items-center font-bold">
                    <span className="col-span-2 text-slate-200">{item.label}</span>
                    <input type="number" value={item.price} onChange={(e) => setCatalog(catalog.map(i => i.id === item.id ? { ...i, price: parseInt(e.target.value) || 0 } : i))} className="p-1 bg-[#0f172a] border border-slate-800 rounded text-right text-yellow-400" />
                    <input type="number" value={item.stock} onChange={(e) => setCatalog(catalog.map(i => i.id === item.id ? { ...i, stock: parseInt(e.target.value) || 0 } : i))} className="p-1 bg-[#0f172a] border border-slate-800 rounded text-center text-white" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'users' && !selectedUserFolder && (
          <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 space-y-2">
            {users.map(u => (
              <div key={u.id} onClick={() => setSelectedUserFolder(u)} className="p-3.5 bg-[#0b0f19] hover:bg-slate-800/50 border border-slate-800/80 rounded-xl flex justify-between items-center cursor-pointer border-l-4 border-l-blue-500">
                <div>
                  <p className="font-black text-white text-sm">{u.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">RUT: {u.rut} | Ubicación: {u.address}</p>
                </div>
                <span className="text-blue-400 font-bold text-[11px]">Ver Ficha →</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'users' && selectedUserFolder && (
          <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-black text-white">{selectedUserFolder.name}</h2>
                <p className="text-[10px] text-yellow-400">Contrato: {selectedUserFolder.contract}</p>
              </div>
              <button onClick={() => setSelectedUserFolder(null)} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl font-bold">← Volver</button>
            </div>
            <div className="bg-[#0b0f19] border border-slate-800 p-3.5 rounded-xl space-y-1">
              <p className="text-[9px] font-bold text-blue-400 uppercase">📦 HARDWARE COMPROMETIDO EN TERRENO:</p>
              <p className="font-mono font-bold text-slate-200">{selectedUserFolder.installedHardware}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">🛠️ Bitácora Histórica de Órdenes:</h4>
              <div className="border border-slate-800 rounded-xl bg-[#0b0f19] overflow-hidden">
                {!selectedUserFolder.historyLog || selectedUserFolder.historyLog.length === 0 ? (
                  <p className="p-3 text-slate-500 italic text-center">Sin registros.</p>
                ) : (
                  selectedUserFolder.historyLog.map(job => (
                    <div key={job.id} className="p-3 border-b border-slate-800 last:border-0 bg-emerald-500/5 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">✓ {job.type}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Técnico: <strong className="text-slate-200">{job.technician}</strong> | <span className="italic text-blue-400">"{job.detail}"</span></p>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded border border-emerald-500/30 uppercase">Cerrado</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// APLICACIÓN PARA EL INSTALADOR DE TERRENO
// ==========================================
function TechnicianApp({ setView, techJobs, onCompleteJob }) {
  const [techFilter, setTechFilter] = useState('Carlos Silva (Móvil 2)'); 
  const [observations, setObservations] = useState({}); 

  const jobsFiltered = techJobs.filter(j => j.technician === techFilter);

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col max-w-md mx-auto p-4 text-white text-xs font-sans">
      <div className="text-center border-b border-slate-800 pb-3 mb-4 space-y-2">
        <BrandLogo />
        <div>
          <select value={techFilter} onChange={e => setTechFilter(e.target.value)} className="bg-[#0f172a] text-yellow-400 font-bold p-2 rounded-xl text-[11px] border border-slate-800 focus:outline-none">
            <option value="Juan Pérez (Móvil 1)">Juan Pérez (Móvil 1)</option>
            <option value="Carlos Silva (Móvil 2)">Carlos Silva (Móvil 2)</option>
            <option value="Andrés León (Móvil 3)">Andrés León (Móvil 3)</option>
          </select>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {jobsFiltered.length === 0 ? (
          <div className="p-6 text-center bg-[#0f172a]/40 rounded-xl border border-slate-800 text-slate-500 italic">
            📭 Sin rutas pendientes hoy.
          </div>
        ) : (
          jobsFiltered.map(job => (
            <div key={job.id} className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 space-y-3">
              <p className="font-black text-white text-xs uppercase">Cliente: {job.user}</p>
              <p className="text-slate-300">⚙️ Tarea: <strong className="text-yellow-400">"{job.service}"</strong></p>
              <div className="bg-[#0b0f19] p-3 rounded-xl border border-slate-900">
                <p className="text-[8px] font-bold text-blue-400 uppercase">📍 Destino GPS:</p>
                <p className="font-bold text-white mt-0.5">{job.address}</p>
              </div>
              <textarea 
                placeholder="Escribe el informe técnico final aquí..." 
                value={observations[job.id] || ''} 
                onChange={(e) => setObservations({ ...observations, [job.id]: e.target.value })}
                className="w-full bg-[#0b0f19] border border-slate-800 text-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-blue-500 h-16 resize-none"
              />
              <button type="button" onClick={() => { onCompleteJob(job.id, job.technician, observations[job.id] || 'Revisión completada.'); alert('¡Orden cerrada!'); }} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl uppercase tracking-wider text-xs">
                Cerrar Orden de Trabajo
              </button>
            </div>
          ))
        )}
      </div>
      <button type="button" onClick={() => setView('admin-ops')} className="text-[11px] text-slate-500 underline text-center mt-4 block mx-auto">← Volver a Mesa de Control</button>
    </div>
  );
}

// ==========================================
// APP MÓVIL DEL CLIENTE (LAYOUT + NAVEGACIÓN)
// ==========================================
const ClientLayout = ({ children, setView, onLogout }) => (
  <div className="min-h-screen bg-[#0b0f19] flex flex-col max-w-md mx-auto shadow-2xl relative border-x border-slate-800 text-white font-sans">
    <div className="bg-[#0f172a]/90 border-b border-slate-800 px-4 py-3 sticky top-0 z-50 flex justify-between items-center">
      <BrandLogo size="sm" />
      <button onClick={onLogout} className="bg-slate-800 hover:bg-slate-700 text-slate-400 px-2.5 py-1 rounded-lg text-[10px] font-bold">Salir</button>
    </div>
    <div className="flex-1 pb-24 overflow-y-auto">{children}</div>
    <div className="absolute bottom-0 left-0 right-0 bg-[#0f172a] border-t border-slate-800 h-20 grid grid-cols-4 items-center text-center">
      <button onClick={() => setView('app-dashboard')} className="flex flex-col items-center"><span className="text-xl">🏠</span><span className="text-[9px] font-bold text-blue-400">Inicio</span></button>
      <button onClick={() => setView('app-getquote')} className="flex flex-col items-center"><span className="text-xl">📦</span><span className="text-[9px] font-bold text-slate-400">Cotizar</span></button>
      <button onClick={() => setView('app-schedule')} className="flex flex-col items-center"><span className="text-xl">📅</span><span className="text-[9px] font-bold text-slate-400">Citas</span></button>
      <button onClick={() => setView('app-sos')} className="flex flex-col items-center"><span className="text-xl">🚨</span><span className="text-[9px] font-black text-red-500">S.O.S</span></button>
    </div>
  </div>
);

const ClientHome = ({ currentUser, appointments }) => {
  const myEvents = appointments.filter(a => a.user === currentUser?.name);
  return (
    <div className="p-5 space-y-4">
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-4 rounded-2xl border border-blue-500/10">
        <p className="text-[9px] uppercase font-bold text-blue-400 tracking-wider">Abonado de Seguridad</p>
        <p className="text-base font-black text-white mt-0.5">{currentUser?.name}</p>
        <span className="bg-yellow-400/10 text-yellow-400 text-[10px] px-2 py-0.5 rounded border border-yellow-400/20 font-bold inline-block mt-2">{currentUser?.contract}</span>
        <p className="text-xs text-slate-400 mt-3">📍 {currentUser?.address}</p>
      </div>
      <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 space-y-1.5">
        <p className="font-bold text-blue-400 uppercase text-[9px]">🛠️ Equipos Vinculados:</p>
        <p className="font-mono text-slate-300 text-[11px] leading-relaxed">{currentUser?.installedHardware}</p>
      </div>
      <div className="space-y-2">
        <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">📋 Mis Solicitudes:</p>
        {myEvents.length === 0 ? <p className="text-slate-500 italic text-center py-2 text-[11px]">Sin requerimientos abiertos.</p> : myEvents.map(ev => (
          <div key={ev.id} className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 flex justify-between items-center text-[11px]">
            <div>
              <p className="font-bold text-slate-200">{ev.service}</p>
              <p className="text-[10px] text-slate-500">Técnico: {ev.technician || 'Buscando móvil...'}</p>
            </div>
            <span className="text-[8px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-black uppercase">Activo</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const InteractiveQuoter = ({ catalog, currentUser, onSendQuote }) => {
  const [step, setStep] = useState(1); 
  const [type, setType] = useState(''); 
  const [addr, setAddr] = useState(currentUser?.address || '');
  const [meters, setMeters] = useState(15); 
  const [c1, setC1] = useState(0); 
  const [c2, setC2] = useState(0); 
  const [c3, setC3] = useState(0);

  const base = type === 'Empresa' ? 120000 : 65000;
  const total = base + (c1 * catalog[0].price) + (c2 * catalog[1].price) + (c3 * catalog[2].price) + (meters * 3500);

  return (
    <div className="p-5 space-y-4 text-xs">
      <h3 className="text-sm font-black text-center text-white uppercase tracking-wider">Cubicación y Presupuesto</h3>
      {step === 1 && (
        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {['Residencial', 'Empresa'].map(t => (
              <button key={t} type="button" onClick={() => setType(t)} className={`p-3 rounded-xl border font-black ${type === t ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-slate-800 text-slate-500'}`}>{t}</button>
            ))}
          </div>
          <input type="text" placeholder="Dirección Destino" value={addr} onChange={e => setAddr(e.target.value)} className="w-full p-3 bg-[#0b0f19] border border-slate-800 rounded-xl text-white font-bold" />
          <button type="button" onClick={() => type && addr.trim() && setStep(2)} className="w-full bg-[#004aad] text-white py-3 rounded-xl font-black uppercase tracking-wider">Configurar Hardware</button>
        </div>
      )}
      {step === 2 && (
        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 space-y-4">
          <div className="space-y-2">
            {catalog.map((item, idx) => {
              const currentVal = idx === 0 ? c1 : idx === 1 ? c2 : c3; 
              const setVal = idx === 0 ? setC1 : idx === 1 ? setC2 : setC3;
              return (
                <div key={item.id} className="flex justify-between items-center p-2.5 bg-[#0b0f19] border border-slate-900 rounded-xl">
                  <div>
                    <p className="font-bold text-slate-200">{item.label}</p>
                    <p className="text-[10px] text-slate-500">${item.price.toLocaleString('es-CL')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setVal(Math.max(0, currentVal - 1))} className="w-7 h-7 bg-slate-800 text-white rounded font-black">-</button>
                    <span className="w-4 text-center font-bold text-yellow-400 font-mono">{currentVal}</span>
                    <button type="button" onClick={() => setVal(currentVal + 1)} className="w-7 h-7 bg-slate-800 text-white rounded font-black">+</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1 uppercase"><span>Cableado: {meters}m</span></div>
            <input type="range" min="5" max="100" step="5" value={meters} onChange={e => setMeters(parseInt(e.target.value))} className="w-full accent-blue-500 bg-[#0b0f19]" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-[#0b0f19] border border-slate-800 text-slate-400 rounded-xl py-2.5 font-bold uppercase">Atrás</button>
            <button type="button" onClick={() => setStep(3)} className="w-2/3 bg-[#004aad] text-white rounded-xl font-black py-2.5 uppercase tracking-wider">Calcular Inversión</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 text-center space-y-4">
          <p className="text-2xl font-black text-yellow-400 font-mono">${total.toLocaleString('es-CL')}</p>
          <div className="text-left bg-[#0b0f19] p-3 rounded-xl border border-slate-900 text-[11px] text-slate-400 space-y-1">
            <p><strong>📍 Ubicación:</strong> {addr}</p>
            <p><strong>📦 Hardware:</strong> {c1}x720p / {c2}x1080p / {c3}x4K</p>
          </div>
          <button type="button" onClick={() => { onSendQuote(currentUser.name, type, `${c1}x720p / ${c2}x1080p / ${c3}x4K`, c1, c2, c3, total, addr, meters); setStep(4); }} className="w-full bg-[#004aad] text-white py-3 rounded-xl font-black uppercase tracking-wider">Enviar a Central</button>
        </div>
      )}
      {step === 4 && <p className="text-center text-emerald-400 font-bold bg-emerald-500/5 p-4 rounded-xl border border-dashed border-emerald-500/20">✓ Presupuesto enviado a revisión de factibilidad técnica.</p>}
    </div>
  );
};

const AppointmentPage = ({ currentUser, onSendAppointment, calendarDays }) => {
  const [srv, setSrv] = useState(''); 
  const [dt, setDt] = useState(''); 
  const [done, setDone] = useState(false);
  return (
    <div className="p-5 space-y-4 text-xs">
      <h3 className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider">Reserva de Agenda</h3>
      {done ? <p className="text-center text-emerald-400 font-bold bg-emerald-500/5 p-4 rounded-xl border border-dashed border-emerald-500/20">✓ Bloque de agenda solicitado en central.</p> : (
        <>
          <select onChange={e => setSrv(e.target.value)} className="w-full p-3 bg-[#0b0f19] border border-slate-800 rounded-xl text-slate-300 font-bold">
            <option value="">-- Seleccione Requerimiento --</option>
            <option value="Mantenimiento Preventivo">Mantenimiento Preventivo</option>
            <option value="Instalación de Nueva Cámara">Instalación de Nueva Cámara</option>
          </select>
          <div className="grid grid-cols-2 gap-2">
            {calendarDays.map(day => (
              <button key={day.date} type="button" disabled={!day.active} onClick={() => setDt(day.date)} className={`p-3 rounded-xl border text-left flex flex-col ${!day.active ? 'opacity-20 text-red-400 border-slate-900' : dt === day.date ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'bg-[#0b0f19] border-slate-800'}`}>
                <span className="font-bold">{day.date}</span>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => { onSendAppointment(currentUser.name, srv, dt); setDone(true); }} disabled={!srv || !dt} className="w-full bg-[#004aad] text-white py-3 rounded-xl font-black uppercase tracking-wider">Confirmar Visita</button>
        </>
      )}
    </div>
  );
};

const HelpPage = ({ currentUser, onSendAppointment }) => {
  const [sent, setSent] = useState(false);
  return (
    <div className="p-5 text-center pt-12 space-y-4 text-xs">
      <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500 font-black text-xl border border-red-500/20 animate-pulse">!</div>
      <h3 className="text-sm font-black text-red-500 uppercase tracking-widest">Despacho de Emergencia S.O.S</h3>
      {sent ? <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-300 font-bold">▲ Alerta inyectada. Cuadrilla en camino prioritario.</div> : (
        <>
          <p className="text-slate-400 leading-relaxed">¿Caída perimetral crítica o pérdida de video total? Pulse abajo para congelar la central de tráfico y despachar soporte inmediato.</p>
          <button type="button" onClick={() => { onSendAppointment(currentUser.name, "EMERGENCIA S.O.S: Pérdida de Video Crítica", "INMEDIATO"); setSent(true); }} className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-black tracking-widest uppercase shadow-lg shadow-red-600/20">Activar Botón S.O.S</button>
        </>
      )}
    </div>
  );
};

// ==========================================
// ORQUESTADOR MAESTRO DE RUTAS GLOBAL
// ==========================================
export default function App() {
  const [view, setView] = useState('landing');
  const [cameraCatalog, setCameraCatalog] = useState([
    { id: 1, label: '720p Básica Estándar', price: 25000, stock: 45 },
    { id: 2, label: '1080p Domo Alta Def.', price: 45000, stock: 30 },
    { id: 3, label: '4K Profesional + Inteligencia AI', price: 95000, stock: 12 }
  ]);
  const [calendarDays, setCalendarDays] = useState([
    { date: 'Lun 18 de Mayo', active: true }, 
    { date: 'Mar 19 de Mayo', active: true },
    { date: 'Mie 20 de Mayo', active: true }, 
    { date: 'Jue 21 de Mayo', active: true }
  ]);
  const [users, setUsers] = useState(() => {
    const local = localStorage.getItem('cisven_users');
    return local ? JSON.parse(local) : [
      { id: 1, name: 'Isabel Cristina León', rut: '1-9', address: 'Av. Américo Vespucio 1500, Maipú', contract: 'Monitoreo Residencial Pro AI', installedHardware: '4x Cámaras Domo 1080p / 1x Grabador Central NVR', status: 'Activo', historyLog: [{ id: 'h1', date: '10 de Mayo', type: 'Instalación Inicial Base', technician: 'Juan Pérez (Móvil 1)', detail: 'Montaje de antenas perimetrales y enlace central.' }] }
    ];
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [quotes, setQuotes] = useState(() => JSON.parse(localStorage.getItem('cisven_quotes')) || []);
  const [appointments, setAppointments] = useState(() => JSON.parse(localStorage.getItem('cisven_appointments')) || []);
  const [techJobs, setTechJobs] = useState(() => JSON.parse(localStorage.getItem('cisven_techjobs')) || []);

  useEffect(() => { localStorage.setItem('cisven_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('cisven_quotes', JSON.stringify(quotes)); }, [quotes]);
  useEffect(() => { localStorage.setItem('cisven_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('cisven_techjobs', JSON.stringify(techJobs)); }, [techJobs]);

  const handleSendQuote = (user, type, cam, qty1, qty2, qty3, total, address, mtrs) => {
    setQuotes([{ id: Date.now(), user, type, cam, total, address, meters: mtrs, q1: qty1, q2: qty2, q3: qty3 }, ...quotes]);
  };
  const handleSendAppointment = (user, service, date) => {
    const targetUser = users.find(u => u.name === user);
    const newJob = { id: Date.now(), user, service, date, address: targetUser?.address || 'Dirección de Registro', rut: targetUser?.rut || '1-9', technician: 'Sin Asignar' };
    setAppointments([newJob, ...appointments]); 
    setTechJobs([newJob, ...techJobs]);
  };
  const handleAssignTech = (id, technicianName) => {
    setAppointments(prev => prev.map(item => item.id === id ? { ...item, technician: technicianName } : item));
    setTechJobs(prev => prev.map(item => item.id === id ? { ...item, technician: technicianName } : item));
  };
  const handleCompleteJob = (id, firmingTechnician, techObservation) => {
    const target = techJobs.find(j => j.id === id); 
    if (!target) return;
    const relatedQuote = quotes.find(q => q.user === target.user);
    if (relatedQuote) {
      setCameraCatalog(prev => prev.map((item, idx) => {
        const discount = idx === 0 ? (relatedQuote.q1 || 0) : idx === 1 ? (relatedQuote.q2 || 0) : (relatedQuote.q3 || 0);
        return { ...item, stock: Math.max(0, item.stock - discount) };
      }));
    }
    setTechJobs(techJobs.filter(j => j.id !== id)); 
    setAppointments(appointments.filter(j => j.id !== id));
    setUsers(prev => prev.map(u => u.name === target.user ? { ...u, historyLog: [{ id: Date.now(), date: target.date === 'INMEDIATO' ? '18 de Mayo' : target.date, type: target.service, technician: firmingTechnician, detail: techObservation }, ...(u.historyLog || [])] } : u));
  };

  return (
    <div>
      {view === 'landing' && <Landing setView={setView} />}
      {view === 'admin-ops' && <AdminDashboard setView={setView} catalog={cameraCatalog} setCatalog={setCameraCatalog} quotes={quotes} setQuotes={setQuotes} appointments={appointments} setAppointments={setAppointments} users={users} calendarDays={calendarDays} setCalendarDays={setCalendarDays} onAssignTech={handleAssignTech} />}
      {view === 'tecnico-app' && <TechnicianApp setView={setView} techJobs={techJobs} onCompleteJob={handleCompleteJob} />}
      {view.startsWith('app-') && (
        currentUser === null ? (
          <ClientAuth users={users} onRegister={(u) => setUsers([...users, { ...u, historyLog: [] }])} onLoginSuccess={(u) => { setCurrentUser(u); setView('app-dashboard'); }} />
        ) : (
          <ClientLayout setView={setView} onLogout={() => { setCurrentUser(null); setView('landing'); }}>
            {view === 'app-dashboard' && <ClientHome currentUser={currentUser} appointments={appointments} />}
            {view === 'app-getquote' && <InteractiveQuoter catalog={cameraCatalog} currentUser={currentUser} onSendQuote={handleSendQuote} />}
            {view === 'app-schedule' && <AppointmentPage currentUser={currentUser} onSendAppointment={handleSendAppointment} calendarDays={calendarDays} />}
            {view === 'app-sos' && <HelpPage currentUser={currentUser} onSendAppointment={handleSendAppointment} />}
          </ClientLayout>
        )
      )}
    </div>
  );
}