"use client";
import { useAuth } from "@/hooks/useAuth";
import { Trash2 } from "lucide-react";
import { X } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { parseCookies } from "nookies";
import axios from "axios";
import { IVacinaEstoque } from "@/types/responseTypes";

export default function DescartarVacina() {
  const searchParams = useSearchParams();
  const vacinaId = searchParams.get("vacinaId");
  const estoqueId = searchParams.get("estoqueId");
  const vacinaNome = searchParams.get("vacinaNome");

  const router = useRouter();
  const { profissional, loading, error, retry } = useAuth();

  const [vacinaEstoque, setVacinaEstoque] = useState<IVacinaEstoque | null>();
  // Mudança aqui: inicializar como string vazia para melhor controle
  const [quantidade, setQuantidade] = useState<string>("");

  useEffect(() => {
    if (profissional) {
      const fetchData = async () => {
        const token = parseCookies().auth_token;
        const timeout = 10000;
        const vacinaEstoqueResponse = await axios.get(
          `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/vacina-estoque/${vacinaId}/${estoqueId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout,
          },
        );
        setVacinaEstoque(vacinaEstoqueResponse.data.result);
      };
      fetchData();
    }
  }, [profissional]);

  async function handleDescartar() {
    try {
      // Validação antes de enviar
      if (!quantidade || parseInt(quantidade) <= 0) {
        alert("Por favor, informe uma quantidade válida");
        return;
      }

      const token = parseCookies().auth_token;
      const timeout = 10000;

      const response = await axios.delete(
        `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/vacina-estoque/${vacinaEstoque?.id}`,
        {
          data: {
            quantidade: parseInt(quantidade), // Convertendo para number
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout,
        },
      );

      // Log para debug
      console.log("Descarte realizado:", {
        quantidade: parseInt(quantidade),
        vacinaEstoqueId: vacinaEstoque?.id,
      });

      // Redirecionar após sucesso
      router.push("/vacina/estoque");
    } catch (error) {
      console.error("Erro ao descartar vacina:", error);
      throw error;
    }
  }

  // Tela de loading
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

  // Tela de erro
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-red-600" />
            Descartar Vacina
          </h3>
          <button
            onClick={() => router.push("/vacina/estoque")}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h4 className="font-bold text-red-800">Atenção!</h4>
          </div>
          <p className="text-sm text-red-700">
            Esta ação removerá permanentemente as vacinas do estoque.
            Certifique-se de que esta é a ação correta.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl mb-6">
          <h4 className="font-bold text-gray-800">
            {/* {selectedVacina.nome} */}
          </h4>
          <p className="text-sm text-gray-600">
            {/* Lote: {selectedVacina.lote} • Disponível:{" "} */}
            {/* {selectedVacina.quantidade} unidades */}
          </p>
          <p className="text-sm text-gray-600">
            Vacina a ser descartada: {vacinaNome}
            {/* {estoques.find((e) => e.id === selectedVacina.localizacao)?.nome} */}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade a Descartar *
            </label>
            <input
              type="number"
              min="1"
              max={vacinaEstoque?.quantidade}
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Ex: 10"
            />
            <p className="text-xs text-gray-500 mt-1">
              Máximo: {vacinaEstoque?.quantidade} unidades
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => router.push("/vacina/estoque")}
            className="flex-1 p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDescartar}
            className="flex-1 p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Confirmar Descarte
          </button>
        </div>
      </div>
    </div>
  );
}
