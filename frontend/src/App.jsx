import React, { useState } from 'react';
import ShipmentList from './components/ShipmentList';
import ShipmentForm from './components/ShipmentForm';
import './App.css';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(0);

  const handleFormSuccess = () => {
    setShowForm(false);
    setRefreshList(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">ZYX Logistics Tracker</h1>
          <p className="mt-2 opacity-90">Sistema de rastreamento logístico em tempo real</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">
            {showForm ? 'Novo Shipment' : 'Dashboard de Cargas'}
          </h2>
          
          <div className="space-x-4">
            {showForm ? (
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                ← Voltar para Lista
              </button>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                + Novo Shipment
              </button>
            )}
          </div>
        </div>
        
        {showForm ? (
          <ShipmentForm onSuccess={handleFormSuccess} />
        ) : (
          <>
            <ShipmentList key={refreshList} />
            
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
          </>
        )}
      </main>
    </div>
  );
}

export default App;
