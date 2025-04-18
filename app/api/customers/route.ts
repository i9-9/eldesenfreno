import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Definir la ruta del archivo JSON
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'customers.json');

// Asegurar que el directorio existe
const ensureDirectoryExists = () => {
  const dir = path.dirname(DATA_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE_PATH)) {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify({ customers: [] }));
  }
};

// Leer los datos actuales
const readData = () => {
  ensureDirectoryExists();
  try {
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo de datos:', error);
    return { customers: [] };
  }
};

// Escribir datos al archivo
const writeData = (data) => {
  ensureDirectoryExists();
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error al escribir en el archivo de datos:', error);
    return false;
  }
};

// Endpoint para guardar un nuevo cliente
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, address, paymentId, preferenceId, total, items } = body;

    if (!email) {
      return NextResponse.json({ error: 'El email es obligatorio' }, { status: 400 });
    }

    const data = readData();
    
    // Verificar si el cliente ya existe
    const existingCustomerIndex = data.customers.findIndex(
      customer => customer.email === email
    );

    const customer = {
      id: uuidv4(),
      name,
      email,
      phone,
      address,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      purchases: [
        {
          id: uuidv4(),
          paymentId,
          preferenceId,
          total,
          items,
          date: new Date().toISOString()
        }
      ]
    };

    // Actualizar cliente existente o agregar uno nuevo
    if (existingCustomerIndex !== -1) {
      // Añadir nueva compra al cliente existente
      data.customers[existingCustomerIndex].purchases.push(customer.purchases[0]);
      data.customers[existingCustomerIndex].updatedAt = new Date().toISOString();
    } else {
      // Agregar nuevo cliente
      data.customers.push(customer);
    }

    const success = writeData(data);

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Cliente guardado correctamente' 
      });
    } else {
      return NextResponse.json({ 
        error: 'Error al guardar el cliente' 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error al guardar el cliente:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}

// Endpoint para obtener todos los clientes
export async function GET(req: Request) {
  try {
    const data = readData();
    return NextResponse.json(data.customers);
  } catch (error: any) {
    console.error('Error al obtener los clientes:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
} 