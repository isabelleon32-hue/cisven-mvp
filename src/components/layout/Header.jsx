export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-zinc-50/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-sm font-semibold text-white">
            C
          </span>
          <span className="text-sm font-semibold tracking-tight text-zinc-900">
            CISVEN
          </span>
        </a>

        <nav
          className="hidden items-center gap-8 text-sm font-medium text-zinc-500 sm:flex"
          aria-label="Principal"
        >
          <span className="text-zinc-900">Smart Quoter</span>
          <span className="cursor-default opacity-40">Soluciones</span>
          <span className="cursor-default opacity-40">Contacto</span>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-zinc-400 sm:inline">
            Vista previa UI
          </span>
        </div>
      </div>
    </header>
  )
}
