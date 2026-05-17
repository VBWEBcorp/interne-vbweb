import { CreditCard, FileText, ListTodo, UserCircle, Users } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { ThemeToggle } from '@/components/theme/theme-toggle'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'To-do', icon: ListTodo },
  { to: '/contrats', label: 'Contrats', icon: FileText },
  { to: '/reseau', label: 'Partenaires', icon: Users },
  { to: '/staff', label: 'Staff', icon: UserCircle },
  { to: '/depenses', label: 'Dépenses', icon: CreditCard },
] as const

export function DashboardNavbar() {
  const { pathname } = useLocation()

  function isActive(to: string) {
    if (to === '/') return pathname === '/'
    return pathname.startsWith(to)
  }

  return (
    <>
      {/* Desktop top bar */}
      <header className="sticky top-0 z-50 hidden border-b border-border/50 bg-background/80 backdrop-blur-2xl md:block">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:px-8">
          <nav className="flex items-center gap-0.5" aria-label="Navigation principale">
            {links.map((l) => {
              const Icon = l.icon
              const active = isActive(l.to)
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    'relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                    active
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="size-3.5" />
                  {l.label}
                  {active && (
                    <span className="absolute inset-x-1.5 -bottom-[calc(0.875rem+1px)] h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              )
            })}
          </nav>

          <ThemeToggle />
        </div>
      </header>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-50 flex h-12 items-center justify-end border-b border-border/50 bg-background/80 px-4 backdrop-blur-2xl md:hidden">
        <ThemeToggle />
      </header>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border/50 bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl md:hidden"
        aria-label="Navigation"
      >
        <div className="flex h-14 items-stretch">
          {links.map((l) => {
            const Icon = l.icon
            const active = isActive(l.to)
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  'flex flex-1 flex-col items-center justify-center gap-0.5 text-[9px] font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground active:text-foreground'
                )}
              >
                <Icon className={cn('size-[18px] transition-transform', active && 'scale-110')} strokeWidth={active ? 2.5 : 2} />
                {l.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
