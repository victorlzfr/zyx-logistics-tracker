// src/components/ShipmentForm.tsx
import { getStatusOptions } from '../utils/statusUtils';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { shipmentAPI } from '../services/api';
import { Shipment, ShipmentCreateDTO, ShipmentStatus } from '../types/shipment.types';

interface ShipmentFormProps {
  onSuccess?: (shipment: Shipment) => void;
}

interface FormData {
  customer_name: string;
  origin: string;
  destination: string;
  product_description: string;
  quantity: number | string;
  weight_kg: number | string;
  status: ShipmentStatus;
  estimated_arrival: string;
  notes: string;
}

const ShipmentForm: React.FC<ShipmentFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    customer_name: '',
    origin: '',
    destination: '',
    product_description: '',
    quantity: 1,
    weight_kg: '',
    status: 'PENDING',
    estimated_arrival: '',
    notes: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  // Estados para opções (podem vir de API no futuro)
  const statusOptions = getStatusOptions();

  // Estados para cidades (exemplo)
  const [cities] = useState<string[]>([
    'São Paulo - SP',
    'Rio de Janeiro - RJ',
    'Belo Horizonte - MG',
    'Porto Alegre - RS',
    'Curitiba - PR',
    'Fortaleza - CE',
    'Salvador - BA',
    'Recife - PE',
    'Brasília - DF',
    'Manaus - AM'
  ]);

  // Handler para mudanças nos inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler para submit do formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validação básica
      if (!formData.customer_name || !formData.origin || !formData.destination) {
        throw new Error('Preencha os campos obrigatórios');
      }

      // Preparar dados para API
      const shipmentData: ShipmentCreateDTO = {
        customer_name: formData.customer_name,
        origin: formData.origin,
        destination: formData.destination,
        product_description: formData.product_description || undefined,
        quantity: typeof formData.quantity === 'string' ? parseInt(formData.quantity) : formData.quantity,
        weight_kg: typeof formData.weight_kg === 'string' ? parseFloat(formData.weight_kg) : formData.weight_kg,
        status: formData.status,
        estimated_arrival: formData.estimated_arrival || undefined,
        notes: formData.notes || undefined
      };

      console.log('Enviando dados:', shipmentData);

      // Chamar API
      const response = await shipmentAPI.create(shipmentData);

      console.log('Resposta da API:', response.data);

      // Sucesso!
      setSuccess(true);

      // Resetar formulário
      setFormData({
        customer_name: '',
        origin: '',
        destination: '',
        product_description: '',
        quantity: 1,
        weight_kg: '',
        status: 'PENDING',
        estimated_arrival: '',
        notes: ''
      });

      // Notificar componente pai se necessário
      if (onSuccess && response.data.data) {
        onSuccess(response.data.data);
      }

      // Auto-reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);

    } catch (err: any) {
      console.error('Erro ao criar shipment:', err);
      setError(err.response?.data?.message || err.message || 'Erro ao criar shipment');
    } finally {
      setLoading(false);
    }
  };

  // Calcula data mínima (amanhã)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
        <h2 className="text-2xl font-bold text-gray-800">Novo Shipment</h2>
        <p className="text-gray-600 mt-1">Preencha os dados da carga para rastreamento</p>
      </div>

      {/* Mensagens de status */}
      {error && (
        <div className="m-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <div className="font-semibold">Erro</div>
          <div>{error}</div>
        </div>
      )}

      {success && (
        <div className="m-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          <div className="font-semibold">Sucesso!</div>
          <div>Shipment criado com sucesso. Você pode visualizá-lo na lista principal.</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Coluna 1 */}
          <div className="space-y-4">
            {/* Cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Cliente *
              </label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Tech Solutions Ltda"
                required
              />
            </div>

            {/* Origem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Origem *
              </label>
              <select
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Selecione a origem</option>
                {cities.map(city => (
                  <option key={`origin-${city}`} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Destino */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destino *
              </label>
              <select
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Selecione o destino</option>
                {cities.map(city => (
                  <option key={`dest-${city}`} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Inicial
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Coluna 2 */}
          <div className="space-y-4">
            {/* Descrição do Produto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição do Produto
              </label>
              <textarea
                name="product_description"
                value={formData.product_description}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Notebooks Dell XPS 15 - Lote produção"
              />
            </div>

            {/* Quantidade e Peso */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  name="weight_kg"
                  value={formData.weight_kg}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 25.50"
                />
              </div>
            </div>

            {/* Data Estimada de Chegada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chegada Estimada
              </label>
              <input
                type="date"
                name="estimated_arrival"
                value={formData.estimated_arrival}
                onChange={handleChange}
                min={minDate}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas Adicionais
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Informações adicionais sobre a carga..."
              />
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setFormData({
                customer_name: '',
                origin: '',
                destination: '',
                product_description: '',
                quantity: 1,
                weight_kg: '',
                status: 'PENDING',
                estimated_arrival: '',
                notes: ''
              });
              setError('');
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Limpar
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </span>
            ) : 'Criar Shipment'}
          </button>
        </div>

        {/* Ajuda */}
        <div className="mt-6 text-sm text-gray-500">
          <p className="font-medium">Campos obrigatórios: *</p>
          <p className="mt-1">O sistema gerará automaticamente um número de tracking único (ZYX + timestamp).</p>
        </div>
      </form>
    </div>
  );
};

export default ShipmentForm;
