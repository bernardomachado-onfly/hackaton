import type { ChatMessage } from '../types';
import { FlightCard } from './FlightCard';
import { HotelCard } from './HotelCard';
import { PassengerSummaryCard } from './PassengerSummaryCard';
import { BookingConfirmationCard } from './BookingConfirmationCard';
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

function introText(content: string): string {
  // Keep only lines before the numbered list or ## heading
  const lines = content.split('\n');
  const cutoff = lines.findIndex(l => /^(\d+\.|##)/.test(l.trim()));
  return (cutoff > 0 ? lines.slice(0, cutoff) : lines).join('\n').trim();
}

export function MessageBubble({ message, onSelect }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const hasCards = !!(message.flightOptions?.length || message.hotelOptions?.length || message.passengerSummary || message.bookingConfirmed);

  // When cards exist, only show the intro sentence (before the list)
  const displayContent = hasCards ? introText(message.content) : message.content;

  // Limit cards to 4 options max
  const flights = message.flightOptions?.slice(0, 4);
  const hotels = message.hotelOptions?.slice(0, 4);

  return (
    <div className={`${styles.bubble} ${isUser ? styles.user : styles.assistant}`}>
      {!isUser && <div className={styles.avatar}><img src="/onfly-logo.jpg" alt="Onfly" style={{width:'100%',height:'100%',objectFit:'contain'}} /></div>}
      <div className={`${styles.content} ${isUser ? styles.userContent : styles.assistantContent}`} style={hasCards ? { maxWidth: '420px', width: '100%' } : undefined}>
        {displayContent && (
          <div className={styles.text}>{formatContent(displayContent)}</div>
        )}

        {flights && flights.length > 0 && (
          <div style={{ marginTop: displayContent ? '12px' : '0' }}>
            {flights.map((flight, i) => {
              try {
                return <FlightCard key={flight.id ?? i} flight={flight} index={i} onSelect={onSelect || (() => {})} />;
              } catch {
                return null;
              }
            })}
          </div>
        )}

        {hotels && hotels.length > 0 && (
          <div style={{ marginTop: displayContent ? '12px' : '0' }}>
            {hotels.map((hotel, i) => {
              try {
                return <HotelCard key={hotel.id ?? i} hotel={hotel} index={i} onSelect={onSelect || (() => {})} />;
              } catch {
                return null;
              }
            })}
          </div>
        )}

        {message.bookingConfirmed && (
          <BookingConfirmationCard data={message.bookingConfirmed} />
        )}

        {message.passengerSummary && (
          <PassengerSummaryCard data={message.passengerSummary} />
        )}
      </div>
    </div>
  );
}
