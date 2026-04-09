import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google'
import './globals.css'

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'School Attendance',
  description: 'Track student attendance',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#07070f',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${display.variable} ${body.variable}`}>
      <body className="text-on-surface font-body antialiased" style={{ backgroundColor: '#07070f' }}>

        {/* ── Aurora background layer ───────────────────────────────────────── */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
          {/* Violet orb — top right */}
          <div style={{
            position: 'absolute',
            top: '-15%', right: '-8%',
            width: '500px', height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(124,58,237,0.55) 0%, transparent 70%)',
            filter: 'blur(90px)',
            animation: 'aurora-float-1 10s ease-in-out infinite',
          }} />
          {/* Cyan orb — bottom left */}
          <div style={{
            position: 'absolute',
            bottom: '-18%', left: '-8%',
            width: '420px', height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(6,182,212,0.35) 0%, transparent 70%)',
            filter: 'blur(90px)',
            animation: 'aurora-float-2 13s ease-in-out infinite',
          }} />
          {/* Rose orb — center right */}
          <div style={{
            position: 'absolute',
            top: '35%', right: '15%',
            width: '340px', height: '340px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(244,63,94,0.25) 0%, transparent 70%)',
            filter: 'blur(90px)',
            animation: 'aurora-float-3 9s ease-in-out infinite',
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
