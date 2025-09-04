import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import axios from "axios";
import { IProfissional } from "@/types/responseTypes";

interface UseAuthOptions {
  redirectTo?: string; // rota para redirecionar em caso de erro (padrão: '/login')
  autoRedirect?: boolean; // se deve redirecionar automaticamente (padrão: true)
  timeout?: number; // timeout da requisição em ms (padrão: 10000)
}

interface UseAuthReturn {
  profissional: IProfissional | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
  logout: () => void;
}

export const useAuth = (options: UseAuthOptions = {}): UseAuthReturn => {
  const {
    redirectTo = "/login",
    autoRedirect = true,
    timeout = 10000,
  } = options;

  const router = useRouter();
  const [profissional, setProfissional] = useState<IProfissional | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuthentication = async () => {
    try {
      setLoading(true);
      setError(null);

      // Pega o token do cookie
      const cookies = parseCookies();
      const token = cookies.auth_token;

      // Verifica se o token existe
      if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
      }

      // Faz a requisição para a rota /me
      const response = await axios.get(
        `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout,
        },
      );
      const profissional: IProfissional = response.data.result;

      if (!profissional) {
        throw new Error("Usuário não encontrado ou dados inválidos.");
      }

      // Define os dados do usuário
      setProfissional(profissional);
      setLoading(false);
    } catch (error: any) {
      console.error("Erro na autenticação:", error);

      let errorMessage = "Erro de autenticação. Tente novamente.";

      if (error.response) {
        // Erro da resposta do servidor
        switch (error.response.status) {
          case 401:
            errorMessage = "Token inválido ou expirado. Faça login novamente.";
            break;
          case 403:
            errorMessage =
              "Acesso negado. Você não tem permissão para acessar esta página.";
            break;
          case 404:
            errorMessage = "Usuário não encontrado.";
            break;
          case 500:
            errorMessage =
              "Erro interno do servidor. Tente novamente mais tarde.";
            break;
          default:
            errorMessage = `Erro do servidor: ${error.response.status}`;
        }
      } else if (error.request) {
        // Erro de rede
        errorMessage =
          "Erro de conexão. Verifique sua internet e tente novamente.";
      } else if (error.code === "ECONNABORTED") {
        // Timeout
        errorMessage = "Timeout: A requisição demorou muito para responder.";
      } else {
        // Outros erros
        errorMessage = error.message || "Erro desconhecido.";
      }

      setError(errorMessage);
      setLoading(false);

      // Redireciona automaticamente se configurado
      if (autoRedirect) {
        setTimeout(() => {
          router.push(redirectTo);
        }, 3000);
      }
    }
  };

  const retry = () => {
    checkAuthentication();
  };

  const logout = () => {
    // Remove o token do cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Redireciona para login
    router.push(redirectTo);
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return {
    profissional,
    loading,
    error,
    retry,
    logout,
  };
};

// Hook alternativo para páginas que não precisam de redirecionamento automático
export const useAuthCheck = () => {
  return useAuth({ autoRedirect: false });
};

// Componente Higher-Order para proteger rotas
export const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  return function AuthenticatedComponent(props: any) {
    const { profissional, loading, error } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Verificando autenticação...
            </h2>
            <p className="text-gray-600">Aguarde um momento</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-red-200 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Acesso Negado
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <p className="text-sm text-gray-500">
              Redirecionando automaticamente...
            </p>
          </div>
        </div>
      );
    }

    if (!profissional) {
      return null;
    }

    return <WrappedComponent {...props} profissional={profissional} />;
  };
};
