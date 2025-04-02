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
      id: 'TEST-' + Date.now(),
      status: 'approved',
      payer: {
        first_name: 'Ivan',
        last_name: 'Nevares',
        email: 'ivannevares9@gmail.com',
        phone: {
          number: '1123884162'
        }
      },
      additional_info: {
        items: [
          {
            title: 'El Desenfreno',
            quantity: 1,
            unit_price: 1500
          }
        ],
        shipments: {
          receiver_address: {
            street_name: 'Calle de prueba',
            street_number: '123',
            city: {
              name: 'Ciudad de prueba'
            },
            state: {
              name: 'Estado de prueba'
            },
            zip_code: '1234'
          }
        }
      },
      transaction_details: {
        total_paid_amount: 1500
      }
    };

    // Enviar notificación al propietario
    console.log('Enviando notificación al propietario...');
    const ownerMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL,
      subject: `Nuevo pedido #${paymentData.id}`,
      html: `
        <h1 style="color: #333; font-family: Arial, sans-serif;">Nuevo pedido recibido</h1>
        <p><strong>ID de pago:</strong> ${paymentData.id}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
        <h2 style="color: #333; font-family: Arial, sans-serif;">Datos del cliente</h2>
        <p><strong>Nombre:</strong> ${paymentData.payer.first_name} ${paymentData.payer.last_name}</p>
        <p><strong>Email:</strong> ${paymentData.payer.email}</p>
        <p><strong>Teléfono:</strong> ${paymentData.payer.phone.number}</p>
        
        <h2 style="color: #333; font-family: Arial, sans-serif;">Dirección de envío</h2>
        <p>${paymentData.additional_info.shipments.receiver_address.street_name} ${paymentData.additional_info.shipments.receiver_address.street_number}</p>
        <p>${paymentData.additional_info.shipments.receiver_address.city.name}, ${paymentData.additional_info.shipments.receiver_address.state.name}</p>
        <p>${paymentData.additional_info.shipments.receiver_address.zip_code}</p>
        
        <h2 style="color: #333; font-family: Arial, sans-serif;">Productos</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Producto</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Cantidad</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${paymentData.additional_info.items.map(item => `
              <tr>
                <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${item.title}</td>
                <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">$${item.unit_price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <h2 style="color: #333; font-family: Arial, sans-serif;">Total</h2>
        <p style="font-size: 18px; font-weight: bold;">$${paymentData.transaction_details.total_paid_amount}</p>
      `
    };

    await transporter.sendMail(ownerMailOptions);
    console.log('Notificación al propietario enviada');

    // Enviar confirmación al comprador
    console.log('Enviando confirmación al comprador:', paymentData.payer.email);
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: paymentData.payer.email,
      subject: `¡Gracias por tu compra en El Desenfreno Ediciones! #${paymentData.id}`,
      html: `
        <h1 style="color: #333; font-family: Arial, sans-serif;">¡Gracias por tu compra!</h1>
        <p>Hola ${paymentData.payer.first_name} ${paymentData.payer.last_name},</p>
        <p>Tu pedido ha sido confirmado. Acá te dejamos los detalles:</p>
        
        <p><strong>Número de pedido:</strong> ${paymentData.id}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
        
        <h2 style="color: #333; font-family: Arial, sans-serif;">Productos</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Producto</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Cantidad</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${paymentData.additional_info.items.map(item => `
              <tr>
                <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${item.title}</td>
                <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">$${item.unit_price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <h2 style="color: #333; font-family: Arial, sans-serif;">Total</h2>
        <p style="font-size: 18px; font-weight: bold;">$${paymentData.transaction_details.total_paid_amount}</p>
        
        <h2 style="color: #333; font-family: Arial, sans-serif;">Contacto</h2>
        <p>Si tenés alguna duda sobre tu pedido, podés contactarnos por:</p>
        <ul style="list-style: none; padding: 0;">
          <li style="margin: 10px 0;">
            <strong>WhatsApp:</strong> 
            <a href="https://wa.me/5491123884162" style="color: #25D366; text-decoration: none;">
              +54 9 11 2388-4162
            </a>
          </li>
          <li style="margin: 10px 0;">
            <strong>Email:</strong> 
            <a href="mailto:eldesenfreno.contacto@gmail.com" style="color: #333; text-decoration: none;">
              eldesenfreno.contacto@gmail.com
            </a>
          </li>
        </ul>
        
        <p style="margin-top: 20px;">¡Gracias por confiar en El Desenfreno Ediciones!</p>
        <p style="color: #666; font-size: 14px;">Saludos,<br>El Desenfreno Ediciones</p>
      `
    };

    await transporter.sendMail(customerMailOptions);
    console.log('Confirmación al comprador enviada');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test de notificación completado',
      paymentData
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