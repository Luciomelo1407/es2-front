"use client";
import { useState } from "react";
import { Home, User, MapPin, ArrowRight, CheckCircle2, Building2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegistroSala() {
  const router = useRouter();
  const [salaAtual, setSalaAtual] = useState("");
  const [salaDestino, setSalaDestino] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const salasDisponiveis = [
    "Sala 101 - Enfermaria A",
    "Sala 102 - Enfermaria B", 
    "Sala 103 - UTI",
    "Sala 201 - Pediatria",
    "Sala 202 - Maternidade",
    "Sala 301 - Cirurgia",
    "Farmácia Central",
    "Estoque Principal",
    "Recepção",
    "Ambulatório",
    "Emergência",
    "Laboratório"
  ];

  const handleSubmit = async () => {
    if (!salaAtual || !salaDestino) {
      alert("Por favor, preencha ambas as salas");
      return;
    }

    if (salaAtual === salaDestino) {
      alert("A sala de origem deve ser diferente da sala de destino");
      return;
    }

    setIsSubmitting(true);
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const agora = new Date();
    console.log("Registro de sala enviado:", { 
      salaAtual, 
      salaDestino,
      timestamp: agora.toLocaleString('pt-BR')
    });
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Navegar para /usuario após 3 segundos
    setTimeout(() => {
      router.push("/usuario");
    }, 3000);
  };

  const voltarHome = () => {
    router.push("/usuario");
  };

  const handleVoltar = () => {
    if (salaAtual || salaDestino) {
      if (confirm("Você tem dados não salvos. Deseja realmente voltar?")) {
        router.push("/usuario");
      }
    } else {
      router.push("/usuario");
    }
  };

  const isFormValid = salaAtual && salaDestino && salaAtual !== salaDestino;

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <span className="text-gray-700 font-medium">usuário</span>
          </div>
          
          <button className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors">
            Registrar mudança de sala
          </button>
          
          <button onClick={voltarHome} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Home className="w-8 h-8 text-teal-700" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-emerald-400 rounded-2xl p-8 max-w-4xl mx-auto min-h-[500px] flex flex-col items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Registrado com Sucesso!</h2>
              <p className="text-green-100">Mudança de sala foi registrada no sistema</p>
              <p className="text-green-200 text-sm mt-2">Redirecionando em 3 segundos...</p>
              <div className="bg-white/20 rounded-lg p-4 mt-4">
                <div className="flex items-center justify-center gap-4 text-white text-sm">
                  <span><strong>De:</strong> {salaAtual}</span>
                  <ArrowRight className="w-4 h-4" />
                  <span><strong>Para:</strong> {salaDestino}</span>
                </div>
                <div className="flex items-center justify-center gap-2 mt-2 text-green-200 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>Registrado em: {new Date().toLocaleString('pt-BR')}</span>
                </div>
              </div>
              <button 
                onClick={voltarHome}
                className="mt-4 bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <span className="text-gray-700 font-medium">usuário</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-500" />
          <span className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors cursor-default">
            Registrar mudança de sala
          </span>
        </div>
        
        <button onClick={voltarHome} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Home className="w-8 h-8 text-teal-700" />
        </button>
      </div>

      {/* Conteúdo Principal */}
      <div className="p-6">
        <div className="bg-emerald-400 rounded-2xl p-8 max-w-4xl mx-auto min-h-[600px]">
          
          {/* Título */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Mudança de Sala</h1>
            <p className="text-white/80">Registre sua movimentação entre salas</p>
          </div>

          {/* Formulário */}
          <div className="bg-white/10 rounded-xl p-6 space-y-6">
            
            {/* Sala Atual */}
            <div className="space-y-3">
              <label className="text-white font-semibold flex items-center gap-2 text-lg">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                Em qual sala você está atualmente?
              </label>
              <select
                value={salaAtual}
                onChange={(e) => setSalaAtual(e.target.value)}
                className="w-full p-4 rounded-lg bg-white text-gray-700 text-base border-0 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Selecione a sala atual</option>
                {salasDisponiveis.map((sala) => (
                  <option key={sala} value={sala}>{sala}</option>
                ))}
              </select>
            </div>

            {/* Seta Visual */}
            {salaAtual && (
              <div className="flex justify-center animate-in slide-in-from-top-2 duration-300">
                <div className="bg-white/20 rounded-full p-3">
                  <ArrowRight className="w-8 h-8 text-white" />
                </div>
              </div>
            )}

            {/* Sala Destino */}
            <div className="space-y-3">
              <label className="text-white font-semibold flex items-center gap-2 text-lg">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                Para qual sala você vai?
              </label>
              <select
                value={salaDestino}
                onChange={(e) => setSalaDestino(e.target.value)}
                className="w-full p-4 rounded-lg bg-white text-gray-700 text-base border-0 focus:outline-none focus:ring-2 focus:ring-green-300"
                disabled={!salaAtual}
              >
                <option value="">Selecione a sala de destino</option>
                {salasDisponiveis
                  .filter(sala => sala !== salaAtual)
                  .map((sala) => (
                    <option key={sala} value={sala}>{sala}</option>
                  ))}
              </select>
              {!salaAtual && (
                <p className="text-white/70 text-sm">
                  Primeiro selecione a sala atual
                </p>
              )}
            </div>

            {/* Preview da Mudança */}
            {salaAtual && salaDestino && (
              <div className="bg-white/20 rounded-lg p-4 animate-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Confirmação da Mudança
                </h3>
                <div className="flex items-center justify-between text-white bg-white/10 rounded-lg p-3">
                  <span className="font-medium">{salaAtual}</span>
                  <ArrowRight className="w-5 h-5 text-green-300" />
                  <span className="font-medium">{salaDestino}</span>
                </div>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handleVoltar}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              ← Voltar
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className={`px-8 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                isFormValid && !isSubmitting
                  ? 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Registrando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Registrar Mudança
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}