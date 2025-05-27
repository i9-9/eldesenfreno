#!/usr/bin/env node

/**
 * Script de pruebas de MercadoPago para desarrollo
 * Uso: node scripts/test-mp.js [scenario] [testType]
 * 
 * Escenarios: approved, rejected, pending
 * Tipos: preference, webhook
 */

const https = require('https');
const http = require('http');

// Configuración
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const API_URL = `${SITE_URL}/api/mercadopago/test-payment`;

// Función para mostrar ayuda
function showHelp() {
  console.log(`
🧪 Script de Pruebas de MercadoPago

Uso:
  node scripts/test-mp.js [scenario] [testType]

Escenarios disponibles:
  approved  - Pago aprobado (por defecto)
  rejected  - Pago rechazado
  pending   - Pago pendiente

Tipos de prueba:
  preference         - Crear preferencia completa (por defecto)
  webhook_simulation - Simular solo webhook

Ejemplos:
  node scripts/test-mp.js
  node scripts/test-mp.js approved preference
  node scripts/test-mp.js rejected webhook_simulation
  node scripts/test-mp.js pending

Variables de entorno necesarias:
  NEXT_PUBLIC_SITE_URL - URL del sitio (default: http://localhost:3000)
  MP_ACCESS_TOKEN      - Token de MercadoPago
  EMAIL_USER           - Usuario de email
  EMAIL_PASSWORD       - Contraseña de email
  OWNER_EMAIL          - Email del propietario
`);
}

// Argumentos de línea de comandos
const args = process.argv.slice(2);

// Verificar si se pidió ayuda ANTES de validar argumentos
if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

const scenario = args[0] || 'approved';
const testType = args[1] || 'preference';

// Validación de argumentos
const validScenarios = ['approved', 'rejected', 'pending'];
const validTestTypes = ['preference', 'webhook_simulation'];

if (!validScenarios.includes(scenario)) {
  console.error(`❌ Escenario inválido: ${scenario}`);
  console.error(`Escenarios válidos: ${validScenarios.join(', ')}`);
  process.exit(1);
}

if (!validTestTypes.includes(testType)) {
  console.error(`❌ Tipo de prueba inválido: ${testType}`);
  console.error(`Tipos válidos: ${validTestTypes.join(', ')}`);
  process.exit(1);
}

// Función para hacer peticiones HTTP
function makeRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({ statusCode: res.statusCode, data: result });
        } catch (error) {
          resolve({ statusCode: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Función principal
async function runTest() {
  console.log('🧪 Iniciando prueba de MercadoPago...');
  console.log(`📋 Escenario: ${scenario}`);
  console.log(`🔧 Tipo: ${testType}`);
  console.log(`🌐 URL: ${API_URL}`);
  console.log('─'.repeat(50));

  try {
    const requestData = {
      scenario,
      testType,
      items: [
        {
          title: 'Libro de Prueba - El Desenfreno',
          quantity: 1,
          unit_price: 1,
          currency_id: 'ARS',
          description: 'Producto de prueba para testing desde CLI'
        }
      ]
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    console.log('📤 Enviando petición...');
    const response = await makeRequest(API_URL, options, requestData);

    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ Prueba exitosa!');
      
      if (response.data.preference) {
        console.log('\n🔗 Preferencia creada:');
        console.log(`   ID: ${response.data.preference.id}`);
        console.log(`   Checkout: ${response.data.preference.init_point}`);
        
        if (response.data.instructions?.recommendedCard) {
          const card = response.data.instructions.recommendedCard;
          console.log('\n💳 Tarjeta recomendada:');
          console.log(`   Número: ${card.number}`);
          console.log(`   Vencimiento: ${card.expiry}`);
          console.log(`   CVV: ${card.cvv}`);
          console.log(`   Nombre: ${card.name}`);
        }
        
        if (response.data.instructions?.testSteps) {
          console.log('\n📋 Pasos a seguir:');
          response.data.instructions.testSteps.forEach((step, index) => {
            console.log(`   ${step}`);
          });
        }
        
        console.log('\n🚀 Para probar, visita el link de checkout arriba');
      }
      
      if (response.data.webhookResult) {
        console.log('\n🔔 Resultado del webhook:');
        console.log('   Estado:', response.data.webhookResult.success ? '✅ Exitoso' : '❌ Fallido');
        if (response.data.webhookResult.paymentProcessed) {
          console.log('   Pago procesado:', response.data.webhookResult.paymentProcessed);
        }
        if (response.data.webhookResult.emailsSent) {
          console.log('   Emails enviados:', response.data.webhookResult.emailsSent);
        }
      }
      
      if (response.data.message) {
        console.log('\n📝 Mensaje:', response.data.message);
      }
      
    } else {
      console.log('❌ Error en la prueba:');
      console.log('   Status:', response.statusCode);
      console.log('   Error:', response.data.error || response.data);
    }

  } catch (error) {
    console.error('💥 Error inesperado:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n🚨 No se pudo conectar al servidor.');
      console.error('   Asegúrate de que el servidor Next.js esté corriendo:');
      console.error('   npm run dev');
    }
  }
}

// Ejecutar prueba
runTest().catch(error => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
}); 