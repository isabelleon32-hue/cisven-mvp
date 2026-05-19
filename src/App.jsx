import React, { useState, useEffect } from 'react';

// ==========================================
// 1. COMPONENTE DE LOGO CORPORATIVO REPLICADO (CISVEN VERDE OCÉANO)
// ==========================================
export const BrandLogo = ({ size = "md" }) => (
  <div className="flex flex-col items-center justify-center text-center font-sans select-none">
    <div className={`relative flex items-center justify-center rounded-full bg-gradient-to-b from-white to-gray-200 shadow-xl border-t-4 border-[#085a4f] ${size === 'lg' ? 'w-16 h-16 mb-3' : 'w-10 h-10 mb-1'}`}>
      <div className="w-2/3 h-2/3 rounded-full bg-[#062c2a] flex items-center justify-center border border-teal-800/30">
        <div className="w-1/2 h-1/2 rounded-full bg-white relative">
          <div className="w-2 h-2 rounded-full bg-[#062c2a] absolute top-0.5 right-0.5"></div>
        </div>
      </div>
      <div className="absolute w-full h-full bg-teal-400/10 rounded-full animate-ping opacity-20"></div>
    </div>
    <div>
      <h1 className={`font-black tracking-widest text-white uppercase leading-none ${size === 'lg' ? 'text-3xl' : 'text-base'}`}>
        CIS<span className="text-gray-300">VEN</span>
      </h1>
      <p className={`text-[#ecc245] uppercase tracking-widest font-black ${size === 'lg' ? 'text-[10px] mt-1.5' : 'text-[7px] mt-0.5'}`}>
        Seguridad AI
      </p>
    </div>
  </div>
);

