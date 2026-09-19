import React from 'react';
import Tilt3D from '../common/Tilt3D';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  color = 'emerald',
}) => {
  const colorStyles = {
    emerald: {
      bg: 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white',
      shadow: 'shadow-[0_8px_20px_rgba(16,185,129,0.3)]',
      border: 'border-emerald-100',
    },
    blue: {
      bg: 'bg-gradient-to-br from-blue-500 to-indigo-700 text-white',
      shadow: 'shadow-[0_8px_20px_rgba(59,130,246,0.3)]',
      border: 'border-blue-100',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-500 to-violet-700 text-white',
      shadow: 'shadow-[0_8px_20px_rgba(168,85,247,0.3)]',
      border: 'border-purple-100',
    },
    amber: {
      bg: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white',
      shadow: 'shadow-[0_8px_20px_rgba(245,158,11,0.3)]',
      border: 'border-amber-100',
    },
  };

  const currentTheme = colorStyles[color] || colorStyles.emerald;

  return (
    <Tilt3D
      maxTilt={8}
      scale={1.02}
      glareOpacity={0.12}
      className="bg-white rounded-3xl border border-slate-100 p-6 shadow-3d hover:shadow-3d-hover transition-all duration-300 flex items-center justify-between"
    >
      <div style={{ transform: 'translateZ(15px)' }}>
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-1">
          {title}
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
        {subtitle && <p className="text-xs text-slate-500 font-medium mt-1">{subtitle}</p>}
      </div>

      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${currentTheme.bg} ${currentTheme.shadow} animate-float-3d`}
        style={{ transform: 'translateZ(25px)' }}
      >
        {Icon && <Icon className="w-7 h-7 stroke-[2.2]" />}
      </div>
    </Tilt3D>
  );
};

export default StatCard;
