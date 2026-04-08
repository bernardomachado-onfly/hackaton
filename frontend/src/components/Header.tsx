import type { TripState } from '../types';
import styles from './Header.module.css';

interface HeaderProps {
  trip: TripState | null;
}

const STEPS = [
  { key: 'flight', label: '✈️ Voo' },
  { key: 'hotel', label: '🏨 Hotel' },
  { key: 'confirm', label: '✅ Confirmação' },
];

function getStepIndex(status?: string): number {
  if (!status || status === 'idle') return -1;
  if (status.includes('flight')) return 0;
  if (status.includes('hotel')) return 1;
  if (status === 'confirmed') return 2;
  return -1;
}

export function Header({ trip }: HeaderProps) {
  const currentStep = getStepIndex(trip?.status);

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.logo}>🤖</span>
        <span className={styles.title}>Travel Assistant</span>
        <span className={styles.badge}>by Onfly</span>
      </div>
      {trip && currentStep >= 0 && (
        <nav className={styles.stepper}>
          {STEPS.map((step, i) => (
            <span
              key={step.key}
              className={`${styles.step} ${i <= currentStep ? styles.active : ''} ${i === currentStep ? styles.current : ''}`}
            >
              {step.label}
            </span>
          ))}
        </nav>
      )}
    </header>
  );
}