// ==========================================
// 2. CONTROL DE ACCESO RESTRICTO POR ROLES SECURE GATE
// ==========================================
function Landing({ setView }) {
  const [authMode, setAuthMode] = useState(null); 
  const [password, setPassword] = useState('');

  const handleGateAccess = (e) => {
    e.preventDefault();
    if (authMode === 'admin' && password === 'cisven2026') {
      setView('admin-ops');
      setAuthMode(null);
      setPassword('');
    } else if (authMode === 'tech' && password === 'tecnico2026') {
      setView('tecnico-app');
      setAuthMode(null);
      setPassword('');
    } else {
      alert('🔒 Credencial incorrecta. Acceso Denegado.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-[#042120] flex flex-col justify-center items-center p-6 text-center relative overflow-hidden font-sans select-none">
      <div className="absolute w-[350px] h-[350px] bg-teal-500/5 rounded-full blur-3xl -top-10 -left-10"></div>
      <div className="mb-8 relative z-10"><BrandLogo size="lg" /></div>

      {authMode === null ? (
        <>
          <div className="bg-[#0a3a37] p-5 rounded-2xl text-left text-xs mb-8 space-y-2.5 border border-teal-800/40 shadow-2xl max-w-xs w-full text-gray-200">
            <p className="text-teal-400 font-bold uppercase text-[9px] tracking-wider border-b border-teal-900 pb-1">Módulos del Sistema:</p>
            <p className="flex items-start gap-1.5"><span>•</span> Clientes: Cotización inteligente y botón S.O.S.</p>
            <p className="flex items-start gap-1.5"><span>•</span> Central: Gestión de inventario y asignación.</p>
            <p className="flex items-start gap-1.5"><span>•</span> Técnicos: Visualización de rutas con teléfono directo.</p>
          </div>
          
          <div className="flex flex-col w-full max-w-xs gap-3 relative z-10">
            <button type="button" onClick={() => setView('app-dashboard')} className="w-full bg-[#085a4f] hover:bg-[#0b6b5e] text-white py-3.5 rounded-xl font-black text-xs tracking-widest uppercase shadow-xl transition-all active:scale-95 border border-teal-600/20">
              Ingresar como Cliente
            </button>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button type="button" onClick={() => setAuthMode('tech')} className="bg-[#042120] hover:bg-[#07302e] text-teal-300 py-2.5 rounded-xl border border-teal-900 text-[10px] font-bold uppercase tracking-wider">
                👷 App Técnico
              </button>
              <button type="button" onClick={() => setAuthMode('admin')} className="bg-[#042120] hover:bg-[#07302e] text-teal-300 py-2.5 rounded-xl border border-teal-900 text-[10px] font-bold uppercase tracking-wider">
                💼 Panel Admin
              </button>
            </div>
          </div>
        </>
      ) : (
        <form onSubmit={handleGateAccess} className="bg-[#0a3a37] p-6 rounded-2xl border border-teal-800/40 shadow-2xl max-w-xs w-full text-left space-y-4 relative z-10 text-white">
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wide">
              {authMode === 'admin' ? '🔒 Consola Central Administrativa' : '👷 Terminal de Operaciones en Terreno'}
            </h3>
            <p className="text-[10px] text-teal-500 mt-0.5">Ingrese código de verificación asignado.</p>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-300 uppercase tracking-wider">Contraseña de Seguridad</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full p-2.5 bg-[#042120] border border-teal-900 rounded-xl text-white text-xs font-bold focus:outline-none"
              required 
              autoFocus
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => { setAuthMode(null); setPassword(''); }} className="w-1/3 bg-[#042120] border border-teal-900 text-teal-400 text-[10px] font-bold rounded-xl py-2 uppercase">Atrás</button>
            <button type="submit" className="w-2/3 bg-[#085a4f] hover:bg-[#0b6b5e] text-white text-[10px] font-black rounded-xl py-2 uppercase tracking-wider">Ingresar</button>
          </div>
        </form>
      )}
    </div>
  );
}

// ==========================================
// 3. REGISTRO Y AUTENTICACIÓN DE CLIENTES
// ==========================================
function ClientAuth({ users, onRegister, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [rut, setRut] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanRut = rut.trim();
    if (isLogin) {
      const found = users.find(u => u.rut.trim() === cleanRut);
      if (found) onLoginSuccess(found);
      else alert('RUT no registrado. Ingrese con el RUT rápido de prueba 1-9 o cree una cuenta.');
    } else {
      if (!name || !cleanRut || !address || !phone) return alert('Por favor, rellene todos los campos obligatorios.');
      if (users.find(u => u.rut.trim() === cleanRut)) return alert('Este RUT ya se encuentra registrado.');
      
      const newUser = { 
        id: Date.now(), 
        name, 
        rut: cleanRut, 
        address, 
        phone: phone.trim(),
        contract: 'Monitoreo Estándar AI', 
        installedHardware: '4x Cámaras Domo Alta Def. / 1x Grabador Central NVR', 
        status: 'Activo', 
        historyLog: [] 
      };
      onRegister(newUser);
      onLoginSuccess(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-[#042120] flex flex-col justify-center max-w-md mx-auto p-6 text-white font-sans">
      <div className="bg-[#0a3a37] p-6 rounded-2xl shadow-xl border border-teal-800/40 space-y-4">
        <div className="flex border-b border-teal-900 pb-2">
          <button type="button" onClick={() => setIsLogin(true)} className={`w-1/2 text-center py-1 text-xs font-bold ${isLogin ? 'text-[#ecc245] border-b-2 border-[#ecc245]' : 'text-teal-600'}`}>Iniciar Sesión</button>
          <button type="button" onClick={() => setIsLogin(false)} className={`w-1/2 text-center py-1 text-xs font-bold ${!isLogin ? 'text-[#ecc245] border-b-2 border-[#ecc245]' : 'text-teal-600'}`}>Registrarse</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <>
              <input type="text" placeholder="Nombre completo" value={name} onChange={e => setName(e.target.value)} className="w-full p-2.5 bg-[#042120] border border-teal-900 rounded-xl text-xs text-white placeholder-teal-700 font-bold" required />
              <input type="text" placeholder="Dirección de la Propiedad" value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2.5 bg-[#042120] border border-teal-900 rounded-xl text-xs text-white placeholder-teal-700 font-bold" required />
              <input type="tel" placeholder="Teléfono Móvil (Ej: +56912345678)" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2.5 bg-[#042120] border border-teal-900 rounded-xl text-xs text-white placeholder-teal-700 font-bold" required />
            </>
          )}
          <input type="text" placeholder="RUT de acceso (Ej: 1-9)" value={rut} onChange={e => setRut(e.target.value)} className="w-full p-2.5 bg-[#042120] border border-teal-900 rounded-xl text-xs font-black text-white placeholder-teal-700" required />
          <button type="submit" className="w-full bg-[#085a4f] hover:bg-[#0b6b5e] text-white py-2.5 rounded-xl font-black text-xs uppercase tracking-wider">
            {isLogin ? 'Entrar Seguro' : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 4. CONSOLA DE ADMINISTRACIÓN CENTRAL (ADMIN)
// ==========================================
function AdminDashboard({ setView, catalog, setCatalog, quotes, setQuotes, appointments, setAppointments, users, onAssignTech, onApproveQuote }) {
  const [tab, setTab] = useState('ops');
  const [selectedUserFolder, setSelectedUserFolder] = useState(null);
  
  const staff = ['Sin Asignar', 'Juan Pérez (Móvil 1)', 'Carlos Silva (Móvil 2)', 'Andrés León (Móvil 3)'];

  return (
    <div className="min-h-screen bg-[#042120] flex font-sans text-xs text-teal-100">
      <div className="w-52 bg-[#0a3a37] border-r border-teal-900 p-4 flex flex-col justify-between flex-shrink-0 font-bold">
        <div className="space-y-6">
          <BrandLogo />
          <nav className="flex flex-col gap-1.5 pt-4">
            <button onClick={() => { setTab('ops'); setSelectedUserFolder(null); }} className={`w-full text-left p-2 rounded-lg ${tab === 'ops' ? 'bg-[#085a4f] text-white' : 'opacity-70 hover:bg-[#042120]'}`}>📊 Tráfico Operativo</button>
            <button onClick={() => { setTab('price'); setSelectedUserFolder(null); }} className={`w-full text-left p-2 rounded-lg ${tab === 'price' ? 'bg-[#085a4f] text-white' : 'opacity-70 hover:bg-[#042120]'}`}>📦 Catálogo y Tarifas</button>
            <button onClick={() => { setTab('users'); setSelectedUserFolder(null); }} className={`w-full text-left p-2 rounded-lg ${tab === 'users' ? 'bg-[#085a4f] text-white' : 'opacity-70 hover:bg-[#042120]'}`}>👥 Abonados ({users.length})</button>
          </nav>
        </div>
        <button onClick={() => setView('landing')} className="bg-[#042120] text-center font-bold py-2 rounded-xl text-teal-400 border border-teal-900">
          🔒 Cerrar Sesión Central
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        <h1 className="text-base font-black text-white uppercase tracking-wider">
          {tab === 'ops' && 'Mesa de Control de Incidentes'}
          {tab === 'price' && 'Maestro de Inventario'}
          {tab === 'users' && !selectedUserFolder && 'Fichero General de Abonados'}
          {selectedUserFolder && `Expediente: ${selectedUserFolder.name}`}
        </h1>

        {tab === 'ops' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-800/40 space-y-2">
              <h3 className="font-bold text-teal-400 border-b border-teal-900 pb-2 uppercase flex justify-between items-center">
                <span>📦 Cotizaciones de Clientes</span>
                <span className="bg-teal-950 text-teal-400 px-2.5 py-0.5 rounded-full font-black text-[10px]">{quotes.length}</span>
              </h3>
              {quotes.length === 0 ? <p className="italic text-teal-600 text-center py-4">Sin solicitudes pendientes</p> : quotes.map(q => (
                <div key={q.id} className="p-3 bg-[#042120] border border-teal-900 rounded-xl flex flex-col space-y-2">
                  <div>
                    <p className="font-bold text-white text-sm">{q.user}</p>
                    <p className="text-[#ecc245] font-black font-mono text-xs mt-0.5">${q.total.toLocaleString('es-CL')}</p>
                    <p className="text-slate-400 font-mono text-[10px] mt-1">⚙️ Equipos: {q.cam}</p>
                    <p className="text-[10px] text-teal-400 mt-0.5">📍 Ubicación: {q.address}</p>
                    <p className="text-[10px] text-emerald-400 font-bold mt-1 bg-emerald-950/40 p-1 rounded border border-teal-900">
                      📞 Teléfono Vinculado: <span className="underline font-mono text-white">{q.phone}</span>
                    </p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => { onApproveQuote(q); alert('Aprobado. El despacho se inyectó al técnico con toda la información vinculada.'); }}
                    className="w-full bg-[#085a4f] hover:bg-[#0b6b5e] text-white font-black py-2 rounded-lg uppercase text-[10px] tracking-wider mt-1"
                  >
                    ✓ Aprobar y Despachar Instalador
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-800/40 space-y-2">
              <h3 className="font-bold text-red-400 border-b border-teal-900 pb-2 uppercase">📅 Citas Técnicas y Rutas</h3>
              {appointments.length === 0 ? <p className="italic text-teal-600 text-center py-4">Sin órdenes en tránsito.</p> : appointments.map(app => (
                <div key={app.id} className="p-3 bg-[#042120] border border-teal-900 rounded-xl space-y-2">
                  <div className="space-y-0.5">
                    <p className="font-black text-white">{app.user} - <span className="text-[#ecc245]">"{app.service}"</span></p>
                    <p className="text-[10px] text-teal-400">📍 Dirección: <span className="text-white font-bold">{app.address}</span></p>
                    <p className="text-[10px] text-teal-400">📞 Contacto: <span className="text-teal-200 font-mono font-bold">{app.phone}</span></p>
                    <p className="text-[10px] text-teal-500">¼ Operador Asignado: <span className="text-[#ecc245] font-bold underline">{app.technician || 'Sin Asignar'}</span></p>
                  </div>
                  <select value={app.technician || 'Sin Asignar'} onChange={(e) => onAssignTech(app.id, e.target.value)} className="w-full p-2 bg-[#0a3a37] border border-teal-800 rounded-lg text-white font-bold focus:outline-none text-[11px]">
                    {staff.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'price' && (
          <div className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-800/40 space-y-3">
            <h3 className="font-bold text-white uppercase">📦 Control de Stock y Precios</h3>
            <div className="space-y-2">
              {catalog.map((item) => (
                <div key={item.id} className="p-2.5 bg-[#042120] rounded-xl border border-teal-900/60 grid grid-cols-4 gap-2 items-center font-bold">
                  <span className="col-span-2 text-teal-200">{item.label}</span>
                  <input type="number" value={item.price} onChange={(e) => setCatalog(catalog.map(i => i.id === item.id ? { ...i, price: parseInt(e.target.value) || 0 } : i))} className="p-1 bg-[#0a3a37] border border-teal-800 rounded text-right text-[#ecc245]" />
                  <input type="number" value={item.stock} onChange={(e) => setCatalog(catalog.map(i => i.id === item.id ? { ...i, stock: parseInt(e.target.value) || 0 } : i))} className="p-1 bg-[#0a3a37] border border-teal-800 rounded text-center text-white" />
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'users' && !selectedUserFolder && (
          <div className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-800/40 space-y-2">
            {users.map(u => (
              <div key={u.id} onClick={() => setSelectedUserFolder(u)} className="p-3 bg-[#042120] hover:bg-[#07302e] border border-teal-900 rounded-xl flex justify-between items-center cursor-pointer">
                <div>
                  <p className="font-black text-white">{u.name}</p>
                  <p className="text-[10px] text-teal-600">RUT: {u.rut} | Fono: {u.phone}</p>
                </div>
                <span className="text-teal-400 font-bold">Ver Ficha →</span>
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
            <p><strong>📍 Dirección:</strong> {selectedUserFolder.address}</p>
            <p><strong>📞 Teléfono Principal:</strong> <span className="text-[#ecc245] font-mono">{selectedUserFolder.phone}</span></p>
            <p><strong>🛠️ Hardware en Propiedad:</strong> {selectedUserFolder.installedHardware}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 5. TERMINAL EXCLUSIVA DEL INSTALADOR (TECNICO)
// ==========================================
function TechnicianApp({ setView, techJobs, onCompleteJob }) {
  const [techFilter, setTechFilter] = useState('Carlos Silva (Móvil 2)'); 
  const [observations, setObservations] = useState({}); 

  const jobsFiltered = techJobs.filter(j => j.technician === techFilter);

  return (
    <div className="min-h-screen bg-[#042120] flex flex-col max-w-md mx-auto p-4 text-white text-xs font-sans">
      <div className="text-center border-b border-teal-900 pb-3 mb-4 space-y-2">
        <BrandLogo />
        <div>
          <select value={techFilter} onChange={e => setTechFilter(e.target.value)} className="bg-[#0a3a37] text-[#ecc245] font-black p-2 rounded-xl text-[11px] border border-teal-800 focus:outline-none">
            <option value="Juan Pérez (Móvil 1)">Juan Pérez (Móvil 1)</option>
            <option value="Carlos Silva (Móvil 2)">Carlos Silva (Móvil 2)</option>
            <option value="Andrés León (Móvil 3)">Andrés León (Móvil 3)</option>
          </select>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {jobsFiltered.length === 0 ? (
          <div className="p-6 text-center bg-[#0a3a37]/40 rounded-xl border border-teal-900 text-teal-600 italic">
            📭 Sin rutas ni órdenes de instalación pendientes.
          </div>
        ) : (
          jobsFiltered.map(job => (
            <div key={job.id} className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-800 space-y-3 shadow-xl">
              <p className="font-black text-white text-xs uppercase border-b border-teal-900 pb-1.5">Cliente: {job.user}</p>
              <p className="text-teal-200">⚙️ Requerimiento: <strong className="text-[#ecc245]">"{job.service}"</strong></p>
              
              <div className="bg-[#042120] p-3 rounded-xl border border-teal-950 space-y-2">
                <div>
                  <p className="text-[8px] font-black text-teal-400 uppercase">📍 Dirección Destino GPS:</p>
                  <p className="font-bold text-white mt-0.5">{job.address}</p>
                </div>
                <div className="border-t border-teal-900/60 pt-1.5">
                  <p className="text-[8px] font-black text-[#ecc245] uppercase">📞 Teléfono de Contacto Directo:</p>
                  <p className="font-black text-emerald-400 text-sm font-mono mt-0.5 bg-teal-950/80 px-2 py-1 rounded inline-block border border-teal-900/60">
                    {job.phone}
                  </p>
                </div>
              </div>

              <textarea 
                placeholder="Escribe las observaciones técnicas de la instalación aquí..." 
                value={observations[job.id] || ''} 
                onChange={(e) => setObservations({ ...observations, [job.id]: e.target.value })}
                className="w-full bg-[#042120] border border-teal-900 text-teal-100 rounded-xl p-2.5 text-xs focus:outline-none focus:border-teal-500 h-16 resize-none"
              />
              <button type="button" onClick={() => { onCompleteJob(job.id, job.technician, observations[job.id] || 'Instalación finalizada correctamente.'); alert('Orden cerrada. Se actualizó la bitácora central.'); }} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl uppercase tracking-wider text-xs transition-colors">
                Finalizar y Cerrar Orden
              </button>
            </div>
          ))
        )}
      </div>
      
      <button onClick={() => setView('landing')} className="text-[11px] text-teal-600 underline text-center mt-4 block mx-auto font-bold">
        ← Salir de la App de Terreno
      </button>
    </div>
  );
}

// ==========================================
// 6. APLICACIÓN MÓVIL DEL CLIENTE (LAYOUT)
// ==========================================
const ClientLayout = ({ children, setView, onLogout }) => (
  <div className="min-h-screen bg-[#042120] flex flex-col max-w-md mx-auto shadow-2xl relative border-x border-teal-900 text-white font-sans">
    <div className="bg-[#0a3a37]/95 border-b border-teal-900 px-4 py-3 sticky top-0 z-50 flex justify-between items-center">
      <BrandLogo size="sm" />
      <button onClick={onLogout} className="bg-[#042120] hover:bg-[#07302e] text-teal-400 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-teal-900/40">Salir</button>
    </div>
    <div className="flex-1 pb-24 overflow-y-auto">{children}</div>
    <div className="absolute bottom-0 left-0 right-0 bg-[#0a3a37] border-t border-teal-900 h-20 grid grid-cols-4 items-center text-center">
      <button onClick={() => setView('app-dashboard')} className="flex flex-col items-center"><span className="text-xl">🏠</span><span className="text-[9px] font-bold text-teal-400">Inicio</span></button>
      <button onClick={() => setView('app-getquote')} className="flex flex-col items-center"><span className="text-xl">📦</span><span className="text-[9px] font-bold text-teal-600">Cotizar</span></button>
      <button onClick={() => setView('app-schedule')} className="flex flex-col items-center"><span className="text-xl">📅</span><span className="text-[9px] font-bold text-teal-600">Citas</span></button>
      <button onClick={() => setView('app-sos')} className="flex flex-col items-center"><span className="text-xl">🚨</span><span className="text-[9px] font-black text-red-500">S.O.S</span></button>
    </div>
  </div>
);

const ClientHome = ({ currentUser, appointments }) => {
  const myEvents = appointments.filter(a => a.user === currentUser?.name);
  return (
    <div className="p-5 space-y-4">
      <div className="bg-gradient-to-br from-[#0a3a37] to-[#07302e] p-4 rounded-2xl border border-teal-800/30 shadow-lg">
        <p className="text-[9px] uppercase font-bold text-teal-400 tracking-wider">Abonado Registrado</p>
        <p className="text-base font-black text-white mt-0.5">{currentUser?.name}</p>
        <p className="text-xs text-[#ecc245] mt-1 font-mono font-bold">📞 Teléfono Técnico: {currentUser?.phone}</p>
        <p className="text-xs text-teal-400 mt-2">📍 Propiedad: {currentUser?.address}</p>
      </div>
      
      <div className="space-y-2">
        <p className="font-bold text-teal-600 uppercase text-[9px] tracking-wider">📋 Estado de mis Visitas:</p>
        {myEvents.length === 0 ? <p className="text-teal-700 italic text-center py-2 text-[11px]">Sin visitas programadas por ahora.</p> : myEvents.map(ev => (
          <div key={ev.id} className="bg-[#0a3a37] p-3 rounded-xl border border-teal-800 flex justify-between items-center text-[11px]">
            <div>
              <p className="font-bold text-white">{ev.service}</p>
              <p className="text-[10px] text-teal-400">Camión Técnico: <span className="text-[#ecc245] font-bold">{ev.technician || 'Asignando ruta...'}</span></p>
            </div>
            <span className="text-[8px] bg-teal-950 text-teal-400 border border-teal-800 px-2 py-0.5 rounded font-black uppercase">Vigente</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const InteractiveQuoter = ({ catalog, currentUser, onSendQuote }) => {
  const [step, setStep] = useState(1); const [type, setType] = useState(''); const [addr, setAddr] = useState(currentUser?.address || '');
  const [meters, setMeters] = useState(15); const [c1, setC1] = useState(0); const [c2, setC2] = useState(0); const [c3, setC3] = useState(0);

  const base = type === 'Empresa' ? 120000 : 65000;
  const total = base + (c1 * catalog[0].price) + (c2 * catalog[1].price) + (c3 * catalog[2].price) + (meters * 3500);

  return (
    <div className="p-5 space-y-4 text-xs font-sans">
      <h3 className="text-sm font-black text-center text-white uppercase tracking-wider">Cubicador Digital AI</h3>
      {step === 1 && (
        <div className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-800/40 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {['Residencial', 'Empresa'].map(t => (
              <button key={t} type="button" onClick={() => setType(t)} className={`p-3 rounded-xl border font-black transition-all ${type === t ? 'border-[#ecc245] bg-[#ecc245]/10 text-[#ecc245]' : 'border-teal-900 text-teal-700 bg-[#042120]'}`}>{t}</button>
            ))}
          </div>
          <input type="text" placeholder="Dirección del Proyecto" value={addr} onChange={e => setAddr(e.target.value)} className="w-full p-3 bg-[#042120] border border-teal-900 rounded-xl text-white font-bold focus:outline-none" />
          <button type="button" onClick={() => type && addr.trim() && setStep(2)} className="w-full bg-[#085a4f] text-white py-3 rounded-xl font-black uppercase tracking-wider">Avanzar a Hardware</button>
        </div>
      )}
      {step === 2 && (
        <div className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-800/40 space-y-4">
          <div className="space-y-2">
            {catalog.map((item, idx) => {
              const currentVal = idx === 0 ? c1 : idx === 1 ? c2 : c3; const setVal = idx === 0 ? setC1 : idx === 1 ? setC2 : setC3;
              return (
                <div key={item.id} className="flex justify-between items-center p-2.5 bg-[#042120] border border-teal-950 rounded-xl">
                  <div><p className="font-bold text-teal-100">{item.label}</p><p className="text-[10px] text-teal-500">${item.price.toLocaleString('es-CL')}</p></div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setVal(Math.max(0, currentVal - 1))} className="w-7 h-7 bg-[#0a3a37] text-white rounded font-black">-</button>
                    <span className="w-4 text-center font-bold text-[#ecc245] font-mono">{currentVal}</span>
                    <button type="button" onClick={() => setVal(currentVal + 1)} className="w-7 h-7 bg-[#0a3a37] text-white rounded font-black">+</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-teal-400 font-bold mb-1 uppercase"><span>Cableado UTP: {meters} metros</span></div>
            <input type="range" min="5" max="100" step="5" value={meters} onChange={e => setMeters(parseInt(e.target.value))} className="w-full accent-[#085a4f] bg-[#042120]" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-[#042120] border border-teal-900 text-teal-500 rounded-xl py-2.5 font-bold uppercase">Atrás</button>
            <button type="button" onClick={() => setStep(3)} className="w-2/3 bg-[#085a4f] text-white rounded-xl font-black py-2.5 uppercase tracking-wider">Calcular Presupuesto</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="bg-[#0a3a37] p-5 rounded-2xl border border-teal-800/40 text-center space-y-4">
          <div>
            <p className="text-2xl font-black text-[#ecc245] font-mono">${total.toLocaleString('es-CL')}</p>
            {/* RESGUARDO LEGAL PRECIOS */}
            <p className="text-[9px] text-red-400 font-bold mt-2 bg-red-950/30 p-2 rounded border border-red-900/30 leading-snug">
              ⚠️ El valor arrojado es estimado y preliminar. El precio final puede variar posterior a la evaluación técnica presencial en terreno del instalador.
            </p>
          </div>
          <div className="text-left bg-[#042120] p-3 rounded-xl border border-teal-950 text-[11px] text-teal-400">
            <p><strong>📍 Ubicación de Obra:</strong> {addr}</p>
            <p><strong>📞 Teléfono Contacto:</strong> {currentUser?.phone || '+56976543210'}</p>
          </div>
          <button type="button" onClick={() => { onSendQuote(currentUser.name, type, `${c1}x720p / ${c2}x1080p / ${c3}x4K`, c1, c2, c3, total, addr, meters, currentUser?.phone); setStep(4); }} className="w-full bg-[#085a4f] text-white py-3 rounded-xl font-black uppercase tracking-wider">Enviar Propuesta a Central</button>
        </div>
      )}
      {step === 4 && <p className="text-center text-emerald-400 font-bold bg-emerald-950/20 p-4 rounded-xl border border-dashed border-emerald-800/30">✓ Presupuesto enviado con éxito. La central validará las existencias.</p>}
    </div>
  );
};

const AppointmentPage = ({ currentUser, onSendAppointment }) => {
  const [srv, setSrv] = useState(''); const [dt, setDt] = useState(''); const [done, setDone] = useState(false);
  return (
    <div className="p-5 space-y-4 text-xs">
      <h3 className="text-xs font-bold text-teal-400 text-center uppercase tracking-wider">Agendamiento Técnico</h3>
      {done ? <p className="text-center text-emerald-400 font-bold bg-emerald-950/20 p-4 rounded-xl border border-dashed border-emerald-800/30">✓ Solicitud de agenda enviada a la mesa técnica.</p> : (
        <>
          <select onChange={e => setSrv(e.target.value)} className="w-full p-3 bg-[#042120] border border-teal-900 rounded-xl text-teal-100 font-bold focus:outline-none">
            <option value="">-- Requerimiento Técnico --</option>
            <option value="Mantención de Enlaces">Mantención de Enlaces</option>
            <option value="Ampliación de Cobertura Domo">Ampliación de Cobertura Domo</option>
          </select>
          <input type="date" onChange={e => setDt(e.target.value)} className="w-full p-3 bg-[#042120] border border-teal-900 rounded-xl text-white font-bold" />
          <button type="button" onClick={() => { onSendAppointment(currentUser.name, srv, dt); setDone(true); }} disabled={!srv || !dt} className="w-full bg-[#085a4f] text-white py-3 rounded-xl font-black uppercase tracking-wider">Agendar Visita</button>
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
      <h3 className="text-sm font-black text-red-500 uppercase tracking-widest">Botón de Pánico S.O.S</h3>
      {sent ? <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-300 font-bold">▲ Alerta inyectada de urgencia. Cuadrilla notificada.</div> : (
        <>
          <p className="text-teal-400">¿Corte perimetral o intrusión inminente? Presione para congelar la central de despacho e inyectar auxilio inmediato.</p>
          <button type="button" onClick={() => { onSendAppointment(currentUser.name, "EMERGENCIA CRÍTICA: Despacho Inmediato", "Urgente"); setSent(true); }} className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-black uppercase tracking-widest">Enviar Auxilio S.O.S</button>
        </>
      )}
    </div>
  );
};

// ==========================================
// 7. ORQUESTADOR OPERATIVO GLOBAL NÚCLEO DE DATOS
// ==========================================
export default function App() {
  const [view, setView] = useState('landing');
  const [cameraCatalog, setCameraCatalog] = useState([
    { id: 1, label: '720p Básica Estándar', price: 25000, stock: 45 }, 
    { id: 2, label: '1080p Domo Alta Def.', price: 45000, stock: 30 }, 
    { id: 3, label: '4K Profesional + AI', price: 95000, stock: 12 }
  ]);
  
  const [users, setUsers] = useState(() => {
    const local = localStorage.getItem('cisven_users');
    return local ? JSON.parse(local) : [
      { id: 1, name: 'Isabel Cristina León', rut: '1-9', address: 'Av. Américo Vespucio 1500, Maipú', phone: '+56976543210', contract: 'Monitoreo Residencial Pro AI', installedHardware: '4x Cámaras Domo 1080p / 1x Grabador NVR', status: 'Activo', historyLog: [] }
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

  const handleSendQuote = (user, type, cam, qty1, qty2, qty3, total, address, mtrs, clientPhone) => {
    const phoneToInject = clientPhone || users.find(u => u.name === user)?.phone || '+56976543210';
    setQuotes([{ id: Date.now(), user, type, cam, total, address, meters: mtrs, q1: qty1, q2: qty2, q3: qty3, phone: phoneToInject }, ...quotes]);
  };
  
  const handleSendAppointment = (userName, service, date) => {
    const targetUser = users.find(u => u.name === userName);
    const newJob = { 
      id: Date.now(), 
      user: userName, 
      service, 
      date, 
      address: targetUser?.address || 'Dirección Base', 
      phone: targetUser?.phone || '+56976543210',
      technician: 'Sin Asignar' 
    };
    setAppointments([newJob, ...appointments]); 
    setTechJobs([newJob, ...techJobs]);
  };

  const handleApproveQuote = (quoteObject) => {
    const approvedJob = {
      id: Date.now(),
      user: quoteObject.user,
      service: `Instalación Comercial: (${quoteObject.cam})`,
      date: 'Por Coordinar',
      address: quoteObject.address,
      phone: quoteObject.phone || '+56976543210', 
      technician: 'Sin Asignar'
    };
    setAppointments([approvedJob, ...appointments]);
    setTechJobs([approvedJob, ...techJobs]);
    setQuotes(quotes.filter(q => q.id !== quoteObject.id));
  };

  const handleAssignTech = (id, technicianName) => {
    setAppointments(prev => prev.map(item => item.id === id ? { ...item, technician: technicianName } : item));
    setTechJobs(prev => prev.map(item => item.id === id ? { ...item, technician: technicianName } : item));
  };
  
  const handleCompleteJob = (id, firmingTechnician, techObservation) => {
    const target = techJobs.find(j => j.id === id); if (!target) return;
    setTechJobs(techJobs.filter(j => j.id !== id)); 
    setAppointments(appointments.filter(j => j.id !== id));
    setUsers(prev => prev.map(u => u.name === target.user ? { ...u, historyLog: [{ id: Date.now(), date: 'Hoy', type: target.service, technician: firmingTechnician, detail: techObservation }, ...(u.historyLog || [])] } : u));
  };

  return (
    <div>
      {view === 'landing' && <Landing setView={setView} />}
      {view === 'admin-ops' && <AdminDashboard setView={setView} catalog={cameraCatalog} setCatalog={setCameraCatalog} quotes={quotes} setQuotes={setQuotes} appointments={appointments} setAppointments={setAppointments} users={users} onAssignTech={handleAssignTech} onApproveQuote={handleApproveQuote} />}
      {view === 'tecnico-app' && <TechnicianApp setView={setView} techJobs={techJobs} onCompleteJob={handleCompleteJob} />}
      {view.startsWith('app-') && (
        currentUser === null ? (
          <ClientAuth users={users} onRegister={(u) => setUsers([...users, u])} onLoginSuccess={(u) => { setCurrentUser(u); setView('app-dashboard'); }} />
        ) : (
          <ClientLayout setView={setView} onLogout={() => { setCurrentUser(null); setView('landing'); }}>
            {view === 'app-dashboard' && <ClientHome currentUser={currentUser} appointments={appointments} />}
            {view === 'app-getquote' && <InteractiveQuoter catalog={cameraCatalog} currentUser={currentUser} onSendQuote={handleSendQuote} />}
            {view === 'app-schedule' && <AppointmentPage currentUser={currentUser} onSendAppointment={handleSendAppointment} />}
            {view === 'app-sos' && <HelpPage currentUser={currentUser} onSendAppointment={handleSendAppointment} />}
          </ClientLayout>
        )
      )}
    </div>
  );
}