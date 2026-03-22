import { createBrowserRouter } from 'react-router-dom'

import { DashboardLayout } from '@/layouts/dashboard-layout'
import { ContractsPage } from '@/pages/contracts-page'
import { ExpensesPage } from '@/pages/expenses-page'
import { NetworkPage } from '@/pages/network-page'
import { PipePage } from '@/pages/pipe-page'
import { StaffPage } from '@/pages/staff-page'
import { TodosPage } from '@/pages/todos-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <TodosPage /> },
      { path: 'contrats', element: <ContractsPage /> },
      { path: 'pipe', element: <PipePage /> },
      { path: 'reseau', element: <NetworkPage /> },
      { path: 'staff', element: <StaffPage /> },
      { path: 'depenses', element: <ExpensesPage /> },
    ],
  },
])
