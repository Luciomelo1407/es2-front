'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, CheckCircle, User, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CriarSala = () => {
  const router = useRouter();
  
  // Estado principal para dados da sala utilizando objeto único
  // Decisão: centralização facilita validação e envio de dados
  const [dadosSala, setDadosSala] = useState({
    numeroSala: '',
    estoque: ''
  });

  // Estado para controle de loading durante operação assíncrona
  // Previne múltiplos cliques e fornece feedback visual ao usuário
  const [criandoSala, setCriandoSala] = useState(false);

  // Estado para controle da tela de sucesso pós-criação
  // Implementa fluxo de feedback positivo com redirecionamento automático
  const [salaCriada, setSalaCriada] = useState(false);

  // Estado para gerenciamento de erros de validação por campo
  // Permite feedback específico e granular para cada input
  const [erros, setErros] = useState({});

  // Lista estática de opções de estoque disponíveis no sistema
  // Decisão: dados fixos por serem configurações estáveis do sistema
  const opcoesEstoque = [
    { value: '', label: 'Selecione o estoque' },
    { value: 'principal', label: 'Estoque Principal' },
    { value: 'secundario', label: 'Estoque Secundário' },
    { value: 'emergencia', label: 'Estoque de Emergência' },
    { value: 'backup', label: 'Estoque Backup' }
  ];

  /**
   * Atualiza campos do formulário mantendo imutabilidade do estado
   * Implementa limpeza automática de erros para melhorar UX
   */
  const handleInputChange = (campo, valor) => {
    // Atualiza valor usando spread operator para preservar outros campos
    setDadosSala(prev => ({
      ...prev,
      [campo]: valor
    }));
    
    // Remove erro específico quando usuário corrige o campo
    // Feedback imediato melhora experiência do usuário
    if (erros[campo]) {
      setErros(prev => ({
        ...prev,
        [campo]: null
      }));
    }
  };

  /**
   * Executa validação client-side dos campos obrigatórios
   * Retorna boolean indicando se formulário está válido para envio
   */
  const validarFormulario = () => {
    const novosErros = {};

    // Validação do número da sala com verificação de conteúdo
    if (!dadosSala.numeroSala.trim()) {
      novosErros.numeroSala = 'Número da sala é obrigatório';
    } else if (dadosSala.numeroSala.trim().length < 1) {
      novosErros.numeroSala = 'Número da sala deve ter pelo menos 1 caractere';
    }

    // Validação de seleção de estoque obrigatória
    if (!dadosSala.estoque) {
      novosErros.estoque = 'Estoque é obrigatório';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  /**
   * Processa criação da sala com validação, loading e feedback
   * Implementa fluxo completo de criação com tratamento de erros
   */
  const handleCriarSala = async () => {
    // Interrompe execução se validação falhar
    if (!validarFormulario()) {
      return;
    }

    setCriandoSala(true);
    
    try {
      // Simulação de chamada à API com delay realista
      // TODO: Substituir por chamada real ao endpoint de criação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Sala criada:', dadosSala);
      
      // Ativa tela de sucesso para feedback positivo
      setSalaCriada(true);
      
      // Redirecionamento automático após tempo suficiente para leitura
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      alert('Erro ao criar sala. Tente novamente.');
    } finally {
      // Garante que loading seja removido independente do resultado
      setCriandoSala(false);
    }
  };

  /**
   * Navega de volta ao menu principal preservando contexto
   * Permite cancelamento da operação a qualquer momento
   */
  const handleVoltar = () => {
    router.push('/admin');
  };

  // Computed property para habilitar/desabilitar botão de submissão
  // Melhora UX fornecendo indicação visual de formulário completo
  const formularioValido = dadosSala.numeroSala.trim() && dadosSala.estoque;

  // Renderização condicional da tela de sucesso
  // Substitui formulário por feedback visual e confirmação da ação
  if (salaCriada) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-6 shadow-lg">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Sala Criada com Sucesso!
          </h1>
          <p className="text-slate-600 text-lg mb-4">
            A sala {dadosSala.numeroSala} foi adicionada ao sistema
          </p>
          <div className="text-sm text-slate-500">
            Redirecionando para o menu principal...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 p-4">
      {/* Header com identificação de contexto administrativo */}
      <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
            <User className="h-5 w-5 text-white" />
          </div>
          <span className="text-slate-700 font-medium">Admin</span>
        </div>
        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
          Cadastro de sala
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Seção de título com ícone representativo */}
        {/* Design centrado para criar foco na ação principal */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-2xl mb-6 shadow-lg">
            <Building className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Criar Nova Sala
          </h1>
          <p className="text-slate-600 text-lg">
            Sistema de Gestão de Imunobiológicos
          </p>
        </div>

        {/* Formulário principal com design glassmorphism */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl">
          <CardHeader className="pb-6 pt-8">
            <CardTitle className="text-center text-xl text-slate-700 font-medium flex items-center justify-center">
              <Plus className="h-6 w-6 mr-2" />
              Informações da sala
            </CardTitle>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <div className="space-y-6">
              {/* Campo número da sala com validação visual */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium text-sm">
                  Número da sala *
                </Label>
                <Input
                  value={dadosSala.numeroSala}
                  onChange={(e) => handleInputChange('numeroSala', e.target.value)}
                  className={`bg-white/70 border-2 rounded-xl h-12 text-gray-700 placeholder-gray-400 focus:ring-emerald-200 transition-all ${
                    erros.numeroSala 
                      ? 'border-red-300 focus:border-red-400' 
                      : 'border-slate-200 focus:border-emerald-300'
                  }`}
                  placeholder="Ex: 101, A-15, Sala 1"
                />
                {/* Mensagem de erro específica renderizada condicionalmente */}
                {erros.numeroSala && (
                  <p className="text-red-500 text-xs mt-1">{erros.numeroSala}</p>
                )}
              </div>

              {/* Select nativo para compatibilidade e performance */}
              {/* Decisão: select nativo evita dependências adicionais */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium text-sm">
                  Estoque *
                </Label>
                <select
                  value={dadosSala.estoque}
                  onChange={(e) => handleInputChange('estoque', e.target.value)}
                  className={`w-full bg-white/70 border-2 rounded-xl h-12 text-gray-700 px-3 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all ${
                    erros.estoque 
                      ? 'border-red-300 focus:border-red-400' 
                      : 'border-slate-200 focus:border-emerald-300'
                  }`}
                >
                  {opcoesEstoque.map((opcao) => (
                    <option key={opcao.value} value={opcao.value}>
                      {opcao.label}
                    </option>
                  ))}
                </select>
                {/* Feedback de erro específico para seleção de estoque */}
                {erros.estoque && (
                  <p className="text-red-500 text-xs mt-1">{erros.estoque}</p>
                )}
              </div>

              {/* Seção de botões com layout justificado */}
              {/* Permite navegação bidirecional e ação principal destacada */}
              <div className="flex justify-between pt-6">
                <Button
                  onClick={handleVoltar}
                  disabled={criandoSala}
                  variant="outline"
                  className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-xl font-medium transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>

                {/* Botão principal com estados visuais distintos */}
                {/* Loading spinner e desabilitação previnem ações duplicadas */}
                <Button
                  onClick={handleCriarSala}
                  disabled={!formularioValido || criandoSala}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-medium disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {criandoSala ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Submeter
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer com identificação do sistema */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Sistema Vacenf - Gestão de Imunobiológicos
          </p>
        </div>
      </div>
    </div>
  );
};

export default CriarSala;