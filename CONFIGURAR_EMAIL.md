# 📧 Configuración de Emails - Guía Rápida

## ✅ Estado: REFACTORIZADO Y OPTIMIZADO

**Cuenta para ENVIAR:** `ivannevares9@gmail.com` ✅
**Cuenta para RECIBIR:** `eldesenfreno.contacto@gmail.com` ✅

**Sistema:** UNIFICADO Y FUNCIONANDO ✅

### 🔄 Últimas Mejoras (Diciembre 2025)
- ✅ Sistema de emails unificado bajo un solo servicio (`emailService.ts`)
- ✅ Webhook de MercadoPago refactorizado para usar el servicio centralizado
- ✅ Agregada variable `OWNER_EMAIL` faltante en configuración
- ✅ Emails con citas de Rimbaud en todas las notificaciones
- ✅ Código duplicado eliminado (251 líneas)
- ✅ Configuración consistente de SMTP
- ✅ **Reply-To configurado**: Clientes responden a `eldesenfreno.contacto@gmail.com`

---

## ⚡ Configuración en 5 Minutos

### Paso 1: Generar Contraseña de Aplicación

1. **Iniciar sesión** en https://gmail.com con:
   - **Email:** `eldesenfreno.mailing@gmail.com`
   - **Contraseña:** (la contraseña normal de esa cuenta)

2. **Ir a:** https://myaccount.google.com/security

3. **Activar "Verificación en 2 pasos":**
   - Buscar "Verificación en 2 pasos"
   - Click en "Comenzar"
   - Seguir los pasos (va a pedir tu número de teléfono)
   - Completar la configuración

4. **Generar Contraseña de Aplicación:**
   - Volver a https://myaccount.google.com/security
   - Buscar "Contraseñas de aplicaciones"
   - Click en "Contraseñas de aplicaciones"
   - Seleccionar:
     - **App:** "Correo"
     - **Dispositivo:** "Otro (nombre personalizado)"
     - **Nombre:** "El Desenfreno Web"
   - Click en "GENERAR"
   - **Copiar la contraseña de 16 caracteres** que aparece
     - Ejemplo: `abcd efgh ijkl mnop`

### Paso 2: Configurar .env.local

1. **Abrir el archivo** `.env.local` en el proyecto

2. **Buscar estas líneas:**

```env
EMAIL_USER=ivannevares9@gmail.com
EMAIL_PASSWORD=tu-app-password-de-16-caracteres
```

3. **Reemplazar SOLO la contraseña** con la que generaste:

```env
EMAIL_USER=ivannevares9@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop    # <- Pegar aquí (sin espacios)
```

**IMPORTANTE:** La contraseña NO debe tener espacios. Si Gmail te la da con espacios:
- ❌ `abcd efgh ijkl mnop`
- ✅ `abcdefghijklmnop`

4. **Verificar que estas líneas también existan:**

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_CONTACT_RECIPIENT=eldesenfreno.contacto@gmail.com
EMAIL_SELLER_RECIPIENT=eldesenfreno.contacto@gmail.com
OWNER_EMAIL=eldesenfreno.contacto@gmail.com
```

5. **Guardar el archivo** (Ctrl+S o Cmd+S)

### Paso 3: Reiniciar el Servidor

```bash
# En la terminal donde corre el proyecto:
# Presionar Ctrl+C para detener

# Iniciar de nuevo:
npm run dev
```

---

## 📬 ¿Cómo Funciona?

### Flujo de Emails de Compra:

```
┌──────────────────────────────────────────┐
│  Cliente completa compra en MercadoPago  │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│  Webhook recibe notificación de pago     │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│  emailService.ts envía 2 emails:         │
│  1. Al cliente (confirmación)            │
│  2. Al vendedor (notificación)           │
└──────────────┬───────────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
┌─────────┐         ┌──────────┐
│ Cliente │         │ Vendedor │
└─────────┘         └──────────┘
```

### ⚙️ Configuración de Reply-To (Importante):

**Email al Cliente:**
```
De: El Desenfreno <ivannevares9@gmail.com>
Para: cliente@ejemplo.com
Responder a: eldesenfreno.contacto@gmail.com ✅
```

✅ Si el cliente hace clic en "Responder", su respuesta llega a `eldesenfreno.contacto@gmail.com`
❌ NO llega a `ivannevares9@gmail.com` (cuenta técnica)

**Email al Vendedor:**
```
De: Sistema El Desenfreno <ivannevares9@gmail.com>
Para: eldesenfreno.contacto@gmail.com
```

---

## 🧪 Probar que Funciona

### Test 1: Formulario de Contacto

1. Ir a: http://localhost:3000/contact
2. Llenar el formulario:
   - **Nombre:** Test Usuario
   - **Email:** test@example.com
   - **Mensaje:** Probando el sistema de emails
3. Click en "Enviar"
4. Deberías ver: ✅ **"¡Mensaje enviado con éxito!"**

5. **Verificar en Gmail:**
   - Ir a https://gmail.com
   - Iniciar sesión con `eldesenfreno.contacto@gmail.com`
   - Buscar email de "Test Usuario"

**Email que deberías recibir:**
```
De: Test Usuario <eldesenfreno.mailing@gmail.com>
Para: eldesenfreno.contacto@gmail.com
Responder a: test@example.com
Asunto: Nuevo mensaje de contacto - Test Usuario

