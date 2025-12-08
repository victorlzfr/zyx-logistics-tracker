import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { shipmentAPI } from '../services/api';

const ShipmentList = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setLoading(true);
        const response = await shipmentAPI.getAll();
        console.log('Dados recebidos:', response.data);
        setShipments(response.data.data || []);
      } catch (err) {
        setError('Erro ao carregar shipments: ' + err.message);
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  // Função para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Função para traduzir status
  const translateStatus = (status) => {
    const statusMap = {
      'PENDING': 'Pendente',
      'IN_TRANSIT': 'Em Trânsito',
      'DELIVERED': 'Entregue',
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-blue-600 font-semibold">Carregando shipments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">
          Rastreamento de Cargas ({shipments.length})
        </h2>
        <p className="text-gray-600 mt-1">Monitoramento em tempo real</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tracking #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Origem → Destino
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chegada Estimada
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-mono font-bold text-blue-600">
                    {shipment.tracking_number}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{shipment.customer_name}</div>
                  <div className="text-sm text-gray-500">{shipment.product_description}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <span className="font-medium">{shipment.origin}</span>
                    <span className="mx-2 text-gray-400">→</span>
                    <span className="font-medium">{shipment.destination}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {shipment.quantity} un. • {shipment.weight_kg} kg
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    shipment.status === 'DELIVERED' 
                      ? 'bg-green-100 text-green-800'
                      : shipment.status === 'IN_TRANSIT'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {translateStatus(shipment.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(shipment.estimated_arrival)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link 
                    to={`/shipments/${shipment.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {shipments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum shipment encontrado. Crie o primeiro!
        </div>
      )}
    </div>
  );
};

export default ShipmentList;
