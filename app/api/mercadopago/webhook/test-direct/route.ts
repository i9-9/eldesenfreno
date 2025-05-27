import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Simulación directa del webhook sin llamadas a MercadoPago
export async function POST(request: Request) {
  try {
    console.log('=== PRUEBA DIRECTA DE WEBHOOK ===');
    
    // Datos simulados de un pago aprobado
    const simulatedOrderData = {
      paymentId: 'test-payment-' + Date.now(),
              customerName: 'Juan Pérez',
      customerEmail: 'templodetierra.ashram@gmail.com', // Email real para probar que llegan los emails
      customerPhone: '+54 11 1234-5678',
      shippingAddress: {
        street_name: 'Av. Corrientes',
        street_number: '1234',
        city: { name: 'Buenos Aires' },
        state: { name: 'CABA' },
        zip_code: '1043',
        country: { name: 'Argentina' }
      },
      items: [
        {
          title: 'Libro de Prueba - El Desenfreno',
          quantity: 1,
          unit_price: 1500,
          currency_id: 'ARS',
          description: 'Producto de prueba para testing'
        }
      ],
      total: 1500,
      date: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })
    };

    console.log('Datos del pedido simulado:', JSON.stringify(simulatedOrderData, null, 2));

    // Verificar configuración de email
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;
    const ownerEmail = process.env.OWNER_EMAIL;

    if (!emailUser || !emailPassword || !ownerEmail) {
      return NextResponse.json({
        success: false,
        error: 'Configuración de email incompleta',
        missing: {
          EMAIL_USER: !emailUser,
          EMAIL_PASSWORD: !emailPassword,
          OWNER_EMAIL: !ownerEmail
        }
      }, { status: 500 });
    }

    // Configurar transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPassword
      }
    });

    // Email al propietario
    const ownerMailOptions = {
      from: emailUser,
      to: ownerEmail,
      subject: '🛒 [PRUEBA] Nuevo pedido recibido - El Desenfreno',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">🧪 PRUEBA - Nuevo Pedido Recibido</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Información del Cliente</h3>
            <p><strong>Nombre:</strong> ${simulatedOrderData.customerName}</p>
            <p><strong>Email:</strong> ${simulatedOrderData.customerEmail}</p>
            <p><strong>Teléfono:</strong> ${simulatedOrderData.customerPhone}</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Productos</h3>
            ${simulatedOrderData.items.map(item => `
              <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
                <p><strong>${item.title}</strong></p>
                <p>Cantidad: ${item.quantity} | Precio: $${item.unit_price} ${item.currency_id}</p>
              </div>
            `).join('')}
            <p style="font-size: 18px; font-weight: bold; margin-top: 15px;">
              Total: $${simulatedOrderData.total} ARS
            </p>
          </div>

          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>⚠️ ESTO ES UNA PRUEBA</strong></p>
            <p>ID de Pago: ${simulatedOrderData.paymentId}</p>
            <p>Fecha: ${simulatedOrderData.date}</p>
          </div>
        </div>
      `
    };

    // Email al comprador
    const customerMailOptions = {
      from: emailUser,
      to: simulatedOrderData.customerEmail,
      subject: '✅ [PRUEBA] Confirmación de tu pedido - El Desenfreno',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">🧪 PRUEBA - ¡Gracias por tu pedido!</h2>
          
          <p>Hola ${simulatedOrderData.customerName},</p>
          <p>Hemos recibido tu pedido correctamente. Este es un email de prueba del sistema.</p>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Resumen de tu pedido</h3>
            ${simulatedOrderData.items.map(item => `
              <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
                <p><strong>${item.title}</strong></p>
                <p>Cantidad: ${item.quantity} | Precio: $${item.unit_price} ${item.currency_id}</p>
              </div>
            `).join('')}
            <p style="font-size: 18px; font-weight: bold; margin-top: 15px;">
              Total: $${simulatedOrderData.total} ARS
            </p>
          </div>

          <div style="background-color: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>✅ ESTO ES UNA PRUEBA</strong></p>
            <p>ID de Pago: ${simulatedOrderData.paymentId}</p>
            <p>Fecha: ${simulatedOrderData.date}</p>
          </div>

          <p>¡Gracias por elegir El Desenfreno Ediciones!</p>
        </div>
      `
    };

    // Enviar emails
    const results = {
      ownerEmail: null,
      customerEmail: null,
      errors: []
    };

    try {
      console.log('Enviando email al propietario...');
      const ownerResult = await transporter.sendMail(ownerMailOptions);
      results.ownerEmail = {
        success: true,
        messageId: ownerResult.messageId,
        to: ownerEmail
      };
      console.log('Email al propietario enviado:', ownerResult.messageId);
    } catch (error) {
      console.error('Error enviando email al propietario:', error);
      results.errors.push(`Error email propietario: ${error.message}`);
    }

    try {
      console.log('Enviando email al comprador...');
      const customerResult = await transporter.sendMail(customerMailOptions);
      results.customerEmail = {
        success: true,
        messageId: customerResult.messageId,
        to: simulatedOrderData.customerEmail
      };
      console.log('Email al comprador enviado:', customerResult.messageId);
    } catch (error) {
      console.error('Error enviando email al comprador:', error);
      results.errors.push(`Error email comprador: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Prueba directa de webhook completada',
      simulatedData: simulatedOrderData,
      emailResults: results,
      configuration: {
        emailUser: emailUser ? 'Configurado' : 'No configurado',
        ownerEmail: ownerEmail ? 'Configurado' : 'No configurado',
        emailPassword: emailPassword ? 'Configurado' : 'No configurado'
      }
    });

  } catch (error: any) {
    console.error('Error en prueba directa:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Endpoint de prueba directa de webhook',
    description: 'Simula el procesamiento de un pago sin llamar a MercadoPago',
    usage: 'POST para ejecutar la prueba'
  });
} 