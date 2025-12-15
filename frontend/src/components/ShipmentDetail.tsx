// src/components/ShipmentDetail.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shipmentAPI } from '../services/api';
import { Shipment, ShipmentStatus } from '../types/shipment.types';

interface StatusOption {
  value: ShipmentStatus;
  label: string;
  color: string;
}

const ShipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [updating, setUpdating] = useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<ShipmentStatus | ''>('');

  // Estados para status options
  const statusOptions: StatusOption[] = [
    { value: 'PENDING', label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'IN_TRANSIT', label: 'Em Trânsito', color: 'bg-blue-100 text-blue-800' },
    { value: 'DELIVERED', label: 'Entregue', color: 'bg-green-100 text-green-800' },
    { value: 'CANCELLED', label: 'Cancelado', color: 'bg-red-100 text-red-800' }
  ];

  // Buscar detalhes do shipment
  useEffect(() => {
    const fetchShipmentDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await shipmentAPI.getById(parseInt(id));
        console.log('Detalhes recebidos:', response.data);
        setShipment(response.data.data);
      } catch (err: any) {
        console.error('Erro ao buscar detalhes:', err);
        setError('Erro ao carregar detalhes do shipment');
      } finally {
        setLoading(false);
      }
    };

    fetchShipmentDetails();
  }, [id]);

  // Função para atualizar status
  const handleUpdateStatus = async () => {
    if (!newStatus || !id) return;

    try {
      setUpdating(true);
      await shipmentAPI.updateStatus(parseInt(id), newStatus);

      // Atualizar shipment localmente
      setShipment(prev => prev ? {
        ...prev,
        status: newStatus,
        updated_at: new Date().toISOString()
      } : null);

      setShowStatusModal(false);
      setNewStatus('');

      // Feedback visual
      alert('Status atualizado com sucesso!');

    } catch (err: any) {
      console.error('Erro ao atualizar status:', err);
      alert('Erro ao atualizar status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Formatar data
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
  };

  // Formatar moeda (simulação)
  const formatCurrency = (value?: number | string): string => {
    // Simulação - poderia calcular frete baseado em peso/distância
    const weight = typeof value === 'string' ? parseFloat(value) : value || 0;
    const estimatedCost = weight * 2.5; // R$ 2,50 por kg
    return `R$ ${estimatedCost.toFixed(2)} (estimado)`;
  };

  // Traduzir status
  const getStatusInfo = (status: ShipmentStatus): StatusOption => {
    return statusOptions.find(opt => opt.value === status) ||
           { value: status, label: status, color: 'bg-gray-100 text-gray-800' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-blue-600 font-semibold">Carregando detalhes do shipment...</div>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
          <div className="font-semibold text-lg">Erro</div>
          <div className="mt-2">{error || 'Shipment não encontrado'}</div>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Voltar para Dashboard
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(shipment.status);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Detalhes do Shipment</h1>
          <p className="text-gray-600 mt-1">Tracking: <span className="font-mono font-bold">{shipment.tracking_number}</span></p>
        </div>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            ← Voltar
          </button>
          <button
            onClick={() => setShowStatusModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Atualizar Status
          </button>
        </div>
      </div>

      {/* Card principal */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        {/* Status banner */}
        <div className={`${statusInfo.color} px-6 py-4`}>
          <div className="flex justify-between items-center">
            <div>
              <span className="font-bold text-lg">{statusInfo.label}</span>
              <p className="text-sm opacity-90">
                ID: {shipment.id} • Criado em: {formatDate(shipment.created_at)}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.color}`}>
              {shipment.status}
            </span>
          </div>
        </div>

        {/* Conteúdo em grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Coluna 1: Informações básicas */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Informações do Cliente</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">Cliente</div>
                    <div className="font-medium">{shipment.customer_name}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Produto</div>
                      <div className="font-medium">{shipment.product_description || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Quantidade</div>
                      <div className="font-medium">{shipment.quantity} unidades</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Peso</div>
                    <div className="font-medium">{shipment.weight_kg} kg</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Rastreamento</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">Número de Tracking</div>
                    <div className="font-mono font-bold text-blue-600">{shipment.tracking_number}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Última Atualização</div>
                      <div className="font-medium">{formatDate(shipment.updated_at)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Criado em</div>
                      <div className="font-medium">{formatDate(shipment.created_at)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna 2: Logística */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Logística</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">Origem</div>
                        <div className="font-medium text-lg">{shipment.origin}</div>
                      </div>
                      <div className="text-gray-400 mx-4">→</div>
                      <div>
                        <div className="text-sm text-gray-500">Destino</div>
                        <div className="font-medium text-lg">{shipment.destination}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Chegada Estimada</div>
                      <div className="font-medium">{formatDate(shipment.estimated_arrival)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Chegada Real</div>
                      <div className="font-medium">{formatDate(shipment.actual_arrival) || 'Pendente'}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">Custo Estimado</div>
                    <div className="font-medium">{formatCurrency(shipment.weight_kg)}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Observações</h3>
                <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
                  {shipment.notes ? (
                    <p className="text-gray-700">{shipment.notes}</p>
                  ) : (
                    <p className="text-gray-400 italic">Nenhuma observação registrada</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para atualizar status */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Atualizar Status</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Novo Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewStatus(e.target.value as ShipmentStatus)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione um status</option>
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setNewStatus('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={updating}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={!newStatus || updating}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    !newStatus || updating
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {updating ? 'Atualizando...' : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nota sobre DELETE (opcional) */}
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg">
        <p className="text-sm">
          <strong>Nota:</strong> A funcionalidade de DELETE não foi implementada por decisão de negócio
          (mantém histórico completo). O status pode ser atualizado acima.
        </p>
      </div>
    </div>
  );
};

export default ShipmentDetail;
