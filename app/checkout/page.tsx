'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Datos del cliente
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    street_number: '',
    city: '',
    state: '',
    postalCode: '',
    zone: 'CABA', // Valor por defecto
    apartment: '', // Nuevo campo para departamento
  });

  const [shippingCost, setShippingCost] = useState(5000); // Costo de envío por defecto

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Actualizar costo de envío cuando cambie la zona
    if (name === 'zone') {
      setShippingCost(value === 'CABA' ? 5000 : 10000);
    }
  };

  const createPreference = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      console.log('Enviando datos para crear preferencia...');
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            ...cart.map(item => ({
              id: item.id,
              title: item.title,
              quantity: item.quantity,
              unit_price: parseFloat(item.price),
              currency_id: 'ARS',
            })),
            // Agregar envío
            {
              id: 'shipping',
              title: `Envío - ${formData.zone}`,
              quantity: 1,
              unit_price: shippingCost,
              currency_id: 'ARS',
            }
          ],
          payer: {
            name: formData.name,
            email: formData.email,
            phone: {
              number: formData.phone
            },
            address: {
              street_name: formData.address,
              street_number: formData.street_number,
              zip_code: formData.postalCode,
              city: {
                name: formData.city
              },
              state: {
                name: formData.state
              },
              country: {
                name: 'Argentina'
              },
              apartment: formData.apartment // Agregamos el departamento
            }
          }
        }),
      });

      const data = await response.json();
      console.log('Respuesta recibida:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la preferencia de pago');
      }

      if (data.initPoint) {
        console.log('Redirigiendo a:', data.initPoint);
        // Usar window.location.href para una redirección completa
        window.location.href = data.initPoint;
      } else {
        throw new Error('No se recibió el punto de inicio para el pago');
      }
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Ocurrió un error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    // Validar todos los campos requeridos para envío
    if (!formData.name || !formData.email || !formData.phone || 
        !formData.address || !formData.street_number || !formData.city || 
        !formData.state || !formData.postalCode || !formData.zone) {
      setError('Por favor completa todos los campos');
      return false;
    }
    return true;
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center font-neue-display">
        <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
        <p className="mb-4">No hay productos en tu carrito de compras.</p>
        <Link href="/shop" className="bg-[#121212] text-white px-4 py-2 rounded">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 font-neue-display">
      <h1 className="text-2xl font-bold mb-6">Finalizar compra</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario de datos del cliente */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Datos de envío</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Zona de envío</label>
              <select
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-[#121212] text-white"
                required
              >
                <option value="CABA">CABA - $5,000</option>
                <option value="Resto del País">Resto del País - $10,000</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Nombre completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-[#121212] text-white"
                placeholder="Nombre y apellido"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-[#121212] text-white"
                placeholder="ejemplo@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-[#121212] text-white"
                placeholder="11 1234-5678"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Dirección</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-[#121212] text-white"
                placeholder="Nombre de la calle"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Número de calle</label>
              <input
                type="text"
                name="street_number"
                value={formData.street_number}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-[#121212] text-white"
                placeholder="1234"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Departamento</label>
              <input
                type="text"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-[#121212] text-white"
                placeholder="Número de departamento, piso, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Ciudad</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-[#121212] text-white"
                placeholder="Ciudad"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Provincia</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-[#121212] text-white"
                placeholder="Provincia"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Código postal</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-[#121212] text-white"
                placeholder="1234"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Resumen del pedido */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
          
          <div className="border rounded p-4 mb-4">
            {cart.map((item) => ( 
              <div key={item.id} className="flex justify-between py-2 border-b">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                </div>
                <p className="font-medium">${parseFloat(item.price) * item.quantity}</p>
              </div>
            ))}
            
            <div className="flex justify-between py-2 border-b">
              <p>Envío ({formData.zone})</p>
              <p>${shippingCost}</p>
            </div>
            
            <div className="flex justify-between py-2 font-bold">
              <p>Total</p>
              <p>${totalPrice + shippingCost}</p>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <button
            onClick={createPreference}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition"
          >
            {loading ? 'Procesando...' : 'Proceder al pago'}
          </button>
        </div>
      </div>
    </div>
  );
}
