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
        <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0, backgroundColor: '#060e20' }}>
          {/* Indigo orb — top right */}
          <div className="absolute" style={{
            top: '-25%', right: '-12%',
            width: '900px', height: '900px',
            background: 'radial-gradient(circle, rgba(163,166,255,0.22) 0%, rgba(163,166,255,0.06) 45%, transparent 70%)',
          }} />
          {/* Mint orb — bottom left */}
          <div className="absolute" style={{
            bottom: '-22%', left: '-12%',
            width: '850px', height: '850px',
            background: 'radial-gradient(circle, rgba(105,246,184,0.14) 0%, rgba(105,246,184,0.04) 45%, transparent 70%)',
          }} />
          {/* Rose orb — bottom right */}
          <div className="absolute" style={{
            bottom: '-5%', right: '-8%',
            width: '650px', height: '650px',
            background: 'radial-gradient(circle, rgba(255,157,209,0.12) 0%, rgba(255,157,209,0.03) 45%, transparent 70%)',
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
