import { NextRequest, NextResponse } from 'next/server';
import { sendCustomerPurchaseEmail, sendSellerPurchaseEmail, PurchaseEmailData } from '@/app/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validación de campos requeridos
    const {
      customerName,
      customerEmail,
      orderId,
      items,
      total,
      paymentMethod,
      shippingAddress
    } = body;

    if (!customerName || !customerEmail || !orderId || !items || !total) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Preparar datos para emails
    const purchaseData: PurchaseEmailData = {
      customerName,
      customerEmail,
      orderId,
      items,
      total,
      shippingAddress,
      paymentMethod: paymentMethod || 'MercadoPago',
      purchaseDate: new Date(),
    };

    // Enviar emails en paralelo
    const [customerResult, sellerResult] = await Promise.allSettled([
      sendCustomerPurchaseEmail(purchaseData),
      sendSellerPurchaseEmail(purchaseData),
    ]);

    // Verificar resultados
    const customerEmailSent = customerResult.status === 'fulfilled';
    const sellerEmailSent = sellerResult.status === 'fulfilled';

    if (!customerEmailSent) {
      console.error('Error enviando email al cliente:', customerResult.reason);
    }

    if (!sellerEmailSent) {
      console.error('Error enviando email al vendedor:', sellerResult.reason);
    }

    return NextResponse.json({
      success: true,
      customerEmailSent,
      sellerEmailSent,
      message: 'Proceso de envío de emails completado',
      details: {
        customer: customerEmailSent ? 'Enviado' : 'Falló',
        seller: sellerEmailSent ? 'Enviado' : 'Falló',
      },
    });

  } catch (error) {
    console.error('Error en API de envío de emails de compra:', error);

    return NextResponse.json(
      {
        error: 'Error al enviar los emails de compra',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
