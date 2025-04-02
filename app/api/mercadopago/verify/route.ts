import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const token = process.env.MP_ACCESS_TOKEN;
    
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Token no configurado'
      }, { status: 500 });
    }

    console.log('Iniciando verificación con token que comienza con:', token.substring(0, 5));

    const client = new MercadoPagoConfig({
      accessToken: token,
    });

    const preference = new Preference(client);
    
    // Intentar crear una preferencia de prueba
    const testPreference = {
      items: [
        {
          id: 'test',
          title: 'Test Item',
          quantity: 1,
          unit_price: 1,
          currency_id: 'ARS'
        }
      ]
    };

    const result = await preference.create({
      body: testPreference
    });

    return NextResponse.json({
      success: true,
      message: 'Token válido',
      tokenPrefix: token.substring(0, 5),
      testPreferenceId: result.id
    });

  } catch (error: any) {
    console.error('Error de verificación:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Token inválido',
      message: error.message,
      details: error.cause || error.stack
    }, { status: 500 });
  }
} 