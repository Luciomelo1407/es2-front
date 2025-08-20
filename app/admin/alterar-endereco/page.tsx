'use client' //Não tire, vai parar de funcionar. 
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MapPin, CheckCircle, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AlterarUsuarioEndereco = () => {
  const router = useRouter();
  // Estado para armazenar os dados de endereço
  const [dadosEndereco, setDadosEndereco] = useState({
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: ''
  });

  // Estado para controlar o loading do salvamento
  const [finalizando, setFinalizando] = useState(false);

  // Estado para mostrar mensagem de sucesso
  const [alteracoesFinalizadas, setAlteracoesFinalizadas] = useState(false);

  // Lista de estados brasileiros
  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  // Carrega dados do usuário quando a página é montada
  useEffect(() => {
    // Tenta carregar dados de endereço existentes do localStorage ou API
    const usuarioSalvo = localStorage.getItem('usuarioParaAlterar');
    if (usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);
      // Se o usuário tiver dados de endereço, carrega eles
      if (usuario.endereco) {
        setDadosEndereco(usuario.endereco);
      } else {
        // Dados padrão se não houver endereço cadastrado
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

  // Função para atualizar campos do formulário
  const handleInputChange = (campo, valor) => {
    setDadosEndereco(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Função para formatar CEP
  const formatarCEP = (cep) => {
    const apenasNumeros = cep.replace(/\D/g, '');
    if (apenasNumeros.length <= 5) {
      return apenasNumeros;
    }
    return `${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(5, 8)}`;
  };

  // Função para buscar endereço pelo CEP (simulada)
  const buscarEnderecoPorCEP = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length === 8) {
      try {
        // Simula busca por CEP - em produção usaria ViaCEP ou similar
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Dados simulados
        const enderecoEncontrado = {
          estado: 'SP',
          cidade: 'São Paulo',
          bairro: 'Vila Madalena',
          rua: 'Rua Harmonia'
        };

        setDadosEndereco(prev => ({
          ...prev,
          ...enderecoEncontrado
        }));
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  // Função para lidar com mudança no CEP
  const handleCEPChange = (valor) => {
    const cepFormatado = formatarCEP(valor);
    handleInputChange('cep', cepFormatado);
    
    // Busca endereço quando CEP estiver completo
    if (cepFormatado.length === 9) {
      buscarEnderecoPorCEP(cepFormatado);
    }
  };

  // Função para finalizar as alterações
  const handleFinalizarAlteracoes = async () => {
    setFinalizando(true);
    
    try {
      // Simula chamada à API para salvar endereço
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Endereço alterado:', dadosEndereco);
      
      setAlteracoesFinalizadas(true);
      
      // Volta para o menu principal após 2 segundos
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao finalizar alterações:', error);
      alert('Erro ao salvar alterações. Tente novamente.');
      setFinalizando(false);
    }
  };

  // Função para voltar à página anterior
  const handleVoltar = () => {
    router.push('/admin/alterar-usuario');
  };

  // Verifica se campos obrigatórios estão preenchidos
  const camposObrigatoriosPreenchidos = dadosEndereco.cep && 
    dadosEndereco.estado && 
    dadosEndereco.cidade && 
    dadosEndereco.bairro && 
    dadosEndereco.rua && 
    dadosEndereco.numero;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 p-4">
      {/* Header */}
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
        {/* Progress */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-sm text-slate-500">Progresso do formulário</span>
          <span className="text-sm text-slate-500">Etapa 2 de 2 - Endereço</span>
        </div>

        {/* Success message for previous step */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
          <span className="text-green-700 text-sm">Dados pessoais alterados com sucesso</span>
        </div>

        {/* Formulário de Endereço */}
        <div className="bg-emerald-500 rounded-3xl p-8 shadow-2xl">
          <div className="mb-8">
            <div className="flex items-center text-white mb-2">
              <MapPin className="h-6 w-6 mr-3" />
              <h2 className="text-2xl font-bold">Alterar Endereço:</h2>
            </div>
          </div>

          <div className="space-y-6">
            {/* CEP */}
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

            {/* Estado */}
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

            {/* Cidade */}
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

            {/* Bairro */}
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

            {/* Rua */}
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

            {/* Número */}
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

            {/* Complemento */}
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

            {/* Botões */}
            <div className="flex justify-between pt-8">
              <Button
                onClick={handleVoltar}
                disabled={finalizando}
                className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>

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