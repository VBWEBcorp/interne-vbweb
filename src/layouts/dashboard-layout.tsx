import { Outlet } from 'react-router-dom'

import { DashboardNavbar } from '@/components/layout/dashboard-navbar'
import { ScrollToTop } from '@/components/scroll-to-top'

export function DashboardLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <ScrollToTop />
      <DashboardNavbar />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  )
}
