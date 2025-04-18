import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true,
});

export async function GET() {
  try {
    // Simular datos de un pago exitoso
    const paymentData = {
      id: 'MP-' + Date.now(),
      status: 'approved',
      payer: {
        first_name: 'Ivan',
        last_name: 'Nevares',
        email: 'ivannevares9@gmail.com', // Este es el email del pagador en MercadoPago
        phone: {
          number: '1123884162'
        }
      },
      additional_info: {
        preference_id: 'TEST-PREF-' + Date.now(),
        items: [
          {
            title: 'El Desenfreno - Poesía',
            quantity: 1,
            unit_price: 3500
          },
          {
            title: 'Antología Poética',
            quantity: 2,
            unit_price: 2800
          }
        ],
        shipments: {
          receiver_address: {
            street_name: 'Avenida Siempreviva',
            street_number: '742',
            city: {
              name: 'Buenos Aires'
            },
            state: {
              name: 'CABA'
            },
            zip_code: '1425'
          }
        }
      },
      transaction_details: {
        total_paid_amount: 9100
      }
    };
    
    // Simular una preferencia de pago con el email del comprador
    const preferenceData = {
      id: paymentData.additional_info.preference_id,
      payer: {
        email: 'yvan.vrs@gmail.com', // Este es el email que queremos usar (el del formulario)
        name: 'Ivan Nevares',
        phone: {
          number: '1123884162'
        }
      },
      items: [
        {
          title: 'El Desenfreno - Poesía',
          quantity: 1,
          unit_price: 3500,
          currency_id: 'ARS',
          description: 'Libro de poesía contemporánea'
        },
        {
          title: 'Antología Poética',
          quantity: 2,
          unit_price: 2800,
          currency_id: 'ARS',
          description: 'Compilación de autores latinoamericanos'
        }
      ],
      date_created: new Date().toISOString(),
      shipments: {
        receiver_address: {
          street_name: 'Avenida Siempreviva',
          street_number: '742',
          city: {
            name: 'Buenos Aires'
          },
          state: {
            name: 'CABA'
          },
          zip_code: '1425'
        }
      }
    };

    // Llamar al webhook con los datos simulados
    console.log('Llamando al webhook con datos simulados...');
    const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/mercadopago/webhook`;
    
    // Construir el cuerpo de la notificación
    const notificationBody = new URLSearchParams({
      'type': 'payment',
      'data.id': paymentData.id
    }).toString();
    
    // Mock de la API de MercadoPago
    // Sobrescribir temporalmente las funciones que serían llamadas
    const originalFetch = global.fetch;
    global.fetch = async (url: string, options: any) => {
      if (url.includes('/v1/payments/')) {
        return {
          ok: true,
          json: async () => paymentData
        } as Response;
      } else if (url.includes('/checkout/preferences/')) {
        return {
          ok: true,
          json: async () => preferenceData
        } as Response;
      }
      return originalFetch(url, options);
    };
    
    // Llamada simulada al webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: notificationBody
    });
    
    // Restaurar fetch original
    global.fetch = originalFetch;
    
    // Verificar respuesta
    const responseData = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test de notificación completado',
      paymentData,
      preferenceData,
      webhookResponse: responseData
    });
    
  } catch (error: any) {
    console.error('Error en el test:', error);
    console.error('Stack trace:', error.stack);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
    }
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 