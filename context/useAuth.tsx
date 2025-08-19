"use client";

import { setCookie, parseCookies, destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import api from "@/services/clientApi"; // Instância centralizada do Axios
import axios from "axios"; // Mantemos para a checagem de tipo de erro
import { create } from "domain";
// import { useUserStore } from "./useUserStore";

type IApiRole = {
  id: number;
  name: string;
  moduleId: number | null;
  cbo: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

const getRedirectPathByUser = (user: IUser, allRoles: IApiRole[]): string => {
  // Se o usuário NÃO TIVER roles, vai para o dashboard principal.
  if (!user || !Array.isArray(user.userRoles) || user.userRoles.length === 0) {
    return "/dashboard";
  }

  const userRoleId = user.userRoles[0].roleId;
  const userRole = allRoles.find((role) => role.id === userRoleId);

  // Se a role do usuário não for encontrada na lista, trata como funcionário
  if (!userRole) {
    console.log(
      `A role com ID ${userRoleId} não foi encontrada na lista de roles da API.`,
    );
    return "/funcionario/users";
  }

  const roleName = userRole.name.toLowerCase();

  // Rotas específicas
  if (roleName.includes("administrador")) {
    return "/admin/users";
  }
  if (roleName.includes("psicólogo")) {
    return "/psicologo/users";
  }

  // Se tiver qualquer outra role, é tratado como funcionário.
  return "/funcionario/users";
};

type IUserRole = {
  id: number;
  userId: number;
  roleId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type IProfissional = {
  id: string; // Considere padronizar para number se for o caso na sua API
  nomeCompleto: string;
  coren: string;
  cbo: string;
  email: string;
  dataNascimento: string;
  cpf: string;
  isAdmin: boolean;
  enderecoId: string;
  ubsId: string;
};

type ISignIn = {
  email?: string;
  password?: string;
};

type IStore = {
  user: IProfissional | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  revalidate: (forced?: boolean) => Promise<void>;
  signIn: (
    router: ReturnType<typeof useRouter>,
    { email, password }: ISignIn,
  ) => Promise<boolean | object>;
  signOut: (router: ReturnType<typeof useRouter>) => Promise<void>;
  updateUser: (data: Partial<IProfissional>) => Promise<void>;
};

type AccessToken = {
  type: string;
  name: string | null;
  token: string;
  abilities: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
};

type ILoginResult = {
  accessToken: AccessToken;
  profissional: IProfissional;
};

type ILoginResponse = {
  status: number;
  timeStamp: string;
  success: boolean;
  request_id: string;
  result: ILoginResult;
};

const useAuthStore = create<IStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  revalidate: async (forced?: boolean) => {
    try {
      const { auth_token: token } = parseCookies();
      if ((token && !get().user) || forced) {
        // CORRIGIDO: Usando a instância 'api'
        const response = await api.get("/api/v1/auth/me");
        const loggedUser = response.data.result;
        set({ user: loggedUser, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.log("[revalidate] Falha ao revalidar sessão:", error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  signIn: async (router, { email, password }: ISignIn) => {
    try {
      // 1. Faz o login e pega o token
      const response = await api.post<ILoginResponse>("/login", {
        email,
        password,
      });

      const { result, success } = response.data;
      const token = result.accessToken.token;

      // 2. Define o cookie
      setCookie(undefined, "auth_token", token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      const fullUserResponse = await api.get("/auth/me");
      const user = fullUserResponse.data.result;

      set({ user, isAuthenticated: true, isLoading: false });

      const rolesResponse = await api.get("/api/v1/roles?perPage=3000"); // Apenas a primeira página para o redirect
      const rolesForRedirect = rolesResponse.data.result.data;
      const redirectPath = getRedirectPathByUser(user, rolesForRedirect);

      router.push(redirectPath);

      return success;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data ?? { success: false };
      }
      if (error instanceof Error) {
        console.error(error.message);
        return { success: false, message: error.message };
      }
      console.error("Erro desconhecido no signIn", error);
      return { success: false };
    }
  },

  signOut: async (router) => {
    try {
      // CORRIGIDO: Usando a instância 'api'
      await api.delete("/api/v1/auth/sign-out");
    } catch (error) {
      console.error(
        "A chamada para a API de logout falhou. Isso pode ser normal se o token já expirou.",
        error,
      );
    } finally {
      destroyCookie(undefined, "auth_token", { path: "/" });
      set({ user: null, isAuthenticated: false, isLoading: false });
      router.push("/sign-in");
    }
  },

  updateUser: async (data) => {
    const current = get().user!;
    const userPayload = {
      ...current,
      ...data,
      updated_at: new Date().toISOString(),
    };
    const payload = {
      uaddress: null,
      user: userPayload,
      userRoles: [],
    };
    // CORRIGIDO: Usando a instância 'api'
    await api.put("/update", payload); // A rota parece incompleta, verifique se está correta
    await get().revalidate(true);
  },
}));

export const useAuth = () => useAuthStore();
