'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Home, User, Syringe, CheckCircle, AlertCircle, Calendar, Package, Building2, Hash, Warehouse, Pill, Route } from 'lucide-react';

export default function InserirVacinaPage() {
  // Função para navegação sem depender do Next.js router
  const navigateTo = (path) => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };
  
  const [formData, setFormData] = useState({
    nomeImunobiologico: '',
    tipoImunobiologico: '',
    fabricante: '',
    lote: '',
    validade: '',
    quantidade: '',
    sigla: '',
    estoqueInserido: '',
    quantidadeDoses: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [touched, setTouched] = useState({});

  const validateField = (field, value) => {
    switch (field) {
      case 'nomeImunobiologico':
        return !value.trim() ? 'Nome do imunobiológico é obrigatório' : '';
      case 'tipoImunobiologico':
        return !value.trim() ? 'Tipo do imunobiológico é obrigatório' : '';
      case 'fabricante':
        return !value.trim() ? 'Fabricante é obrigatório' : '';
      case 'lote':
        return !value.trim() ? 'Lote é obrigatório' : '';
      case 'validade':
        if (!value.trim()) return 'Data de validade é obrigatória';
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!dateRegex.test(value)) return 'Formato inválido (DD/MM/AAAA)';
        const [, day, month, year] = value.match(dateRegex);
        const date = new Date(year, month - 1, day);
        if (date < new Date()) return 'Data de validade não pode ser no passado';
        return '';
      case 'quantidade':
        if (!value.trim()) return 'Quantidade é obrigatória';
        if (isNaN(value) || parseInt(value) <= 0) return 'Quantidade deve ser um número positivo';
        return '';
      case 'sigla':
        return !value.trim() ? 'Sigla é obrigatória' : '';
      case 'estoqueInserido':
        if (!value.trim()) return 'Estoque inserido é obrigatório';
        if (isNaN(value) || parseInt(value) <= 0) return 'Estoque deve ser um número positivo';
        return '';
      case 'quantidadeDoses':
        if (!value.trim()) return 'Quantidade de doses é obrigatória';
        if (isNaN(value) || parseInt(value) <= 0) return 'Quantidade de doses deve ser um número positivo';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (field, value) => {
    // Formatação automática para data
    if (field === 'validade') {
      value = value.replace(/\D/g, '');
      if (value.length >= 3) value = value.replace(/^(\d{2})(\d)/, '$1/$2');
      if (value.length >= 6) value = value.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
      if (value.length > 10) value = value.substring(0, 10);
    }

    // Formatação automática para números
    if (['quantidade', 'estoqueInserido', 'quantidadeDoses'].includes(field)) {
      value = value.replace(/\D/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validação em tempo real
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));

    // Marcar campo como tocado
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleVoltar = () => {
    navigateTo('/usuario');
  };

  const handleSubmeter = async () => {
    // Validar formulário primeiro
    if (!validateForm()) {
      // Marcar todos os campos como tocados para mostrar erros
      const allTouched = {};
      Object.keys(formData).forEach(field => {
        allTouched[field] = true;
      });
      setTouched(allTouched);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simular envio da vacina
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Dados do formulário:', formData);
      
      // Mostrar mensagem de sucesso
      setShowSuccess(true);
      
      // Aguardar um pouco para o usuário ver a mensagem de sucesso
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirecionar para a página do usuário
      navigateTo('/usuario');
      
    } catch (error) {
      console.error('Erro ao submeter:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldIcon = (field) => {
    const icons = {
      nomeImunobiologico: Syringe,
      tipoImunobiologico: Pill,
      fabricante: Building2,
      lote: Hash,
      validade: Calendar,
      quantidade: Package,
      sigla: Hash,
      estoqueInserido: Warehouse,
      quantidadeDoses: Package
    };
    return icons[field] || Package;
  };

  const isFieldValid = (field) => {
    return touched[field] && !errors[field] && formData[field].trim();
  };

  const isFieldInvalid = (field) => {
    return touched[field] && errors[field];
  };

  const completedFields = Object.keys(formData).filter(field => 
    formData[field].trim() && !errors[field]
  ).length;

  const totalFields = Object.keys(formData).length;
  const progressPercentage = (completedFields / totalFields) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-medium text-gray-800">usuário</span>
                <div className="text-sm text-gray-500">Sistema Vacenf</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
                <Syringe className="w-4 h-4 mr-2" />
                Inserir Vacina
              </Badge>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="hover:bg-gray-50"
                onClick={() => navigateTo('/usuario')}
              >
                <Home className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg border">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <Syringe className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Vacenf
            </h1>
          </div>
          <p className="text-gray-600 mt-2">Sistema de Gestão de Imunobiológicos</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progresso do formulário</span>
            <span className="text-sm text-gray-500">{completedFields}/{totalFields} campos</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <Alert className="mb-6 border-emerald-200 bg-emerald-50">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-800">
              Vacina inserida com sucesso! Redirecionando para o painel do usuário...
            </AlertDescription>
          </Alert>
        )}

        {/* Main Form */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Syringe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Cadastro de Imunobiológico</h2>
                <p className="text-emerald-100">Preencha todos os campos obrigatórios</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Nome do imunobiológico */}
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-white font-medium text-base flex items-center gap-2">
                <Syringe className="w-4 h-4" />
                Nome do imunobiológico *
              </Label>
              <div className="relative">
                <Input
                  id="nome"
                  value={formData.nomeImunobiologico}
                  onChange={(e) => handleInputChange('nomeImunobiologico', e.target.value)}
                  className={`bg-white/95 border-2 h-12 pr-10 transition-all duration-200 ${
                    isFieldValid('nomeImunobiologico') ? 'border-emerald-500 bg-emerald-50' : 
                    isFieldInvalid('nomeImunobiologico') ? 'border-red-500 bg-red-50' : 'border-white/50'
                  }`}
                  placeholder="Ex: Vacina contra COVID-19"
                />
                {isFieldValid('nomeImunobiologico') && (
                  <CheckCircle className="absolute right-3 top-3 w-6 h-6 text-emerald-500" />
                )}
                {isFieldInvalid('nomeImunobiologico') && (
                  <AlertCircle className="absolute right-3 top-3 w-6 h-6 text-red-500" />
                )}
              </div>
              {errors.nomeImunobiologico && touched.nomeImunobiologico && (
                <p className="text-red-100 text-sm bg-red-500/20 p-2 rounded">{errors.nomeImunobiologico}</p>
              )}
            </div>

            {/* Tipo do imunobiológico */}
            <div className="space-y-2">
              <Label htmlFor="tipo" className="text-white font-medium text-base flex items-center gap-2">
                <Pill className="w-4 h-4" />
                Tipo do imunobiológico *
              </Label>
              <div className="relative">
                <Input
                  id="tipo"
                  value={formData.tipoImunobiologico}
                  onChange={(e) => handleInputChange('tipoImunobiologico', e.target.value)}
                  className={`bg-white/95 border-2 h-12 pr-10 transition-all duration-200 ${
                    isFieldValid('tipoImunobiologico') ? 'border-emerald-500 bg-emerald-50' : 
                    isFieldInvalid('tipoImunobiologico') ? 'border-red-500 bg-red-50' : 'border-white/50'
                  }`}
                  placeholder="Ex: Vacina viral inativada"
                />
                {isFieldValid('tipoImunobiologico') && (
                  <CheckCircle className="absolute right-3 top-3 w-6 h-6 text-emerald-500" />
                )}
              </div>
              {errors.tipoImunobiologico && touched.tipoImunobiologico && (
                <p className="text-red-100 text-sm bg-red-500/20 p-2 rounded">{errors.tipoImunobiologico}</p>
              )}
            </div>

            {/* Fabricante */}
            <div className="space-y-2">
              <Label htmlFor="fabricante" className="text-white font-medium text-base flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Fabricante *
              </Label>
              <div className="relative">
                <Input
                  id="fabricante"
                  value={formData.fabricante}
                  onChange={(e) => handleInputChange('fabricante', e.target.value)}
                  className={`bg-white/95 border-2 h-12 pr-10 transition-all duration-200 ${
                    isFieldValid('fabricante') ? 'border-emerald-500 bg-emerald-50' : 
                    isFieldInvalid('fabricante') ? 'border-red-500 bg-red-50' : 'border-white/50'
                  }`}
                  placeholder="Ex: Pfizer-BioNTech"
                />
                {isFieldValid('fabricante') && (
                  <CheckCircle className="absolute right-3 top-3 w-6 h-6 text-emerald-500" />
                )}
              </div>
              {errors.fabricante && touched.fabricante && (
                <p className="text-red-100 text-sm bg-red-500/20 p-2 rounded">{errors.fabricante}</p>
              )}
            </div>

            {/* Lote, Validade e Quantidade */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="lote" className="text-white font-medium text-base flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Lote *
                </Label>
                <div className="relative">
                  <Input
                    id="lote"
                    value={formData.lote}
                    onChange={(e) => handleInputChange('lote', e.target.value)}
                    className={`bg-white/95 border-2 h-12 pr-10 transition-all duration-200 ${
                      isFieldValid('lote') ? 'border-emerald-500 bg-emerald-50' : 
                      isFieldInvalid('lote') ? 'border-red-500 bg-red-50' : 'border-white/50'
                    }`}
                    placeholder="Ex: ABC123"
                  />
                  {isFieldValid('lote') && (
                    <CheckCircle className="absolute right-3 top-3 w-6 h-6 text-emerald-500" />
                  )}
                </div>
                {errors.lote && touched.lote && (
                  <p className="text-red-100 text-sm bg-red-500/20 p-2 rounded">{errors.lote}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="validade" className="text-white font-medium text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Validade *
                </Label>
                <div className="relative">
                  <Input
                    id="validade"
                    placeholder="DD/MM/AAAA"
                    value={formData.validade}
                    onChange={(e) => handleInputChange('validade', e.target.value)}
                    className={`bg-white/95 border-2 h-12 pr-10 transition-all duration-200 ${
                      isFieldValid('validade') ? 'border-emerald-500 bg-emerald-50' : 
                      isFieldInvalid('validade') ? 'border-red-500 bg-red-50' : 'border-white/50'
                    } placeholder-gray-400`}
                    maxLength={10}
                  />
                  {isFieldValid('validade') && (
                    <CheckCircle className="absolute right-3 top-3 w-6 h-6 text-emerald-500" />
                  )}
                </div>
                {errors.validade && touched.validade && (
                  <p className="text-red-100 text-sm bg-red-500/20 p-2 rounded">{errors.validade}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantidade" className="text-white font-medium text-base flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Quantidade *
                </Label>
                <div className="relative">
                  <Input
                    id="quantidade"
                    value={formData.quantidade}
                    onChange={(e) => handleInputChange('quantidade', e.target.value)}
                    className={`bg-white/95 border-2 h-12 pr-10 transition-all duration-200 ${
                      isFieldValid('quantidade') ? 'border-emerald-500 bg-emerald-50' : 
                      isFieldInvalid('quantidade') ? 'border-red-500 bg-red-50' : 'border-white/50'
                    }`}
                    placeholder="Ex: 100"
                  />
                  {isFieldValid('quantidade') && (
                    <CheckCircle className="absolute right-3 top-3 w-6 h-6 text-emerald-500" />
                  )}
                </div>
                {errors.quantidade && touched.quantidade && (
                  <p className="text-red-100 text-sm bg-red-500/20 p-2 rounded">{errors.quantidade}</p>
                )}
              </div>
            </div>

            {/* Sigla e Estoque inserido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="sigla" className="text-white font-medium text-base flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Sigla *
                </Label>
                <div className="relative">
                  <Input
                    id="sigla"
                    value={formData.sigla}
                    onChange={(e) => handleInputChange('sigla', e.target.value)}
                    className={`bg-white/95 border-2 h-12 pr-10 transition-all duration-200 ${
                      isFieldValid('sigla') ? 'border-emerald-500 bg-emerald-50' : 
                      isFieldInvalid('sigla') ? 'border-red-500 bg-red-50' : 'border-white/50'
                    }`}
                    placeholder="Ex: COVID19"
                  />
                  {isFieldValid('sigla') && (
                    <CheckCircle className="absolute right-3 top-3 w-6 h-6 text-emerald-500" />
                  )}
                </div>
                {errors.sigla && touched.sigla && (
                  <p className="text-red-100 text-sm bg-red-500/20 p-2 rounded">{errors.sigla}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estoque" className="text-white font-medium text-base flex items-center gap-2">
                  <Warehouse className="w-4 h-4" />
                  Estoque inserido *
                </Label>
                <div className="relative">
                  <Input
                    id="estoque"
                    value={formData.estoqueInserido}
                    onChange={(e) => handleInputChange('estoqueInserido', e.target.value)}
                    className={`bg-white/95 border-2 h-12 pr-10 transition-all duration-200 ${
                      isFieldValid('estoqueInserido') ? 'border-emerald-500 bg-emerald-50' : 
                      isFieldInvalid('estoqueInserido') ? 'border-red-500 bg-red-50' : 'border-white/50'
                    }`}
                    placeholder="Ex: 50"
                  />
                  {isFieldValid('estoqueInserido') && (
                    <CheckCircle className="absolute right-3 top-3 w-6 h-6 text-emerald-500" />
                  )}
                </div>
                {errors.estoqueInserido && touched.estoqueInserido && (
                  <p className="text-red-100 text-sm bg-red-500/20 p-2 rounded">{errors.estoqueInserido}</p>
                )}
              </div>
            </div>

            {/* Quantidade de doses */}
            <div className="space-y-2">
              <Label htmlFor="doses" className="text-white font-medium text-base flex items-center gap-2">
                <Package className="w-4 h-4" />
                Quantidade de doses *
              </Label>
              <div className="relative max-w-md">
                <Input
                  id="doses"
                  value={formData.quantidadeDoses}
                  onChange={(e) => handleInputChange('quantidadeDoses', e.target.value)}
                  className={`bg-white/95 border-2 h-12 pr-10 transition-all duration-200 ${
                    isFieldValid('quantidadeDoses') ? 'border-emerald-500 bg-emerald-50' : 
                    isFieldInvalid('quantidadeDoses') ? 'border-red-500 bg-red-50' : 'border-white/50'
                  }`}
                  placeholder="Ex: 2"
                />
                {isFieldValid('quantidadeDoses') && (
                  <CheckCircle className="absolute right-3 top-3 w-6 h-6 text-emerald-500" />
                )}
              </div>
              {errors.quantidadeDoses && touched.quantidadeDoses && (
                <p className="text-red-100 text-sm bg-red-500/20 p-2 rounded">{errors.quantidadeDoses}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Button
                onClick={handleVoltar}
                variant="outline"
                className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20 h-12 text-lg font-medium"
              >
                Voltar
              </Button>
              
              <Button
                onClick={handleSubmeter}
                disabled={isSubmitting || Object.keys(errors).some(key => errors[key])}
                className="flex-1 bg-white text-emerald-600 hover:bg-gray-50 h-12 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    Salvando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Submeter
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
