import React, { useState, useEffect } from 'react';

// ==========================================
// 1. COMPONENTE DE LOGO CORPORATIVO (CISVEN)
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
// 2. CONTROL DE ACCESO (LANDING GATE)
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
            <p className="flex items-start gap-1.5"><span>•</span> Clientes: Cotización con rebote real y matriz de turnos viva.</p>
            <p className="flex items-start gap-1.5"><span>•</span> Central: Carga externa, control de 6 cupos y bloqueos.</p>
            <p className="flex items-start gap-1.5"><span>•</span> Técnicos: Cierre de rutas con reporte directo.</p>
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
// 4. CONSOLA DE ADMINISTRACIÓN CENTRAL
// ==========================================
function AdminDashboard({ 
  setView, catalog, onAddProduct, onDeleteProduct, 
  quotes, onAdjustQuote, appointments, onManualSchedule, 
  blockedDates, onToggleBlockDate, users, onAssignTech, onConfirmDispatch, onArchiveJob 
}) {
  const [tab, setTab] = useState('ops');
  const [selectedUserFolder, setSelectedUserFolder] = useState(null);
  
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemStock, setNewItemStock] = useState('');

  // Estados locales independientes para manejar la edición de rebotes en cada tarjeta
  const [localPrices, setLocalPrices] = useState({});
  const [localNotes, setLocalNotes] = useState({});

  const [extName, setExtName] = useState('');
  const [extService, setExtService] = useState('Mantención Telefónica Externa');
  const [extAddr, setExtAddr] = useState('');
  const [extPhone, setExtPhone] = useState('');
  const [extDate, setExtDate] = useState('');

  const [dateToBlock, setDateToBlock] = useState('');
  
  const staff = ['Sin Asignar', 'Juan Pérez (Móvil 1)', 'Carlos Silva (Móvil 2)', 'Andrés León (Móvil 3)'];

  const activeAppointments = appointments.filter(app => app.status === 'Asignado' || app.status === 'Pendiente Despacho' || app.status === 'En Ruta');
  const reviewAppointments = appointments.filter(app => app.status === 'Revisión Técnico');

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
    
    const existingCount = appointments.filter(app => app.date === extDate).length;
    if (existingCount >= 6) return alert('🚫 No se puede agendar. Esta fecha ya alcanzó el tope máximo de 6 visitas.');
    if (blockedDates.includes(extDate)) return alert('🔒 Esta fecha está bloqueada manualmente por la administración.');

    onManualSchedule(extName, extService, extDate, extAddr, extPhone);
    setExtName(''); setExtAddr(''); setExtPhone(''); setExtDate('');
    alert('📅 Cita externa inyectada exitosamente ocupando 1 cupo del día.');
  };

  return (
    <div className="min-h-screen bg-[#042120] flex font-sans text-xs text-teal-100">
      {/* Barra Lateral */}
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

      {/* Panel Principal */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        <h1 className="text-base font-black text-white uppercase tracking-wider">
          {tab === 'ops' && 'Mesa de Control de Incidentes, Despachos y Agendamiento'}
          {tab === 'price' && 'Maestro de Inventario y Carga de Existencias'}
          {tab === 'users' && !selectedUserFolder && 'Fichero General de Abonados'}
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
                          onClick={() => onArchiveJob(app.id, app.user, app.technician, app.techObservation, app.service)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2 rounded-lg uppercase text-[10px] tracking-wider"
                        >
                          ✓ Validar, Archivar Historial Pipol y Limpiar Mesa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECCIÓN INTERMEDIA: AGENDA TELEFÓNICA Y BLOQUEOS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <form onSubmit={handleExternalScheduleSubmit} className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-800/40 space-y-3">
                <h3 className="font-bold text-[#ecc245] uppercase text-[11px] tracking-wider">➕ Agendar Cita Manual (Llamados por fuera de la App)</h3>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Nombre del Cliente" value={extName} onChange={e => setExtName(e.target.value)} className="p-2 bg-[#042120] border border-teal-900 rounded-lg text-white font-bold" />
                  <input type="tel" placeholder="Teléfono" value={extPhone} onChange={e => setExtPhone(e.target.value)} className="p-2 bg-[#042120] border border-teal-900 rounded-lg text-white font-bold" />
                  <input type="text" placeholder="Dirección del Trabajo" value={extAddr} onChange={e => setExtAddr(e.target.value)} className="col-span-2 p-2 bg-[#042120] border border-teal-900 rounded-lg text-white font-bold" />
                  <select value={extService} onChange={e => setExtService(e.target.value)} className="p-2 bg-[#042120] border border-teal-900 rounded-lg text-white font-bold">
                    <option value="Instalación Telefónica Externa">Instalación Externa</option>
                    <option value="Mantención Telefónica Externa">Mantención de Emergencia</option>
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
                  <p className="text-[10px] text-teal-400 mt-1">Seleccione un día para cerrarlo por completo. Los clientes no podrán tomar turnos en esa fecha.</p>
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
                {blockedDates.length > 0 && (
                  <div className="pt-2 border-t border-teal-900">
                    <p className="text-[9px] font-black text-gray-400 uppercase">Días Cerrados de Forma Manual:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {blockedDates.map(d => (
                        <span key={d} className="bg-red-950 text-red-400 border border-red-900 px-2 py-0.5 rounded font-mono text-[9px] font-bold">{d}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* FILA INFERIOR: COTIZACIONES INTERACTIVAS Y CITAS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              
              {/* COMPONENTE DE REBOTE CORREGIDO PARA QUE EL ADMIN PUEDA EDITAR VALORES EN VIVO */}
              <div className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-800/40 space-y-2">
                <h3 className="font-bold text-teal-400 border-b border-teal-900 pb-2 uppercase flex justify-between items-center">
                  <span>📦 Cotizaciones Inteligentes de Clientes</span>
                  <span className="bg-teal-950 text-teal-400 px-2.5 py-0.5 rounded-full font-black text-[10px]">{quotes.length}</span>
                </h3>
                {quotes.length === 0 ? <p className="italic text-teal-600 text-center py-4">Sin solicitudes pendientes</p> : quotes.map(q => (
                  <div key={q.id} className="p-3 bg-[#042120] border border-teal-900 rounded-xl flex flex-col space-y-2 shadow-lg">
                    <div>
                      <div className="flex justify-between items-start">
                        <p className="font-black text-white text-sm">{q.user}</p>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${q.status === 'Respondido' ? 'bg-amber-950 text-[#ecc245] border border-amber-800' : q.status === 'Aceptado por Cliente' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-teal-950 text-teal-400 border border-teal-900'}`}>
                          {q.status === 'Respondido' ? 'Enviado a Cliente' : q.status === 'Aceptado por Cliente' ? 'Aceptado por Cliente' : 'Por Estudiar'}
                        </span>
                      </div>
                      <p className="text-gray-400 font-bold mt-1 text-xs">Precio Sugerido IA: <span className="text-teal-400 font-mono font-black">${q.total.toLocaleString('es-CL')}</span></p>
                      {q.status === 'Respondido' && (
                        <p className="text-amber-400 font-mono font-bold text-[11px] mt-0.5">➔ Rebote de Valor Real: ${q.adjustedTotal?.toLocaleString('es-CL')}</p>
                      )}
                      <p className="text-slate-400 font-mono text-[10px] mt-1.5">⚙️ Solicitud: {q.cam}</p>
                      <p className="text-[10px] text-teal-400 mt-0.5">📍 Ubicación: {q.address}</p>
                      <p className="text-[10px] text-emerald-400 font-bold mt-1 bg-teal-950/40 p-1 rounded inline-block border border-teal-900/40">📞 Fono: {q.phone}</p>
                    </div>

                    {/* FORMULARIO DE REBOTE ACTIVO (Habilitado para edición en el Admin) */}
                    {q.status === 'Pending' || q.status === 'Pendiente' ? (
                      <div className="bg-[#0a3a37] p-2.5 rounded-xl border border-teal-800 space-y-2 mt-2">
                        <p className="text-[9px] font-black text-[#ecc245] uppercase tracking-wider">✏️ Formulario de Ajuste Comercial:</p>
                        <div className="grid grid-cols-3 gap-1.5">
                          <input 
                            type="number" 
                            placeholder="Valor Real ($)" 
                            value={localPrices[q.id] || ''}
                            onChange={e => setLocalPrices({...localPrices, [q.id]: e.target.value})}
                            className="col-span-1 p-2 bg-[#042120] border border-teal-950 rounded-lg text-xs text-[#ecc245] font-mono font-bold focus:outline-none"
                          />
                          <input 
                            type="text" 
                            placeholder="Nota de ajuste..." 
                            value={localNotes[q.id] || ''}
                            onChange={e => setLocalNotes({...localNotes, [q.id]: e.target.value})}
                            className="col-span-2 p-2 bg-[#042120] border border-teal-950 rounded-lg text-xs text-white focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const pReal = parseInt(localPrices[q.id]);
                            const nReal = localNotes[q.id] || 'Presupuesto oficial ajustado por disponibilidad y metraje real.';
                            if (!pReal) return alert('Por favor, ingrese el Valor Real Ajustado.');
                            onAdjustQuote(q.id, pReal, nReal);
                            alert('¡Rebote enviado con éxito! Los nuevos valores se reflejarán en el celular del cliente.');
                          }}
                          className="w-full bg-[#085a4f] hover:bg-[#0b6b5e] text-white font-black py-2 rounded-lg text-[9px] uppercase tracking-wider transition-colors"
                        >
                          ⚡ Lanzar Rebote de Valor Real
                        </button>
                      </div>
                    ) : null}

                    {/* CONFIRMACIÓN DE CITA (Desbloqueado solo cuando el cliente aceptó el precio ajustado) */}
                    {q.status === 'Aceptado por Cliente' && (
                      <button 
                        type="button" 
                        onClick={() => { onApproveQuote(q); alert('Cita técnica activada en tránsito.'); }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl uppercase text-[10px] tracking-wider mt-1"
                      >
                        ✓ Confirmar y Crear Cita en Tránsito
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Citas y Rutas Activas */}
              <div className="bg-[#0a3a37] p-4 rounded-2xl border border-teal-800/40 space-y-2">
                <h3 className="font-bold text-red-400 border-b border-teal-900 pb-2 uppercase">📅 Citas Técnicas en Tránsito ({activeAppointments.length})</h3>
                {activeAppointments.length === 0 ? <p className="italic text-teal-600 text-center py-4">Sin órdenes activas en tránsito.</p> : activeAppointments.map(app => {
                  const dayTotal = appointments.filter(a => a.date === app.date).length;
                  return (
                    <div key={app.id} className="p-3 bg-[#042120] border border-teal-900 rounded-xl space-y-2">
                      <div className="space-y-0.5">
                        <div className="flex justify-between items-center">
                          <p className="font-black text-white">{app.user} - <span className="text-[#ecc245]">"{app.service}"</span></p>
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
              <h3 className="font-bold text-white uppercase text-[11px]">📦 Inventario Físico Actual y Modificación de Valores</h3>
              <div className="space-y-2">
                {catalog.map((item) => (
                  <div key={item.id} className="p-2.5 bg-[#042120] rounded-xl border border-teal-900/60 grid grid-cols-12 gap-2 items-center font-bold">
                    <span className="col-span-5 text-teal-200">{item.label}</span>
                    <div className="col-span-3 flex items-center gap-1">
                      <span className="text-teal-600 font-mono">$</span>
                      <input type="number" value={item.price} onChange={() => {}} disabled className="w-full p-1 bg-[#0a3a37]/50 border border-teal-900 rounded text-right text-[#ecc245] opacity-80" />
                    </div>
                    <div className="col-span-3 flex items-center gap-1">
                      <span className="text-teal-600 text-[9px]">Cant.</span>
                      <input type="number" value={item.stock} onChange={() => {}} disabled className="w-full p-1 bg-[#0a3a37]/50 border border-teal-900 rounded text-center text-white opacity-80" />
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
            {users.map(u => (
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

// ==========================================
// 5. TERMINAL DEL TÉCNICO
// ==========================================
function TechnicianApp({ setView, techJobs, onSubmitToAdmin }) {
  const [techFilter, setTechFilter] = useState('Carlos Silva (Móvil 2)'); 
  const [observations, setObservations] = useState({}); 

  const jobsFiltered = techJobs.filter(j => j.technician === techFilter && j.status === 'En Ruta');

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
            📭 Sin rutas ni órdenes de instalación activas para este móvil.
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

              <div className="space-y-1">
                <label className="text-[9px] font-black text-[#ecc245] uppercase tracking-wide">Reporte de Terreno / Observación:</label>
                <textarea 
                  placeholder="Ej: El cliente posee 2 cámaras más que no pertenecen a la empresa..." 
                  value={observations[job.id] || ''} 
                  onChange={(e) => setObservations({ ...observations, [job.id]: e.target.value })}
                  className="w-full bg-[#042120] border border-teal-900 text-teal-100 rounded-xl p-2.5 text-xs focus:outline-none focus:border-teal-500 h-20 resize-none font-medium"
                />
              </div>
              <button 
                type="button" 
                onClick={() => {
                  const note = observations[job.id] || 'Instalación completada sin novedades.';
                  onSubmitToAdmin(job.id, note);
                  alert('Reporte enviado. Pasó a la mesa de control del Administrador para su validación.');
                }} 
                className="w-full bg-[#085a4f] hover:bg-[#0b6b5e] text-white font-black py-2.5 rounded-xl uppercase tracking-wider text-xs transition-colors"
              >
                🚀 Reportar y Enviar a Central Admin
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
// 6. COMPONENTES DEL CLIENTE LAYOUT MOBILE
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
        <p className="text-[9px] uppercase font-bold text-teal-400 tracking-wider">Abonado Activo</p>
        <p className="text-base font-black text-white mt-0.5">{currentUser?.name}</p>
        <p className="text-xs text-[#ecc245] mt-1 font-mono font-bold">📞 Contacto: {currentUser?.phone}</p>
        <p className="text-xs text-teal-400 mt-2">📍 Propiedad Protegida: {currentUser?.address}</p>
      </div>
      
      <div className="space-y-2">
        <p className="font-bold text-teal-600 uppercase text-[9px] tracking-wider">📋 Estado de mis Servicios:</p>
        {myEvents.length === 0 ? <p className="text-teal-700 italic text-center py-2 text-[11px]">Sin visitas operativas agendadas por ahora.</p> : myEvents.map(ev => (
          <div key={ev.id} className="bg-[#0a3a37] p-3 rounded-xl border border-teal-800 flex justify-between items-center text-[11px]">
            <div>
              <p className="font-bold text-white">{ev.service}</p>
              <p className="text-[10px] text-teal-400">Estado: <span className="text-[#ecc245] font-bold">{ev.status === 'Revisión Técnico' ? 'Instalación Finalizada (Validando Central)' : ev.status === 'En Ruta' ? `En camino con ${ev.technician}` : 'Asignando ruta...'}</span></p>
            </div>
            <span className="text-[8px] bg-teal-950 text-teal-400 border border-teal-800 px-2 py-0.5 rounded font-black uppercase">
              {ev.status === 'Revisión Técnico' ? 'Por Cerrar' : 'Vigente'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const InteractiveQuoter = ({ catalog, currentUser, quotes, onSendQuote, onClientAcceptFinalPrice }) => {
  const [step, setStep] = useState(1); 
  const [type, setType] = useState(''); 
  const [addr, setAddr] = useState(currentUser?.address || '');
  const [meters, setMeters] = useState(15); 
  const [quantities, setQuantities] = useState({});

  const myQuotes = quotes.filter(q => q.user === currentUser?.name);

  const handleUpdateQty = (id, delta) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      return { ...prev, [id]: Math.max(0, current + delta) };
    });
  };

  const base = type === 'Empresa' ? 120000 : 65000;
  const totalHardware = catalog.reduce((acc, item) => {
    const qty = quantities[item.id] || 0;
    return acc + (qty * item.price);
  }, 0);
  const total = base + totalHardware + (meters * 3500);

  const getHardwareSummaryString = () => {
    return catalog
      .filter(item => quantities[item.id] > 0)
      .map(item => `${quantities[item.id]}x ${item.label}`)
      .join(' / ') || 'Instalación Base';
  };

  return (
    <div className="p-5 space-y-4 text-xs font-sans">
      {/* VISTA DE REBOTE EN EL CELULAR DEL CLIENTE */}
      {myQuotes.length > 0 && (
        <div className="space-y-2">
          <p className="font-black text-[#ecc245] uppercase text-[9px] tracking-wider">🔄 Canal de Rebotes y Ofertas Oficiales:</p>
          {myQuotes.map(mq => (
            <div key={mq.id} className="p-3 bg-[#0a3a37] rounded-xl border border-teal-800 space-y-2 shadow-md">
              <div className="flex justify-between items-center border-b border-teal-900 pb-1">
                <span className="font-bold text-white text-[10px]">{mq.cam}</span>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${mq.status === 'Respondido' ? 'bg-amber-950 text-[#ecc245] border border-amber-800' : mq.status === 'Aceptado por Cliente' ? 'bg-emerald-950 text-emerald-400' : 'bg-teal-950 text-teal-400'}`}>
                  {mq.status === 'Respondido' ? 'Rebote de Valor' : mq.status === 'Aceptado por Cliente' ? 'Aceptado' : 'Estudiando...'}
                </span>
              </div>
              <p className="text-gray-400 text-[10px]">Cubicación Inicial Est.: <span className="font-mono font-bold">${mq.total.toLocaleString('es-CL')}</span></p>
              
              {mq.status === 'Respondido' && (
                <div className="mt-2 bg-[#042120] p-2.5 rounded-lg border border-amber-900/40 space-y-2">
                  <div>
                    <p className="text-[8px] font-black text-[#ecc245] uppercase tracking-wide">💼 Presupuesto Real Ajustado por Administración:</p>
                    <p className="text-base font-black text-emerald-400 font-mono mt-0.5">${mq.adjustedTotal?.toLocaleString('es-CL')}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-teal-400 uppercase tracking-wide">📝 Nota Técnica del Administrador:</p>
                    <p className="text-gray-200 italic text-[11px] mt-0.5">"{mq.adminNote}"</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClientAcceptFinalPrice(mq.id);
                      alert('🤝 ¡Presupuesto aceptado! La central de CISVEN ya fue notificada para asignar el camión técnico.');
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2 rounded-lg uppercase tracking-wider text-[10px] mt-1 shadow-lg transition-all"
                  >
                    🤝 Aceptar Presupuesto Final Real
                  </button>
                </div>
              )}
            </div>
          ))}
          <div className="border-t border-teal-900 my-4"></div>
        </div>
      )}

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
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {catalog.map((item) => {
              const currentVal = quantities[item.id] || 0;
              return (
                <div key={item.id} className="flex justify-between items-center p-2.5 bg-[#042120] border border-teal-950 rounded-xl">
                  <div>
                    <p className="font-bold text-teal-100">{item.label}</p>
                    <p className="text-[10px] text-teal-500">${item.price.toLocaleString('es-CL')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => handleUpdateQty(item.id, -1)} className="w-7 h-7 bg-[#0a3a37] text-white rounded font-black">-</button>
                    <span className="w-4 text-center font-bold text-[#ecc245] font-mono">{currentVal}</span>
                    <button type="button" onClick={() => handleUpdateQty(item.id, 1)} className="w-7 h-7 bg-[#0a3a37] text-white rounded font-black">+</button>
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
            <p className="text-[9px] text-red-400 font-bold mt-2 bg-red-950/30 p-2 rounded border border-red-900/30 leading-snug">
              ⚠️ El valor arrojado es estimado y preliminar. El precio final puede variar posterior a la evaluación técnica presencial en terreno del instalador.
            </p>
          </div>
          <div className="text-left bg-[#042120] p-3 rounded-xl border border-teal-950 text-[11px] text-teal-400">
            <p><strong>📍 Ubicación de Obra:</strong> {addr}</p>
            <p><strong>📞 Teléfono Contacto:</strong> {currentUser?.phone || '+56976543210'}</p>
          </div>
          <button type="button" onClick={() => { onSendQuote(currentUser.name, type, getHardwareSummaryString(), total, addr, meters, currentUser?.phone); setStep(4); }} className="w-full bg-[#085a4f] text-white py-3 rounded-xl font-black uppercase tracking-wider">Enviar Propuesta a Central</button>
        </div>
      )}
      {step === 4 && <p className="text-center text-emerald-400 font-bold bg-emerald-950/20 p-4 rounded-xl border border-dashed border-emerald-800/30">✓ Presupuesto enviado con éxito. La central validará las existencias.</p>}
    </div>
  );
};

// ==========================================
// COMPONENTE NUEVO: NUEVA MATRIZ VIVA DE SELECCIÓN DE CUPOS
// ==========================================
const AppointmentPage = ({ currentUser, appointments, blockedDates, onSendAppointment }) => {
  const [srv, setSrv] = useState(''); 
  const [selectedDate, setSelectedDate] = useState('');
  const [done, setDone] = useState(false);

  // Generar dinámicamente los próximos 6 días hábiles a partir de hoy para armar la grilla visual
  const getNextDays = () => {
    const days = [];
    const baseDate = new Date();
    for (let i = 1; i <= 6; i++) {
      const next = new Date(baseDate);
      next.setDate(baseDate.getDate() + i);
      const str = next.toISOString().split('T')[0];
      
      const dayLabel = next.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' });
      days.push({ dateStr: str, label: dayLabel });
    }
    return days;
  };

  const availableDays = getNextDays();

  const handleClientScheduleSubmit = (e) => {
    e.preventDefault();
    if (!srv) return alert('Por favor, seleccione el requerimiento técnico.');
    if (!selectedDate) return alert('Por favor, seleccione un día de la matriz de cupos de abajo.');

    const countForDay = appointments.filter(a => a.date === selectedDate).length;
    if (countForDay >= 6) return alert('🚫 Esta fecha ya alcanzó el tope máximo de 6 visitas.');
    if (blockedDates.includes(selectedDate)) return alert('🔒 Esta fecha está cerrada por la central.');

    onSendAppointment(currentUser.name, srv, selectedDate);
    setDone(true);
  };

  return (
    <div className="p-5 space-y-4 text-xs font-sans">
      <h3 className="text-xs font-black text-teal-400 text-center uppercase tracking-wider">Matriz de Cupos Técnicos en Tiempo Real</h3>
      {done ? (
        <p className="text-center text-emerald-400 font-bold bg-emerald-950/20 p-4 rounded-xl border border-dashed border-emerald-800/30">✓ Solicitud de agenda inyectada con éxito.</p>
      ) : (
        <form onSubmit={handleClientScheduleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase text-gray-400 tracking-wide">1. Seleccione Tipo de Requerimiento</label>
            <select value={srv} onChange={e => setSrv(e.target.value)} className="w-full p-3 bg-[#042120] border border-teal-900 rounded-xl text-teal-100 font-bold focus:outline-none" required>
              <option value="">-- Seleccionar --</option>
              <option value="Mantención de Enlaces">Mantención de Enlaces</option>
              <option value="Ampliación de Cobertura Domo">Ampliación de Cobertura Domo</option>
            </select>
          </div>

          {/* DISEÑO MEJORADO: GRILLA DE CUPOS VIVA */}
          <div className="space-y-2">
            <label className="text-[9px] font-bold uppercase text-gray-400 tracking-wide">2. Matriz de Disponibilidad Diaria (Máx. 6/Día)</label>
            <div className="grid grid-cols-2 gap-2">
              {availableDays.map(d => {
                const count = appointments.filter(a => a.date === d.dateStr).length;
                const isBlocked = blockedDates.includes(d.dateStr);
                const isFull = count >= 6;

                let cardStyle = "border-teal-900 bg-[#042120] text-gray-300";
                let badge = `🟢 ${count}/6 Cupos`;

                if (isBlocked) {
                  cardStyle = "border-red-950 bg-red-950/20 text-red-400 opacity-60 cursor-not-allowed";
                  badge = "🔒 Cerrado";
                } else if (isFull) {
                  cardStyle = "border-red-900 bg-red-900/10 text-red-500 opacity-60 cursor-not-allowed";
                  badge = "🚫 Completo";
                } else if (selectedDate === d.dateStr) {
                  cardStyle = "border-[#ecc245] bg-[#ecc245]/10 text-[#ecc245] shadow-lg scale-[1.02]";
                }

                return (
                  <div 
                    key={d.dateStr}
                    onClick={() => { if (!isBlocked && !isFull) setSelectedDate(d.dateStr); }}
                    className={`p-3 rounded-xl border text-center font-bold cursor-pointer transition-all flex flex-col justify-between h-16 ${cardStyle}`}
                  >
                    <span className="capitalize text-[11px] font-black">{d.label}</span>
                    <span className="text-[9px] font-mono mt-1 font-black block">{badge}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button type="submit" className="w-full bg-[#085a4f] hover:bg-[#0b6b5e] text-white py-3 rounded-xl font-black uppercase tracking-wider shadow-md mt-2">
            Confirmar Reserva de Cupo Técnico
          </button>
        </form>
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
          <button type="button" onClick={() => { onSendAppointment(currentUser.name, "EMERGENCIA CRÍTICA: Despacho Inmediato", new Date().toISOString().split('T')[0]); setSent(true); }} className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-black uppercase tracking-widest">Enviar Auxilio S.O.S</button>
        </>
      )}
    </div>
  );
};

// ==========================================
// 7. ORQUESTADOR CENTRAL GLOBAL (NÚCLEO DE DATOS)
// ==========================================
export default function App() {
  const [view, setView] = useState('landing');
  
  const [cameraCatalog, setCameraCatalog] = useState(() => {
    const localCat = localStorage.getItem('cisven_catalog');
    return localCat ? JSON.parse(localCat) : [
      { id: 1, label: '720p Básica Estándar', price: 25000, stock: 45 }, 
      { id: 2, label: '1080p Domo Alta Def.', price: 45000, stock: 30 }, 
      { id: 3, label: '4K Profesional + AI', price: 95000, stock: 12 }
    ];
  });
  
  const [users, setUsers] = useState(() => {
    const local = localStorage.getItem('cisven_users');
    return local ? JSON.parse(local) : [
      { id: 1, name: 'Isabel Cristina León', rut: '1-9', address: 'Av. Américo Vespucio 1500, Maipú', phone: '+56976543210', contract: 'Monitoreo Residencial Pro AI', installedHardware: '4x Cámaras Domo 1080p / 1x Grabador NVR', status: 'Activo', historyLog: [] }
    ];
  });
  
  const [currentUser, setCurrentUser] = useState(null);
  const [quotes, setQuotes] = useState(() => JSON.parse(localStorage.getItem('cisven_quotes')) || []);
  const [appointments, setAppointments] = useState(() => JSON.parse(localStorage.getItem('cisven_appointments')) || []);
  const [blockedDates, setBlockedDates] = useState(() => JSON.parse(localStorage.getItem('cisven_blocked_dates')) || []);

  useEffect(() => { localStorage.setItem('cisven_catalog', JSON.stringify(cameraCatalog)); }, [cameraCatalog]);
  useEffect(() => { localStorage.setItem('cisven_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('cisven_quotes', JSON.stringify(quotes)); }, [quotes]);
  useEffect(() => { localStorage.setItem('cisven_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('cisven_blocked_dates', JSON.stringify(blockedDates)); }, [blockedDates]);

  const handleAddProduct = (label, price, stock) => {
    const newProd = { id: Date.now(), label, price, stock };
    setCameraCatalog([...cameraCatalog, newProd]);
  };

  const handleDeleteProduct = (id) => {
    setCameraCatalog(cameraCatalog.filter(item => item.id !== id));
  };

  const handleSendQuote = (user, type, cam, total, address, mtrs, clientPhone) => {
    const phoneToInject = clientPhone || users.find(u => u.name === user)?.phone || '+56976543210';
    const tomorrowStr = new Date();
    tomorrowStr.setDate(tomorrowStr.getDate() + 1);
    const dateStr = tomorrowStr.toISOString().split('T')[0];
    
    setQuotes([{ id: Date.now(), user, type, cam, total, address, meters: mtrs, phone: phoneToInject, status: 'Pendiente', date: dateStr }, ...quotes]);
  };

  const handleAdjustQuote = (id, price, note) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, status: 'Respondido', adjustedTotal: price, adminNote: note } : q));
  };

  const handleClientAcceptFinalPrice = (id) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, status: 'Aceptado por Cliente' } : q));
  };
  
  const handleSendAppointment = (userName, service, date) => {
    const targetUser = users.find(u => u.name === userName);
    const newJob = { 
      id: Date.now(), user: userName, service, date, 
      address: targetUser?.address || 'Dirección Base', 
      phone: targetUser?.phone || '+56976543210',
      technician: 'Sin Asignar', status: 'Pendiente Despacho', techObservation: ''
    };
    setAppointments([newJob, ...appointments]); 
  };

  const handleManualSchedule = (name, service, date, address, phone) => {
    const extJob = {
      id: Date.now(), user: name, service, date, address, phone,
      technician: 'Sin Asignar', status: 'Pendiente Despacho', techObservation: ''
    };
    setAppointments([extJob, ...appointments]);
  };

  const handleToggleBlockDate = (dateString) => {
    if (blockedDates.includes(dateString)) {
      setBlockedDates(blockedDates.filter(d => d !== dateString));
    } else {
      setBlockedDates([...blockedDates, dateString]);
    }
  };

  const handleApproveQuote = (quoteObject) => {
    const approvedJob = {
      id: Date.now(),
      user: quoteObject.user,
      service: `Instalación: (${quoteObject.cam})`,
      date: quoteObject.date,
      address: quoteObject.address,
      phone: quoteObject.phone || '+56976543210', 
      technician: 'Sin Asignar', status: 'Pendiente Despacho', techObservation: ''
    };
    setAppointments([approvedJob, ...appointments]);
    setQuotes(quotes.filter(q => q.id !== quoteObject.id));
  };

  const handleAssignTech = (id, technicianName) => {
    setAppointments(prev => prev.map(item => item.id === id ? { ...item, technician: technicianName } : item));
  };

  const handleConfirmDispatch = (id) => {
    setAppointments(prev => prev.map(item => item.id === id ? { ...item, status: 'En Ruta' } : item));
  };

  const handleTechSubmitToAdmin = (id, techObservationText) => {
    setAppointments(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'Revisión Técnico', techObservation: techObservationText } : item
    ));
  };
  
  const handleAdminArchiveJob = (id, userName, technicianName, finalObservation, serviceName) => {
    setAppointments(appointments.filter(j => j.id !== id));
    setUsers(prev => prev.map(u => 
      u.name === userName 
        ? { 
            ...u, 
            historyLog: [
              { id: Date.now(), date: new Date().toLocaleDateString('es-CL'), type: serviceName, technician: technicianName, detail: finalObservation }, 
              ...(u.historyLog || [])
            ] 
          } 
        : u
    ));
  };

  return (
    <div>
      {view === 'landing' && <Landing setView={setView} />}
      
      {view === 'admin-ops' && (
        <AdminDashboard 
          setView={setView} catalog={cameraCatalog} 
          onAddProduct={handleAddProduct} onDeleteProduct={handleDeleteProduct}
          quotes={quotes} onAdjustQuote={handleAdjustQuote}
          appointments={appointments} onManualSchedule={handleManualSchedule}
          blockedDates={blockedDates} onToggleBlockDate={handleToggleBlockDate}
          users={users} onAssignTech={handleAssignTech} onConfirmDispatch={handleConfirmDispatch}
          onApproveQuote={handleApproveQuote} onArchiveJob={handleAdminArchiveJob}
        />
      )}
      
      {view === 'tecnico-app' && (
        <TechnicianApp setView={setView} techJobs={appointments} onSubmitToAdmin={handleTechSubmitToAdmin} />
      )}
      
      {view.startsWith('app-') && (
        currentUser === null ? (
          <ClientAuth users={users} onRegister={(u) => setUsers([...users, u])} onLoginSuccess={(u) => { setCurrentUser(u); setView('app-dashboard'); }} />
        ) : (
          <ClientLayout setView={setView} onLogout={() => { setCurrentUser(null); setView('landing'); }}>
            {view === 'app-dashboard' && <ClientHome currentUser={currentUser} appointments={appointments} />}
            {view === 'app-getquote' && <InteractiveQuoter catalog={cameraCatalog} currentUser={currentUser} quotes={quotes} onSendQuote={handleSendQuote} onClientAcceptFinalPrice={handleClientAcceptFinalPrice} />}
            {view === 'app-schedule' && <AppointmentPage currentUser={currentUser} appointments={appointments} blockedDates={blockedDates} onSendAppointment={handleSendAppointment} />}
            {view === 'app-sos' && <HelpPage currentUser={currentUser} onSendAppointment={handleSendAppointment} />}
          </ClientLayout>
        )
      )}
    </div>
  );
}