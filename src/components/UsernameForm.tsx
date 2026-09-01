// src/components/UsernameForm.tsx
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
  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = (e.target as HTMLInputElement).value.trim();
      if (value) onSubmit(value);
    }
  };

  const handleClick = () => {
    const input = document.querySelector<HTMLInputElement>('.search-input');
    if (input && input.value.trim()) onSubmit(input.value.trim());
  };

  return (
    <div className="search-bar">
      <span className="material-symbols-rounded search-icon">search</span>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        onKeyDown={handleSubmit}
      />
      <button className="search-btn" onClick={handleClick}>
        {buttonText}
      </button>
    </div>
  );
}
