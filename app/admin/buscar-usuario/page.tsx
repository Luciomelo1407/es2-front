'use client' //Não tire, vai parar de funcionar. 
'use client' //Não tire, vai parar de funcionar. 
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Search, User, Users, Edit3, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AlterarUsuarioBusca = () => {
  const router = useRouter();
  
  /**
   * Estado para armazenar os filtros de busca
   * Permite buscar usuários por nome e/ou COREN
   */
  const [filtros, setFiltros] = useState({
    nome: '',
    coren: ''
  });

  /**
   * Estado para armazenar os resultados da busca
   * Lista de usuários encontrados conforme os filtros aplicados
   */
  const [resultadoBusca, setResultadoBusca] = useState([]);

  /**
   * Estado para controlar se uma busca foi realizada
   * Usado para mostrar/ocultar a seção de resultados
   */
  const [buscaRealizada, setBuscaRealizada] = useState(false);

  /**
   * Estado para controlar o loading durante a busca
   * Mostra indicador de carregamento enquanto pesquisa
   */
  const [carregandoBusca, setCarregandoBusca] = useState(false);

  /**
   * Dados simulados de usuários para demonstração
   * Em produção, estes dados viriam de uma API/banco de dados
   */
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
   * Função para atualizar os campos de filtro
   * @param {string} campo - Nome do campo a ser atualizado
   * @param {string} valor - Novo valor para o campo
   */
  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  /**
   * Função para realizar a busca de usuários
   * Filtra usuários baseado nos critérios informados (nome e/ou COREN)
   */
  const handleBuscarUsuarios = async () => {
    setCarregandoBusca(true);
    
    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let resultados = usuariosMock;
      
      // Filtrar por nome se informado
      if (filtros.nome.trim()) {
        resultados = resultados.filter(usuario =>
          usuario.nomeCompleto.toLowerCase().includes(filtros.nome.toLowerCase())
        );
      }
      
      // Filtrar por COREN se informado
      if (filtros.coren.trim()) {
        resultados = resultados.filter(usuario =>
          usuario.coren.toLowerCase().includes(filtros.coren.toLowerCase())
        );
      }
      
      setResultadoBusca(resultados);
      setBuscaRealizada(true);
      
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      alert('Erro ao buscar usuários. Tente novamente.');
    } finally {
      setCarregandoBusca(false);
    }
  };

  /**
   * Função para selecionar um usuário e prosseguir para edição
   * Salva os dados do usuário selecionado e navega para a tela de edição
   * @param {Object} usuario - Dados do usuário selecionado
   */
  const handleSelecionarUsuario = (usuario) => {
    console.log('Usuário selecionado para alteração:', usuario);
    
    // Salva os dados do usuário no localStorage para edição
    localStorage.setItem('usuarioParaAlterar', JSON.stringify(usuario));
    
    // Navega para a tela de edição de dados pessoais
    router.push('/admin/alterar-usuario');
  };

  /**
   * Função para voltar ao menu principal do admin
   * Retorna à página inicial do painel administrativo
   */
  const handleVoltar = () => {
    router.push('/admin');
  };

  /**
   * Função para limpar os filtros e resultados
   * Reseta o formulário de busca para o estado inicial
   */
  const handleLimparFiltros = () => {
    setFiltros({ nome: '', coren: '' });
    setResultadoBusca([]);
    setBuscaRealizada(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
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

        {/* Search Card */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl mb-8">
          <CardHeader className="pb-6 pt-8">
            <CardTitle className="text-center text-xl text-slate-700 font-medium flex items-center justify-center">
              <Users className="h-6 w-6 mr-2" />
              Filtrar usuário
            </CardTitle>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <div className="space-y-6">
              {/* Nome */}
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

              {/* COREN */}
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

              {/* Botões de Ação */}
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

        {/* Resultados da Busca */}
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
                <div className="space-y-4">
                  {resultadoBusca.map((usuario) => (
                    <div
                      key={usuario.id}
                      onClick={() => handleSelecionarUsuario(usuario)}
                      className="flex items-center p-6 bg-slate-50 hover:bg-emerald-50 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-md border border-slate-200 hover:border-emerald-200 group"
                    >
                      <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mr-4 group-hover:bg-emerald-600 transition-colors">
                        <User className="h-6 w-6 text-white" />
                      </div>
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

        {/* Botão Voltar */}
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