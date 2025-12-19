// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import ShipmentList from './components/ShipmentList';
import ShipmentForm from './components/ShipmentForm';
import ShipmentDetail from './components/ShipmentDetail';
import './App.css';

// Interface para o componente App (sem props por enquanto)
interface AppProps {
  // Adicionar props aqui se necessário no futuro
}

const App: React.FC<AppProps> = () => {
  // Componente interno para a rota de criação que precisa do navigate
  const CreateShipmentPage: React.FC = () => {
    const navigate = useNavigate();
    
    const handleShipmentCreated = () => {
      console.log('Shipment criado com sucesso! Redirecionando...');
      navigate('/'); // Redireciona para o dashboard após criação
    };

    return (
      <>
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Novo Shipment</h2>
          <Link to="/" className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
            ← Voltar para Dashboard
          </Link>
        </div>
        <ShipmentForm onSuccess={handleShipmentCreated} />
      </>
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">ZYX Logistics Tracker</h1>
                <p className="mt-2 opacity-90">Sistema de rastreamento logístico em tempo real</p>
              </div>
              <nav className="space-x-4">
                <Link to="/" className="hover:text-blue-200 font-medium">Dashboard</Link>
                <Link to="/new" className="hover:text-blue-200 font-medium">Novo Shipment</Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* Dashboard com lista */}
            <Route path="/" element={
              <>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">Dashboard de Cargas</h2>
                  <Link to="/new" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                    + Novo Shipment
                  </Link>
                </div>
                <ShipmentList />
                <SystemStatus />
              </>
            } />

            {/* Página de criação */}
            <Route path="/new" element={<CreateShipmentPage />} />

            {/* Página de detalhes */}
            <Route path="/shipments/:id" element={<ShipmentDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

// Componente de status do sistema (extraído do dashboard)
const SystemStatus: React.FC = () => {
  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Status do Sistema</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded border border-green-200">
          <div className="text-green-800 font-bold">Backend</div>
          <div className="text-green-600">Conectado • Porta 5000</div>
        </div>
        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <div className="text-blue-800 font-bold">Frontend</div>
          <div className="text-blue-600">Operacional • Porta 5173</div>
        </div>
        <div className="bg-purple-50 p-4 rounded border border-purple-200">
          <div className="text-purple-800 font-bold">Banco de Dados</div>
          <div className="text-purple-600">PostgreSQL • 12+ shipments</div>
        </div>
      </div>
    </div>
  );
};

export default App;
