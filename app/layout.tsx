import type { Metadata, Viewport } from 'next'
import { Manrope, Inter } from 'next/font/google'
import './globals.css'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  title: 'Course Tracker',
  description: 'Track student attendance',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#060e20',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${manrope.variable} ${inter.variable}`}>
      <body className="bg-background text-on-surface font-body antialiased">
        {children}
      </body>
    </html>
  )
}
