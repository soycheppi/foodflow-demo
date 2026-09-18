import { useTheme as useNextTheme } from 'next-themes';

export function useTheme() {
  const { theme, resolvedTheme, setTheme } = useNextTheme();

  const currentTheme = (resolvedTheme || theme || 'light') as 'light' | 'dark';

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  return {
    theme: currentTheme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };
}
