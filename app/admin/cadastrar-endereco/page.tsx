'use client'
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
import { ArrowLeft, MapPin, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CadastroEndereco = () => {
  const router = useRouter();
  
  /**
   * Estado para armazenar todos os dados de endereço do usuário
   * Contém todos os campos necessários para o endereço completo
   */
  const [enderecoData, setEnderecoData] = useState({
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: ''
  });

  /**
   * Estado para armazenar os dados do usuário vindos da tela anterior
   */
  const [dadosUsuario, setDadosUsuario] = useState(null);

  /**
   * Hook para carregar os dados do usuário salvos na tela anterior
   * Executa apenas uma vez quando o componente é montado
   */
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('dadosUsuario');
    if (dadosSalvos) {
      setDadosUsuario(JSON.parse(dadosSalvos));
    } else {
      // Se não há dados do usuário, redireciona para a tela de cadastro
      alert('Dados do usuário não encontrados. Redirecionando para o cadastro.');
      router.push('/admin/cadastrar-usuario');
    }
  }, [router]);

  /**
   * Função para atualizar um campo específico do endereço
   * @param {string} field - Nome do campo a ser atualizado
   * @param {string} value - Novo valor para o campo
   */
  const handleInputChange = (field, value) => {
    setEnderecoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Função para buscar dados do endereço automaticamente pelo CEP
   * Integra com API de CEP para preencher campos automaticamente
   * @param {string} cep - CEP digitado pelo usuário
   */
  const handleCepChange = async (cep) => {
    setEnderecoData(prev => ({ ...prev, cep }));
    
    // Remove caracteres não numéricos do CEP
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length === 8) {
      try {
        console.log('Buscando dados do CEP:', cleanCep);
        
        // Exemplo de integração com ViaCEP
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
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
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar dados do CEP. Tente novamente.');
      }
    }
  };

  /**
   * Função para validar se todos os campos obrigatórios do endereço foram preenchidos
   * @returns {boolean} - True se todos os campos obrigatórios estão preenchidos
   */
  const validateEnderecoForm = () => {
    const { cep, estado, cidade, bairro, rua, numero } = enderecoData;
    
    if (!cep || !estado || !cidade || !bairro || !rua || !numero) {
      alert('Por favor, preencha todos os campos obrigatórios do endereço.');
      return false;
    }
    
    // Validação do CEP
    const cepNumbers = cep.replace(/\D/g, '');
    if (cepNumbers.length !== 8) {
      alert('Por favor, insira um CEP válido.');
      return false;
    }
    
    return true;
  };

  /**
   * Função para processar o cadastro completo do usuário
   * Combina os dados pessoais e de endereço e finaliza o cadastro
   */
  const handleFinalizarCadastro = async () => {
    if (validateEnderecoForm()) {
      const dadosCompletos = {
        ...dadosUsuario,
        endereco: enderecoData,
        dataHoraCadastro: new Date().toISOString()
      };
      
      console.log('Dados completos do usuário:', dadosCompletos);
      
      try {
        // Aqui seria feita a chamada para a API de cadastro
        // const response = await fetch('/api/usuarios', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(dadosCompletos)
        // });
        
        // Limpa os dados temporários do localStorage
        localStorage.removeItem('dadosUsuario');
        
        alert('Usuário cadastrado com sucesso!');
        
        // Redireciona para o menu principal do admin
        router.push('/admin');
        
      } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        alert('Erro ao cadastrar usuário. Tente novamente.');
      }
    }
  };

  /**
   * Função para voltar à tela de dados pessoais
   * Preserva os dados já preenchidos para edição
   */
  const handleVoltar = () => {
    router.push('/admin/cadastrar-usuario');
  };

  /**
   * Lista dos estados brasileiros para o select
   */
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

  // Loading state enquanto carrega os dados do usuário
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm text-gray-500">Progresso do formulário</span>
          <span className="text-sm text-gray-400">Etapa 2 de 2 - Endereço</span>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
            <span>Dados pessoais de <strong>{dadosUsuario.nomeCompleto}</strong> salvos com sucesso</span>
          </div>
        </div>

        {/* Form Card */}
        <Card className="bg-emerald-400 border-0 shadow-xl rounded-3xl">
          <CardHeader className="bg-emerald-400 rounded-t-3xl pb-6 pt-8">
            <CardTitle className="text-center text-2xl font-bold text-slate-800 mb-2 flex items-center justify-center">
              <MapPin className="h-6 w-6 mr-3" />
              Endereço:
            </CardTitle>
          </CardHeader>
          
          <CardContent className="bg-emerald-400 px-8 pb-8 space-y-6">
            {/* CEP */}
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

            {/* Estado */}
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

            {/* Cidade */}
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

            {/* Bairro */}
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

            {/* Rua */}
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

            {/* Número */}
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

            {/* Complemento */}
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

            {/* Action Buttons */}
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