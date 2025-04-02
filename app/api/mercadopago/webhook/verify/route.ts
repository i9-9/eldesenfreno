import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Verificar variables de entorno
    const envVars = {
      MP_ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN ? 'Configurado' : 'No configurado',
      EMAIL_USER: process.env.EMAIL_USER ? 'Configurado' : 'No configurado',
      OWNER_EMAIL: process.env.OWNER_EMAIL ? 'Configurado' : 'No configurado',
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ? 'Configurado' : 'No configurado'
    };

    return NextResponse.json({
      status: 'ok',
      message: 'Webhook endpoint está activo y configurado',
      environment: envVars,
      webhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/mercadopago/webhook`
    });
  } catch (error) {
    console.error('Error al verificar webhook:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Error al verificar la configuración del webhook',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
} 