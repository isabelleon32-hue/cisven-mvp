import React, { useState, useEffect } from 'react';

// Importación de componentes modulares y pantallas operativas
import Login from './components/auth/Login';
import AdminDashboard from './components/AdminDashboard';
import TechnicianApp from './components/TechnicianApp';

// Importación de layouts y componentes del cliente
import MainLayout from './components/layout/MainLayout';
import SmartQuoter from './components/quoter/SmartQuoter';

export default function App() {
  const [view, setView] = useState('landing');
  const [userSession, setUserSession] = useState(null);
  
  // ==========================================
  // ESTADOS GLOBALES (Persistidos en LocalStorage)
  // ==========================================
  const [cameraCatalog, setCameraCatalog] = useState(() => {
    const localCat = localStorage.getItem('cisven_catalog');
    return localCat ? JSON.parse(localCat) : [
      { id: 1, label: '720p Básica Estándar', price: 25000, stock: 45 }, 
      { id: 2, label: '1080p Domo Alta Def.', price: 45000, stock: 30 }, 
      { id: 3, label: '4K Profesional + AI', price: 95000, stock: 12 }
    ];
  });
  
  const [users, setUsers] = useState(() => {
    const local = localStorage.getItem('cisven_users');
    return local ? JSON.parse(local) : [
      { id: 1, name: 'Isabel Cristina León', rut: '1-9', address: 'Av. Américo Vespucio 1500, Maipú', phone: '+56976543210', contract: 'Monitoreo Residencial Pro AI', status: 'Activo' }
    ];
  });
  
  const [quotes, setQuotes] = useState(() => JSON.parse(localStorage.getItem('cisven_quotes')) || []);
  const [appointments, setAppointments] = useState(() => JSON.parse(localStorage.getItem('cisven_appointments')) || []);
  const [blockedDates, setBlockedDates] = useState(() => JSON.parse(localStorage.getItem('cisven_blocked_dates')) || []);
  const [analytics, setAnalytics] = useState(() => JSON.parse(localStorage.getItem('cisven_analytics')) || { 
    totalRevenue: 0, closedTicketsCount: 0, totalMeters: 0, techPerformance: {}, customerSpend: {} 
  });

  // Sincronización Automática de Datos
  useEffect(() => { localStorage.setItem('cisven_catalog', JSON.stringify(cameraCatalog)); }, [cameraCatalog]);
  useEffect(() => { localStorage.setItem('cisven_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('cisven_quotes', JSON.stringify(quotes)); }, [quotes]);
  useEffect(() => { localStorage.setItem('cisven_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('cisven_blocked_dates', JSON.stringify(blockedDates)); }, [blockedDates]);
  useEffect(() => { localStorage.setItem('cisven_analytics', JSON.stringify(analytics)); }, [analytics]);

  // ==========================================
  // MANEJADORES DE LÓGICA OPERATIVA
  // ==========================================
  const handleSendQuote = (user, type, cam, total, address, mtrs, clientPhone) => {
    const newQuote = { 
      id: Date.now(), user, type, cam, total, address, 
      meters: mtrs, phone: clientPhone, status: 'Pendiente', 
      date: new Date().toISOString().split('T')[0] 
    };
    setQuotes([newQuote, ...quotes]);
  };

  const handleAdjustQuote = (id, price, note) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, status: 'Respondido', adjustedTotal: price, adminNote: note } : q));
  };

  const handleManualSchedule = (name, service, date, address, phone) => {
    setAppointments([{ id: Date.now(), user: name, service, date, address, phone, technician: 'Sin Asignar', status: 'Asignado' }, ...appointments]);
  };

  const handleToggleBlockDate = (dateString) => {
    setBlockedDates(blockedDates.includes(dateString) ? blockedDates.filter(d => d !== dateString) : [...blockedDates, dateString]);
  };

  const handleAssignTech = (id, tech) => setAppointments(appointments.map(a => a.id === id ? { ...a, technician: tech } : a));
  const handleConfirmDispatch = (id) => setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'En Ruta' } : a));
  
  const handleApproveQuote = (qObj) => {
    const job = { id: Date.now(), user: qObj.user, service: qObj.cam, date: qObj.date, address: qObj.address, phone: qObj.phone, technician: 'Sin Asignar', status: 'Asignado', price: qObj.adjustedTotal || qObj.total };
    setAppointments([job, ...appointments]);
    setQuotes(quotes.filter(q => q.id !== qObj.id));
  };

  const handleUpdateTechReport = (id, text, meters) => setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'Revisión Técnico', techObservation: text, meters } : a));

  const handleAdminArchiveJob = (id, userName, techName, obs, service, price, meters) => {
    setAppointments(appointments.filter(j => j.id !== id));
    setAnalytics(prev => ({
      totalRevenue: prev.totalRevenue + (parseInt(price) || 0),
      closedTicketsCount: prev.closedTicketsCount + 1,
      totalMeters: prev.totalMeters + (parseInt(meters) || 0),
      techPerformance: { ...prev.techPerformance, [techName || 'Sin Asignar']: (prev.techPerformance[techName] || 0) + 1 }
    }));
  };

  const handleLoginSuccess = (session) => {
    setUserSession(session);
    if (session.role === 'admin') setView('admin-ops');
    else if (session.role === 'tech') setView('tecnico-app');
    else setView('client-quoter');
  };

  const handleLogout = () => { setUserSession(null); setView('landing'); };

  return (
    <div className="min-h-screen bg-[#042120] w-full text-white">
      {view === 'landing' && <Login onLoginSuccess={handleLoginSuccess} />}

      {view === 'admin-ops' && userSession?.role === 'admin' && (
        <AdminDashboard 
          setView={handleLogout} catalog={cameraCatalog} quotes={quotes} 
          onAdjustQuote={handleAdjustQuote} appointments={appointments} 
          onManualSchedule={handleManualSchedule} blockedDates={blockedDates} 
          onToggleBlockDate={handleToggleBlockDate} users={users} 
          onAssignTech={handleAssignTech} onConfirmDispatch={handleConfirmDispatch}
          onApproveQuote={handleApproveQuote} onArchiveJob={handleAdminArchiveJob}
          analytics={analytics}
        />
      )}

      {view === 'tecnico-app' && userSession?.role === 'tech' && (
        <TechnicianApp setView={handleLogout} appointments={appointments} onUpdateTechReport={handleUpdateTechReport} />
      )}

      {view === 'client-quoter' && (
        <MainLayout onLogout={handleLogout}>
          <SmartQuoter 
            catalog={cameraCatalog} currentUser={userSession} quotes={quotes}
            onSendQuote={handleSendQuote} onManualSchedule={handleManualSchedule}
          />
        </MainLayout>
      )}
    </div>
  );
}