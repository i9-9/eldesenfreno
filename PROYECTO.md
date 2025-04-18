# El Desenfreno Ediciones - Estado del Proyecto

## Arquitectura y Stack Tecnológico

### Frontend
- **Framework**: Next.js
- **Lenguaje**: TypeScript
- **Estilos**: CSS/Tailwind (por confirmar)
- **Hosting**: Vercel

### Backend
- **API Routes**: Next.js API Routes
- **Integración de pagos**: MercadoPago
- **Email**: Nodemailer con Gmail SMTP
- **Base de datos**: No implementada aún

## Flujo de Compra Actual

1. Usuario navega por la tienda y selecciona productos
2. El carrito guarda los productos seleccionados
3. Al finalizar la compra, se crea una preferencia de pago en MercadoPago
4. El usuario es redirigido al checkout de MercadoPago
5. Después del pago, MercadoPago redirecciona a:
   - Success: `/success` (pago aprobado)
   - Pending: `/pending` (pago pendiente)
   - Failure: `/failure` (pago rechazado)
6. MercadoPago envía una notificación webhook a `/api/mercadopago/webhook`
7. El webhook procesa la notificación y envía emails al propietario y al comprador

## Componentes Implementados

### Páginas
- Home/Index
- Tienda
- Eventos
- Autorxs
- Contacto
- Carrito
- Success/Pending/Failure

### API Endpoints
- `/api/mercadopago/create-preference`: Crea preferencia de pago
- `/api/mercadopago/webhook`: Recibe notificaciones de MercadoPago
- `/api/mercadopago/webhook/test`: Simula notificaciones para pruebas (mejorado para pruebas directas)

### Funcionalidades
- Catálogo de productos
- Carrito de compras
- Integración de pagos con MercadoPago
- Notificaciones por email al propietario y comprador

## Estado Actual y Problemas

### Funcionando Correctamente
- Navegación del sitio
- Catálogo de productos
- Proceso de compra hasta MercadoPago
- Redirección después del pago
- Notificación por webhook
- Email de notificación al propietario
- Email de confirmación al comprador (corregido)
- Formato de fecha con timezone Argentina
- ID de orden real en emails

### Problemas Resueltos
- **Emails al comprador**: Se corrigió el envío de emails para usar el email ingresado en el formulario de MercadoPago (obtenido de la preferencia de pago) en lugar del email del pagador.
- **Datos de productos**: Se corrigió para mostrar los datos correctos obtenidos de la preferencia.
- **Timezone**: Se configuró para usar América/Argentina/Buenos_Aires.
- **ID de orden**: Se muestra el ID de pago real en lugar de un prefijo "TEST-".
- **Pruebas**: Se implementó una ruta de prueba mejorada que envía emails directamente sin necesidad de simular llamadas HTTP.

### Problemas Pendientes
- **Verificación final**: Aunque las pruebas indican que el sistema funciona correctamente, se recomienda realizar una compra real para verificar definitivamente el funcionamiento.

## Próximos Pasos y Tareas Pendientes

### Desarrollo Futuro
- Implementar base de datos para:
  - Almacenar historial de pedidos
  - Gestionar inventario
  - Crear panel de administración
- Mejorar el diseño responsive
- Implementar sistema de seguimiento de pedidos
- Añadir autenticación de usuarios
- Crear sección de "Mi cuenta" para usuarios registrados
- Implementar análisis y métricas

## Variables de Entorno
```
MP_ACCESS_TOKEN=APP_USR-8788163376285178-040212-9096812aac5be17aa651c0b7b9ca8b1b-155134411
NEXT_PUBLIC_SITE_URL=https://eldesenfreno.com
EMAIL_USER=ivannevares9@gmail.com
EMAIL_PASSWORD=sjpdiexnbsjqkqhu
OWNER_EMAIL=eldesenfreno.contacto@gmail.com
```

## Cambios Recientes

### 2023-04-18
1. **Corrección del email del comprador**:
   - Ahora se obtiene el email directamente de la preferencia de pago, que contiene el email ingresado en el formulario de MercadoPago.
   - Se añadieron validaciones para asegurar que siempre se tenga un email válido.

2. **Corrección de datos de productos**:
   - Los ítems se obtienen directamente de la preferencia, no de `additional_info`.
   - Se convierten explícitamente los valores numéricos para asegurar cálculos correctos.

3. **Mejora de la ruta de prueba**:
   - Se implementó una ruta de prueba que simula un pedido con datos realistas.
   - Se envían emails directamente tanto al propietario como al comprador.
   - Se muestran IDs de mensaje para confirmar el envío exitoso.

## Recomendaciones

1. **Verificación final**: Realizar una compra real para verificar completamente el funcionamiento del sistema de emails.
2. **Monitoreo de logs**: Revisar regularmente los logs de Vercel para detectar posibles errores.
3. **Implementar sistema de pruebas**: Desarrollar pruebas automatizadas para validar el flujo completo.
4. **Backups de emails**: Considerar guardar copias de los emails enviados en una base de datos para referencia futura. 