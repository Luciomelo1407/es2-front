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
  Search,
  AlertCircle
} from 'lucide-react';

import { LogOut } from "lucide-react"
import { useAuth } from "@/hooks/useAuth";

/**
 * Componente principal do painel administrativo
 * Renderiza uma interface centralizada com ações rápidas para gerenciamento do sistema
 * Permite navegação para páginas de cadastro e edição de usuários e salas
 */
const AdminDashboard = () => {
  const { profissional, loading, error, retry } = useAuth();
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

  function voltarLogin() {
    router.push("login");
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-red-200 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Acesso Negado
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={retry}
              className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Tentar Novamente
            </button>
            <button
              onClick={() => router.push("/login")}
              className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Ir para Login
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Redirecionando automaticamente em alguns segundos...
          </p>
        </div>
      </main>
    );
  }
  
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
          <div className="flex justify-center mt-8">
            <Button
              className="
                bg-white-50 
                text-green-600 
                text-lg
                border border-grey-200 
                px-8 py-6 
                rounded-xl 
                shadow-sm 
                font-medium
                hover:bg-green-100 
                hover:text-green-700
                transition-colors 
                duration-300
              "
              onClick={voltarLogin}
            >
              Sair
              <LogOut className=" h-5 w-5" />
            </Button>
          </div>
          
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