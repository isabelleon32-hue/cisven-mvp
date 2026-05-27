import React, { useState, useEffect } from 'react';

// Importación de componentes modulares y pantallas operativas
import Login from './components/auth/Login';
import AdminDashboard from './components/AdminDashboard';
import TechnicianApp from './components/TechnicianApp';

// Importación de tus layouts estructurales nativos
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
      { id: 1, name: 'Isabel Cristina León', rut: '1-9', address: 'Av. Américo Vespucio 1500, Maipú', phone: '+56976543210', contract: 'Monitoreo Residencial Pro AI', installedHardware: '4x Cámaras Domo 1080p / 1x Grabador NVR', status: 'Activo', historyLog: [] }
    ];
  });
  
  const [quotes, setQuotes] = useState(() => JSON.parse(localStorage.getItem('cisven_quotes')) || []);
  const [appointments, setAppointments] = useState(() => JSON.parse(localStorage.getItem('cisven_appointments')) || []);
  const [blockedDates, setBlockedDates] = useState(() => JSON.parse(localStorage.getItem('cisven_blocked_dates')) || []);
  
  const [analytics, setAnalytics] = useState(() => JSON.parse(localStorage.getItem('cisven_analytics')) || { 
    totalRevenue: 0, 
    closedTicketsCount: 0, 
    totalMeters: 0, 
    techPerformance: {}, 
    customerSpend: {} 
  });

  // Sincronización de Persistencia de Datos
  useEffect(() => { localStorage.setItem('cisven_catalog', JSON.stringify(cameraCatalog)); }, [cameraCatalog]);
  useEffect(() => { localStorage.setItem('cisven_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('cisven_quotes', JSON.stringify(quotes)); }, [quotes]);
  useEffect(() => { localStorage.setItem('cisven_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('cisven_blocked_dates', JSON.stringify(blockedDates)); }, [blockedDates]);
  useEffect(() => { localStorage.setItem('cisven_analytics', JSON.stringify(analytics)); }, [analytics]);

  // ==========================================
  // MANEJADORES DE LOGICA CENTRAL
  // ==========================================
  const handleAddProduct = (label, price, stock) => {
    setCameraCatalog([...cameraCatalog, { id: Date.now(), label, price, stock }]);
  };

  const handleDeleteProduct = (id) => {
    setCameraCatalog(cameraCatalog.filter(item => item.id !== id));
  };

  const handleSendQuote = (user, type, cam, total, address, mtrs, clientPhone) => {
    const phoneToInject = clientPhone || users.find(u => u.name === user)?.phone || '+56976543210';
    const tomorrowStr = new Date(); tomorrowStr.setDate(tomorrowStr.getDate() + 1);
    const dateStr = tomorrowStr.toISOString().split('T')[0];
    setQuotes([{ id: Date.now(), user, type, cam, total, address, meters: mtrs, phone: phoneToInject, status: 'Pendiente', date: dateStr }, ...quotes]);
  };

  const handleAdjustQuote = (id, price, note) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, status: 'Respondido', adjustedTotal: price, adminNote: note } : q));
  };

  const handleManualSchedule = (name, service, date, address, phone) => {
    setAppointments([{ id: Date.now(), user: name, service, date, address, phone, technician: 'Sin Asignar', status: 'Asignado', techObservation: '', price: 45000, meters: 15 }, ...appointments]);
  };

  const handleToggleBlockDate = (dateString) => {
    if (blockedDates.includes(dateString)) { setBlockedDates(blockedDates.filter(d => d !== dateString)); } 
    else { setBlockedDates([...blockedDates, dateString]); }
  };

  const handleAssignTech = (id, technicianName) => {
    setAppointments(appointments.map(item => item.id === id ? { ...item, technician: technicianName } : item));
  };

  const handleConfirmDispatch = (id) => {
    setAppointments(appointments.map(item => item.id === id ? { ...item, status: 'En Ruta' } : item));
  };

  const handleApproveQuote = (quoteObject) => {
    const approvedJob = {
      id: Date.now(),
      user: quoteObject.user,
      service: quoteObject.cam.length > 30 ? quoteObject.cam.substring(0, 27) + '...' : quoteObject.cam,
      date: quoteObject.date,
      address: quoteObject.address,
      phone: quoteObject.phone || '+56976543210', 
      technician: 'Sin Asignar', status: 'Asignado', techObservation: '',
      price: quoteObject.adjustedTotal || quoteObject.total,
      meters: quoteObject.meters || 15
    };
    setAppointments([approvedJob, ...appointments]);
    setQuotes(quotes.filter(q => q.id !== quoteObject.id));
  };

  const handleUpdateTechReport = (id, reportText, usedHardware, meters) => {
    setAppointments(appointments.map(item => 
      item.id === id ? { ...item, status: 'Revisión Técnico', techObservation: reportText, meters: meters } : item
    ));
  };

  const handleAdminArchiveJob = (id, userName, technicianName, finalObservation, serviceName, ticketPrice, ticketMeters) => {
    setAppointments(prevApps => prevApps.filter(j => j.id !== id));
    
    setUsers(prevUsers => prevUsers.map(u => 
      u.name === userName 
        ? { 
            ...u, 
            historyLog: [
              { 
                id: Date.now(), 
                date: new Date().toLocaleDateString('es-CL'), 
                type: serviceName || 'Servicio Técnico', 
                technician: technicianName || 'Técnico CISVEN', 
                detail: finalObservation || 'Trabajo cerrado sin incidencias.' 
              }, 
              ...(u.historyLog || [])
            ] 
          } 
        : u
    ));

    setAnalytics(prev => {
      const safePrice = parseInt(ticketPrice) || 0;
      const safeMeters = parseInt(ticketMeters) || 0;
      const safeTech = technicianName || 'Sin Asignar';
      const safeUser = userName || 'Abonado General';

      return {
        totalRevenue: (prev?.totalRevenue || 0) + safePrice,
        closedTicketsCount: (prev?.closedTicketsCount || 0) + 1,
        totalMeters: (prev?.totalMeters || 0) + safeMeters,
        techPerformance: { ...prev?.techPerformance, [safeTech]: (prev?.techPerformance?.[safeTech] || 0) + 1 },
        customerSpend: { ...prev?.customerSpend, [safeUser]: (prev?.customerSpend?.[safeUser] || 0) + safePrice }
      };
    });
  };

  // ==========================================
  // MANEJADORES DE ENRUTAMIENTO Y SESIÓN
  // ==========================================
  const handleLoginSuccess = (session) => {
    setUserSession(session);
    if (session.role === 'admin') setView('admin-ops');
    if (session.role === 'tech') setView('tecnico-app');
    if (session.role === 'client') setView('client-quoter');
  };

  const handleLogout = () => {
    setUserSession(null);
    setView('landing');
  };

  return (
    <div className="min-h-screen bg-[#042120] w-full text-white overflow-x-hidden">
      {view === 'landing' && (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}

      {/* PANEL ADMINISTRATIVO: Escalable en pantalla completa (PC y tablet) */}
      {view === 'admin-ops' && userSession?.role === 'admin' && (
        <AdminDashboard 
          setView={setView} catalog={cameraCatalog} 
          onAddProduct={handleAddProduct} onDeleteProduct={handleDeleteProduct}
          quotes={quotes} onAdjustQuote={handleAdjustQuote}
          appointments={appointments} onManualSchedule={handleManualSchedule}
          blockedDates={blockedDates} onToggleBlockDate={handleToggleBlockDate}
          users={users} onAssignTech={handleAssignTech} onConfirmDispatch={handleConfirmDispatch}
          onApproveQuote={handleApproveQuote} onArchiveJob={handleAdminArchiveJob}
          analytics={analytics}
        />
      )}

      {/* TERMINAL DEL TÉCNICO: Forzado a entorno Mobile nativo */}
      {view === 'tecnico-app' && userSession?.role === 'tech' && (
        <div className="min-h-screen bg-[#042120] flex justify-center items-start">
          <div className="w-full max-w-md min-h-screen bg-[#021312] shadow-2xl border-x border-teal-900/40">
            <TechnicianApp 
              setView={handleLogout} 
              appointments={appointments} 
              onUpdateTechReport={handleUpdateTechReport} 
            />
          </div>
        </div>
      )}

      {/* PORTAL DEL CLIENTE / ABONADO: Envuelto en su MainLayout Mobile nativo */}
      {view === 'client-quoter' && userSession?.role === 'client' && (
        <div className="min-h-screen bg-[#042120] flex justify-center items-start">
          <div className="w-full max-w-md min-h-screen shadow-2xl">
            <MainLayout onLogout={handleLogout}>
              <SmartQuoter catalog={cameraCatalog} onSendQuote={handleSendQuote} />
            </MainLayout>
          </div>
        </div>
      )}
    </div>
  );
}