import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy')
}

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(price)
}

export function encodeCursor(cursorObj: Record<string, any>): string {
  return Buffer.from(JSON.stringify(cursorObj)).toString('base64')
}

export function decodeCursor(cursorStr: string): Record<string, any> | null {
  try {
    return JSON.parse(Buffer.from(cursorStr, 'base64').toString('utf-8'))
  } catch {
    return null
  }
}
