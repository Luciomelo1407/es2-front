'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Thermometer, Package, Refrigerator, User, CheckCircle, Shield } from 'lucide-react';
import { useRouter } from "next/navigation";

/**
* Componente principal do mapa de temperatura
* Gerencia visualização e navegação entre diferentes tipos de monitoramento de temperatura
*/
const MapaTemperatura = () => {
  // Hook de navegação para redirecionamento entre páginas
  const router = useRouter();

  // Estado para controle da aba ativa no sistema de abas
  // Define qual tipo de monitoramento está sendo exibido atualmente
  const [abaAtiva, setAbaAtiva] = useState('caixa-termica');

  /**
   * Estado para armazenar dados específicos da caixa térmica
   * Centraliza informações de monitoramento deste tipo de equipamento
   */
  const [dadosCaixaTermica, setDadosCaixaTermica] = useState({
    caixa: '',
    dias: Array(3).fill().map(() => ({
      dia: '',
      mes: '',
      ano: '',
      registros: Array(12).fill().map(() => ({
        horario: '',
        temperaturaMaxima: '',
        temperaturaMinima: '',
        momento: '',
        assinatura: '',
        observacoes: ''
      }))
    }))
  });

  // Estado para dados da câmara refrigerada
  const [dadosCamara, setDadosCamara] = useState({
    unidade: '',
    mes: '',
    ano: '',
    equipamento: '',
    numeroIdentificacao: '',
    tombamento: '',
    registrosManha: Array(31).fill().map(() => ({
      maxima: '',
      minima: '',
      momento: '',
      responsavel: ''
    })),
    registrosTarde: Array(31).fill().map(() => ({
      maxima: '',
      minima: '',
      momento: '',
      responsavel: ''
    })),
    observacoes: ''
  });

  /**
 * Navega de volta para a página principal do usuário
 * Executa redirecionamento com log para rastreamento de navegação
 */
  const handleVoltar = () => {
    // Utiliza o router do Next.js para navegação programática
    router.push("/usuario");

    // Log para debug e monitoramento do fluxo de navegação
    console.log('Voltando...');
  };

  /**
* Processa o envio dos dados de temperatura baseado na aba ativa
* Implementa lógica condicional para diferentes tipos de equipamentos
*/
  const handleSubmeter = () => {
    // Verifica qual tipo de equipamento está sendo monitorado
    if (abaAtiva === 'caixa-termica') {
      // Log específico para dados de caixa térmica
      console.log('Submetendo dados da caixa térmica:', dadosCaixaTermica);
    } else {
      // Log para dados de câmara quando não é caixa térmica
      console.log('Submetendo dados da câmara:', dadosCamara);
    }

    // Feedback visual simples para confirmação do envio
    alert('Dados submetidos com sucesso!');

    // Redirecionamento automático para página do usuário após submissão
    router.push("/usuario");
  };

  /**
 * Atualiza dados da caixa térmica de forma hierárquica
 * Permite modificação em diferentes níveis: geral, dia específico ou registro específico
 */
  const updateCaixaTermica = (campo, valor, diaIndex = null, registroIndex = null) => {
    setDadosCaixaTermica(prev => {
      // Atualização de registro específico dentro de um dia específico
      if (diaIndex !== null && registroIndex !== null) {
        // Cria cópia do array de dias para manter imutabilidade
        const newDias = [...prev.dias];

        // Atualiza o campo específico do registro no dia correspondente
        newDias[diaIndex].registros[registroIndex][campo] = valor;

        // Retorna novo estado preservando outras propriedades
        return { ...prev, dias: newDias };
      }
      // Atualização de campo geral de um dia específico
      else if (diaIndex !== null) {
        // Cria cópia do array de dias
        const newDias = [...prev.dias];

        // Atualiza campo no nível do dia
        newDias[diaIndex][campo] = valor;

        return { ...prev, dias: newDias };
      }
      // Atualização de campo no nível raiz da caixa térmica
      else {
        // Atualiza propriedade diretamente no objeto principal
        return { ...prev, [campo]: valor };
      }
    });
  };

  /**
  * Atualiza dados da câmara com estrutura flexível por tipo de registro
  * Permite modificação tanto em campos gerais quanto em registros específicos por categoria
  */
  const updateCamara = (campo, valor, tipo = null, index = null) => {
    setDadosCamara(prev => {
      // Atualização de registro específico dentro de um tipo de monitoramento
      if (tipo && index !== null) {
        // Cria cópia do array de registros do tipo específico para manter imutabilidade
        const newRegistros = [...prev[tipo]];

        // Atualiza o campo específico no registro indicado pelo índice
        newRegistros[index][campo] = valor;

        // Retorna novo estado preservando outras categorias e o tipo atualizado
        return { ...prev, [tipo]: newRegistros };
      }
      // Atualização de campo no nível raiz da câmara
      else {
        // Atualiza propriedade diretamente no objeto principal da câmara
        return { ...prev, [campo]: valor };
      }
    });
  };

  /**
* Renderiza a interface de monitoramento de caixa térmica
* Exibe formulário estruturado para registro de temperaturas por dias e horários
*/
  const renderCaixaTermica = () => (
    <div className="space-y-6">
      {/* Campo CAIXA */}
      <div className="mb-6">
        <Label className="text-slate-700 font-medium text-sm mb-2 block">
          CAIXA
        </Label>
        <Input
          value={dadosCaixaTermica.caixa}
          onChange={(e) => updateCaixaTermica('caixa', e.target.value)}
          className="bg-white border border-gray-300 rounded-lg h-10"
          placeholder="Identificação da caixa"
        />
      </div>

      {/* Tabela de registros para 3 dias */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {dadosCaixaTermica.dias.map((dia, index) => (
                <th key={index} className="border border-gray-300 bg-gray-100 p-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">Dia</Label>
                      <Input
                        value={dia.dia}
                        onChange={(e) => updateCaixaTermica('dia', e.target.value, index)}
                        className="h-8 text-xs"
                        placeholder="DD"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Mês</Label>
                      <Input
                        value={dia.mes}
                        onChange={(e) => updateCaixaTermica('mes', e.target.value, index)}
                        className="h-8 text-xs"
                        placeholder="MM"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Ano</Label>
                      <Input
                        value={dia.ano}
                        onChange={(e) => updateCaixaTermica('ano', e.target.value, index)}
                        className="h-8 text-xs"
                        placeholder="YYYY"
                      />
                    </div>
                  </div>
                </th>
              ))}
            </tr>
            <tr>
              {dadosCaixaTermica.dias.map((_, index) => (
                <th key={index} className="border border-gray-300 bg-gray-50">
                  <div className="grid grid-cols-5 gap-1 p-2 text-xs">
                    <div className="font-semibold">Horário</div>
                    <div className="font-semibold">Temp. Máxima</div>
                    <div className="font-semibold">Temp. Mínima</div>
                    <div className="font-semibold">Momento</div>
                    <div className="font-semibold">Assinatura</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array(12).fill().map((_, rowIndex) => (
              <tr key={rowIndex}>
                {dadosCaixaTermica.dias.map((dia, diaIndex) => (
                  <td key={diaIndex} className="border border-gray-300 p-1">
                    <div className="grid grid-cols-5 gap-1">
                      <Input
                        value={dia.registros[rowIndex].horario}
                        onChange={(e) => updateCaixaTermica('horario', e.target.value, diaIndex, rowIndex)}
                        className="h-8 text-xs"
                        placeholder="00:00"
                      />
                      <Input
                        value={dia.registros[rowIndex].temperaturaMaxima}
                        onChange={(e) => updateCaixaTermica('temperaturaMaxima', e.target.value, diaIndex, rowIndex)}
                        className="h-8 text-xs"
                        placeholder="°C"
                      />
                      <Input
                        value={dia.registros[rowIndex].temperaturaMinima}
                        onChange={(e) => updateCaixaTermica('temperaturaMinima', e.target.value, diaIndex, rowIndex)}
                        className="h-8 text-xs"
                        placeholder="°C"
                      />
                      <Input
                        value={dia.registros[rowIndex].momento}
                        onChange={(e) => updateCaixaTermica('momento', e.target.value, diaIndex, rowIndex)}
                        className="h-8 text-xs"
                        placeholder="Momento"
                      />
                      <Input
                        value={dia.registros[rowIndex].assinatura}
                        onChange={(e) => updateCaixaTermica('assinatura', e.target.value, diaIndex, rowIndex)}
                        className="h-8 text-xs"
                        placeholder="Assinatura"
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /**
* Renderiza a interface de monitoramento de câmara refrigerada
* Exibe controles para registro de temperaturas em ambiente de refrigeração controlada
*/
  const renderCamaraRefrigerada = () => (
    <div className="space-y-6">
      {/* Cabeçalho da câmara */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Label className="text-slate-700 font-medium text-sm mb-2 block">Unidade</Label>
          <Input
            value={dadosCamara.unidade}
            onChange={(e) => updateCamara('unidade', e.target.value)}
            className="bg-white border border-gray-300 rounded-lg h-10"
          />
        </div>
        <div>
          <Label className="text-slate-700 font-medium text-sm mb-2 block">Mês</Label>
          <Input
            value={dadosCamara.mes}
            onChange={(e) => updateCamara('mes', e.target.value)}
            className="bg-white border border-gray-300 rounded-lg h-10"
          />
        </div>
        <div>
          <Label className="text-slate-700 font-medium text-sm mb-2 block">Ano</Label>
          <Input
            value={dadosCamara.ano}
            onChange={(e) => updateCamara('ano', e.target.value)}
            className="bg-white border border-gray-300 rounded-lg h-10"
          />
        </div>
        <div>
          <Label className="text-slate-700 font-medium text-sm mb-2 block">Equipamento</Label>
          <Input
            value={dadosCamara.equipamento}
            onChange={(e) => updateCamara('equipamento', e.target.value)}
            className="bg-white border border-gray-300 rounded-lg h-10"
          />
        </div>
        <div>
          <Label className="text-slate-700 font-medium text-sm mb-2 block">N° de Identificação</Label>
          <Input
            value={dadosCamara.numeroIdentificacao}
            onChange={(e) => updateCamara('numeroIdentificacao', e.target.value)}
            className="bg-white border border-gray-300 rounded-lg h-10"
          />
        </div>
        <div>
          <Label className="text-slate-700 font-medium text-sm mb-2 block">Tombamento/N° de Série</Label>
          <Input
            value={dadosCamara.tombamento}
            onChange={(e) => updateCamara('tombamento', e.target.value)}
            className="bg-white border border-gray-300 rounded-lg h-10"
          />
        </div>
      </div>

      {/* Tabela da câmara refrigerada */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-100 p-2 font-semibold">
                ESPECIFICAÇÃO DA TEMPERATURA
              </th>
              {Array.from({ length: 16 }, (_, i) => i + 1).map(day => (
                <th key={day} className="border border-gray-300 bg-gray-100 p-1 text-xs w-12">
                  {day}
                </th>
              ))}
              <th className="border border-gray-300 bg-gray-100 p-2 font-semibold">
                OBSERVAÇÕES
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Manhã (7 horas) */}
            <tr className="bg-gray-50">
              <td rowSpan={4} className="border border-gray-300 p-2 font-semibold text-center">
                MANHÃ<br />(7 horas)
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 text-xs bg-gray-50">Máxima</td>
              {Array.from({ length: 15 }, (_, i) => (
                <td key={i} className="border border-gray-300 p-1">
                  <Input
                    value={dadosCamara.registrosManha[i]?.maxima || ''}
                    onChange={(e) => updateCamara('maxima', e.target.value, 'registrosManha', i)}
                    className="h-6 text-xs border-0 p-0 text-center"
                  />
                </td>
              ))}
              <td rowSpan={8} className="border border-gray-300 p-1">
                <textarea
                  value={dadosCamara.observacoes}
                  onChange={(e) => updateCamara('observacoes', e.target.value)}
                  className="w-full h-32 text-xs border-0 resize-none p-1"
                  placeholder="Observações..."
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 text-xs bg-gray-50">Mínima</td>
              {Array.from({ length: 15 }, (_, i) => (
                <td key={i} className="border border-gray-300 p-1">
                  <Input
                    value={dadosCamara.registrosManha[i]?.minima || ''}
                    onChange={(e) => updateCamara('minima', e.target.value, 'registrosManha', i)}
                    className="h-6 text-xs border-0 p-0 text-center"
                  />
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 text-xs bg-gray-50">Responsável</td>
              {Array.from({ length: 15 }, (_, i) => (
                <td key={i} className="border border-gray-300 p-1">
                  <Input
                    value={dadosCamara.registrosManha[i]?.responsavel || ''}
                    onChange={(e) => updateCamara('responsavel', e.target.value, 'registrosManha', i)}
                    className="h-6 text-xs border-0 p-0 text-center"
                  />
                </td>
              ))}
            </tr>

            {/* Tarde (17 horas) */}
            <tr className="bg-gray-50">
              <td rowSpan={4} className="border border-gray-300 p-2 font-semibold text-center">
                TARDE<br />(17 horas)
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 text-xs bg-gray-50">Máxima</td>
              {Array.from({ length: 15 }, (_, i) => (
                <td key={i} className="border border-gray-300 p-1">
                  <Input
                    value={dadosCamara.registrosTarde[i]?.maxima || ''}
                    onChange={(e) => updateCamara('maxima', e.target.value, 'registrosTarde', i)}
                    className="h-6 text-xs border-0 p-0 text-center"
                  />
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 text-xs bg-gray-50">Mínima</td>
              {Array.from({ length: 15 }, (_, i) => (
                <td key={i} className="border border-gray-300 p-1">
                  <Input
                    value={dadosCamara.registrosTarde[i]?.minima || ''}
                    onChange={(e) => updateCamara('minima', e.target.value, 'registrosTarde', i)}
                    className="h-6 text-xs border-0 p-0 text-center"
                  />
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 text-xs bg-gray-50">Responsável</td>
              {Array.from({ length: 15 }, (_, i) => (
                <td key={i} className="border border-gray-300 p-1">
                  <Input
                    value={dadosCamara.registrosTarde[i]?.responsavel || ''}
                    onChange={(e) => updateCamara('responsavel', e.target.value, 'registrosTarde', i)}
                    className="h-6 text-xs border-0 p-0 text-center"
                  />
                </td>
              ))}
            </tr>

            {/* Segunda quinzena */}
            <tr>
              <th className="border border-gray-300 bg-gray-100 p-2 font-semibold">
                ESPECIFICAÇÃO DE TEMPERATURA
              </th>
              {Array.from({ length: 15 }, (_, i) => i + 17).map(day => (
                <th key={day} className="border border-gray-300 bg-gray-100 p-1 text-xs">
                  {day > 31 ? '' : day}
                </th>
              ))}
              <th className="border border-gray-300 bg-gray-100"></th>
            </tr>

            {/* Manhã - Segunda quinzena */}
            <tr className="bg-gray-50">
              <td rowSpan={4} className="border border-gray-300 p-2 font-semibold text-center">
                MANHÃ<br />(7 horas)
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 text-xs bg-gray-50">Máxima</td>
              {Array.from({ length: 15 }, (_, i) => (
                <td key={i + 16} className="border border-gray-300 p-1">
                  <Input
                    value={dadosCamara.registrosManha[i + 16]?.maxima || ''}
                    onChange={(e) => updateCamara('maxima', e.target.value, 'registrosManha', i + 16)}
                    className="h-6 text-xs border-0 p-0 text-center"
                  />
                </td>
              ))}
              <td className="border border-gray-300"></td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 text-xs bg-gray-50">Mínima</td>
              {Array.from({ length: 15 }, (_, i) => (
                <td key={i + 16} className="border border-gray-300 p-1">
                  <Input
                    value={dadosCamara.registrosManha[i + 16]?.minima || ''}
                    onChange={(e) => updateCamara('minima', e.target.value, 'registrosManha', i + 16)}
                    className="h-6 text-xs border-0 p-0 text-center"
                  />
                </td>
              ))}
              <td className="border border-gray-300"></td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 text-xs bg-gray-50">Responsável</td>
              {Array.from({ length: 15 }, (_, i) => (
                <td key={i + 16} className="border border-gray-300 p-1">
                  <Input
                    value={dadosCamara.registrosManha[i + 16]?.responsavel || ''}
                    onChange={(e) => updateCamara('responsavel', e.target.value, 'registrosManha', i + 16)}
                    className="h-6 text-xs border-0 p-0 text-center"
                  />
                </td>
              ))}
              <td className="border border-gray-300"></td>
            </tr>

            {/* Tarde - Segunda quinzena */}
            <tr className="bg-gray-50">
              <td rowSpan={4} className="border border-gray-300 p-2 font-semibold text-center">
                TARDE<br />(17 horas)
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 text-xs bg-gray-50">Máxima</td>
              {Array.from({ length: 15 }, (_, i) => (
                <td key={i + 16} className="border border-gray-300 p-1">
                  <Input
                    value={dadosCamara.registrosTarde[i + 16]?.maxima || ''}
                    onChange={(e) => updateCamara('maxima', e.target.value, 'registrosTarde', i + 16)}
                    className="h-6 text-xs border-0 p-0 text-center"
                  />
                </td>
              ))}
              <td className="border border-gray-300"></td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 text-xs bg-gray-50">Mínima</td>
              {Array.from({ length: 15 }, (_, i) => (
                <td key={i + 16} className="border border-gray-300 p-1">
                  <Input
                    value={dadosCamara.registrosTarde[i + 16]?.minima || ''}
                    onChange={(e) => updateCamara('minima', e.target.value, 'registrosTarde', i + 16)}
                    className="h-6 text-xs border-0 p-0 text-center"
                  />
                </td>
              ))}
              <td className="border border-gray-300"></td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 text-xs bg-gray-50">Responsável</td>
              {Array.from({ length: 15 }, (_, i) => (
                <td key={i + 16} className="border border-gray-300 p-1">
                  <Input
                    value={dadosCamara.registrosTarde[i + 16]?.responsavel || ''}
                    onChange={(e) => updateCamara('responsavel', e.target.value, 'registrosTarde', i + 16)}
                    className="h-6 text-xs border-0 p-0 text-center"
                  />
                </td>
              ))}
              <td className="border border-gray-300"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Sistema */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo e Nome do Sistema */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">VacEnf</h1>
                <p className="text-sm text-gray-600">Sistema de Gestão de Vacinação</p>
              </div>
            </div>

            {/* Info do Usuário */}
            <div className="flex items-center">
              <User className="h-5 w-5 text-teal-500 mr-2" />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">Usuário</p>
                <p className="text-xs text-gray-600">ID: 201547</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Status */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Status */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                  <Shield className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-lg font-semibold text-gray-800">Seguro</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Temperatura */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Thermometer className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Temperatura</p>
                  <p className="text-lg font-semibold text-gray-800">2-8°C</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Última Atualização */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Última atualização</p>
                  <p className="text-lg font-semibold text-gray-800">Agora</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seção Principal - Mapa de Temperatura */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Mapa de Temperatura</h2>
          <p className="text-gray-600 mb-6">Registre e acompanhe as temperaturas dos equipamentos</p>

          {/* Abas */}
          <div className="flex mb-6 bg-white border border-gray-200 rounded-lg p-1 inline-flex">
            <button
              onClick={() => setAbaAtiva('caixa-termica')}
              className={`flex items-center px-4 py-2 rounded-md font-medium transition-all duration-200 ${abaAtiva === 'caixa-termica'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <Package className="h-4 w-4 mr-2" />
              Caixa Térmica
            </button>
            <button
              onClick={() => setAbaAtiva('camara-refrigerada')}
              className={`flex items-center px-4 py-2 rounded-md font-medium transition-all duration-200 ${abaAtiva === 'camara-refrigerada'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <Refrigerator className="h-4 w-4 mr-2" />
              Câmara Refrigerada
            </button>
          </div>

          {/* Card Principal */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-lg font-semibold text-gray-800">
                {abaAtiva === 'caixa-termica' ? 'Registro - Caixa Térmica' : 'Registro - Câmara Refrigerada'}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              {abaAtiva === 'caixa-termica' ? renderCaixaTermica() : renderCamaraRefrigerada()}

              {/* Botões de ação */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleVoltar}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>

                <Button
                  onClick={handleSubmeter}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Salvar Registro
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapaTemperatura;