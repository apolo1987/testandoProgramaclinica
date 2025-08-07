import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Calendar, Users, FileText, DollarSign, Shield, Clock } from 'lucide-react'

export function WelcomePage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Calendar,
      title: 'Agendamento Inteligente',
      description: 'Sistema completo de agendamento com calendário interativo e notificações automáticas.'
    },
    {
      icon: Users,
      title: 'Gestão de Pacientes',
      description: 'CRM completo para gerenciar informações, histórico médico e comunicação com pacientes.'
    },
    {
      icon: FileText,
      title: 'Prontuário Eletrônico',
      description: 'Prontuários digitais seguros com histórico completo e fácil acesso às informações.'
    },
    {
      icon: DollarSign,
      title: 'Controle Financeiro',
      description: 'Gestão completa de receitas, despesas e relatórios financeiros detalhados.'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Dados protegidos com criptografia avançada e conformidade com LGPD.'
    },
    {
      icon: Clock,
      title: 'Disponível 24/7',
      description: 'Acesse sua clínica de qualquer lugar, a qualquer hora, em qualquer dispositivo.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ClinicaOS</span>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Entrar
              </Button>
              <Button onClick={() => navigate('/register')}>
                Cadastrar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Gerencie sua clínica com
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {' '}inteligência
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Sistema completo de gestão clínica com agendamento, prontuário eletrônico, 
              controle financeiro e muito mais. Simplifique sua rotina e foque no que realmente importa: seus pacientes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-3"
                onClick={() => navigate('/login')}
              >
                Começar Agora
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-3"
                onClick={() => navigate('/register')}
              >
                Criar Conta Grátis
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tudo que sua clínica precisa
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Uma plataforma completa com todas as ferramentas necessárias para modernizar e otimizar sua clínica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
            <CardContent className="py-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto para transformar sua clínica?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Junte-se a centenas de profissionais que já modernizaram sua gestão clínica.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8 py-3"
                onClick={() => navigate('/register')}
              >
                Começar Gratuitamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">ClinicaOS</span>
          </div>
          <p className="text-gray-400">
            © 2024 ClinicaOS. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
