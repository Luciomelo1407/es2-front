'use client' //Não tire, vai parar de funcionar. 
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Plus, 
  Edit3, 
  UserPlus,
  Settings,
  Search
} from 'lucide-react';

const AdminDashboard = () => {
  const router = useRouter();

  /**
   * Array com as ações rápidas disponíveis no painel administrativo
   * Cada ação tem título, descrição, ícone e a rota correspondente
   */
  const quickActions = [
    {
      title: 'Cadastrar Usuário',
      description: 'Adicionar novo usuário ao sistema',
      icon: UserPlus,
      action: 'create-user',
      route: '/admin/cadastrar-usuario'
    },
    {
      title: 'Alterar Usuário',
      description: 'Editar informações de usuários existentes',
      icon: Edit3,
      action: 'edit-user',
      route: '/admin/buscar-usuario'
    },
    {
      title: 'Cadastrar Sala',
      description: 'Criar nova sala no sistema',
      icon: Plus,
      action: 'create-room',
      route: '/admin/cadastrar-sala'
    },
    {
      title: 'Alterar Sala',
      description: 'Modificar configurações das salas',
      icon: Settings,
      action: 'edit-room',
      route: '/admin/alterar-sala'
    }
  ];

  /**
   * Função para lidar com o clique nas ações do painel
   * Navega para a rota correspondente ou executa ação específica
   * @param {Object} action - Objeto da ação selecionada
   */
  const handleActionClick = (action) => {
    if (action.route) {
      console.log(`Navegando para: ${action.route}`);
      router.push(action.route);
    } else {
      console.log(`Ação: ${action.action}`);
      // Aqui podem ser implementadas outras ações futuras
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-2xl mb-6 shadow-lg">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-slate-600 text-lg">
            Sistema de Gestão Integrado
          </p>
        </div>

        {/* Action Cards */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl">
          <CardHeader className="pb-8 pt-12">
            <CardTitle className="text-center text-xl text-slate-700 font-medium">
              Selecione uma ação
            </CardTitle>
          </CardHeader>
          <CardContent className="px-12 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="h-28 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-all duration-200 hover:shadow-md group"
                    onClick={() => handleActionClick(action)}
                  >
                    <Icon className="h-8 w-8 text-slate-600 group-hover:text-emerald-600 mb-3 transition-colors" />
                    <span className="text-base font-medium text-slate-700 group-hover:text-emerald-700 text-center transition-colors mb-1">
                      {action.title}
                    </span>
                    <span className="text-xs text-slate-500 group-hover:text-emerald-600 text-center transition-colors">
                      {action.description}
                    </span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Status/Info Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Sistema Vacenf - Gestão de Imunobiológicos
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;