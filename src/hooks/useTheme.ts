// src/hooks/useTheme.ts
import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDark ? 'dark' : 'light'
    );
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return { isDark, toggleTheme };
}
