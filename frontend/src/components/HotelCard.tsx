import type { HotelOption } from '../types';

interface HotelCardProps {
  hotel: HotelOption;
  index: number;
  onSelect: (choice: string) => void;
}

export function HotelCard({ hotel, index, onSelect }: HotelCardProps) {
  const rating = hotel.rating ?? 0;
  const stars = '⭐'.repeat(Math.min(Math.max(Math.floor(rating), 0), 5));
  const amenities = Array.isArray(hotel.amenities) ? hotel.amenities.slice(0, 3) : [];
  const pricePerNight = hotel.pricePerNight ?? 0;
  const totalPrice = hotel.totalPrice ?? 0;

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      padding: '14px 16px',
      marginBottom: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🏨</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#0e3a5f' }}>{hotel.name ?? ''}</div>
            <div style={{ fontSize: '12px', color: '#f59e0b' }}>{stars || '—'}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '15px', color: '#0e3a5f' }}>
            R$ {pricePerNight.toFixed(2)}<span style={{ fontSize: '11px', fontWeight: 400, color: '#6b7280' }}>/noite</span>
          </div>
          <div style={{ fontSize: '12px', color: '#374151', fontWeight: 600 }}>
            Total: R$ {totalPrice.toFixed(2)}
          </div>
        </div>
      </div>

      {hotel.address && (
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          📍 {typeof hotel.address === 'object'
            ? ((hotel.address as unknown as { addressLine?: string; street?: string; district?: string }).addressLine
                || (hotel.address as unknown as { street?: string; district?: string }).street
                || '')
            : hotel.address}
        </div>
      )}

      {amenities.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {amenities.map((a, i) => (
            <span key={i} style={{
              background: '#f0f4f8', borderRadius: '6px',
              padding: '2px 8px', fontSize: '11px', color: '#374151',
            }}>
              {a}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => onSelect(String(index + 1))}
          style={{
            background: '#0e3a5f', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '6px 16px',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          }}
          onMouseOver={e => (e.currentTarget.style.background = '#1a5276')}
          onMouseOut={e => (e.currentTarget.style.background = '#0e3a5f')}
        >
          Selecionar
        </button>
      </div>
    </div>
  );
}
