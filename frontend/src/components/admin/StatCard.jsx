import React from 'react';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  color = 'emerald',
}) => {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-xs flex items-center justify-between">
      <div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
          {title}
        </span>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>

      <div
        className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${
          colors[color] || colors.emerald
        }`}
      >
        {Icon && <Icon className="w-6 h-6" />}
      </div>
    </div>
  );
};

export default StatCard;
