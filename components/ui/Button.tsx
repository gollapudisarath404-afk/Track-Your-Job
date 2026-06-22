import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  loading?: boolean
  icon?: React.ReactNode
}

export default function Button({
  children,
  className,
  variant = 'primary',
  loading = false,
  icon,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md text-sm font-medium transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[#09090E]'
  
  const variants = {
    primary: 'bg-accent text-[#EEEEF5] hover:bg-[#7B73FF]',
    secondary: 'bg-bg-elevated border border-border text-text-primary hover:bg-bg-surface',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-elevated',
    danger: 'bg-status-red/10 border border-status-red/30 text-status-red hover:bg-status-red/20',
  }

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        (disabled || loading) && 'opacity-40 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}
