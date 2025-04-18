import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true,
});

async function sendCustomerConfirmation(orderData: {
  paymentId: string;
  customerName: string;
  customerEmail: string;
  items: any[];
  total: number;
  date: string;
  shippingAddress: any;
  preferenceDetails?: any;
}) {
  console.log('Preparando email de confirmación para el cliente:', orderData.customerEmail);
  
  if (!orderData.customerEmail) {
    console.error('No se encontró email del cliente');
    return;
  }
  
  const mailOptions = {
    from: `"El Desenfreno Ediciones" <${process.env.EMAIL_USER}>`,
    to: orderData.customerEmail,
    subject: `¡Gracias por tu compra en El Desenfreno Ediciones! #${orderData.paymentId}`,
    html: `
      <h1 style="color: #333; font-family: Arial, sans-serif;">¡Gracias por tu compra!</h1>
      <p>Hola ${orderData.customerName},</p>
      <p>Tu pedido ha sido confirmado. Acá te dejamos los detalles:</p>
      
      <p><strong>Número de pedido:</strong> ${orderData.paymentId}</p>
      <p><strong>Fecha:</strong> ${orderData.date}</p>
      
      <h2 style="color: #333; font-family: Arial, sans-serif;">Datos de envío</h2>
      <p><strong>Dirección:</strong> ${orderData.shippingAddress?.street_name || ''} ${orderData.shippingAddress?.street_number || ''}</p>
      <p><strong>Ciudad:</strong> ${orderData.shippingAddress?.city?.name || ''}</p>
      <p><strong>Provincia:</strong> ${orderData.shippingAddress?.state?.name || ''}</p>
      <p><strong>Código Postal:</strong> ${orderData.shippingAddress?.zip_code || ''}</p>
      
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
              <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">
                ${item.picture_url ? `<img src="${item.picture_url}" alt="${item.title}" style="max-width: 50px; margin-right: 10px;">` : ''}
                ${item.title}
              </td>
              <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${item.quantity}</td>
              <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">$${item.unit_price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <h2 style="color: #333; font-family: Arial, sans-serif;">Total</h2>
      <p style="font-size: 18px; font-weight: bold;">$${orderData.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
      
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
  
  try {
    console.log('Enviando email de confirmación al cliente...');
    console.log('Configuración del email:', {
      from: process.env.EMAIL_USER,
      to: orderData.customerEmail,
      subject: `¡Gracias por tu compra en El Desenfreno Ediciones! #${orderData.paymentId}`
    });
    const info = await transporter.sendMail(mailOptions);
    console.log('Email de confirmación enviado correctamente:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error al enviar email de confirmación al cliente:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

async function sendOrderNotification(orderData: {
  paymentId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: any;
  items: any[];
  total: number;
  date: string;
  preferenceDetails?: any;
}) {
  const ownerEmail = process.env.OWNER_EMAIL;
  
  if (!ownerEmail) {
    console.error('OWNER_EMAIL no configurado');
    return;
  }
  
  console.log('Preparando email para el propietario:', ownerEmail);
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: ownerEmail,
    subject: `Nuevo pedido #${orderData.paymentId}`,
    html: `
      <h1 style="color: #333; font-family: Arial, sans-serif;">Nuevo pedido recibido</h1>
      <p><strong>ID de pago:</strong> ${orderData.paymentId}</p>
      <p><strong>Fecha:</strong> ${orderData.date}</p>
      
      <h2 style="color: #333; font-family: Arial, sans-serif;">Datos del cliente</h2>
      <p><strong>Nombre:</strong> ${orderData.customerName}</p>
      <p><strong>Email:</strong> ${orderData.customerEmail}</p>
      <p><strong>Teléfono:</strong> ${orderData.customerPhone}</p>
      
      <h2 style="color: #333; font-family: Arial, sans-serif;">Dirección de envío</h2>
      <p><strong>Dirección:</strong> ${orderData.shippingAddress?.street_name || ''} ${orderData.shippingAddress?.street_number || ''}</p>
      <p><strong>Ciudad:</strong> ${orderData.shippingAddress?.city?.name || ''}</p>
      <p><strong>Provincia:</strong> ${orderData.shippingAddress?.state?.name || ''}</p>
      <p><strong>Código Postal:</strong> ${orderData.shippingAddress?.zip_code || ''}</p>
      <p><strong>País:</strong> ${orderData.shippingAddress?.country?.name || 'Argentina'}</p>
      
      <h2 style="color: #333; font-family: Arial, sans-serif;">Productos</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Producto</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Cantidad</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Precio unitario</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${orderData.items.map(item => `
            <tr>
              <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">
                ${item.picture_url ? `<img src="${item.picture_url}" alt="${item.title}" style="max-width: 50px; margin-right: 10px;">` : ''}
                ${item.title}
                ${item.description ? `<br><small style="color: #666;">${item.description}</small>` : ''}
              </td>
              <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${item.quantity}</td>
              <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">$${item.unit_price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
              <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">$${(item.unit_price * item.quantity).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 8px; text-align: right; border: 1px solid #ddd;"><strong>Total</strong></td>
            <td style="padding: 8px; text-align: left; border: 1px solid #ddd;"><strong>$${orderData.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</strong></td>
          </tr>
        </tfoot>
      </table>
      
      ${orderData.preferenceDetails ? `
        <h2 style="color: #333; font-family: Arial, sans-serif;">Detalles adicionales</h2>
        <p><strong>ID de preferencia:</strong> ${orderData.preferenceDetails.id}</p>
        <p><strong>Fecha de creación:</strong> ${new Date(orderData.preferenceDetails.date_created).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</p>
      ` : ''}
      
      <p style="margin-top: 20px; color: #666; font-size: 14px;">
        Este es un email automático, por favor no responder.
      </p>
    `
  };
  
  try {
    console.log('Enviando email al propietario...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email al propietario enviado correctamente:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error al enviar email al propietario:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

export async function GET() {
  try {
    // Simular datos de un pago exitoso
    const paymentId = 'MP-' + Date.now();
    const preferenceId = 'TEST-PREF-' + Date.now();
    
    // Simular una preferencia de pago con el email del comprador
    const preferenceData = {
      id: preferenceId,
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
    
    // Calcular el total
    const total = preferenceData.items.reduce((sum, item) => 
      sum + (item.unit_price * item.quantity), 0
    );
    
    // Preparar los datos del pedido
    const orderData = {
      paymentId: paymentId,
      customerName: 'Ivan Nevares',
      customerEmail: preferenceData.payer.email,
      customerPhone: preferenceData.payer.phone.number,
      shippingAddress: preferenceData.shipments.receiver_address,
      items: preferenceData.items,
      total: total,
      date: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
      preferenceDetails: preferenceData
    };
    
    console.log('Enviando emails de prueba...');
    console.log('Datos del pedido:', JSON.stringify(orderData, null, 2));
    
    // Enviar los emails
    const ownerEmailInfo = await sendOrderNotification(orderData);
    const customerEmailInfo = await sendCustomerConfirmation(orderData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Emails de prueba enviados correctamente',
      paymentId,
      preferenceId,
      customerEmail: orderData.customerEmail,
      ownerEmail: process.env.OWNER_EMAIL,
      emailInfo: {
        owner: ownerEmailInfo?.messageId,
        customer: customerEmailInfo?.messageId
      }
    });
    
  } catch (error: any) {
    console.error('Error en el test:', error);
    console.error('Stack trace:', error.stack);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 