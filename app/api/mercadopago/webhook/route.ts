import { MercadoPagoConfig, Payment } from 'mercadopago';
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

export async function POST(req: Request) {
  try {
    console.log('Webhook recibido');
    
    // Obtener los datos de la notificación
    const data = await req.text();
    console.log('Datos del webhook:', data);
    
    const params = new URLSearchParams(data);
    const type = params.get('type');
    const dataId = params.get('data.id');
    
    console.log('Tipo de notificación:', type);
    console.log('ID de datos:', dataId);
    
    // Solo procesar notificaciones de pago
    if (type !== 'payment') {
      console.log('Ignorando notificación de tipo:', type);
      return NextResponse.json({ message: 'Notificación recibida pero no es de pago' });
    }
    
    if (!dataId) {
      console.error('ID de pago no proporcionado');
      return NextResponse.json({ error: 'ID de pago no proporcionado' }, { status: 400 });
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
    
    // Enviar correo electrónico al dueño
    if (paymentInfo.status === 'approved') {
      console.log('Pago aprobado, enviando notificación');
      
      // Extraer los items de la preferencia
      const items = additional_info?.items || [];
      const total = items.reduce((sum: number, item: any) => 
        sum + (item.unit_price * item.quantity), 0
      );
      
      const orderData = {
        paymentId: dataId,
        customerName: additional_info?.payer?.first_name + ' ' + additional_info?.payer?.last_name,
        customerEmail: payer?.email || '',
        customerPhone: additional_info?.payer?.phone?.number,
        shippingAddress: additional_info?.shipments?.receiver_address,
        items: items,
        total: total,
        date: new Date().toLocaleString()
      };
      
      console.log('Datos de la orden:', JSON.stringify(orderData, null, 2));
      await sendOrderNotification(orderData);
    } else {
      console.log('Pago no aprobado, estado:', paymentInfo.status);
    }
    
    return NextResponse.json({ success: true, message: 'Webhook procesado correctamente' });
    
  } catch (error: any) {
    console.error('Error al procesar webhook:', error);
    console.error('Stack trace:', error.stack);
    
    return NextResponse.json({
      success: false,
      error: 'Error al procesar la notificación',
      details: error.message
    }, { status: 500 });
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
}) {
  const ownerEmail = process.env.OWNER_EMAIL;
  
  if (!ownerEmail) {
    console.error('OWNER_EMAIL no configurado');
    return;
  }
  
  console.log('Preparando email para:', ownerEmail);
  
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
      <p>${orderData.shippingAddress?.street_name || ''} ${orderData.shippingAddress?.street_number || ''}</p>
      <p>${orderData.shippingAddress?.city?.name || ''}, ${orderData.shippingAddress?.state?.name || ''}</p>
      <p>${orderData.shippingAddress?.zip_code || ''}</p>
      
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
    `
  };
  
  try {
    console.log('Enviando email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado correctamente:', info.messageId);
  } catch (error) {
    console.error('Error al enviar correo:', error);
    console.error('Stack trace:', error.stack);
    throw error; // Re-lanzar el error para que sea manejado por el llamador
  }
}

// También necesitamos manejar solicitudes GET para la verificación de MercadoPago
export async function GET(req: Request) {
  return NextResponse.json({ message: 'Webhook endpoint activo' });
} 