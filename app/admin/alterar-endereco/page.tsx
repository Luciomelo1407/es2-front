'use client' // Diretiva necessária para componentes client-side no Next.js 13+
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MapPin, CheckCircle, User, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";

const AlterarUsuarioEndereco = () => {
  const { profissional, loading, error, retry } = useAuth();
  const router = useRouter();

  // Gerenciamento de estado para formulário de endereço
  // Implementado como objeto único para facilitar atualizações e validações
  const [dadosEndereco, setDadosEndereco] = useState({
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: ''
  });

  // Estados de controle de UI para feedback visual ao usuário
  const [finalizando, setFinalizando] = useState(false);
  const [alteracoesFinalizadas, setAlteracoesFinalizadas] = useState(false);

  // Lista estática de estados brasileiros
  // Mantida no componente por ser dados fixos e de pequeno volume
  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  /**
   * Carrega os dados de endereço existentes do usuário ao montar o componente
   * Utiliza localStorage como fonte de dados temporária durante o fluxo de edição
   */
  useEffect(() => {
    // Recuperação de dados do localStorage para manter persistência durante navegação
    const usuarioSalvo = localStorage.getItem('usuarioParaAlterar');
    if (usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);

      // Inicialização condicional baseada na existência de dados de endereço
      if (usuario.endereco) {
        setDadosEndereco(usuario.endereco);
      } else {
        // Estrutura padrão garantindo consistência de campos obrigatórios
        setDadosEndereco({
          cep: '',
          estado: '',
          cidade: '',
          bairro: '',
          rua: '',
          numero: '',
          complemento: ''
        });
      }
    }
  }, []);

  /**
   * Atualiza um campo específico do formulário de endereço
   * Implementa padrão de atualização imutável para React state
   */
  const handleInputChange = (campo, valor) => {
    setDadosEndereco(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  /**
   * Aplica formatação de máscara ao CEP (formato: 00000-000)
   * Remove caracteres não numéricos e adiciona hífen na posição correta
   */
  const formatarCEP = (cep) => {
    const apenasNumeros = cep.replace(/\D/g, '');
    if (apenasNumeros.length <= 5) {
      return apenasNumeros;
    }
    return `${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(5, 8)}`;
  };

  /**
   * Busca automaticamente dados de endereço baseado no CEP informado
   * Implementa simulação de API - em produção integraria com ViaCEP ou similar
   */
  const buscarEnderecoPorCEP = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');

    // Validação de CEP completo (8 dígitos) antes da requisição
    if (cepLimpo.length === 8) {
      try {
        // Simulação de delay de API para UX realista
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock de dados - substituir por integração real em produção
        const enderecoEncontrado = {
          estado: 'SP',
          cidade: 'São Paulo',
          bairro: 'Vila Madalena',
          rua: 'Rua Harmonia'
        };

        // Merge de dados mantendo campos já preenchidos pelo usuário
        setDadosEndereco(prev => ({
          ...prev,
          ...enderecoEncontrado
        }));
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        // Em produção, implementar tratamento de erro com feedback visual
      }
    }
  };

  /**
   * Gerencia mudanças no campo CEP com formatação e busca automática
   * Combina formatação de input e trigger de busca de endereço
   */
  const handleCEPChange = (valor) => {
    const cepFormatado = formatarCEP(valor);
    handleInputChange('cep', cepFormatado);

    // Trigger automático de busca quando CEP está completo (9 caracteres com hífen)
    if (cepFormatado.length === 9) {
      buscarEnderecoPorCEP(cepFormatado);
    }
  };

  /**
   * Processa a finalização das alterações de endereço
   * Implementa feedback visual e navegação automática após sucesso
   */
  const handleFinalizarAlteracoes = async () => {
    setFinalizando(true);

    try {
      // Simulação de chamada à API - substituir por endpoint real
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Endereço alterado:', dadosEndereco);

      // Transição de estado para tela de sucesso
      setAlteracoesFinalizadas(true);

      // Auto-redirecionamento com delay para permitir leitura da mensagem de sucesso
      setTimeout(() => {
        router.push('/admin');
      }, 2000);

    } catch (error) {
      console.error('Erro ao finalizar alterações:', error);
      // Feedback de erro simples - em produção usar toast/notification mais elaborado
      alert('Erro ao salvar alterações. Tente novamente.');
      setFinalizando(false);
    }
  };

  /**
   * Executa navegação de retorno para página anterior
   * Mantém o fluxo de navegação do processo de edição
   */
  const handleVoltar = () => {
    router.push('/admin/alterar-usuario');
  };

  // Validação de campos obrigatórios para habilitar botão de finalização
  // Implementada como computed value para reatividade automática
  const camposObrigatoriosPreenchidos = dadosEndereco.cep &&
    dadosEndereco.estado &&
    dadosEndereco.cidade &&
    dadosEndereco.bairro &&
    dadosEndereco.rua &&
    dadosEndereco.numero;

  // Renderização condicional da tela de sucesso
  // Separada do layout principal para experiência de usuário mais clara
  if (alteracoesFinalizadas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-6 shadow-lg">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Alterações Finalizadas!
          </h1>
          <p className="text-slate-600 text-lg mb-4">
            Os dados do usuário foram alterados com sucesso
          </p>
          <div className="text-sm text-slate-500">
            Redirecionando para o menu principal...
          </div>
        </div>
      </div>
    );
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 p-4">
      {/* Header com identificação do usuário e contexto da página */}
      <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
            <User className="h-5 w-5 text-white" />
          </div>
          <span className="text-slate-700 font-medium">Admin</span>
        </div>
        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
          alterar usuário
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Indicador de progresso do processo multi-etapas */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-sm text-slate-500">Progresso do formulário</span>
          <span className="text-sm text-slate-500">Etapa 2 de 2 - Endereço</span>
        </div>

        {/* Feedback visual de conclusão da etapa anterior */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
          <span className="text-green-700 text-sm">Dados pessoais alterados com sucesso</span>
        </div>

        {/* Formulário principal de endereço com design card elevado */}
        <div className="bg-emerald-500 rounded-3xl p-8 shadow-2xl">
          <div className="mb-8">
            <div className="flex items-center text-white mb-2">
              <MapPin className="h-6 w-6 mr-3" />
              <h2 className="text-2xl font-bold">Alterar Endereço:</h2>
            </div>
          </div>

          <div className="space-y-6">
            {/* Campo CEP com formatação automática e busca integrada */}
            <div className="space-y-2">
              <Label className="text-white font-medium">
                CEP: *
              </Label>
              <Input
                value={dadosEndereco.cep}
                onChange={(e) => handleCEPChange(e.target.value)}
                className="bg-white border-0 rounded-xl h-12 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-emerald-300"
                placeholder="00000-000"
                maxLength={9}
              />
            </div>

            {/* Seletor de estado com lista pré-definida */}
            <div className="space-y-2">
              <Label className="text-white font-medium">
                Estado: *
              </Label>
              <select
                value={dadosEndereco.estado}
                onChange={(e) => handleInputChange('estado', e.target.value)}
                className="w-full bg-white border-0 rounded-xl h-12 text-slate-700 px-3 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
              >
                <option value="">Selecione o estado</option>
                {estados.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>

            {/* Campos de texto padrão para dados de localização */}
            <div className="space-y-2">
              <Label className="text-white font-medium">
                Cidade: *
              </Label>
              <Input
                value={dadosEndereco.cidade}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
                className="bg-white border-0 rounded-xl h-12 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-emerald-300"
                placeholder="Digite a cidade"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white font-medium">
                Bairro: *
              </Label>
              <Input
                value={dadosEndereco.bairro}
                onChange={(e) => handleInputChange('bairro', e.target.value)}
                className="bg-white border-0 rounded-xl h-12 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-emerald-300"
                placeholder="Digite o bairro"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white font-medium">
                Rua: *
              </Label>
              <Input
                value={dadosEndereco.rua}
                onChange={(e) => handleInputChange('rua', e.target.value)}
                className="bg-white border-0 rounded-xl h-12 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-emerald-300"
                placeholder="Digite o nome da rua"
              />
            </div>

            {/* Campo número com largura reduzida para adequação visual */}
            <div className="space-y-2">
              <Label className="text-white font-medium">
                Número: *
              </Label>
              <Input
                value={dadosEndereco.numero}
                onChange={(e) => handleInputChange('numero', e.target.value)}
                className="bg-white border-0 rounded-xl h-12 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-emerald-300 w-32"
                placeholder="123"
              />
            </div>

            {/* Campo opcional para informações adicionais */}
            <div className="space-y-2">
              <Label className="text-white font-medium">
                Complemento:
              </Label>
              <Input
                value={dadosEndereco.complemento}
                onChange={(e) => handleInputChange('complemento', e.target.value)}
                className="bg-white border-0 rounded-xl h-12 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-emerald-300"
                placeholder="Apartamento, bloco, casa, etc. (opcional)"
              />
            </div>

            {/* Área de ações com navegação e submissão */}
            <div className="flex justify-between pt-8">
              <Button
                onClick={handleVoltar}
                disabled={finalizando}
                className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>

              {/* Botão de submissão com estados visuais e validação condicional */}
              <Button
                onClick={handleFinalizarAlteracoes}
                disabled={!camposObrigatoriosPreenchidos || finalizando}
                className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-medium disabled:opacity-50 transition-all duration-200"
              >
                {finalizando ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Finalizando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Finalizar Alterações
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

export default AlterarUsuarioEndereco;