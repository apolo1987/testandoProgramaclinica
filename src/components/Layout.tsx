// src/components/Layout.tsx

import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { Button } from './ui/button'
import { DashboardPage } from '../pages/DashboardPage'
import { SettingsPage } from '../pages/SettingsPage'
// 1. Ícones que faltavam foram adicionados aqui
import { Calendar, Users, FileText, DollarSign, Settings, LogOut, Menu, X, Home, Hospital, Stethoscope, Warehouse } from 'lucide-react' 

// Importe seus outros componentes de gerenciamento aqui
import { Scheduler } from './Scheduler'
import { PatientCRM } from './PatientCRM'
import { RoomManager } from './RoomManager'
import { DoctorManager } from './DoctorManager'
import { InventoryManager } from './InventoryManager'
import { FinancialManager } from './FinancialManager'

export function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Agenda', path: '/dashboard/agenda' },
    { icon: Users, label: 'Pacientes', path: '/dashboard/pacientes' },
    { icon: Hospital, label: 'Salas', path: '/dashboard/salas' }, // Agora o ícone 'Hospital' existe
    { icon: Stethoscope, label: 'Médicos', path: '/dashboard/medicos' }, // Agora o ícone 'Stethoscope' existe
    { icon: Warehouse, label: 'Estoque', path: '/dashboard/estoque' }, // Agora o ícone 'Warehouse' existe
    { icon: DollarSign, label: 'Financeiro', path: '/dashboard/financeiro' },
    { icon: Settings, label: 'Configurações', path: '/dashboard/configuracoes' },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex dark:bg-slate-900">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 dark:bg-slate-800 dark:border-r dark:border-slate-700`}>

        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">ClinicaOS</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-400" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </Button>
        </div>
      </div>

      <div className="flex-1 lg:ml-0">
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center justify-between h-16 px-4">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">ClinicaOS</span>
            </div>
            <div className="w-6"></div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Routes>
            <Route index element={<DashboardPage />} />
            <Route path="agenda" element={<Scheduler />} />
            <Route path="pacientes" element={<PatientCRM />} />
            <Route path="salas" element={<RoomManager />} />
            <Route path="medicos" element={<DoctorManager />} />
            <Route path="estoque" element={<InventoryManager />} />
            <Route path="financeiro" element={<FinancialManager />} />
            <Route path="configuracoes" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}