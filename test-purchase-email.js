// Script para probar los emails de compra directamente
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

console.log('=== TEST DE EMAILS DE COMPRA ===\n');

// Hacer un fetch al endpoint de emails de compra
const testData = {
  customerName: 'Juan Pérez (TEST)',
  customerEmail: process.env.EMAIL_SELLER_RECIPIENT, // Enviar a la misma casilla para probar
  orderId: `TEST-${Date.now()}`,
  items: [
    {
      title: 'Láudano para el corazón negro',
      author: 'María Magdalena',
      price: '15000',
      quantity: 1
    },
    {
      title: 'El desenfreno de las palabras',
      author: 'Arthur Rimbaud',
      price: '15000',
      quantity: 2
    }
  ],
  total: '45000',
  shippingAddress: {
    street: 'Av. Corrientes 1234',
    city: 'Buenos Aires',
    state: 'CABA',
    zipCode: '1043'
  },
  paymentMethod: 'MercadoPago'
};

console.log('Datos de prueba:');
console.log(JSON.stringify(testData, null, 2));
console.log('\nEnviando request al endpoint de emails...\n');

fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-purchase-emails`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testData)
})
  .then(res => res.json())
  .then(result => {
    console.log('Resultado:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('\n✅ EMAILS ENVIADOS EXITOSAMENTE\n');
      console.log(`   Cliente: ${result.customerEmailSent ? '✅ Enviado' : '❌ Falló'}`);
      console.log(`   Vendedor: ${result.sellerEmailSent ? '✅ Enviado' : '❌ Falló'}`);
      console.log(`\n📬 Revisá la casilla ${process.env.EMAIL_SELLER_RECIPIENT}\n`);
      process.exit(0);
    } else {
      console.log('\n❌ ERROR al enviar emails\n');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n❌ ERROR:', error.message, '\n');
    console.log('💡 Asegurate de que el servidor esté corriendo (npm run dev)\n');
    process.exit(1);
  });
