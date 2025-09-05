'use client' // Diretiva necessária para componentes client-side no Next.js 13+
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Search, User, Users, Edit3, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";

const AlterarUsuarioBusca = () => {
  const { profissional, loading, error, retry } = useAuth();
  const router = useRouter();
  
  // Estado para controlar critérios de filtragem da busca
  // Implementado como objeto para facilitar adição de novos filtros
  const [filtros, setFiltros] = useState({
    nome: '',
    coren: ''
  });

  // Estado para armazenar usuários encontrados na busca
  // Lista dinâmica baseada nos filtros aplicados
  const [resultadoBusca, setResultadoBusca] = useState([]);

  // Estado para controlar exibição da seção de resultados
  // Evita mostrar área vazia antes da primeira busca
  const [buscaRealizada, setBuscaRealizada] = useState(false);

  // Estado para feedback visual durante operações de busca
  // Melhora UX com indicador de carregamento
  const [carregandoBusca, setCarregandoBusca] = useState(false);

  // Base de dados simulada para desenvolvimento e demonstração
  // Em produção seria substituída por chamadas à API de usuários
  const usuariosMock = [
    {
      id: 1,
      nomeCompleto: 'Maria Silva Santos',
      coren: 'COREN-SP 123456',
      ocupacao: 'Enfermeiro',
      email: 'maria.silva@email.com',
      cpf: '123.456.789-00',
      dataNascimento: '1985-03-15',
      endereco: {
        cep: '01234-567',
        estado: 'SP',
        cidade: 'São Paulo',
        bairro: 'Centro',
        rua: 'Rua das Flores',
        numero: '123',
        complemento: 'Apto 45'
      }
    },
    {
      id: 2,
      nomeCompleto: 'João da Silva',
      coren: 'COREN-SP 654321',
      ocupacao: 'Auxiliar de Enfermagem',
      email: 'joao.silva@email.com',
      cpf: '987.654.321-00',
      dataNascimento: '1990-07-22',
      endereco: {
        cep: '04567-890',
        estado: 'SP',
        cidade: 'São Paulo',
        bairro: 'Vila Olímpia',
        rua: 'Rua dos Jardins',
        numero: '456',
        complemento: ''
      }
    },
    {
      id: 3,
      nomeCompleto: 'Ana Paula Costa',
      coren: 'COREN-RJ 789123',
      ocupacao: 'Técnico de Enfermagem',
      email: 'ana.costa@email.com',
      cpf: '456.789.123-00',
      dataNascimento: '1988-12-10',
      endereco: {
        cep: '22070-001',
        estado: 'RJ',
        cidade: 'Rio de Janeiro',
        bairro: 'Copacabana',
        rua: 'Avenida Atlântica',
        numero: '789',
        complemento: 'Cobertura'
      }
    }
  ];

  /**
   * Atualiza campos de filtro mantendo imutabilidade do estado
   * Implementa padrão genérico reutilizável para qualquer filtro
   */
  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  /**
   * Executa busca de usuários baseada nos filtros informados
   * Implementa busca combinada por nome e/ou COREN com simulação de API
   */
  const handleBuscarUsuarios = async () => {
    setCarregandoBusca(true);
    
    try {
      // Simulação de delay de API para UX realista
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let resultados = usuariosMock;
      
      // Aplicação de filtro por nome com busca case-insensitive
      if (filtros.nome.trim()) {
        resultados = resultados.filter(usuario =>
          usuario.nomeCompleto.toLowerCase().includes(filtros.nome.toLowerCase())
        );
      }
      
      // Aplicação de filtro por COREN com busca parcial
      if (filtros.coren.trim()) {
        resultados = resultados.filter(usuario =>
          usuario.coren.toLowerCase().includes(filtros.coren.toLowerCase())
        );
      }
      
      setResultadoBusca(resultados);
      setBuscaRealizada(true);
      
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      // Feedback de erro simples - em produção usar sistema de notificações
      alert('Erro ao buscar usuários. Tente novamente.');
    } finally {
      setCarregandoBusca(false);
    }
  };

  /**
   * Processa seleção de usuário e inicia fluxo de edição
   * Persiste dados no localStorage e navega para primeira etapa de edição
   */
  const handleSelecionarUsuario = (usuario) => {
    console.log('Usuário selecionado para alteração:', usuario);
    
    // Persistência temporária para manter dados durante navegação multi-etapas
    localStorage.setItem('usuarioParaAlterar', JSON.stringify(usuario));
    
    // Navegação para primeira etapa do processo de edição
    router.push('/admin/alterar-usuario');
  };

  /**
   * Executa navegação de retorno para menu administrativo
   * Mantém fluxo consistente de navegação do sistema
   */
  const handleVoltar = () => {
    router.push('/admin');
  };

  /**
   * Reseta formulário de busca para estado inicial
   * Limpa filtros e resultados para nova pesquisa
   */
  const handleLimparFiltros = () => {
    setFiltros({ nome: '', coren: '' });
    setResultadoBusca([]);
    setBuscaRealizada(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header com branding e contexto da funcionalidade */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-2xl mb-6 shadow-lg">
            <Search className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Buscar Usuário
          </h1>
          <p className="text-slate-600 text-lg">
            Encontre o usuário que deseja alterar
          </p>
        </div>

        {/* Card de busca com design glassmorphism */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl mb-8">
          <CardHeader className="pb-6 pt-8">
            <CardTitle className="text-center text-xl text-slate-700 font-medium flex items-center justify-center">
              <Users className="h-6 w-6 mr-2" />
              Filtrar usuário
            </CardTitle>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <div className="space-y-6">
              {/* Campo de busca por nome */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium text-sm">
                  Nome do usuário
                </Label>
                <Input
                  value={filtros.nome}
                  onChange={(e) => handleFiltroChange('nome', e.target.value)}
                  className="bg-white/70 border-2 border-slate-200 rounded-xl h-12 text-gray-700 placeholder-gray-400 focus:border-emerald-300 focus:ring-emerald-200 transition-all"
                  placeholder="Digite o nome do usuário"
                />
              </div>

              {/* Campo de busca por COREN */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium text-sm">
                  COREN
                </Label>
                <Input
                  value={filtros.coren}
                  onChange={(e) => handleFiltroChange('coren', e.target.value)}
                  className="bg-white/70 border-2 border-slate-200 rounded-xl h-12 text-gray-700 placeholder-gray-400 focus:border-emerald-300 focus:ring-emerald-200 transition-all"
                  placeholder="Ex: COREN-SP 123456"
                />
              </div>

              {/* Área de ações com validação condicional */}
              <div className="flex justify-center space-x-4 pt-4">
                <Button
                  onClick={handleBuscarUsuarios}
                  disabled={carregandoBusca || (!filtros.nome.trim() && !filtros.coren.trim())}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-medium disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {carregandoBusca ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Buscar Usuários
                    </>
                  )}
                </Button>
                
                {/* Botão de limpeza condicional baseado no estado */}
                {(filtros.nome || filtros.coren || buscaRealizada) && (
                  <Button
                    onClick={handleLimparFiltros}
                    variant="outline"
                    className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 rounded-xl font-medium transition-all duration-200"
                  >
                    Limpar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção de resultados renderizada condicionalmente */}
        {buscaRealizada && (
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl mb-8">
            <CardHeader className="pb-6 pt-8">
              <CardTitle className="text-center text-xl text-slate-700 font-medium flex items-center justify-center">
                <CheckCircle className="h-6 w-6 mr-2 text-emerald-500" />
                Resultados da busca
              </CardTitle>
            </CardHeader>
            
            <CardContent className="px-8 pb-8">
              {resultadoBusca.length === 0 ? (
                // Estado vazio com orientações para o usuário
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">
                    Nenhum usuário encontrado
                  </h3>
                  <p className="text-slate-500">
                    Tente ajustar os filtros de busca
                  </p>
                </div>
              ) : (
                // Lista de usuários com interatividade e feedback visual
                <div className="space-y-4">
                  {resultadoBusca.map((usuario) => (
                    <div
                      key={usuario.id}
                      onClick={() => handleSelecionarUsuario(usuario)}
                      className="flex items-center p-6 bg-slate-50 hover:bg-emerald-50 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-md border border-slate-200 hover:border-emerald-200 group"
                    >
                      {/* Avatar com feedback visual de grupo */}
                      <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mr-4 group-hover:bg-emerald-600 transition-colors">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      {/* Informações do usuário organizadas hierarquicamente */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800 group-hover:text-emerald-700 mb-1">
                          {usuario.nomeCompleto}
                        </h3>
                        <p className="text-slate-600 text-sm mb-1">
                          {usuario.coren} • {usuario.ocupacao}
                        </p>
                        <p className="text-slate-500 text-xs">
                          {usuario.email}
                        </p>
                      </div>
                      {/* Indicador de ação com feedback visual */}
                      <div className="flex items-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                        <Edit3 className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">Alterar</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Botão de navegação para retorno */}
        <div className="flex justify-center">
          <Button
            onClick={handleVoltar}
            variant="outline"
            className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlterarUsuarioBusca;