import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import './globals.css'

const rubik = Rubik({ subsets: ['hebrew', 'latin'] })

export const metadata: Metadata = {
  title: 'Home Workers Marketplace',
  description: 'מצאו את בעלי המקצוע הטובים ביותר לבית שלכם.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={rubik.className}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '1rem 0' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em' }}>
                Home<span className="text-gradient">Workers</span>
              </div>
              <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <a href="#" style={{ fontWeight: 500, fontSize: '0.95rem' }}>חיפוש עבודה</a>
                <a href="#" style={{ fontWeight: 500, fontSize: '0.95rem' }}>הזמנת שירות</a>
                <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border)' }}></div>
                <a href="#" style={{ fontWeight: 500, fontSize: '0.95rem' }}>התחברות</a>
                <a href="#" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>הרשמה</a>
              </nav>
            </div>
          </header>

          <main style={{ flex: 1 }}>
            {children}
          </main>

          <footer style={{ borderTop: '1px solid var(--border)', padding: '4rem 0', marginTop: 'auto', backgroundColor: 'var(--surface)' }}>
            <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <p>&copy; {new Date().getFullYear()} Home Workers Marketplace. כל הזכויות שמורות.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
