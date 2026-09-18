import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      type = 'text',
      error,
      helperText,
      icon: Icon,
      iconRight: IconRight,
      className = '',
      id,
      name,
      required = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <div className="relative rounded-xl">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            required={required}
            className={`w-full rounded-xl border bg-white text-slate-900 text-sm transition duration-150 focus:outline-none focus:ring-2 ${
              Icon ? 'pl-10' : 'pl-3.5'
            } ${IconRight ? 'pr-10' : 'pr-3.5'} py-2.5 ${
              error
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
            } ${className}`}
            {...props}
          />
          {IconRight && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400">
              {typeof IconRight === 'function' ? <IconRight className="w-4 h-4" /> : IconRight}
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-xs text-rose-600">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
