import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Interfaces para los datos adicionales
interface AdditionalInfo {
  preference_id?: string;
  payer?: {
    phone?: {
      number?: string;
    };
  };
  shipments?: {
    receiver_address?: {
      street_name?: string;
      street_number?: string;
      city?: {
        name?: string;
      };
      state?: {
        name?: string;
      };
      zip_code?: string;
      country?: {
        name?: string;
      };
    };
  };
  items?: Array<{
    title?: string;
    description?: string;
    unit_price?: number;
    quantity?: number;
    currency_id?: string;
    picture_url?: string;
  }>;
}

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true, // Habilitar logs de nodemailer
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
    const info = await transporter.sendMail(mailOptions);
    console.log('Email de confirmación enviado correctamente:', info.messageId);
    console.log('Respuesta del servidor SMTP:', info.response);
  } catch (error) {
    console.error('Error al enviar email de confirmación al cliente:', error);
    console.error('Stack trace:', error.stack);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
    }
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
    console.log('Respuesta del servidor SMTP:', info.response);
  } catch (error) {
    console.error('Error al enviar email al propietario:', error);
    console.error('Stack trace:', error.stack);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    console.log('=== WEBHOOK RECIBIDO ===');
    console.log('Headers:', JSON.stringify(Object.fromEntries(req.headers.entries()), null, 2));
    
    // Obtener los datos de la notificación
    const data = await req.text();
    console.log('Datos raw del webhook:', data);
    
    const params = new URLSearchParams(data);
    console.log('Parámetros parseados:', JSON.stringify(Object.fromEntries(params.entries()), null, 2));
    
    const type = params.get('type');
    const dataId = params.get('data.id');
    
    console.log('Tipo de notificación:', type);
    console.log('ID de datos:', dataId);
    
    // Procesar diferentes tipos de notificaciones
    if (type === 'payment' || type === 'order' || (!type && dataId)) {
      console.log('Procesando notificación de tipo:', type || 'desconocido');
    } else {
      console.log('Ignorando notificación de tipo:', type);
      return NextResponse.json({ message: 'Notificación recibida pero no es de pago u orden' });
    }
    
    if (!dataId) {
      console.error('ID no proporcionado');
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 });
    }
    
    // Obtener detalles del pago
    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) {
      console.error('Token de acceso no configurado');
      return NextResponse.json({ error: 'Token de acceso no configurado' }, { status: 500 });
    }
    
    console.log('Configurando cliente de MercadoPago');
    const client = new MercadoPagoConfig({
      accessToken: token,
    });
    
    const payment = new Payment(client);
    console.log('Obteniendo detalles del pago:', dataId);
    const paymentInfo = await payment.get({ id: dataId });
    
    console.log('Información del pago:', JSON.stringify(paymentInfo, null, 2));
    
    // Extraer información del cliente y del pedido
    const { payer, additional_info, transaction_details } = paymentInfo;
    
    // Verificar que tenemos toda la información necesaria
    if (!payer || !additional_info) {
      console.error('Faltan datos del pago:', { payer, additional_info });
      return NextResponse.json({ error: 'Datos incompletos del pago' }, { status: 400 });
    }
    
    // Obtener la preferencia de pago para tener todos los detalles
    const additionalInfo = additional_info as AdditionalInfo;
    const preferenceId = additionalInfo?.preference_id;
    let preferenceDetails = null;
    
    if (preferenceId) {
      try {
        const preferenceClient = new Preference(client);
        const preference = await preferenceClient.get({ preferenceId });
        console.log('Detalles de la preferencia:', JSON.stringify(preference, null, 2));
        preferenceDetails = preference;
      } catch (error) {
        console.error('Error al obtener detalles de la preferencia:', error);
      }
    }
    
    // Solo enviar emails si el pago está aprobado
    if (paymentInfo.status === 'approved') {
      console.log('Pago aprobado, enviando notificaciones');
      console.log('Datos completos del pago:', JSON.stringify(paymentInfo, null, 2));
      console.log('Datos del pagador:', JSON.stringify(payer, null, 2));
      console.log('Datos adicionales:', JSON.stringify(additional_info, null, 2));
      
      // Extraer los items de la preferencia
      const items = additional_info?.items || [];
      const total = items.reduce((sum: number, item: any) => 
        sum + (item.unit_price * item.quantity), 0
      );
      
      const orderData = {
        paymentId: dataId,
        customerName: `${payer.first_name || ''} ${payer.last_name || ''}`.trim(),
        customerEmail: payer.email || '',
        customerPhone: additional_info?.payer?.phone?.number || '',
        shippingAddress: additional_info?.shipments?.receiver_address || {},
        items: items.map(item => ({
          ...item,
          title: item.title || item.description || 'Producto',
          unit_price: item.unit_price || 0,
          quantity: item.quantity || 1,
          currency_id: item.currency_id || 'ARS',
          picture_url: item.picture_url || ''
        })),
        total: total,
        date: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
        preferenceDetails: preferenceDetails
      };
      
      console.log('Datos del pedido a enviar:', JSON.stringify(orderData, null, 2));
      
      // Enviar notificación al propietario
      console.log('Enviando notificación al propietario:', process.env.OWNER_EMAIL);
      await sendOrderNotification(orderData);
      console.log('Notificación al propietario enviada');

      // Enviar confirmación al comprador
      console.log('Enviando confirmación al comprador:', orderData.customerEmail);
      await sendCustomerConfirmation(orderData);
      console.log('Confirmación al comprador enviada');
      
      console.log('Notificaciones enviadas correctamente');
    } else {
      console.log('Pago no aprobado, estado:', paymentInfo.status);
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error en el webhook:', error);
    console.error('Stack trace:', error.stack);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// También necesitamos manejar solicitudes GET para la verificación de MercadoPago
export async function GET(req: Request) {
  return NextResponse.json({ message: 'Webhook endpoint activo' });
} 