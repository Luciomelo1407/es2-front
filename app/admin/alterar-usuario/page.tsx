'use client' //Não tire, vai parar de funcionar. 
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, CheckCircle, Edit3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AlterarUsuarioDados = () => {
  const router = useRouter();
  // Estado para armazenar os dados do usuário em edição
  const [dadosUsuario, setDadosUsuario] = useState({
    nomeCompleto: '',
    coren: '',
    ocupacao: '',
    email: '',
    senha: '',
    dataNascimento: '',
    cpf: ''
  });

  // Estado para controlar o loading do salvamento
  const [salvando, setSalvando] = useState(false);

  // Simula carregar dados do localStorage (em produção viria de uma API)
  useEffect(() => {
    // Tenta carregar dados do usuário selecionado do localStorage
    const usuarioSalvo = localStorage.getItem('usuarioParaAlterar');
    if (usuarioSalvo) {
      const usuarioSelecionado = JSON.parse(usuarioSalvo);
      setDadosUsuario({
        nomeCompleto: usuarioSelecionado.nomeCompleto || '',
        coren: usuarioSelecionado.coren || '',
        ocupacao: usuarioSelecionado.ocupacao || '',
        email: usuarioSelecionado.email || '',
        senha: '',
        dataNascimento: usuarioSelecionado.dataNascimento || '',
        cpf: usuarioSelecionado.cpf || ''
      });
    }
  }, []);

  // Função para atualizar campos do formulário
  const handleInputChange = (campo, valor) => {
    setDadosUsuario(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Função para prosseguir para a página de endereço
  const handleProsseguirParaEndereco = async () => {
    setSalvando(true);
    
    try {
      // Simula chamada à API para salvar os dados pessoais
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Dados pessoais salvos:', dadosUsuario);
      
      // Salva os dados no localStorage para a próxima etapa
      localStorage.setItem('dadosUsuarioAlterados', JSON.stringify(dadosUsuario));
      
      // Navega para a página de alteração de endereço
      router.push('/admin/alterar-endereco');
      
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      alert('Erro ao salvar alterações. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  // Função para voltar à busca
  const handleVoltar = () => {
    router.push('/admin/buscar-usuario');
  };

  // Verifica se todos os campos obrigatórios estão preenchidos
  const todosObrigatoriosPreenchidos = dadosUsuario.nomeCompleto && 
    dadosUsuario.coren && 
    dadosUsuario.ocupacao && 
    dadosUsuario.email && 
    dadosUsuario.dataNascimento && 
    dadosUsuario.cpf;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
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

        {/* Progress */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-sm text-slate-500">Progresso do formulário</span>
          <span className="text-sm text-slate-500">Etapa 1 de 2 - Dados Pessoais</span>
        </div>

        {/* Formulário */}
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
            {/* Nome completo */}
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

            {/* COREN */}
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

            {/* Ocupação */}
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

            {/* Email */}
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

            {/* Senha */}
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

            {/* Data de nascimento e CPF */}
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

            {/* Mensagem de progresso */}
            {salvando && (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-xl flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Salvando dados pessoais...
              </div>
            )}

            {/* Botões */}
            <div className="flex justify-between pt-6">
              <Button
                onClick={handleVoltar}
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-emerald-500 px-6 py-3 rounded-xl font-medium transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>

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