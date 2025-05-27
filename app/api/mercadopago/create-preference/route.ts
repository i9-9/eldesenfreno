import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new Preference(new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || ''
}));

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, payer } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron items para el pago' },
        { status: 400 }
      );
    }

    // Validar que todos los items tengan precio y cantidad válidos
    for (const item of items) {
      if (!item.unit_price || item.unit_price <= 0 || !item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          { error: 'Los items deben tener precio y cantidad válidos' },
          { status: 400 }
        );
      }
    }

    // Validar datos del comprador
    if (!payer || !payer.name || !payer.email || !payer.phone || !payer.address) {
      return NextResponse.json(
        { error: 'Faltan datos del comprador' },
        { status: 400 }
      );
    }

    // Agregar log para depuración
    console.log('Valor de NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);

    const preference = {
      items: items,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/failure`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL}/pending`
      },
      auto_return: "approved",
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/mercadopago/webhook`,
      payer: payer
    };

    const response = await client.create({ body: preference });

    if (!response.init_point) {
      throw new Error('No se recibió el punto de inicio para el pago');
    }

    return NextResponse.json({
      initPoint: response.init_point
    });

  } catch (error: any) {
    console.error('Error al crear preferencia:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear la preferencia de pago' },
      { status: 500 }
    );
  }
} 