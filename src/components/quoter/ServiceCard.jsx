/**
 * Tarjeta visual para un servicio sugerido (sin lógica de selección).
 * Props: title, description, badge (texto corto opcional)
 */
export default function ServiceCard({ title, description, badge }) {
  return (
    <article className="group flex flex-col rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm transition hover:border-zinc-300 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
        {badge ? (
          <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-zinc-600">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="text-sm leading-relaxed text-zinc-500">{description}</p>
      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
        <span className="text-xs text-zinc-400">Incluido en cotización</span>
        <span className="text-xs font-medium text-indigo-600 opacity-0 transition group-hover:opacity-100">
          Ver detalle →
        </span>
      </div>
    </article>
  )
}
