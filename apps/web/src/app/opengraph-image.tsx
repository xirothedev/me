import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site-config';

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        background: '#14251d',
        color: '#f4efe4',
      }}
    >
      <div style={{ display: 'flex', fontSize: 72, letterSpacing: '-0.02em' }}>
        {siteConfig.handle}
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 24,
          width: 160,
          height: 1,
          background: '#3f5a4c',
        }}
      />
      <div
        style={{
          display: 'flex',
          marginTop: 32,
          fontSize: 32,
          color: '#b9c7bd',
        }}
      >
        {siteConfig.description}
      </div>
    </div>,
    size,
  );
}
