import type { SSEEvent } from './types';

const API_URL = import.meta.env.VITE_API_URL || '';

export async function sendMessage(
  message: string,
  sessionId: string | null,
  onEvent: (event: SSEEvent) => void,
): Promise<void> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  if (!response.body) {
    throw new Error('No response body');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      try {
        const data: SSEEvent = JSON.parse(line.slice(6));
        onEvent(data);
      } catch {
        // skip malformed chunks
      }
    }
  }
}
