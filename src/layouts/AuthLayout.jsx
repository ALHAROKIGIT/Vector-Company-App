import ThemeToggle from '../components/ui/ThemeToggle';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-surface-950 transition-colors duration-300">
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-surface-900 dark:bg-white flex items-center justify-center">
            <span className="text-white dark:text-surface-900 font-bold text-sm">V</span>
          </div>
          <span className="font-semibold text-surface-900 dark:text-white">Vector</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </main>

      <footer className="p-4 text-center text-xs text-surface-400 dark:text-surface-600">
        &copy; {new Date().getFullYear()} Vector Company. All rights reserved.
      </footer>
    </div>
  );
}
