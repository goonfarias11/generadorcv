import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Generador de CV Profesional';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
              textAlign: 'center',
            }}
          >
            Generador de CV Profesional
          </h1>
          <p
            style={{
              fontSize: 36,
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0,
              textAlign: 'center',
            }}
          >
            Crea tu currículum perfecto en minutos
          </p>
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginTop: '40px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: 24,
                color: 'white',
              }}
            >
              ✨ 8 Plantillas Premium
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: 24,
                color: 'white',
              }}
            >
              🚀 Exportación PDF
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: 24,
                color: 'white',
              }}
            >
              🎯 Score Inteligente
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
