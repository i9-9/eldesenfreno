import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Creando preferencia de prueba para redirección');
    
    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'Token de acceso no configurado' }, { status: 500 });
    }

    const client = new MercadoPagoConfig({
      accessToken: token,
    });

    const preference = new Preference(client);
    
    const preferenceData = {
      items: [
        {
          id: 'test-item',
          title: 'Producto de prueba',
          quantity: 1,
          unit_price: 100,
          currency_id: 'ARS',
        }
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/failure`,
      },
    };

    const result = await preference.create({
      body: preferenceData
    });

    return NextResponse.json({
      success: true,
      message: 'Preferencia creada correctamente',
      preferenceId: result.id,
      initPoint: result.init_point,
      redirectHtml: `
        <html>
          <head>
            <title>Redireccionando a MercadoPago</title>
          </head>
          <body>
            <h1>Redireccionando a MercadoPago...</h1>
            <p>Si no eres redirigido automáticamente, haz clic en el siguiente enlace:</p>
            <a href="${result.init_point}" id="redirect-link">Ir a MercadoPago</a>
            <script>
              // Redireccionar automáticamente después de 2 segundos
              setTimeout(function() {
                window.location.href = "${result.init_point}";
              }, 2000);
            </script>
          </body>
        </html>
      `
    });

  } catch (error: any) {
    console.error('Error al crear preferencia de prueba:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error al crear la preferencia de prueba',
      details: error.message
    }, { status: 500 });
  }
} 