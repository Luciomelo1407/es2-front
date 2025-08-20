'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Thermometer,
  Package,
  Settings,
  Sparkles,
  Map,
  Eye,
  User,
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function VaccineDashboard() {
  const router = useRouter();

  const [selectedAction, setSelectedAction] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async (action: any) => {

    if(action == "inserir vacina no estoque"){
      router.push("/vacina/inserir_vacina")
    }
    if(action == "limpeza"){
      router.push("/sala/limpeza")
    }
    if(action == "alterar sala"){
      router.push("/sala/mudanca")
    }
    if(action == "registrar temperatura"){
      router.push("/vacina/temperatura")
    }
    if(action == "inserir vacina no estoque"){
      router.push("/vacina/inserir_vacina")
    }

    setIsLoading(true)
    setSelectedAction(action)
    console.log(`Ação selecionada: ${action}`)
    
    // Simular loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const actions = [
    {
      id: 'insert-vaccine',
      label: 'Inserir Vacina no Estoque',
      icon: Package,
      onClick: () => handleAction('inserir vacina no estoque'),
      color: 'bg-teal-50 hover:bg-teal-100 border-teal-200'
    },
    {
      id: 'register-temperature',
      label: 'Registrar Temperatura',
      icon: Thermometer,
      onClick: () => handleAction('registrar temperatura'),
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    },
    {
      id: 'change-room',
      label: 'Alterar Sala',
      icon: Settings,
      onClick: () => handleAction('alterar sala'),
      color: 'bg-gray-50 hover:bg-gray-100 border-gray-200'
    },
    {
      id: 'cleaning',
      label: 'Limpeza',
      icon: Sparkles,
      onClick: () => handleAction('limpeza'),
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
    },
    {
      id: 'temperature-map',
      label: 'Ver Mapa de Temperatura',
      icon: Map,
      onClick: () => handleAction('ver mapa de temperatura'),
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200'
    },
    {
      id: 'view-stock',
      label: 'Ver Estoque',
      icon: Eye,
      onClick: () => handleAction('ver estoque'),
      color: 'bg-green-50 hover:bg-green-100 border-green-200'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-teal-600 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">VacEnF</h1>
                  <p className="text-sm text-gray-500">Sistema de Gestão de Vacinação</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-teal-100">
                <AvatarFallback className="bg-teal-100 text-teal-700">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Usuário</p>
                <p className="text-xs text-gray-500">ID: 201547</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-teal-100 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold text-gray-900">Seguro</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Thermometer className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Temperatura</p>
                  <p className="font-semibold text-gray-900">2-8°C</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Última atualização</p>
                  <p className="font-semibold text-gray-900">Agora</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-4">
            <h2 className="text-lg font-semibold text-gray-900">Ações Disponíveis</h2>
            <p className="text-sm text-gray-600">Selecione uma ação para gerenciar o sistema de vacinação</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {actions.map((action) => {
                const Icon = action.icon
                const isSelected = selectedAction === action.label.toLowerCase()
                
                return (
                  <Button
                    key={action.id}
                    onClick={action.onClick}
                    disabled={isLoading}
                    className={`h-auto p-6 ${action.color} border-2 hover:shadow-md transition-all duration-200 hover:scale-[1.02] flex flex-col items-center gap-4 text-center relative overflow-hidden ${
                      isSelected ? 'ring-2 ring-teal-500 ring-offset-2' : ''
                    }`}
                    variant="ghost"
                  >
                    <div className={`p-3 rounded-xl ${
                      action.id.includes('vaccine') || action.id.includes('stock') ? 'bg-teal-200' :
                      action.id.includes('temperature') ? 'bg-blue-200' :
                      action.id.includes('room') ? 'bg-gray-200' :
                      action.id.includes('cleaning') ? 'bg-purple-200' :
                      action.id.includes('map') ? 'bg-orange-200' : 'bg-green-200'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        action.id.includes('vaccine') || action.id.includes('stock') ? 'text-teal-700' :
                        action.id.includes('temperature') ? 'text-blue-700' :
                        action.id.includes('room') ? 'text-gray-700' :
                        action.id.includes('cleaning') ? 'text-purple-700' :
                        action.id.includes('map') ? 'text-orange-700' : 'text-green-700'
                      }`} />
                    </div>
                    <span className="text-sm font-medium text-gray-800 leading-tight">
                      {action.label}
                    </span>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="h-5 w-5 text-teal-600" />
                      </div>
                    )}
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  )
}