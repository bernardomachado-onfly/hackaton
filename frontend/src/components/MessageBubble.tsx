import type { ChatMessage } from '../types';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  message: ChatMessage;
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

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`${styles.bubble} ${isUser ? styles.user : styles.assistant}`}>
      {!isUser && <div className={styles.avatar}><img src="/onfly-logo.jpg" alt="Onfly" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} /></div>}
      <div className={`${styles.content} ${isUser ? styles.userContent : styles.assistantContent}`}>
        <div className={styles.text}>{formatContent(message.content)}</div>
      </div>
    </div>
  );
}
