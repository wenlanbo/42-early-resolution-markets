import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Early Resolution Markets on 42'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#1c1520',
          backgroundImage:
            'radial-gradient(circle at 85% 15%, rgba(215, 69, 255, 0.22) 0%, transparent 55%), radial-gradient(circle at 10% 90%, rgba(123, 64, 129, 0.18) 0%, transparent 50%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '88px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 12,
              height: 12,
              borderRadius: 999,
              backgroundColor: '#0fb241',
              boxShadow: '0 0 18px rgba(15, 178, 65, 0.85)',
            }}
          />
          <div
            style={{
              display: 'flex',
              color: '#d745ff',
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            42.space · Live
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 104,
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.02,
          }}
        >
          <div style={{ display: 'flex', color: '#f9f9f9' }}>
            Early Resolution
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ color: '#f9f9f9' }}>Markets on</span>
            <span style={{ color: '#d745ff', marginLeft: 24 }}>42</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            color: '#a1a1aa',
            fontSize: 30,
            marginTop: 40,
            lineHeight: 1.3,
          }}
        >
          Multi-outcome prediction markets that can resolve before their end
          date
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'absolute',
            left: 88,
            right: 88,
            bottom: 64,
          }}
        >
          <div
            style={{
              display: 'flex',
              color: '#71717a',
              fontSize: 22,
              fontFamily: 'monospace',
            }}
          >
            rest.ft.42.space
          </div>
          <div
            style={{
              display: 'flex',
              color: '#a1a1aa',
              fontSize: 22,
              fontWeight: 500,
            }}
          >
            42.space
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
