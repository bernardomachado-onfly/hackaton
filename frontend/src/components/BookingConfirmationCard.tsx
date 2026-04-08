import type { BookingConfirmedData } from '../types';

export function BookingConfirmationCard({ data }: { data: BookingConfirmedData }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0e3a5f 0%, #1a5276 100%)',
      borderRadius: '16px',
      padding: '20px',
      color: '#fff',
      marginTop: '10px',
      boxShadow: '0 4px 16px rgba(14,58,95,0.3)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '24px' }}>🎉</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '16px' }}>Reserva Confirmada!</div>
          <div style={{ fontSize: '12px', opacity: 0.75, letterSpacing: '0.05em' }}>
            Código: <strong style={{ letterSpacing: '0.1em' }}>{data.bookingCode}</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {data.flight && (
          <div style={{
            background: 'rgba(255,255,255,0.12)',
            borderRadius: '10px',
            padding: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✈️</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>{data.flight.airline} {data.flight.flightNumber}</div>
                <div style={{ fontSize: '11px', opacity: 0.75 }}>{data.flight.origin} → {data.flight.destination} · {data.flight.date}</div>
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: '14px' }}>R$ {data.flight.price.toFixed(2)}</div>
          </div>
        )}

        {data.hotel && (
          <div style={{
            background: 'rgba(255,255,255,0.12)',
            borderRadius: '10px',
            padding: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏨</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>{data.hotel.name}</div>
                <div style={{ fontSize: '11px', opacity: 0.75 }}>{data.hotel.checkin} → {data.hotel.checkout} · {data.hotel.nights} noite{data.hotel.nights !== 1 ? 's' : ''}</div>
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: '14px' }}>R$ {data.hotel.price.toFixed(2)}</div>
          </div>
        )}

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.2)',
          paddingTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '13px', opacity: 0.8 }}>Total da viagem</span>
          <span style={{ fontWeight: 800, fontSize: '18px' }}>R$ {data.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
