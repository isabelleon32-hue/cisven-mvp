const defaultSteps = [
  { id: 'profile', label: 'Perfil' },
  { id: 'services', label: 'Servicios' },
  { id: 'scope', label: 'Alcance' },
  { id: 'summary', label: 'Resumen' },
]

/**
 * Muestra el flujo de pasos del cotizador (solo presentación).
 * currentIndex: índice del paso resaltado (0-based).
 */
export default function StepIndicator({ steps = defaultSteps, currentIndex = 0 }) {
  return (
    <ol
      className="flex flex-wrap items-center gap-2 text-xs font-medium sm:gap-3 sm:text-sm"
      aria-label="Pasos del cotizador"
    >
      {steps.map((step, index) => {
        const isDone = index < currentIndex
        const isCurrent = index === currentIndex

        return (
          <li key={step.id} className="flex items-center gap-2 sm:gap-3">
            {index > 0 ? (
              <span
                className="hidden h-px w-4 bg-zinc-200 sm:block sm:w-6"
                aria-hidden
              />
            ) : null}
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${
                isCurrent
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-900'
                  : isDone
                    ? 'border-zinc-200 bg-white text-zinc-600'
                    : 'border-transparent bg-zinc-100/80 text-zinc-400'
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                  isCurrent
                    ? 'bg-indigo-600 text-white'
                    : isDone
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-200 text-zinc-500'
                }`}
              >
                {index + 1}
              </span>
              {step.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
