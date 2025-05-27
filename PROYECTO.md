# El Desenfreno Ediciones - Estado del Proyecto

## Arquitectura y Stack Tecnológico

### Frontend
- **Framework**: Next.js
- **Lenguaje**: TypeScript
- **Estilos**: CSS/Tailwind
- **Hosting**: Vercel

### Backend
- **API Routes**: Next.js API Routes
- **Integración de pagos**: MercadoPago
- **Email**: Nodemailer con Gmail SMTP
- **Base de datos**: Archivo JSON (clientes y compras)

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
7. El webhook procesa la notificación, almacena los datos del cliente y envía emails al propietario y al comprador

## Componentes Implementados

### Páginas
- Home/Index
- Tienda
- Eventos
- Autorxs
- Contacto
- Carrito
- Success/Pending/Failure
- Admin (Panel de administración)
  - Clientes (Gestión de clientes)
  - Marketing (Gestión de campañas y SEO)

### API Endpoints
- `/api/mercadopago/create-preference`: Crea preferencia de pago
- `/api/mercadopago/webhook`: Recibe notificaciones de MercadoPago
- `/api/mercadopago/webhook/test`: Simula notificaciones para pruebas
- `/api/customers`: Gestiona los datos de clientes

### Funcionalidades
- Catálogo de productos
- Carrito de compras
- Integración de pagos con MercadoPago
- Notificaciones por email al propietario y comprador
- Sistema de clientes (almacenamiento y gestión)
- Marketing y SEO (gestión de metadatos)
- Panel de administración

## Estado Actual y Problemas

### Funcionando Correctamente ✅
- Navegación del sitio
- Catálogo de productos (5 libros a $15,000 cada uno)
- Proceso de compra hasta MercadoPago
- Redirección después del pago
- Notificación por webhook
- Email de notificación al propietario
- Email de confirmación al comprador
- Formato de fecha con timezone Argentina
- ID de orden real en emails
- Almacenamiento de datos de clientes
- Panel de administración básico
- **Sistema de pagos completamente probado y funcional**
- **Precios actualizados**: Libros $15,000 | Envío CABA $5,000 | Envío Interior $10,000

### Problemas Resueltos ✅
- **Emails al comprador**: Se corrigió el envío de emails para usar el email ingresado en el formulario de MercadoPago.
- **Datos de productos**: Se corrigió para mostrar los datos correctos obtenidos de la preferencia.
- **Timezone**: Se configuró para usar América/Argentina/Buenos_Aires.
- **ID de orden**: Se muestra el ID de pago real en lugar de un prefijo "TEST-".
- **Pruebas**: Se implementó un sistema completo de pruebas que fue exitosamente validado.
- **Almacenamiento de compradores**: Se implementó un sistema para guardar los datos de los compradores.
- **Producto de prueba**: Eliminado después de completar las validaciones.

### Sistema Listo para Producción 🚀
- **Pagos**: Integración completa con MercadoPago funcionando correctamente
- **Emails**: Sistema de notificaciones automáticas operativo
- **Precios**: Actualizados según especificaciones finales
- **Catálogo**: 5 libros de poesía disponibles
- **Envíos**: Configurados para CABA e Interior del país

### Funcionalidades Implementadas para SEO y Marketing
- **Panel de administración**: Se creó un panel completo para administrar la tienda.
- **Gestión de clientes**: Sistema para ver y gestionar los clientes y sus compras.
- **Marketing por email**: Interfaz para crear y enviar campañas de email.
- **Integración con redes sociales**: Interfaz para gestionar publicaciones en Instagram, Facebook y Twitter.
- **Gestión de SEO**: Herramientas para optimizar el contenido para buscadores (metadatos, palabras clave).

## Próximos Pasos y Tareas Pendientes

### Desarrollo Futuro
- Implementar base de datos para:
  - Gestionar inventario
  - Sistema de autenticación para el panel admin
- Mejorar el diseño responsive
- Implementar sistema de seguimiento de pedidos
- Integración con plataformas adicionales (Google Analytics, Facebook Pixel)
- Sistema de cupones y descuentos
- Implementar análisis y métricas avanzadas

## Variables de Entorno Requeridas
- MP_ACCESS_TOKEN: Token de acceso de MercadoPago
- NEXT_PUBLIC_SITE_URL: URL del sitio desplegado
- EMAIL_USER: Email para envío de notificaciones
- EMAIL_PASSWORD: Contraseña de la cuenta de email
- OWNER_EMAIL: Email del propietario para recibir notificaciones

## Cambios Recientes

### 2023-04-18
1. **Sistema de clientes**:
   - Implementación de almacenamiento de datos de clientes en archivo JSON.
   - Creación de panel de administración para visualizar y gestionar clientes.
   - Historial de compras por cliente.

2. **Marketing y SEO**:
   - Implementación de herramientas para gestión de campañas de email.
   - Integración con redes sociales (interfaz para programar publicaciones).
   - Gestión de metadatos SEO para optimización en buscadores.
   - Interfaz para configurar títulos, descripciones y palabras clave.

3. **Panel de administración**:
   - Creación de un panel completo con diferentes secciones.
   - Navegación intuitiva y responsive.
   - Herramientas de gestión para diversas áreas del negocio.

## Recomendaciones

1. **Sistema listo para producción**: El sistema de pagos ha sido completamente probado y está funcionando correctamente.
2. **Monitoreo de logs**: Revisar regularmente los logs de Vercel para detectar posibles errores.
3. **Backups de datos**: Considerar una solución de backup para los datos de clientes almacenados en JSON.
4. **Migración a base de datos**: En el futuro, migrar el almacenamiento de JSON a una base de datos más robusta (MongoDB, PostgreSQL).
5. **Análisis de ventas**: Implementar herramientas de análisis para monitorear el rendimiento de las ventas. 
