"use client";
import { Trash2 } from "lucide-react";
import { X } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function DescartarVacina() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-red-600" />
            Descartar Vacina
          </h3>
          <button
            // onClick={closeAllModals}
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
            Vacina a ser descartada:{" "}
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
              // max={selectedVacina.quantidade}
              // value={descarteData.quantidade}
              // onChange={(e) =>
              // setDescarteData({
              //   ...descarteData,
              //   quantidade: e.target.value,
              // })
              // }
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Ex: 10"
            />
            <p className="text-xs text-gray-500 mt-1">
              {/* Máximo: {selectedVacina.quantidade} unidades */}
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
            // onClick={handleDescarte}
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
