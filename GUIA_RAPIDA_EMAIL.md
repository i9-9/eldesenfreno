# 📧 Sistema de Emails - CONFIGURADO ✅

## ✅ Estado: **FUNCIONANDO**

**Cuenta para enviar:** `ivannevares9@gmail.com`
**Cuenta para recibir:** `eldesenfreno.contacto@gmail.com`

---

## 🎉 ¡Ya está todo configurado!

No necesitas hacer nada más. El sistema de emails ya funciona.

---

## Paso 1: Generar Contraseña de Aplicación (3 min)

### 1.1 Iniciar sesión en Gmail

Ir a: https://gmail.com

- **Email:** `eldesenfreno.mailing@gmail.com`
- **Contraseña:** (la contraseña normal)

### 1.2 Ir a Seguridad

Ir a: https://myaccount.google.com/security

### 1.3 Activar Verificación en 2 Pasos

1. Buscar **"Verificación en 2 pasos"**
2. Click en **"Comenzar"**
3. Ingresar tu número de teléfono
4. Ingresar el código que llegue por SMS
5. Click en **"Activar"**

### 1.4 Generar Contraseña de Aplicación

1. Volver a: https://myaccount.google.com/security
2. Buscar **"Contraseñas de aplicaciones"**
3. Click en **"Contraseñas de aplicaciones"**
4. Puede pedir la contraseña de nuevo → ingresarla
5. Seleccionar:
   - **Selecciona app:** Correo
   - **Selecciona dispositivo:** Otro (nombre personalizado)
   - **Escribir:** "El Desenfreno Web"
6. Click en **"GENERAR"**

### 1.5 Copiar la Contraseña

Aparecerá una ventana con una **contraseña de 16 caracteres**:

```
Ejemplo:
┌────────────────────────┐
│  abcd efgh ijkl mnop   │
└────────────────────────┘
```

**⚠️ IMPORTANTE:**
- Copiar TODA la contraseña
- Quitarle los ESPACIOS
- Final: `abcdefghijklmnop`

---

## Paso 2: Pegar en el Proyecto (30 seg)

### 2.1 Abrir el archivo `.env.local`

Está en la raíz del proyecto.

### 2.2 Buscar esta línea:

```env
EMAIL_PASSWORD=tu-app-password-de-16-caracteres
```

### 2.3 Reemplazar con la contraseña (SIN espacios):

```env
EMAIL_PASSWORD=abcdefghijklmnop
```

### 2.4 Guardar el archivo

Ctrl+S (Windows/Linux) o Cmd+S (Mac)

---

## Paso 3: Reiniciar el Servidor (30 seg)

### 3.1 En la terminal donde corre el proyecto:

```bash
# Presionar Ctrl+C para detener

# Iniciar de nuevo:
npm run dev
```

### 3.2 Esperar a que diga:

```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

---

## ✅ Verificar que Funciona (2 min)

### Test 1: Abrir la página de contacto

1. Ir a: http://localhost:3000/contact
2. Llenar el formulario:
   - **Nombre:** Test
   - **Email:** test@example.com
   - **Mensaje:** Probando emails
3. Click en **"Enviar"**

### Test 2: Ver el resultado

Deberías ver:
```
✅ ¡Mensaje enviado con éxito!
   Te responderemos pronto.
```

### Test 3: Revisar el email

1. Ir a: https://gmail.com
2. Iniciar sesión con: `eldesenfreno.contacto@gmail.com`
3. Buscar email de "Test"

**Si llega el email = ✅ TODO FUNCIONANDO**

---

## ❌ Si algo falla:

### Error: "Invalid login"

**Solución:**
1. Verificar que copiaste TODA la contraseña
2. Verificar que NO tiene espacios
3. Generar una nueva contraseña de aplicación

### Error: "getaddrinfo ENOTFOUND"

**Solución:**
1. Verificar conexión a internet
2. Reiniciar el servidor

### El formulario no envía nada

**Solución:**
1. Abrir consola del navegador (F12)
2. Ver si hay errores en rojo
3. Copiar el error y buscarlo

---

## 📋 Checklist Final

- [ ] Generar contraseña de aplicación en Gmail
- [ ] Copiar contraseña (16 caracteres, SIN espacios)
- [ ] Pegar en `.env.local` en la línea `EMAIL_PASSWORD=`
- [ ] Guardar archivo
- [ ] Reiniciar servidor (Ctrl+C, luego `npm run dev`)
- [ ] Probar formulario de contacto
- [ ] Verificar email en `eldesenfreno.contacto@gmail.com`

---

## 🎯 Resumen Visual

```
┌─────────────────────────────────────────────┐
│  1. Gmail → Seguridad                       │
│  2. Verificación en 2 pasos → Activar       │
│  3. Contraseñas de aplicaciones → Generar   │
│  4. Copiar contraseña (sin espacios)        │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  .env.local                                 │
│  EMAIL_PASSWORD=abcdefghijklmnop            │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Terminal                                   │
│  Ctrl+C                                     │
│  npm run dev                                │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  ✅ LISTO                                   │
│  Los emails se envían automáticamente       │
└─────────────────────────────────────────────┘
```

---

## 📞 ¿Necesitas ayuda?

Si algo no funciona:

1. Revisar la **consola del navegador** (F12)
2. Revisar los **logs del servidor** (terminal)
3. Verificar que el archivo `.env.local` esté guardado
4. Verificar que la contraseña **NO tenga espacios**

---

**¡Configuración completa en 5 minutos! 🚀**
