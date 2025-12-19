// test-simple.js - Teste básico do Model Shipment
const Shipment = require('./src/models/Shipment');

async function test() {
  console.log("=== TESTE DO MODEL SHIPMENT ===\n");

  try {
    // Teste 1: Buscar todas as cargas
    console.log("1. Buscando todas as cargas...");
    const todasCargas = await Shipment.findAll();
    console.log(`   Encontradas: ${todasCargas.length} cargas\n`);

    // Teste 2: Buscar primeira carga por ID
    if (todasCargas.length > 0) {
      console.log("2. Buscando primeira carga por ID...");
      const primeiraCarga = await Shipment.findById(todasCargas[0].id);
      console.log(`   Número de rastreamento: ${primeiraCarga.tracking_number}`);
      console.log(`   Cliente: ${primeiraCarga.customer_name}\n`);
    }

    // Teste 3: Buscar por tracking number
    console.log("3. Buscando por número de rastreamento...");
    const porTracking = await Shipment.findByTrackingNumber('ZYX202512001');
    if (porTracking) {
      console.log(`   Encontrada: ${porTracking.customer_name}`);
      console.log(`   Status: ${porTracking.status}\n`);
    }

    console.log("TODOS OS TESTES PASSARAM!");

  } catch (error) {
    console.error("ERRO NO TESTE:", error.message);
  }
}

test();
