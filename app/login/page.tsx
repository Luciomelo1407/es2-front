"use client";
import { useRouter } from 'next/navigation'
import { useState, useEffect } from "react"
import { Eye, EyeOff, User, Lock, Heart, Shield, Users } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function CardDemo() {
  const router = useRouter();

  const frases = [
    "Cuidar é salvar vidas.",
    "Saúde é prioridade.",
    "Empatia também cura.",
    "Cuidar é um ato de amor.",
    "Ouvir é parte do tratamento.",
    "Cada paciente é único.",
    "Cuidar é enxergar além.",
    "O toque também cura.",
    "Cada gesto conta.",
    "Tempo é vida.",
    "Amor gera cura.",
    "Cuidar é esperança.",
    "Tratar pessoas, não só doenças.",
    "Seja o cuidado que você quer.",
    "Empatia conecta.",
    "Ouvir também é medicar.",
    "Pequenos gestos curam.",
    "Saúde é humanidade.",
    "Cuidar com o coração.",
    "Transformar dor em esperança.",
    "Você faz a diferença.",
    "Força além do físico.",
    "Salvar um mundo de cada vez.",
    "Cada plantão importa.",
    "Profissional é farol na tempestade.",
    "Resiliência salva.",
    "Cuidar é vencer.",
    "O esforço vira sorrisos.",
    "Você não está só.",
    "Compromisso vence cansaço.",
    "Seja inspiração.",
    "Conhecimento salva.",
    "Cuidado é linguagem universal.",
    "Mãos e corações constroem saúde.",
    "Dedicação gera esperança.",
    "Um sorriso também cura.",
    "Cada vida vale o esforço.",
    "Você inspira curas.",
    "Onde há vida, há cuidado.",
    "Você é guardião da saúde.",
    "Compromisso salva vidas.",
    "Gratidão é reconhecimento.",
    "Paixão pelo cuidado.",
    "Saúde é chamado.",
    "Você é a linha de frente.",
    "Vida se dedica à vida.",
    "Cada cuidado é valioso.",
    "Ciência e arte juntas.",
    "Servir à vida sempre."
  ]

  const [frase, setFrase] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ id: "", password: "" })
  const [errors, setErrors] = useState({ id: "", password: "" })
  const [showUserDialog, setShowUserDialog] = useState(false) 
  const [dialogStep, setDialogStep] = useState(1) // ✅ Controla qual etapa mostrar
  const [salaInfo, setSalaInfo] = useState("") // ✅ Info da sala
  const [temperaturas, setTemperaturas] = useState([
    { id: 1, nome: "Estoque A - Refrigerador Principal", temp: "" },
    { id: 2, nome: "Estoque B - Freezer -20°C", temp: "" },
    { id: 3, nome: "Estoque C - Geladeira Auxiliar", temp: "" },
    { id: 4, nome: "Estoque D - Câmara Fria", temp: "" }
  ]) // ✅ Array de estoques com temperaturas

  useEffect(() => {
    const indice = Math.floor(Math.random() * frases.length)
    setFrase(frases[indice])
  }, [])

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("🚀 handleSubmit executada!");

    // Validações básicas
    const nextErrors = { id: "", password: "" };
    if (!formData.id.trim()) nextErrors.id = "ID é obrigatório";
    if (!formData.password.trim()) nextErrors.password = "Senha é obrigatória";
    
    if (nextErrors.id || nextErrors.password) {
      console.log("❌ Erros de validação:", nextErrors);
      setErrors(nextErrors);
      return;
    }

    // Checagem de credenciais
    if (formData.id === "admin" && formData.password === "admin") {
      console.log("✅ Login admin bem-sucedido!");
      router.push('/admin');
    } else if (formData.id === "usuario" && formData.password === "usuario") {
      console.log("✅ Login usuário detectado - mostrando dialog");
      setDialogStep(1); // ✅ Começar na etapa 1
      setSalaInfo(""); // ✅ Limpar dados
      setTemperaturas(prev => prev.map(est => ({ ...est, temp: "" }))); // ✅ Limpar temperaturas
      setShowUserDialog(true); // ✅ Abrir o dialog
    } else {
      console.log("❌ Credenciais incorretas");
      setErrors({
        id: !["admin", "usuario"].includes(formData.id) ? "ID incorreto" : "",
        password: (formData.id === "admin" && formData.password !== "admin") || 
                 (formData.id === "usuario" && formData.password !== "usuario") ? "Senha incorreta" : "",
      });
    }
  };

  const handleUserDialogConfirm = () => {
    if (dialogStep === 1) {
      // ✅ Etapa 1: Confirmar sala e ir para temperaturas
      console.log("✅ Sala confirmada:", salaInfo);
      setDialogStep(2);
    } else {
      // ✅ Etapa 2: Finalizar - todas as temperaturas preenchidas, ir para /usuario
      console.log("✅ Todas as temperaturas preenchidas! Dados finais:");
      console.log("📍 Sala:", salaInfo);
      console.log("🌡️ Temperaturas:", temperaturas);
      
      // Fechar dialog e ir para /usuario
      setShowUserDialog(false);
      setDialogStep(1); // Reset para próxima vez
      router.push('/usuario');
    }
  };

  const handleUserDialogCancel = () => {
    console.log("❌ Usuário cancelou na etapa", dialogStep);
    setShowUserDialog(false);
    setDialogStep(1); // Reset para etapa 1
    setSalaInfo(""); // Limpar dados
    setTemperaturas(prev => prev.map(est => ({ ...est, temp: "" }))); // Limpar temperaturas
  };

  const handleTemperaturaChange = (id: any, valor: any) => {
    console.log(`🌡️ Temperatura do estoque ${id} alterada para:`, valor);
    setTemperaturas(prev => 
      prev.map(est => 
        est.id === id ? { ...est, temp: valor} : est
      )
    );
  };

  const voltarParaSala = () => {
    console.log("⬅️ Voltando para seleção de sala");
    setDialogStep(1);
  };

  // ✅ Verificar se todos os campos estão preenchidos na etapa atual
  const podeAvancar = () => {
    if (dialogStep === 1) {
      const temSala = salaInfo.trim() !== "";
      console.log("🔍 Pode avançar etapa 1 (tem sala):", temSala);
      return temSala;
    } else {
      const todasTemperaturas = temperaturas.every(est => est.temp.trim() !== "");
      console.log("🔍 Pode avançar etapa 2 (todas temps):", todasTemperaturas);
      console.log("🌡️ Status das temperaturas:", temperaturas.map(t => ({id: t.id, preenchida: t.temp.trim() !== ""})));
      return todasTemperaturas;
    }
  };

  const handleInputChange = (field: any, value: any) => {
    console.log(`✏️ Campo ${field} alterado para:`, value);
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
    
    // Limpar erros ao digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  }

  return (
    <>
      <div className="w-[400px] shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden">
        {/* Card Header */}
        <div className="space-y-4 pb-6 p-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="text-white font-bold text-xl tracking-tight">
                VacEnf
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-lg font-medium text-gray-800 leading-relaxed">
                {frase}
              </h1>
            </div>
            <p className="text-emerald-600 font-medium">
              Sistema de Gestão de Vacinação
            </p>
          </div>
        </div>

        {/* Card Content */}
        <div className="space-y-4 px-6">
          <div className="space-y-2">
            <label htmlFor="id" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              ID
            </label>
            <input
              id="id"
              type="text"
              placeholder="admin ou usuario"
              value={formData.id}
              onChange={(e) => handleInputChange('id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.id 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'
              }`}
            />
            {errors.id && (
              <p className="text-xs text-red-600 mt-1">
                {errors.id}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 ${
                  errors.password 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'
                }`}
                placeholder="admin ou usuario"
              />
              <button
                type="button"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-100 rounded-r-md transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">
                {errors.password}
              </p>
            )}
          </div>
        </div>

        {/* Botões entrar e cadastrar */}
        <div className="flex flex-col gap-3 pt-2 p-6">
          <button 
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-2.5 rounded-md transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            Entrar 
          </button>    
        </div>
      </div>

      {/* ✅ AlertDialog com fluxo em etapas - Controle manual de abertura */}
      <AlertDialog open={showUserDialog} onOpenChange={() => {}}>
        <AlertDialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          
          {/* ✅ ETAPA 1: Informar Sala */}
          {dialogStep === 1 && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>📍 Informação da Sala</AlertDialogTitle>
                <AlertDialogDescription>
                  Informe em qual sala você está realizando o controle de temperatura dos estoques de vacina.
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="sala-input" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Sala/Setor
                  </label>
                  <input
                    id="sala-input"
                    type="text"
                    placeholder="Ex: Sala 101, Farmácia Central, Estoque Principal..."
                    value={salaInfo}
                    onChange={(e) => setSalaInfo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-200"
                    autoFocus
                  />
                </div>
                {salaInfo && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                    <p className="text-sm text-emerald-700">
                      📍 <strong>Sala selecionada:</strong> {salaInfo}
                    </p>
                  </div>
                )}
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleUserDialogCancel}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleUserDialogConfirm}
                  disabled={!podeAvancar()}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo: Temperaturas →
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}

          {/* ✅ ETAPA 2: Informar Temperaturas */}
          {dialogStep === 2 && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>🌡️ Temperaturas dos Estoques</AlertDialogTitle>
                <AlertDialogDescription>
                  <strong>Sala:</strong> {salaInfo}<br/>
                  Informe a temperatura atual de cada estoque de vacina:
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="space-y-4 py-4">
                {temperaturas.map((estoque) => (
                  <div key={estoque.id} className="space-y-2">
                    <label 
                      htmlFor={`temp-${estoque.id}`} 
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {estoque.id}
                      </div>
                      {estoque.nome}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id={`temp-${estoque.id}`}
                        type="number"
                        step="0.1"
                        placeholder="Ex: 2.5, -18.0, 4.2..."
                        value={estoque.temp}
                        onChange={(e) => handleTemperaturaChange(estoque.id, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-200"
                      />
                      <span className="text-sm text-gray-500 min-w-[30px]">°C</span>
                    </div>
                    {estoque.temp && (
                      <p className={`text-xs ${
                        parseFloat(estoque.temp) >= -25 && parseFloat(estoque.temp) <= 8 
                          ? 'text-emerald-600' 
                          : 'text-amber-600'
                      }`}>
                        {parseFloat(estoque.temp) >= -25 && parseFloat(estoque.temp) <= 8 
                          ? '✓ Temperatura adequada' 
                          : '⚠️ Verifique a temperatura'}
                      </p>
                    )}
                  </div>
                ))}
                
                {/* ✅ Resumo das temperaturas preenchidas */}
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-sm font-medium text-gray-700 mb-2">📊 Resumo:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {temperaturas.map(est => (
                      <div key={est.id} className="flex justify-between">
                        <span>Estoque {est.id}:</span>
                        <span className="font-mono">
                          {est.temp ? `${est.temp}°C` : '-- °C'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <AlertDialogFooter className="flex justify-between">
                <button 
                  onClick={voltarParaSala}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Voltar para Sala
                </button>
                <div className="flex gap-2">
                  <AlertDialogCancel onClick={handleUserDialogCancel}>
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleUserDialogConfirm}
                    disabled={!podeAvancar()}
                    className="disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-700"
                  >
                    ✅ Ir para Área do Usuário
                  </AlertDialogAction>
                </div>
              </AlertDialogFooter>
            </>
          )}
          
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Seção da imagem */}
      <div className="relative h-64 lg:h-auto lg:min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-800/30 z-10"></div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Abertura_da_Campanha_de_Vacina%C3%A7%C3%A3o_contra_Covid-19_em_S%C3%A3o_Jos%C3%A9_dos_Campos_-_50856175627.jpg/960px-Abertura_da_Campanha_de_Vacina%C3%A7%C3%A3o_contra_Covid-19_em_S%C3%A3o_Jos%C3%A5_dos_Campos_-_50856175627.jpg?20210122040450"
          alt="Profissional de saúde aplicando vacina"
          className="w-full h-full object-cover"
        />
        
        {/* Overlay com informações */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 z-20 bg-gradient-to-t from-black/60 to-transparent">
          <div className="text-white space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">
              Protegendo Vidas
            </h2>
            <p className="text-sm lg:text-base text-white/90 max-w-md">
              Sistema integrado para gestão de vacinação, garantindo cuidado e proteção para toda a comunidade.
            </p>
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>Cuidadoso</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Acessível</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção do formulário */}
      <div className="flex items-center justify-center p-6 lg:p-10 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-teal-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-200/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <CardDemo />
        </div>
      </div>
    </main>
  )
}