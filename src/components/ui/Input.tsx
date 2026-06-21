import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, type = 'text', id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-sm font-semibold text-foreground/80 select-none">
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          ref={ref}
          className={`w-full px-3.5 py-2.5 bg-card text-foreground border rounded-md shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:pointer-events-none text-sm ${
            error ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border'
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs text-destructive font-medium mt-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
