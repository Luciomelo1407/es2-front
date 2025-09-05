'use client'
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, CheckCircle, User, Building , AlertCircle, Loader2} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const CriarSala = () => {
  const router = useRouter();
  
  // Estado para dados do usuário logado
  const { profissional, loading, error, retry } = useAuth();

  // Estado principal para dados da sala utilizando objeto único
  // ubsId é automaticamente definido pela UBS do usuário logado
  const [dadosSala, setDadosSala] = useState({
    tamanho: '',
    acessibilidade: false,
    paredeLavavel: false,
    pisoLavavel: false,
    portaLavavel: false,
    janelaLavavel: false,
    tetoLavavel: false,
    pia: false,
    ubsId: null
  });

  // Estado para controle de loading durante operação assíncrona
  const [criandoSala, setCriandoSala] = useState(false);

  // Estado para controle da tela de sucesso pós-criação
  const [salaCriada, setSalaCriada] = useState(false);

  // Estado para gerenciamento de erros de validação por campo
  const [erros, setErros] = useState({});

  useEffect(() => {
    if (profissional && profissional.ubsId) {
      setDadosSala(prev => ({
        ...prev,
        ubsId: profissional.ubsId
      }));
    }
  }, [profissional]);

  /**
   * Atualiza campos do formulário mantendo imutabilidade do estado
   * Implementa limpeza automática de erros para melhorar UX
   */
  const handleInputChange = (campo, valor) => {
    // Conversão específica para campos numéricos
    let valorProcessado = valor;
    if (campo === 'tamanho') {
      valorProcessado = valor === '' ? '' : parseFloat(valor) || '';
    }
    
    setDadosSala(prev => ({
      ...prev,
      [campo]: valorProcessado
    }));
    
    // Remove erro específico quando usuário corrige o campo
    if (erros[campo]) {
      setErros(prev => ({
        ...prev,
        [campo]: null
      }));
    }
  };

  /**
   * Manipula mudanças em campos checkbox (booleanos)
   */
  const handleCheckboxChange = (campo, valor) => {
    setDadosSala(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  /**
   * Executa validação client-side dos campos obrigatórios
   */
  const validarFormulario = () => {
    const novosErros = {};

    // Validação do tamanho da sala
    if (!dadosSala.tamanho && dadosSala.tamanho !== 0) {
      novosErros.tamanho = 'Tamanho da sala é obrigatório';
    } else if (dadosSala.tamanho <= 0) {
      novosErros.tamanho = 'Tamanho deve ser maior que zero';
    }

    // UBS é automaticamente definida pelo usuário logado, não precisa validar

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  /**
   * Processa criação da sala com validação, loading e feedback
   */
  const handleCriarSala = async () => {
    if (!validarFormulario()) {
      return;
    }

    setCriandoSala(true);
    
    try {
      // Preparação dos dados para envio ao back-end
      const dadosParaEnvio = {
        ...dadosSala,
        tamanho: parseFloat(dadosSala.tamanho),
        ubsId: profissional.ubsId // Garantindo que use a UBS do usuário logado
      };
      
      // Simulação de chamada à API
      // TODO: Substituir por chamada real ao endpoint de criação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Dados da sala para criação:', dadosParaEnvio);
      
      setSalaCriada(true);
      
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      alert('Erro ao criar sala. Tente novamente.');
    } finally {
      setCriandoSala(false);
    }
  };

  /**
   * Navega de volta ao menu principal
   */
  const handleVoltar = () => {
    router.push('/admin');
  };

  // Computed property para habilitar/desabilitar botão de submissão
  const formularioValido = dadosSala.tamanho;

  // Tela de loading
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Verificando autenticação...
          </h2>
          <p className="text-gray-600">Aguarde um momento</p>
        </div>
      </main>
    );
  }

  // Tela de erro
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
  
  // Renderização da tela de sucesso
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
            A sala foi adicionada ao sistema
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
      {/* Header */}
      <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-700 font-medium">{profissional.nome}</span>
            <span className="text-slate-500 text-sm">{profissional.ubsNome}</span>
          </div>
        </div>
        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
          Cadastro de sala
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Título */}
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

        {/* Formulário principal */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl">
          <CardHeader className="pb-6 pt-8">
            <CardTitle className="text-center text-xl text-slate-700 font-medium flex items-center justify-center">
              <Plus className="h-6 w-6 mr-2" />
              Informações da sala
            </CardTitle>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <div className="space-y-6">
              
              {/* Campo tamanho da sala */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium text-sm">
                  Tamanho da sala (m²) *
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={dadosSala.tamanho}
                  onChange={(e) => handleInputChange('tamanho', e.target.value)}
                  className={`bg-white/70 border-2 rounded-xl h-12 text-gray-700 placeholder-gray-400 focus:ring-emerald-200 transition-all ${
                    erros.tamanho 
                      ? 'border-red-300 focus:border-red-400' 
                      : 'border-slate-200 focus:border-emerald-300'
                  }`}
                  placeholder="Ex: 25.5"
                />
                {erros.tamanho && (
                  <p className="text-red-500 text-xs mt-1">{erros.tamanho}</p>
                )}
              </div>

              {/* Informação da UBS (somente leitura) */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium text-sm">
                  UBS
                </Label>
                <div className="bg-slate-100 border-2 border-slate-200 rounded-xl h-12 flex items-center px-3 text-slate-600">
                  <Building className="h-4 w-4 mr-2" />
                  {profissional.ubsNome}
                </div>
                <p className="text-slate-500 text-xs">
                  A sala será criada na UBS do usuário logado
                </p>
              </div>

              {/* Seção de características da sala */}
              <div className="space-y-4">
                <Label className="text-slate-700 font-medium text-sm">
                  Características da sala
                </Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Acessibilidade */}
                  <div className="flex items-center space-x-3 bg-white/50 p-3 rounded-lg">
                    <input
                      type="checkbox"
                      id="acessibilidade"
                      checked={dadosSala.acessibilidade}
                      onChange={(e) => handleCheckboxChange('acessibilidade', e.target.checked)}
                      className="w-4 h-4 text-emerald-500 bg-white border-2 border-gray-300 rounded focus:ring-emerald-200"
                    />
                    <label htmlFor="acessibilidade" className="text-slate-700 text-sm font-medium cursor-pointer">
                      Acessibilidade
                    </label>
                  </div>

                  {/* Pia */}
                  <div className="flex items-center space-x-3 bg-white/50 p-3 rounded-lg">
                    <input
                      type="checkbox"
                      id="pia"
                      checked={dadosSala.pia}
                      onChange={(e) => handleCheckboxChange('pia', e.target.checked)}
                      className="w-4 h-4 text-emerald-500 bg-white border-2 border-gray-300 rounded focus:ring-emerald-200"
                    />
                    <label htmlFor="pia" className="text-slate-700 text-sm font-medium cursor-pointer">
                      Possui pia
                    </label>
                  </div>
                </div>
              </div>

              {/* Seção de superfícies laváveis */}
              <div className="space-y-4">
                <Label className="text-slate-700 font-medium text-sm">
                  Superfícies laváveis
                </Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Parede lavável */}
                  <div className="flex items-center space-x-3 bg-white/50 p-3 rounded-lg">
                    <input
                      type="checkbox"
                      id="paredeLavavel"
                      checked={dadosSala.paredeLavavel}
                      onChange={(e) => handleCheckboxChange('paredeLavavel', e.target.checked)}
                      className="w-4 h-4 text-emerald-500 bg-white border-2 border-gray-300 rounded focus:ring-emerald-200"
                    />
                    <label htmlFor="paredeLavavel" className="text-slate-700 text-sm font-medium cursor-pointer">
                      Parede lavável
                    </label>
                  </div>

                  {/* Piso lavável */}
                  <div className="flex items-center space-x-3 bg-white/50 p-3 rounded-lg">
                    <input
                      type="checkbox"
                      id="pisoLavavel"
                      checked={dadosSala.pisoLavavel}
                      onChange={(e) => handleCheckboxChange('pisoLavavel', e.target.checked)}
                      className="w-4 h-4 text-emerald-500 bg-white border-2 border-gray-300 rounded focus:ring-emerald-200"
                    />
                    <label htmlFor="pisoLavavel" className="text-slate-700 text-sm font-medium cursor-pointer">
                      Piso lavável
                    </label>
                  </div>

                  {/* Porta lavável */}
                  <div className="flex items-center space-x-3 bg-white/50 p-3 rounded-lg">
                    <input
                      type="checkbox"
                      id="portaLavavel"
                      checked={dadosSala.portaLavavel}
                      onChange={(e) => handleCheckboxChange('portaLavavel', e.target.checked)}
                      className="w-4 h-4 text-emerald-500 bg-white border-2 border-gray-300 rounded focus:ring-emerald-200"
                    />
                    <label htmlFor="portaLavavel" className="text-slate-700 text-sm font-medium cursor-pointer">
                      Porta lavável
                    </label>
                  </div>

                  {/* Janela lavável */}
                  <div className="flex items-center space-x-3 bg-white/50 p-3 rounded-lg">
                    <input
                      type="checkbox"
                      id="janelaLavavel"
                      checked={dadosSala.janelaLavavel}
                      onChange={(e) => handleCheckboxChange('janelaLavavel', e.target.checked)}
                      className="w-4 h-4 text-emerald-500 bg-white border-2 border-gray-300 rounded focus:ring-emerald-200"
                    />
                    <label htmlFor="janelaLavavel" className="text-slate-700 text-sm font-medium cursor-pointer">
                      Janela lavável
                    </label>
                  </div>

                  {/* Teto lavável */}
                  <div className="flex items-center space-x-3 bg-white/50 p-3 rounded-lg md:col-span-2">
                    <input
                      type="checkbox"
                      id="tetoLavavel"
                      checked={dadosSala.tetoLavavel}
                      onChange={(e) => handleCheckboxChange('tetoLavavel', e.target.checked)}
                      className="w-4 h-4 text-emerald-500 bg-white border-2 border-gray-300 rounded focus:ring-emerald-200"
                    />
                    <label htmlFor="tetoLavavel" className="text-slate-700 text-sm font-medium cursor-pointer">
                      Teto lavável
                    </label>
                  </div>
                </div>
              </div>

              {/* Seção de botões */}
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

        {/* Footer */}
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