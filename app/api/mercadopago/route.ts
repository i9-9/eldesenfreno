// import mercadopago from 'mercadopago';

// // Configura tu token de acceso
// mercadopago.configure({
//   access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN!
// });

// export async function POST(req: Request) {
//   const { productos } = await req.json();

//   const preference = {
//     items: productos.map((producto: { nombre: string; precio: number; cantidad: number }) => ({
//       title: producto.nombre,
//       unit_price: producto.precio,
//       quantity: producto.cantidad,
//     })),
//     back_urls: {
//       success: 'http://localhost:3000/checkout/success',
//       failure: 'http://localhost:3000/checkout/failure',
//       pending: 'http://localhost:3000/checkout/pending',
//     },
//     auto_return: 'approved',
//   };

//   try {
//     // Corrected the preference call to use the new method for MercadoPago SDK v2
//     const response = await mercadopago.preference.create(preference);
//     return new Response(JSON.stringify({ id: response.body.id }), { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return new Response('Error al crear la preferencia', { status: 500 });
//   }
// }
