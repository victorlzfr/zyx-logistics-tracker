import { ShipmentStatus } from '../types/shipment.types';

export interface StatusConfig {
  label: string;
  color: string;
  badgeColor: string; // Classes Tailwind para badge
  bgColor: string;    // Classes Tailwind para background
}

export const STATUS_CONFIGS: Record<ShipmentStatus, StatusConfig> = {
  PENDING: {
    label: 'Pendente',
    color: 'yellow',
    badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    bgColor: 'bg-yellow-50'
  },
  IN_TRANSIT: {
    label: 'Em Trânsito',
    color: 'blue',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    bgColor: 'bg-blue-50'
  },
  DELIVERED: {
    label: 'Entregue',
    color: 'green',
    badgeColor: 'bg-green-100 text-green-800 border-green-300',
    bgColor: 'bg-green-50'
  },
  CANCELLED: {
    label: 'Cancelado',
    color: 'red',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    bgColor: 'bg-red-50'
  }
};

export const getStatusConfig = (status: ShipmentStatus): StatusConfig => {
  return STATUS_CONFIGS[status] || {
    label: status,
    color: 'gray',
    badgeColor: 'bg-gray-100 text-gray-800 border-gray-300',
    bgColor: 'bg-gray-50'
  };
};

export const getStatusOptions = () => {
  return Object.entries(STATUS_CONFIGS).map(([value, config]) => ({
    value: value as ShipmentStatus,
    label: config.label,
    color: config.color
  }));
};

// Função para obter apenas classes do badge
export const getStatusBadgeClass = (status: ShipmentStatus): string => {
  return getStatusConfig(status).badgeColor;
};

// Função para obter apenas classes de background
export const getStatusBgClass = (status: ShipmentStatus): string => {
  return getStatusConfig(status).bgColor;
};
