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

/**
 * Componente principal do painel administrativo
 * Renderiza uma interface centralizada com ações rápidas para gerenciamento do sistema
 * Permite navegação para páginas de cadastro e edição de usuários e salas
 */
const AdminDashboard = () => {
  const router = useRouter();

  // Configuração das ações disponíveis no painel administrativo
  // Cada objeto define uma ação com suas propriedades visuais e comportamentais
  // A estrutura permite fácil manutenção e expansão de novas funcionalidades
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
      route: '/admin/buscar-sala'
    }
  ];

  /**
   * Gerencia o clique nas ações do painel administrativo
   * Executa navegação programática para rotas específicas ou ações customizadas
   * @param {Object} action - Objeto contendo informações da ação selecionada
   */
  const handleActionClick = (action) => {
    // Verifica se existe rota definida para navegação
    // Utiliza router.push para navegação client-side otimizada do Next.js
    if (action.route) {
      console.log(`Navegando para: ${action.route}`);
      router.push(action.route);
    } else {
      // Fallback para ações que não requerem navegação
      // Permite implementação futura de ações in-place
      console.log(`Ação: ${action.action}`);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Cabeçalho com identidade visual do sistema */}
        {/* Utiliza design centrado para criar hierarquia visual clara */}
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

        {/* Container principal das ações */}
        {/* Implementa glassmorphism com backdrop-blur para estética moderna */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl">
          <CardHeader className="pb-8 pt-12">
            <CardTitle className="text-center text-xl text-slate-700 font-medium">
              Selecione uma ação
            </CardTitle>
          </CardHeader>
          <CardContent className="px-12 pb-12">
            {/* Grid responsivo das ações */}
            {/* Utiliza CSS Grid para layout adaptável em diferentes telas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  // Botão de ação com design hover interativo
                  // Combina estados visuais para feedback imediato ao usuário
                  <Button
                    key={index}
                    variant="ghost"
                    className="h-28 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-all duration-200 hover:shadow-md group"
                    onClick={() => handleActionClick(action)}
                  >
                    {/* Ícone com transição de cor no hover */}
                    <Icon className="h-8 w-8 text-slate-600 group-hover:text-emerald-600 mb-3 transition-colors" />
                    {/* Título da ação */}
                    <span className="text-base font-medium text-slate-700 group-hover:text-emerald-700 text-center transition-colors mb-1">
                      {action.title}
                    </span>
                    {/* Descrição auxiliar */}
                    <span className="text-xs text-slate-500 group-hover:text-emerald-600 text-center transition-colors">
                      {action.description}
                    </span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Rodapé informativo do sistema */}
        {/* Fornece contexto sobre o domínio da aplicação */}
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