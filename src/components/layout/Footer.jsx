export default function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} CISVEN. Seguridad tecnológica.</p>
        <p className="text-xs text-zinc-400">
          Este MVP es solo interfaz; no se envían datos a ningún servidor.
        </p>
      </div>
    </footer>
  )
}
