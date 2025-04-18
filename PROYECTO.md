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
- `/api/mercadopago/webhook/test`: Simula notificaciones para pruebas

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

### Problemas Identificados
- **Emails al comprador**: Los emails de confirmación se están enviando a la dirección configurada en `.env.local` como `EMAIL_USER` (`ivannevares9@gmail.com`) en lugar de usar el email del comprador ingresado en el formulario de MercadoPago
- **Datos de productos**: Los datos de productos y precios en los emails no siempre reflejan la compra real
- **Timezone**: Se corrigió para usar América/Argentina/Buenos_Aires
- **ID de orden**: Se corrigió para mostrar el ID de pago real

## Próximos Pasos y Tareas Pendientes

### Correcciones Urgentes
- Corregir el envío de emails al comprador para que use el email correcto
- Asegurar que los datos de productos y precios se muestren correctamente en los emails

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

## Recomendaciones

1. **Cambiar configuración de emails**: Modificar la lógica para asegurar que el email se envíe al comprador correcto.
2. **Mejorar logs**: Añadir logs detallados para diagnosticar problemas en producción.
3. **Implementar sistema de pruebas**: Crear un entorno de pruebas completo para validar el flujo de compra. 