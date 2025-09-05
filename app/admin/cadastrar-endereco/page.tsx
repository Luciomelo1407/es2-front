'use client' //Não tire, vai parar de funcionar. 
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";

const CadastroEndereco = () => {
  const { profissional, loading, error, retry } = useAuth();
  const router = useRouter();
  
  // Estado principal para gerenciar todos os campos de endereço em um único objeto
  // Decisão de implementação: centralizar os dados para facilitar validação e envio
  const [enderecoData, setEnderecoData] = useState({
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: ''
  });

  // Estado para armazenar dados do usuário vindos da etapa anterior do cadastro
  // Utiliza null para permitir loading state enquanto carrega do localStorage
  const [dadosUsuario, setDadosUsuario] = useState(null);

  /**
   * Carrega os dados do usuário salvos na etapa anterior do formulário
   * Executa validação de integridade dos dados e redireciona se necessário
   */
  useEffect(() => {
    // Recupera dados do localStorage para manter fluxo multi-etapa
    const dadosSalvos = localStorage.getItem('dadosUsuario');
    if (dadosSalvos) {
      setDadosUsuario(JSON.parse(dadosSalvos));
    } else {
      // Proteção contra acesso direto à página sem completar etapa anterior
      alert('Dados do usuário não encontrados. Redirecionando para o cadastro.');
      router.push('/admin/cadastrar-usuario');
    }
  }, [router]);

  /**
   * Atualiza um campo específico do endereço mantendo imutabilidade do estado
   * Utiliza spread operator para preservar outros campos durante atualização
   */
  const handleInputChange = (field, value) => {
    setEnderecoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Busca automaticamente dados do endereço através da API ViaCEP
   * Implementa preenchimento automático para melhorar experiência do usuário
   */
  const handleCepChange = async (cep) => {
    setEnderecoData(prev => ({ ...prev, cep }));
    
    // Sanitização do CEP removendo caracteres não numéricos
    // Decisão: permite entrada formatada mas processa apenas números
    const cleanCep = cep.replace(/\D/g, '');
    
    // Valida comprimento padrão do CEP brasileiro antes de fazer requisição
    if (cleanCep.length === 8) {
      try {
        console.log('Buscando dados do CEP:', cleanCep);
        
        // Integração com API pública ViaCEP para preenchimento automático
        // Escolha da ViaCEP: gratuita, confiável e específica para CEPs brasileiros
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          // Atualiza apenas campos retornados pela API, preserva dados já inseridos
          setEnderecoData(prev => ({
            ...prev,
            estado: data.uf,
            cidade: data.localidade,
            bairro: data.bairro || '',
            rua: data.logradouro || ''
          }));
        } else {
          alert('CEP não encontrado. Por favor, verifique o número digitado.');
        }
      } catch (error) {
        // Tratamento robusto de erros de rede ou parsing
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar dados do CEP. Tente novamente.');
      }
    }
  };

  /**
   * Valida completude dos campos obrigatórios antes do envio
   * Implementa validação client-side para feedback imediato ao usuário
   */
  const validateEnderecoForm = () => {
    const { cep, estado, cidade, bairro, rua, numero } = enderecoData;
    
    // Validação de campos obrigatórios baseada nos requisitos de endereço completo
    if (!cep || !estado || !cidade || !bairro || !rua || !numero) {
      alert('Por favor, preencha todos os campos obrigatórios do endereço.');
      return false;
    }
    
    // Validação específica do formato do CEP brasileiro (8 dígitos)
    const cepNumbers = cep.replace(/\D/g, '');
    if (cepNumbers.length !== 8) {
      alert('Por favor, insira um CEP válido.');
      return false;
    }
    
    return true;
  };

  /**
   * Finaliza o cadastro combinando dados pessoais e de endereço
   * Executa validação, merge de dados e limpeza do estado temporário
   */
  const handleFinalizarCadastro = async () => {
    if (validateEnderecoForm()) {
      // Combina dados de ambas as etapas em objeto completo
      // Adiciona timestamp para auditoria e controle
      const dadosCompletos = {
        ...dadosUsuario,
        endereco: enderecoData,
        dataHoraCadastro: new Date().toISOString()
      };
      
      console.log('Dados completos do usuário:', dadosCompletos);
      
      try {
        // TODO: Implementar chamada real para API de cadastro
        // const response = await fetch('/api/usuarios', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(dadosCompletos)
        // });
        
        // Limpeza dos dados temporários após sucesso
        // Previne reuso indevido e libera memória
        localStorage.removeItem('dadosUsuario');
        
        alert('Usuário cadastrado com sucesso!');
        
        // Redireciona para painel principal após conclusão
        router.push('/admin');
        
      } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        alert('Erro ao cadastrar usuário. Tente novamente.');
      }
    }
  };

  /**
   * Navega de volta para etapa anterior preservando contexto
   * Permite edição dos dados pessoais sem perder progresso atual
   */
  const handleVoltar = () => {
    router.push('/admin/cadastrar-usuario');
  };

  // Lista estática dos estados brasileiros para componente Select
  // Decisão: dados estáticos por serem estáveis e evitar requisições desnecessárias
  const estadosBrasil = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' }
  ];

  // Renderização condicional de loading enquanto carrega dados do usuário
  // Melhora UX evitando flash de conteúdo e erros de renderização
  if (!dadosUsuario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do usuário...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header fixo com identificação de contexto administrativo */}
      <div className="bg-emerald-400 shadow-sm px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="text-white text-lg font-medium">Admin</span>
          </div>
          <div className="bg-blue-500 px-6 py-2 rounded-xl">
            <span className="text-white font-medium">cadastro usuário</span>
          </div>
        </div>
      </div>

      {/* Container principal com largura responsiva */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Indicador de progresso multi-etapa para orientação do usuário */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm text-gray-500">Progresso do formulário</span>
          <span className="text-sm text-gray-400">Etapa 2 de 2 - Endereço</span>
        </div>

        {/* Card de confirmação dos dados da etapa anterior */}
        {/* Fornece contexto e confiança ao usuário sobre dados já salvos */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
            <span>Dados pessoais de <strong>{dadosUsuario.nomeCompleto}</strong> salvos com sucesso</span>
          </div>
        </div>

        {/* Formulário principal com design consistente */}
        <Card className="bg-emerald-400 border-0 shadow-xl rounded-3xl">
          <CardHeader className="bg-emerald-400 rounded-t-3xl pb-6 pt-8">
            <CardTitle className="text-center text-2xl font-bold text-slate-800 mb-2 flex items-center justify-center">
              <MapPin className="h-6 w-6 mr-3" />
              Endereço:
            </CardTitle>
          </CardHeader>
          
          <CardContent className="bg-emerald-400 px-8 pb-8 space-y-6">
            {/* Campo CEP com funcionalidade de busca automática */}
            <div className="flex items-center space-x-4">
              <Label className="text-slate-800 font-medium min-w-[120px] text-right">
                cep: *
              </Label>
              <Input
                value={enderecoData.cep}
                onChange={(e) => handleCepChange(e.target.value)}
                className="flex-1 bg-white border-2 border-slate-300 rounded-lg h-12 text-gray-700 placeholder-gray-400"
                placeholder="00000-000"
                maxLength="9"
              />
            </div>

            {/* Select de estados com dados pré-carregados */}
            <div className="flex items-center space-x-4">
              <Label className="text-slate-800 font-medium min-w-[120px] text-right">
                estado: *
              </Label>
              <Select 
                value={enderecoData.estado} 
                onValueChange={(value) => handleInputChange('estado', value)}
              >
                <SelectTrigger className="flex-1 bg-white border-2 border-slate-300 rounded-lg h-12">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {estadosBrasil.map((estado) => (
                    <SelectItem key={estado.value} value={estado.value}>
                      {estado.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Campos de endereço com preenchimento automático via CEP */}
            <div className="flex items-center space-x-4">
              <Label className="text-slate-800 font-medium min-w-[120px] text-right">
                cidade: *
              </Label>
              <Input
                value={enderecoData.cidade}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
                className="flex-1 bg-white border-2 border-slate-300 rounded-lg h-12 text-gray-700 placeholder-gray-400"
                placeholder="Digite a cidade"
              />
            </div>

            <div className="flex items-center space-x-4">
              <Label className="text-slate-800 font-medium min-w-[120px] text-right">
                bairro: *
              </Label>
              <Input
                value={enderecoData.bairro}
                onChange={(e) => handleInputChange('bairro', e.target.value)}
                className="flex-1 bg-white border-2 border-slate-300 rounded-lg h-12 text-gray-700 placeholder-gray-400"
                placeholder="Digite o bairro"
              />
            </div>

            <div className="flex items-center space-x-4">
              <Label className="text-slate-800 font-medium min-w-[120px] text-right">
                rua: *
              </Label>
              <Input
                value={enderecoData.rua}
                onChange={(e) => handleInputChange('rua', e.target.value)}
                className="flex-1 bg-white border-2 border-slate-300 rounded-lg h-12 text-gray-700 placeholder-gray-400"
                placeholder="Digite o nome da rua"
              />
            </div>

            {/* Campo número com largura reduzida para otimizar layout */}
            <div className="flex items-center space-x-4">
              <Label className="text-slate-800 font-medium min-w-[120px] text-right">
                número: *
              </Label>
              <Input
                value={enderecoData.numero}
                onChange={(e) => handleInputChange('numero', e.target.value)}
                className="w-32 bg-white border-2 border-slate-300 rounded-lg h-12 text-gray-700 placeholder-gray-400"
                placeholder="123"
              />
            </div>

            {/* Campo opcional para informações adicionais */}
            <div className="flex items-center space-x-4">
              <Label className="text-slate-800 font-medium min-w-[120px] text-right">
                complemento:
              </Label>
              <Input
                value={enderecoData.complemento}
                onChange={(e) => handleInputChange('complemento', e.target.value)}
                className="flex-1 bg-white border-2 border-slate-300 rounded-lg h-12 text-gray-700 placeholder-gray-400"
                placeholder="Apartamento, bloco, casa, etc. (opcional)"
              />
            </div>

            {/* Botões de ação com posicionamento justificado */}
            {/* Permite navegação bidirecional no fluxo multi-etapa */}
            <div className="flex justify-between mt-8 px-4">
              <Button
                onClick={handleVoltar}
                className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-2xl font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                voltar
              </Button>
              <Button
                onClick={handleFinalizarCadastro}
                className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-2xl font-medium"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                finalizar cadastro
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CadastroEndereco;