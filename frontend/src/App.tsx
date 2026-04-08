import { useState, useRef, useEffect } from 'react';
import type { ChatMessage, TripState, SSEEvent } from './types';
import { sendMessage } from './api';
import { Header } from './components/Header';
import { MessageBubble } from './components/MessageBubble';
import { InputBar } from './components/InputBar';
import { ToolStatus } from './components/ToolStatus';
import styles from './App.module.css';

const WELCOME_MESSAGE: ChatMessage = {
  id: '0',
  role: 'assistant',
  content:
    'Olá! 👋 Sou o Travel Assistant da Onfly. Posso ajudar você a reservar voos e hotéis de forma rápida e simples.\n\nPara começar, me diga: **para onde você precisa viajar?**',
};

export function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(() =>
    localStorage.getItem('ta_session_id'),
  );
  const [trip, setTrip] = useState<TripState | null>(null);
  const [passUrl, setPassUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTool]);

  async function handleSend(text: string) {
    setIsLoading(true);
    setActiveTool(null);

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text };
    const assistantId = (Date.now() + 1).toString();

    setMessages(prev => [
      ...prev,
      userMsg,
      { id: assistantId, role: 'assistant', content: '' },
    ]);

    try {
      await sendMessage(text, sessionId, (event: SSEEvent) => {
        switch (event.type) {
          case 'session':
            if (event.sessionId) {
              setSessionId(event.sessionId);
              localStorage.setItem('ta_session_id', event.sessionId);
            }
            break;
          case 'text':
            setMessages(prev =>
              prev.map(m =>
                m.id === assistantId
                  ? { ...m, content: m.content + (event.content || '') }
                  : m,
              ),
            );
            break;
          case 'tool_start':
            setActiveTool(event.tool || null);
            break;
          case 'tool_end':
            setActiveTool(null);
            break;
          case 'pass_link':
            if (event.url) setPassUrl(event.url);
            break;
          case 'done':
            if (event.trip) setTrip(event.trip);
            break;
          case 'error':
            setMessages(prev =>
              prev.map(m =>
                m.id === assistantId
                  ? { ...m, content: `❌ Erro: ${event.message}` }
                  : m,
              ),
            );
            break;
        }
      });
    } catch {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: '❌ Desculpe, ocorreu um erro. Tente novamente.' }
            : m,
        ),
      );
    }

    setIsLoading(false);
    setActiveTool(null);
  }

  return (
    <div className={styles.container}>
      <Header trip={trip} />
      <main className={styles.messages}>
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <ToolStatus tool={activeTool} />
        {passUrl && (
          <a
            href={passUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              alignSelf: 'center', background: '#000', color: '#fff',
              borderRadius: '14px', padding: '14px 22px', textDecoration: 'none',
              fontWeight: 600, fontSize: '15px', margin: '8px 0',
              boxShadow: '0 4px 16px rgba(0,0,0,.25)',
            }}
          >
            🍎 Ver Boarding Pass
          </a>
        )}
        <div ref={messagesEndRef} />
      </main>
      <InputBar onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
