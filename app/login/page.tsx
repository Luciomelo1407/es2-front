"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff, User, Lock, Heart, Shield, Users } from "lucide-react";
import axios from "axios"; // Importação do axios para requisições HTTP
import { setCookie } from "nookies";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IProfissional, AccessToken } from "@/types/responseTypes";

/**
* Componente principal do formulário de login
* Gerencia autenticação de usuários e redirecionamento baseado no tipo de perfil
*/
export function CardDemo() {
  const router = useRouter();

  // Estados para controle da interface e dados do formulário
  const [frase, setFrase] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ id: "", password: "" });
  const [errors, setErrors] = useState({ id: "", password: "" });
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [dialogStep, setDialogStep] = useState(1);
  const [salaInfo, setSalaInfo] = useState("");
  const [loading, setLoading] = useState(false); // Estado para controlar carregamento durante requisições

  /**
   * Manipula o envio do formulário de login
   * Executa validações, autenticação e redirecionamento conforme perfil do usuário
   */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("🚀 handleSubmit executada!");

    // Validação básica dos campos obrigatórios
    // Garante que ambos os campos sejam preenchidos antes de prosseguir
    const nextErrors = { id: "", password: "" };
    if (!formData.id.trim()) nextErrors.id = "ID é obrigatório";
    if (!formData.password.trim()) nextErrors.password = "Senha é obrigatória";

    if (nextErrors.id || nextErrors.password) {
      console.log("❌ Erros de validação:", nextErrors);
      setErrors(nextErrors);
      return;
    }

    // Execução da autenticação com o backend
    // Utiliza estado de loading para melhorar UX durante a requisição
    setLoading(true);
    setErrors({ id: "", password: "" }); // Limpa erros anteriores para nova tentativa

    try {
      // Requisição POST para endpoint de autenticação
      // Mapeia 'id' do formulário para 'email' conforme esperado pela API
      const response = await axios.post(`${process.env.BACKEND_URL}/login`, {
        email: formData.id, // Mapeamento necessário para compatibilidade com backend
        password: formData.password,
      });

      // Extração dos dados de resposta da autenticação
      const profissional: IProfissional = response.data.result.profissional;
      const token = response.data.result.access_token;

      // Armazenamento do token de autenticação em cookie
      // Define expiração de 30 dias para sessão persistente
      setCookie(undefined, "auth_token", token.token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      // Redirecionamento baseado no tipo de usuário
      // Administradores vão para painel admin, usuários comuns para fluxo específico
      if (response.status === 200) {
        if (profissional.isAdmin) {
          console.log("✅ Login admin bem-sucedido!");
          router.push("/admin");
        } else {
          console.log("✅ Login usuário detectado - mostrando dialog");
          setDialogStep(1);
          setSalaInfo("");
          setShowUserDialog(true);
          router.push("/login/dados_login_usuario");
        }
      }
    } catch (error: any) {
      console.log("❌ Erro na requisição:", error);

      // Tratamento detalhado de diferentes tipos de erro
      // Proporciona feedback específico conforme o tipo de falha
      if (error.response) {
        // Erros de resposta do servidor com códigos HTTP específicos
        const status = error.response.status;
        const message = error.response.data?.message || "Erro no servidor";

        if (status === 401 || status === 400) {
          // Credenciais inválidas - erro mais comum
          setErrors({
            id: "",
            password: "Credenciais inválidas",
          });
        } else if (status === 404) {
          // Usuário não encontrado no sistema
          setErrors({
            id: "Usuário não encontrado",
            password: "",
          });
        } else {
          // Outros erros do servidor
          setErrors({
            id: "",
            password: `Erro: ${message}`,
          });
        }
      } else if (error.request) {
        // Erro de conectividade - servidor inacessível
        setErrors({
          id: "",
          password: "Erro de conexão com o servidor",
        });
      } else {
        // Erros inesperados não categorizados
        setErrors({
          id: "",
          password: "Erro inesperado",
        });
      }
    } finally {
      // Sempre remove o estado de loading independente do resultado
      setLoading(false);
    }
  };

  /**
   * Manipula mudanças nos campos do formulário
   * Atualiza estado e limpa erros relacionados ao campo alterado
   */
  const handleInputChange = (field: any, value: any) => {
    console.log(`✏️ Campo ${field} alterado para:`, value);

    // Atualiza o valor do campo no estado do formulário
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));

    // Remove erro do campo que está sendo editado
    // Melhora UX ao fornecer feedback imediato
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <>
      {/* Container principal do card de login com design moderno */}
      <div className="w-[400px] shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden">

        {/* Cabeçalho do card com logo e título */}
        <div className="space-y-4 pb-6 p-6">
          <div className="flex justify-center">
            {/* Logo do sistema com gradiente e design moderno */}
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="text-white font-bold text-xl tracking-tight">
                VacEnf
              </div>
            </div>
          </div>

          {/* Título e descrição do sistema */}
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

        {/* Seção dos campos do formulário */}
        <div className="space-y-4 px-6">

          {/* Campo de email com ícone e validação */}
          <div className="space-y-2">
            <label
              htmlFor="id"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Email
            </label>
            <input
              id="id"
              type="email"
              placeholder="exemplo@email.com"
              value={formData.id}
              onChange={(e) => handleInputChange("id", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 ${errors.id
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                }`}
              disabled={loading} // Desabilitado durante requisição para evitar múltiplos envios
            />
            {/* Exibição condicional de erro do campo email */}
            {errors.id && (
              <p className="text-xs text-red-600 mt-1">{errors.id}</p>
            )}
          </div>

          {/* Campo de senha com toggle de visibilidade */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"} // Alternância entre texto e senha
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 ${errors.password
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                  }`}
                placeholder="Digite sua senha"
                disabled={loading} // Consistência de estado durante loading
              />

              {/* Botão para mostrar/ocultar senha */}
              <button
                type="button"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-100 rounded-r-md transition-colors disabled:cursor-not-allowed"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {/* Ícone alternado conforme estado da visibilidade */}
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {/* Exibição condicional de erro do campo senha */}
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password}</p>
            )}
          </div>
        </div>

        {/* Botão de envio do formulário */}
        <div className="flex flex-col gap-3 pt-2 p-6">
          <button
            onClick={handleSubmit}
            disabled={loading} // Prevenção de múltiplos cliques durante processamento
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-2.5 rounded-md transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            {/* Texto dinâmico que indica estado da requisição */}
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </div>
    </>
  );
}

