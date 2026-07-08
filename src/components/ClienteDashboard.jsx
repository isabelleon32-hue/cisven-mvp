import { useState, useMemo } from 'react'
import { useCisven } from '../context/CisvenContext.jsx'
import CisvenLogo from './CisvenLogo.jsx'

const WHATSAPP_DUENO = '56958708231'

function BottomNav({ activa, onChange }) {
  const tabs = [
    { id: 'inicio', icon: '🏠', label: 'Inicio' },
    { id: 'agendar', icon: '📅', label: 'Agendar' },
    { id: 'cotizar', icon: '💬', label: 'Cotizar' },
    { id: 'historial', icon: '📋', label: 'Historial' },
    { id: 'sos', icon: '🆘', label: 'S.O.S' },
  ]
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-[#0f4a44] flex"
      style={{ backgroundColor: 'var(--dark)', maxWidth: 420, margin: '0 auto', left: '50%', transform: 'translateX(-50%)' }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className="flex-1 flex flex-col items-center py-2 text-xs transition"
          style={{ color: activa === t.id ? 'var(--teal)' : '#5a8a82' }}>
          <span className="text-lg">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </nav>
  )
}

function Inicio({ user }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#0f4a44] p-5" style={{ backgroundColor: 'var(--card)' }}>
        <div className="flex items-center gap-3 mb-3">
          <CisvenLogo size={28} />
          <div>
            <p className="font-bold text-white">{user.nombre}</p>
            <p className="text-xs text-[#7eb8ad]">RUT {user.rut} · Plan {user.plan}</p>
          </div>
        </div>
        <p className="text-sm text-[#a8d4cc]">{user.direccion}</p>
        <p className="text-sm text-[#a8d4cc]">{user.telefono}</p>
      </div>
      <div className="rounded-2xl border border-[#0f4a44] p-5" style={{ backgroundColor: 'var(--card)' }}>
        <p className="text-sm font-semibold text-white mb-2">¿Necesitas ayuda?</p>
        <a href={`https://wa.me/${WHATSAPP_DUENO}?text=Hola CISVEN, necesito ayuda con mi servicio`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-lg py-3 text-sm font-semibold"
          style={{ backgroundColor: '#25d366', color: '#fff' }}>
          💬 Contactar por WhatsApp
        </a>
      </div>
    </div>
  )
}

function AgendaFlota({ user, productos, agregarTrabajo, trabajos }) {
  const [servicioId, setServicioId] = useState('')
  const [diaIdx, setDiaIdx] = useState(null)
  const [msg, setMsg] = useState('')
  const [confirmando, setConfirmando] = useState(false)

  const dias = Array.from({ length: 15 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return d
  }).filter(d => {
    const fecha = d.toISOString().slice(0, 10)
    return trabajos.filter(t => t.fecha === fecha).length < 7
  })

  const servicioSeleccionado = productos.find(p => p.id === servicioId)
  const diaSeleccionado = dias[diaIdx]

  const handleConfirmar = async () => {
    if (!servicioId || diaIdx === null) { setMsg('Selecciona servicio y día.'); return }
    const { error } = await agregarTrabajo({
      abonado_id: user.id,
      producto_id: servicioId,
      tipo: servicioSeleccionado?.nombre,
      fecha: diaSeleccionado?.toISOString().slice(0, 10),
      estado: 'pendiente',
      origen: 'agendamiento_cliente',
    })
    if (error) { setMsg('Error al agendar.'); return }
    setMsg('✅ Visita solicitada. El admin confirmará la hora.')
    setServicioId('')
    setDiaIdx(null)
    setConfirmando(false)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#0f4a44] p-5" style={{ backgroundColor: 'var(--card)' }}>
        <h2 className="text-lg font-bold text-white tracking-wide mb-1">AGENDA DE FLOTA</h2>
        <p className="text-xs text-[#7eb8ad] mb-4">ASIGNACIÓN DE VISITAS TÉCNICAS</p>

        {/* Selector servicio desplegable */}
        <p className="text-sm font-medium text-[#b8e6dc] mb-2">1. Tipo de servicio</p>
        <select value={servicioId} onChange={e => { setServicioId(e.target.value); setConfirmando(false) }}
          className="w-full rounded-lg border border-[#0f4a44] bg-[var(--dark)] px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--teal)] mb-4">
          <option value="">Seleccionar servicio...</option>
          {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>

        {/* Días disponibles */}
        <p className="text-sm font-medium text-[#b8e6dc] mb-2">2. Día disponible</p>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {dias.map((d, i) => (
            <button key={i} onClick={() => { setDiaIdx(i); setConfirmando(false) }}
              className="flex-shrink-0 rounded-xl px-3 py-2 text-center text-xs transition"
              style={{
                backgroundColor: diaIdx === i ? '#f59e0b' : 'var(--dark)',
                color: diaIdx === i ? '#000' : '#a8d4cc',
                border: diaIdx === i ? '1px solid #f59e0b' : '1px solid #0f4a44',
                minWidth: 52
              }}>
              <div className="font-bold">{d.toLocaleDateString('es-CL', { weekday: 'short' }).toUpperCase()}</div>
              <div className="text-lg font-bold">{d.getDate()}</div>
              <div>{d.toLocaleDateString('es-CL', { month: 'short' })}</div>
            </button>
          ))}
        </div>

        {/* Resumen antes de confirmar */}
        {servicioId && diaIdx !== null && !confirmando && (
          <div className="rounded-xl border border-[#0f4a44] p-3 mb-4" style={{ backgroundColor: 'var(--dark)' }}>
            <p className="text-xs text-[#7eb8ad] mb-1">Resumen de tu solicitud:</p>
            <p className="text-sm font-semibold text-white">📋 {servicioSeleccionado?.nombre}</p>
            <p className="text-sm text-[#a8d4cc]">📅 {diaSeleccionado?.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            <p className="text-xs text-[#5a8a82] mt-1">⏰ La hora será confirmada por el admin</p>
          </div>
        )}

        {msg && <p className="mb-3 text-sm" style={{ color: msg.includes('✅') ? 'var(--teal)' : '#fca5a5' }}>{msg}</p>}

        {!confirmando ? (
          <button onClick={() => { if (!servicioId || diaIdx === null) { setMsg('Selecciona servicio y día.'); return } setMsg(''); setConfirmando(true) }}
            className="w-full rounded-lg py-3 text-sm font-bold tracking-wide"
            style={{ backgroundColor: 'var(--teal)', color: 'var(--bg)' }}>
            REVISAR SOLICITUD
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-center text-[#a8d4cc]">¿Confirmas esta solicitud?</p>
            <button onClick={handleConfirmar}
              className="w-full rounded-lg py-3 text-sm font-bold"
              style={{ backgroundColor: 'var(--teal)', color: 'var(--bg)' }}>
              ✅ CONFIRMAR RESERVA
            </button>
            <button onClick={() => setConfirmando(false)}
              className="w-full rounded-lg py-2 text-sm"
              style={{ backgroundColor: 'var(--dark)', color: '#a8d4cc', border: '1px solid #0f4a44' }}>
              Modificar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Cotizaciones({ user, productos, agregarTrabajo }) {
  const [items, setItems] = useState([])
  const [metrosCanalizado, setMetrosCanalizado] = useState(0)
  const [msg, setMsg] = useState('')
  const [confirmando, setConfirmando] = useState(false)
  const PRECIO_METRO = 2500

  const agregarItem = (productoId) => {
    const existe = items.find(i => i.id === productoId)
    if (existe) {
      setItems(items.map(i => i.id === productoId ? { ...i, cantidad: i.cantidad + 1 } : i))
    } else {
      const p = productos.find(p => p.id === productoId)
      if (p) setItems([...items, { id: p.id, nombre: p.nombre, precio: p.precio, cantidad: 1 }])
    }
  }

  const cambiarCantidad = (id, delta) => {
    setItems(prev => prev
      .map(i => i.id === id ? { ...i, cantidad: Math.max(0, i.cantidad + delta) } : i)
      .filter(i => i.cantidad > 0)
    )
  }

  const totalItems = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0)
  const totalCanalizado = metrosCanalizado * PRECIO_METRO
  const totalGeneral = totalItems + totalCanalizado

  const handleCotizar = async () => {
    if (items.length === 0) { setMsg('Agrega al menos un servicio.'); return }
    const detalle = { items, metrosCanalizado, totalGeneral }
    const descripcion = items.map(i => `${i.cantidad}x ${i.nombre}`).join(', ') +
      (metrosCanalizado > 0 ? ` + ${metrosCanalizado}m canalizado` : '')
    const { error } = await agregarTrabajo({
      abonado_id: user.id,
      tipo: descripcion,
      estado: 'pendiente',
      origen: 'cotizacion_cliente',
      cotizacion_detalle: detalle,
      observaciones: descripcion,
    })
    if (error) { setMsg('Error al enviar.'); return }
    setMsg('✅ Cotización enviada. Te responderemos pronto.')
    setItems([])
    setMetrosCanalizado(0)
    setConfirmando(false)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#0f4a44] p-5" style={{ backgroundColor: 'var(--card)' }}>
        <h2 className="text-lg font-bold text-white tracking-wide mb-1">COTIZACIONES</h2>
        <p className="text-xs text-[#7eb8ad] mb-4">Arma tu presupuesto personalizado</p>

        {/* Selector de productos */}
        <p className="text-sm font-medium text-[#b8e6dc] mb-2">Agregar servicio</p>
        <select onChange={e => { if (e.target.value) { agregarItem(e.target.value); e.target.value = '' } }}
          className="w-full rounded-lg border border-[#0f4a44] bg-[var(--dark)] px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--teal)] mb-4">
          <option value="">Seleccionar servicio...</option>
          {productos.map(p => <option key={p.id} value={p.id}>{p.nombre} — ${p.precio?.toLocaleString('es-CL')}</option>)}
        </select>

        {/* Items seleccionados */}
        {items.length > 0 && (
          <div className="space-y-2 mb-4">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-[#0f4a44] px-3 py-2"
                style={{ backgroundColor: 'var(--dark)' }}>
                <div>
                  <p className="text-sm font-medium text-white">{item.nombre}</p>
                  <p className="text-xs text-[#7eb8ad]">${(item.precio * item.cantidad).toLocaleString('es-CL')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => cambiarCantidad(item.id, -1)}
                    className="w-7 h-7 rounded-full text-white font-bold flex items-center justify-center"
                    style={{ backgroundColor: 'var(--card)', border: '1px solid #0f4a44' }}>−</button>
                  <span className="text-white font-semibold w-4 text-center">{item.cantidad}</span>
                  <button onClick={() => cambiarCantidad(item.id, 1)}
                    className="w-7 h-7 rounded-full text-white font-bold flex items-center justify-center"
                    style={{ backgroundColor: 'var(--teal)', color: 'var(--bg)' }}>+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Canalizado */}
        <div className="rounded-xl border border-[#0f4a44] px-3 py-3 mb-4" style={{ backgroundColor: 'var(--dark)' }}>
          <p className="text-sm font-medium text-[#b8e6dc] mb-2">Metros de canalizado (${PRECIO_METRO.toLocaleString('es-CL')}/m)</p>
          <div className="flex items-center gap-3">
            <button onClick={() => setMetrosCanalizado(Math.max(0, metrosCanalizado - 5))}
              className="w-8 h-8 rounded-full text-white font-bold"
              style={{ backgroundColor: 'var(--card)', border: '1px solid #0f4a44' }}>−</button>
            <input type="number" value={metrosCanalizado} min={0}
              onChange={e => setMetrosCanalizado(Math.max(0, Number(e.target.value)))}
              className="w-20 text-center rounded-lg border border-[#0f4a44] bg-[var(--card)] px-2 py-1.5 text-sm text-white outline-none" />
            <button onClick={() => setMetrosCanalizado(metrosCanalizado + 5)}
              className="w-8 h-8 rounded-full font-bold"
              style={{ backgroundColor: 'var(--teal)', color: 'var(--bg)' }}>+</button>
            <span className="text-xs text-[#7eb8ad]">= ${totalCanalizado.toLocaleString('es-CL')}</span>
          </div>
        </div>

        {/* Total */}
        {(items.length > 0 || metrosCanalizado > 0) && (
          <div className="rounded-xl p-3 mb-4" style={{ backgroundColor: 'rgba(0,194,146,0.1)', border: '1px solid var(--teal)' }}>
            <div className="flex justify-between text-sm text-[#a8d4cc]">
              <span>Subtotal servicios:</span>
              <span>${totalItems.toLocaleString('es-CL')}</span>
            </div>
            {metrosCanalizado > 0 && (
              <div className="flex justify-between text-sm text-[#a8d4cc]">
                <span>Canalizado ({metrosCanalizado}m):</span>
                <span>${totalCanalizado.toLocaleString('es-CL')}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-white mt-2 pt-2 border-t border-[#0f4a44]">
              <span>TOTAL ESTIMADO:</span>
              <span style={{ color: 'var(--teal)' }}>${totalGeneral.toLocaleString('es-CL')}</span>
            </div>
            <p className="text-xs text-[#5a8a82] mt-1">* Precio sujeto a confirmación del técnico</p>
          </div>
        )}

        {msg && <p className="mb-3 text-sm" style={{ color: msg.includes('✅') ? 'var(--teal)' : '#fca5a5' }}>{msg}</p>}

        {!confirmando ? (
          <button onClick={() => { if (items.length === 0) { setMsg('Agrega al menos un servicio.'); return } setMsg(''); setConfirmando(true) }}
            className="w-full rounded-lg py-3 text-sm font-bold"
            style={{ backgroundColor: 'var(--teal)', color: 'var(--bg)' }}>
            REVISAR COTIZACIÓN
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-center text-[#a8d4cc]">¿Confirmas el envío?</p>
            <button onClick={handleCotizar}
              className="w-full rounded-lg py-3 text-sm font-bold"
              style={{ backgroundColor: 'var(--teal)', color: 'var(--bg)' }}>
              ✅ ENVIAR COTIZACIÓN
            </button>
            <button onClick={() => setConfirmando(false)}
              className="w-full rounded-lg py-2 text-sm"
              style={{ backgroundColor: 'var(--dark)', color: '#a8d4cc', border: '1px solid #0f4a44' }}>
              Modificar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Historial({ user, trabajos }) {
  const items = useMemo(() =>
    trabajos.filter(t => t.abonado_id === user.id).sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? '')),
    [trabajos, user.id])

  const estadoColor = { pendiente: '#fbbf24', en_curso: 'var(--teal)', finalizado: '#86efac', archivado: '#5a8a82' }

  return (
    <div className="rounded-2xl border border-[#0f4a44] p-5" style={{ backgroundColor: 'var(--card)' }}>
      <h2 className="text-lg font-bold text-white mb-4">HISTORIAL</h2>
      {items.length === 0 ? (
        <p className="text-sm text-[#5a8a82]">Sin servicios registrados aún.</p>
      ) : (
        <ul className="space-y-3">
          {items.map(t => (
            <li key={t.id} className="rounded-xl border border-[#0f4a44] p-4" style={{ backgroundColor: 'var(--dark)' }}>
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <p className="font-medium text-white text-sm">{t.tipo}</p>
                  <p className="text-xs text-[#7eb8ad] mt-1">
                    {t.origen === 'cotizacion_cliente' ? '💬 Cotización' : '📅 Agendamiento'}
                    {t.fecha ? ` · ${t.fecha}` : ''}
                  </p>
                  {t.respuesta_admin && (
                    <div className="mt-2 rounded-lg px-3 py-2 text-xs"
                      style={{ backgroundColor: 'rgba(0,194,146,0.1)', color: 'var(--teal)', border: '1px solid var(--teal)' }}>
                      💰 Respuesta CISVEN: {t.respuesta_admin}
                      {t.precio_final && <span className="font-bold ml-1">— ${t.precio_final.toLocaleString('es-CL')}</span>}
                    </div>
                  )}
                </div>
                <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold flex-shrink-0"
                  style={{ color: estadoColor[t.estado_cotizacion ?? t.estado] ?? '#a8d4cc', backgroundColor: 'var(--card)' }}>
                  {t.estado_cotizacion === 'respondida' ? '✅ Respondida' : t.estado}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function CentroSOS({ user, dispararSOS, alertasSOS }) {
  const [mensaje, setMensaje] = useState('')
  const [enviado, setEnviado] = useState(false)
  const alertasActivas = alertasSOS.filter(a => a.activa && a.abonado_id === user.id)

  const handleSOS = async () => {
    await dispararSOS({ abonado_id: user.id, mensaje: mensaje || 'Emergencia activada por abonado' })
    setEnviado(true)
    setMensaje('')
    setTimeout(() => setEnviado(false), 5000)
  }

  return (
    <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: 'var(--card)', border: '1px solid #991b1b' }}>
      <h2 className="text-lg font-bold tracking-wide" style={{ color: '#ef4444' }}>CENTRO S.O.S</h2>
      <p className="text-xs text-[#7eb8ad]">LÍNEA DE ENLACE CRÍTICO</p>
      <div className="flex justify-center py-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full text-4xl font-bold text-white"
          style={{ backgroundColor: '#dc2626', boxShadow: '0 0 30px rgba(220,38,38,0.6)', animation: 'pulse 2s infinite' }}>
          !
        </div>
      </div>
      {alertasActivas.length > 0 && (
        <p className="rounded-lg px-3 py-2 text-sm font-medium"
          style={{ backgroundColor: 'rgba(220,38,38,0.2)', color: '#fca5a5' }}>
          Tienes {alertasActivas.length} alerta(s) activa(s). Central fue notificada.
        </p>
      )}
      {enviado && (
        <p className="rounded-lg px-3 py-2 text-sm"
          style={{ backgroundColor: 'rgba(0,194,146,0.15)', color: 'var(--teal)' }}>
          ✅ Alerta enviada.
        </p>
      )}
      <textarea value={mensaje} onChange={e => setMensaje(e.target.value)}
        placeholder="Describe la anomalía..."
        rows={3}
        className="w-full rounded-lg border border-red-900 bg-[var(--dark)] px-3 py-2.5 text-sm text-white outline-none placeholder:text-[#5a8a82] focus:border-red-500" />
      <button onClick={handleSOS}
        className="w-full rounded-xl py-4 text-base font-bold tracking-wide"
        style={{ backgroundColor: '#dc2626', color: '#fff', boxShadow: '0 0 24px rgba(220,38,38,0.35)' }}>
        TRANSMITIR ALERTA
      </button>
      <a href={`https://wa.me/${WHATSAPP_DUENO}?text=🆘 EMERGENCIA - ${user.nombre} (${user.rut}) reporta: ${mensaje || 'Emergencia en su propiedad'}`}
        target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full rounded-lg py-3 text-sm font-semibold"
        style={{ backgroundColor: '#25d366', color: '#fff' }}>
        💬 También contactar por WhatsApp
      </a>
    </div>
  )
}

export default function ClienteDashboard() {
  const { user, setUser, productos, trabajos, alertasSOS, dispararSOS, agregarTrabajo } = useCisven()
  const [tab, setTab] = useState('inicio')

  if (!user?.rut) return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
      <p className="text-[#a8d4cc]">Sesión no válida.</p>
    </div>
  )

  const renderTab = () => {
    switch (tab) {
      case 'inicio': return <Inicio user={user} />
      case 'agendar': return <AgendaFlota user={user} productos={productos} agregarTrabajo={agregarTrabajo} trabajos={trabajos} />
      case 'cotizar': return <Cotizaciones user={user} productos={productos} agregarTrabajo={agregarTrabajo} />
      case 'historial': return <Historial user={user} trabajos={trabajos} />
      case 'sos': return <CentroSOS user={user} dispararSOS={dispararSOS} alertasSOS={alertasSOS} />
      default: return null
    }
  }

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="mx-auto" style={{ maxWidth: 420 }}>
        <header className="flex items-center justify-between px-4 py-4 border-b border-[#0f4a44]"
          style={{ backgroundColor: 'var(--dark)' }}>
          <div className="flex items-center gap-2">
            <CisvenLogo size={28} />
            <span className="text-sm font-bold text-white">CISVEN</span>
          </div>
          <button onClick={() => setUser(null)} className="text-xs text-[#5a8a82]">Salir</button>
        </header>
        <main className="px-4 py-5">{renderTab()}</main>
      </div>
      <BottomNav activa={tab} onChange={setTab} />
    </div>
  )
}