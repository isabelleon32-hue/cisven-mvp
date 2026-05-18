import React, { useState, useEffect } from 'react';

// ==========================================
// 1. COMPONENTE: LANDING PAGE
// ==========================================
const Landing = ({ setView }) => (
  <div className="min-h-screen bg-gradient-to-b from-[#004aad] to-blue-900 text-white flex flex-col justify-center items-center p-6 text-center">
    <h1 className="text-4xl font-black mb-2">CISVEN</h1>
    <p className="text-yellow-400 text-sm uppercase tracking-widest mb-8">Seguridad Automatizada</p>
    <div className="bg-white/10 p-4 rounded-xl text-left text-xs mb-8 space-y-1">
      <p>● Control operativo de hardware, stock y tarifas dinámicas.</p>
      <p>● Bloqueo de agenda en tiempo real controlado por Administrador.</p>
      <p>● Trazabilidad de rutas por instalador técnico asignado.</p>
    </div>
    <div className="flex flex-col w-full max-w-xs gap-3">
      <button onClick={() => setView('app-dashboard')} className="w-full bg-yellow-400 text-slate-900 py-3.5 rounded-xl font-bold text-sm">
        Ingresar como Cliente (App Móvil)
      </button>
      <button onClick={() => setView('admin-ops')} className="w-full bg-white/10 text-white py-3 rounded-xl border border-white/20 text-xs">
        Consola Administración
      </button>
    </div>
  </div>
);

