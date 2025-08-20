'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  ArrowLeft, 
  Save,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const AlterarSalaForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    numeroSala: '',
    estoque: '',
    status: 'Ativa'
  });

  // Dados simulados das salas
  const roomsDatabase = {
    1: { id: 1, numero: '101', estoque: 'Estoque Principal', status: 'Ativa' },
    2: { id: 2, numero: 'A-15', estoque: 'Estoque Secundário', status: 'Ativa' },
    3: { id: 3, numero: 'Sala 1', estoque: 'Estoque Principal', status: 'Ativa' },
    4: { id: 4, numero: 'B-22', estoque: 'Estoque Auxiliar', status: 'Inativa' },
    5: { id: 5, numero: '205', estoque: 'Estoque Principal', status: 'Ativa' },
    6: { id: 6, numero: 'C-10', estoque: 'Estoque de Emergência', status: 'Ativa' }
  };

  const estoqueOptions = [
    'Estoque Principal',
    'Estoque Secundário',
    'Estoque Auxiliar',
    'Estoque de Emergência'
  ];

  const statusOptions = [
    { value: 'Ativa', label: 'Ativa', color: 'text-green-600' },
    { value: 'Inativa', label: 'Inativa', color: 'text-gray-600' },
    { value: 'Manutenção', label: 'Em Manutenção', color: 'text-yellow-600' }
  ];

  // Carregar dados da sala
  useEffect(() => {
    if (roomId && roomsDatabase[roomId]) {
      const room = roomsDatabase[roomId];
      setFormData({
        numeroSala: room.numero,
        estoque: room.estoque,
        status: room.status
      });
    }
    setLoading(false);
  }, [roomId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.numeroSala.trim()) {
      alert('Por favor, preencha o número da sala');
      return;
    }
    
    if (!formData.estoque) {
      alert('Por favor, selecione um estoque');
      return;
    }

    setSaving(true);
    
    // Simular salvamento com delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Dados alterados:', {
      salaId: roomId,
      ...formData
    });

    setSaving(false);
    
    // Mostrar feedback de sucesso
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
    successMessage.innerHTML = '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Sala alterada com sucesso!';
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      document.body.removeChild(successMessage);
      router.push('/admin');
    }, 2000);
  };

  const handleVoltar = () => {
    router.push('/admin/buscar-sala');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados da sala...</p>
        </div>
      </div>
    );
  }

  if (!roomsDatabase[roomId]) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="bg-white shadow-sm border-0 text-center p-8 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sala não encontrada</h3>
          <p className="text-gray-600 mb-6">A sala solicitada não foi encontrada no sistema.</p>
          <Button onClick={() => router.push('/admin/buscar-sala')} variant="outline">
            Voltar à Busca
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVoltar}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à Busca
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
            <span className="text-gray-700 font-medium">Admin</span>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
            <Building2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Alterar Dados da Sala
          </h1>
          <p className="text-gray-600">
            Modifique as informações da sala selecionada
          </p>
        </div>

        {/* Form Card */}
        <Card className="bg-white shadow-sm border-0">
          <CardHeader className="pb-6">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald-600" />
              Informações da Sala
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Número da Sala */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Número da Sala *
              </label>
              <Input
                type="text"
                placeholder="Ex: 101, A-15, Sala 1"
                value={formData.numeroSala}
                onChange={(e) => handleInputChange('numeroSala', e.target.value)}
                className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            {/* Estoque */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Estoque *
              </label>
              <Select
                value={formData.estoque}
                onValueChange={(value) => handleInputChange('estoque', value)}
              >
                <SelectTrigger className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                  <SelectValue placeholder="Selecione o estoque" />
                </SelectTrigger>
                <SelectContent>
                  {estoqueOptions.map((estoque) => (
                    <SelectItem key={estoque} value={estoque}>
                      {estoque}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Status da Sala *
              </label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <span className={status.color}>{status.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Room ID Display */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">ID da Sala:</span>
                <span className="font-mono text-gray-900 font-medium">#{roomId?.padStart(3, '0')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <Button
            variant="outline"
            onClick={handleVoltar}
            className="flex-1 h-11 border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Salvando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Salvar Alterações
              </div>
            )}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Sistema Vacenf - Gestão de Imunobiológicos
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlterarSalaForm;