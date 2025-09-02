"use client";
import { useState, useEffect } from "react";
import { Home, Plus, User, Check, AlertCircle, Clock, Calendar, Package, Thermometer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { parseCookies } from "nookies";

type EstoqueItem = {
  id: number;
  nome: string;
  temperatura: string;
  faixa: string;
};

export default function RegistroTemperatura() {
  const router = useRouter();
  const { profissional, loading, error, retry } = useAuth();
  
  const [salaId, setSalaId] = useState("");
  const [estoques, setEstoques] = useState<EstoqueItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoadingEstoques, setIsLoadingEstoques] = useState(false);

  const buscarEstoques = async (salaIdValue: string) => {
    if (!salaIdValue.trim()) {
      setEstoques([]);
      return;
    }

    setIsLoadingEstoques(true);
    try {
      const token = parseCookies().auth_token;
      const timeout = 10000;
      
      const response = await axios.post(
        "http://localhost:3333/dia-trabalho",
        {
          profissionalId: profissional?.id,
          salaId: salaIdValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout,
        },
      );

      const estoquesDados = response.data.result.estoques;
      const estoquesFormatados: EstoqueItem[] = estoquesDados.map((estoque: any) => ({
        id: estoque.id,
        nome: estoque.tipo,
        temperatura: "",
        faixa: "2°C a 8°C", // Você pode ajustar conforme necessário
      }));
      
      setEstoques(estoquesFormatados);
    } catch (error) {
      console.error("Erro ao buscar estoques:", error);
      setErrors({ sala: "Erro ao carregar estoques da sala" });
      setEstoques([]);
    } finally {
      setIsLoadingEstoques(false);
    }
  };

  const handleSalaChange = (value: string) => {
    setSalaId(value);
    setErrors({});
    buscarEstoques(value);
  };

  const handleTemperaturaChange = (id: number, valor: string) => {
    setEstoques(prev =>
      prev.map(est => 
        est.id === id ? { ...est, temperatura: valor } : est
      )
    );
    setErrors({});
  };

  const getTemperatureStatus = (temp: string, faixa: string) => {
    if (!temp) return null;
    const tempNum = parseFloat(temp);

    if (faixa.includes("-15°C a -25°C")) {
      return tempNum >= -25 && tempNum <= -15 ? "ok" : "warning";
    } else {
      return tempNum >= 2 && tempNum <= 8 ? "ok" : "warning";
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!salaId.trim()) {
      newErrors.sala = "Selecione uma sala";
    }
    
    if (estoques.length === 0) {
      newErrors.estoques = "Nenhum estoque encontrado para esta sala";
    }

    const temperaturasPendentes = estoques.filter(est => !est.temperatura.trim());
    if (temperaturasPendentes.length > 0) {
      newErrors.temperaturas = "Preencha todas as temperaturas";
    }

    // Validar cada temperatura individualmente
    estoques.forEach(estoque => {
      if (estoque.temperatura && (isNaN(Number(estoque.temperatura)) || Number(estoque.temperatura) < -50 || Number(estoque.temperatura) > 100)) {
        newErrors[`temp_${estoque.id}`] = "Temperatura deve estar entre -50°C e 100°C";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const regTemperaturas = estoques.map((estoque) => ({
        estoqueId: estoque.id,
        temperatura: estoque.temperatura,
        profissionalId: profissional?.id,
      }));

      const cookies = parseCookies();
      const token = cookies.auth_token;
      const timeout = 10000;

      const response = await axios.post(
        "http://localhost:3333/reg-temperatura",
        regTemperaturas,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout,
        },
      );

      console.log("Dados enviados:", { salaId, temperaturas: estoques });
      
      setShowSuccess(true);
      setSalaId("");
      setEstoques([]);
      setErrors({});
      
      // Remove a mensagem de sucesso após 3 segundos
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      console.error("Erro ao registrar:", error);
      setErrors({ submit: "Erro ao salvar temperaturas" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoltar = () => {
    router.push("/usuario");
  };

  const voltarHome = () => {
    router.push("/usuario");
  };

  const formatTemperature = (value: string) => {
    const cleaned = value.replace(/[^\d.,-]/g, '');
    return cleaned;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
      {/* Header melhorado */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <span className="text-gray-700 font-medium">Usuário</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          Sistema ativo
        </div>
        
        <button 
          onClick={voltarHome} 
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
          title="Voltar ao início"
        >
          <Home className="w-6 h-6 text-emerald-600" />
        </button>
      </div>

      {/* Mensagem de sucesso */}
      {showSuccess && (
        <div className="mx-6 mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <Check className="w-5 h-5" />
          <span>Temperaturas registradas com sucesso!</span>
        </div>
      )}

      {/* Erro de submissão */}
      {errors.submit && (
        <div className="mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{errors.submit}</span>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="p-6">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-4xl mx-auto border border-gray-100">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Registro de Temperatura
            </h1>
            <p className="text-gray-600 text-center">
              Selecione uma sala e registre as temperaturas dos estoques
            </p>
          </div>

          {/* Campo de sala */}
          <div className="mb-8">
            <div className="space-y-2 max-w-md mx-auto">
              <label className="flex items-center justify-center gap-2 text-gray-700 font-medium text-sm">
                <Package className="w-4 h-4" />
                Sala/Setor *
              </label>
              <input
                type="number"
                placeholder="Ex: 101, 205, 15..."
                value={salaId}
                onChange={(e) => handleSalaChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-gray-700 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.sala 
                    ? 'border-red-300 bg-red-50 focus:ring-red-400' 
                    : 'border-gray-200 bg-white focus:ring-emerald-400'
                }`}
              />
              {errors.sala && (
                <p className="text-red-500 text-xs flex items-center justify-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.sala}
                </p>
              )}
              {isLoadingEstoques && (
                <p className="text-blue-500 text-xs flex items-center justify-center gap-1 mt-1">
                  <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  Carregando estoques...
                </p>
              )}
            </div>
          </div>

          {/* Lista de estoques e temperaturas */}
          {estoques.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
                <Thermometer className="w-5 h-5" />
                Temperaturas dos Estoques
              </h2>
              
              <div className="space-y-4">
                {estoques.map((estoque) => (
                  <div key={estoque.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                        {estoque.id}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{estoque.nome}</h3>
                        <p className="text-xs text-gray-500">Faixa ideal: {estoque.faixa}</p>
                      </div>
                    </div>
                    
                    <div className="ml-11 space-y-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          placeholder="Ex: 2.5, -18.0, 4.2..."
                          value={estoque.temperatura}
                          onChange={(e) => handleTemperaturaChange(estoque.id, formatTemperature(e.target.value))}
                          className={`flex-1 px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
                            errors[`temp_${estoque.id}`]
                              ? 'border-red-300 bg-red-50 focus:ring-red-400'
                              : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'
                          }`}
                        />
                        <span className="text-sm text-gray-500 min-w-[30px] font-mono">°C</span>
                      </div>

                      {errors[`temp_${estoque.id}`] && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors[`temp_${estoque.id}`]}
                        </p>
                      )}

                      {estoque.temperatura && !errors[`temp_${estoque.id}`] && (
                        <div className={`text-xs px-2 py-1 rounded ${
                          getTemperatureStatus(estoque.temperatura, estoque.faixa) === "ok"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {getTemperatureStatus(estoque.temperatura, estoque.faixa) === "ok"
                            ? "✓ Temperatura adequada"
                            : "⚠️ Verificar temperatura - fora da faixa ideal"}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {errors.temperaturas && (
                <p className="text-red-500 text-sm flex items-center justify-center gap-1 mt-4">
                  <AlertCircle className="w-4 h-4" />
                  {errors.temperaturas}
                </p>
              )}
            </div>
          )}

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button
              onClick={handleVoltar}
              className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 border border-gray-200"
            >
              ← Voltar
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || estoques.length === 0}
              className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 ${
                isSubmitting || estoques.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Registrando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Registrar Temperaturas
                </>
              )}
            </button>
          </div>

          {/* Dica útil */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-blue-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <strong>Dica:</strong> Digite o número da sala para carregar automaticamente os estoques disponíveis. As temperaturas serão registradas com data e hora atuais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}