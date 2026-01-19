
export default function Home() {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{
        padding: '8rem 0 6rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at top left, hsla(var(--primary-h), var(--primary-s), 95%, 0.5), transparent 40%), radial-gradient(circle at bottom right, hsla(var(--secondary-h), var(--secondary-s), 95%, 0.5), transparent 40%)'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ marginBottom: '1.5rem', display: 'inline-block', padding: '0.5rem 1rem', borderRadius: 'var(--radius-pill)', background: 'hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.1)', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>
            ✨ המקום המוביל לשירותי בית
          </div>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
            מצאו את העזרה המושלמת <span className="text-gradient">לפרויקטים בבית</span>.
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: '1.6' }}>
            חברו למקצוענים מאומתים לניקיון, תיקונים, גינון ועוד.
            בשימוש אלפי בעלי בתים מרוצים.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="/simulator" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem', textDecoration: 'none' }}>
              נסה את הסימולטור של יוני 💬
            </a>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container" style={{ marginTop: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem' }}>שירותים פופולריים</h2>
            <p style={{ color: 'var(--text-muted)' }}>גלו את הקטגוריות המבוקשות ביותר</p>
          </div>
          <a href="#" style={{ color: 'var(--primary)', fontWeight: '600' }}>לכל הקטגוריות ←</a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
          {[
            { name: 'ניקיון בית', icon: '🧹', price: 60 },
            { name: 'אינסטלציה', icon: '🔧', price: 250 },
            { name: 'חשמל', icon: '⚡', price: 200 },
            { name: 'גינון', icon: '🌿', price: 100 },
            { name: 'הובלות', icon: '📦', price: 150 },
            { name: 'צביעה', icon: '🎨', price: 120 }
          ].map((cat, i) => (
            <div key={i} className="card" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: `hsl(${220 + (i * 30)}, 70%, 95%)`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                {cat.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{cat.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  החל מ- <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>₪{cat.price}/שעה</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="container" style={{ marginTop: '6rem' }}>
        <div className="card glass" style={{ padding: '4rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--surface), white)' }}>
          <h2 style={{ marginBottom: '1rem' }}>למה לבחור בנו?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4rem', marginTop: '3rem' }}>
            {[
              { title: 'מקצוענים מאומתים', desc: 'כל עובד עובר בדיקת רקע קפדנית.' },
              { title: 'תשלום מאובטח', desc: 'שלמו רק כשאתם מרוצים מהעבודה.' },
              { title: 'כיסוי ביטוחי', desc: 'כל עבודה מבוטחת עד 1,000,000 ₪.' }
            ].map((feature, i) => (
              <div key={i}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
