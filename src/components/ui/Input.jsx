import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, icon: Icon, className = '', ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        )}
        <input
          ref={ref}
          className={`
            w-full rounded-xl border border-surface-300 dark:border-surface-700
            bg-white dark:bg-surface-900
            text-surface-900 dark:text-surface-100
            placeholder:text-surface-400 dark:placeholder:text-surface-600
            focus:outline-none focus:ring-2 focus:ring-surface-900 dark:focus:ring-white
            focus:border-transparent
            transition-all duration-200
            ${Icon ? 'pl-10 pr-4' : 'px-4'} py-2.5 text-sm
            ${error ? 'border-red-500 dark:border-red-400 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

export default Input;
