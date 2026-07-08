import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import bcryptjs from 'bcryptjs'
import { supabase } from '../lib/supabase'

export const ROLES = {
  ADMIN: 'admin',
  TECNICO: 'tecnico',
  CLIENTE: 'cliente',
}

export const CisvenContext = createContext(null)

export function CisvenProvider({ children }) {
  const [user, setUser] = useState(null)
  const [productos, setProductos] = useState([])
  const [abonados, setAbonados] = useState([])
  const [trabajos, setTrabajos] = useState([])
  const [alertasSOS, setAlertasSOS] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [loading, setLoading] = useState(true)

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    try {
      const [prodRes, aboRes, trabRes, sosRes, tecRes] = await Promise.all([
        supabase.from('productos').select('*').eq('activo', true),
        supabase.from('abonados').select('*'),
        supabase.from('trabajos').select('*').order('created_at', { ascending: false }),
        supabase.from('alertas_sos').select('*').eq('activa', true),
        supabase.from('usuarios').select('*').eq('rol', 'tecnico'),
      ])
      if (prodRes.data) setProductos(prodRes.data)
      if (aboRes.data) setAbonados(aboRes.data)
      if (trabRes.data) setTrabajos(trabRes.data)
      if (sosRes.data) setAlertasSOS(sosRes.data)
      if (tecRes.data) setTecnicos(tecRes.data)
    } catch (err) {
      console.error('Error cargando datos:', err)
    } finally {
      setLoading(false)
    }
  }

  // LOGIN — con bcrypt para verificar contraseñas
  const login = useCallback(async ({ rol, rut, usuario, clave }) => {
    if (rol === ROLES.CLIENTE) {
      const { data, error } = await supabase
        .from('abonados')
        .select('*')
        .eq('rut', rut.replace(/\./g, '').toUpperCase())
        .single()
      if (error || !data) return { error: 'RUT no registrado' }

      // Verificar contraseña con bcrypt (si existe hash)
      if (data.clave_hash) {
        const esValida = await bcryptjs.compare(clave, data.clave_hash)
        if (!esValida) return { error: 'Clave incorrecta' }
      } else {
        // Fallback MVP: clave temporal
        if (clave !== 'cisven2026') return { error: 'Clave incorrecta' }
      }

      setUser({ role: ROLES.CLIENTE, ...data })
      return { ok: true }
    }

    // Admin/Técnico
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('usuario', usuario)
      .eq('rol', rol)
      .single()
    if (error || !data) return { error: 'Usuario no encontrado' }

    // Verificar contraseña con bcrypt
    const esValida = await bcryptjs.compare(clave, data.clave_hash)
    if (!esValida) return { error: 'Clave incorrecta' }

    setUser({ role: data.rol, ...data })
    return { ok: true }
  }, [])

  // REGISTRO CLIENTE — Flujo: email → código → contraseña
  const solicitarRegistroCliente = useCallback(async ({ email }) => {
    // Buscar cliente por email
    const { data: cliente, error: errCliente } = await supabase
      .from('abonados')
      .select('*')
      .eq('email', email)
      .single()

    if (errCliente || !cliente) {
      return { error: 'Email no registrado en nuestro sistema' }
    }

    // Generar código aleatorio 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString()

    // Guardar código en tabla temporal (crear si no existe)
    const { error: errCodigo } = await supabase
      .from('codigos_registro')
      .insert({
        email,
        codigo,
        cliente_id: cliente.id,
        expira_en: new Date(Date.now() + 15 * 60000).toISOString(), // 15 min
        usado: false,
      })

    if (errCodigo) return { error: 'Error enviando código' }

    // En MVP: mostrar código en consola (producción: enviar por email)
    console.log(`[MVP] Código para ${email}: ${codigo}`)

    return { ok: true, mensaje: 'Código enviado a tu email' }
  }, [])

  const verificarCodigoRegistro = useCallback(async ({ email, codigo }) => {
    const { data, error } = await supabase
      .from('codigos_registro')
      .select('*')
      .eq('email', email)
      .eq('codigo', codigo)
      .eq('usado', false)
      .single()

    if (error || !data) {
      return { error: 'Código inválido o expirado' }
    }

    // Validar que no haya expirado
    if (new Date(data.expira_en) < new Date()) {
      return { error: 'Código expirado' }
    }

    return { ok: true, clienteId: data.cliente_id }
  }, [])

  const crearContraseñaCliente = useCallback(async ({ email, codigo, nuevaClave }) => {
    // Verificar código primero
    const { ok: esValido, clienteId } = await verificarCodigoRegistro({ email, codigo })
    if (!esValido) return { error: 'Código inválido' }

    // Validar contraseña (mínimo 8 caracteres)
    if (!nuevaClave || nuevaClave.length < 8) {
      return { error: 'La contraseña debe tener al menos 8 caracteres' }
    }

    // Hashear contraseña con bcrypt (rounds = 10 es seguro)
    const claveHasheada = await bcryptjs.hash(nuevaClave, 10)

    // Actualizar cliente con hash
    const { error: errUpdate } = await supabase
      .from('abonados')
      .update({ clave_hash: claveHasheada })
      .eq('id', clienteId)

    if (errUpdate) return { error: 'Error creando contraseña' }

    // Marcar código como usado
    const { error: errMarcado } = await supabase
      .from('codigos_registro')
      .update({ usado: true })
      .eq('email', email)
      .eq('codigo', codigo)

    if (errMarcado) console.warn('Error marcando código como usado:', errMarcado)

    return { ok: true, mensaje: 'Contraseña creada. Ahora puedes iniciar sesión.' }
  }, [verificarCodigoRegistro])

  // PRODUCTOS
  const agregarProducto = useCallback(async (prod) => {
    const { data, error } = await supabase.from('productos').insert(prod).select().single()
    if (!error && data) setProductos(prev => [...prev, data])
    return { data, error }
  }, [])

  const editarProducto = useCallback(async (id, cambios) => {
    const { data, error } = await supabase.from('productos').update(cambios).eq('id', id).select().single()
    if (!error && data) setProductos(prev => prev.map(p => p.id === id ? data : p))
    return { data, error }
  }, [])

  const eliminarProducto = useCallback(async (id) => {
    const { error } = await supabase.from('productos').update({ activo: false }).eq('id', id)
    if (!error) setProductos(prev => prev.filter(p => p.id !== id))
    return { error }
  }, [])

  // TRABAJOS
  const agregarTrabajo = useCallback(async (trabajo) => {
    const { data, error } = await supabase.from('trabajos').insert({
      ...trabajo,
      estado: 'pendiente',
    }).select().single()
    if (!error && data) setTrabajos(prev => [data, ...prev])
    return { data, error }
  }, [])

  const finalizarTrabajo = useCallback(async (trabajoId, observaciones = '') => {
    const { data, error } = await supabase.from('trabajos').update({
      estado: 'finalizado',
      observaciones,
      fecha_fin: new Date().toISOString(),
    }).eq('id', trabajoId).select().single()
    if (!error && data) setTrabajos(prev => prev.map(t => t.id === trabajoId ? data : t))
    return { data, error }
  }, [])

  const archivarTrabajo = useCallback(async (trabajoId) => {
    const { error } = await supabase.from('trabajos').update({ estado: 'archivado' }).eq('id', trabajoId)
    if (!error) setTrabajos(prev => prev.filter(t => t.id !== trabajoId))
    return { error }
  }, [])

  const actualizarTrabajo = useCallback(async (id, cambios) => {
    const { data, error } = await supabase.from('trabajos').update(cambios).eq('id', id).select().single()
    if (!error && data) setTrabajos(prev => prev.map(t => t.id === id ? data : t))
    return { data, error }
  }, [])

  // SOS
  const dispararSOS = useCallback(async ({ abonado_id, mensaje }) => {
    const { data, error } = await supabase.from('alertas_sos').insert({
      abonado_id,
      mensaje,
      activa: true,
    }).select().single()
    if (!error && data) setAlertasSOS(prev => [...prev, data])
    return { data, error }
  }, [])

  const desactivarAlerta = useCallback(async (alertaId) => {
    const { error } = await supabase.from('alertas_sos').update({ activa: false }).eq('id', alertaId)
    if (!error) setAlertasSOS(prev => prev.filter(a => a.id !== alertaId))
    return { error }
  }, [])

  const value = useMemo(() => ({
    user, setUser,
    loading,
    productos, setProductos,
    abonados, setAbonados,
    trabajos, setTrabajos,
    alertasSOS,
    tecnicos,
    login,
    solicitarRegistroCliente, verificarCodigoRegistro, crearContraseñaCliente,
    agregarProducto, editarProducto, eliminarProducto,
    agregarTrabajo, finalizarTrabajo, archivarTrabajo, actualizarTrabajo,
    dispararSOS, desactivarAlerta,
    cargarDatos,
  }), [
    user, loading, productos, abonados, trabajos, alertasSOS, tecnicos,
    login, solicitarRegistroCliente, verificarCodigoRegistro, crearContraseñaCliente,
    agregarProducto, editarProducto, eliminarProducto,
    agregarTrabajo, finalizarTrabajo, archivarTrabajo, actualizarTrabajo,
    dispararSOS, desactivarAlerta,
  ])

  return (
    <CisvenContext.Provider value={value}>
      {children}
    </CisvenContext.Provider>
  )
}

export function useCisven() {
  const ctx = useContext(CisvenContext)
  if (!ctx) throw new Error('useCisven debe usarse dentro de CisvenProvider')
  return ctx
}