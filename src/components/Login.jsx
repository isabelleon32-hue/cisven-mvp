import { useState } from 'react'
import { useCisven, ROLES } from '../context/CisvenContext'
import CisvenLogo from './CisvenLogo'

const TABS = [
  { id: 'abonado', label: 'ABONADO', role: ROLES.CLIENTE },
  { id: 'tecnico', label: 'TÉCNICO', role: ROLES.TECNICO },
  { id: 'central', label: 'CENTRAL', role: ROLES.ADMIN },
]

function RoleTabs({ activeTab, onChange }) {
  return (
    <div
      className="grid grid-cols-3 gap-1 rounded-xl p-1"
      style={{ backgroundColor: 'var(--dark)' }}
    >
      {TABS.map((item) => {
        const isActive = activeTab === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className="rounded-lg px-2 py-2.5 text-xs font-semibold tracking-wide transition sm:px-3 sm:text-sm"
            style={{
              backgroundColor: isActive ? 'var(--teal)' : 'transparent',
              color: isActive ? 'var(--bg)' : '#a8d4cc',
            }}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export default function Login() {
  const { login } = useCisven()
  const [activeTab, setActiveTab] = useState('abonado')
  const [rut, setRut] = useState('11111111-1')
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setError('')
    setClave('')
    if (tabId === 'abonado') {
      setRut('11111111-1')
      setUsuario('')
    } else {
      setRut('')
      setUsuario(tabId === 'tecnico' ? 'tecnico1' : 'central')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const rol = TABS.find(t => t.id === activeTab)?.role
    const result = await login({ rol, rut, usuario, clave })

    if (result.error) setError(result.error)
    setLoading(false)
  }

  const inputClass = "w-full rounded-lg border border-[#0f4a44] bg-[var(--dark)] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-[#5a8a82] focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)]"

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <CisvenLogo size={48} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">CISVEN</h1>
          <p className="mt-1 text-sm text-[#7eb8ad]">Control integral de servicios</p>
        </header>

        <div
          className="rounded-2xl border border-[#0f4a44] p-6 shadow-xl sm:p-8"
          style={{ backgroundColor: 'var(--card)' }}
        >
          <RoleTabs activeTab={activeTab} onChange={handleTabChange} />

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {activeTab === 'abonado' ? (
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#b8e6dc]">RUT</label>
                <input
                  type="text"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  placeholder="11111111-1"
                  className={inputClass}
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#b8e6dc]">Usuario</label>
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder={activeTab === 'tecnico' ? 'tecnico1' : 'central'}
                  className={inputClass}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#b8e6dc]">Clave</label>
              <input
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            {error && (
              <p
                className="rounded-lg px-3 py-2 text-sm"
                style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#fca5a5' }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-3 text-sm font-semibold transition disabled:opacity-60"
              style={{ backgroundColor: 'var(--teal)', color: 'var(--bg)' }}
            >
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>

            <p className="text-center text-xs text-[#5a8a82]">
              {activeTab === 'abonado' && 'Demo: RUT 11111111-1 · clave cisven2026'}
              {activeTab === 'tecnico' && 'Demo: usuario tecnico1 · clave cisven2026'}
              {activeTab === 'central' && 'Demo: usuario central · clave cisven2026'}
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}