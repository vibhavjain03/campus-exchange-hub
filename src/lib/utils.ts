import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines and merges Tailwind CSS class names safely.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number or decimal as USD currency.
 */
export function formatPrice(price: number | string): string {
  const amount = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(amount)) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

/**
 * Generates a pre-filled WhatsApp click-to-chat URL.
 */
export function generateWhatsAppLink(phoneNumber: string, message: string): string {
  const cleanedPhone = phoneNumber.replace(/\D/g, '')
  const encodedText = encodeURIComponent(message)
  return `https://wa.me/${cleanedPhone}?text=${encodedText}`
}
