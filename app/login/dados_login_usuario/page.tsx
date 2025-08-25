"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  MapPin,
  Thermometer,
  Building2,
  Shield,
  Check,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth"; // ajuste o caminho conforme sua estrutura
import axios from "axios";
import { throws } from "assert";
import { Iestoque, ISala } from "@/types/responseTypes";

// Tipo que define a estrutura de dados de temperatura por estoque
type Itemperatura = {
  id: number;
  nome: string;
  temp: string;
  faixa: string;
}

/**
* Componente principal da página de controle de temperatura
* Interface em duas etapas para registro de sala e medições de temperatura dos estoques
*/
export default function SalaInfoPage() {
  // Hook de navegação para redirecionamentos entre páginas
  const router = useRouter();
  // Hook personalizado para gerenciamento de autenticação do usuário
  const { profissional, loading, error, retry } = useAuth();
  // Faixa de temperatura padrão para conservação de vacinas
  const faixa = "2°C a 8°C"

  // Estado para armazenar ID da sala selecionada pelo usuário
  const [salaInfo, setSalaInfo] = useState("");
  // Estado para gerenciar lista de temperaturas dos estoques
  const [temperaturas, setTemperaturas] = useState<Itemperatura[] | null>([{ id: -1, nome: "", temp: "", faixa: "" }]);
  // Estado para controlar qual etapa do formulário está ativa
  const [currentStep, setCurrentStep] = useState(1);

  /**
   * Atualiza o valor de temperatura de um estoque específico
   * Utiliza imutabilidade para manter integridade do estado
   */
  const handleTemperaturaChange = (id: number, valor: string) => {
    // Mapeia array buscando o estoque por ID e atualiza apenas o campo temperatura
    setTemperaturas((prev) =>
      prev.map((est) => (est.id === id ? { ...est, temp: valor } : est)),
    );
  };

  /**
   * Processa avanço para próxima etapa e busca dados dos estoques da sala
   * Faz requisição ao backend para obter informações detalhadas da sala
   */
  const handleNextStep = async () => {
    try {
      // console.log('DEBUG',profissional?.id)
      // Requisição POST para criar registro de dia de trabalho
      // Vincula profissional autenticado à sala selecionada
      const response = await axios.post("http://localhost:3333/dia-trabalho", {
        profissionalId: profissional?.id,
        salaId: salaInfo,
      });

      // Extrai dados da resposta da API
      const sala: ISala = response.data.result.sala
      const estoques: Iestoque[] = response.data.result.estoques
      const diaTrabalho = response.data.result.diaTrabalho

      // Transforma dados dos estoques em estrutura apropriada para o componente
      // Mapeia cada estoque para formato de temperatura com campos vazios
      const estoqueTemp: Itemperatura[] = []
      for (const estoque of estoques) {
        estoqueTemp.push({
          id: estoque.id,
          nome: estoque.tipo,
          temp: "",
          faixa: "0°C a 8°C"
        })
      }
      // Atualiza estado com dados dos estoques obtidos
      setTemperaturas(estoqueTemp)
      console.log('DEBUGG:', { sala, estoques, diaTrabalho })

      // Verifica resposta e avança para próxima etapa se dados válidos
      if (response.status === 404) {
      }

      // Avança para etapa 2 se sala foi informada corretamente
      if (currentStep === 1 && salaInfo.trim()) {
        setCurrentStep(2);
      }
    } catch (error) {
      throw error
    }
  };

  /**
   * Retorna para etapa anterior (seleção de sala)
   * Simples alteração de estado do step atual
   */
  const handlePreviousStep = () => {
    setCurrentStep(1);
  };

  /**
   * Processa submissão final dos dados coletados
   * Exibe informações no console e redireciona para página do usuário
   */
  const handleSubmit = () => {
    // Log dos dados coletados para debugging
    console.log("📍 Sala:", salaInfo);
    console.log("🌡️ Temperaturas:", temperaturas);
    console.log("👤 Usuário:", profissional);

    // Feedback visual de sucesso para o usuário
    alert("Dados salvos com sucesso!");
    // Redireciona para página principal do usuário
    router.push("/usuario");
  };

  // Validações para habilitar/desabilitar botões de navegação
  const isStep1Valid = salaInfo.trim() !== "";
  const isStep2Valid = temperaturas.every((est) => est.temp.trim() !== "");

  /**
   * Determina status da temperatura baseado na faixa ideal
   * Retorna 'ok' se dentro da faixa, 'warning' se fora dos parâmetros
   */
  const getTemperatureStatus = (temp: string, faixa: string) => {
    // Retorna null se temperatura não foi informada
    if (!temp) return null;
    const tempNum = parseFloat(temp);

    // Verifica diferentes faixas de temperatura conforme o tipo de estoque
    if (faixa.includes("-15°C a -25°C")) {
      return tempNum >= -25 && tempNum <= -15 ? "ok" : "warning";
    } else {
      return tempNum >= 2 && tempNum <= 8 ? "ok" : "warning";
    }
  };

  /**
   * Tela de carregamento exibida durante verificação de autenticação
   * Apresenta spinner animado e mensagem informativa
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Verificando autenticação...
          </h2>
          <p className="text-gray-600">Aguarde um momento</p>
        </div>
      </main>
    );
  }

  /**
   * Tela de erro para falhas de autenticação
   * Oferece opções de retry e redirecionamento para login
   */
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

  /**
   * Interface principal do sistema de controle de temperatura
   * Renderizada apenas quando usuário está autenticado com sucesso
   */
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 relative overflow-hidden">
      {/* Elementos decorativos de background para efeito visual */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-emerald-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-60 h-60 bg-teal-200/15 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-200/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Cabeçalho com informações do sistema e usuário logado */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Controle de Temperatura
            </h1>
            <p className="text-emerald-600 font-medium mb-2">
              Sistema de Monitoramento de Estoques de Vacina
            </p>
            {/* Exibe informações do profissional autenticado */}
            {profissional && (
              <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Usuário:</span>{" "}
                  {profissional.nomeCompleto} ({profissional.email})
                </p>
              </div>
            )}
          </div>

          {/* Barra de progresso visual das etapas */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {/* Indicador da etapa 1 com estado dinâmico */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-200 text-gray-500"
                  }`}
              >
                1
              </div>
              {/* Linha de conexão entre etapas */}
              <div
                className={`w-16 h-1 rounded ${currentStep >= 2 ? "bg-emerald-500" : "bg-gray-200"
                  }`}
              ></div>
              {/* Indicador da etapa 2 com estado dinâmico */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-200 text-gray-500"
                  }`}
              >
                2
              </div>
            </div>
          </div>

          {/* Container principal do formulário */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-0 overflow-hidden">
            {/* ETAPA 1: Formulário para seleção da sala de trabalho */}
            {currentStep === 1 && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Informações da Sala
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="sala-input"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Sala/Setor de Trabalho
                    </label>
                    {/* Campo de entrada para ID da sala */}
                    <input
                      id="sala-input"
                      type="number"
                      placeholder="Ex: Sala 101, Farmácia Central, Estoque Principal, UBS Centro..."
                      value={salaInfo}
                      onChange={(e) => setSalaInfo(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-200 text-base"
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Informe o local exato onde você está realizando o
                      monitoramento
                    </p>
                  </div>

                  {/* Confirmação visual da sala selecionada */}
                  {salaInfo && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg animate-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-emerald-600" />
                        <p className="text-sm font-medium text-emerald-700">
                          Sala confirmada:{" "}
                          <span className="font-semibold">{salaInfo}</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Informações sobre próximos passos */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">
                      ℹ️ Próximos passos:
                    </h3>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Você informará as temperaturas dos 4 estoques</li>
                      <li>• Certifique-se de ter acesso aos termômetros</li>
                      <li>
                        • Verifique se os equipamentos estão funcionando
                        corretamente
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Botão para avançar para próxima etapa */}
                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleNextStep}
                    disabled={!isStep1Valid}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                  >
                    Próximo: Temperaturas
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 2: Formulário para registro de temperaturas dos estoques */}
            {currentStep === 2 && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Thermometer className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Controle de Temperatura
                    </h2>
                    <p className="text-sm text-gray-600">
                      <strong>Local:</strong> {salaInfo}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Mapeamento dos estoques para campos de temperatura */}
                  {temperaturas.map((estoque, index) => (
                    <div key={estoque.id} className="space-y-3">
                      <div className="flex items-center gap-3">
                        {/* Identificador visual do estoque */}
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                          {estoque.id}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">
                            {estoque.nome}
                          </h3>
                          <p className="text-xs text-gray-500">
                            Faixa ideal: {faixa}
                          </p>
                        </div>
                      </div>

                      <div className="ml-11 space-y-2">
                        <div className="flex items-center gap-3">
                          {/* Campo de entrada para temperatura */}
                          <input
                            type="number"
                            step="0.1"
                            placeholder="Ex: 2.5, -18.0, 4.2..."
                            value={estoque.temp}
                            onChange={(e) =>
                              handleTemperaturaChange(
                                estoque.id,
                                e.target.value,
                              )
                            }
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-200"
                          />
                          <span className="text-sm text-gray-500 min-w-[30px] font-mono">
                            °C
                          </span>
                        </div>

                        {/* Indicador visual do status da temperatura */}
                        {estoque.temp && (
                          <div
                            className={`text-xs px-2 py-1 rounded ${getTemperatureStatus(
                              estoque.temp,
                              faixa,
                            ) === "ok"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                          >
                            {getTemperatureStatus(
                              estoque.temp,
                              faixa,
                            ) === "ok"
                              ? "✓ Temperatura adequada"
                              : "⚠️ Verificar temperatura - fora da faixa ideal"}
                          </div>
                        )}
                      </div>

                      {/* Divisor entre estoques */}
                      {index < temperaturas.length - 1 && (
                        <hr className="ml-11 border-gray-100" />
                      )}
                    </div>
                  ))}

                  {/* Resumo consolidado das temperaturas informadas */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 ml-11">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      📊 Resumo das Temperaturas
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {temperaturas.map((est) => (
                        <div
                          key={est.id}
                          className="flex justify-between items-center"
                        >
                          <span className="text-gray-600">
                            Estoque {est.id}:
                          </span>
                          <span
                            className={`font-mono px-2 py-1 rounded ${est.temp
                              ? getTemperatureStatus(est.temp, est.faixa) ===
                                "ok"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                              : "bg-gray-100 text-gray-500"
                              }`}
                          >
                            {est.temp ? `${est.temp}°C` : "-- °C"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Botões de navegação da etapa 2 */}
                <div className="flex justify-between items-center mt-8">
                  {/* Botão para retornar à etapa anterior */}
                  <button
                    onClick={handlePreviousStep}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    ← Voltar para Sala
                  </button>

                  {/* Botão para finalizar e submeter dados */}
                  <button
                    onClick={handleSubmit}
                    disabled={!isStep2Valid}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                  >
                    <Check className="w-4 h-4" />
                    Salvar Informações
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Rodapé com identificação do sistema */}
          <div className="text-center mt-6 text-sm text-gray-500">
            Sistema de Gestão de Vacinação • Controle de Temperatura
          </div>
        </div>
      </div>
    </main>
  );
}