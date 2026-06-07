import { Sun, Moon } from 'lucide-react';
import useStore from '../../store/useStore';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useStore();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl text-surface-600 dark:text-surface-400
        hover:bg-surface-100 dark:hover:bg-surface-800
        transition-all duration-300"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        <Moon
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
      </div>
    </button>
  );
}
