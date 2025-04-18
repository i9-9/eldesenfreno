'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Address {
  street_name?: string;
  street_number?: string;
  city?: {
    name?: string;
  };
  state?: {
    name?: string;
  };
  zip_code?: string;
}

interface Item {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
  description?: string;
}

interface Purchase {
  id: string;
  paymentId: string;
  preferenceId: string;
  total: number;
  items: Item[];
  date: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  createdAt: string;
  updatedAt: string;
  purchases: Purchase[];
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers');
        
        if (!response.ok) {
          throw new Error('Error al obtener los clientes');
        }
        
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        setError('Error al cargar los clientes. Por favor, intenta de nuevo más tarde.');
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires'
    });
  };

  if (loading) {
    return <div className="p-4">Cargando clientes...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>
      <Link href="/admin" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Volver al panel de administración
      </Link>
      
      <div className="mt-4 flex flex-col md:flex-row gap-4">
        <div className="md:w-1/3">
          <h2 className="text-xl font-semibold mb-2">Lista de clientes ({customers.length})</h2>
          {customers.length === 0 ? (
            <p>No hay clientes registrados.</p>
          ) : (
            <div className="border rounded overflow-hidden">
              {customers.map((customer) => (
                <div 
                  key={customer.id}
                  onClick={() => handleCustomerClick(customer)}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedCustomer?.id === customer.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm text-gray-600">{customer.email}</div>
                  <div className="text-xs text-gray-500">
                    {customer.purchases.length} compra(s)
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="md:w-2/3">
          {selectedCustomer ? (
            <div>
              <h2 className="text-xl font-semibold mb-2">Detalles del cliente</h2>
              <div className="border rounded p-4 mb-4">
                <h3 className="text-lg font-medium">{selectedCustomer.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p><strong>Email:</strong> {selectedCustomer.email}</p>
                    <p><strong>Teléfono:</strong> {selectedCustomer.phone || 'No especificado'}</p>
                    <p><strong>Cliente desde:</strong> {formatDate(selectedCustomer.createdAt)}</p>
                  </div>
                  <div>
                    <p><strong>Dirección:</strong> {
                      selectedCustomer.address ? (
                        <>
                          {selectedCustomer.address.street_name} {selectedCustomer.address.street_number}, {selectedCustomer.address.city?.name}, {selectedCustomer.address.state?.name}, {selectedCustomer.address.zip_code}
                        </>
                      ) : 'No especificada'
                    }</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">Historial de compras ({selectedCustomer.purchases.length})</h3>
              {selectedCustomer.purchases.map((purchase) => (
                <div key={purchase.id} className="border rounded mb-2 overflow-hidden">
                  <div className="bg-gray-100 p-3 border-b">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Pedido #{purchase.paymentId}</span>
                      <span className="text-sm">{formatDate(purchase.date)}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium mb-2">Productos</h4>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-2 text-left">Producto</th>
                          <th className="p-2 text-right">Cantidad</th>
                          <th className="p-2 text-right">Precio</th>
                          <th className="p-2 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchase.items.map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-2">
                              {item.title}
                              {item.description && <div className="text-xs text-gray-500">{item.description}</div>}
                            </td>
                            <td className="p-2 text-right">{item.quantity}</td>
                            <td className="p-2 text-right">${item.unit_price.toLocaleString('es-AR')}</td>
                            <td className="p-2 text-right">${(item.quantity * item.unit_price).toLocaleString('es-AR')}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t font-medium">
                          <td colSpan={3} className="p-2 text-right">Total</td>
                          <td className="p-2 text-right">${purchase.total.toLocaleString('es-AR')}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border rounded p-4 text-center text-gray-500">
              Selecciona un cliente para ver sus detalles
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 