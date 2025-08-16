'use client';

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
import { ArrowLeft, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CadastroUsuario = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    coren: '',
    ocupacao: '',
    email: '',
    senha: '',
    dataNascimento: '',
    cpf: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Dados do usuário:', formData);
    // Aqui você implementaria a lógica de cadastro
    alert('Usuário cadastrado com sucesso!');
  };

  const handleVoltar = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between bg-emerald-500 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="text-white text-lg font-medium">Admin</span>
          </div>
          <div className="bg-blue-500 px-6 py-2 rounded-xl">
            <span className="text-white font-medium">Cadastro de usuário:</span>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-4xl mx-auto">
        <Card className="bg-emerald-500 border-0 shadow-xl rounded-3xl">
          <CardHeader className="pb-6 pt-8">
            <CardTitle className="text-center text-2xl font-bold text-slate-800 mb-2">
              Dados pessoais:
            </CardTitle>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <div className="space-y-6">
              {/* Nome Completo */}
              <div className="flex items-center space-x-4">
                <Label className="text-slate-800 font-medium min-w-[140px] text-right">
                  Nome completo:
                </Label>
                <Input
                  value={formData.nomeCompleto}
                  onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                  className="flex-1 bg-white border-2 border-slate-300 rounded-lg h-12"
                  placeholder="Digite o nome completo"
                />
              </div>

              {/* COREN */}
              <div className="flex items-center space-x-4">
                <Label className="text-slate-800 font-medium min-w-[140px] text-right">
                  coren:
                </Label>
                <Input
                  value={formData.coren}
                  onChange={(e) => handleInputChange('coren', e.target.value)}
                  className="flex-1 bg-white border-2 border-slate-300 rounded-lg h-12"
                  placeholder="Digite o COREN"
                />
              </div>

              {/* Ocupação */}
              <div className="flex items-center space-x-4">
                <Label className="text-slate-800 font-medium min-w-[140px] text-right">
                  ocupacao:
                </Label>
                <Select onValueChange={(value) => handleInputChange('ocupacao', value)}>
                  <SelectTrigger className="flex-1 bg-white border-2 border-slate-300 rounded-lg h-12">
                    <SelectValue placeholder="auxiliar de enfermagem" />
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
              <div className="flex items-center space-x-4">
                <Label className="text-slate-800 font-medium min-w-[140px] text-right">
                  email:
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="flex-1 bg-white border-2 border-slate-300 rounded-lg h-12"
                  placeholder="Digite o email"
                />
              </div>

              {/* Senha */}
              <div className="flex items-center space-x-4">
                <Label className="text-slate-800 font-medium min-w-[140px] text-right">
                  senha:
                </Label>
                <div className="flex-1 relative">
                  <Input
                    type="password"
                    value={formData.senha}
                    onChange={(e) => handleInputChange('senha', e.target.value)}
                    className="bg-white border-2 border-slate-300 rounded-lg h-12 pr-12"
                    placeholder="Digite a senha"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-500">
                    ap 5 Linguagens que eu escolhi para focar e
                  </span>
                </div>
              </div>

              {/* Data de Nascimento */}
              <div className="flex items-center space-x-4">
                <Label className="text-slate-800 font-medium min-w-[140px] text-right">
                  data de nasci:
                </Label>
                <Input
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                  className="flex-1 bg-white border-2 border-slate-300 rounded-lg h-12"
                />
              </div>

              {/* Data de Nascimento e CPF */}
              <div className="flex items-center space-x-4">
                <Label className="text-slate-800 font-medium min-w-[140px] text-right">
                  data de nasci:
                </Label>
                <div className="flex-1 flex space-x-4">
                  <Input
                    value="xx/xx/xxxx"
                    className="bg-white border-2 border-slate-300 rounded-lg h-12 flex-1"
                    placeholder="dd/mm/aaaa"
                    disabled
                  />
                  <Label className="text-slate-800 font-medium self-center">
                    cpf:
                  </Label>
                  <Input
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    className="bg-white border-2 border-slate-300 rounded-lg h-12 flex-1"
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-8 px-4">
              <Button
                onClick={handleVoltar}
                className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-2xl font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                voltar
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-2xl font-medium"
              >
                próximo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CadastroUsuario;