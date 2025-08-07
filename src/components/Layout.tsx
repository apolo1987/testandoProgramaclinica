import { useState } from 'react'
import { Outlet, useNavigate, useLocation, Routes, Route } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { Button } from './ui/button'
import { DashboardPage } from '../pages/DashboardPage'
import { Calendar, Users, FileText, DollarSign, Settings, LogOut, Menu, X, Home } from 'lucide-react'

export function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Agenda', path: '/dashboard/agenda' },
    { icon: Users, label: 'Pacientes', path: '/dashboard/pacientes' },
    { icon: FileText, label: 'Prontuários', path: '/dashboard/prontuarios' },
    { icon: DollarSign, label: 'Financeiro', path: '/dashboard/financeiro' },
    { icon: Settings, label: 'Configurações', path: '/dashboard/configuracoes' },
  ]

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut()
    }
    navigate('/')
  }

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/'
    }
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ClinicaOS</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ClinicaOS</span>
            </div>
            <div className="w-6"></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route index element={<DashboardPage />} />
            <Route path="agenda" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Agenda</h2><p className="text-gray-600 mt-2">Funcionalidade em desenvolvimento</p></div>} />
            <Route path="pacientes" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Pacientes</h2><p className="text-gray-600 mt-2">Funcionalidade em desenvolvimento</p></div>} />
            <Route path="prontuarios" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Prontuários</h2><p className="text-gray-600 mt-2">Funcionalidade em desenvolvimento</p></div>} />
            <Route path="financeiro" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Financeiro</h2><p className="text-gray-600 mt-2">Funcionalidade em desenvolvimento</p></div>} />
            <Route path="configuracoes" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Configurações</h2><p className="text-gray-600 mt-2">Funcionalidade em desenvolvimento</p></div>} />
          </Routes>
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
