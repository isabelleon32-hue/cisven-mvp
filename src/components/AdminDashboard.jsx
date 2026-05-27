// En AdminDashboard.jsx
export default function AdminDashboard({ quotes }) {
    return (
      <div className="p-6">
        <h1 className="text-white text-2xl font-black mb-4">PANEL DE ADMINISTRACIÓN</h1>
        <div className="bg-[#0a3a37] p-4 rounded-lg">
          <h2 className="text-white font-bold mb-2">Solicitudes Recibidas:</h2>
          {quotes.length === 0 ? <p className="text-gray-400">Sin solicitudes...</p> : (
            <ul className="text-white">
              {quotes.map((q, i) => <li key={i} className="border-b py-2">{q.empresa} - {q.telefono}</li>)}
            </ul>
          )}
        </div>
      </div>
    );
  }