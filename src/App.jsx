import React, { useState, useEffect } from 'react';

// Componentes del Núcleo Operativo
import Login from './components/auth/Login';
import AdminDashboard from './components/AdminDashboard';
import TechnicianApp from './components/TechnicianApp';

// Tus Layouts Estructurales Nativos (Restaurados al 100%)
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

  // Sincronización Inmediata de Datos
  useEffect(() => { localStorage.setItem('cisven_catalog', JSON.stringify(cameraCatalog)); }, [cameraCatalog]);
  useEffect(() => { localStorage.setItem('cisven_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('cisven_quotes', JSON.stringify(quotes)); }, [quotes]);
  useEffect(() => { localStorage.setItem('cisven_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('cisven_blocked_dates', JSON.stringify(blockedDates)); }, [blockedDates]);
  useEffect(() => { localStorage.setItem('cisven_analytics', JSON.stringify(analytics)); }, [analytics]);

  // ==========================================
  // PROCESADORES COMERCIALES Y OPERATIVOS
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

  // Sincronización estricta del cierre técnico hacia la central
  const handleUpdateTechReport = (id, reportText, usedHardware, meters) => {
    setAppointments(prevApps => prevApps.map(item => 
      item.id === id ? { ...item, status: 'Revisión Técnico', techObservation: reportText, meters: meters } : item
    ));
  };

  // ARCHIVADO Y CIERRE FINAL DE ORDEN EN CENTRAL (REPARADO Y BLINDADO)
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
                detail: finalObservation || 'Instalación completada sin novedades.' 
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
  // MANEJADORES DE INTERFAZ Y SESIÓN
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
    <div className="min-h-screen bg-[#042120] w-full text-white">
      {view === 'landing' && (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}

      {/* CONSOLA CENTRAL ADMINISTRATIVA (Pantalla completa Nativa) */}
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

      {/* CONSOLA OPERATIVA DEL TÉCNICO (Mobile Responsivo Nativo) */}
      {view === 'tecnico-app' && userSession?.role === 'tech' && (
        <TechnicianApp 
          setView={handleLogout} 
          appointments={appointments} 
          onUpdateTechReport={handleUpdateTechReport} 
        />
      )}

      {/* ENTORNO CLIENTE / COTIZADOR INTELIGENTE (Visión Original Restaurada de Extremo a Extremo) */}
      {view === 'client-quoter' && userSession?.role === 'client' && (
        <MainLayout onLogout={handleLogout}>
          <SmartQuoter catalog={cameraCatalog} onSendQuote={handleSendQuote} />
        </MainLayout>
      )}
    </div>
  );
}