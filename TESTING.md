# 🧪 Guía de Pruebas de MercadoPago

Esta guía te ayudará a configurar y realizar pruebas completas del sistema de pagos de MercadoPago en desarrollo.

## 📋 Configuración Inicial

### 1. Crear Cuentas de Prueba (IMPORTANTE)

**⚠️ PASO CRÍTICO**: No solo necesitas tokens de prueba, también necesitas crear cuentas de usuario de prueba específicas.

#### 1.1 Acceder al Panel de Desarrolladores
1. Ve a [MercadoPago Developers](https://www.mercadopago.com.ar/developers/panel)
2. Inicia sesión con tu cuenta **real** de MercadoPago
3. Ve a **"Tus integraciones"** y selecciona tu aplicación
4. En el menú izquierdo, busca **"Cuentas de prueba"**

#### 1.2 Crear Cuenta de Vendedor de Prueba
1. Haz clic en **"+ Crear cuenta de prueba"**
2. **Descripción**: "Vendedor - El Desenfreno Ediciones"
3. **País**: Argentina 🇦🇷
4. **Dinero ficticio**: $10,000 ARS (para simular saldo)
5. Acepta términos y haz clic en **"Crear cuenta de prueba"**

⚠️ **IMPORTANTE**: Guarda estos datos que aparecerán:
- **Usuario**: test_user_XXXXXX
- **Contraseña**: (generada automáticamente)

#### 1.3 Crear Cuenta de Comprador de Prueba
1. Repite el proceso anterior
2. **Descripción**: "Comprador - Pruebas"
3. **País**: Argentina 🇦🇷
4. **Dinero ficticio**: $5,000 ARS

#### 1.4 Obtener Credenciales de la Cuenta Vendedor de Prueba
1. Abre una **ventana de incógnito**
2. Ve a [MercadoPago Developers](https://www.mercadopago.com.ar/developers/panel)
3. Inicia sesión con la **cuenta vendedor de prueba** (test_user_XXXXX)
4. Crea una nueva aplicación o usa una existente
5. Ve a **"Credenciales"** → **"Credenciales de producción"**
6. Copia el **Access Token** (este será diferente al que tienes ahora)

#### 1.5 Validación de Email en Cuentas de Prueba
Si te pide validación por email:
- Usa los **últimos 6 dígitos del User ID** de la cuenta de prueba
- O los **últimos 6 dígitos del Access Token**

### 2. Variables de Entorno

Actualiza tu archivo `.env.local` con el nuevo token:

```bash
# Token de la CUENTA DE PRUEBA del vendedor (no tu token personal)
MP_ACCESS_TOKEN=TEST-XXXXXXX-desde-cuenta-vendedor-prueba

# URL del sitio
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Configuración de email
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-app-password-de-gmail
OWNER_EMAIL=propietario@gmail.com
```

**🔑 Diferencia clave**: 
- ❌ Antes: Token de tu cuenta personal en modo prueba
- ✅ Ahora: Token de una cuenta vendedor de prueba específica

### 3. Configurar Email

Para que funcionen las notificaciones por email:

1. Usa una cuenta de Gmail
2. Activa la verificación en 2 pasos
3. Genera una [contraseña de aplicación](https://support.google.com/accounts/answer/185833)
4. Usa esa contraseña en `EMAIL_PASSWORD`

## 🚀 Métodos de Prueba

### Método 1: Interfaz Web (Recomendado)

La forma más fácil es usar la interfaz web:

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Ve a: http://localhost:3000/test-payments

3. Selecciona el escenario y tipo de prueba

4. Haz clic en "Ejecutar Prueba"

### Método 2: Línea de Comandos

Para pruebas más rápidas desde la terminal:

```bash
# Prueba básica (pago aprobado)
npm run test:mp

# Prueba específica de pago aprobado
npm run test:mp:approved

# Prueba de pago rechazado
npm run test:mp:rejected

# Prueba de pago pendiente
npm run test:mp:pending

# Simular webhook directamente
npm run test:mp:webhook
```

**Comandos avanzados:**
```bash
# Ayuda
node scripts/test-mp.js --help

# Ejemplos específicos
node scripts/test-mp.js approved preference
node scripts/test-mp.js rejected webhook_simulation
node scripts/test-mp.js pending preference
```

### Método 3: API Direct

También puedes usar curl o Postman:

```bash
# Crear preferencia de prueba
curl -X POST http://localhost:3000/api/mercadopago/test-payment \
  -H "Content-Type: application/json" \
  -d '{
    "scenario": "approved",
    "testType": "preference"
  }'

# Simular webhook
curl -X POST http://localhost:3000/api/mercadopago/test-payment \
  -H "Content-Type: application/json" \
  -d '{
    "scenario": "approved",
    "testType": "webhook_simulation"
  }'
```

## 💳 Tarjetas de Prueba

### Pagos Aprobados ✅
- **Visa**: 4509 9535 6623 3704
- **Mastercard**: 5031 4332 1540 6351
- **American Express**: 3711 8030 3257 522

### Pagos Rechazados ❌
- **Visa**: 4013 5406 8274 6260
- **Mastercard**: 5031 4332 1540 6334

### Pagos Pendientes ⏳
- **Visa**: 4509 9535 6623 3696

### Datos Comunes
- **Vencimiento**: 12/25 (cualquier fecha futura)
- **CVV**: 123
- **Nombre en tarjeta**:
  - **APRO**: Para pagos aprobados
  - **OTHE**: Para pagos rechazados
  - **CONT**: Para pagos pendientes

## 🔄 Tipos de Prueba

### 1. Preferencia Completa
- Crea una preferencia real en MercadoPago
- Te da un link de checkout funcional
- Prueba el flujo completo del usuario
- **Uso**: Probar la experiencia de usuario completa

### 2. Simulación de Webhook
- Simula la notificación de MercadoPago directamente
- No requiere pasar por el checkout
- Prueba solo la lógica del backend
- **Uso**: Probar emails y almacenamiento de datos

## 📊 Escenarios de Prueba

### Pago Aprobado ✅
- El pago se procesa exitosamente
- Se envían emails de confirmación
- Se guardan los datos del cliente
- Redirección a página de éxito

### Pago Rechazado ❌
- El pago es rechazado por el banco
- Se registra el intento fallido
- Redirección a página de error
- No se envían emails de confirmación

### Pago Pendiente ⏳
- El pago queda en estado pendiente
- Se envía notificación de pago pendiente
- Redirección a página de pendiente
- Se almacena con estado "pending"

## 🛠 Resolución de Problemas

### Error: "No se pudo conectar al servidor"
```bash
# Asegúrate de que el servidor esté corriendo
npm run dev
```

### Error: "MP_ACCESS_TOKEN no configurado"
- Verifica que tengas un archivo `.env.local`
- Confirma que el token sea de PRUEBA (empieza con "TEST-")
- Reinicia el servidor después de cambiar variables

### Error en emails
- Verifica `EMAIL_USER` y `EMAIL_PASSWORD`
- Asegúrate de usar una contraseña de aplicación, no tu contraseña normal
- Confirma que `OWNER_EMAIL` esté configurado

### Webhook no funciona
- Verifica que `NEXT_PUBLIC_SITE_URL` esté correcto
- En desarrollo debe ser `http://localhost:3000`
- Sin barra final (`/`)

## 📝 Logs y Depuración

### Ver logs en tiempo real
```bash
# En otra terminal, mira los logs del servidor
tail -f .next/logs/* # Si existen
# O simplemente observa la consola donde corre npm run dev
```

### Verificar configuración
Visita: http://localhost:3000/api/mercadopago/test-payment

Esto te mostrará:
- Variables configuradas
- Tarjetas de prueba disponibles
- Instrucciones de uso

## 🎯 Flujo de Prueba Recomendado

1. **Configuración inicial**:
   - Configurar variables de entorno
   - Probar endpoint de info: `GET /api/mercadopago/test-payment`

2. **Prueba de webhook**:
   ```bash
   npm run test:mp:webhook
   ```
   - Verifica que se envíen emails
   - Revisa que se guarden los datos

3. **Prueba de checkout aprobado**:
   ```bash
   npm run test:mp:approved
   ```
   - Usa la tarjeta recomendada
   - Completa el checkout
   - Verifica redirección y emails

4. **Prueba de checkout rechazado**:
   ```bash
   npm run test:mp:rejected
   ```
   - Usa tarjeta de rechazo
   - Verifica manejo de errores

5. **Prueba de checkout pendiente**:
   ```bash
   npm run test:mp:pending
   ```
   - Usa tarjeta pendiente
   - Verifica estado intermedio

## 🔒 Seguridad

- **Nunca** uses credenciales de producción en desarrollo
- Los tokens de prueba empiezan con `TEST-`
- Los tokens de producción empiezan con `APP_USR-`
- Mantén las variables de entorno en `.env.local` (no commitear)

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs de la consola
2. Verifica las variables de entorno
3. Consulta la [documentación de MercadoPago](https://www.mercadopago.com.ar/developers/es/docs)
4. Revisa el archivo `PROYECTO.md` para ver el estado actual

---

**¡Listo!** Con esta configuración deberías poder probar completamente el sistema de pagos de MercadoPago en desarrollo. 🚀 