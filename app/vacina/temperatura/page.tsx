"use client";
import { useState, useEffect } from "react";
import { Home, Plus, User, Check, AlertCircle, Clock, Calendar, Package } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegistroTemperatura() {
  const router = useRouter();
  
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [estoque, setEstoque] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Auto-preenchimento da data e hora atual
  useEffect(() => {
    const now = new Date();
    const dataAtual = now.toLocaleDateString('pt-BR');
    const horaAtual = now.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    setData(dataAtual);
    setHora(horaAtual);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!estoque.trim()) {
      newErrors.estoque = "Campo obrigatório";
    }
    
    if (!temperatura.trim()) {
      newErrors.temperatura = "Campo obrigatório";
    } else if (isNaN(temperatura) || temperatura < -50 || temperatura > 100) {
      newErrors.temperatura = "Temperatura deve estar entre -50°C e 100°C";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulando uma requisição
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Dados enviados:", { data, hora, estoque, temperatura });
      
      setShowSuccess(true);
      setEstoque("");
      setTemperatura("");
      setErrors({});
      
      // Remove a mensagem de sucesso após 3 segundos
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      console.error("Erro ao registrar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoltar = () => {
    router.push("/usuario");
    console.log("Voltando para página anterior");
  };

  const voltarHome = () => {
    router.push("/usuario");
    console.log("Voltando para home");
  };

  const formatTemperature = (value) => {
    // Remove caracteres não numéricos exceto pontos e vírgulas
    const cleaned = value.replace(/[^\d.,-]/g, '');
    return cleaned;
  };

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
          <span>Temperatura registrada com sucesso!</span>
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
              Registre a temperatura do estoque de forma rápida e precisa
            </p>
          </div>

          {/* Campos superiores com melhor layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                <Calendar className="w-4 h-4" />
                Data
              </label>
              <input
                type="text"
                placeholder="dd/mm/aaaa"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all"
                readOnly
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                <Clock className="w-4 h-4" />
                Hora
              </label>
              <input
                type="text"
                placeholder="00:00"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all"
                readOnly
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                <Package className="w-4 h-4" />
                Estoque *
              </label>
              <input
                type="text"
                placeholder="Ex: Freezer A1"
                value={estoque}
                onChange={(e) => setEstoque(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-gray-700 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.estoque 
                    ? 'border-red-300 bg-red-50 focus:ring-red-400' 
                    : 'border-gray-200 bg-white focus:ring-emerald-400'
                }`}
              />
              {errors.estoque && (
                <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.estoque}
                </p>
              )}
            </div>
          </div>

          {/* Campo de temperatura principal */}
          <div className="bg-gradient-to-r from-emerald-100 to-blue-100 rounded-2xl p-8 mb-8">
            <div className="text-center space-y-4">
              <label className="text-gray-800 font-semibold text-lg block">
                Temperatura (°C) *
              </label>
              <div className="relative max-w-xs mx-auto">
                <input
                  type="text"
                  placeholder="Ex: -18.5"
                  value={temperatura}
                  onChange={(e) => setTemperatura(formatTemperature(e.target.value))}
                  className={`w-full px-6 py-4 rounded-2xl border text-center text-2xl font-bold focus:outline-none focus:ring-4 transition-all ${
                    errors.temperatura 
                      ? 'border-red-300 bg-red-50 focus:ring-red-200 text-red-700' 
                      : 'border-gray-200 bg-white focus:ring-emerald-200 text-gray-800'
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                  °C
                </div>
              </div>
              {errors.temperatura && (
                <p className="text-red-600 text-sm flex items-center justify-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.temperatura}
                </p>
              )}
            </div>
          </div>

          {/* Botões melhorados */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button
              onClick={handleVoltar}
              className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 border border-gray-200"
            >
              ← Voltar
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 ${
                isSubmitting
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
                  Registrar Temperatura
                </>
              )}
            </button>
          </div>

          {/* Dica útil */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-blue-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <strong>Dica:</strong> A temperatura será registrada automaticamente com data e hora atuais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}