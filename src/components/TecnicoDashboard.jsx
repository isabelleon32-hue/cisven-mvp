import { useMemo, useState } from 'react'
import { useCisven } from '../context/CisvenContext.jsx'
import CisvenLogo from './CisvenLogo.jsx'

export default function TecnicoDashboard() {
  const { user, setUser, abonados, trabajos, tecnicos, finalizarTrabajo, actualizarTrabajo } = useCisven()
  const [seleccionado, setSeleccionado] = useState(null)
  const [observaciones, setObservaciones] = useState('')
  const [msg, setMsg] = useState('')

  const trabajosAsignados = useMemo(() => {
    if (!user?.id) return []
    return trabajos.filter(t => t.tecnico_id === user.id && t.estado !== 'finalizado' && t.estado !== 'archivado')
  }, [trabajos, user?.id])

  const trabajoActivo = trabajos.find(t => t.id === seleccionado)
  const abonado = abonado => abonados.find(a => a.id === abonado)

  const handleSeleccionar = async (id) => {
    setSeleccionado(id)
    setObservaciones('')
    setMsg('')
    const t = trabajos.find(t => t.id === id)
    if (t?.estado === 'pendiente') {
      await actualizarTrabajo(id, { estado: 'en_curso' })
    }
  }

  const handleFinalizar = async () => {
    if (!observaciones.trim()) { setMsg('Ingresa observaciones antes de cerrar.'); return }
    const { error } = await finalizarTrabajo(seleccionado, observaciones)
    if (error) { setMsg('Error al finalizar.'); return }
    setMsg('✅ Trabajo finalizado.')
    setSeleccionado(null)
    setObservaciones('')
  }

  const estadoBadge = (estado) => {
    const map = {
      pendiente: { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', label: 'Pendiente' },
      en_curso: { bg: 'rgba(0,194,146,0.15)', color: 'var(--teal)', label: 'En curso' },
      finalizado: { bg: 'rgba(134,239,172,0.15)', color: '#86efac', label: 'Finalizado' },
    }
    return map[estado] ?? { bg: 'var(--dark)', color: '#a8d4cc', label: estado }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="mx-auto px-4 py-6" style={{ maxWidth: 480 }}>

        {/* Header */}
        <header className="mb-6 rounded-2xl border border-[#0f4a44] p-4" style={{ backgroundColor: 'var(--dark)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CisvenLogo size={28} />
              <div>
                <p className="text-sm font-bold tracking-wide" style={{ color: 'var(--teal)' }}>CISVEN TERRENO</p>
                <p className="text-xs text-[#7eb8ad]">RUTA OPERATIVA SANTIAGO</p>
              </div>
            </div>
            <button onClick={() => setUser(null)} className="text-xs text-[#5a8a82] hover:text-white">Salir</button>
          </div>
          <div className="flex items-center justify-between">
            <span className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: 'rgba(0,194,146,0.15)', color: 'var(--teal)', border: '1px solid var(--teal)' }}>
              ▲ {user?.nombre?.toUpperCase()} (MÓVIL 1)
            </span>
            <span className="text-xs text-[#7eb8ad]">
              {new Date().toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'long' })}
            </span>
          </div>
        </header>

        {/* Trabajos asignados */}
        <section className="mb-6 rounded-2xl border border-[#0f4a44] p-5" style={{ backgroundColor: 'var(--card)' }}>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Trabajos asignados ({trabajosAsignados.length})
          </h2>

          {trabajosAsignados.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-[#a8d4cc]">No tienes trabajos asignados.</p>
              <p className="mt-1 text-xs text-[#5a8a82]">El admin debe asignarte órdenes desde Mesa de Control.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {trabajosAsignados.map(t => {
                const ab = abonados.find(a => a.id === t.abonado_id)
                const badge = estadoBadge(t.estado)
                const activo = seleccionado === t.id
                return (
                  <button key={t.id} onClick={() => handleSeleccionar(t.id)}
                    className="w-full rounded-xl border p-4 text-left transition"
                    style={{
                      backgroundColor: activo ? 'var(--dark)' : 'var(--card)',
                      borderColor: activo ? 'var(--teal)' : '#0f4a44',
                    }}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-semibold text-white">{t.tipo}</p>
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-medium flex-shrink-0"
                        style={{ backgroundColor: badge.bg, color: badge.color }}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#a8d4cc] mb-1">
                      📅 {t.fecha ?? 'Sin fecha'} {t.hora ? `· ⏰ ${t.hora}` : '· ⏰ Hora por confirmar'}
                    </p>
                    {ab && (
                      <>
                        <p className="text-sm font-medium text-white mt-2">ABONADO RECINTO</p>
                        <p className="text-sm text-white font-bold">{ab.nombre}</p>
                        <p className="text-xs text-[#7eb8ad]">📍 {ab.direccion}</p>
                        <p className="text-xs" style={{ color: 'var(--teal)' }}>📞 {ab.telefono}</p>
                      </>
                    )}
                    <div className="mt-2 rounded-lg px-3 py-1.5 text-xs text-[#a8d4cc]"
                      style={{ backgroundColor: 'var(--bg)' }}>
                      Tarea: <span className="font-semibold text-white">*{t.tipo}*</span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </section>

        {/* Panel de cierre */}
        {trabajoActivo && trabajoActivo.estado !== 'finalizado' && (
          <section className="mb-6 rounded-2xl border border-[#0f4a44] p-5" style={{ backgroundColor: 'var(--card)' }}>
            <h2 className="mb-3 text-lg font-semibold text-white">Cierre en terreno</h2>
            <p className="mb-4 text-sm text-[#a8d4cc]">
              Registra observaciones para <span className="font-semibold text-white">{trabajoActivo.tipo}</span>
            </p>
            <textarea
              rows={4}
              value={observaciones}
              onChange={e => setObservaciones(e.target.value)}
              placeholder="Describe el trabajo realizado, materiales usados, estado del sitio..."
              className="w-full resize-y rounded-lg border border-[#0f4a44] bg-[var(--dark)] px-3 py-2.5 text-sm text-white outline-none placeholder:text-[#5a8a82] focus:border-[var(--teal)]"
            />
            {msg && (
              <p className="mt-2 text-sm" style={{ color: msg.includes('✅') ? 'var(--teal)' : '#fca5a5' }}>{msg}</p>
            )}
            <button onClick={handleFinalizar}
              className="mt-4 w-full rounded-xl py-4 text-sm font-bold tracking-wide transition hover:opacity-90"
              style={{ backgroundColor: 'var(--teal)', color: 'var(--bg)' }}>
              MARCAR COMO COMPLETADO / CERRAR TICKET
            </button>
          </section>
        )}

        {/* Link admin */}
        <div className="text-center">
          <button onClick={() => setUser(null)} className="text-xs text-[#5a8a82] hover:text-white">
            ← REGRESAR PANEL ADMIN
          </button>
        </div>

      </div>
    </div>
  )
}