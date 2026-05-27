import React, { useState } from 'react';
import Login from './components/auth/Login';
import AdminDashboard from './components/AdminDashboard';
import TechnicianApp from './components/TechnicianApp';
import MainLayout from './components/layout/MainLayout';
import SmartQuoter from './components/quoter/SmartQuoter';

export default function App() {
  const [view, setView] = useState('landing');
  const [userSession, setUserSession] = useState(null);
  const [quotes, setQuotes] = useState([]); // Aquí vive el flujo de datos
  const [users, setUsers] = useState([{ name: 'Isabel León', rut: '123', role: 'client' }]);

  const handleSendQuote = (data) => {
    setQuotes([data, ...quotes]);
    alert("Cotización recibida en la Central");
  };

  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
  };

  return (
    <div className="min-h-screen bg-[#021312]">
      {view === 'landing' && <Login onLoginSuccess={(s) => { setUserSession(s); setView(s.role === 'admin' ? 'admin' : 'client'); }} />}
      
      {view === 'admin' && (
        <AdminDashboard 
          quotes={quotes} 
          users={users} 
          onAddUser={handleAddUser}
          onLogout={() => setView('landing')} 
        />
      )}

      {view === 'client' && (
        <MainLayout onLogout={() => setView('landing')}>
          <SmartQuoter currentUser={userSession} onSendQuote={handleSendQuote} />
        </MainLayout>
      )}
    </div>
  );
}