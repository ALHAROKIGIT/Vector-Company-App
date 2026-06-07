import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-surface-900 text-white hover:bg-surface-800 dark:bg-white dark:text-surface-900 dark:hover:bg-surface-200',
  outline:
    'border border-surface-300 dark:border-surface-700 text-surface-900 dark:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-800',
  ghost:
    'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800',
  danger:
    'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-medium
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98]
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
