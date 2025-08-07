import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Calendar, Users, FileText, DollarSign, TrendingUp, Clock } from 'lucide-react'

export function DashboardPage() {
  const stats = [
    {
      title: 'Consultas Hoje',
      value: '12',
      description: '+2 desde ontem',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Pacientes Ativos',
      value: '248',
      description: '+12 este mês',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 15.240',
      description: '+8% desde o mês passado',
      icon: DollarSign,
      color: 'text-purple-600'
    },
    {
      title: 'Taxa de Ocupação',
      value: '85%',
      description: '+5% desde a semana passada',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ]

  const recentAppointments = [
    { time: '09:00', patient: 'Maria Silva', type: 'Consulta' },
    { time: '10:30', patient: 'João Santos', type: 'Retorno' },
    { time: '14:00', patient: 'Ana Costa', type: 'Exame' },
    { time: '15:30', patient: 'Pedro Lima', type: 'Consulta' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral da sua clínica</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Consultas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Próximas Consultas</span>
            </CardTitle>
            <CardDescription>
              Agenda de hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.patient}</p>
                      <p className="text-sm text-gray-500">{appointment.type}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {appointment.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resumo Financeiro */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span>Resumo Financeiro</span>
            </CardTitle>
            <CardDescription>
              Últimos 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Receitas</span>
                <span className="font-semibold text-green-600">R$ 18.500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Despesas</span>
                <span className="font-semibold text-red-600">R$ 3.260</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Lucro Líquido</span>
                  <span className="font-bold text-green-600">R$ 15.240</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesso rápido às funcionalidades mais utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center">
              <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-blue-900">Nova Consulta</span>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center">
              <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-green-900">Novo Paciente</span>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center">
              <FileText className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-purple-900">Prontuário</span>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-center">
              <DollarSign className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-orange-900">Faturamento</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
