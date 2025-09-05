'use client' //Não tire, vai parar de funcionar. 
import React, { useState } from 'react';
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
import { ArrowLeft, User, Shield, Edit , AlertCircle} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";

const CadastroUsuario = () => {
  const { profissional, loading, error, retry } = useAuth();
  const router = useRouter();
  
  // Estado centralizado para todos os campos do formulário de cadastro
  // Decisão: objeto único facilita validação, serialização e navegação multi-etapa
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    coren: '',
    ocupacao: '',
    email: '',
    senha: '',
    dataNascimento: '',
    cpf: ''
  });

  /**
   * Atualiza campo específico do formulário mantendo imutabilidade
   * Utiliza spread operator para preservar outros campos durante atualização
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Executa validação client-side de todos os campos obrigatórios
   * Implementa validações específicas para email e CPF com feedback imediato
   */
  const validateForm = () => {
    const { nomeCompleto, coren, ocupacao, email, senha, dataNascimento, cpf } = formData;
    
    // Validação de preenchimento de campos obrigatórios
    if (!nomeCompleto || !coren || !ocupacao || !email || !senha || !dataNascimento || !cpf) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
    
    // Validação de formato de email usando regex padrão
    // Decisão: validação básica suficiente para feedback inicial do usuário
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor, insira um email válido.');
      return false;
    }
    
    // Validação de CPF brasileiro (formato de 11 dígitos)
    // Remove caracteres não numéricos para verificação de comprimento
    const cpfNumbers = cpf.replace(/\D/g, '');
    if (cpfNumbers.length !== 11) {
      alert('Por favor, insira um CPF válido.');
      return false;
    }
    
    return true;
  };

  /**
   * Processa envio da primeira etapa do formulário multi-etapa
   * Salva dados no localStorage para persistência entre navegações
   */
  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Dados do usuário:', formData);
      
      // Persiste dados no localStorage para fluxo multi-etapa
      // Decisão: localStorage permite navegação bidirecional sem perda de dados
      localStorage.setItem('dadosUsuario', JSON.stringify(formData));
      
      // Navega para segunda etapa do cadastro (endereço)
      router.push('/admin/cadastrar-endereco');
    }
  };

  /**
   * Navega de volta ao menu principal cancelando operação atual
   * Permite saída do fluxo sem salvar dados parciais
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header com contexto do sistema e ação secundária */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">usuário</h1>
              <p className="text-sm text-gray-500">Sistema Vacenf</p>
            </div>
          </div>
          {/* Botão de ação secundária sempre disponível */}
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg">
            <Shield className="h-4 w-4 mr-2" />
            Inserir Vacina
          </Button>
        </div>
      </div>

      {/* Container principal com largura responsiva */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Seção de título centralizada para foco visual */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-4">
            <Edit className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cadastro de Usuário</h1>
          <p className="text-gray-600">Sistema de Gestão de Imunobiológicos</p>
        </div>

        {/* Indicador de progresso para orientação em fluxo multi-etapa */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm text-gray-500">Progresso do formulário</span>
          <span className="text-sm text-gray-400">Etapa 1 de 2 - Dados Pessoais</span>
        </div>

        {/* Formulário principal com design destacado */}
        <Card className="bg-emerald-500 border-0 shadow-xl">
          <CardHeader className="bg-emerald-500 rounded-t-lg">
            <CardTitle className="text-white text-xl font-semibold flex items-center">
              <Edit className="h-5 w-5 mr-2" />
              Cadastro de usuário
            </CardTitle>
            <p className="text-emerald-100 text-sm">Preencha todos os campos obrigatórios</p>
          </CardHeader>
          
          <CardContent className="bg-emerald-500 p-6 space-y-6">
            {/* Campo nome com ícone identificador */}
            <div>
              <Label className="text-white font-medium mb-2 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Nome completo *
              </Label>
              <Input
                value={formData.nomeCompleto}
                onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                className="bg-white border-0 rounded-lg h-12 text-gray-700 placeholder-gray-400"
                placeholder="Ex: João da Silva Santos"
              />
            </div>

            {/* Campo COREN específico para profissionais de enfermagem */}
            <div>
              <Label className="text-white font-medium mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                COREN *
              </Label>
              <Input
                value={formData.coren}
                onChange={(e) => handleInputChange('coren', e.target.value)}
                className="bg-white border-0 rounded-lg h-12 text-gray-700 placeholder-gray-400"
                placeholder="Ex: COREN-SP 123456"
              />
            </div>

            {/* Select de ocupações relacionadas ao contexto hospitalar */}
            {/* Decisão: lista fixa por serem cargos padronizados no sistema de saúde */}
            <div>
              <Label className="text-white font-medium mb-2 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Ocupação *
              </Label>
              <Select onValueChange={(value) => handleInputChange('ocupacao', value)}>
                <SelectTrigger className="bg-white border-0 rounded-lg h-12 text-gray-700">
                  <SelectValue placeholder="Ex: Auxiliar de enfermagem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auxiliar-enfermagem">Auxiliar de Enfermagem</SelectItem>
                  <SelectItem value="tecnico-enfermagem">Técnico de Enfermagem</SelectItem>
                  <SelectItem value="enfermeiro">Enfermeiro</SelectItem>
                  <SelectItem value="medico">Médico</SelectItem>
                  <SelectItem value="administrativo">Administrativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campo email com tipo específico para teclados móveis */}
            <div>
              <Label className="text-white font-medium mb-2 block">Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-white border-0 rounded-lg h-12 text-gray-700 placeholder-gray-400"
                placeholder="Ex: joao@email.com"
              />
            </div>

            {/* Campo senha com tipo password para segurança */}
            <div>
              <Label className="text-white font-medium mb-2 block">Senha *</Label>
              <Input
                type="password"
                value={formData.senha}
                onChange={(e) => handleInputChange('senha', e.target.value)}
                className="bg-white border-0 rounded-lg h-12 text-gray-700 placeholder-gray-400"
                placeholder="Digite uma senha segura"
              />
            </div>

            {/* Grid responsivo para otimizar espaço em campos relacionados */}
            {/* Decisão: agrupa data e CPF por serem dados pessoais básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-white font-medium mb-2 block">Data de nascimento *</Label>
                <Input
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                  className="bg-white border-0 rounded-lg h-12 text-gray-700"
                />
              </div>
              
              {/* Campo CPF com limitação de caracteres para UX */}
              <div>
                <Label className="text-white font-medium mb-2 block">CPF *</Label>
                <Input
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  className="bg-white border-0 rounded-lg h-12 text-gray-700 placeholder-gray-400"
                  placeholder="000.000.000-00"
                  maxLength="14"
                />
              </div>
            </div>

            {/* Seção de botões com navegação bidirecional */}
            {/* Layout justificado permite cancelamento e prosseguimento claros */}
            <div className="flex justify-between pt-6">
              <Button
                onClick={handleVoltar}
                variant="outline"
                className="bg-white bg-opacity-20 border-white border-2 text-white hover:bg-white hover:text-emerald-500 px-8 py-3 rounded-lg font-medium backdrop-blur-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              {/* Botão principal com indicação clara da próxima etapa */}
              <Button
                onClick={handleSubmit}
                className="bg-white text-emerald-500 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium shadow-md"
              >
                Próximo - Endereço
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CadastroUsuario;