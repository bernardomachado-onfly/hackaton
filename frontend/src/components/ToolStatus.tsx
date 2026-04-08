import styles from './ToolStatus.module.css';

const TOOL_LABELS: Record<string, string> = {
  search_flights: '✈️ Buscando voos...',
  search_hotels: '🏨 Buscando hotéis...',
  create_booking: '📋 Criando reserva...',
};

interface ToolStatusProps {
  tool: string | null;
}

export function ToolStatus({ tool }: ToolStatusProps) {
  if (!tool) return null;

  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      {TOOL_LABELS[tool] || `Executando ${tool}...`}
    </div>
  );
}
