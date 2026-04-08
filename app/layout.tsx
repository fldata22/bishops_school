import type { Metadata, Viewport } from 'next'
import { Manrope, Inter } from 'next/font/google'
import './globals.css'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  title: 'School Attendance',
  description: 'Track student attendance',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#060e20',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${manrope.variable} ${inter.variable}`}>
      <body className="text-on-surface font-body antialiased">

        {/* ── Ambient background layer ─────────────────────────────────────── */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0, backgroundColor: '#080e1e' }}>
          {/* Blue orb — top right */}
          <div className="absolute" style={{
            top: '-25%', right: '-12%',
            width: '900px', height: '900px',
            background: 'radial-gradient(circle, rgba(96,165,250,0.20) 0%, rgba(96,165,250,0.05) 45%, transparent 70%)',
          }} />
          {/* Emerald orb — bottom left */}
          <div className="absolute" style={{
            bottom: '-22%', left: '-12%',
            width: '850px', height: '850px',
            background: 'radial-gradient(circle, rgba(52,211,153,0.14) 0%, rgba(52,211,153,0.04) 45%, transparent 70%)',
          }} />
          {/* Rose orb — bottom right */}
          <div className="absolute" style={{
            bottom: '-5%', right: '-8%',
            width: '650px', height: '650px',
            background: 'radial-gradient(circle, rgba(251,113,133,0.12) 0%, rgba(251,113,133,0.03) 45%, transparent 70%)',
          }} />
        </div>

        {/* ── App content ──────────────────────────────────────────────────── */}
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>

      </body>
    </html>
  )
}
