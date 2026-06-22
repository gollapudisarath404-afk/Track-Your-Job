import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold text-text-primary tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            "bg-bg-surface border border-border rounded-md h-9 px-3 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-100",
            "focus:border-accent focus:outline-none focus:ring-0",
            error && "border-status-red text-status-red focus:border-status-red",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-status-red mt-0.5">{error}</span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
