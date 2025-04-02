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
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ownerEmail,
      subject: 'Test de notificación de pedido',
      html: `
        <h1 style="color: #333; font-family: Arial, sans-serif;">Test de notificación de pedido</h1>
        <p><strong>ID de pago:</strong> TEST-123456</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
        <h2 style="color: #333; font-family: Arial, sans-serif;">Datos del cliente</h2>
        <p><strong>Nombre:</strong> Cliente de Prueba</p>
        <p><strong>Email:</strong> cliente@prueba.com</p>
        <p><strong>Teléfono:</strong> +1234567890</p>
        
        <h2 style="color: #333; font-family: Arial, sans-serif;">Dirección de envío</h2>
        <p>Calle de Prueba 123</p>
        <p>Ciudad de Prueba, Estado de Prueba</p>
        <p>12345</p>
        
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
            <tr>
              <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">Producto de Prueba 1</td>
              <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">2</td>
              <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">$100</td>
            </tr>
            <tr>
              <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">Producto de Prueba 2</td>
              <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">1</td>
              <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">$50</td>
            </tr>
          </tbody>
        </table>
        
        <h2 style="color: #333; font-family: Arial, sans-serif;">Total</h2>
        <p style="font-size: 18px; font-weight: bold;">$250</p>
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
    
    return NextResponse.json({
      success: false,
      error: 'Error al enviar el email de prueba',
      details: error.message
    }, { status: 500 });
  }
} 