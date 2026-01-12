import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-all ${
        isDark 
          ? 'bg-[var(--color-primary-dark)]/10 text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)]/20 border border-[var(--color-primary-dark)]' 
          : 'bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] hover:bg-[var(--color-primary-light)]/20 border border-[var(--color-primary-light)]'
      }`}
      aria-label="Toggle theme"
    >
      {isDark ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeToggle;