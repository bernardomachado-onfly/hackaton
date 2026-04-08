import type { PassengerSummaryData } from '../types';

interface PassengerSummaryCardProps {
  data: PassengerSummaryData;
}

export function PassengerSummaryCard({ data }: PassengerSummaryCardProps) {
  const fields: Array<{ label: string; value: string; icon: string }> = [
    { label: 'Nome', value: data.name, icon: '👤' },
    { label: 'E-mail', value: data.email, icon: '📧' },
    { label: 'CPF', value: data.cpf, icon: '🪪' },
    { label: 'Telefone', value: data.phone, icon: '📱' },
    { label: 'Nascimento', value: data.birthdate, icon: '🎂' },
    { label: 'Gênero', value: data.gender, icon: '🧑' },
  ];

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      padding: '16px',
      marginTop: '10px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
        paddingBottom: '10px',
        borderBottom: '1px solid #f0f4f8',
      }}>
        <span style={{ fontSize: '18px' }}>✅</span>
        <span style={{ fontWeight: 700, fontSize: '14px', color: '#0e3a5f' }}>Dados do Passageiro Confirmados</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {fields.map(({ label, value, icon }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {icon} {label}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
