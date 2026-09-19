import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:translate-y-[2px] active:scale-[0.99] select-none';

  const variants = {
    primary:
      'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_4px_0_#047857,0_8px_16px_rgba(5,150,105,0.3)] hover:shadow-[0_6px_0_#047857,0_12px_20px_rgba(5,150,105,0.35)] active:shadow-[0_1px_0_#047857,0_4px_8px_rgba(5,150,105,0.2)] focus:ring-emerald-500 border-t border-emerald-400/40',
    secondary:
      'bg-slate-900 hover:bg-slate-800 text-white shadow-[0_4px_0_#0f172a,0_8px_16px_rgba(15,23,42,0.25)] hover:shadow-[0_6px_0_#0f172a,0_12px_20px_rgba(15,23,42,0.3)] active:shadow-[0_1px_0_#0f172a,0_4px_8px_rgba(15,23,42,0.2)] focus:ring-slate-700 border-t border-slate-700/50',
    amber:
      'bg-amber-500 hover:bg-amber-400 text-white shadow-[0_4px_0_#b45309,0_8px_16px_rgba(217,119,6,0.3)] hover:shadow-[0_6px_0_#b45309,0_12px_20px_rgba(217,119,6,0.35)] active:shadow-[0_1px_0_#b45309,0_4px_8px_rgba(217,119,6,0.2)] focus:ring-amber-500 border-t border-amber-300/50',
    outline:
      'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-[0_3px_0_#e2e8f0,0_4px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_5px_0_#cbd5e1,0_8px_14px_rgba(0,0,0,0.06)] active:shadow-[0_1px_0_#e2e8f0] focus:ring-slate-300',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-950 active:translate-y-0 focus:ring-slate-200',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_4px_0_#be123c,0_8px_16px_rgba(225,29,72,0.3)] hover:shadow-[0_6px_0_#be123c,0_12px_20px_rgba(225,29,72,0.35)] active:shadow-[0_1px_0_#be123c,0_4px_8px_rgba(225,29,72,0.2)] focus:ring-rose-500 border-t border-rose-400/40',
    success:
      'bg-teal-600 hover:bg-teal-500 text-white shadow-[0_4px_0_#0f766e,0_8px_16px_rgba(13,148,136,0.3)] hover:shadow-[0_6px_0_#0f766e,0_12px_20px_rgba(13,148,136,0.35)] active:shadow-[0_1px_0_#0f766e,0_4px_8px_rgba(13,148,136,0.2)] focus:ring-teal-500 border-t border-teal-400/40',
    light:
      'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 shadow-[0_3px_0_#a7f3d0,0_4px_8px_rgba(16,185,129,0.1)] active:shadow-[0_1px_0_#a7f3d0] border border-emerald-200/60 focus:ring-emerald-300',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-4.5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-bold',
    icon: 'p-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${
        sizes[size] || sizes.md
      } ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
};

export default Button;
