"use client";

import axios from "axios";
import { parseCookies, destroyCookie } from "nookies";

const getToken = async (): Promise<string | undefined> => {
  const { auth_token: token } = parseCookies();

  return token;
};

// Criando uma instância do Axios com configurações padrão
const api = axios.create({
  baseURL: `${process.env.BACKEND_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token a cada requisição
api.interceptors.request.use(
  (config) => {
    return getToken().then((token) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor de RESPOSTA: Lida com erros 401 globalmente
api.interceptors.response.use(
  (response) => response, // Se a resposta for sucesso, não faz nada
  (error) => {
    if (error.response?.status === 401) {
      console.error("Interceptor: Erro 401. Token inválido. Redirecionando...");
      destroyCookie(undefined, "auth_token", { path: "/" });
      // Redireciona para o login se não estiver lá
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/sign-in"
      ) {
        window.location.href = "/sign-in";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