// ==========================================
// 2. COMPONENTE: AUTENTICACIÓN CLIENTE
// ==========================================
const ClientAuth = ({ users, onRegister, onLoginSuccess }) => {
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
      const newUser = { 
        id: Date.now(), 
        name, 
        rut: cleanRut, 
        address, 
        contract: 'Monitoreo Estándar AI', 
        installedHardware: '4x Cámaras Domo 1080p / 1x Grabador NVR', 
        status: 'Activo', 
        historyLog: [] 
      };
      onRegister(newUser);
      onLoginSuccess(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center max-w-md mx-auto p-6">
      <div className="bg-white p-6 rounded-2xl shadow-xl border space-y-4">
        <div className="flex border-b pb-2">
          <button onClick={() => setIsLogin(true)} className={`w-1/2 text-center py-1 text-xs font-bold ${isLogin ? 'text-[#004aad] border-b-2 border-[#004aad]' : 'text-gray-400'}`}>Iniciar Sesión</button>
          <button onClick={() => setIsLogin(false)} className={`w-1/2 text-center py-1 text-xs font-bold ${!isLogin ? 'text-[#004aad] border-b-2 border-[#004aad]' : 'text-gray-400'}`}>Registrarse</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <>
              <input type="text" placeholder="Nombre o Razón Social" value={name} onChange={e => setName(e.target.value)} className="w-full p-2.5 border rounded-xl text-xs" required />
              <input type="text" placeholder="Dirección de la Propiedad" value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2.5 border rounded-xl text-xs" required />
            </>
          )}
          <input type="text" placeholder="RUT (Ej: 1-9)" value={rut} onChange={e => setRut(e.target.value)} className="w-full p-2.5 border rounded-xl text-xs font-bold" required />
          <button type="submit" className="w-full bg-[#004aad] text-white py-2.5 rounded-xl font-bold text-xs">
            {isLogin ? 'Entrar Seguro' : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 3. COMPONENTE: LAYOUT MÓVIL CLIENTE
// ==========================================
const ClientLayout = ({ children, setView, onLogout }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto shadow-2xl relative border-x">
    <div className="flex-1 pb-24 overflow-y-auto">{children}</div>
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t h-20 grid grid-cols-5 items-center px-1 z-50 text-center">
      <button onClick={() => setView('app-dashboard')} className="flex flex-col items-center"><span className="text-base">🏠</span><span className="text-[9px] font-bold text-[#004aad]">Inicio</span></button>
      <button onClick={() => setView('app-getquote')} className="flex flex-col items-center"><span className="text-base">📦</span><span className="text-[9px] font-bold text-gray-400">Cotizar</span></button>
      <button onClick={() => setView('app-schedule')} className="flex flex-col items-center"><span className="text-base">📅</span><span className="text-[9px] font-bold text-gray-400">Citas</span></button>
      <button onClick={() => setView('app-sos')} className="flex flex-col items-center"><span className="text-base">🚨</span><span className="text-[9px] font-bold text-gray-400">S.O.S</span></button>
      <button onClick={onLogout} className="flex flex-col items-center"><span className="text-base">👤</span><span className="text-[9px] font-bold text-gray-400">Salir</span></button>
    </div>
  </div>
);

// ==========================================
// 4. COMPONENTE: DASHBOARD HOME CLIENTE
// ==========================================
const ClientHome = ({ currentUser }) => (
  <div className="p-4 space-y-4">
    <h2 className="text-xl font-black text-[#004aad] text-center pt-2">CISVEN DASHBOARD</h2>
    <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-400 text-xs">
      <p className="font-bold text-[#004aad]">Abonado: {currentUser?.name}</p>
      <p className="text-gray-500 mt-0.5">Plan Activo: {currentUser?.contract}</p>
      <p className="text-gray-400">📍 {currentUser?.address}</p>
    </div>
    <div className="bg-white p-4 rounded-xl shadow-sm border text-xs space-y-1">
      <p className="font-bold text-gray-400 uppercase text-[10px]">🛠️ Hardware de Seguridad Instalado:</p>
      <p className="font-mono bg-gray-50 p-2 rounded border text-gray-600 leading-relaxed">{currentUser?.installedHardware}</p>
    </div>
  </div>
);

// ==========================================
// 5. COMPONENTE: SMART QUOTER (CERO ABSOLUTO)
// ==========================================
const InteractiveQuoter = ({ catalog, currentUser, onSendQuote }) => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState('');
  const [addr, setAddr] = useState(currentUser?.address || '');
  const [meters, setMeters] = useState(15);
  const [c1, setC1] = useState(0);
  const [c2, setC2] = useState(0);
  const [c3, setC3] = useState(0);

  const base = type === 'Empresa' ? 120000 : 65000;
  const t1 = c1 * (catalog[0]?.price || 25000);
  const t2 = c2 * (catalog[1]?.price || 45000);
  const t3 = c3 * (catalog[2]?.price || 95000);
  const total = base + t1 + t2 + t3 + (meters * 3500);

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-bold text-[#004aad] text-center">Smart Quoter</h3>
      {step === 1 && (
        <div className="bg-white p-4 rounded-xl border space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            {['Residencial', 'Empresa'].map(t => (
              <button key={t} type="button" onClick={() => setType(t)} className={`p-3 rounded-lg border-2 font-bold ${type === t ? 'border-[#004aad] bg-blue-50 text-[#004aad]' : 'text-gray-400'}`}>{t}</button>
            ))}
          </div>
          <input type="text" placeholder="Dirección de instalación" value={addr} onChange={e => setAddr(e.target.value)} className="w-full p-2.5 border rounded-xl" />
          <button type="button" onClick={() => type && addr.trim() && setStep(2)} className="w-full bg-[#004aad] text-white py-2.5 rounded-xl font-bold">Siguiente</button>
        </div>
      )}
      {step === 2 && (
        <div className="bg-white p-4 rounded-xl border space-y-3 text-xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase">Ajuste de Cámaras (Permite 0)</p>
          <div className="space-y-2">
            {catalog.map((item, idx) => {
              const currentVal = idx === 0 ? c1 : idx === 1 ? c2 : c3;
              const setVal = idx === 0 ? setC1 : idx === 1 ? setC2 : setC3;
              return (
                <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-bold">{item.label}</p>
                    <p className="text-[10px] text-gray-400">Stock: {item.stock} un.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setVal(Math.max(0, currentVal - 1))} className="w-7 h-7 bg-white rounded border font-bold">-</button>
                    <span className="w-4 text-center font-bold">{currentVal}</span>
                    <button type="button" onClick={() => setVal(currentVal + 1)} className="w-7 h-7 bg-white rounded border font-bold">+</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pt-2">
            <div className="flex justify-between text-[11px] text-gray-500 font-bold mb-1"><span>Canalización Estructural:</span><span>{meters}m</span></div>
            <input type="range" min="5" max="100" step="5" value={meters} onChange={e => setMeters(parseInt(e.target.value))} className="w-full accent-[#004aad]" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-gray-100 rounded-xl font-bold py-2">Atrás</button>
            <button type="button" onClick={() => setStep(3)} className="w-2/3 bg-[#004aad] text-white rounded-xl font-bold py-2">Revisar Total</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="bg-white p-5 rounded-xl border text-center space-y-4 text-xs">
          <p className="text-3xl font-black text-[#004aad]">${total.toLocaleString('es-CL')}</p>
          <div className="text-left bg-gray-50 p-3 rounded-xl space-y-1 text-[11px]">
            <p><strong>📍 Ubicación:</strong> {addr}</p>
            <p><strong>📦 Hardware Solicitado:</strong> {c1}x720p / {c2}x1080p / {c3}x4K</p>
          </div>
          <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-left">
            <p className="text-[10px] text-red-600 font-bold uppercase">⚠️ NOTA DE ASISTENCIA OPERATIVA:</p>
            <p className="text-[9px] text-red-500 font-medium leading-normal mt-0.5">
              Los valores presentados son estrictamente referenciales. La cotización final puede variar o sufrir reajustes tras la visita técnica en terreno del instalador, una vez validados los metros reales de canalización.
            </p>
          </div>
          <button type="button" onClick={() => { onSendQuote(currentUser.name, type, `${c1}x720p / ${c2}x1080p / ${c3}x4K`, c1, c2, c3, total, addr, meters); setStep(4); }} className="w-full bg-[#004aad] text-white py-2.5 rounded-xl font-bold">Enviar Solicitud a Central</button>
        </div>
      )}
      {step === 4 && (
        <div className="bg-green-50 p-6 rounded-xl border border-dashed border-green-500 text-center text-xs text-[#004aad] font-bold">
          ¡Solicitud Registrada en Central con Éxito!
          <button type="button" onClick={() => { setStep(1); setC1(0); setC2(0); setC3(0); }} className="underline block mx-auto mt-2 text-blue-600">Nueva Cotización</button>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 6. COMPONENTE: AGENDAR VISITA
// ==========================================
const AppointmentPage = ({ currentUser, onSendAppointment, calendarDays }) => {
  const [srv, setSrv] = useState('');
  const [dt, setDt] = useState('');
  const [done, setDone] = useState(false);
  return (
    <div className="p-4 space-y-4 text-xs">
      <h3 className="text-lg font-bold text-[#004aad] text-center">Agendar Visita</h3>
      {done ? <p className="text-center text-green-600 font-bold bg-green-50 p-4 rounded-xl border border-dashed border-green-500">✓ Solicitud de Visita Enviada</p> : (
        <>
          <select onChange={e => setSrv(e.target.value)} className="w-full p-3 border rounded-xl bg-white font-semibold">
            <option value="">-- Seleccione Requerimiento Técnico --</option>
            <option value="Mantenimiento Preventivo">Mantenimiento Preventivo</option>
            <option value="Instalación de Nueva Cámara">Instalación de Nueva Cámara</option>
          </select>
          <div className="grid grid-cols-2 gap-2">
            {calendarDays.map(day => (
              <button key={day.date} type="button" disabled={!day.active} onClick={() => setDt(day.date)} className={`p-3 rounded-xl border text-left flex flex-col justify-between ${!day.active ? 'bg-red-50 opacity-40 cursor-not-allowed text-red-400' : dt === day.date ? 'border-[#004aad] bg-blue-50 text-[#004aad]' : 'bg-white'}`}>
                <span className="font-bold">{day.date}</span>
                <span className="text-[9px] font-medium uppercase">{day.active ? '● Disponible' : '❌ COPADO'}</span>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => { onSendAppointment(currentUser.name, srv, dt); setDone(true); }} disabled={!srv || !dt} className="w-full bg-[#004aad] text-white py-3 rounded-xl font-bold">Confirmar Cupo Técnico</button>
        </>
      )}
    </div>
  );
};

// ==========================================
// 7. COMPONENTE: BOTÓN DE AUXILIO S.O.S
// ==========================================
const HelpPage = ({ currentUser, onSendAppointment }) => {
  const [sent, setSent] = useState(false);
  return (
    <div className="p-4 text-center pt-10 space-y-4 text-xs">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 font-black text-xl border border-red-500 animate-pulse">!</div>
      <h3 className="text-lg font-black text-red-600">Centro S.O.S Urgent</h3>
      {sent ? <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-red-700 font-bold">▲ Alerta S.O.S Activa. Ruta prioritaria despachada.</div> : (
        <>
          <p className="text-gray-500">¿Cámara caída o pérdida de video total? Pulse para despachar instalador.</p>
          <button type="button" onClick={() => { onSendAppointment(currentUser.name, "EMERGENCIA S.O.S: Pérdida de Video Crítica", "INMEDIATO"); setSent(true); }} className="w-full bg-red-600 text-white py-3 rounded-xl font-black">Despachar Soporte Urgente</button>
        </>
      )}
    </div>
  );
};

// ==========================================
// 8. COMPONENTE: CONSOLA DE ADMINISTRACIÓN (100% CORREGIDO)
// ==========================================
const AdminDashboard = ({ setView, catalog, setCatalog, quotes, setQuotes, appointments, setAppointments, users, calendarDays, setCalendarDays, onAssignTech }) => {
  const [tab, setTab] = useState('ops');
  const [selectedUserFolder, setSelectedUserFolder] = useState(null);
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemStock, setNewItemStock] = useState('');

  const staff = ['Sin Asignar', 'Juan Pérez (Móvil 1)', 'Carlos Silva (Móvil 2)', 'Andrés León (Móvil 3)'];

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans text-xs text-gray-800">
      <div className="w-52 bg-[#004aad] text-white p-4 flex flex-col justify-between flex-shrink-0 font-bold">
        <div className="space-y-5">
          <h2 className="text-base font-black">CISVEN <span className="text-yellow-400">CONTROL</span></h2>
          <nav className="flex flex-col gap-1.5">
            <button onClick={() => { setTab('ops'); setSelectedUserFolder(null); }} className={`w-full text-left p-2 rounded ${tab === 'ops' ? 'bg-white/20' : 'opacity-70'}`}>📊 Tráfico Operativo</button>
            <button onClick={() => { setTab('price'); setSelectedUserFolder(null); }} className={`w-full text-left p-2 rounded ${tab === 'price' ? 'bg-white/20' : 'opacity-70'}`}>📦 Catálogo e Inventario</button>
            <button onClick={() => { setTab('users'); setSelectedUserFolder(null); }} className={`w-full text-left p-2 rounded ${tab === 'users' ? 'bg-white/20' : 'opacity-70'}`}>👥 Historial de Clientes ({users.length})</button>
          </nav>
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={() => setView('tecnico-app')} className="text-yellow-300 text-left underline">→ Ver App Técnico</button>
          <button onClick={() => setView('landing')} className="opacity-50 text-left">← Volver al Inicio</button>
        </div>
      </div>

      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        <h1 className="text-lg font-bold text-gray-700">
          {tab === 'ops' && 'Mesa de Incidentes y Tráfico Operativo'}
          {tab === 'price' && 'Maestro de Tarifas y Gestión de Stock Físico'}
          {tab === 'users' && !selectedUserFolder && 'Fichero General de Abonados CISVEN'}
          {selectedUserFolder && `Expediente del Cliente: ${selectedUserFolder.name}`}
        </h1>

        {tab === 'ops' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border space-y-2">
              <h3 className="font-bold text-[#004aad] border-b pb-1 uppercase flex justify-between">
                <span>📦 Cotizaciones Recibidas</span>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 rounded-full font-black">{quotes.length}</span>
              </h3>
              {quotes.length === 0 ? <p className="italic text-gray-400 text-center py-4">Sin solicitudes pendientes</p> : quotes.map(q => (
                <div key={q.id} className="p-2.5 bg-gray-50 border rounded-lg flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-800">{q.user}</p>
                    <p className="text-gray-500 font-mono font-bold">{q.cam}</p>
                    <p className="text-[10px] text-gray-400">📍 {q.address}</p>
                    <p className="text-[#004aad] font-black mt-0.5 text-sm">${q.total.toLocaleString('es-CL')}</p>
                  </div>
                  <button onClick={() => setQuotes(quotes.filter(item => item.id !== q.id))} className="text-[10px] bg-red-50 text-red-600 font-bold px-2 py-1 rounded">✕ Remover</button>
                </div>
              ))}
            </div>

            <div className="bg-white p-4 rounded-xl border space-y-2">
              <h3 className="font-bold text-yellow-600 border-b pb-1 uppercase flex justify-between">
                <span>📅 Citas Recibidas y Alertas S.O.S</span>
                <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 rounded-full font-black">{appointments.length}</span>
              </h3>
              {appointments.length === 0 ? <p className="italic text-gray-400 text-center py-4">Sistemas estables. Sin alertas en cola.</p> : appointments.map(app => (
                <div key={app.id} className="p-3 bg-yellow-50/50 border border-yellow-200 rounded-lg flex flex-col space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black text-gray-800">{app.user} - <span className="text-red-600 font-black">"{app.service}"</span></p>
                      <p className="text-[10px] text-gray-500">📍 Dirección: <span className="font-bold text-gray-700">{app.address}</span></p>
                      <p className="text-[10px] text-gray-500">🆔 RUT: <span className="font-mono font-bold text-gray-700">{app.rut}</span></p>
                      <p className="text-[10px] text-blue-700 font-bold mt-1">🛠️ Asignado a: <span className="underline">{app.technician || 'Sin Asignar'}</span></p>
                    </div>
                    <button onClick={() => setAppointments(appointments.filter(item => item.id !== app.id))} className="text-[10px] text-gray-400">✕ Quitar</button>
                  </div>
                  <div className="pt-2 border-t border-yellow-200/60">
                    <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Designar Técnico Responsable:</label>
                    <select value={app.technician || 'Sin Asignar'} onChange={(e) => onAssignTech(app.id, e.target.value)} className="w-full p-1.5 bg-white border border-gray-300 rounded text-[11px] font-bold text-gray-700 focus:outline-none">
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
              e.preventDefault();
              if(!newItemLabel || !newItemPrice || !newItemStock) return;
              setCatalog([...catalog, { id: Date.now(), label: newItemLabel, price: parseInt(newItemPrice), stock: parseInt(newItemStock) }]);
              setNewItemLabel(''); setNewItemPrice(''); setNewItemStock('');
              alert('Inventario inyectado.');
            }} className="bg-white p-4 rounded-xl border space-y-3">
              <h3 className="font-bold text-[#004aad] uppercase">➕ Nuevo Producto</h3>
              <input type="text" placeholder="Nombre" value={newItemLabel} onChange={e => setNewItemLabel(e.target.value)} className="w-full p-2 border rounded-lg" required />
              <input type="number" placeholder="Precio CLP" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} className="w-full p-2 border rounded-lg" required />
              <input type="number" placeholder="Stock Inicial" value={newItemStock} onChange={e => setNewItemStock(e.target.value)} className="w-full p-2 border rounded-lg" required />
              <button type="submit" className="w-full bg-[#004aad] text-white py-2 rounded-lg font-bold uppercase">Cargar</button>
            </form>

            <div className="xl:col-span-2 bg-white p-4 rounded-xl border space-y-3">
              <h3 className="font-bold text-gray-700 uppercase">📦 Inventario de Central</h3>
              <div className="space-y-2">
                {catalog.map((item) => (
                  <div key={item.id} className="p-2 bg-gray-50 rounded-xl border grid grid-cols-4 gap-2 items-center font-bold">
                    <span className="col-span-2 text-gray-700">{item.label}</span>
                    <input type="number" value={item.price} onChange={(e) => setCatalog(catalog.map(i => i.id === item.id ? { ...i, price: parseInt(e.target.value) || 0 } : i))} className="p-1 border rounded bg-white text-right text-[#004aad]" />
                    <input type="number" value={item.stock} onChange={(e) => setCatalog(catalog.map(i => i.id === item.id ? { ...i, stock: parseInt(e.target.value) || 0 } : i))} className="p-1 border rounded bg-white text-center text-gray-800" />
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <h3 className="font-bold text-gray-700 uppercase">📆 Almanaque Operativo</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {calendarDays.map(day => (
                    <button key={day.date} type="button" onClick={() => setCalendarDays(calendarDays.map(d => d.date === day.date ? { ...d, active: !d.active } : d))} className={`p-2 rounded-xl border font-bold text-center flex justify-between items-center ${day.active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                      <span>{day.date.split(' ')[0]} {day.date.split(' ')[1]}</span>
                      <span className="text-[8px] font-black">{day.active ? 'OK' : 'BLOCK'}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'users' && !selectedUserFolder && (
          <div className="bg-white p-4 rounded-xl border space-y-2">
            {users.map(u => (
              <div key={u.id} onClick={() => setSelectedUserFolder(u)} className="p-3 bg-gray-50 hover:bg-blue-50 border rounded-xl flex justify-between items-center cursor-pointer border-l-4 border-l-[#004aad]">
                <div>
                  <p className="font-black text-gray-800 text-sm">{u.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">RUT: {u.rut} | Propiedad: {u.address}</p>
                </div>
                <span className="text-gray-400 font-bold font-mono">Ver Ficha</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'users' && selectedUserFolder && (
          <div className="bg-white p-5 rounded-xl border space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <h2 className="text-base font-black text-[#004aad]">{selectedUserFolder.name}</h2>
                <p className="text-[10px] text-gray-400">Contrato: {selectedUserFolder.contract}</p>
              </div>
              <button onClick={() => setSelectedUserFolder(null)} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg font-bold">← Volver</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-50 p-2.5 rounded border">
                <p className="text-[9px] text-gray-400 font-bold uppercase">📍 Dirección Estructural Confirmada</p>
                <p className="font-bold text-gray-700">{selectedUserFolder.address}</p>
              </div>
              <div className="bg-gray-50 p-2.5 rounded border">
                <p className="text-[9px] text-gray-400 font-bold uppercase">🆔 RUT Titular de Cuenta</p>
                <p className="font-bold text-gray-700">{selectedUserFolder.rut}</p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
              <p className="text-[9px] font-bold text-[#004aad] uppercase">📦 HARDWARE INSTALADO:</p>
              <p className="font-mono font-bold text-gray-700 bg-white p-2 rounded border mt-1">{selectedUserFolder.installedHardware}</p>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-gray-600 uppercase text-[10px]">🛠️ Bitácora Histórica de Trabajos Cerrados por el Instalador</h4>
              <div className="border rounded-xl bg-white overflow-hidden">
                {!selectedUserFolder.historyLog || selectedUserFolder.historyLog.length === 0 ? (
                  <p className="p-3 text-gray-400 italic text-center">No se registran intervenciones.</p>
                ) : (
                  selectedUserFolder.historyLog.map(job => (
                    <div key={job.id} className="p-2.5 border-b last:border-0 flex justify-between items-center bg-green-50/20">
                      <div>
                        <p className="font-bold text-gray-800">✓ {job.type}</p>
                        <p className="text-[10px] text-gray-500">Operó: <strong className="text-gray-700 font-bold">{job.technician}</strong> | <span className="italic text-gray-600">"Nota de Campo: {job.detail}"</span></p>
                      </div>
                      <span className="bg-green-600 text-white font-bold px-2 py-0.5 rounded text-[9px] uppercase">Cerrado</span>
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
};

// ==========================================
// 9. COMPONENTE: APP DE TERRENO TÉCNICOS
// ==========================================
const TechnicianApp = ({ setView, techJobs, onCompleteJob }) => {
  const [techFilter, setTechFilter] = useState('Carlos Silva (Móvil 2)'); 
  const [observations, setObservations] = useState({}); 

  const handleTextChange = (id, text) => {
    setObservations(prev => ({ ...prev, [id]: text }));
  };

  const jobsFiltered = techJobs.filter(j => j.technician === techFilter);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col max-w-md mx-auto p-4 text-white text-xs">
      <div className="text-center border-b border-slate-800 pb-2 mb-4">
        <h2 className="text-base font-black text-yellow-400">CISVEN TERRENO</h2>
        <div className="mt-1">
          <label className="text-[8px] uppercase text-slate-400 font-bold block">Ver Hoja de Ruta de:</label>
          <select value={techFilter} onChange={e => setTechFilter(e.target.value)} className="bg-slate-800 text-yellow-400 font-bold p-1 rounded text-[10px] border border-slate-700 mt-0.5 focus:outline-none">
            <option value="Juan Pérez (Móvil 1)">Juan Pérez (Móvil 1)</option>
            <option value="Carlos Silva (Móvil 2)">Carlos Silva (Móvil 2)</option>
            <option value="Andrés León (Móvil 3)">Andrés León (Móvil 3)</option>
          </select>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {jobsFiltered.length === 0 ? (
          <div className="p-6 text-center bg-slate-800/40 rounded-xl border border-slate-800 text-slate-400 italic">
            📭 Sin asignaciones pendientes para {techFilter.split(' ')[0]}.
          </div>
        ) : (
          jobsFiltered.map(job => (
            <div key={job.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3">
              <div className="flex justify-between border-b border-slate-700 pb-1.5 items-center">
                <span className="font-black text-yellow-400 uppercase text-[11px]">Abonado: {job.user}</span>
                <span className="bg-blue-600/30 text-blue-400 text-[9px] px-2 py-0.5 rounded-full font-black border border-blue-500/20">
                  👤 Asignado a: {job.technician.split(' ')[0]}
                </span>
              </div>

              <p className="text-slate-300">🛠️ Tarea: <strong className="text-white">"{job.service}"</strong></p>
              
              <div className="bg-slate-900/60 p-2 rounded border border-slate-700 space-y-0.5">
                <p className="text-slate-400 uppercase text-[8px] font-bold">📍 Dirección Maestra de Destino:</p>
                <p className="font-bold text-white">{job.address}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">RUT Cliente: <span className="font-mono text-slate-220 font-bold">{job.rut}</span></p>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">📝 Nota de Observación / Estado Técnico:</label>
                <textarea 
                  placeholder="Escriba el informe de la revisión." 
                  value={observations[job.id] || ''} 
                  onChange={(e) => handleTextChange(job.id, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2 text-[11px] focus:outline-none focus:border-yellow-400 h-16 resize-none placeholder:text-slate-600"
                />
              </div>

              <button 
                type="button" 
                onClick={() => {
                  const currentNote = observations[job.id] || 'Visita finalizada sin comentarios.';
                  onCompleteJob(job.id, job.technician, currentNote);
                  alert('¡Informe de trabajo inyectado con éxito!');
                }} 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-2 rounded-lg text-xs"
              >
                Cerrar Orden de Trabajo
              </button>
            </div>
          ))
        )}
      </div>
      <button type="button" onClick={() => setView('admin-ops')} className="text-[11px] text-slate-500 underline text-center mt-4 block mx-auto">← Volver a Mesa de Control</button>
    </div>
  );
};

// ==========================================
// 10. ORQUESTADOR GLOBAL PRINCIPAL (APP)
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
    const newJob = { id: Date.now(), user, service, date, address: targetUser?.address || 'Dirección de Registro Base', rut: targetUser?.rut || '1-9', technician: 'Sin Asignar' };
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
      setCameraCatalog(prevCatalog => prevCatalog.map((item, idx) => {
        const discount = idx === 0 ? (relatedQuote.q1 || 0) : idx === 1 ? (relatedQuote.q2 || 0) : (relatedQuote.q3 || 0);
        return { ...item, stock: Math.max(0, item.stock - discount) };
      }));
    }

    setTechJobs(techJobs.filter(j => j.id !== id));
    setAppointments(appointments.filter(j => j.id !== id));
    
    setUsers(prev => prev.map(u => {
      if (u.name === target.user) {
        return { 
          ...u, 
          historyLog: [
            { 
              id: Date.now(), 
              date: target.date === 'INMEDIATO' ? '18 de Mayo' : target.date, 
              type: target.service, 
              technician: firmingTechnician, 
              detail: techObservation 
            }, 
            ...(u.historyLog || [])
          ] 
        };
      }
      return u;
    }));
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
            {view === 'app-dashboard' && <ClientHome currentUser={currentUser} />}
            {view === 'app-getquote' && <InteractiveQuoter catalog={cameraCatalog} currentUser={currentUser} onSendQuote={handleSendQuote} />}
            {view === 'app-schedule' && <AppointmentPage currentUser={currentUser} onSendAppointment={handleSendAppointment} calendarDays={calendarDays} />}
            {view === 'app-sos' && <HelpPage currentUser={currentUser} onSendAppointment={handleSendAppointment} />}
          </ClientLayout>
        )
      )}
    </div>
  );
}