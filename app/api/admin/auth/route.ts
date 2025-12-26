import { NextRequest, NextResponse } from 'next/server';

// Contraseña del admin - En producción deberías usar una variable de entorno
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'desenfreno2024';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Contraseña requerida' },
        { status: 400 }
      );
    }

    if (password === ADMIN_PASSWORD) {
      // Crear un token simple (en producción usarías JWT)
      const token = Buffer.from(`admin:${Date.now()}`).toString('base64');
      
      const response = NextResponse.json({ 
        success: true, 
        message: 'Autenticación exitosa' 
      });
      
      // Guardar el token en una cookie
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 días
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Contraseña incorrecta' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Error en autenticación:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}

// Verificar si está autenticado
export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_token');
  
  if (token) {
    return NextResponse.json({ authenticated: true });
  }
  
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

// Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Sesión cerrada' });
  response.cookies.delete('admin_token');
  return response;
}



