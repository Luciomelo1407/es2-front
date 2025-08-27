"use client";
import { X } from "lucide-react";
import { ArrowRightLeft } from "lucide-react";

export default function TransferirVacina() {
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
            vacina a ser transferida:{" "}
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
            Localização atual:{" "}
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
              {/* {estoques */}
              {/*   .filter( */}
              {/*     (e) => */}
              {/*       e.id !== "todos" && e.id !== selectedVacina.localizacao, */}
              {/*   ) */}
              {/*   .map((estoque) => ( */}
              {/*     <option key={estoque.id} value={estoque.id}> */}
              {/*       {estoque.nome} */}
              {/*     </option> */}
              {/*   )) */}
              {/* } */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade a Transferir *
            </label>
            <input
              type="number"
              min="1"
              // max={selectedVacina.quantidade}
              // value={transferData.quantidade}
              // onChange={(e) =>
              //   setTransferData({
              //     ...transferData,
              //     quantidade: e.target.value,
              //   })
              // }
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ex: 50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Máximo:
              {/* {selectedVacina.quantidade} */}
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
