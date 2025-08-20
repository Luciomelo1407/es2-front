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
  
  // Estado para armazenar os dados da sala
  const [dadosSala, setDadosSala] = useState({
    numeroSala: '',
    estoque: ''
  });

  // Estado para controlar o loading da criação
  const [criandoSala, setCriandoSala] = useState(false);

  // Estado para mostrar tela de sucesso
  const [salaCriada, setSalaCriada] = useState(false);

  // Estado para controlar validação
  const [erros, setErros] = useState({});

  // Opções de estoque disponíveis
  const opcoesEstoque = [
    { value: '', label: 'Selecione o estoque' },
    { value: 'principal', label: 'Estoque Principal' },
    { value: 'secundario', label: 'Estoque Secundário' },
    { value: 'emergencia', label: 'Estoque de Emergência' },
    { value: 'backup', label: 'Estoque Backup' }
  ];

  // Função para atualizar campos do formulário
  const handleInputChange = (campo, valor) => {
    setDadosSala(prev => ({
      ...prev,
      [campo]: valor
    }));
    
    // Remove erro do campo quando usuário digita
    if (erros[campo]) {
      setErros(prev => ({
        ...prev,
        [campo]: null
      }));
    }
  };

  // Função para validar formulário
  const validarFormulario = () => {
    const novosErros = {};

    if (!dadosSala.numeroSala.trim()) {
      novosErros.numeroSala = 'Número da sala é obrigatório';
    } else if (dadosSala.numeroSala.trim().length < 1) {
      novosErros.numeroSala = 'Número da sala deve ter pelo menos 1 caractere';
    }

    if (!dadosSala.estoque) {
      novosErros.estoque = 'Estoque é obrigatório';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Função para criar a sala
  const handleCriarSala = async () => {
    if (!validarFormulario()) {
      return;
    }

    setCriandoSala(true);
    
    try {
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Sala criada:', dadosSala);
      
      setSalaCriada(true);
      
      // Volta para o menu principal após 2 segundos
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

  // Função para voltar ao menu
  const handleVoltar = () => {
    router.push('/admin');
  };

  // Verifica se todos os campos obrigatórios estão preenchidos
  const formularioValido = dadosSala.numeroSala.trim() && dadosSala.estoque;

  // Tela de sucesso
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
      {/* Header */}
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

        {/* Formulário */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl">
          <CardHeader className="pb-6 pt-8">
            <CardTitle className="text-center text-xl text-slate-700 font-medium flex items-center justify-center">
              <Plus className="h-6 w-6 mr-2" />
              Informações da sala
            </CardTitle>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <div className="space-y-6">
              {/* Número da Sala */}
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
                {erros.numeroSala && (
                  <p className="text-red-500 text-xs mt-1">{erros.numeroSala}</p>
                )}
              </div>

              {/* Estoque */}
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
                {erros.estoque && (
                  <p className="text-red-500 text-xs mt-1">{erros.estoque}</p>
                )}
              </div>

              {/* Botões */}
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