Mensaje:
Probando el sistema de emails
```

### Test 2: Email de Compra (Manual)

Abrir la terminal y ejecutar:

```bash
curl -X POST http://localhost:3000/api/send-purchase-emails \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Juan Pérez",
    "customerEmail": "juan.test@example.com",
    "orderId": "TEST-001",
    "items": [{
      "title": "Láudano para el corazón negro",
      "author": "María Magdalena",
      "price": "15000",
      "quantity": 1
    }],
    "total": "15000",
    "paymentMethod": "MercadoPago"
  }'
```

**Deberías recibir 2 emails en `eldesenfreno.contacto@gmail.com`:**

1. **Email al vendedor (tú):**
   - Asunto: 🎉 Nueva venta #TEST-001
   - Con datos del cliente y productos

2. **NO** vas a recibir el email del cliente porque va a `juan.test@example.com`

---

## ⚠️ Troubleshooting

### "Error: Invalid login"

**Causa:** La contraseña de aplicación está mal

**Solución:**
1. Verificar que copiaste bien la contraseña (16 caracteres)
2. Generar una nueva contraseña de aplicación
3. Actualizar `.env.local`
4. Reiniciar el servidor

### "No encuentro 'Contraseñas de aplicaciones'"

**Causa:** Falta activar "Verificación en 2 pasos"

**Solución:**
1. Ir a https://myaccount.google.com/security
2. Buscar "Verificación en 2 pasos"
3. Activarla primero
4. Luego buscar "Contraseñas de aplicaciones"

### "Email no llega"

**Revisar:**
1. ✅ Carpeta de **SPAM** en `eldesenfreno.contacto@gmail.com`
2. ✅ **Consola del navegador** (F12) → Ver si hay errores
3. ✅ **Terminal del servidor** → Ver logs
4. ✅ Verificar que `.env.local` esté bien configurado

### "Email llega pero desde remitente raro"

**Esto es normal:** Gmail muestra:
```
De: Test Usuario <eldesenfreno.mailing@gmail.com>
```

El nombre "Test Usuario" es del formulario, pero el email es de la cuenta que envía.

---

## 🎯 Tipos de Emails que se Envían

### 1️⃣ Formulario de Contacto

**Quién lo envía:** Usuario del sitio
**Desde qué cuenta:** `ivannevares9@gmail.com`
**A quién llega:** `eldesenfreno.contacto@gmail.com`
**Responder a:** Email del usuario
**Si respondés:** La respuesta llega al usuario que escribió

### 2️⃣ Confirmación de Compra (Cliente)

**Quién lo recibe:** El cliente que compró
**Desde qué cuenta:** `ivannevares9@gmail.com`
**A quién llega:** Email del cliente
**Responder a:** `eldesenfreno.contacto@gmail.com` ✅
**Si el cliente responde:** La respuesta llega a `eldesenfreno.contacto@gmail.com`
**Contenido:** Confirmación de pedido

### 3️⃣ Notificación de Venta (Vendedor)

**Quién lo recibe:** Tú (el vendedor)
**Desde qué cuenta:** `ivannevares9@gmail.com`
**A quién llega:** `eldesenfreno.contacto@gmail.com`
**Contenido:** Datos de la venta y del cliente

---

## 📊 Límites de Gmail

**Cuenta gratuita de Gmail:**
- ✅ **500 emails por día**
- ✅ Suficiente para un e-commerce pequeño/mediano

**Si necesitas más:**
- Google Workspace: 2000/día
- SendGrid: 12,000/mes gratis
- Amazon SES: 62,000/mes gratis

---

## 🔐 Seguridad

### ✅ Buenas Prácticas

1. **NUNCA** compartir la contraseña de aplicación
2. **NUNCA** subir `.env.local` a Git
3. Usar una cuenta dedicada solo para enviar (✓ Ya lo tienes)
4. Revisar actividad de la cuenta periódicamente

### 🔑 Revocación

Si la contraseña se compromete:

1. Ir a https://myaccount.google.com/security
2. "Contraseñas de aplicaciones"
3. Eliminar la contraseña comprometida
4. Generar una nueva
5. Actualizar `.env.local`

---

## ✅ Checklist Final

Antes de marcar como "listo":

- [ ] Generar contraseña de aplicación en `eldesenfreno.mailing@gmail.com`
- [ ] Configurar `.env.local` con EMAIL_USER y EMAIL_PASSWORD
- [ ] Reiniciar el servidor (`npm run dev`)
- [ ] Probar formulario de contacto
- [ ] Verificar email en `eldesenfreno.contacto@gmail.com`
- [ ] Revisar que no llegue a SPAM
- [ ] Probar email de compra con curl
- [ ] Todo funciona ✅

---

## 📞 Soporte

Si algo no funciona:

1. Revisar logs en la terminal
2. Verificar `.env.local`
3. Comprobar carpeta SPAM
4. Revisar que la verificación en 2 pasos esté activa

---

**¡Listo para configurar! 🚀**

La configuración toma solo 5 minutos y después todo funciona automático.
