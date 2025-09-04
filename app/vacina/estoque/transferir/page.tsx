"use client";
import { AlertCircle, Loader2, X } from "lucide-react";
import { ArrowRightLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import { Iestoque, IVacinaEstoque } from "@/types/responseTypes";
export default function TransferirVacina() {
  const searchParams = useSearchParams();
  const vacinaId = searchParams.get("vacinaId");
  const salaId = searchParams.get("salaId");
  const estoqueId = searchParams.get("estoqueId");
  const vacinaNome = searchParams.get("vacinaNome");

  const router = useRouter();
  const { profissional, loading, error, retry } = useAuth();

  useEffect(() => {
    if (profissional) {
      console.log(profissional);

      const fetchData = async () => {
        const token = parseCookies().auth_token;
        const timeout = 10000;

        const responseEstoque = await axios.get(
          `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/estoque/${salaId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout,
          },
        );
        const estoquesD: Iestoque[] = responseEstoque.data.result.estoques;
        const estoqueFiltered = estoquesD
          .filter((e) => {
            console.log(e.id.toString() == estoqueId);
            return e.id.toString() != estoqueId;
          })
          .map((element) => {
            return {
              id: element.id,
              tipo: element.tipo,
            };
          });

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

        setEstoques(estoqueFiltered);
      };

      fetchData();
    }
  }, [profissional]);

  const [estoques, setEstoques] = useState([{}]);
  const [vacinaEstoque, setVacinaEstoque] = useState<IVacinaEstoque | null>();

  async function handleTransfer() {
    try {
      const token = parseCookies().auth_token;
      const timeout = 10000;
      const response = await axios.put(
        `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/vacina-estoque/${vacinaEstoque?.id}`,
        {
          quantidade: null,
          estoqueDestinoId: null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout,
        },
      );
    } catch (error) {
      router.push("/vacina/estoque");
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
            <ArrowRightLeft className="w-6 h-6 text-blue-600" />
            Transferir Vacina
          </h3>
          <button
            // onClick={closeAllModals}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
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
            vacina a ser transferida: {vacinaNome}
            {/* {estoques.find((e) => e.id === selectedVacina.localizacao)?.nome} */}
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
            Localização atual: {estoqueId}
            {/* {estoques.find((e) => e.id === selectedVacina.localizacao)?.nome} */}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estoque de Destino *
            </label>
            <select
              // value={transferData.estoqueDestino}
              // onChange={(e) =>
              //   setTransferData({
              //     ...transferData,
              //     estoqueDestino: e.target.value,
              //   })
              // }
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Selecione o estoque destino</option>
              {estoques.map((estoque) => (
                <option key={estoque.id} value={estoque.id}>
                  {estoque.tipo} : {estoque.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade a Transferir *
            </label>
            <input
              type="number"
              min="1"
              max={vacinaEstoque?.quantidade}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ex: 50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Máximo:
              {vacinaEstoque?.quantidade}
              unidades
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            // onClick={closeAllModals}
            className="flex-1 p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            // onClick={handleTransfer}
            className="flex-1 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Transferir
          </button>
        </div>
      </div>
    </div>
  );
}
