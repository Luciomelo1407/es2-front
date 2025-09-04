"use client";
import { useState, useEffect } from "react";
import {
  Home,
  User,
  Package,
  Clock,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  RefreshCw,
  Thermometer,
  ChevronRight,
  MapPin,
  ArrowRightLeft,
  Trash2,
  Loader2,
  AlertCircle,
  Salad,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { parseCookies } from "nookies";
import { Iestoque, ITemperaturas } from "@/types/responseTypes";

export default function VisualizarEstoque() {
  const router = useRouter();
  const { profissional, loading, error, retry } = useAuth();
  const [estoques, setEstoques] = useState([
    { id: "-1", tipo: "", icon: Package },
  ]);
  const [sala, setSala] = useState();
  useEffect(() => {
    if (profissional) {
      const fetchData = async () => {
        const token = parseCookies().auth_token;
        const timeout = 10000;
        const responseSala = await axios.get(
          `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/sala/${profissional.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout,
          },
        );

        const salaId = responseSala.data.result.id;
        setSala(salaId);

        const responseEstoque = await axios.get(
          `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/estoque/${salaId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout,
          },
        );
        const temperaturas: ITemperaturas[] =
          responseEstoque.data.result.temperatura;

        const estoquesR: Iestoque[] = responseEstoque.data.result.estoques;
        setSelectedEstoque(estoquesR[0].id.toString());
        setEstoques(
          estoquesR.map((element) => {
            return {
              id: element.id.toString(),
              tipo: element.tipo,
              icon: Package,
            };
          }),
        );
        let counter = -1;

        const vacina = estoquesR.flatMap((estoqueM) => {
          counter++; // Incrementa o contador
          return (
            estoqueM.vacinaEstoque?.flatMap((vacinaEstoqueO) => {
              if (vacinaEstoqueO.vacinaLote) {
                return {
                  id: vacinaEstoqueO.vacinaLote.id.toString(),
                  nome: vacinaEstoqueO.vacinaLote.nome.toString(),
                  quantidade: vacinaEstoqueO.quantidade.toString(),
                  temperatura: temperaturas[counter].temperatura.toString(),
                  localizacao: estoqueM.id.toString(),
                  lote: vacinaEstoqueO.vacinaLote.codLote.toString(),
                  validade: vacinaEstoqueO.vacinaLote.validade.toString(),
                };
              } else {
                return;
              }
            }) ?? []
          );
        });
        console.log("DEBUGG OBJETO DE VACINAS", vacina);
        setEstoqueData(vacina);
      };
      fetchData();
    }
  }, [profissional]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [selectedEstoque, setSelectedEstoque] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedVacina, setSelectedVacina] = useState(null);
  const [transferData, setTransferData] = useState({
    estoqueDestino: "",
    quantidade: "",
    motivo: "",
    observacoes: "",
  });

  // Dados simulados do estoque
  const [estoqueData, setEstoqueData] = useState([
    {
      id: 1,
      nome: "Vacina COVID-19",
      quantidade: 150,
      tempoRestante: { dias: 3, horas: 12 },
      temperatura: -18.5,
      status: "normal",
      localizacao: "1",
      lote: "LOT001",
    },
    {
      id: 2,
      nome: "Vacina Hepatite B",
      quantidade: 45,
      tempoRestante: { dias: 1, horas: 6 },
      temperatura: -17.8,
      status: "atencao",
      localizacao: "freezer-a2",
      lote: "LOT002",
    },
    {
      id: 3,
      nome: "Vacina Influenza",
      quantidade: 89,
      tempoRestante: { dias: 0, horas: 8 },
      temperatura: -19.2,
      status: "critico",
      localizacao: "freezer-b1",
      lote: "LOT003",
    },
    {
      id: 4,
      nome: "Vacina Pneumocócica",
      quantidade: 67,
      tempoRestante: { dias: 7, horas: 2 },
      temperatura: -18.1,
      status: "normal",
      localizacao: "freezer-b2",
      lote: "LOT004",
    },
    {
      id: 5,
      nome: "Vacina Meningocócica",
      quantidade: 23,
      tempoRestante: { dias: 2, horas: 14 },
      temperatura: -18.9,
      status: "atencao",
      localizacao: "freezer-c1",
      lote: "LOT005",
    },
    {
      id: 6,
      nome: "Vacina HPV",
      quantidade: 112,
      tempoRestante: { dias: 14, horas: 5 },
      temperatura: -17.5,
      status: "normal",
      localizacao: "freezer-c2",
      lote: "LOT006",
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "critico":
        return "from-red-100 to-red-200 border-red-300 hover:from-red-200 hover:to-red-300";
      case "atencao":
        return "from-yellow-100 to-orange-200 border-yellow-300 hover:from-yellow-200 hover:to-orange-300";
      case "normal":
        return "from-green-100 to-emerald-200 border-green-300 hover:from-green-200 hover:to-emerald-300";
      default:
        return "from-gray-100 to-gray-200 border-gray-300 hover:from-gray-200 hover:to-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "critico":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "atencao":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "normal":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "critico":
        return "CRÍTICO";
      case "atencao":
        return "ATENÇÃO";
      case "normal":
        return "NORMAL";
      default:
        return "INDEFINIDO";
    }
  };

  function calcularTempoFaltante(dataString: string): string {
    const dataRecebida = new Date(dataString); // Converte a string recebida para um objeto Date
    const dataAtual = new Date(); // Pega a data e hora atual

    // Verifica se a data recebida já passou
    if (dataRecebida < dataAtual) {
      return "Fora da validade";
    }

    // Calcula a diferença em anos, meses e dias
    let anos = dataRecebida.getFullYear() - dataAtual.getFullYear();
    let meses = dataRecebida.getMonth() - dataAtual.getMonth();
    let dias = dataRecebida.getDate() - dataAtual.getDate();

    // Se o mês ou o dia ainda não chegaram, ajusta a diferença
    if (meses < 0) {
      meses += 12;
    }

    if (dias < 0) {
      const diasNoMesAnterior = new Date(
        dataRecebida.getFullYear(),
        dataRecebida.getMonth(),
        0,
      ).getDate();
      dias += diasNoMesAnterior;
      meses -= 1;
    }

    // Se a data de recebimento estiver em um ano futuro
    return `${anos} anos, ${meses} meses e ${dias} dias restantes`;
  }

  const formatTempoRestante = (tempo) => {
    return calcularTempoFaltante(tempo);
  };

  const filteredEstoque = estoqueData.filter((item) => {
    const matchesSearch =
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lote.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "todos" || item.status === filterStatus;
    const matchesEstoque =
      selectedEstoque === "todos" || item.localizacao === selectedEstoque;
    return matchesSearch && matchesFilter && matchesEstoque;
  });

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log("Dados atualizados!");
    }, 1000);
  };

  const voltarHome = () => {
    router.push("/usuario");
    console.log("Voltando para home");
  };

  const getTemperatureColor = (temp) => {
    if (temp > -15) return "text-red-600";
    if (temp > -18) return "text-yellow-600";
    return "text-green-600";
  };

  const handleVacinaClick = (vacina) => {
    setSelectedVacina(vacina);
    setShowActionModal(true);
  };

  const handleAction = (action) => {
    setShowActionModal(false);

    if (action === "transferir") {
      router.push(
        `/vacina/estoque/transferir?vacinaId=${selectedVacina.id}&estoqueId=${selectedVacina.localizacao}&salaId=${sala}&vacinaNome=${selectedVacina.nome}`,
      );
    } else if (action === "descartar") {
      router.push("/vacina/estoque/descartar");
    }
  };

  const closeAllModals = () => {
    setShowActionModal(false);
    setSelectedVacina(null);
  };

  const getEstoqueStats = () => {
    const filtered =
      selectedEstoque === "todos"
        ? estoqueData
        : estoqueData.filter((item) => item.localizacao === selectedEstoque);

    return {
      total: filtered.length,
      normal: filtered.filter((item) => item.status === "normal").length,
      atencao: filtered.filter((item) => item.status === "atencao").length,
      critico: filtered.filter((item) => item.status === "critico").length,
    };
  };

  const stats = getEstoqueStats();

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <span className="text-gray-700 font-medium">usuário</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <Package className="w-4 h-4" />
            Ver Estoque
          </div>

          <button
            onClick={voltarHome}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
            title="Voltar ao início"
          >
            <Home className="w-6 h-6 text-emerald-600" />
          </button>
        </div>
      </div>

      {/* Seleção de Estoque */}
      <div className="p-6 pb-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            Selecionar Estoque
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {estoques.map((estoque) => {
              const Icon = estoque.icon;
              return (
                <button
                  key={estoque.id}
                  onClick={() => setSelectedEstoque(estoque.id)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 flex flex-col items-center gap-2 text-sm font-medium ${
                    selectedEstoque === estoque.id
                      ? "bg-emerald-100 border-emerald-400 text-emerald-700"
                      : "bg-white border-gray-200 text-gray-600 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  {estoque.tipo}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de Vacinas */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mt-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Package className="w-6 h-6 text-emerald-600" />
              {selectedEstoque === "todos"
                ? "Todas as Vacinas"
                : estoques.find((e) => e.id === selectedEstoque)?.nome ||
                  "Vacinas"}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredEstoque.length} de {stats.total} itens
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEstoque.map((item) => (
              <button
                key={item.id}
                onClick={() => handleVacinaClick(item)}
                className={`bg-gradient-to-br from-green-100 to-emerald-200 border-green-300 hover:from-green-200 hover:to-emerald-300 rounded-2xl p-6 border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg text-left group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="text-xs font-bold tracking-wide">
                      estoque id: {item.localizacao.toString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Thermometer className="w-4 h-4" />
                      <span className={`text-sm font-medium text-black`}>
                        {item.temperatura}°C
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">
                    {item.nome}
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Quantidade:</span>
                      <span className="font-semibold text-gray-800">
                        {item.quantidade} unidades
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Lote:</span>
                      <span className="font-semibold text-gray-800">
                        {item.lote}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-300/50">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatTempoRestante(item.validade)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredEstoque.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                Nenhuma vacina encontrada
              </h3>
              <p className="text-gray-400">
                Tente ajustar os filtros de busca ou selecionar outro estoque
              </p>
            </div>
          )}
        </div>

        {/* Botão Voltar */}
        <div className="flex justify-center mt-6">
          <button
            onClick={voltarHome}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
          >
            ← Voltar
          </button>
        </div>
      </div>

      {/* Modal de Ações */}
      {showActionModal && selectedVacina && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {selectedVacina.nome}
            </h3>
            <p className="text-gray-600 mb-6">
              Lote: {selectedVacina.lote} • {selectedVacina.quantidade} unidades
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleAction("transferir")}
                className="w-full flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors"
              >
                <ArrowRightLeft className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">
                    Transferir para Outro Estoque
                  </div>
                  <div className="text-sm opacity-75">
                    Mover vacinas entre freezers
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleAction("descartar")}
                className="w-full flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Descartar Vacina</div>
                  <div className="text-sm opacity-75">
                    Remover vacinas vencidas ou danificadas
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={closeAllModals}
              className="w-full mt-4 p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
