import { createBrowserRouter } from 'react-router-dom'

import { RootLayout } from '@/layouts/root-layout'
import { HomePage } from '@/pages/home-page'
import { AboutPage } from '@/pages/about-page'
import { ServicesPage } from '@/pages/services-page'
import { ContactPage } from '@/pages/contact-page'
import { LegalPage } from '@/pages/legal-page'
import { PrivacyPage } from '@/pages/privacy-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'a-propos', element: <AboutPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'mentions-legales', element: <LegalPage /> },
      { path: 'politique-de-confidentialite', element: <PrivacyPage /> },
    ],
  },
])
