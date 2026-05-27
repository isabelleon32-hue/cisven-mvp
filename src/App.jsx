import React, { useState } from 'react';
import Login from './components/auth/Login';
import AdminDashboard from './components/AdminDashboard';
import TechnicianApp from './components/TechnicianApp';
import MainLayout from './components/layout/MainLayout';
import SmartQuoter from './components/quoter/SmartQuoter';

export default function App() {
  // Estado único para la sesión: si es null, el usuario no ha entrado
  const [userSession, setUserSession] = useState(null);
  
  // Estados de datos (el "corazón" de tu aplicación)
  const [quotes, setQuotes] = useState([]);
  const [users, setUsers] = useState([{ name: 'Isabel León', rut: '123', role: 'client' }]);

  // Lógica de comunicación entre componentes
  const handleSendQuote = (data) => {
    setQuotes([data, ...quotes]);
    alert("Cotización recibida en la Central");
  };

  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
  };

  const handleLogout = () => {
    setUserSession(null);
  };

  // ==========================================
  // FLUJO DE ACCESO BLINDADO
  // ==========================================
  
  // 1. Si no hay sesión, siempre mostramos Login
  if (!userSession) {
    return <Login onLoginSuccess={(user) => setUserSession(user)} />;
  }

  // 2. Si hay sesión, renderizamos según el rol del usuario
  return (
    <div className="min-h-screen bg-[#021312]">
      {userSession.role === 'admin' ? (
        <AdminDashboard 
          quotes={quotes} 
          users={users} 
          onAddUser={handleAddUser}
          onLogout={handleLogout} 
        />
      ) : userSession.role === 'tech' ? (
        <TechnicianApp 
          onLogout={handleLogout} 
        />
      ) : (
        <MainLayout onLogout={handleLogout}>
          <SmartQuoter 
            currentUser={userSession} 
            onSendQuote={handleSendQuote} 
          />
        </MainLayout>
      )}
    </div>
  );
}