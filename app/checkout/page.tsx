'use client';

import { useState, type ChangeEvent } from 'react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { formatPrice } from '../utils/formatPrice';
import {
  ARGENTINE_PROVINCES,
  type CheckoutFieldErrors,
  type CheckoutFormData,
  sanitizePhoneInput,
  sanitizePostalCodeInput,
  sanitizeStreetNumberInput,
  validateCheckoutForm,
} from '../utils/checkoutValidation';

const inputClassName =
  'w-full p-2 border border-white/20 rounded bg-[#121212] text-white placeholder:text-white/40 outline-none transition-colors focus:border-white/60 focus:ring-1 focus:ring-white/30';
const errorInputClassName =
  'border-red-500 focus:border-red-400 focus:ring-red-400/40';

export default function CheckoutPage() {
  const { cart, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<CheckoutFieldErrors>({});

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    street_number: '',
    city: '',
    state: '',
    postalCode: '',
    zone: 'CABA',
    apartment: '',
  });

  const [shippingCost, setShippingCost] = useState(5000);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let nextValue = value;

    if (name === 'phone') {
      nextValue = sanitizePhoneInput(value);
    } else if (name === 'street_number') {
      nextValue = sanitizeStreetNumberInput(value);
    } else if (name === 'postalCode') {
      nextValue = sanitizePostalCodeInput(value);
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: nextValue };

      if (name === 'zone') {
        setShippingCost(nextValue === 'CABA' ? 5000 : 10000);
        if (nextValue === 'CABA' && !prev.state) {
          updated.state = 'Ciudad Autónoma de Buenos Aires';
        }
      }

      return updated;
    });

    if (fieldErrors[name as keyof CheckoutFormData]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof CheckoutFormData];
        return next;
      });
    }

    if (error) setError('');
  };

  const createPreference = async () => {
    const errors = validateCheckoutForm(formData);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError('Revisá los campos marcados e intentá de nuevo');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            ...cart.map((item) => ({
              id: item.id,
              title: item.title,
              quantity: item.quantity,
              unit_price: parseFloat(item.price),
              currency_id: 'ARS',
            })),
            {
              id: 'shipping',
              title: `Envío - ${formData.zone}`,
              quantity: 1,
              unit_price: shippingCost,
              currency_id: 'ARS',
            },
          ],
          payer: {
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            phone: {
              number: formData.phone.trim(),
            },
            address: {
              street_name: formData.address.trim(),
              street_number: formData.street_number.trim(),
              zip_code: formData.postalCode.trim().toUpperCase(),
              city: {
                name: formData.city.trim(),
              },
              state: {
                name: formData.state,
              },
              country: {
                name: 'Argentina',
              },
              apartment: formData.apartment.trim(),
            },
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la preferencia de pago');
      }

      if (data.initPoint) {
        window.location.href = data.initPoint;
      } else {
        throw new Error('No se recibió el punto de inicio para el pago');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al procesar el pago'
      );
    } finally {
      setLoading(false);
    }
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

  const fieldClass = (field: keyof CheckoutFormData) =>
    `${inputClassName} ${fieldErrors[field] ? errorInputClassName : ''}`;

  return (
    <div className="container mx-auto p-4 font-neue-display">
      <h1 className="text-3xl font-bold mb-6">Finalizar compra</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Datos de envío</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Zona de envío
              </label>
              <select
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                className={fieldClass('zone')}
                required
              >
                <option value="CABA">CABA - {formatPrice(5000)}</option>
                <option value="Resto del País">
                  Resto del País - {formatPrice(10000)}
                </option>
              </select>
              {fieldErrors.zone && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.zone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Nombre completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={fieldClass('name')}
                placeholder="Nombre y apellido"
                autoComplete="name"
                required
              />
              {fieldErrors.name && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={fieldClass('email')}
                placeholder="ejemplo@email.com"
                autoComplete="email"
                inputMode="email"
                required
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={fieldClass('phone')}
                placeholder="11 1234-5678"
                autoComplete="tel"
                inputMode="tel"
                required
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Dirección
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={fieldClass('address')}
                placeholder="Nombre de la calle"
                autoComplete="street-address"
                required
              />
              {fieldErrors.address && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Número de calle
              </label>
              <input
                type="text"
                name="street_number"
                value={formData.street_number}
                onChange={handleChange}
                className={fieldClass('street_number')}
                placeholder="1234"
                inputMode="numeric"
                required
              />
              {fieldErrors.street_number && (
                <p className="mt-1 text-sm text-red-400">
                  {fieldErrors.street_number}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Departamento
              </label>
              <input
                type="text"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                className={fieldClass('apartment')}
                placeholder="Piso / depto (opcional)"
              />
              {fieldErrors.apartment && (
                <p className="mt-1 text-sm text-red-400">
                  {fieldErrors.apartment}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Ciudad
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={fieldClass('city')}
                placeholder="Ciudad"
                autoComplete="address-level2"
                required
              />
              {fieldErrors.city && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Provincia
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={fieldClass('state')}
                autoComplete="address-level1"
                required
              >
                <option value="">Seleccioná una provincia</option>
                {ARGENTINE_PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
              {fieldErrors.state && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.state}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Código postal
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className={fieldClass('postalCode')}
                placeholder="1425"
                autoComplete="postal-code"
                inputMode="text"
                required
              />
              {fieldErrors.postalCode && (
                <p className="mt-1 text-sm text-red-400">
                  {fieldErrors.postalCode}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>

          <div className="border rounded p-4 mb-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-600">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {formatPrice(parseFloat(item.price) * item.quantity)}
                </p>
              </div>
            ))}

            <div className="flex justify-between py-2 border-b">
              <p>Envío ({formData.zone})</p>
              <p>{formatPrice(shippingCost)}</p>
            </div>

            <div className="flex justify-between py-2 font-bold">
              <p>Total</p>
              <p>{formatPrice(totalPrice + shippingCost)}</p>
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
            className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition disabled:opacity-60"
          >
            {loading ? 'Procesando...' : 'Proceder al pago'}
          </button>
        </div>
      </div>
    </div>
  );
}
