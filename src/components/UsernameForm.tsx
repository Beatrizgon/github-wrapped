// src/components/UsernameForm.tsx
import { useState } from 'react';
import './UsernameForm.css';

interface UsernameFormProps {
  placeholder: string;
  buttonText: string;
  onSubmit: (username: string) => void;
}

export function UsernameForm({
  placeholder,
  buttonText,
  onSubmit,
}: UsernameFormProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed) onSubmit(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="search-bar">
      <span className="material-symbols-rounded search-icon">search</span>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="search-btn" onClick={handleSubmit}>
        <span className="material-symbols-rounded filled">auto_awesome</span>
        {buttonText}
      </button>
    </div>
  );
}
