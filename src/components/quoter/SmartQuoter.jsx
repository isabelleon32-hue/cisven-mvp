import StepIndicator from './StepIndicator'
import ServiceCard from './ServiceCard'

function FieldShell({ label, hint }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-zinc-800">{label}</span>
        {hint ? (
          <span className="text-xs text-zinc-400">{hint}</span>
        ) : null}
      </div>
      <div className="h-10 rounded-lg border border-dashed border-zinc-200 bg-zinc-50/80" />
    </div>
  )
}

export default function SmartQuoter() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm">
          Smart Quoter
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Cotización inteligente para tu empresa
        </h1>
        <p className="mt-3 text-base leading-relaxed text-zinc-500">
          Estructura visual del flujo: perfil, servicios sugeridos y resumen.
          Más adelante conectarás campos reales y reglas de negocio.
        </p>
      </div>

      <div className="mb-10 overflow-x-auto rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm sm:p-6">
        <StepIndicator currentIndex={0} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
        <div className="space-y-8 lg:col-span-2">
          <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  Perfil de la organización
                </h2>
                <p className="text-sm text-zinc-500">
                  Placeholders visuales; sin validación ni envío.
                </p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <FieldShell label="Nombre de la empresa" hint="Ej. ACME S.A." />
              <FieldShell label="Sector" hint="Selección futura" />
              <FieldShell label="Tamaño aproximado" hint="Empleados / sedes" />
              <FieldShell label="Contacto" hint="Correo o teléfono" />
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-zinc-900">
                Servicios sugeridos
              </h2>
              <p className="text-sm text-zinc-500">
                Tarjetas reutilizables (`ServiceCard`) para mostrar paquetes.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ServiceCard
                title="Evaluación de madurez"
                description="Diagnóstico inicial de postura de seguridad y prioridades."
                badge="Consultoría"
              />
              <ServiceCard
                title="Monitoreo SOC ligero"
                description="Visibilidad centralizada de alertas para equipos pequeños."
                badge="Operación"
              />
              <ServiceCard
                title="Hardening de identidades"
                description="Buenas prácticas en accesos, MFA y revisión de cuentas."
                badge="Identidad"
              />
              <ServiceCard
                title="Plan de respuesta"
                description="Playbooks y contactos para incidentes de seguridad."
                badge="IR"
              />
            </div>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-20 space-y-6 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Resumen
              </h2>
              <p className="mt-1 text-xs text-zinc-400">
                Cifras de ejemplo; no calculan nada todavía.
              </p>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between text-zinc-600">
                <span>Evaluación de madurez</span>
                <span className="font-medium text-zinc-900">—</span>
              </li>
              <li className="flex justify-between text-zinc-600">
                <span>SOC ligero (12 meses)</span>
                <span className="font-medium text-zinc-900">—</span>
              </li>
              <li className="flex justify-between text-zinc-600">
                <span>Impuestos estimados</span>
                <span className="font-medium text-zinc-900">—</span>
              </li>
            </ul>
            <div className="border-t border-zinc-100 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-zinc-700">Total estimado</span>
                <span className="text-lg font-semibold text-zinc-900">—</span>
              </div>
            </div>
            <button
              type="button"
              className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            >
              Continuar (demo)
            </button>
            <p className="text-center text-[11px] text-zinc-400">
              El botón no hace nada aún; es solo diseño.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
