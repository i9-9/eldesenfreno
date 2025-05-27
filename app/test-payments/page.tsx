'use client';

import { useState } from 'react';

interface TestResult {
  success: boolean;
  scenario?: string;
  testType?: string;
  preference?: {
    id: string;
    init_point: string;
    sandbox_init_point?: string;
  };
  testCards?: any;
  instructions?: any;
  error?: string;
  webhookResult?: any;
  simulatedPayment?: any;
  message?: string;
}

export default function TestPayments() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [scenario, setScenario] = useState('approved');
  const [testType, setTestType] = useState('preference');

  const runTest = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/mercadopago/test-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario,
          testType,
          items: [
            {
              title: 'Libro de Prueba - El Desenfreno',
              quantity: 1,
              unit_price: 1,
              currency_id: 'ARS',
              description: 'Producto de prueba para testing'
            }
          ]
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setLoading(false);
    }
  };

  const getInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/mercadopago/test-payment');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" style={{ fontFamily: 'neue-haas-grotesk-text, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🧪 Panel de Pruebas de MercadoPago
          </h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Panel de Control */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Configuración de Prueba</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Escenario de Pago
                </label>
                <select
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="approved">✅ Pago Aprobado</option>
                  <option value="rejected">❌ Pago Rechazado</option>
                  <option value="pending">⏳ Pago Pendiente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Prueba
                </label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="preference">🔗 Crear Preferencia (Checkout completo)</option>
                  <option value="webhook_simulation">🔔 Simular Webhook (Solo backend)</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={runTest}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Ejecutando...' : '🚀 Ejecutar Prueba'}
                </button>
                
                <button
                  onClick={getInfo}
                  disabled={loading}
                  className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:opacity-50"
                >
                  ℹ️ Info
                </button>
              </div>
            </div>

            {/* Panel de Información */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Tarjetas de Prueba
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="bg-green-100 p-2 rounded">
                  <strong>✅ Pagos Aprobados:</strong>
                  <br />Visa: 4509 9535 6623 3704
                  <br />Mastercard: 5031 4332 1540 6351
                </div>
                
                <div className="bg-red-100 p-2 rounded">
                  <strong>❌ Pagos Rechazados:</strong>
                  <br />Visa: 4013 5406 8274 6260
                  <br />Mastercard: 5031 4332 1540 6334
                </div>
                
                <div className="bg-yellow-100 p-2 rounded">
                  <strong>⏳ Pagos Pendientes:</strong>
                  <br />Visa: 4509 9535 6623 3696
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-600">
                <p><strong>Datos comunes para todas:</strong></p>
                <p>• Vencimiento: 12/25</p>
                <p>• CVV: 123</p>
                <p>• Nombre: APRO (aprobado), OTHE (rechazado), CONT (pendiente)</p>
              </div>
            </div>
          </div>

          {/* Resultados */}
          {result && (
            <div className="mt-6 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-3">
                {result.success ? '✅ Resultado' : '❌ Error'}
              </h3>
              
              {result.success ? (
                <div className="space-y-4">
                  {result.preference && (
                    <div className="bg-green-50 p-4 rounded">
                      <h4 className="font-semibold text-green-800 mb-2">
                        🔗 Preferencia Creada
                      </h4>
                      <p><strong>ID:</strong> {result.preference.id}</p>
                      <div className="mt-2">
                        <a
                          href={result.preference.init_point}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          🛒 Ir al Checkout de Prueba
                        </a>
                      </div>
                    </div>
                  )}

                  {result.instructions && (
                    <div className="bg-blue-50 p-4 rounded">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        📋 Instrucciones
                      </h4>
                      <p><strong>Tarjeta recomendada:</strong></p>
                      <p className="font-mono text-sm bg-white p-2 rounded mt-1">
                        {result.instructions.recommendedCard?.number} | 
                        {result.instructions.recommendedCard?.expiry} | 
                        CVV: {result.instructions.recommendedCard?.cvv} | 
                        Nombre: {result.instructions.recommendedCard?.name}
                      </p>
                      
                      <div className="mt-3">
                        <p><strong>Pasos:</strong></p>
                        <ol className="list-decimal list-inside text-sm mt-1 space-y-1">
                          {result.instructions.testSteps?.map((step: string, index: number) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}

                  {result.webhookResult && (
                    <div className="bg-purple-50 p-4 rounded">
                      <h4 className="font-semibold text-purple-800 mb-2">
                        🔔 Resultado del Webhook
                      </h4>
                      <pre className="text-xs bg-white p-2 rounded overflow-x-auto">
                        {JSON.stringify(result.webhookResult, null, 2)}
                      </pre>
                    </div>
                  )}

                  {result.message && (
                    <div className="bg-gray-100 p-3 rounded">
                      <p className="text-gray-700">{result.message}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-50 p-4 rounded">
                  <p className="text-red-700">{result.error}</p>
                </div>
              )}

              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                  Ver respuesta completa (JSON)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {/* Guía de uso */}
          <div className="mt-8 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              📚 Guía de Uso
            </h3>
            
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <strong>1. Crear Preferencia:</strong> Genera un link de checkout real para probar el flujo completo.
              </div>
              <div>
                <strong>2. Simular Webhook:</strong> Prueba solo la lógica del backend sin pasar por MercadoPago.
              </div>
              <div>
                <strong>3. Escenarios:</strong> Prueba diferentes estados de pago (aprobado, rechazado, pendiente).
              </div>
              <div>
                <strong>4. Variables de entorno necesarias:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>MP_ACCESS_TOKEN (token de prueba)</li>
                  <li>NEXT_PUBLIC_SITE_URL</li>
                  <li>EMAIL_USER y EMAIL_PASSWORD</li>
                  <li>OWNER_EMAIL</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 