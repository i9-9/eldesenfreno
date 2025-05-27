import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || ''
});

const preference = new Preference(client);
const payment = new Payment(client);

// Datos de tarjetas de prueba de MercadoPago
const TEST_CARDS = {
  approved: {
    visa: '4509953566233704',
    mastercard: '5031433215406351', 
    amex: '371180303257522'
  },
  rejected: {
    visa: '4013540682746260',
    mastercard: '5031433215406334'
  },
  pending: {
    visa: '4509953566233696'
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      scenario = 'approved', // 'approved', 'rejected', 'pending'
      items,
      payer,
      testType = 'preference' // 'preference' o 'direct_payment'
    } = body;

    console.log(`🧪 Iniciando prueba de pago - Escenario: ${scenario}, Tipo: ${testType}`);

    if (testType === 'preference') {
      // Crear preferencia de prueba
      // Detectar automáticamente la URL del servidor
      const headers = request.headers;
      const host = headers.get('host') || 'localhost:3002';
      const protocol = headers.get('x-forwarded-proto') || 'http';
      
      // Para las pruebas, siempre usar el host detectado dinámicamente
      // Esto evita problemas cuando el puerto cambia en desarrollo
      let siteUrl = `${protocol}://${host}`;
      
      console.log('🌐 Site URL final (forzado):', siteUrl);
      console.log('📡 Host detectado:', host);
      console.log('🔧 NEXT_PUBLIC_SITE_URL (ignorado en pruebas):', process.env.NEXT_PUBLIC_SITE_URL || 'NO CONFIGURADO');
      
      const testPreference = {
        items: items || [
          {
            title: 'Libro de Prueba - El Desenfreno',
            quantity: 1,
            unit_price: 1,
            currency_id: 'ARS',
            description: 'Producto de prueba para testing'
          }
        ],
        payer: payer || {
          name: 'Test User',
          email: 'test_user_187441@testuser.com', // Email de prueba recomendado por MP
          phone: {
            number: '1123456789'
          },
          address: {
            street_name: 'Calle Test',
            street_number: 123,
            zip_code: '1234'
          }
        },
        back_urls: {
          success: `${siteUrl}/success`,
          failure: `${siteUrl}/failure`,
          pending: `${siteUrl}/pending`
        },
        notification_url: `${siteUrl}/api/mercadopago/webhook`,
        // Configuración específica para pruebas
        external_reference: `test-${scenario}-${Date.now()}`
      };
      
      console.log('🔗 Back URLs:', testPreference.back_urls);
      console.log('📝 Full preference:', JSON.stringify(testPreference, null, 2));

      const response = await preference.create({ body: testPreference });

      return NextResponse.json({
        success: true,
        scenario,
        testType,
        preference: {
          id: response.id,
          init_point: response.init_point,
          sandbox_init_point: response.sandbox_init_point
        },
        testCards: TEST_CARDS,
        instructions: {
          scenario,
          recommendedCard: getRecommendedCard(scenario),
          testSteps: getTestSteps(scenario)
        }
      });

    } else if (testType === 'webhook_simulation') {
      // Simular webhook directamente
      const simulatedPayment = createSimulatedPayment(scenario);
      
      // Detectar automáticamente la URL del servidor
      const headers = request.headers;
      const host = headers.get('host') || 'localhost:3002';
      const protocol = headers.get('x-forwarded-proto') || 'http';
      
      // Para las pruebas, siempre usar el host detectado dinámicamente
      let siteUrl = `${protocol}://${host}`;
      
      // Simular llamada al webhook
      const webhookUrl = `${siteUrl}/api/mercadopago/webhook`;
      
      console.log('🔔 Webhook URL (forzado):', webhookUrl);
      console.log('📡 Host detectado:', host);
      
      try {
        // Simular el formato exacto que envía MercadoPago (form-urlencoded)
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `type=payment&data.id=${simulatedPayment.id}`
        });

        const webhookResult = await webhookResponse.json();

        return NextResponse.json({
          success: true,
          scenario,
          testType,
          simulatedPayment,
          webhookResult,
          message: `Webhook simulado para escenario: ${scenario}`
        });

      } catch (webhookError) {
        console.error('Error al simular webhook:', webhookError);
        return NextResponse.json({
          success: false,
          error: 'Error al simular webhook',
          details: webhookError
        }, { status: 500 });
      }
    }

  } catch (error: any) {
    console.error('Error en test de pago:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

export async function GET() {
  const token = process.env.MP_ACCESS_TOKEN || '';
  const isTestToken = token.startsWith('TEST-');
  
  return NextResponse.json({
    message: 'Endpoint de pruebas de MercadoPago',
    availableScenarios: ['approved', 'rejected', 'pending'],
    testTypes: ['preference', 'webhook_simulation'],
    testCards: TEST_CARDS,
    usage: {
      preference: 'POST con { "scenario": "approved|rejected|pending", "testType": "preference" }',
      webhook: 'POST con { "scenario": "approved|rejected|pending", "testType": "webhook_simulation" }'
    },
    environment: process.env.NODE_ENV,
    token: {
      configured: !!token,
      isTestToken,
      prefix: token ? token.substring(0, 10) + '...' : 'No configurado',
      warning: !isTestToken && token ? '⚠️ ADVERTENCIA: Parece ser un token de producción' : null
    },
    setup: {
      step1: '1. Crea cuentas de prueba en: https://www.mercadopago.com.ar/developers/panel/test/accounts',
      step2: '2. Usa el token de la cuenta VENDEDOR de prueba (no tu cuenta personal)',
      step3: '3. Asegúrate que el token comience con TEST-',
      documentation: 'Ver TESTING.md para instrucciones completas'
    }
  });
}

function getRecommendedCard(scenario: string) {
  switch (scenario) {
    case 'approved':
      return {
        number: TEST_CARDS.approved.visa,
        expiry: '12/25',
        cvv: '123',
        name: 'APRO',
        type: 'Visa'
      };
    case 'rejected':
      return {
        number: TEST_CARDS.rejected.visa,
        expiry: '12/25',
        cvv: '123',
        name: 'OTHE',
        type: 'Visa'
      };
    case 'pending':
      return {
        number: TEST_CARDS.pending.visa,
        expiry: '12/25',
        cvv: '123',
        name: 'CONT',
        type: 'Visa'
      };
    default:
      return null;
  }
}

function getTestSteps(scenario: string) {
  const baseSteps = [
    '1. Usar la tarjeta recomendada',
    '2. Completar el formulario con datos de prueba',
    '3. Confirmar el pago'
  ];

  const specificSteps = {
    approved: [
      ...baseSteps,
      '4. Verificar redirección a página de éxito',
      '5. Confirmar recepción de emails'
    ],
    rejected: [
      ...baseSteps,
      '4. Verificar mensaje de error',
      '5. Confirmar redirección a página de fallo'
    ],
    pending: [
      ...baseSteps,
      '4. Verificar redirección a página de pendiente',
      '5. Confirmar notificación de pago pendiente'
    ]
  };

  return specificSteps[scenario] || baseSteps;
}

function createSimulatedPayment(scenario: string) {
  const basePayment = {
    id: `test-${scenario}-${Date.now()}`,
    date_created: new Date().toISOString(),
    transaction_amount: 1,
    currency_id: 'ARS',
    description: `Pago de prueba - ${scenario}`,
    payment_method_id: 'visa',
    payment_type_id: 'credit_card',
    payer: {
      email: 'test_user_187441@testuser.com',
      first_name: 'Test',
      last_name: 'User'
    },
    external_reference: `test-${scenario}-${Date.now()}`
  };

  switch (scenario) {
    case 'approved':
      return {
        ...basePayment,
        status: 'approved',
        status_detail: 'accredited'
      };
    case 'rejected':
      return {
        ...basePayment,
        status: 'rejected',
        status_detail: 'cc_rejected_other_reason'
      };
    case 'pending':
      return {
        ...basePayment,
        status: 'pending',
        status_detail: 'pending_contingency'
      };
    default:
      return basePayment;
  }
} 