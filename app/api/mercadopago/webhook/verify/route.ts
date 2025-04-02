import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Verificar variables de entorno
    const hasToken = !!process.env.MP_ACCESS_TOKEN;
    const hasEmailUser = !!process.env.EMAIL_USER;
    const hasEmailPass = !!process.env.EMAIL_PASSWORD;
    const hasOwnerEmail = !!process.env.OWNER_EMAIL;

    return NextResponse.json({
      status: 'active',
      environment: {
        hasToken,
        hasEmailUser,
        hasEmailPass,
        hasOwnerEmail
      },
      webhookUrl: 'https://eldesenfreno.com/api/mercadopago/webhook'
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
} 