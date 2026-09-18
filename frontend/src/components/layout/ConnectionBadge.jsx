import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export const ConnectionBadge = () => {
  const { apiHealth, checkHealth } = useApp();

  const isOnline = apiHealth.status === 'online';
  const isChecking = apiHealth.status === 'checking';

  return (
    <div
      title={apiHealth.message}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
        isOnline
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : isChecking
          ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-rose-50 text-rose-700 border-rose-200'
      }`}
    >
      <span className="relative flex h-2 w-2">
        {isOnline && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isOnline ? 'bg-emerald-500' : isChecking ? 'bg-amber-500' : 'bg-rose-500'
          }`}
        ></span>
      </span>
      <span className="hidden sm:inline">
        {isOnline ? 'API Connected' : isChecking ? 'Connecting...' : 'API Offline'}
      </span>
      <button
        onClick={checkHealth}
        className="text-slate-400 hover:text-slate-600 ml-0.5"
        title="Refresh backend status"
      >
        <RefreshCw className="w-3 h-3" />
      </button>
    </div>
  );
};

export default ConnectionBadge;
