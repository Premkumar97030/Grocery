import { useEffect, useState } from 'react';
import { CheckCircle2, CircleAlert, LoaderCircle, ShoppingBasket } from 'lucide-react';
import { getHealth } from '../../services/healthService';
import { useApp } from '../../context/AppContext';
import PageContainer from '../../components/layout/PageContainer';

export default function HomePage() {
  const { apiStatus, setApiStatus } = useApp(); const [health, setHealth] = useState(null);
  useEffect(() => { let active = true; getHealth().then((response) => { if (active) { setHealth(response); setApiStatus('connected'); } }).catch(() => active && setApiStatus('unavailable')); return () => { active = false; }; }, [setApiStatus]);
  const connected = apiStatus === 'connected';
  return <PageContainer><section className="w-full rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-12"><div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"><ShoppingBasket size={30} /></div><p className="mb-2 text-sm font-semibold uppercase tracking-[.2em] text-emerald-600">FreshCart</p><h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">Grocery delivery, built on a reliable foundation.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">The customer experience is next. This milestone verifies the React frontend can communicate with the Express API.</p><div className={`mt-9 flex items-start gap-4 rounded-2xl border p-5 ${connected ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>{apiStatus === 'checking' ? <LoaderCircle className="mt-0.5 animate-spin" /> : connected ? <CheckCircle2 className="mt-0.5 text-emerald-600" /> : <CircleAlert className="mt-0.5 text-amber-600" />}<div><p className="font-semibold">{apiStatus === 'checking' ? 'Checking API connection…' : connected ? 'API connected' : 'API unavailable'}</p><p className="mt-1 text-sm text-slate-600">{health?.message || 'Start the backend on port 5000, then refresh this page.'}</p>{health?.data?.database && <p className="mt-1 text-sm text-slate-600">MongoDB: {health.data.database}</p>}</div></div></section></PageContainer>;
}
