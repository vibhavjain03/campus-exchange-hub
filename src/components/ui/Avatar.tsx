import React from 'react'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  name?: string
  size?: 'sm' | 'md' | 'lg'
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className = '', src, name = 'User', size = 'md', ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false)

    // Calculate initials
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()

    const sizeClasses = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-16 w-16 text-xl'
    }

    return (
      <div
        ref={ref}
        className={`relative flex shrink-0 overflow-hidden rounded-full select-none items-center justify-center font-semibold bg-primary/10 text-primary uppercase ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {src && !hasError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name}
            onError={() => setHasError(true)}
            className="aspect-square h-full w-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'
