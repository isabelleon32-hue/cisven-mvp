import React from 'react'
import { useCisven } from './context/CisvenContext'
import Login from './components/Login'
import AdminDashboard from './components/AdminDashboard'
import TecnicoDashboard from './components/TecnicoDashboard'
import ClienteDashboard from './components/ClienteDashboard'

export default function App() {
  const { user } = useCisven()
  if (!user) return <Login />

  if (user.role === 'admin') return <AdminDashboard />
  if (user.role === 'tecnico') return <TecnicoDashboard />
  if (user.role === 'cliente') return <ClienteDashboard />

  return <Login />
}
