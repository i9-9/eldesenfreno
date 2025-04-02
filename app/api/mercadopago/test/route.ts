import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const token = process.env.MP_ACCESS_TOKEN;
    console.log('Iniciando test con token que comienza con:', token?.substring(0, 5));

    if (!token) {
      throw new Error('MP_ACCESS_TOKEN no está configurado');
    }

    const client = new MercadoPagoConfig({
      accessToken: token,
    });

    const preference = new Preference(client);

    console.log('Creando preferencia de prueba...');

    const preferenceData = {
      items: [
        {
          id: '1234',
          title: 'Producto de prueba',
          quantity: 1,
          unit_price: 100,
          currency_id: 'ARS',
        }
      ],
      back_urls: {
        success: 'http://localhost:3000/success',
        failure: 'http://localhost:3000/failure'
      },
      auto_return: 'approved',
    };

    const result = await preference.create({
      body: preferenceData
    });

    console.log('Preferencia creada:', result);

    return NextResponse.json({
      success: true,
      message: 'Preferencia creada correctamente',
      preferenceId: result.id,
      initPoint: result.init_point
    });

  } catch (error: any) {
    console.error('Error completo:', {
      message: error.message,
      name: error.name,
      cause: error.cause,
      stack: error.stack
    });
    
    return NextResponse.json({
      success: false,
      error: 'Error al crear preferencia',
      details: {
        message: error.message,
        name: error.name,
        cause: error.cause
      }
    }, { status: 500 });
  }
} 