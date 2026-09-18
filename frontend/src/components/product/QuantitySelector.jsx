import React from 'react';
import { Plus, Minus } from 'lucide-react';

export const QuantitySelector = ({
  quantity = 1,
  onIncrement,
  onDecrement,
  max = 99,
  min = 1,
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const sizes = {
    sm: 'h-7 px-2 text-xs',
    md: 'h-9 px-2.5 text-sm',
    lg: 'h-11 px-3 text-base font-semibold',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <div
      className={`inline-flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl font-bold shadow-xs select-none ${
        sizes[size] || sizes.md
      } ${className}`}
    >
      <button
        type="button"
        disabled={disabled || quantity <= min}
        onClick={(e) => {
          e.stopPropagation();
          onDecrement();
        }}
        className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-200/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Minus className={iconSizes[size] || iconSizes.md} />
      </button>

      <span className="px-2 text-center min-w-[24px]">{quantity}</span>

      <button
        type="button"
        disabled={disabled || quantity >= max}
        onClick={(e) => {
          e.stopPropagation();
          onIncrement();
        }}
        className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-200/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Plus className={iconSizes[size] || iconSizes.md} />
      </button>
    </div>
  );
};

export default QuantitySelector;
