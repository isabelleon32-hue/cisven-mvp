import { useMemo, useState } from 'react'
import { useCisven } from '../context/CisvenContext.jsx'
import CisvenLogo from './CisvenLogo.jsx'

function Card({ title, children, id }) {
  return (
    <section id={id} className="rounded-2xl border border-[#0f4a44] p-5 sm:p-6" style={{ backgroundColor: 'var(--card)' }}>
      {title && <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>}
      {children}
    </section>
  )
}

function MarquesinaSOS({ alertas, abonados, desactivarAlerta }) {
  const activas = alertas.filter(a => a.activa)
  if (activas.length === 0) return null
  const textos = activas.map(a => {
    const abonado = abonados.find(ab => ab.id === a.abonado_id)
    const nombre = abonado?.nombre ?? 'Abonado'
    const hora = new Date(a.created_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
    return `🆘 S.O.S · ${nombre} · ${hora} — ${a.mensaje ?? 'Emergencia'}`
  })
  const contenido = textos.join('   ◆   ')
  return (
    <div style={{ backgroundColor: '#7f1d1d', height: 36, overflow: 'hidden', position: 'relative', borderBottom: '1px solid #991b1b', flexShrink: 0 }} role="alert">
      <div className="flex whitespace-nowrap items-center h-full" style={{ animation: 'marquesina 28s linear infinite' }}>
        <span className="px-4 text-sm font-semibold text-white">{contenido}</span>
        <span className="px-4 text-sm font-semibold text-white" aria-hidden="true">{contenido}</span>
      </div>
      <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 4 }}>
        {activas.map(a => (
          <button key={a.id} onClick={() => desactivarAlerta(a.id)}
            style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', borderRadius: 4, padding: '0 6px', fontSize: 11, cursor: 'pointer' }}>✕</button>
        ))}
      </div>
      <style>{`@keyframes marquesina { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  )
}

function MesaControl({ trabajos, abonados, productos, tecnicos, agregarTrabajo, actualizarTrabajo, archivarTrabajo }) {
  const [abonadoId, setAbonadoId] = useState('')
  const [productoId, setProductoId] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [tecnicoId, setTecnicoId] = useState('')
  const [msg, setMsg] = useState('')
  const [diaAgenda, setDiaAgenda] = useState(0)
  const [filtroOrigen, setFiltroOrigen] = useState('todos')
  const [respuestas, setRespuestas] = useState({})
  const [precios, setPrecios] = useState({})
  const [confirmando, setConfirmando] = useState(null)
  const [asignaciones, setAsignaciones] = useState({})

  const dias = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() + i)
      return d.toISOString().slice(0, 10)
    })
  }, [])
  
  const diaActual = dias[diaAgenda]

  const cotizaciones = useMemo(() => {
    return trabajos.filter(t => t.origen === 'cotizacion_cliente' && t.estado_cotizacion !== 'respondida')
  }, [trabajos])

  const agendamientos = useMemo(() => {
    return trabajos.filter(t => t.origen === 'agendamiento_cliente' && t.estado === 'pendiente')
  }, [trabajos])

  const trabajosDia = useMemo(() => {
    return trabajos.filter(t => t.fecha === diaActual && t.estado !== 'archivado')
  }, [trabajos, diaActual])

  const trabajosActivos = useMemo(() => {
    return trabajos.filter(t =>
      t.estado !== 'archivado' &&
      (filtroOrigen === 'todos' || t.origen === filtroOrigen)
    )
  }, [trabajos, filtroOrigen])

  const handleResponderCotizacion = async (t) => {
    const respuesta = respuestas[t.id] ?? ''
    const precio = Number(precios[t.id]) || 0

    if (precio <= 0) { 
      setMsg('❌ Debes ingresar el precio final antes de responder.')
      return 
    }
    if (!respuesta.trim()) { 
      setMsg('❌ Escribe una respuesta antes de enviar.')
      return 
    }

    try {
      const abonado = abonados.find(a => a.id === t.abonado_id)
      await actualizarTrabajo(t.id, {
        respuesta_admin: respuesta,
        precio_final: precio,
        estado_cotizacion: 'respondida',
        estado: 'finalizado',
      })
      
      const detalle = t.cotizacion_detalle
      const itemsTexto = detalle?.items?.map(i => `${i.cantidad}x ${i.nombre}`).join(', ') ?? t.tipo
      const metros = detalle?.metrosCanalizado > 0 ? ` + ${detalle.metrosCanalizado}m canalizado` : ''
      const texto = `Hola ${abonado?.nombre}, tu cotización CISVEN:\n\n📋 ${itemsTexto}${metros}\n\n💰 Precio final: $${precio.toLocaleString('es-CL')}\n\n${respuesta}\n\n¿Agendamos la visita técnica?`
      
      window.open(`https://wa.me/${abonado?.telefono?.replace(/\s/g, '').replace('+', '')}?text=${encodeURIComponent(texto)}`, '_blank')
      
      setRespuestas(prev => { const n = { ...prev }; delete n[t.id]; return n })
      setPrecios(prev => { const n = { ...prev }; delete n[t.id]; return n })
      setMsg('✅ Cotización respondida.')
      setTimeout(() => setMsg(''), 3000)
    } catch (error) {
      console.error(error)
      setMsg('❌ Error al actualizar la cotización en el servidor. Inténtalo de nuevo.')
    }
  }

  const handleConfirmarAgendamiento = async (t) => {
    const asig = asignaciones[t.id] ?? {}
    if (!asig.tecnico_id) { setMsg('❌ Asigna un técnico.'); return }

    try {
      await actualizarTrabajo(t.id, {
        tecnico_id: asig.tecnico_id,
        hora: asig.hora ?? null,
        fecha: asig.fecha ?? t.fecha,
        estado: 'pendiente',
      })
      
      const abonado = abonados.find(a => a.id === t.abonado_id)
      const tecnico = tecnicos.find(tc => tc.id === asig.tecnico_id)
      const texto = `Hola ${abonado?.nombre}, tu visita técnica CISVEN ha sido confirmada.\n\n📋 ${t.tipo}\n📅 ${asig.fecha ?? t.fecha}${asig.hora ? `\n⏰ ${asig.hora}` : ''}\n👷 Técnico: ${tecnico?.nombre}\n\n¡Nos vemos pronto!`
      
      window.open(`https://wa.me/${abonado?.telefono?.replace(/\s/g, '').replace('+', '')}?text=${encodeURIComponent(texto)}`, '_blank')
      
      setAsignaciones(prev => { const n = { ...prev }; delete n[t.id]; return n })
      setConfirmando(null)
      setMsg('✅ Agendamiento confirmado.')
      setTimeout(() => setMsg(''), 3000)
    } catch (error) {
      console.error(error)
      setMsg('❌ Error al guardar el agendamiento. Revisa tu conexión.')
    }
  }

  const handleInyectar = async (e) => {
    e.preventDefault()
    if (!abonadoId || !productoId || !tecnicoId) { setMsg('Completa todos los campos.'); return }
    const producto = productos.find(p => p.id === productoId)
    const { error } = await agregarTrabajo({
      abonado_id: abonadoId,
      producto_id: productoId,
      tipo: producto?.nombre ?? 'Servicio',
      fecha: fecha || diaActual,
      hora: hora || null,
      tecnico_id: tecnicoId,
      origen: 'inyeccion_central',
    })
    if (error) { setMsg('Error al inyectar.'); return }
    setMsg('✅ Trabajo asignado.')
    setFecha(''); setHora('')
    setAbonadoId(''); setProductoId(''); setTecnicoId('')
    setTimeout(() => setMsg(''), 3000)
  }

  const inputClass = 'w-full rounded-lg border border-[#0f4a44] bg-[var(--dark)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--teal)]'

  return (
    <div className="space-y-6">

      {/* COTIZACIONES PENDIENTES */}
      {cotizaciones.length > 0 && (
        <Card title={`💬 Cotizaciones pendientes (${cotizaciones.length})`} id="cotizaciones">
          <div className="space-y-4">
            {cotizaciones.map(t => {
              const abonado = abonados.find(a => a.id === t.abonado_id)
              const detalle = t.cotizacion_detalle
              return (
                <div key={t.id} className="rounded-xl border border-[#0f4a44] p-4" style={{ backgroundColor: 'var(--dark)' }}>
                  <div className="mb-3">
                    <p className="font-semibold text-white">{abonado?.nombre}</p>
                    <p className="text-xs text-[#7eb8ad]">{abonado?.telefono}</p>
                  </div>
                  {detalle?.items?.length > 0 && (
                    <div className="mb-3 space-y-1">
                      {detalle.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs text-[#a8d4cc]">
                          <span>{item.cantidad}x {item.nombre}</span>
                          <span>${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
                        </div>
                      ))}
                      {detalle.metrosCanalizado > 0 && (
                        <div className="flex justify-between text-xs text-[#a8d4cc]">
                          <span>Canalizado {detalle.metrosCanalizado}m</span>
                          <span>${(detalle.metrosCanalizado * 2500).toLocaleString('es-CL')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-[#0f4a44]">
                        <span>Total estimado cliente:</span>
                        <span style={{ color: 'var(--teal)' }}>${detalle.totalGeneral?.toLocaleString('es-CL')}</span>
                      </div>
                    </div>
                  )}
                  {!detalle && t.observaciones && (
                    <p className="text-xs text-[#a8d4cc] mb-3">💬 {t.observaciones}</p>
                  )}
                  <div className="space-y-2">
                    <input type="number" placeholder="Precio final confirmado ($)"
                      value={precios[t.id] ?? ''}
                      onChange={e => setPrecios(prev => ({ ...prev, [t.id]: e.target.value }))}
                      className={inputClass} />
                    <textarea rows={3} placeholder="Mensaje para el cliente..."
                      value={respuestas[t.id] ?? ''}
                      onChange={e => setRespuestas(prev => ({ ...prev, [t.id]: e.target.value }))}
                      className="w-full rounded-lg border border-[#0f4a44] bg-[var(--card)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--teal)] resize-none" />
                    <button onClick={() => handleResponderCotizacion(t)}
                      className="w-full rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#25d366', color: '#fff' }}>
                      💬 Responder y enviar por WhatsApp
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* AGENDAMIENTOS PENDIENTES */}
      {agendamientos.length > 0 && (
        <Card title={`📅 Agendamientos por confirmar (${agendamientos.length})`} id="agendamientos">
          <div className="space-y-4">
            {agendamientos.map(t => {
              const abonado = abonados.find(a => a.id === t.abonado_id)
              const asig = asignaciones[t.id] ?? {}
              const enConfirmacion = confirmando === t.id
              return (
                <div key={t.id} className="rounded-xl border border-[#0f4a44] p-4" style={{ backgroundColor: 'var(--dark)' }}>
                  <p className="font-semibold text-white">{t.tipo}</p>
                  <p className="text-xs text-[#7eb8ad]">{abonado?.nombre} · {abonado?.telefono}</p>
                  <p className="text-xs text-[#5a8a82]">📅 {t.fecha ?? 'Sin fecha'}</p>
                  {!enConfirmacion ? (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <select value={asig.tecnico_id ?? ''}
                        onChange={e => setAsignaciones(prev => ({ ...prev, [t.id]: { ...asig, tecnico_id: e.target.value } }))}
                        className="rounded-lg border border-[#0f4a44] bg-[var(--card)] px-2 py-1.5 text-xs text-white col-span-2">
                        <option value="">Seleccionar técnico</option>
                        {tecnicos.map(tc => <option key={tc.id} value={tc.id}>{tc.nombre}</option>)}
                      </select>
                      <input type="date" value={asig.fecha ?? t.fecha ?? ''}
                        onChange={e => setAsignaciones(prev => ({ ...prev, [t.id]: { ...asig, fecha: e.target.value } }))}
                        className="rounded-lg border border-[#0f4a44] bg-[var(--card)] px-2 py-1.5 text-xs text-white" />
                      <input type="time" value={asig.hora ?? ''}
                        onChange={e => setAsignaciones(prev => ({ ...prev, [t.id]: { ...asig, hora: e.target.value } }))}
                        className="rounded-lg border border-[#0f4a44] bg-[var(--card)] px-2 py-1.5 text-xs text-white" />
                      <button onClick={() => { if (!asig.tecnico_id) { setMsg('❌ Asigna un técnico primero.'); return } setConfirmando(t.id) }}
                        className="col-span-2 rounded-lg py-2 text-xs font-bold"
                        style={{ backgroundColor: 'var(--teal)', color: 'var(--bg)' }}>
                        REVISAR Y CONFIRMAR
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2">
                      <div className="rounded-lg p-2 text-xs space-y-1" style={{ backgroundColor: 'var(--card)' }}>
                        <p className="text-white font-semibold">Confirmar asignación:</p>
                        <p className="text-[#a8d4cc]">👷 {tecnicos.find(tc => tc.id === asig.tecnico_id)?.nombre}</p>
                        <p className="text-[#a8d4cc]">📅 {asig.fecha ?? t.fecha} {asig.hora ? `⏰ ${asig.hora}` : ''}</p>
                      </div>
                      <button onClick={() => handleConfirmarAgendamiento(t)}
                        className="w-full rounded-lg py-2 text-xs font-bold flex items-center justify-center gap-2"
                        style={{ backgroundColor: '#25d366', color: '#fff' }}>
                        💬 Confirmar y notificar por WhatsApp
                      </button>
                      <button onClick={() => setConfirmando(null)}
                        className="w-full rounded-lg py-2 text-xs"
                        style={{ backgroundColor: 'var(--dark)', color: '#a8d4cc', border: '1px solid #0f4a44' }}>
                        Modificar
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* AGENDA 15 DÍAS */}
      <Card title="📅 Agenda — 15 días" id="agenda">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {dias.map((d, i) => {
            const fechaObj = new Date(d + 'T12:00:00')
            const count = trabajos.filter(t => t.fecha === d && t.estado !== 'archivado').length
            return (
              <button key={d} onClick={() => setDiaAgenda(i)}
                className="flex-shrink-0 rounded-xl px-3 py-2 text-center text-xs transition"
                style={{
                  backgroundColor: diaAgenda === i ? 'var(--teal)' : 'var(--dark)',
                  color: diaAgenda === i ? 'var(--bg)' : '#a8d4cc',
                  border: count >= 7 ? '1px solid #ef4444' : '1px solid #0f4a44',
                  minWidth: 52
                }}>
                <div className="font-bold">{fechaObj.toLocaleDateString('es-CL', { weekday: 'short' }).toUpperCase()}</div>
                <div className="text-lg font-bold">{fechaObj.getDate()}</div>
                <div style={{ color: count >= 7 ? '#ef4444' : 'inherit' }}>{count}/7</div>
              </button>
            )
          })}
        </div>
        {trabajosDia.length === 0 ? (
          <p className="text-sm text-[#5a8a82]">Sin trabajos para este día.</p>
        ) : (
          <div className="space-y-3">
            {trabajosDia.map(t => {
              const abonado = abonados.find(a => a.id === t.abonado_id)
              const tecnico = tecnicos.find(tc => tc.id === t.tecnico_id)
              return (
                <div key={t.id} className="rounded-xl border border-[#0f4a44] p-4" style={{ backgroundColor: 'var(--dark)' }}>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-medium text-white">{t.tipo}</p>
                      <p className="text-xs text-[#7eb8ad]">{abonado?.nombre} · {tecnico?.nombre ?? 'Sin técnico'}</p>
                      <p className="text-xs text-[#5a8a82]">{t.hora ?? '⏰ Hora por confirmar'} · {t.estado}</p>
                      {t.observaciones && <p className="mt-1 text-xs text-[#a8d4cc]">📝 {t.observaciones}</p>}
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <input type="time" defaultValue={t.hora ?? ''}
                        onBlur={e => {
                          if (e.target.value !== (t.hora ?? '')) {
                            actualizarTrabajo(t.id, { hora: e.target.value })
                          }
                        }}
                        className="rounded border border-[#0f4a44] bg-[var(--card)] px-2 py-1 text-xs text-white" />
                      <select value={t.tecnico_id ?? ''}
                        onChange={e => actualizarTrabajo(t.id, { tecnico_id: e.target.value })}
                        className="rounded border border-[#0f4a44] bg-[var(--card)] px-2 py-1 text-xs text-white">
                        <option value="">Sin técnico</option>
                        {tecnicos.map(tc => <option key={tc.id} value={tc.id}>{tc.nombre}</option>)}
                      </select>
                      {t.estado === 'finalizado' && (
                        <button onClick={() => archivarTrabajo(t.id)}
                          className="rounded px-2 py-1 text-xs font-semibold"
                          style={{ backgroundColor: 'var(--teal)', color: 'var(--bg)' }}>
                          Archivar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* INYECCIÓN MANUAL */}
      <Card title="⚡ Inyectar trabajo manual" id="trafico">
        <form onSubmit={handleInyectar} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <select value={abonadoId} onChange={e => setAbonadoId(e.target.value)} className={inputClass}>
            <option value="">Seleccionar abonado</option>
            {abonados.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
          </select>
          <select value={productoId} onChange={e => setProductoId(e.target.value)} className={inputClass}>
            <option value="">Seleccionar servicio</option>
            {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
          <select value={tecnicoId} onChange={e => setTecnicoId(e.target.value)} className={inputClass}>
            <option value="">Seleccionar técnico</option>
            {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className={inputClass} />
          <input type="time" value={hora} onChange={e => setHora(e.target.value)} className={inputClass} />
          <button type="submit" className="rounded-lg py-2.5 text-sm font-semibold"
            style={{ backgroundColor: 'var(--teal)', color: 'var(--bg)' }}>
            Inyectar trabajo
          </button>
        </form>
        {msg && <p className="mt-3 text-sm" style={{ color: msg.includes('✅') ? 'var(--teal)' : '#fca5a5' }}>{msg}</p>}
      </Card>

      {/* COLA ACTIVA */}
      <Card title="🔄 Cola activa" id="cola">
        <div className="flex gap-2 mb-4 flex-wrap">
          {['todos', 'inyeccion_central', 'agendamiento_cliente', 'cotizacion_cliente'].map(f => (
            <button key={f} onClick={() => setFiltroOrigen(f)}
              className="rounded-lg px-3 py-1 text-xs transition"
              style={{
                backgroundColor: filtroOrigen === f ? 'var(--teal)' : 'var(--dark)',
                color: filtroOrigen === f ? 'var(--bg)' : '#a8d4cc',
                border: '1px solid #0f4a44'
              }}>
              {f === 'todos' ? 'Todos' : f === 'inyeccion_central' ? 'Manual' : f === 'agendamiento_cliente' ? 'Agendados' : 'Cotizaciones'}
            </button>
          ))}
        </div>
        {trabajosActivos.length === 0 ? (
          <p className="text-sm text-[#5a8a82]">Sin trabajos en cola.</p>
        ) : (
          <div className="space-y-2">
            {trabajosActivos.map(t => {
              const abonado = abonados.find(a => a.id === t.abonado_id)
              const tecnico = tecnicos.find(tc => tc.id === t.tecnico_id)
              return (
                <div key={t.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#0f4a44] p-3"
                  style={{ backgroundColor: 'var(--dark)' }}>
                  <div>
                    <p className="font-medium text-white text-sm">{t.tipo}</p>
                    <p className="text-xs text-[#7eb8ad]">{abonado?.nombre} · {t.fecha ?? 'Sin fecha'} {t.hora ? `· ${t.hora}` : ''}</p>
                    <p className="text-xs" style={{ color: 'var(--teal)' }}>👷 {tecnico?.nombre ?? 'Sin asignar'} · {t.estado}</p>
                  </div>
                  <select value={t.tecnico_id ?? ''} onChange={e => actualizarTrabajo(t.id, { tecnico_id: e.target.value })}
                    className="rounded-lg border border-[#0f4a44] bg-[var(--card)] px-2 py-1 text-xs text-white">
                    <option value="">Sin asignar</option>
                    {tecnicos.map(tc => <option key={tc.id} value={tc.id}>{tc.nombre}</option>)}
                  </select>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}

function CatalogoEditable({ productos, agregarProducto, editarProducto, eliminarProducto }) {
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ nombre: '', precio: '', categoria: 'instalacion', stock: '' })
  const [msg, setMsg] = useState('')

  const iniciarEdicion = (p) => {
    setEditando(p.id)
    setForm({ nombre: p.nombre, precio: String(p.precio), categoria: p.categoria, stock: String(p.stock ?? '') })
  }

  const guardar = async () => {
    const datos = { nombre: form.nombre, precio: Number(form.precio) || 0, categoria: form.categoria, stock: Number(form.stock) || 0 }
    if (editando) { await editarProducto(editando, datos); setEditando(null) }
    else { await agregarProducto({ ...datos, activo: true }); setForm({ nombre: '', precio: '', categoria: 'instalacion', stock: '' }) }
    setMsg('✅ Guardado.'); setTimeout(() => setMsg(''), 2000)
  }

  const inputClass = 'rounded-lg border border-[#0f4a44] bg-[var(--dark)] px-2 py-1.5 text-sm text-white outline-none focus:border-[var(--teal)]'

  return (
    <Card title="Catálogo de Servicios" id="catalogo">
      <div className="space-y-2 mb-4">
        {productos.map(p => (
          <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#0f4a44] p-3" style={{ backgroundColor: 'var(--dark)' }}>
            <div>
              <p className="font-medium text-white">{p.nombre}</p>
              <p className="text-xs text-[#7eb8ad]">${p.precio?.toLocaleString('es-CL')} · {p.categoria} · Stock: {p.stock ?? 0}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => iniciarEdicion(p)} className="rounded-lg px-3 py-1 text-xs text-[var(--teal)] border border-[#0f4a44]">Editar</button>
              <button onClick={() => eliminarProducto(p.id)} className="rounded-lg px-3 py-1 text-xs text-red-300 border border-[#0f4a44]">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-4">
        <input placeholder="Nombre servicio" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className={inputClass} />
        <input placeholder="Precio" type="number" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} className={inputClass} />
        <input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className={inputClass} />
        <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} className={inputClass}>
          <option value="instalacion">Instalación</option>
          <option value="mantenimiento">Mantenimiento</option>
          <option value="soporte">Soporte</option>
          <option value="redes">Redes</option>
        </select>
      </div>
      <button onClick={guardar} className="mt-3 rounded-lg px-4 py-2 text-sm font-semibold" style={{ backgroundColor: 'var(--teal)', color: 'var(--bg)' }}>
        {editando ? 'Guardar cambios' : 'Agregar al catálogo'}
      </button>
      {msg && <p className="mt-2 text-sm text-[var(--teal)]">{msg}</p>}
    </Card>
  )
}

function AbonadosActivos({ abonados, trabajos }) {
  const [expandido, setExpandido] = useState(null)
  return (
    <Card title="Abonados Activos" id="abonados">
      {expandidos.length === 0 ? <p className="text-sm text-[#5a8a82]">Sin abonados registrados.</p> : (
        <ul className="space-y-2">
          {abonados.map(a => {
            const historial = trabajos.filter(t => t.abonado_id === a.id && t.estado === 'finalizado')
            return (
              <li key={a.id} className="rounded-xl border border-[#0f4a44] overflow-hidden" style={{ backgroundColor: 'var(--dark)' }}>
                <button onClick={() => setExpandido(expandido === a.id ? null : a.id)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left">
                  <div>
                    <p className="font-medium text-white">{a.nombre}</p>
                    <p className="text-xs text-[#7eb8ad]">{a.rut} · Plan {a.plan} · {historial.length} servicio(s)</p>
                  </div>
                  <span className="text-[var(--teal)]">{expandido === a.id ? '▲' : '▼'}</span>
                </button>
                {expandido === a.id && (
                  <div className="border-t border-[#0f4a44] px-4 py-3">
                    <p className="text-xs text-[#a8d4cc]">{a.direccion}</p>
                    <p className="text-xs text-[#a8d4cc]">{a.telefono}</p>
                    {historial.length === 0 ? <p className="mt-2 text-sm text-[#5a8a82]">Sin historial aún.</p> : (
                      <ul className="mt-2 space-y-2">
                        {historial.map(h => (
                          <li key={h.id} className="rounded-lg p-2 text-sm" style={{ backgroundColor: 'var(--card)' }}>
                            <span className="text-white">{h.tipo}</span>
                            <span className="text-[#7eb8ad]"> · {h.fecha}</span>
                            {h.observaciones && <p className="mt-1 text-xs text-[#a8d4cc]">Obs: {h.observaciones}</p>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

function ReportesSemanales({ trabajos, productos, tecnicos }) {
  const reporte = useMemo(() => {
    const hace7 = new Date()
    hace7.setDate(hace7.getDate() - 7)
    
    const finalizados = trabajos.filter(t => t.estado === 'finalizado' && t.fecha_fin && new Date(t.fecha_fin) >= hace7)
    let facturacion = 0
    const ranking = {}
    
    finalizados.forEach(t => {
      const prod = productos.find(p => p.id === t.producto_id)
      const monto = prod?.precio ?? 0
      facturacion += monto
      
      const key = t.tecnico_id ?? 'sin_asignar'
      if (!ranking[key]) ranking[key] = { id: key, trabajos: 0, facturacion: 0 }
      ranking[key].trabajos += 1
      ranking[key].facturacion += monto
    })
    
    return { finalizados: finalizados.length, facturacion, ranking: Object.values(ranking).sort((a, b) => b.facturacion - a.facturacion) }
  }, [trabajos, productos])

  return (
    <Card title="Reportes Semanales" id="reportes">
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--dark)' }}>
          <p className="text-xs text-[#7eb8ad]">Trabajos finalizados (7 días)</p>
          <p className="text-2xl font-bold text-[var(--teal)]">{reporte.finalizados}</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--dark)' }}>
          <p className="text-xs text-[#7eb8ad]">Facturación estimada</p>
          <p className="text-2xl font-bold text-white">${reporte.facturacion.toLocaleString('es-CL')}</p>
        </div>
      </div>
      {reporte.ranking.length === 0 ? <p className="text-sm text-[#5a8a82]">Sin cierres en la última semana.</p> : (
        <ol className="space-y-2">
          {reporte.ranking.map((r, i) => {
            const tecnicoAsignado = tecnicos.find(tc => tc.id === r.id)
            const nombreTecnico = r.id === 'sin_asignar' ? 'Sin Asignar' : (tecnicoAsignado?.nombre ?? 'Técnico Desconocido')

            return (
              <li key={r.id} className="flex items-center justify-between rounded-xl border border-[#0f4a44] p-3" style={{ backgroundColor: 'var(--dark)' }}>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                    style={{ backgroundColor: i === 0 ? 'var(--teal)' : 'var(--card)', color: i === 0 ? 'var(--bg)' : '#a8d4cc' }}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-white">{nombreTecnico}</p>
                    <p className="text-xs text-[#7eb8ad]">{r.trabajos} trabajo(s)</p>
                  </div>
                </div>
                <p className="font-semibold text-[var(--teal)]">${r.facturacion.toLocaleString('es-CL')}</p>
              </li>
            )
          })}
        </ol>
      )}
    </Card>
  )
}

const SECCIONES = [
  { id: 'mesa', label: 'Mesa de Control', icon: '📡' },
  { id: 'catalogo', label: 'Catálogo Dinámico', icon: '🛒' },
  { id: 'abonados', label: 'Abonados Activos', icon: '👥' },
  { id: 'reportes', label: 'Reportes Semanales', icon: '📊' },
]

export default function AdminDashboard() {
  const { user, setUser, productos, abonados, trabajos, alertasSOS, tecnicos,
    agregarTrabajo, actualizarTrabajo, archivarTrabajo, desactivarAlerta,
    agregarProducto, editarProducto, eliminarProducto } = useCisven()
  const [seccionActiva, setSeccionActiva] = useState('mesa')
  const [menuAbierto, setMenuAbierto] = useState(false)

  const solicitudesPendientes = useMemo(() => {
    return trabajos.filter(t =>
      (t.origen === 'agendamiento_cliente' || t.origen === 'cotizacion_cliente') &&
      t.estado === 'pendiente' && t.estado_cotizacion !== 'respondida'
    )
  }, [trabajos])

  const renderSeccion = () => {
    switch (seccionActiva) {
      case 'mesa': return <MesaControl trabajos={trabajos} abonados={abonados} productos={productos} tecnicos={tecnicos} agregarTrabajo={agregarTrabajo} actualizarTrabajo={actualizarTrabajo} archivarTrabajo={archivarTrabajo} />
      case 'catalogo': return <CatalogoEditable productos={productos} agregarProducto={agregarProducto} editarProducto={editarProducto} eliminarProducto={eliminarProducto} />
      case 'abonados': return <AbonadosActivos abonados={abonados} trabajos={trabajos} />
      case 'reportes': return <ReportesSemanales trabajos={trabajos} productos={productos} tecnicos={tecnicos} />
      default: return null
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg)' }}>
      <MarquesinaSOS alertas={alertasSOS} abonados={abonados} desactivarAlerta={desactivarAlerta} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside className="hidden md:flex flex-col w-56 border-r border-[#0f4a44] flex-shrink-0" style={{ backgroundColor: 'var(--dark)' }}>
          <div className="flex items-center gap-2 px-4 py-5 border-b border-[#0f4a44]">
            <CisvenLogo size={32} />
            <div>
              <p className="text-sm font-bold text-white">CISVEN</p>
              <p className="text-xs text-[#7eb8ad]">MESA DE CONTROL</p>
            </div>
          </div>
          <nav className="flex-1 py-4">
            {SECCIONES.map(s => (
              <button key={s.id} onClick={() => setSeccionActiva(s.id)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition"
                style={{
                  backgroundColor: seccionActiva === s.id ? 'var(--teal)' : 'transparent',
                  color: seccionActiva === s.id ? 'var(--bg)' : '#a8d4cc',
                  borderLeft: seccionActiva === s.id ? '3px solid var(--teal)' : '3px solid transparent'
                }}>
                <span>{s.icon}</span>
                <span>{s.label}</span>
                {s.id === 'abonados' && <span className="ml-auto rounded-full px-1.5 text-xs" style={{ backgroundColor: 'var(--teal)', color: 'var(--bg)' }}>{abonados.length}</span>}
                {s.id === 'mesa' && solicitudesPendientes.length > 0 && (
                  <span className="ml-auto rounded-full px-1.5 text-xs" style={{ backgroundColor: '#ef4444', color: 'white' }}>{solicitudesPendientes.length}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="border-t border-[#0f4a44] px-4 py-3">
            <p className="text-xs text-[#7eb8ad]">{user?.nombre}</p>
            <button onClick={() => setUser(null)} className="mt-1 text-xs text-[#5a8a82] hover:text-white">Cerrar sesión</button>
          </div>
          <button className="mx-3 mb-3 rounded-lg border border-[#0f4a44] py-2 text-xs text-[#7eb8ad] hover:border-[var(--teal)]">
            PANTALLA TÉCNICO TERRENO
          </button>
        </aside>

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#0f4a44]" style={{ backgroundColor: 'var(--dark)' }}>
            <div className="flex items-center gap-2">
              <CisvenLogo size={24} />
              <span className="text-sm font-bold text-white">CISVEN</span>
              {solicitudesPendientes.length > 0 && (
                <span className="rounded-full px-1.5 text-xs" style={{ backgroundColor: '#ef4444', color: 'white' }}>{solicitudesPendientes.length}</span>
              )}
            </div>
            <button onClick={() => setMenuAbierto(!menuAbierto)} className="text-white text-xl">☰</button>
          </div>
          {menuAbierto && (
            <div className="md:hidden border-b border-[#0f4a44]" style={{ backgroundColor: 'var(--dark)' }}>
              {SECCIONES.map(s => (
                <button key={s.id} onClick={() => { setSeccionActiva(s.id); setMenuAbierto(false) }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#a8d4cc]">
                  <span>{s.icon}</span>{s.label}
                </button>
              ))}
              <button onClick={() => setUser(null)} className="flex w-full px-4 py-3 text-sm text-red-300">Cerrar sesión</button>
            </div>
          )}
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
            <h1 className="mb-6 text-xl font-bold text-white">
              {SECCIONES.find(s => s.id === seccionActiva)?.label}
            </h1>
            {renderSeccion()}
          </main>
        </div>
      </div>
    </div>
  )
}