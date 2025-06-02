/**
 * Formats a price value to Argentine peso format with proper thousands separators
 * @param price - The price as a string or number
 * @returns Formatted price string (e.g., "$15.000")
 */
export function formatPrice(price: string | number): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) {
    return '$0';
  }
  
  return `$${numericPrice.toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
}

/**
 * Formats a price value to Argentine peso format with decimals when needed
 * @param price - The price as a string or number
 * @returns Formatted price string with decimals (e.g., "$15.000,00")
 */
export function formatPriceWithDecimals(price: string | number): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) {
    return '$0,00';
  }
  
  return `$${numericPrice.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
} 