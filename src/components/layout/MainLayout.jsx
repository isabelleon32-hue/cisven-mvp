import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function MainLayout({ children, onLogout }) {
  return (
    // Reemplazamos los contenedores rígidos por un layout de ancho completo (w-full) y sin límites
    <div className="min-h-screen bg-zinc-50 flex flex-col w-full antialiased font-sans">
      
      {/* Barra de navegación superior nativa */}
      <Header onLogout={onLogout} />

      {/* Área de contenido principal: eliminamos max-w-md y mx-auto para que el Cotizador o cualquier pantalla ocupe todo el espacio */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Pie de página nativo */}
      <Footer />
      
    </div>
  );
}