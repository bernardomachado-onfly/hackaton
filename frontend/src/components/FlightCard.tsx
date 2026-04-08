import type { FlightOption } from '../types';

interface FlightCardProps {
  flight: FlightOption;
  index: number;
  onSelect: (choice: string) => void;
}

export function FlightCard({ flight, index, onSelect }: FlightCardProps) {
  const airline = flight.airline as unknown as { name?: string; imageUrl?: string } | string;
  const airlineName = typeof airline === 'object' && airline !== null ? (airline.name ?? '') : String(airline ?? '');
  const airlineImg = typeof airline === 'object' && airline !== null ? airline.imageUrl : undefined;
  const stops = flight.stops ?? 0;
  const stopsLabel = stops === 0 ? 'Direto' : `${stops} parada${stops > 1 ? 's' : ''}`;
  const duration = flight.duration ?? 0;
  const durationLabel = duration > 0
    ? `${Math.floor(duration / 60)}h${duration % 60 > 0 ? `${duration % 60}m` : ''}`
    : '';
  const price = flight.price ?? 0;

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {airlineImg
            ? <img src={airlineImg} alt={airlineName} style={{ width: 28, height: 28, objectFit: 'contain' }} />
            : <span style={{ fontSize: '18px' }}>✈️</span>}
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#0e3a5f' }}>{airlineName}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Voo {String(flight.flightNumber ?? '')}{durationLabel ? ` · ${durationLabel}` : ''}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, fontSize: '16px', color: '#0e3a5f' }}>
            R$ {price.toFixed(2)}
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280' }}>por pessoa</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#374151' }}>
        <span style={{ fontWeight: 600 }}>{flight.origin ?? ''}</span>
        <span style={{ flex: 1, borderTop: '1px dashed #d1d5db' }} />
        <span style={{ fontSize: '11px', color: '#9ca3af', whiteSpace: 'nowrap' }}>{stopsLabel}</span>
        <span style={{ flex: 1, borderTop: '1px dashed #d1d5db' }} />
        <span style={{ fontWeight: 600 }}>{flight.destination ?? ''}</span>
      </div>

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
