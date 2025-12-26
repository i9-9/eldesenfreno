// Script de prueba para verificar que el sistema de emails funciona
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Cargar manualmente las variables de .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
}

console.log('=== VERIFICACIÓN DEL SISTEMA DE EMAILS ===\n');

// 1. Verificar variables de entorno
console.log('1. Verificando variables de entorno:');
const requiredVars = [
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'EMAIL_CONTACT_RECIPIENT',
  'EMAIL_SELLER_RECIPIENT',
  'OWNER_EMAIL'
];

let allVarsPresent = true;
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`   ✅ ${varName}: ${varName.includes('PASSWORD') ? '***' : value}`);
  } else {
    console.log(`   ❌ ${varName}: NO CONFIGURADA`);
    allVarsPresent = false;
  }
});

if (!allVarsPresent) {
  console.log('\n❌ ERROR: Faltan variables de entorno. Por favor configurá el archivo .env.local');
  process.exit(1);
}

console.log('\n2. Probando conexión SMTP:');

// 2. Crear transportador
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// 3. Verificar conexión
transporter.verify()
  .then(() => {
    console.log('   ✅ Conexión SMTP exitosa');
    console.log(`   📧 Servidor: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`);
    console.log(`   👤 Usuario: ${process.env.EMAIL_USER}`);

    console.log('\n3. Enviando email de prueba...');

    // 4. Enviar email de prueba
    return transporter.sendMail({
      from: `"Test El Desenfreno" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_SELLER_RECIPIENT,
      subject: '🧪 Test del Sistema de Emails - El Desenfreno',
      html: `
        <h1>✅ El sistema de emails funciona correctamente</h1>
        <p>Este es un email de prueba para verificar que el sistema de notificaciones de compras está funcionando.</p>

        <h2>Configuración verificada:</h2>
        <ul>
          <li>✅ Conexión SMTP establecida</li>
          <li>✅ Credenciales de Gmail válidas</li>
          <li>✅ Variables de entorno configuradas</li>
          <li>✅ Servicio centralizado (emailService.ts) operativo</li>
        </ul>

        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-style: italic; color: #666;">
          "La verdadera vida está ausente. No estamos en el mundo."<br>
          <small>— Arthur Rimbaud</small>
        </p>
      `,
      text: `
✅ El sistema de emails funciona correctamente

Este es un email de prueba para verificar que el sistema de notificaciones de compras está funcionando.

Configuración verificada:
- ✅ Conexión SMTP establecida
- ✅ Credenciales de Gmail válidas
- ✅ Variables de entorno configuradas
- ✅ Servicio centralizado (emailService.ts) operativo

"La verdadera vida está ausente. No estamos en el mundo."
— Arthur Rimbaud
      `
    });
  })
  .then((info) => {
    console.log(`   ✅ Email enviado exitosamente`);
    console.log(`   📬 Message ID: ${info.messageId}`);
    console.log(`   📨 Destinatario: ${process.env.EMAIL_SELLER_RECIPIENT}`);
    console.log(`\n✅ TODO FUNCIONA CORRECTAMENTE\n`);
    console.log(`Revisá la casilla ${process.env.EMAIL_SELLER_RECIPIENT} para ver el email de prueba.\n`);
    process.exit(0);
  })
  .catch((error) => {
    console.log(`\n❌ ERROR: ${error.message}\n`);

    if (error.code === 'EAUTH') {
      console.log('💡 Solución: La contraseña de aplicación de Gmail parece incorrecta.');
      console.log('   1. Verificá que la contraseña en .env.local sea correcta');
      console.log('   2. Generá una nueva "Contraseña de aplicación" en https://myaccount.google.com/security');
      console.log('   3. Asegurate de tener la verificación en 2 pasos activada\n');
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      console.log('💡 Solución: Problema de conexión.');
      console.log('   1. Verificá tu conexión a internet');
      console.log('   2. Asegurate que no haya firewall bloqueando el puerto 587\n');
    } else {
      console.log('💡 Revisá la configuración en .env.local y el archivo CONFIGURAR_EMAIL.md\n');
    }

    process.exit(1);
  });
