import { useState } from "react";
import { Link } from "react-router-dom";

const AdminDashboard = ({ catalog, setCatalog, alerts }) => {
  const [editMode, setEditMode] = useState(null);

  const updatePrice = (key, newPrice) => {
    setCatalog({
      ...catalog,
      [key]: { ...catalog[key], price: parseInt(newPrice) }
    });
    setEditMode(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex">
      
      {/* Sidebar Admin */}
      <div className="w-64 bg-[#004aad] text-white p-6 hidden lg:block">
        <h2 className="text-2xl font-black mb-10 tracking-tighter">
          CISVEN <span className="text-yellow-400">ADMIN</span>
        </h2>

        <nav className="space-y-4">
          <div className="p-3 bg-white/10 rounded-lg font-bold">📊 Dashboard</div>
          <div className="p-3 hover:bg-white/5 rounded-lg cursor-pointer">📦 Productos/Precios</div>
          <div className="p-3 hover:bg-white/5 rounded-lg cursor-pointer">👷 Gestión Técnicos</div>
          <div className="p-3 hover:bg-white/5 rounded-lg cursor-pointer">📝 Contratos</div>
        </nav>

        <div className="mt-auto pt-80">
          <Link to="/" className="text-xs opacity-50 hover:opacity-100">
            ← Volver a Vista Cliente
          </Link>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Panel de Control Central
          </h1>

          <div className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-bold text-green-600 border border-green-100">
            ● Servidor de Monitoreo Activo
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* GESTIÓN DE PRECIOS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              
              <h3 className="text-lg font-bold text-[#004aad] mb-6 flex items-center gap-2">
                📦 Control de Catálogo y Valores
              </h3>

              <div className="space-y-4">
                {Object.keys(catalog).map((key) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    
                    <div>
                      <p className="font-bold text-gray-700">
                        {catalog[key].label}
                      </p>
                      <p className="text-xs text-gray-400">
                        {catalog[key].desc}
                      </p>
                    </div>

                    <div className="text-right">
                      {editMode === key ? (
                        <input
                          type="number"
                          className="w-24 p-1 border rounded text-sm"
                          defaultValue={catalog[key].price}
                          onBlur={(e) => updatePrice(key, e.target.value)}
                        />
                      ) : (
                        <p
                          className="text-lg font-black text-[#004aad] cursor-pointer"
                          onClick={() => setEditMode(key)}
                        >
                          ${catalog[key].price.toLocaleString("es-CL")}
                        </p>
                      )}

                      <p className="text-[10px] text-gray-400 uppercase font-bold">
                        Clic para editar
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ALERTAS */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              
              <h3 className="text-lg font-bold text-red-600 mb-6 flex items-center gap-2">
                🚨 Alertas S.O.S Entrantes
              </h3>

              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 bg-red-50 rounded-2xl border border-red-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">
                        {alert.status}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold">
                        {alert.time}
                      </span>
                    </div>

                    <p className="text-sm font-bold text-gray-800">
                      {alert.user}
                    </p>

                    <p className="text-xs text-gray-600 italic">
                      "{alert.issue}"
                    </p>

                    <button className="w-full mt-3 bg-red-600 text-white text-[10px] py-2 rounded-lg font-bold uppercase">
                      Asignar Técnico
                    </button>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;