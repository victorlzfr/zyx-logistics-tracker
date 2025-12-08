import React from 'react';
import ShipmentForm from '../components/ShipmentForm';

const TestForm = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Teste do Formulário</h1>
        <ShipmentForm />
      </div>
    </div>
  );
};

export default TestForm;
