'use client' // Diretiva necessária para componentes client-side no Next.js 13+
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search,
  ArrowLeft,
  Building2,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

import { useAuth } from "@/hooks/useAuth";

const BuscarSala = () => {
  const { profissional, loading, error, retry } = useAuth();
  const router = useRouter();
  
  // Estado para controlar efeitos visuais de hover nos cards
  // Implementado para criar feedback interativo durante navegação
  const [hoveredRoom, setHoveredRoom] = useState(null);

  // Base de dados simulada para ambiente de desenvolvimento
  // Em produção seria substituída por chamadas à API ou estado global
  const existingRooms = [
    { id: 1, numero: '101', estoque: 'Estoque Principal', status: 'Ativa' },
    { id: 2, numero: 'A-15', estoque: 'Estoque Secundário', status: 'Ativa' },
    { id: 3, numero: 'Sala 1', estoque: 'Estoque Principal', status: 'Ativa' },
    { id: 4, numero: 'B-22', estoque: 'Estoque Auxiliar', status: 'Inativa' },
    { id: 5, numero: '205', estoque: 'Estoque Principal', status: 'Ativa' },
    { id: 6, numero: 'C-10', estoque: 'Estoque de Emergência', status: 'Ativa' }
  ];

  /**
   * Processa seleção de sala e navega para página de edição
   * Utiliza query parameters para manter referência da sala selecionada
   */
  const handleRoomSelect = (room) => {
    // Navegação com ID da sala via query parameter para preservar contexto
    router.push(`/admin/alterar-sala?id=${room.id}`);
  };

  /**
   * Executa navegação de retorno para menu principal
   * Mantém fluxo consistente de navegação do sistema administrativo
   */
  const handleVoltar = () => {
    router.push('/admin');
  };

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header com navegação e identificação do usuário */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoltar}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
            <span className="text-gray-700 font-medium">Admin</span>
          </div>
        </div>

        {/* Seção de título com contexto da funcionalidade */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
            <Search className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Buscar Sala
          </h1>
          <p className="text-gray-600">
            Selecione uma sala para alterar suas informações
          </p>
        </div>

        {/* Grid responsivo de salas com interatividade visual */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {existingRooms.map((room) => (
            <Card
              key={room.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-0 ${
                hoveredRoom === room.id 
                  ? 'shadow-lg ring-2 ring-emerald-500 bg-emerald-50' 
                  : 'shadow-sm bg-white hover:bg-gray-50'
              }`}
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
              onClick={() => handleRoomSelect(room)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Ícone com cores baseadas no status da sala */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      room.status === 'Ativa' ? 'bg-emerald-100' : 'bg-gray-100'
                    }`}>
                      <Building2 className={`h-5 w-5 ${
                        room.status === 'Ativa' ? 'text-emerald-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {room.numero}
                      </CardTitle>
                      {/* Badge de status com cores diferenciadas */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          room.status === 'Ativa' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {room.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Indicador visual de interação com animação */}
                  <ChevronRight className={`h-5 w-5 transition-all duration-200 ${
                    hoveredRoom === room.id ? 'text-emerald-600 translate-x-1' : 'text-gray-400'
                  }`} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Informações detalhadas da sala organizadas */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Estoque:</span>
                    <span className="font-medium text-gray-900">{room.estoque}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">ID:</span>
                    <span className="font-mono text-gray-600">#{room.id.toString().padStart(3, '0')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Estado vazio com ação de recuperação para o usuário */}
        {existingRooms.length === 0 && (
          <Card className="bg-white shadow-sm border-0 text-center py-12">
            <CardContent>
              <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma sala encontrada
              </h3>
              <p className="text-gray-600 mb-6">
                Não há salas cadastradas no sistema ainda.
              </p>
              <Button 
                onClick={() => router.push('/admin/cadastrar-sala')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Cadastrar Primeira Sala
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Footer com identificação do sistema */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Sistema Vacenf - Gestão de Imunobiológicos
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuscarSala;