import { useState, useRef, type FormEvent } from 'react';
import styles from './InputBar.module.css';

interface InputBarProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function InputBar({ onSend, disabled }: InputBarProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');
    inputRef.current?.focus();
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Digite sua mensagem..."
        className={styles.input}
        disabled={disabled}
        autoFocus
      />
      <button type="submit" className={styles.button} disabled={disabled || !input.trim()}>
        ➤
      </button>
    </form>
  );
}
