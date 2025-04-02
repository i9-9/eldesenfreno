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
    // Email de prueba del comprador
    const customerEmail = 'eldesenfreno.contacto@gmail.com';
    console.log('Preparando email de prueba para el comprador:', customerEmail);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: 'Test de notificación de pedido',
      html: `
        <h1 style="color: #333; font-family: Arial, sans-serif;">¡Gracias por tu compra!</h1>
        <p>Hola ${customerEmail.split('@')[0]},</p>
        <p>Tu pedido ha sido confirmado. Acá te dejamos los detalles:</p>
        
        <p><strong>Número de pedido:</strong> TEST-123456</p>
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
            <tr>
              <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">El Desenfreno</td>
              <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">1</td>
              <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">$1500</td>
            </tr>
            <tr>
              <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">Producto de Prueba 2</td>
              <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">1</td>
              <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">$500</td>
            </tr>
          </tbody>
        </table>
        
        <h2 style="color: #333; font-family: Arial, sans-serif;">Total</h2>
        <p style="font-size: 18px; font-weight: bold;">$2000</p>
        
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