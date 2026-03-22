import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ThemeToggleProps = {
  className?: string
}

function readInitialDark() {
  const stored = localStorage.getItem('mymag-theme')
  if (stored === 'dark') return true
  if (stored === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [dark, setDark] = useState(() => readInitialDark())

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('mymag-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn('rounded-full', className)}
      aria-label={dark ? 'Passer en thème clair' : 'Passer en thème sombre'}
      aria-pressed={dark}
      onClick={() => setDark((d) => !d)}
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}
