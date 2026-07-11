export const ARGENTINE_PROVINCES = [
  'Ciudad Autónoma de Buenos Aires',
  'Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
] as const;

export type CheckoutFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  street_number: string;
  city: string;
  state: string;
  postalCode: string;
  zone: string;
  apartment: string;
};

export type CheckoutFieldErrors = Partial<Record<keyof CheckoutFormData, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]{2,80}$/;
const STREET_NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.'°/-]{2,100}$/;
const STREET_NUMBER_REGEX = /^\d{1,6}[a-zA-Z]?$/;
const CITY_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'.-]{2,60}$/;
const POSTAL_CODE_REGEX = /^(\d{4}|[A-Za-z]\d{4}[A-Za-z]{3})$/;
const APARTMENT_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s./-]{0,30}$/;

/** Solo dígitos del teléfono (ignora espacios, guiones, paréntesis y +54). */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('54') && digits.length >= 10) {
    return digits.slice(2);
  }
  return digits;
}

export function isValidArgentinePhone(phone: string): boolean {
  const digits = normalizePhone(phone);
  // Celular: 10 dígitos (ej. 11xxxxxxxx). Fijo: 10 dígitos con código de área.
  return /^\d{10}$/.test(digits);
}

export function sanitizePhoneInput(value: string): string {
  return value.replace(/[^\d+\s()-]/g, '').slice(0, 20);
}

export function sanitizeStreetNumberInput(value: string): string {
  return value.replace(/[^\da-zA-Z]/g, '').slice(0, 7);
}

export function sanitizePostalCodeInput(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8);
}

export function validateCheckoutForm(formData: CheckoutFormData): CheckoutFieldErrors {
  const errors: CheckoutFieldErrors = {};

  const name = formData.name.trim();
  if (!name) {
    errors.name = 'Ingresá tu nombre completo';
  } else if (!NAME_REGEX.test(name)) {
    errors.name = 'Usá solo letras (sin números ni símbolos)';
  }

  const email = formData.email.trim();
  if (!email) {
    errors.email = 'Ingresá tu email';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Ingresá un email válido (ej. nombre@email.com)';
  }

  const phone = formData.phone.trim();
  if (!phone) {
    errors.phone = 'Ingresá tu teléfono';
  } else if (!isValidArgentinePhone(phone)) {
    errors.phone = 'Usá 10 dígitos (ej. 11 1234-5678)';
  }

  const address = formData.address.trim();
  if (!address) {
    errors.address = 'Ingresá la calle';
  } else if (!STREET_NAME_REGEX.test(address)) {
    errors.address = 'La dirección no tiene un formato válido';
  }

  const streetNumber = formData.street_number.trim();
  if (!streetNumber) {
    errors.street_number = 'Ingresá el número de calle';
  } else if (!STREET_NUMBER_REGEX.test(streetNumber)) {
    errors.street_number = 'Usá un número válido (ej. 1234 o 1234B)';
  }

  const apartment = formData.apartment.trim();
  if (apartment && !APARTMENT_REGEX.test(apartment)) {
    errors.apartment = 'El departamento no tiene un formato válido';
  }

  const city = formData.city.trim();
  if (!city) {
    errors.city = 'Ingresá la ciudad';
  } else if (!CITY_REGEX.test(city)) {
    errors.city = 'Usá solo letras (sin números)';
  }

  if (!formData.state) {
    errors.state = 'Seleccioná una provincia';
  } else if (!(ARGENTINE_PROVINCES as readonly string[]).includes(formData.state)) {
    errors.state = 'Seleccioná una provincia válida';
  }

  const postalCode = formData.postalCode.trim().toUpperCase();
  if (!postalCode) {
    errors.postalCode = 'Ingresá el código postal';
  } else if (!POSTAL_CODE_REGEX.test(postalCode)) {
    errors.postalCode = 'Usá 4 dígitos (ej. 1425) o CPA (ej. C1425ABC)';
  }

  if (!formData.zone) {
    errors.zone = 'Seleccioná la zona de envío';
  }

  return errors;
}
