import type { ChatMessage } from '../types';
import { FlightCard } from './FlightCard';
import { HotelCard } from './HotelCard';
import { PassengerSummaryCard } from './PassengerSummaryCard';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  message: ChatMessage;
  onSelect?: (choice: string) => void;
}

function formatContent(content: string) {
  if (!content) return null;
  return content.split('\n').map((line, i, arr) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const formatted = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
    return (
      <span key={i}>
        {formatted}
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
}

export function MessageBubble({ message, onSelect }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const hasCards = !!(message.flightOptions?.length || message.hotelOptions?.length || message.passengerSummary);

  return (
    <div className={`${styles.bubble} ${isUser ? styles.user : styles.assistant}`}>
      {!isUser && <div className={styles.avatar}><img src="/onfly-logo.jpg" alt="Onfly" style={{width:'100%',height:'100%',objectFit:'contain'}} /></div>}
      <div className={`${styles.content} ${isUser ? styles.userContent : styles.assistantContent}`} style={hasCards ? { maxWidth: '420px', width: '100%' } : undefined}>
        {message.content && (
          <div className={styles.text}>{formatContent(message.content)}</div>
        )}

        {message.flightOptions && message.flightOptions.length > 0 && (
          <div style={{ marginTop: message.content ? '12px' : '0' }}>
            {message.flightOptions.map((flight, i) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                index={i}
                onSelect={onSelect || (() => {})}
              />
            ))}
          </div>
        )}

        {message.hotelOptions && message.hotelOptions.length > 0 && (
          <div style={{ marginTop: message.content ? '12px' : '0' }}>
            {message.hotelOptions.map((hotel, i) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                index={i}
                onSelect={onSelect || (() => {})}
              />
            ))}
          </div>
        )}

        {message.passengerSummary && (
          <PassengerSummaryCard data={message.passengerSummary} />
        )}
      </div>
    </div>
  );
}
