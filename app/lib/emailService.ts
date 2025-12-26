import nodemailer from 'nodemailer';

// Citas de Rimbaud para las firmas de email
const rimbaudQuotes = [
  "La verdadera vida está ausente. No estamos en el mundo.",
  "Yo es otro.",
  "He abrazado el alba de verano.",
  "Hay que ser absolutamente moderno.",
  "La poesía no marcará más ritmo a la acción; estará adelante.",
  "He creado todas las fiestas, todos los triunfos, todos los dramas.",
  "Vi el mar infinito donde fermenta una tristeza púrpura.",
  "Una tarde, senté a la Belleza en mis rodillas. Y la encontré amarga. Y la injurié.",
  "He estirado cuerdas de campanario a campanario; guirnaldas de ventana a ventana; cadenas de oro de estrella a estrella, y bailo.",
  "¡Oh estaciones, oh castillos! ¿Qué alma está sin defecto?",
  "He soñado con la noche verde de nieves deslumbradas.",
  "La poesía no ritma más la acción: va delante.",
  "Ella es hallada. ¿Qué? La eternidad. Es el mar mezclado con el sol.",
  "Hay que cambiar la vida.",
  "He visto lo que el hombre ha creído ver.",
  "Yo asistía al estallido de mi cerebro.",
  "Se trata de llegar a lo desconocido mediante el desarreglo de todos los sentidos.",
  "He llamado a los verdugos para morder sus fusiles mientras muero.",
  "A la mañana llevaba una mirada tan perdida y un semblante tan muerto.",
  "Yo bailaba, los puños en los bolsillos rotos.",
];

// Función para obtener una cita aleatoria
const getRandomRimbaudQuote = (): string => {
  return rimbaudQuotes[Math.floor(Math.random() * rimbaudQuotes.length)];
};

// Configuración del transportador de email
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para otros puertos
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // App password para Gmail
    },
  });
};

// Interface para datos de contacto
export interface ContactEmailData {
  name: string;
  email: string;
  message: string;
}

// Interface para datos de compra
export interface PurchaseEmailData {
  customerName: string;
  customerEmail: string;
  orderId: string;
  items: Array<{
    title: string;
    author: string;
    price: string;
    quantity: number;
  }>;
  total: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
  purchaseDate: Date;
}

// Enviar email de contacto
export async function sendContactEmail(data: ContactEmailData) {
  const transporter = createTransporter();
  const rimbaudQuote = getRandomRimbaudQuote();

  const mailOptions = {
    from: `"${data.name}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_CONTACT_RECIPIENT || 'eldesenfreno.contacto@gmail.com',
    replyTo: data.email,
    subject: `Nuevo mensaje de contacto - ${data.name}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2C2C2C; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .label { font-weight: bold; color: #2C2C2C; }
            .message-box { background: white; padding: 15px; border-left: 4px solid #2C2C2C; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>El Desenfreno Ediciones</h1>
              <p>Nuevo mensaje de contacto</p>
            </div>
            <div class="content">
              <p><span class="label">De:</span> ${data.name}</p>
              <p><span class="label">Email:</span> <a href="mailto:${data.email}">${data.email}</a></p>
              <p><span class="label">Fecha:</span> ${new Date().toLocaleDateString('es-AR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>

              <div class="message-box">
                <p class="label">Mensaje:</p>
                <p>${data.message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
            <div class="footer">
              <p style="margin: 20px 0 10px 0; font-style: italic; color: #666; border-top: 1px solid #ddd; padding-top: 20px;">
                "${rimbaudQuote}"
              </p>
              <p style="font-size: 11px; color: #999; margin-top: 5px;">— Arthur Rimbaud</p>
              <p style="margin-top: 15px;">Este email fue enviado desde el formulario de contacto de eldesenfreno.com</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Nuevo mensaje de contacto

      De: ${data.name}
      Email: ${data.email}
      Fecha: ${new Date().toLocaleString('es-AR')}

      Mensaje:
      ${data.message}

      ━━━━━━━━━━━━━━━━━━━━━━━
      "${rimbaudQuote}"
      — Arthur Rimbaud
      ━━━━━━━━━━━━━━━━━━━━━━━

      Este email fue enviado desde el formulario de contacto de eldesenfreno.com
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email de contacto enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error enviando email de contacto:', error);
    throw error;
  }
}

// Enviar email de confirmación al cliente
export async function sendCustomerPurchaseEmail(data: PurchaseEmailData) {
  const transporter = createTransporter();

  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">
        <strong>${item.title}</strong><br>
        <small>${item.author}</small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price}</td>
    </tr>
  `).join('');

  const shippingHtml = data.shippingAddress ? `
    <p><span class="label">Dirección de envío:</span><br>
    ${data.shippingAddress.street}<br>
    ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}</p>
  ` : '';

  const mailOptions = {
    from: `"El Desenfreno Ediciones" <${process.env.EMAIL_USER}>`,
    to: data.customerEmail,
    replyTo: process.env.EMAIL_CONTACT_RECIPIENT || 'eldesenfreno.contacto@gmail.com',
    subject: `Confirmación de compra #${data.orderId} - El Desenfreno`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2C2C2C; color: white; padding: 30px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .label { font-weight: bold; color: #2C2C2C; }
            .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
            .order-table th { background: #2C2C2C; color: white; padding: 12px; text-align: left; }
            .total { font-size: 18px; font-weight: bold; color: #2C2C2C; text-align: right; margin-top: 20px; }
            .success-box { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Gracias por tu compra!</h1>
              <p>El Desenfreno Ediciones</p>
            </div>
            <div class="content">
              <div class="success-box">
                <strong>✓ Compra confirmada</strong><br>
                Tu pedido ha sido recibido correctamente.
              </div>

              <p>Hola <strong>${data.customerName}</strong>,</p>
              <p>Hemos recibido tu pedido y lo estamos procesando. A continuación encontrarás los detalles:</p>

              <p><span class="label">Número de orden:</span> #${data.orderId}</p>
              <p><span class="label">Fecha:</span> ${data.purchaseDate.toLocaleDateString('es-AR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</p>
              <p><span class="label">Método de pago:</span> ${data.paymentMethod}</p>

              ${shippingHtml}

              <h2 style="color: #2C2C2C; margin-top: 30px;">Resumen del pedido</h2>
              <table class="order-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th style="text-align: center;">Cantidad</th>
                    <th style="text-align: right;">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div class="total">
                Total: $${data.total}
              </div>

              <p style="margin-top: 30px;">Te enviaremos un email con la información de envío cuando despachemos tu pedido.</p>
              <p>Si tenés alguna consulta, no dudes en contactarnos respondiendo a este email.</p>
            </div>
            <div class="footer">
              <p><strong>El Desenfreno Ediciones</strong></p>
              <p>eldesenfreno.contacto@gmail.com</p>
              <p><a href="https://www.instagram.com/eldesenfreno.ediciones/">Instagram: @eldesenfreno.ediciones</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      ¡Gracias por tu compra!
      El Desenfreno Ediciones

      Hola ${data.customerName},

      Número de orden: #${data.orderId}
      Fecha: ${data.purchaseDate.toLocaleDateString('es-AR')}

      Resumen del pedido:
      ${data.items.map(item => `- ${item.title} (${item.author}) x${item.quantity} - $${item.price}`).join('\n')}

      Total: $${data.total}

      Te enviaremos un email con la información de envío cuando despachemos tu pedido.

      Saludos,
      El Desenfreno Ediciones
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email de confirmación enviado al cliente:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error enviando email al cliente:', error);
    throw error;
  }
}

// Enviar email de notificación al vendedor
export async function sendSellerPurchaseEmail(data: PurchaseEmailData) {
  const transporter = createTransporter();
  const rimbaudQuote = getRandomRimbaudQuote();

  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">
        <strong>${item.title}</strong><br>
        <small>${item.author}</small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price}</td>
    </tr>
  `).join('');

  const shippingHtml = data.shippingAddress ? `
    <p><span class="label">Dirección de envío:</span><br>
    ${data.shippingAddress.street}<br>
    ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}</p>
  ` : '';

  const mailOptions = {
    from: `"Sistema El Desenfreno" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_SELLER_RECIPIENT || 'eldesenfreno.contacto@gmail.com',
    subject: `🎉 Nueva venta #${data.orderId}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2C2C2C; color: white; padding: 30px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .label { font-weight: bold; color: #2C2C2C; }
            .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
            .order-table th { background: #2C2C2C; color: white; padding: 12px; text-align: left; }
            .total { font-size: 18px; font-weight: bold; color: #2C2C2C; text-align: right; margin-top: 20px; }
            .alert-box { background: #fff3cd; border: 1px solid #ffc107; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Nueva Venta</h1>
              <p>El Desenfreno Ediciones</p>
            </div>
            <div class="content">
              <div class="alert-box">
                <strong>¡Nueva orden recibida!</strong><br>
                Revisar y procesar el pedido.
              </div>

              <h2>Información del cliente</h2>
              <p><span class="label">Nombre:</span> ${data.customerName}</p>
              <p><span class="label">Email:</span> <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></p>

              <h2 style="margin-top: 30px;">Detalles del pedido</h2>
              <p><span class="label">Número de orden:</span> #${data.orderId}</p>
              <p><span class="label">Fecha:</span> ${data.purchaseDate.toLocaleDateString('es-AR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <p><span class="label">Método de pago:</span> ${data.paymentMethod}</p>

              ${shippingHtml}

              <h2 style="color: #2C2C2C; margin-top: 30px;">Productos</h2>
              <table class="order-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th style="text-align: center;">Cantidad</th>
                    <th style="text-align: right;">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div class="total">
                Total: $${data.total}
              </div>

              <p style="margin-top: 30px; padding: 15px; background: white; border-left: 4px solid #2C2C2C;">
                <strong>Próximo paso:</strong> Preparar el pedido y coordinar el envío con el cliente.
              </p>
            </div>
            <div class="footer">
              <p style="margin: 20px 0 10px 0; font-style: italic; color: #666; border-top: 1px solid #ddd; padding-top: 20px;">
                "${rimbaudQuote}"
              </p>
              <p style="font-size: 11px; color: #999; margin-top: 5px;">— Arthur Rimbaud</p>
              <p style="margin-top: 15px;">Este email fue generado automáticamente por el sistema de ventas.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      🎉 Nueva Venta - El Desenfreno Ediciones

      INFORMACIÓN DEL CLIENTE
      Nombre: ${data.customerName}
      Email: ${data.customerEmail}

      DETALLES DEL PEDIDO
      Número de orden: #${data.orderId}
      Fecha: ${data.purchaseDate.toLocaleString('es-AR')}
      Método de pago: ${data.paymentMethod}

      PRODUCTOS
      ${data.items.map(item => `- ${item.title} (${item.author}) x${item.quantity} - $${item.price}`).join('\n')}

      Total: $${data.total}

      ${data.shippingAddress ? `
      DIRECCIÓN DE ENVÍO
      ${data.shippingAddress.street}
      ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}
      ` : ''}

      Próximo paso: Preparar el pedido y coordinar el envío con el cliente.

      ━━━━━━━━━━━━━━━━━━━━━━━
      "${rimbaudQuote}"
      — Arthur Rimbaud
      ━━━━━━━━━━━━━━━━━━━━━━━
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email de notificación enviado al vendedor:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error enviando email al vendedor:', error);
    throw error;
  }
}
