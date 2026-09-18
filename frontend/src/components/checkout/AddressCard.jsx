import React from 'react';
import { MapPin, Phone, Check, Trash2 } from 'lucide-react';

export const AddressCard = ({
  address,
  isSelected = false,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      onClick={() => onSelect && onSelect(address)}
      className={`relative rounded-2xl p-4 border transition-all duration-200 cursor-pointer text-left ${
        isSelected
          ? 'border-emerald-600 bg-emerald-50/40 shadow-sm ring-2 ring-emerald-500/20'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 text-sm">{address.fullName}</span>
          {address.isDefault && (
            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
              Default
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {isSelected && (
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(address._id);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete Address"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
        {address.addressLine}, {address.city}, {address.state} - {address.postalCode}
      </p>

      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-2 pt-2 border-t border-slate-100/80">
        <Phone className="w-3.5 h-3.5 text-slate-400" />
        <span>{address.phone}</span>
      </div>
    </div>
  );
};

export default AddressCard;
