import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      to="/"
      className={cn(
        'group inline-flex items-center transition-opacity hover:opacity-90',
        className
      )}
    >
      <img
        src="/logo-vbweb.svg"
        alt="VBWEB"
        className="h-7 w-auto sm:h-8"
      />
    </Link>
  )
}
