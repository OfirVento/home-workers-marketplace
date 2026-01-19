import WhatsAppSimulator from '@/components/simulator/WhatsAppSimulator';

export default function SimulatorPage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#eee',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <h1 style={{ marginBottom: '1rem', color: '#333' }}>סימולטור יוני (Yoni)</h1>
            <p style={{ marginBottom: '2rem', color: '#666' }}>בדיקת פלואו שיחה מול לקוח קצה</p>
            <WhatsAppSimulator />
            <div style={{ marginTop: '2rem', color: '#888', fontSize: '0.9rem', maxWidth: '400px', textAlign: 'center' }}>
                * זהו סימולטור לפיתוח בלבד. האפליקציה האמיתית תרוץ על גבי WhatsApp API.
            </div>
        </div>
    );
}
