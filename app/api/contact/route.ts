import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail, ContactEmailData } from '@/app/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validación de campos
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Validación de longitud
    if (name.length > 100 || message.length > 5000) {
      return NextResponse.json(
        { error: 'Los campos exceden la longitud máxima permitida' },
        { status: 400 }
      );
    }

    // Sanitizar datos
    const emailData: ContactEmailData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    };

    // Enviar email
    const result = await sendContactEmail(emailData);

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado correctamente',
      messageId: result.messageId,
    });

  } catch (error) {
    console.error('Error en API de contacto:', error);

    // Manejo de errores específicos de Nodemailer
    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        return NextResponse.json(
          { error: 'Error de configuración del servidor de email' },
          { status: 500 }
        );
      }

      if (error.message.includes('getaddrinfo ENOTFOUND')) {
        return NextResponse.json(
          { error: 'No se pudo conectar al servidor de email' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Error al enviar el mensaje. Por favor intente nuevamente.' },
      { status: 500 }
    );
  }
}

// Método OPTIONS para CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
