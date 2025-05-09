// hooks/useTailwind.ts
import { useTheme } from '@/context/ThemeContext';
import { twDark, twLight } from '@/twrnc';

export function useTailwind() {
  const { mode } = useTheme();
  return mode === 'dark' ? twDark : twLight;
}