/**
* Componente principal da página de login
* Estrutura layout responsivo com seção de imagem e formulário
*/
export default function Home() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* Seção da imagem com overlay informativo */}
      <div className="relative h-64 lg:h-auto lg:min-h-screen overflow-hidden">
        {/* Gradiente sobre a imagem para melhor legibilidade do texto */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-800/30 z-10"></div>

        {/* Imagem de fundo relacionada ao tema de vacinação */}
        <img
          src="imagem_login.jpg"
          alt="Profissional de saúde aplicando vacina"
          className="w-full h-full object-cover"
        />

        {/* Overlay com informações sobre o sistema */}
        {/* Posicionado na parte inferior com gradiente para legibilidade */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 z-20 bg-gradient-to-t from-black/60 to-transparent">
          <div className="text-white space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">Protegendo Vidas</h2>
            <p className="text-sm lg:text-base text-white/90 max-w-md">
              Sistema integrado para gestão de vacinação, garantindo cuidado e
              proteção para toda a comunidade.
            </p>

            {/* Ícones com características do sistema */}
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

      {/* Seção do formulário com fundo gradiente e elementos decorativos */}
      <div className="flex items-center justify-center p-6 lg:p-10 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 relative overflow-hidden">

        {/* Elementos decorativos em blur para criar profundidade visual */}
        {/* Posicionados estrategicamente para criar atmosfera sem interferir na usabilidade */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-teal-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-200/10 rounded-full blur-3xl"></div>

        {/* Container do formulário com z-index elevado para ficar sobre elementos decorativos */}
        <div className="relative z-10">
          <CardDemo />
        </div>
      </div>
    </main>
  );
}