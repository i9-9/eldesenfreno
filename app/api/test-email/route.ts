import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true, // Habilitar logs de nodemailer
});

export async function GET() {
  try {
    const ownerEmail = process.env.OWNER_EMAIL;
    
    if (!ownerEmail) {
      console.error('OWNER_EMAIL no configurado');
      return NextResponse.json({ error: 'OWNER_EMAIL no configurado' }, { status: 500 });
    }
    
    console.log('Preparando email de prueba para:', ownerEmail);
    
    // Datos simulados de una compra
    const orderData = {
      paymentId: 'TEST-123456',
      customerName: 'Juan Pérez',
      customerEmail: 'juan@ejemplo.com',
      customerPhone: '11 1234-5678',
      shippingAddress: {
        street_name: 'Av. Corrientes',
        street_number: '1234',
        city: { name: 'Ciudad Autónoma de Buenos Aires' },
        state: { name: 'Buenos Aires' },
        zip_code: '1042'
      },
      items: [
        {
          title: 'Libro de Prueba 1',
          quantity: 2,
          unit_price: 1500
        },
        {
          title: 'Libro de Prueba 2',
          quantity: 1,
          unit_price: 2000
        }
      ],
      total: 5000,
      date: new Date().toLocaleString()
    };
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ownerEmail,
      subject: `[PRUEBA] Nuevo pedido #${orderData.paymentId}`,
      html: `
        <h1 style="color: #333; font-family: Arial, sans-serif;">Nuevo pedido recibido (PRUEBA)</h1>
        <p><strong>ID de pago:</strong> ${orderData.paymentId}</p>
        <p><strong>Fecha:</strong> ${orderData.date}</p>
        <h2 style="color: #333; font-family: Arial, sans-serif;">Datos del cliente</h2>
        <p><strong>Nombre:</strong> ${orderData.customerName}</p>
        <p><strong>Email:</strong> ${orderData.customerEmail}</p>
        <p><strong>Teléfono:</strong> ${orderData.customerPhone}</p>
        
        <h2 style="color: #333; font-family: Arial, sans-serif;">Dirección de envío</h2>
        <p>${orderData.shippingAddress.street_name} ${orderData.shippingAddress.street_number}</p>
        <p>${orderData.shippingAddress.city.name}, ${orderData.shippingAddress.state.name}</p>
        <p>${orderData.shippingAddress.zip_code}</p>
        
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
            ${orderData.items.map(item => `
              <tr>
                <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${item.title}</td>
                <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">$${item.unit_price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <h2 style="color: #333; font-family: Arial, sans-serif;">Total</h2>
        <p style="font-size: 18px; font-weight: bold;">$${orderData.total}</p>
        
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Este es un email de prueba enviado desde la ruta /api/test-email
        </p>
      `
    };
    
    console.log('Enviando email de prueba...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado correctamente:', info.messageId);
    console.log('Respuesta del servidor SMTP:', info.response);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email de prueba enviado correctamente',
      messageId: info.messageId
    });
    
  } catch (error: any) {
    console.error('Error al enviar email de prueba:', error);
    console.error('Stack trace:', error.stack);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
    }
    
    return NextResponse.json({
      success: false,
      error: 'Error al enviar el email de prueba',
      details: error.message
    }, { status: 500 });
  }
} 