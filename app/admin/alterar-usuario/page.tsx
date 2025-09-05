'use client' // Diretiva necessária para componentes client-side no Next.js 13+
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, CheckCircle, Edit3 , AlertCircle} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";

const AlterarUsuarioDados = () => {
  const { profissional, loading, error, retry } = useAuth();
  const router = useRouter();
  
  // Estado principal do formulário estruturado para facilitar validações e atualizações
  // Inclui todos os campos necessários para edição de dados pessoais
  const [dadosUsuario, setDadosUsuario] = useState({
    nomeCompleto: '',
    coren: '',
    ocupacao: '',
    email: '',
    senha: '',
    dataNascimento: '',
    cpf: ''
  });

  // Estado de controle para feedback visual durante operações assíncronas
  const [salvando, setSalvando] = useState(false);

  /**
   * Carrega dados do usuário selecionado ao montar o componente
   * Utiliza localStorage como persistência temporária durante o fluxo de edição
   */
  useEffect(() => {
    // Recuperação de dados do localStorage para continuidade do processo de edição
    const usuarioSalvo = localStorage.getItem('usuarioParaAlterar');
    if (usuarioSalvo) {
      const usuarioSelecionado = JSON.parse(usuarioSalvo);
      
      // Inicialização com dados existentes, mantendo senha vazia por segurança
      setDadosUsuario({
        nomeCompleto: usuarioSelecionado.nomeCompleto || '',
        coren: usuarioSelecionado.coren || '',
        ocupacao: usuarioSelecionado.ocupacao || '',
        email: usuarioSelecionado.email || '',
        senha: '', // Campo senha sempre inicia vazio por motivos de segurança
        dataNascimento: usuarioSelecionado.dataNascimento || '',
        cpf: usuarioSelecionado.cpf || ''
      });
    }
  }, []);

  /**
   * Atualiza campos específicos do formulário mantendo imutabilidade do estado
   * Implementa padrão genérico reutilizável para qualquer campo do formulário
   */
  const handleInputChange = (campo, valor) => {
    setDadosUsuario(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  /**
   * Processa salvamento dos dados pessoais e navega para próxima etapa
   * Implementa validação, feedback visual e persistência para continuidade do fluxo
   */
  const handleProsseguirParaEndereco = async () => {
    setSalvando(true);
    
    try {
      // Simulação de chamada à API com delay realista para UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Dados pessoais salvos:', dadosUsuario);
      
      // Persistência no localStorage para manter dados entre navegações
      localStorage.setItem('dadosUsuarioAlterados', JSON.stringify(dadosUsuario));
      
      // Navegação para próxima etapa do processo multi-step
      router.push('/admin/alterar-endereco');
      
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      // Feedback de erro simples - em produção usar toast/notification system
      alert('Erro ao salvar alterações. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  /**
   * Executa navegação de retorno para página de busca de usuários
   * Mantém consistência no fluxo de navegação do sistema
   */
  const handleVoltar = () => {
    router.push('/admin/buscar-usuario');
  };

  // Validação reativa de campos obrigatórios para controle do botão de submit
  // Implementada como computed value para reatividade automática
  const todosObrigatoriosPreenchidos = dadosUsuario.nomeCompleto && 
    dadosUsuario.coren && 
    dadosUsuario.ocupacao && 
    dadosUsuario.email && 
    dadosUsuario.dataNascimento && 
    dadosUsuario.cpf;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header centralizado com branding do sistema */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-2xl mb-6 shadow-lg">
            <Edit3 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Alterar Dados de Usuário
          </h1>
          <p className="text-slate-600 text-lg">
            Sistema de Gestão de Imunobiológicos
          </p>
        </div>

        {/* Indicador de progresso para processo multi-etapas */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-sm text-slate-500">Progresso do formulário</span>
          <span className="text-sm text-slate-500">Etapa 1 de 2 - Dados Pessoais</span>
        </div>

        {/* Card principal do formulário com design elevado */}
        <div className="bg-emerald-500 rounded-3xl p-8 shadow-2xl">
          <div className="mb-6">
            <div className="flex items-center text-white mb-2">
              <Edit3 className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-semibold">Alterar dados do usuário</h2>
            </div>
            <p className="text-emerald-100 text-sm">
              Modifique os campos que deseja alterar
            </p>
          </div>

          <div className="space-y-6">
            {/* Campo nome completo com ícone contextual */}
            <div className="space-y-2">
              <Label className="text-white font-medium flex items-center">
                <User className="h-4 w-4 mr-2" />
                Nome completo *
              </Label>
              <Input
                value={dadosUsuario.nomeCompleto}
                onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                className="bg-white border-0 rounded-xl h-12 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-emerald-300"
                placeholder="Ex: João da Silva Santos"
              />
            </div>

            {/* Campo COREN com identificação profissional */}
            <div className="space-y-2">
              <Label className="text-white font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                COREN *
              </Label>
              <Input
                value={dadosUsuario.coren}
                onChange={(e) => handleInputChange('coren', e.target.value)}
                className="bg-white border-0 rounded-xl h-12 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-emerald-300"
                placeholder="Ex: COREN-SP 123456"
              />
            </div>

            {/* Seletor de ocupação com opções pré-definidas */}
            <div className="space-y-2">
              <Label className="text-white font-medium flex items-center">
                <User className="h-4 w-4 mr-2" />
                Ocupação *
              </Label>
              <select
                value={dadosUsuario.ocupacao}
                onChange={(e) => handleInputChange('ocupacao', e.target.value)}
                className="w-full bg-white border-0 rounded-xl h-12 text-slate-700 px-3 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
              >
                <option value="">Selecione a ocupação</option>
                <option value="Enfermeiro">Enfermeiro</option>
                <option value="Técnico de Enfermagem">Técnico de Enfermagem</option>
                <option value="Auxiliar de Enfermagem">Auxiliar de Enfermagem</option>
              </select>
            </div>

            {/* Campo email com validação de tipo */}
            <div className="space-y-2">
              <Label className="text-white font-medium">
                Email *
              </Label>
              <Input
                type="email"
                value={dadosUsuario.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-white border-0 rounded-xl h-12 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-emerald-300"
                placeholder="Ex: joao@email.com"
              />
            </div>

            {/* Campo senha opcional com placeholder informativo */}
            <div className="space-y-2">
              <Label className="text-white font-medium">
                Nova Senha
              </Label>
              <Input
                type="password"
                value={dadosUsuario.senha}
                onChange={(e) => handleInputChange('senha', e.target.value)}
                className="bg-white border-0 rounded-xl h-12 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-emerald-300"
                placeholder="Deixe em branco para manter a senha atual"
              />
            </div>

            {/* Layout responsivo para campos relacionados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white font-medium">
                  Data de nascimento *
                </Label>
                <Input
                  type="date"
                  value={dadosUsuario.dataNascimento}
                  onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                  className="bg-white border-0 rounded-xl h-12 text-slate-700 focus:ring-2 focus:ring-emerald-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white font-medium">
                  CPF *
                </Label>
                <Input
                  value={dadosUsuario.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  className="bg-white border-0 rounded-xl h-12 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-emerald-300"
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
            </div>

            {/* Feedback visual durante operação de salvamento */}
            {salvando && (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-xl flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Salvando dados pessoais...
              </div>
            )}

            {/* Área de ações com navegação e progressão */}
            <div className="flex justify-between pt-6">
              <Button
                onClick={handleVoltar}
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-emerald-500 px-6 py-3 rounded-xl font-medium transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>

              {/* Botão de progressão com validação condicional e estados visuais */}
              <Button
                onClick={handleProsseguirParaEndereco}
                disabled={!todosObrigatoriosPreenchidos || salvando}
                className="bg-white text-emerald-500 hover:bg-emerald-50 px-8 py-3 rounded-xl font-medium disabled:opacity-50 shadow-lg transition-all duration-200"
              >
                {salvando ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500 mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    Próximo - Endereço
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlterarUsuarioDados;