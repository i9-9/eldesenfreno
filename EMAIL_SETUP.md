# 📧 Configuración del Sistema de Emails

## ✅ Sistema Implementado

Se ha implementado un sistema completo de emails usando **Nodemailer** que incluye:

1. **📬 Formulario de Contacto** - Emails del sitio web
2. **🛒 Confirmación de Compra** - Email al cliente
3. **📦 Notificación de Venta** - Email al vendedor

---

## 🚀 Configuración Rápida (Gmail)

### Paso 1: Generar Contraseña de Aplicación en Gmail

1. Ir a [Seguridad de Google](https://myaccount.google.com/security)
2. Habilitar **"Verificación en 2 pasos"** (si no está habilitada)
3. Buscar **"Contraseñas de aplicaciones"**
4. Seleccionar **"Correo"** y **"Otro (nombre personalizado)"**
5. Escribir: "El Desenfreno Ediciones"
6. Hacer clic en **"Generar"**
7. **Copiar la contraseña de 16 caracteres** (ej: `abcd efgh ijkl mnop`)

### Paso 2: Configurar Variables de Entorno

Editar el archivo `.env.local`:

\`\`\`env
# Email configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=eldesenfreno.contacto@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop

# Destinatarios
EMAIL_CONTACT_RECIPIENT=eldesenfreno.contacto@gmail.com
EMAIL_SELLER_RECIPIENT=eldesenfreno.contacto@gmail.com
\`\`\`

### Paso 3: Reiniciar el Servidor

\`\`\`bash
# Detener el servidor (Ctrl+C)
# Iniciar nuevamente
npm run dev
\`\`\`

---

## 📋 Funcionalidades Implementadas

### 1. Formulario de Contacto

**Ubicación:** `/contact`

**Flujo:**
1. Usuario llena el formulario (nombre, email, mensaje)
2. Se valida en cliente y servidor
3. Se envía email a `EMAIL_CONTACT_RECIPIENT`
4. Usuario ve confirmación en pantalla

**API Endpoint:** `POST /api/contact`

**Ejemplo de email recibido:**
```
De: Juan Pérez (juan@example.com)
Para: eldesenfreno.contacto@gmail.com
Asunto: Nuevo mensaje de contacto - Juan Pérez

Mensaje:
Hola, me interesa saber más sobre sus publicaciones...
```

---

### 2. Emails de Compra

**Se envían automáticamente cuando:**
- Un pago es confirmado en MercadoPago
- Se procesa el webhook de pago

**Dos emails se envían:**

#### A) Email al Cliente
- Confirmación de compra
- Número de orden
- Detalle de productos
- Dirección de envío
- Total pagado

#### B) Email al Vendedor
- Notificación de nueva venta
- Datos del cliente
- Productos vendidos
- Información para preparar envío

**API Endpoint:** `POST /api/send-purchase-emails`

**Llamada desde webhook:**
\`\`\`typescript
await fetch(\`\${process.env.NEXT_PUBLIC_SITE_URL}/api/send-purchase-emails\`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerName: payer.name,
    customerEmail: payer.email,
    orderId: payment.id,
    items: items,
    total: payment.transaction_amount,
    shippingAddress: shippingAddress,
    paymentMethod: 'MercadoPago'
  })
});
\`\`\`

---

## 🧪 Probar el Sistema

### Probar Formulario de Contacto

1. Ir a `/contact`
2. Llenar el formulario
3. Enviar
4. Verificar:
   - ✅ Mensaje de éxito en pantalla
   - ✅ Email recibido en `EMAIL_CONTACT_RECIPIENT`

### Probar Emails de Compra

**Opción 1: Compra Real de Prueba**
1. Usar tarjeta de prueba de MercadoPago
2. Completar compra
3. Verificar emails recibidos

**Opción 2: Llamada Directa a la API**
\`\`\`bash
curl -X POST http://localhost:3000/api/send-purchase-emails \\
  -H "Content-Type: application/json" \\
  -d '{
    "customerName": "Juan Pérez",
    "customerEmail": "juan@example.com",
    "orderId": "TEST-123",
    "items": [
      {
        "title": "Láudano para el corazón negro",
        "author": "María Magdalena",
        "price": "15000",
        "quantity": 1
      }
    ],
    "total": "15000",
    "paymentMethod": "MercadoPago"
  }'
\`\`\`

---

## 🔧 Troubleshooting

### Error: "Invalid login"

**Causa:** Contraseña de aplicación incorrecta o verificación en 2 pasos no habilitada

**Solución:**
1. Verificar que la verificación en 2 pasos esté habilitada
2. Generar una nueva contraseña de aplicación
3. Actualizar `EMAIL_PASSWORD` en `.env.local`

### Error: "getaddrinfo ENOTFOUND"

**Causa:** No se puede conectar al servidor SMTP

**Solución:**
1. Verificar conexión a internet
2. Verificar que `EMAIL_HOST=smtp.gmail.com` esté correcto
3. Revisar firewall/antivirus

### Email no llega

**Revisar:**
1. ✅ Carpeta de SPAM/Correo no deseado
2. ✅ Console del navegador (F12) para errores
3. ✅ Logs del servidor (terminal donde corre `npm run dev`)
4. ✅ Variables de entorno configuradas correctamente

### Emails llegan pero sin formato

**Causa:** Cliente de email no soporta HTML

**Solución:** Los emails incluyen versión en texto plano automáticamente

---

## 📊 Monitoreo

### Ver logs de emails enviados

Los logs aparecen en la consola del servidor:

\`\`\`
✓ Email de contacto enviado: <message-id@gmail.com>
✓ Email de confirmación enviado al cliente: <message-id@gmail.com>
✓ Email de notificación enviado al vendedor: <message-id@gmail.com>
\`\`\`

### Errores comunes en logs

\`\`\`
✗ Error enviando email de contacto: Invalid login
✗ Error enviando email al cliente: getaddrinfo ENOTFOUND
\`\`\`

---

## 🎨 Personalizar Templates

Los templates de email están en: `app/lib/emailService.ts`

### Modificar diseño de email de compra

Buscar la función `sendCustomerPurchaseEmail` y editar el HTML.

### Modificar email de contacto

Buscar la función `sendContactEmail` y editar el HTML.

**Tip:** Los emails usan HTML inline CSS para máxima compatibilidad.

---

## 🔐 Seguridad

### ✅ Buenas Prácticas Implementadas

- ✓ Validación de inputs en cliente y servidor
- ✓ Sanitización de datos antes de enviar
- ✓ Rate limiting implícito (validaciones)
- ✓ Variables de entorno para credenciales
- ✓ No exponer credenciales en código
- ✓ Manejo de errores sin exponer detalles internos

### 🚨 IMPORTANTE

**NUNCA** subir a Git:
- `.env.local` (archivo con credenciales)
- Contraseñas de aplicación de Gmail

**SIEMPRE** usar:
- Variables de entorno
- `.env.example` como template (sin valores reales)

---

## 📈 Límites de Gmail

**Plan Gratuito:**
- **500 emails/día**
- **100 destinatarios/email**

Si necesitás más, considerar:
- Google Workspace (2000 emails/día)
- SendGrid (12,000 emails/mes gratis)
- Amazon SES (62,000 emails/mes gratis)

---

## 🆘 Soporte

Si hay problemas:

1. **Revisar logs del servidor** (consola donde corre npm run dev)
2. **Verificar variables de entorno** en `.env.local`
3. **Probar con la herramienta curl** (ver sección de pruebas)
4. **Verificar carpeta de spam**

---

## 📚 Estructura de Archivos

\`\`\`
app/
├── lib/
│   └── emailService.ts          # ⭐ Servicio centralizado de emails
├── api/
│   ├── contact/
│   │   └── route.ts            # API del formulario de contacto
│   └── send-purchase-emails/
│       └── route.ts            # API de emails de compra
└── ui/
    └── ContactForm.tsx         # Formulario de contacto actualizado

env.example                     # Template de variables de entorno
EMAIL_SETUP.md                  # Esta guía
\`\`\`

---

## ✨ Próximos Pasos Opcionales

1. **Templates más sofisticados** con herramientas como MJML
2. **Tracking de emails** (saber si fueron abiertos)
3. **Sistema de cola** para emails masivos
4. **Emails transaccionales** (recuperar contraseña, etc.)

---

**¡Sistema de emails completamente funcional! 🎉**
