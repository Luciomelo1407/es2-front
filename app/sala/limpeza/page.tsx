"use client";
import { useState, useEffect } from "react";
import { Home, Plus, User, Calendar, Clock, CheckCircle2, Camera, FileText, AlertCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

/**
* Componente para registro de higienização de salas
* Gerencia o processo completo de documentação de limpeza e desinfecção de ambientes
*/
export default function HigienizacaoSala() {
  const router = useRouter();

  // Estados para controle de dados do formulário
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [showProdutoModal, setShowProdutoModal] = useState(false);
  const [observacoes, setObservacoes] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);

  /**
   * Inicialização automática com data e hora atual
   * Facilita o preenchimento ao sugerir valores padrão baseados no momento atual
   */
  useEffect(() => {
    const now = new Date();
    // Formata data no padrão brasileiro (DD/MM/AAAA)
    const dataAtual = now.toLocaleDateString('pt-BR');
    // Formata hora no padrão 24h (HH:MM)
    const horaAtual = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    setData(dataAtual);
    setHora(horaAtual);
  }, []);

  // Lista de produtos disponíveis para higienização
  // Padronização baseada em protocolos hospitalares e de limpeza profissional
  const produtosDisponiveis = [
    "Álcool 70%",
    "Hipoclorito de Sódio",
    "Detergente Neutro",
    "Desinfetante Hospitalar",
    "Quaternário de Amônio",
    "Peróxido de Hidrogênio"
  ];

  /**
   * Adiciona produto à lista de utilizados
   * Previne duplicatas e fecha modal automaticamente
   */
  const handleAddProduto = (produto) => {
    // Verifica se produto já não foi adicionado para evitar duplicatas
    if (!produtos.includes(produto)) {
      setProdutos([...produtos, produto]);
    }
    setShowProdutoModal(false);
  };

  /**
   * Remove produto da lista de utilizados
   * Permite correção de seleções indevidas
   */
  const handleRemoveProduto = (produto) => {
    setProdutos(produtos.filter(p => p !== produto));
  };

  /**
   * Processa o envio do formulário de higienização
   * Executa validações e simula persistência dos dados
   */
  const handleSubmit = async () => {
    // Validação básica dos campos obrigatórios
    if (!data || !hora) {
      alert("Por favor, preencha data e hora");
      return;
    }

    setIsSubmitting(true);

    // Simulação de requisição para o backend
    // Delay para melhorar UX mostrando estado de carregamento
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Log dos dados que seriam enviados para auditoria
    console.log("Dados enviados:", {
      data,
      hora,
      produtos,
      observacoes,
    });

    setIsSubmitting(false);
    setShowSuccess(true);

    // Redirecionamento automático após confirmação de sucesso
    // Tempo suficiente para usuário ver feedback positivo
    setTimeout(() => {
      router.push("/usuario");
    }, 3000);
  };

  /**
   * Gerencia navegação de volta com verificação de dados não salvos
   * Previne perda acidental de informações importantes
   */
  const handleVoltar = () => {
    // Verifica se há dados preenchidos antes de sair
    if (produtos.length > 0 || observacoes) {
      if (confirm("Você tem dados não salvos. Deseja realmente voltar?")) {
        router.push("/usuario");
      }
    } else {
      router.push("/usuario");
    }
  };

  /**
   * Navegação direta para home sem verificações
   * Utilizada em contextos onde confirmação não é necessária
   */
  const voltarHome = () => {
    router.push("/usuario");
  };

  // Validação do formulário para habilitar botão de envio
  // Garante que campos essenciais estejam preenchidos
  const isFormValid = data && hora && produtos.length > 0;

  // Tela de sucesso após envio bem-sucedido
  // Fornece feedback claro sobre conclusão da operação
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header simplificado para tela de sucesso */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <span className="text-gray-700 font-medium">Usuário</span>
          </div>

          <button className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors">
            Registrar higienização da sala
          </button>

          <button onClick={voltarHome} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Home className="w-8 h-8 text-teal-700" />asdasdsa
          </button>
        </div>

        {/* Card de confirmação de sucesso */}
        <div className="p-6">
          <div className="bg-emerald-400 rounded-2xl p-8 max-w-4xl mx-auto min-h-[500px] flex flex-col items-center justify-center">
            <div className="text-center space-y-4">
              {/* Ícone animado de sucesso */}
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Registrado com Sucesso!</h2>
              <p className="text-green-100">Higienização da sala foi registrada no sistema</p>
              <p className="text-green-200 text-sm mt-2">Redirecionando em 3 segundos...</p>

              {/* Resumo dos dados registrados para confirmação */}
              <div className="bg-white/20 rounded-lg p-4 mt-4">
                <p className="text-white text-sm">
                  <strong>Data:</strong> {data} • <strong>Hora:</strong> {hora}
                </p>
                <p className="text-white text-sm mt-1">
                  <strong>Produtos:</strong> {produtos.length} item(s)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header com identificação do usuário e contexto da ação */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <span className="text-gray-700 font-medium">Usuário</span>
        </div>

        {/* Indicador visual da ação atual */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <span className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors cursor-default">
            Registrar higienização da sala
          </span>
        </div>

        <button onClick={voltarHome} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Home className="w-8 h-8 text-teal-700" />
        </button>
      </div>

      {/* Conteúdo Principal do Formulário */}
      <div className="p-6">
        <div className="bg-emerald-400 rounded-2xl p-8 max-w-4xl mx-auto min-h-[600px] relative">

          {/* Campos de Data e Hora com design integrado */}
          <div className="flex justify-between items-start mb-6">
            {/* Campo de data com conversão de formato para input HTML */}
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
              <Calendar className="w-4 h-4 text-gray-700" />
              <span className="text-gray-800 font-medium">Data:</span>
              <input
                type="date"
                value={data.split('/').reverse().join('-')} // Converte DD/MM/AAAA para AAAA-MM-DD
                onChange={(e) => {
                  // Converte de volta para formato brasileiro
                  const [year, month, day] = e.target.value.split('-');
                  setData(`${day}/${month}/${year}`);
                }}
                className="px-2 py-1 rounded border-0 bg-white text-gray-700 text-sm"
              />
            </div>

            {/* Campo de hora no formato 24h */}
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
              <Clock className="w-4 h-4 text-gray-700" />
              <span className="text-gray-800 font-medium">Hora:</span>
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="px-2 py-1 rounded border-0 bg-white text-gray-700 text-sm"
              />
            </div>
          </div>

          {/* Área Central de Conteúdo do Formulário */}
          <div className="bg-white/10 rounded-xl p-6 mb-6 min-h-[300px]">

            {/* Botão Principal para Adicionar Produtos */}
            <div className="text-center mb-6">
              <button
                onClick={() => setShowProdutoModal(true)}
                className="w-20 h-20 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-lg hover:scale-105 mx-auto"
              >
                <Plus className="w-10 h-10 text-white" />
              </button>
              <p className="text-white mt-2 font-medium">Adicionar Produtos</p>
            </div>

            {/* Lista de Produtos Selecionados */}
            {/* Exibida apenas quando há produtos adicionados */}
            {produtos.length > 0 && (
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Produtos Utilizados ({produtos.length})
                </h3>
                {/* Grid responsivo para organização dos produtos */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {produtos.map((produto, index) => (
                    <div
                      key={index}
                      className="bg-white/20 rounded-lg p-2 flex items-center justify-between"
                    >
                      <span className="text-white text-sm font-medium">{produto}</span>
                      {/* Botão para remoção de produto */}
                      <button
                        onClick={() => handleRemoveProduto(produto)}
                        className="text-red-200 hover:text-red-100 ml-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Área de Observações Opcionais */}
            <div className="mb-4">
              <label className="text-white font-medium flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" />
                Observações (opcional)
              </label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Descreva detalhes importantes sobre a higienização..."
                className="w-full p-3 rounded-lg bg-white/90 text-gray-700 placeholder-gray-500 text-sm resize-none"
                rows="3"
              />
            </div>

          </div>

          {/* Alerta de Validação */}
          {/* Orientação visual quando formulário não está válido */}
          {!isFormValid && produtos.length === 0 && (
            <div className="bg-amber-100 border border-amber-300 rounded-lg p-3 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span className="text-amber-800 text-sm">
                Adicione pelo menos um produto para continuar
              </span>
            </div>
          )}

          {/* Botões de Ação do Formulário */}
          <div className="flex justify-between items-center">
            {/* Botão de voltar com verificação de dados não salvos */}
            <button
              onClick={handleVoltar}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              ← Voltar
            </button>

            {/* Botão de envio com estados visuais diferentes */}
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className={`px-8 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${isFormValid && !isSubmitting
                  ? 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
            >
              {/* Estado de carregamento com spinner animado */}
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Registrar Higienização
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Seleção de Produtos */}
      {/* Overlay modal para seleção de produtos disponíveis */}
      {showProdutoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Selecionar Produto</h3>

            {/* Lista scrollável de produtos disponíveis */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {produtosDisponiveis.map((produto) => (
                <button
                  key={produto}
                  onClick={() => handleAddProduto(produto)}
                  disabled={produtos.includes(produto)} // Desabilita produtos já selecionados
                  className={`w-full p-3 text-left rounded-lg transition-colors ${produtos.includes(produto)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'hover:bg-blue-50 border border-gray-200 hover:border-blue-300'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{produto}</span>
                    {/* Indicador visual para produtos já selecionados */}
                    {produtos.includes(produto) && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Botão para fechar modal */}
            <button
              onClick={() => setShowProdutoModal(false)}
              className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}