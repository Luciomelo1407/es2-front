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
import { ArrowLeft, User, Shield, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CadastroUsuario = () => {
  const router = useRouter();
  
  /**
   * Estado para armazenar todos os dados do formulário de cadastro
   * Contém todos os campos necessários para o registro de um novo usuário
   */
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
   * Função para atualizar um campo específico do formulário
   * @param {string} field - Nome do campo a ser atualizado
   * @param {string} value - Novo valor para o campo
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Função para validar se todos os campos obrigatórios foram preenchidos
   * @returns {boolean} - True se todos os campos obrigatórios estão preenchidos
   */
  const validateForm = () => {
    const { nomeCompleto, coren, ocupacao, email, senha, dataNascimento, cpf } = formData;
    
    if (!nomeCompleto || !coren || !ocupacao || !email || !senha || !dataNascimento || !cpf) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
    
    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor, insira um email válido.');
      return false;
    }
    
    // Validação básica de CPF (11 dígitos)
    const cpfNumbers = cpf.replace(/\D/g, '');
    if (cpfNumbers.length !== 11) {
      alert('Por favor, insira um CPF válido.');
      return false;
    }
    
    return true;
  };

  /**
   * Função para processar o envio do formulário e navegar para a tela de endereço
   * Valida os dados e salva no localStorage antes de prosseguir
   */
  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Dados do usuário:', formData);
      
      // Salva os dados do usuário no localStorage para usar na próxima tela
      localStorage.setItem('dadosUsuario', JSON.stringify(formData));
      
      // Navega para a tela de cadastro de endereço dentro da pasta admin
      router.push('/admin/cadastrar-endereco');
    }
  };

  /**
   * Função para voltar à tela anterior (menu principal do admin)
   * Navega de volta para a página inicial do painel administrativo
   */
  const handleVoltar = () => {
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
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
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg">
            <Shield className="h-4 w-4 mr-2" />
            Inserir Vacina
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-4">
            <Edit className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cadastro de Usuário</h1>
          <p className="text-gray-600">Sistema de Gestão de Imunobiológicos</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm text-gray-500">Progresso do formulário</span>
          <span className="text-sm text-gray-400">Etapa 1 de 2 - Dados Pessoais</span>
        </div>

        {/* Form Card */}
        <Card className="bg-emerald-500 border-0 shadow-xl">
          <CardHeader className="bg-emerald-500 rounded-t-lg">
            <CardTitle className="text-white text-xl font-semibold flex items-center">
              <Edit className="h-5 w-5 mr-2" />
              Cadastro de usuário
            </CardTitle>
            <p className="text-emerald-100 text-sm">Preencha todos os campos obrigatórios</p>
          </CardHeader>
          
          <CardContent className="bg-emerald-500 p-6 space-y-6">
            {/* Nome do usuário */}
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

            {/* COREN */}
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

            {/* Ocupação */}
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

            {/* Email */}
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

            {/* Senha */}
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

            {/* Data de Nascimento e CPF - Row */}
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

            {/* Action Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                onClick={handleVoltar}
                variant="outline"
                className="bg-white bg-opacity-20 border-white border-2 text-white hover:bg-white hover:text-emerald-500 px-8 py-3 rounded-lg font-medium backdrop-blur-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
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