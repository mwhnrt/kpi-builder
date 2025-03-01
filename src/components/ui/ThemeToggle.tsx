'use client';

import { useTheme } from '../providers/ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="fixed right-4 top-4 rounded-lg bg-gray-200 p-2 transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
