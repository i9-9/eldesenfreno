// "use client"

// import { useState } from 'react';
// import { useCarrito } from '../context/CarritoContext'
// export default function Checkout() {
//   const { productos } = useCarrito();
//   const [loading, setLoading] = useState(false);

//   const handleCheckout = async () => {
//     setLoading(true);

//     try {
//       const response = await fetch('/api/mercadoPago', {
//         method: 'POST',
//         body: JSON.stringify({ productos }),
//       });
//       const data = await response.json();

//       // Redirigir a Mercado Pago
//       if (data.id) {
//         window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${data.id}`;
//       } else {
//         alert('Error al procesar el pago');
//       }
//     } catch (error) {
//       console.error(error);
//       alert('Hubo un error al iniciar el pago');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1>Checkout</h1>
//       <button onClick={handleCheckout} disabled={loading}>
//         {loading ? 'Procesando...' : 'Pagar con Mercado Pago'}
//       </button>
//     </div>
//   );
// }

// Make sure you have a default export
export default function CheckoutPage() {
  return (
    <div>
      {/* Your checkout page content */}
    </div>
  )
}