import React from 'react';

export const Input = ({
  label,
  error,
  icon: Icon,
  helperText,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold uppercase tracking-wider text-zinc-300"
        >
          {label}
        </label>
      )}

      <div className="relative rounded-2xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          className={`w-full rounded-2xl bg-zinc-900 border text-white placeholder-zinc-500 px-4 py-3 text-sm font-medium transition-all duration-200 focus:outline-none ${
            Icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-500'
              : 'border-zinc-800 focus:border-white focus:ring-1 focus:ring-white'
          } ${className}`}
          style={{ color: '#FFFFFF', backgroundColor: '#18181B' }}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-rose-400 mt-1 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-zinc-400 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
