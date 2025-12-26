import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';
import { sendCustomerPurchaseEmail, sendSellerPurchaseEmail, PurchaseEmailData } from '@/app/lib/emailService';

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
    let customerEmail = null; // Inicializamos como null para forzar la obtención desde la preferencia
    
    if (preferenceId) {
      try {
        const preferenceClient = new Preference(client);
        const preference = await preferenceClient.get({ preferenceId });
        console.log('Detalles de la preferencia:', JSON.stringify(preference, null, 2));
        preferenceDetails = preference;
        
        // Obtener el email del comprador de la preferencia
        if (preference.payer && preference.payer.email) {
          customerEmail = preference.payer.email;
          console.log('Email del comprador encontrado en la preferencia:', customerEmail);
        } else {
          console.error('No se encontró email del comprador en la preferencia');
          return NextResponse.json({ error: 'Email del comprador no encontrado en la preferencia' }, { status: 400 });
        }
      } catch (error) {
        console.error('Error al obtener detalles de la preferencia:', error);
        return NextResponse.json({ error: 'Error al obtener detalles de la preferencia' }, { status: 500 });
      }
    } else {
      console.error('No se encontró ID de preferencia');
      return NextResponse.json({ error: 'ID de preferencia no encontrado' }, { status: 400 });
    }
    
    // Solo enviar emails si el pago está aprobado
    if (paymentInfo.status === 'approved') {
      console.log('Pago aprobado, enviando notificaciones');
      console.log('Datos completos del pago:', JSON.stringify(paymentInfo, null, 2));
      console.log('Datos del pagador:', JSON.stringify(payer, null, 2));
      console.log('Datos adicionales:', JSON.stringify(additional_info, null, 2));

      // Extraer los items de la preferencia
      const items = preferenceDetails?.items || [];
      const total = items.reduce((sum: number, item: any) =>
        sum + (item.unit_price * item.quantity), 0
      );

      // Preparar dirección de envío
      const shippingAddress = additional_info?.shipments?.receiver_address as any;
      const formattedShippingAddress = shippingAddress ? {
        street: `${shippingAddress.street_name || ''} ${shippingAddress.street_number || ''}`.trim(),
        city: shippingAddress.city?.name || '',
        state: shippingAddress.state?.name || '',
        zipCode: shippingAddress.zip_code || ''
      } : undefined;

      // Preparar datos para el servicio de emails
      const purchaseEmailData: PurchaseEmailData = {
        customerName: `${payer.first_name || ''} ${payer.last_name || ''}`.trim(),
        customerEmail: customerEmail,
        orderId: dataId,
        items: items.map((item: any) => ({
          title: item.title || item.description || 'Producto',
          author: item.description || '',
          price: String(item.unit_price || 0),
          quantity: Number(item.quantity) || 1
        })),
        total: String(total),
        shippingAddress: formattedShippingAddress,
        paymentMethod: 'MercadoPago',
        purchaseDate: new Date()
      };

      console.log('Datos del pedido a enviar:', JSON.stringify(purchaseEmailData, null, 2));
      console.log('Email del comprador:', purchaseEmailData.customerEmail);

      // Guardar los datos del cliente en la base de datos
      try {
        console.log('Guardando datos del cliente en la base de datos...');
        const customerData = {
          name: purchaseEmailData.customerName,
          email: purchaseEmailData.customerEmail,
          phone: additional_info?.payer?.phone?.number || '',
          address: shippingAddress,
          paymentId: dataId,
          preferenceId: preferenceId,
          total: total,
          items: items.map((item: any) => ({
            ...item,
            title: item.title || item.description || 'Producto',
            unit_price: Number(item.unit_price) || 0,
            quantity: Number(item.quantity) || 1,
            currency_id: item.currency_id || 'ARS',
            picture_url: item.picture_url || ''
          }))
        };

        const customerResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/customers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(customerData)
        });

        const customerResult = await customerResponse.json();
        console.log('Resultado de guardar el cliente:', customerResult);
      } catch (error) {
        console.error('Error al guardar los datos del cliente:', error);
        // No interrumpir el proceso si falla el guardado del cliente
      }

      // Enviar emails usando el servicio centralizado
      try {
        console.log('Enviando email de confirmación al cliente...');
        await sendCustomerPurchaseEmail(purchaseEmailData);
        console.log('Email de confirmación enviado al cliente');
      } catch (error) {
        console.error('Error al enviar email al cliente:', error);
      }

      try {
        console.log('Enviando email de notificación al vendedor...');
        await sendSellerPurchaseEmail(purchaseEmailData);
        console.log('Email de notificación enviado al vendedor');
      } catch (error) {
        console.error('Error al enviar email al vendedor:', error);
      }

      console.log('Proceso de emails completado');
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
export async function GET() {
  return NextResponse.json({ message: 'Webhook endpoint activo' });
} 