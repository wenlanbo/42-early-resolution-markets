import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Early Resolution Markets on 42',
  description:
    'Browse 42.space prediction markets tagged for early resolution. Multi-outcome markets that can resolve before their end date.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-brand-base text-text-primary min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
