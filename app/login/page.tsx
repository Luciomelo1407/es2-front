"use client";
import { useRouter } from 'next/navigation'
import { useState, useEffect } from "react"
import { Eye, EyeOff, User, Lock, Heart, Shield, Users } from "lucide-react"

export function MeuComponente() {
  const router = useRouter()
  
  const irParaOutraPagina = () => {
    router.push('/usuario')
  }
  
  return (
    <button 
      onClick={irParaOutraPagina}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      Navegar programaticamente
    </button>
  )
}

export function CardDemo() {
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
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ id: "", password: "" })
  const [errors, setErrors] = useState({ id: "", password: "" })

  useEffect(() => {
    const indice = Math.floor(Math.random() * frases.length)
    setFrase(frases[indice])
  }, [])

  const validateForm = () => {
    const newErrors = { id: "", password: "" }
    let isValid = true

    if (!formData.id.trim()) {
      newErrors.id = "ID é obrigatório"
      isValid = false
    } else if (formData.id.length < 3) {
      newErrors.id = "ID deve ter pelo menos 3 caracteres"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória"
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async () => {    
    if (!validateForm()) return

    setIsLoading(true)
    
    // Simula requisição de login
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    alert("Login realizado com sucesso! (Demo)")
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
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
            placeholder="201547"
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
              placeholder="Digite sua senha"
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

      {/* Card Footer */}
      <div className="flex flex-col gap-3 pt-2 p-6">
        <button 
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-2.5 rounded-md transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Entrando...
            </div>
          ) : (
            "Entrar"
          )}
        </button>
        
        <button 
          className="w-full border border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 py-2.5 rounded-md font-medium"
        >
          Cadastrar
        </button>
        
      </div>
    </div>
    
  )
}

export default function Home() {

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Seção da imagem */}
      <div className="relative h-64 lg:h-auto lg:min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-800/30 z-10"></div>
        <img
          src="corona-vaccination-health-joint-hand-neck-1640973-pxhere.com.jpg"
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
          <div className="mt-4">
            <MeuComponente/>
          </div>
        </div>

      </div>
    </main>
  )
}