import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* HERO */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-6">

        <h1 className="text-4xl font-black text-[#004aad]">
          CISVEN Smart Security
        </h1>

        <p className="text-gray-500 mt-4 max-w-md">
          Plataforma inteligente de seguridad con cotización automatizada,
          monitoreo en tiempo real y gestión técnica integrada.
        </p>

        <div className="flex gap-3 mt-8">
          <Link
            to="/cotizar"
            className="bg-[#004aad] text-white px-6 py-3 rounded-xl font-bold"
          >
            Ir al Cotizador
          </Link>

          <Link
            to="/admin"
            className="border border-[#004aad] text-[#004aad] px-6 py-3 rounded-xl font-bold"
          >
            Panel Admin
          </Link>
        </div>

      </div>

      {/* FOOTER SIMPLE */}
      <div className="text-center text-xs text-gray-400 p-6">
        CISVEN MVP © Sistema de Seguridad Inteligente
      </div>

    </div>
  );
}